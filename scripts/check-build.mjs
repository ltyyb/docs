import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { posix } from 'node:path';
import { staticClient } from 'fumadocs-core/search/client/orama-static';
import { basePath, withBasePath } from '../site.config.mjs';
import { legacyRoutes } from './legacy-routes.mjs';

async function walk(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) files.push(...await walk(directory + '/' + entry.name, relative + '/'));
    else files.push(relative);
  }
  return files;
}

const files = new Set(await walk('out'));
const sourceFiles = await walk('docs');
const pages = ['', 'get-started/', 'basic/management/', 'basic/verify/', 'basic/verify-foreign/'];
for (const page of pages) assert(files.has(page + 'index.html'), '缺少页面：' + page);
assert(files.has('.nojekyll'));
assert(files.has('hero.webp'));
assert(files.has('search-index.json'));

const htmlFiles = [...files].filter((file) => file.endsWith('.html'));
const html = new Map(await Promise.all(htmlFiles.map(async (file) => [file, await readFile('out/' + file, 'utf8')])));
const decode = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'");
let checked = 0;
for (const [file, content] of html) {
  const pageURL = 'https://docs.example' + withBasePath('/' + file.replace(/index\.html$/, ''));
  for (const match of content.matchAll(/\b(?:href|src)="([^"<>]+)"/g)) {
    const url = new URL(decode(match[1]), pageURL);
    if (url.origin !== 'https://docs.example') continue;
    const path = decodeURIComponent(url.pathname);
    assert(path === basePath || path.startsWith(basePath + '/'), file + ' 的链接缺少部署前缀：' + path);
    const relative = path.slice(basePath.length).replace(/^\//, '');
    const target = relative.endsWith('/') || !relative ? relative + 'index.html' : relative;
    const resolved = files.has(target) ? target : target + '/index.html';
    assert(files.has(resolved), file + ' 存在失效或大小写错误的链接：' + path);
    if (url.hash && html.has(resolved)) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert([...html.get(resolved).matchAll(/\bid="([^"]+)"/g)].some((m) => decode(m[1]) === id), file + ' 存在失效锚点：' + url.hash);
    }
    checked++;
  }
}

for (const [alias, target] of Object.entries(legacyRoutes)) {
  assert(html.get(alias)?.includes('location.replace(' + JSON.stringify(withBasePath(target))), '缺少旧链接兼容：' + alias);
  assert(html.get(alias)?.includes('location.search + location.hash'), '旧链接未保留查询参数和锚点：' + alias);
}

for (const file of sourceFiles) {
  if (file.startsWith('.vuepress/')) continue;
  assert(file === file.toLowerCase(), '文档文件名必须小写：' + file);
  if (!file.endsWith('.md')) continue;
  const content = await readFile('docs/' + file, 'utf8');
  for (const match of content.matchAll(/\]\(([^)]+\.md)(?:#[^)]*)?\)/g)) {
    const target = posix.normalize(posix.join(posix.dirname(file), match[1]));
    assert(sourceFiles.includes(target), '文档源链接失效：' + match[1]);
  }
}

const intro = html.get('get-started/index.html');
assert(intro.includes('fd-steps'), '审核流程未生成步骤样式');
assert(intro.includes('--callout-color:var(--color-fd-warning') && intro.includes('--callout-color:var(--color-fd-info'), '提示块未渲染');
assert(!intro.includes(':::warning'), '存在未解析的 VuePress 提示块');
assert(intro.includes('/survey start 1') && intro.includes('/survey start 2'), '缺少原始申请指令');
for (const file of ['basic/management/index.html', 'basic/verify/index.html', 'basic/verify-foreign/index.html']) {
  assert(html.get(file).includes('2026/3/21'), file + ' 缺少原文发布时间');
  assert(html.get(file).replaceAll('<!-- -->', '').includes('GMT +08:00'), file + ' 的时区标点被解析器改动');
}

assert(html.get('basic/verify-foreign/index.html').replaceAll('<!-- -->', '').includes('17:30'), '原文发布时间被解析器改动');

const data = await readFile('out/search-index.json');
const client = staticClient({ from: 'data:application/json;base64,' + data.toString('base64') });
for (const query of ['管理公约', '众审', 'survey']) {
  const result = await client.search(query);
  assert(result.length > 0, '搜索没有结果：' + query);
}

console.log('静态检查通过：5 个页面、' + checked + ' 个内部链接/资源、4 个旧链接、中文搜索与提示块。');
