'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeCtx {
  dark: boolean;
  toggleDark: () => void;
  activeSection: string;
  setActiveSection: (id: string) => void;
}

const Ctx = createContext<ThemeCtx>({
  dark: true,
  toggleDark: () => {},
  activeSection: 'hero',
  setActiveSection: () => {},
});

export const useTheme = () => useContext(Ctx);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Sync dark state to body data-attr
  useEffect(() => {
    document.body.dataset.dark   = String(dark);
    document.body.dataset.cursor = 'true';
  }, [dark]);

  // Scroll progress bar
  useEffect(() => {
    const prog = document.getElementById('scrollProg');
    if (!prog) return;
    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      prog!.style.width = Math.min(100, (window.scrollY / Math.max(1, h)) * 100) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy — track active section
  useEffect(() => {
    const ids = ['hero', 'about', 'work', 'contact'];
    const els = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      let best: IntersectionObserverEntry | null = null;
      entries.forEach(en => {
        if (!best || en.intersectionRatio > best.intersectionRatio) best = en;
      });
      if (best && (best as IntersectionObserverEntry).isIntersecting)
        setActiveSection((best as IntersectionObserverEntry).target.id);
    }, { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Reveal-on-scroll — no guard needed; cleanup/remount in Strict Mode is idempotent
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <Ctx.Provider value={{ dark, toggleDark: () => setDark(d => !d), activeSection, setActiveSection }}>
      {children}
    </Ctx.Provider>
  );
}
