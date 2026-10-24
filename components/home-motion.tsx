'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const easeOut = 'cubic-bezier(0.23, 1, 0.32, 1)';
const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function HomeMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hero = root.querySelector<HTMLElement>('.hero-section');
    const drawing = root.querySelector<HTMLElement>('.rhythm-parallax');
    const journey = root.querySelector<HTMLElement>('.journey-track');
    const journeyFill = root.querySelector<HTMLElement>('.journey-fill');
    const animations = new Set<Animation>();
    let frame = 0;
    let reduced = preference.matches;

    function paint() {
      frame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pageProgress = total > 0 ? clamp(window.scrollY / total) : 0;
      const heroRect = hero?.getBoundingClientRect();
      const journeyRect = journey?.getBoundingClientRect();
      const heroProgress = heroRect ? clamp((56 - heroRect.top) / heroRect.height) : 0;
      const journeyProgress = journeyRect
        ? clamp((window.innerHeight * .8 - journeyRect.top) / (journeyRect.height + window.innerHeight * .25))
        : 1;

      if (progressRef.current) progressRef.current.style.transform = 'scaleX(' + pageProgress + ')';
      if (drawing) drawing.style.transform = reduced ? 'none' : 'translateY(' + (-24 * heroProgress) + 'px)';
      if (journeyFill) journeyFill.style.transform = 'scaleX(' + (reduced ? 1 : journeyProgress) + ')';
    }

    function schedulePaint() {
      if (!frame) frame = window.requestAnimationFrame(paint);
    }

    function syncPreference() {
      reduced = preference.matches;
      root!.dataset.homeMotion = reduced ? 'reduced' : 'enabled';
      if (reduced) {
        for (const animation of animations) animation.cancel();
        animations.clear();
      }
      schedulePaint();
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        element.dataset.revealed = 'true';
        if (reduced) continue;
        const isLine = element.dataset.homeReveal === 'line';
        const order = Number(element.dataset.revealOrder ?? 0);
        const animation = element.animate(
          isLine
            ? [{ transform: 'scaleX(0)', opacity: .3 }, { transform: 'scaleX(1)', opacity: 1 }]
            : [{ transform: 'translateY(8px)', opacity: .65 }, { transform: 'translateY(0)', opacity: 1 }],
          { duration: isLine ? 600 : 300, easing: easeOut, delay: Math.min(order, 3) * 50 },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: .12, rootMargin: '0px 0px -24px 0px' });

    for (const element of root.querySelectorAll('[data-home-reveal]')) observer.observe(element);
    window.addEventListener('scroll', schedulePaint, { passive: true });
    window.addEventListener('resize', schedulePaint);
    preference.addEventListener('change', syncPreference);
    syncPreference();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedulePaint);
      window.removeEventListener('resize', schedulePaint);
      preference.removeEventListener('change', syncPreference);
      observer.disconnect();
      for (const animation of animations) animation.cancel();
      if (drawing) drawing.style.removeProperty('transform');
      if (journeyFill) journeyFill.style.removeProperty('transform');
    };
  }, []);

  return (
    <div ref={rootRef} className="home-experience">
      <div className="home-progress" aria-hidden="true"><span ref={progressRef} /></div>
      {children}
    </div>
  );
}
