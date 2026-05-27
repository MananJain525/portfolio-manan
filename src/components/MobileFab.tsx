'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const NAV = [
  { id: 'hero',    label: 'Home',    href: '#hero' },
  { id: 'about',   label: 'About',   href: '#about' },
  { id: 'work',    label: 'Work',    href: '#work' },
  { id: 'contact', label: 'Contact', href: '#contact' },
  { id: 'cli',     label: '>_',      href: null },
] as const;

export function MobileFab({ active }: { active: string }) {
  const [open, setOpen] = useState(false);

  function handleItemClick(id: string) {
    setOpen(false);
    if (id === 'cli') {
      window.dispatchEvent(new CustomEvent('cli-open'));
    }
  }

  return (
    <div className="mob-fab-root" aria-label="Mobile navigation">
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mob-fab-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {NAV.map((item, i) => {
              // stagger: bottom item (CLI, index 4) appears first
              const delay = (NAV.length - 1 - i) * 0.055;
              const isActive = item.id !== 'cli' && active === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay, duration: 0.22, ease: [0.2, 0.7, 0.2, 1] } }}
                  exit={{ opacity: 0, y: 6, transition: { duration: 0.1 } }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className={`mob-fab-item${isActive ? ' is-active' : ''}`}
                      onClick={() => handleItemClick(item.id)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      className="mob-fab-item"
                      onClick={() => handleItemClick(item.id)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>

      <motion.button
        className={`mob-fab-btn${open ? ' is-open' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.12 }}
        type="button"
      >
        <motion.span
          aria-hidden="true"
          animate={{ opacity: open ? 0 : 1, rotate: open ? 30 : 0 }}
          transition={{ duration: 0.18 }}
          style={{ position: 'absolute', lineHeight: 1 }}
        >
          ≡
        </motion.span>
        <motion.span
          aria-hidden="true"
          animate={{ opacity: open ? 1 : 0, rotate: open ? 0 : -30 }}
          transition={{ duration: 0.18 }}
          style={{ position: 'absolute', lineHeight: 1 }}
        >
          ×
        </motion.span>
      </motion.button>
    </div>
  );
}
