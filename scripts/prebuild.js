/**
 * prebuild.js
 *
 * Runs before `react-scripts build`.
 * Sets REACT_APP_BUILD_TIME to the current Unix timestamp in .env.production.
 *
 * This value is embedded by CRA into public/index.html at build time,
 * turning every non-hashed static file URL into a versioned URL like:
 *   /css/fontawesome.css?v=1714326400000
 *
 * Because the URL changes on every deploy, browsers always treat it as a
 * new resource and fetch fresh content — no manual cache clearing needed.
 */

const fs = require("fs");
const path = require("path");

const buildTime = Date.now().toString();
const envFile = path.resolve(__dirname, "../.env.production");

let content = "";
try {
  content = fs.readFileSync(envFile, "utf-8");
} catch (_) {
  // .env.production does not exist yet — will create it
}

if (content.includes("REACT_APP_BUILD_TIME=")) {
  content = content.replace(/REACT_APP_BUILD_TIME=.*/g, `REACT_APP_BUILD_TIME=${buildTime}`);
} else {
  content = content.trimEnd() + `\nREACT_APP_BUILD_TIME=${buildTime}\n`;
}

fs.writeFileSync(envFile, content);
console.log(`[prebuild] REACT_APP_BUILD_TIME=${buildTime}`);
