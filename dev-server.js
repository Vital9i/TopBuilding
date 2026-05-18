const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const PORT = 5500;
const clients = new Set();

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
};

const LIVE_RELOAD_SNIPPET =
    '<script>(function(){var es=new EventSource("/__livereload");es.onmessage=function(){location.reload()};})();</script>';

function broadcastReload() {
    for (const res of clients) {
        try {
            res.write('data: reload\n\n');
        } catch (_) {
            clients.delete(res);
        }
    }
}

let reloadTimer;
function scheduleReload() {
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(broadcastReload, 120);
}

fs.watch(ROOT, { recursive: true }, (_event, filename) => {
    if (!filename || filename === 'dev-server.js') return;
    if (/\.(html?|css|js|webp|png|jpe?g|svg)$/i.test(filename)) scheduleReload();
});

function sendFile(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Not found');
            return;
        }
        let body = data;
        if (ext === '.html' || ext === '.htm') {
            const html = data.toString('utf8');
            if (!html.includes('/__livereload')) {
                body = Buffer.from(
                    html.includes('</body>')
                        ? html.replace('</body>', LIVE_RELOAD_SNIPPET + '</body>')
                        : html + LIVE_RELOAD_SNIPPET
                );
            }
        }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(body);
    });
}

http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

    if (urlPath === '/__livereload') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        });
        clients.add(res);
        req.on('close', () => clients.delete(res));
        return;
    }

    let filePath = path.resolve(
        ROOT,
        urlPath === '/' ? 'calculator-temp.html' : urlPath.replace(/^\//, '')
    );
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    const relative = path.relative(ROOT, filePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    sendFile(res, filePath);
}).listen(PORT, '127.0.0.1', () => {
    const url = `http://127.0.0.1:${PORT}/calculator-temp.html`;
    console.log(`Serving "${ROOT}"`);
    console.log(`Ready at ${url}`);
});
