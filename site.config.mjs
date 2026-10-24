// GitHub Pages 项目站点部署在 /docs/，自定义域名可改为空字符串。
export const basePath = '/docs';

export function withBasePath(path) {
  return basePath + (path.startsWith('/') ? path : '/' + path);
}
