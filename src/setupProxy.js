const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const target = process.env.REACT_APP_API_URL || "http://localhost:3001";

  // ─────────────────────────────────────────
  // API proxy
  // ─────────────────────────────────────────
  app.use(
    "/api",
    createProxyMiddleware({
      target,
      changeOrigin: true,
      logLevel: "silent",
    })
  );

  // ─────────────────────────────────────────
  // Static backend files
  // ─────────────────────────────────────────
  app.use(
    ["/sitemap.xml", "/robots.txt", "/uploads"],
    createProxyMiddleware({
      target,
      changeOrigin: true,
      logLevel: "silent",
    })
  );

  // ─────────────────────────────────────────
  // Prerender proxy — bots AND humans
  // Proxies all HTML page requests to the backend (port 3001) so that
  // View Page Source shows real meta tags on localhost:3000 too.
  // ─────────────────────────────────────────
  app.use(
    createProxyMiddleware(
      (pathname, req) => {
        // ❌ Never proxy non-GET
        if (req.method !== "GET") return false;

        // ❌ Never proxy assets / dev internals
        if (
          pathname.startsWith("/static/") ||
          pathname.startsWith("/sockjs-node") ||
          pathname.startsWith("/__webpack") ||
          pathname.startsWith("/DashboardAssets") ||
          pathname.startsWith("/css") ||
          pathname.startsWith("/fonts") ||
          pathname.startsWith("/uploads")
        ) {
          return false;
        }

        // ❌ Loop protection
        if (req.headers["x-prerender-request"]) return false;

        // ✅ Only HTML document requests
        const accept = req.headers["accept"] || "";
        if (!accept.includes("text/html")) return false;

        return true; // ✅ proxy to backend prerender
      },
      {
        target,
        changeOrigin: true,
        logLevel: "silent",
        onProxyReq(proxyReq) {
          proxyReq.setHeader("x-prerender-request", "1");
        },
      }
    )
  );
};