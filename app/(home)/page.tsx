import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { HomeMotion } from '@/components/home-motion';
import { RhythmLines } from '@/components/rhythm-lines';
import { SectionLine } from '@/components/section-line';
import { source } from '@/lib/source';

const reading = [
  { number: '01', title: '管理公约', detail: '社群的行为规范与管理方式。', href: '/basic/management/' },
  { number: '02', title: '审核须知 · 本校区', detail: '面向厦门六中同安校区学生。', href: '/basic/verify/' },
  { number: '03', title: '审核须知 · 非本校区', detail: '面向其他学校及东渡校区学生。', href: '/basic/verify-foreign/' },
];
const steps = [
  { number: '01', title: '阅读条款', detail: '了解管理公约，确认对应的审核须知。', href: '/get-started/#阅读条款' },
  { number: '02', title: '填写问卷', detail: '加入审核群，按指引获取并填写问卷。', href: '/get-started/#填写问卷' },
  { number: '03', title: '等待审核', detail: '查看众审结果，留意群内的审核通知。', href: '/get-started/#7-等待审核' },
];

export default function HomePage() {
  const home = source.getPage([]);
  if (!home) throw new Error('缺少 docs/index.md');
  const { actions = [], description, footer } = home.data;
  const documentCount = source.getPages().filter((page) => page.slugs.length > 0).length;

  return (
    <HomeMotion>
      <div className="home-main">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="mono-label hero-label">LTYYB / DOCUMENTATION</p>
            <h1 id="hero-title"><span className="hero-title-context">六同音游部</span>文档中心</h1>
            <p className="hero-description">{description}</p>
            <div className="hero-actions">
              {actions.map((action) => (
                <Link key={action.link} href={action.link} className={'button button-' + action.type}>
                  {action.text}<ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
          <RhythmLines documentCount={documentCount} />
          <div className="hero-caption">
            <a href="#documents" className="scroll-link"><span className="mono-label">向下查阅文档</span><ArrowDown size={15} aria-hidden="true" /></a>
            <span className="hero-caption-note">申请流程 / 管理公约 / 审核须知</span>
          </div>
        </section>

        <section id="documents" className="reading-section" aria-labelledby="reading-title">
          <SectionLine />
          <div className="section-heading" data-home-reveal="content">
            <p className="mono-label section-index">01 / DOCUMENT INDEX</p>
            <h2 id="reading-title">文档索引</h2>
            <p className="section-description">查阅社群规则与不同身份对应的审核要求。</p>
          </div>
          <div className="reading-list">
            {reading.map((item, index) => (
              <Link href={item.href} className="reading-link" key={item.href}>
                <span className="mono-label reading-number" data-home-reveal="content" data-reveal-order={index}>{item.number}</span>
                <h3>{item.title}</h3><p>{item.detail}</p>
                <ArrowUpRight size={20} strokeWidth={1.3} aria-hidden="true" />
                <span className="row-trace" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section className="journey-section" aria-labelledby="journey-title">
          <SectionLine />
          <div className="section-heading" data-home-reveal="content">
            <p className="mono-label section-index">02 / GET STARTED</p>
            <h2 id="journey-title">第一次申请？</h2>
            <p className="section-description">按顺序阅读，再开始填写。完整要求以审核流程为准。</p>
          </div>
          <div className="journey-track">
            <div className="journey-rail" aria-hidden="true"><span className="journey-fill" /></div>
            <div className="journey-grid">
              {steps.map((step, index) => (
                <Link href={step.href} className="journey-step" key={step.number}>
                  <span className="journey-node" aria-hidden="true" />
                  <span className="mono-label journey-number" data-home-reveal="content" data-reveal-order={index}>{step.number}</span>
                  <h3>{step.title}<ArrowUpRight size={17} strokeWidth={1.4} aria-hidden="true" /></h3>
                  <p>{step.detail}</p>
                </Link>
              ))}
            </div>
          </div>
          <Link href="/get-started/" className="text-link">阅读完整审核流程<ArrowRight size={16} aria-hidden="true" /></Link>
        </section>

        <aside className="document-note" aria-label="阅读提醒">
          <span className="note-cross" aria-hidden="true" />
          <p>流程与条约可能调整，请结合最新群公告阅读。</p>
          <a href="https://github.com/ltyyb/docs" target="_blank" rel="noreferrer">文档源码<ArrowUpRight size={15} aria-hidden="true" /></a>
        </aside>
      </div>
      <footer className="site-footer"><span>六同音游部 · 文档中心</span><span>{footer}</span></footer>
    </HomeMotion>
  );
}
