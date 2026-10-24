import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { withBasePath } from '@/site.config.mjs';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="brand">
          <img src={withBasePath('/hero.webp')} alt="" width={28} height={28} />
          <span>六同音游部<span className="brand-caption">文档中心</span></span>
        </span>
      ),
      url: '/',
    },
    links: [
      { text: '申请流程', url: '/get-started/' },
      { text: '管理公约', url: '/basic/management/' },
    ],
    themeSwitch: { enabled: false },
    githubUrl: 'https://github.com/ltyyb/docs',
  };
}
