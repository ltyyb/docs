import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { withBasePath } from '../site.config.mjs';
import { legacyRoutes } from './legacy-routes.mjs';

for (const [from, to] of Object.entries(legacyRoutes)) {
  const target = withBasePath(to);
  const file = resolve('out', from);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<meta name="robots" content="noindex"><title>页面已移动</title>' +
    '<link rel="canonical" href="' + target + '">' +
    '<meta http-equiv="refresh" content="0;url=' + target + '">' +
    '<script>location.replace(' + JSON.stringify(target) + ' + location.search + location.hash)</script>' +
    '</head><body><p>页面已移动至 <a href="' + target + '">新版社群手册</a>。</p></body></html>');
}

await writeFile('out/.nojekyll', '');
console.log('已生成旧链接兼容页与 .nojekyll。');
