'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const CARDS = [
  {
    id: 'binomial',
    title: 'Binomial Pricing Engine',
    desc: 'Options risk analysis and calculation.',
    stats: [['STATUS', 'LIVE'], ['LATENCY', '8ms'], ['MODEL', 'Hull-based Binomial']] as const,
  },
  {
    id: 'm2m',
    title: 'M2M Risk Framework',
    desc: 'Mark-to-Market tracking for derivative portfolios.',
    stats: [['STATUS', 'STABLE'], ['ASSETS', 'Swaps/Futures'], ['UPDATES', 'Real-time']] as const,
  },
  {
    id: 'tooling',
    title: 'AI-Native Tooling',
    desc: 'Shipping at the seam of design and code.',
    stats: [['USERS', '1.4k'], ['COMMITS', '342'], ['UPTIME', '99.9%']] as const,
  },
];

// Slot 0 = front, 1 = middle, 2 = back
const OFFSETS = [
  { x: 0,  y: 0,  rotate: 0,   zIndex: 30 },
  { x: 14, y: 14, rotate: 2,   zIndex: 20 },
  { x: 28, y: 28, rotate: 3.5, zIndex: 10 },
] as const;

export function StackedCards() {
  const [order, setOrder] = useState([0, 1, 2]);
  const [exiting, setExiting] = useState(false);
  const [exitingCardIdx, setExitingCardIdx] = useState<number | null>(null);
  const [hoveredFront, setHoveredFront] = useState(false);

  function handleClick() {
    if (exiting) return;
    setExiting(true);
    setExitingCardIdx(order[0]);
    setTimeout(() => {
      setOrder(prev => [...prev.slice(1), prev[0]]);
      setExitingCardIdx(null);
      setExiting(false);
      setHoveredFront(false);
    }, 420);
  }

  return (
    <div className="sc-wrapper" data-obstacle>
      {order.map((cardIdx, slotIdx) => {
        const card = CARDS[cardIdx];
        const offset = OFFSETS[slotIdx];
        const isFront = slotIdx === 0;
        const isExiting = exitingCardIdx === cardIdx;

        return (
          <motion.div
            key={card.id}
            className="sc-card"
            style={{ zIndex: offset.zIndex }}
            animate={
              isExiting
                ? { x: 320, rotate: 14, opacity: 0, y: offset.y }
                : { x: offset.x, y: offset.y, rotate: offset.rotate, opacity: 1 }
            }
            transition={{ duration: 0.42, ease: [0.2, 0.7, 0.2, 1] }}
            whileHover={isFront ? {
              boxShadow: '0 0 0 1.5px rgba(168,85,247,0.7), 0 16px 48px -10px rgba(168,85,247,0.4)',
            } : undefined}
            onHoverStart={() => { if (isFront) setHoveredFront(true); }}
            onHoverEnd={() => { if (isFront) setHoveredFront(false); }}
            onClick={isFront ? handleClick : undefined}
            data-cursor-hover={isFront || undefined}
          >
            <div className="sc-card-header">
              <span className="sc-card-eyebrow">// project</span>
              {isFront && <span className="sc-card-hint">click to cycle ↗</span>}
            </div>

            <div className="sc-card-title">{card.title}</div>

            {isFront && (
              <div className="sc-card-body">
                <AnimatePresence mode="wait">
                  {hoveredFront ? (
                    <motion.div
                      key="hud"
                      className="sc-hud"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.16 }}
                    >
                      {card.stats.map(([k, v]) => (
                        <div className="sc-hud-row" key={k}>
                          <span className="sc-hud-k">{k}</span>
                          <span className="sc-hud-v">{v}</span>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.p
                      key="desc"
                      className="sc-card-desc"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.16 }}
                    >
                      {card.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
