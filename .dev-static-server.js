/* Локальный статический сервер для предпросмотра (npm/live-server отсутствует в PATH). */
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname);
const port = Number(process.env.PORT) || 5500;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
};

function send(res, status, body, ctype) {
  res.writeHead(status, { "Content-Type": ctype || "text/plain; charset=utf-8" });
  res.end(body);
}

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";
    urlPath = urlPath.replace(/^\/+/, "");
    const filePath = path.join(root, urlPath);
    const realRoot = root + path.sep;
    if (!path.resolve(filePath).startsWith(realRoot) && path.resolve(filePath) !== root) {
      return send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    }
    fs.readFile(filePath, (err, buf) => {
      if (err) return send(res, 404, "Not found", "text/plain; charset=utf-8");
      const ext = path.extname(filePath).toLowerCase();
      send(res, 200, buf, MIME[ext] || "application/octet-stream");
    });
  } catch (e) {
    send(res, 500, String(e.message), "text/plain; charset=utf-8");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${root}`);
  console.log(`http://127.0.0.1:${port}/`);
});
