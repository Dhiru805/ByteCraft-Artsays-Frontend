const { createProxyMiddleware } = require("http-proxy-middleware");
const http = require("http");

const BACKEND_PORT = 3001;
const CRA_PORT = 3000;

/** Simple HTTP GET returning text */
function httpGet(hostname, port, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname, port, path, method: "GET", headers, timeout: 8000 },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} from ${hostname}:${port}${path}`));
        }
        res.setEncoding("utf8");
        let data = "";
        res.on("data", (c) => { data += c; });
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
    req.end();
  });
}

/** Inject meta JSON into CRA HTML by replacing __META_*__ placeholders */
function injectMeta(html, meta) {
  function esc(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  return html
    .replace(/__META_TITLE__/g, esc(meta.title))
    .replace(/__META_DESCRIPTION__/g, esc(meta.description))
    .replace(/__META_KEYWORDS__/g, esc(meta.keywords))
    .replace(/__META_OG_TITLE__/g, esc(meta.title))
    .replace(/__META_OG_DESCRIPTION__/g, esc(meta.description))
    .replace(/__META_OG_IMAGE__/g, esc(meta.image))
    .replace(/__META_OG_URL__/g, esc(meta.url))
    .replace(/__META_TWITTER_TITLE__/g, esc(meta.title))
    .replace(/__META_TWITTER_DESCRIPTION__/g, esc(meta.description))
    .replace(/__META_TWITTER_IMAGE__/g, esc(meta.image))
    .replace(/__META_CANONICAL__/g, esc(meta.url))
    .replace(/__META_SCHEMA__/g,
      meta.schema ? `<script type="application/ld+json">${meta.schema}</script>` : ""
    );
}

module.exports = function (app) {
  const target = process.env.REACT_APP_API_URL || "http://localhost:3001";

  // ── API proxy ──────────────────────────────────────────────────────────────
  app.use(
    "/api",
    createProxyMiddleware({ target, changeOrigin: true, logLevel: "silent" })
  );

  // ── Static backend files ───────────────────────────────────────────────────
  app.use(
    ["/sitemap.xml", "/robots.txt", "/uploads"],
    createProxyMiddleware({ target, changeOrigin: true, logLevel: "silent" })
  );

  // ── HTML prerender middleware — meta tag injection ─────────────────────────
  //
  // Strategy (avoids the CRA ↔ backend fetch loop):
  //   1. Let CRA webpack-dev-server serve the raw HTML (it has the correct
  //      <script defer src="/static/js/bundle.js"> already injected).
  //      We get it by calling next() and capturing the response — but that's
  //      complex with Express. Instead we fetch it directly from CRA (port 3000)
  //      with X-Prerender-Bypass so setupProxy skips itself for that sub-request.
  //   2. Separately fetch ONLY the meta JSON from the backend
  //      GET /api/prerender/meta?path=<url> — no HTML fetch loop.
  //   3. Inject meta into the CRA HTML and send.
  //
  // ── ────────────────────────────────────────────────────────────────────────
  app.use(async (req, res, next) => {
    // Only GET browser navigation requests
    if (req.method !== "GET") return next();
    // Skip internal requests (loop guard)
    if (req.headers["x-prerender-bypass"] || req.headers["x-prerender-internal"]) return next();

    const p = req.path;
    // Skip non-HTML assets
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
      // Step 1: fetch raw CRA HTML (webpack-injected bundle tags included)
      const craHtml = await httpGet("localhost", CRA_PORT, req.url, {
        "Accept": "text/html",
        "X-Prerender-Bypass": "1",        // tells setupProxy to skip itself
        ...(req.headers.cookie ? { cookie: req.headers.cookie } : {}),
      });

      // Step 2: fetch meta JSON from backend (no HTML involved — no loop)
      let meta = null;
      try {
        const metaRaw = await httpGet(
          "localhost",
          BACKEND_PORT,
          `/api/prerender/meta?path=${encodeURIComponent(req.url)}`,
          { "Accept": "application/json" }
        );
        meta = JSON.parse(metaRaw);
      } catch (metaErr) {
        console.warn("[setupProxy] meta fetch failed:", metaErr.message, "— using raw CRA HTML");
      }

      // Step 3: inject (or serve raw if meta fetch failed)
      const html = meta ? injectMeta(craHtml, meta) : craHtml;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch (err) {
      console.warn("[setupProxy] prerender failed:", err.message, "- falling through to CRA");
      next();
    }
  });
};
