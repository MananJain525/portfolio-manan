'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const NAV = [
  { id: 'hero',    label: 'Home',    href: '#hero' },
  { id: 'about',   label: 'About',   href: '#about' },
  { id: 'work',    label: 'Work',    href: '#work' },
  { id: 'contact', label: 'Contact', href: '#contact' },
] as const;

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <motion.line
        x1="3" y1="6"  x2="21" y2="6"
        animate={open ? { rotate: 45,  y: 6  } : { rotate: 0, y: 0 }}
        style={{ transformOrigin: '12px 6px' }}
        transition={{ duration: 0.2 }}
      />
      <motion.line
        x1="3" y1="12" x2="21" y2="12"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.line
        x1="3" y1="18" x2="21" y2="18"
        animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        style={{ transformOrigin: '12px 18px' }}
        transition={{ duration: 0.2 }}
      />
    </svg>
  );
}

function CliIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

export function MobileFab({ active }: { active: string }) {
  const { dark, toggleDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  // Close menu on outside tap
  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [menuOpen]);

  function triggerCli() {
    window.dispatchEvent(new CustomEvent('cli-open'));
  }

  return (
    <div className="mob-dock" ref={dockRef} aria-label="Mobile navigation">

      {/* Nav menu panel — slides up above the dock */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mob-dock-menu"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 8,  scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {NAV.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.href}
                className={`mob-dock-link${active === item.id ? ' is-active' : ''}`}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0, transition: { delay: i * 0.04, duration: 0.18 } }}
                exit={{ opacity: 0 }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* 3-button glassmorphism dock pill */}
      <div className="mob-dock-bar">

        {/* 1 — Theme toggle */}
        <motion.button
          className="mob-dock-btn"
          onClick={toggleDark}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.1 }}
          type="button"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={dark ? 'sun' : 'moon'}
              initial={{ opacity: 0, rotate: -30 }}
              animate={{ opacity: 1, rotate: 0   }}
              exit={{    opacity: 0, rotate:  30  }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex' }}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <div className="mob-dock-sep" aria-hidden="true" />

        {/* 2 — Main menu */}
        <motion.button
          className={`mob-dock-btn mob-dock-menu-btn${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label={menuOpen ? 'Close menu' : 'Open navigation'}
          aria-expanded={menuOpen}
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.1 }}
          type="button"
        >
          <HamburgerIcon open={menuOpen} />
          <span className="mob-dock-label">Menu</span>
        </motion.button>

        <div className="mob-dock-sep" aria-hidden="true" />

        {/* 3 — CLI bot */}
        <motion.button
          className="mob-dock-btn"
          onClick={triggerCli}
          aria-label="Open terminal"
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.1 }}
          type="button"
        >
          <CliIcon />
        </motion.button>

      </div>
    </div>
  );
}
