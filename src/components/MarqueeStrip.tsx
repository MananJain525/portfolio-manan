'use client';

import { portfolio } from '@/data/portfolio';

export function MarqueeStrip() {
  const { items } = portfolio.marquee;
  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee">
        {[0, 1].map(n => (
          <span key={n}>
            {items.map((t, i) => <span key={i}>{t}</span>)}
          </span>
        ))}
      </div>
    </div>
  );
}
