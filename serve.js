// Minimal static file server for local testing — no dependencies.
// Run: node serve.js
// Then open: http://localhost:8080

const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = 8080;
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.pdf': 'application/pdf' };

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.join(root, urlPath === '/' ? 'index.html' : urlPath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'text/plain' });
    res.end(data);
  });
}).listen(port, () => console.log(`http://localhost:${port}`));
