import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Provider } from '@/components/provider';
import { withBasePath } from '@/site.config.mjs';
import './global.css';

export const metadata: Metadata = {
  title: { default: '六同音游部 · 文档中心', template: '%s | 六同音游部' },
  description: '厦门六中同安校区音游部文档中心：申请流程、管理公约与审核须知。',
  icons: { icon: withBasePath('/hero.webp') },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
