const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const target = process.env.REACT_APP_API_URL || "http://localhost:3001";

  app.use(
    ["/sitemap.xml", "/robots.txt"],
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};
