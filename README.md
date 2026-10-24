# 六同音游部文档中心

基于 Next.js、Fumadocs、React、TypeScript 与 Tailwind CSS，静态导出到 GitHub Pages。

## 本地开发

需要 Node.js 22.18+（CI 使用 Node.js 24）与 package.json 指定版本的 pnpm。

~~~sh
pnpm install
pnpm docs:dev
~~~

打开 http://localhost:3000/docs/ 。如需清除开发缓存，运行 pnpm docs:clean-dev。

## 构建与检查

~~~sh
pnpm typecheck
pnpm docs:build
pnpm check
pnpm docs:preview
~~~

静态产物位于 out/，预览地址为 http://localhost:4173/docs/ 。预览服务默认只监听本机。
pnpm check 检查页面、大小写敏感的内部链接与锚点、旧地址兼容、提示块、原文时间标点和中文搜索。

## 内容维护

- docs/index.md：文档首页的简介、入口按钮与页脚。
- docs/get-started.md：申请审核流程，连续编号的标题自动显示为步骤。
- docs/basic/management.md：管理公约。
- docs/basic/verify.md：本校区审核须知。
- docs/basic/verify-foreign.md：非本校区审核须知。
- docs/meta.json 与 docs/basic/meta.json：导航分组和页面顺序。

页面文件名与路径统一小写。内容仍可使用 Markdown，相对文档链接可继续使用 .md 后缀，由 Fumadocs 解析到页面地址。

提示块保留原有写法：

~~~md
:::warning
请参考最新群公告。
:::

:::tip
问卷类型请按实际情况选择。
:::
~~~

需要更丰富的交互时，可以新增 .mdx 文件，并在 components/mdx.tsx 注册组件。

## 主题与布局

- app/global.css：深色主题、线条动效、首页与移动端样式。
- app/(home)/page.tsx：首页结构。
- lib/layout.shared.tsx：站点标识与公共导航。
- components/provider.tsx：中文界面和主题配置。
- components/search.tsx：浏览器端全文搜索、常用入口与空状态。
- public/hero.webp：社群标识与站点图标。
- components/rhythm-lines.tsx：首页线条插图。
- components/home-motion.tsx：首页专用滚动控制，直接更新图形样式，不逐帧触发 React 渲染。

界面参考 DESIGN.md，采用固定深色、细边线和描边按钮。首页定位为文档入口，包含文档索引与申请步骤。滚动时显示章节线条、页面进度、轻微图形视差与一次性分区显现；正文不使用装饰动画。减少动态效果和增强对比度偏好有对应处理。

不依赖外部字体请求，也不需要运行时后端。搜索索引在构建时生成，首次搜索时由浏览器下载。

## GitHub Pages

site.config.mjs 的 basePath 默认为 /docs，与当前 GitHub Pages 项目路径一致。
如果迁移到根域名，将它改为空字符串后重新构建；Next.js、图片、搜索及旧地址跳转会共用此配置。

推送 main 后，GitHub Actions 安装锁定依赖、检查类型、构建、检查链接，再把 out/ 发布到 gh-pages 分支。
仓库 Pages 设置继续选择 gh-pages 分支根目录。Pull Request 仅构建验证。

旧地址 /get-started.html、/basic/Management.html、/basic/Verify.html 和 /basic/Verify-foreign.html 会生成静态兼容页，跳转到小写路径。
它们仅作为部署产物存在，文档源文件统一小写。
