const { createProxyMiddleware } = require("http-proxy-middleware");
const http = require("http");

/**
 * Fetch meta-injected HTML from the backend prerender router.
 * The backend fetches CRA's raw HTML internally and injects DB-backed meta tags.
 */
function fetchInjectedHtml(path, reqHeaders) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3001,
      path: path || "/",
      method: "GET",
      headers: {
        accept: "text/html",
        ...(reqHeaders.cookie ? { cookie: reqHeaders.cookie } : {}),
      },
      timeout: 8000,
    };

    const req = http.request(options, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error("Backend prerender returned " + res.statusCode));
      }
      res.setEncoding("utf8");
      let data = "";
      res.on("data", chunk => { data += chunk; });
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Prerender timeout")); });
    req.end();
  });
}

module.exports = function (app) {
  const target = process.env.REACT_APP_API_URL || "http://localhost:3001";

  // ─────────────────────────────────────────
  // API proxy
  // ─────────────────────────────────────────
  app.use(
    "/api",
    createProxyMiddleware({ target, changeOrigin: true, logLevel: "silent" })
  );

  // ─────────────────────────────────────────
  // Static backend files
  // ─────────────────────────────────────────
  app.use(
    ["/sitemap.xml", "/robots.txt", "/uploads"],
    createProxyMiddleware({ target, changeOrigin: true, logLevel: "silent" })
  );

  // ─────────────────────────────────────────
  // HTML prerender middleware — meta tag injection
  //
  // For browser HTML navigation requests (Accept: text/html), call the backend
  // prerender router directly. The backend fetches CRA's raw HTML internally,
  // injects DB-backed meta tags, and returns the fully-formed HTML.
  //
  // This middleware runs in the Express layer BEFORE webpack-dev-server's own
  // middleware, so it intercepts navigation requests before CRA serves them.
  //
  // Loop prevention: when the backend internally fetches CRA HTML, it sends
  // X-Prerender-Bypass: 1 — our filter skips those requests.
  // ─────────────────────────────────────────
  app.use(async (req, res, next) => {
    // Only handle GET browser navigation requests
    if (req.method !== "GET") return next();
    // Skip internal backend fetches (loop guard)
    if (req.headers["x-prerender-bypass"] || req.headers["x-prerender-internal"]) return next();
    // Skip assets
    const p = req.path;
    if (
      p.startsWith("/api") ||
      p.startsWith("/uploads") ||
      p.startsWith("/static") ||
      p.startsWith("/sockjs-node") ||
      p.startsWith("/ws") ||
      p.startsWith("/__webpack") ||
      p.match(/\.(js|css|map|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp|mp4|webm)$/)
    ) {
      return next();
    }
    // Only intercept HTML navigation requests
    const accept = req.headers["accept"] || "";
    if (!accept.includes("text/html")) return next();

    try {
      const html = await fetchInjectedHtml(req.url, req.headers);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch (err) {
      console.warn("[setupProxy] prerender failed:", err.message, "- falling through to CRA");
      next();
    }
  });
};
