'use client';

import { useEffect, useState } from 'react';

interface FootNavProps {
  dark: boolean;
  onToggleDark: () => void;
  active: string;
}

const LINKS = [
  { id: 'hero',    label: 'Home' },
  { id: 'about',   label: 'About' },
  { id: 'work',    label: 'Work' },
  { id: 'contact', label: 'Contact' },
] as const;

export function FootNav({ dark, onToggleDark, active }: FootNavProps) {
  const [now, setNow] = useState('');

  useEffect(() => {
    const update = () => {
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata', hour12: false,
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      };
      setNow(new Intl.DateTimeFormat('en-GB', opts).format(new Date()));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <nav className="footnav" aria-label="Site navigation">
      {/* Home icon */}
      <a
        href="#hero"
        className="fn-icon"
        data-active={active === 'hero' ? '1' : '0'}
        aria-label="Home"
        data-cursor-hover
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 10.5 12 3l9 7.5"/>
          <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-7h4v7h4a1 1 0 0 0 1-1V9.5"/>
        </svg>
      </a>

      {/* Theme toggle */}
      <button
        type="button"
        className="fn-theme"
        onClick={onToggleDark}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        data-cursor-hover
      >
        <span className="fn-theme-icon" aria-hidden="true">{dark ? '☼' : '☾'}</span>
      </button>

      <span className="sep" aria-hidden="true" />

      {LINKS.filter(l => l.id !== 'hero').map((l, i, arr) => (
        <span key={l.id} style={{ display: 'contents' }}>
          <a
            href={`#${l.id}`}
            data-active={active === l.id ? '1' : '0'}
            data-cursor-hover
          >
            {l.label}
          </a>
          {i < arr.length - 1 && <span className="sep" aria-hidden="true" />}
        </span>
      ))}

      <span className="sep" aria-hidden="true" />
      <div className="loc" aria-label="Location and local time">
        <div>Goa, India</div>
        <div className="t">{now}</div>
      </div>
    </nav>
  );
}
