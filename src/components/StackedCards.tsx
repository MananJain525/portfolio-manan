'use client';

import { useEffect, useRef, useState } from 'react';
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

type Offset = { x: number; y: number; scale: number; rotate: number; zIndex: number };

// Desktop: fan right + down
const DESKTOP_OFFSETS: Offset[] = [
  { x: 0,  y: 0,  scale: 1,    rotate: 0,   zIndex: 30 },
  { x: 14, y: 14, scale: 1,    rotate: 2,   zIndex: 20 },
  { x: 28, y: 28, scale: 1,    rotate: 3.5, zIndex: 10 },
];

// Mobile: pure Y-axis depth + scale — zero horizontal overflow
const MOBILE_OFFSETS: Offset[] = [
  { x: 0, y: 0,  scale: 1,    rotate: 0,   zIndex: 30 },
  { x: 0, y: 10, scale: 0.95, rotate: 1.5, zIndex: 20 },
  { x: 0, y: 20, scale: 0.90, rotate: 2.5, zIndex: 10 },
];

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 20, mass: 0.8 };

export function StackedCards() {
  const [order, setOrder] = useState([0, 1, 2]);
  const [exiting, setExiting] = useState(false);
  const [exitingCardIdx, setExitingCardIdx] = useState<number | null>(null);
  const [hoveredFront, setHoveredFront] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  function handleDiscard() {
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

  const offsets = isMobile ? MOBILE_OFFSETS : DESKTOP_OFFSETS;

  return (
    <div className="sc-wrapper" data-obstacle ref={wrapperRef}>
      <AnimatePresence>
        {order.map((cardIdx, slotIdx) => {
          const card = CARDS[cardIdx];
          const offset = offsets[slotIdx];
          const isFront = slotIdx === 0;
          const isExiting = exitingCardIdx === cardIdx;

          // Mobile exits upward to avoid viewport overflow; desktop exits right
          const exitTarget = isMobile
            ? { x: 0, y: -180, scale: 0.9, rotate: -6, opacity: 0 }
            : { x: 320, y: offset.y, scale: 1, rotate: 14, opacity: 0 };

          return (
            <motion.div
              key={card.id}
              className="sc-card"
              style={{ zIndex: offset.zIndex }}
              animate={
                isExiting
                  ? exitTarget
                  : { x: offset.x, y: offset.y, scale: offset.scale, rotate: offset.rotate, opacity: 1 }
              }
              transition={SPRING}
              drag={isFront && !exiting}
              dragElastic={0.2}
              dragConstraints={{ left: -200, right: 200, top: -60, bottom: 60 }}
              onDragEnd={(_, info) => {
                if (isFront && Math.abs(info.offset.x) > 80) handleDiscard();
              }}
              whileHover={isFront ? {
                boxShadow: '0 0 0 1.5px rgba(168,85,247,0.7), 0 16px 48px -10px rgba(168,85,247,0.4)',
              } : undefined}
              onHoverStart={() => { if (isFront) setHoveredFront(true); }}
              onHoverEnd={() => { if (isFront) setHoveredFront(false); }}
              onClick={isFront ? handleDiscard : undefined}
              data-cursor-hover={isFront || undefined}
            >
              <div className="sc-card-header">
                <span className="sc-card-eyebrow">// project</span>
                {isFront && <span className="sc-card-hint">drag or click ↗</span>}
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
      </AnimatePresence>
    </div>
  );
}
