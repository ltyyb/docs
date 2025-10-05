import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  lang: 'zh-CN',

  title: `六同音游部通用文档`,
  description: `厦门六中同安校区音游部 | 通用文档页`,

  theme: defaultTheme({
    logo: 'https://vuejs.press/images/hero.png',

    navbar: [{
      text: '首页',
      link: '/',
    },
    {
      text: '基础条约',
      prefix: '/basic/',
      children: ['Management.md', 'Verify.md'],
    },
    ],
    repo: 'ltyyb/docs',
  }),
  

  bundler: viteBundler(),
})
