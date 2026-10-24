import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { basePath } from '../site.config.mjs';

const root = resolve('out');
const port = Number(process.env.PORT ?? 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

await stat(root);
createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const path = decodeURIComponent(url.pathname);
    if (basePath && path === basePath) {
      res.writeHead(301, { Location: basePath + '/' + url.search }).end();
      return;
    }
    if (!path.startsWith(basePath + '/')) throw new Error('not found');
    let file = resolve(root, '.' + path.slice(basePath.length));
    if (file !== root && !file.startsWith(root + sep)) throw new Error('not found');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    const body = await readFile(resolve(root, '404.html')).catch(() => 'Not found');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(req.method === 'HEAD' ? undefined : body);
  }
}).listen(port, '127.0.0.1', () => {
  console.log('静态预览：http://localhost:' + port + basePath + '/');
});
