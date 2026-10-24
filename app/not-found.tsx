import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="mono-label">404 / NOT FOUND</p>
      <h1>页面不存在</h1>
      <p>地址可能有误，或页面已经移动。</p>
      <Link href="/" className="button button-primary">返回首页</Link>
    </main>
  );
}
