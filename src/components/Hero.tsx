'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroCanvas } from './HeroCanvas';
import { StackedCards } from './StackedCards';
import { portfolio } from '@/data/portfolio';

const { tagline, eyebrow, name, nameSuffix, bio } = portfolio;

export function Hero() {
  const words = tagline.words;
  const [wordIdx, setWordIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && typed.length < word.length) {
      t = setTimeout(() => setTyped(word.slice(0, typed.length + 1)), 70);
    } else if (!deleting && typed.length === word.length) {
      t = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && typed.length > 0) {
      t = setTimeout(() => setTyped(word.slice(0, typed.length - 1)), 38);
    } else if (deleting && typed.length === 0) {
      setDeleting(false);
      setWordIdx((wordIdx + 1) % words.length);
    }
    return () => clearTimeout(t);
  }, [typed, deleting, wordIdx, words]);

  const hostRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      className="hero"
      ref={hostRef as React.RefObject<HTMLElement>}
    >
      <HeroCanvas hostRef={hostRef} />

      <div className="hero-inner hero-grid">
        {/* Right col (DOM first for SEO; placed right via grid-area) */}
        <div className="hero-text">
          <div className="eyebrow">
            <span>{eyebrow.school}</span>
            <span className="eyebrow-sep" aria-hidden="true">·</span>
            <span className="eyebrow-avail">
              <span className="pulse" aria-hidden="true" />
              {eyebrow.availability}
            </span>
          </div>

          <h1 className="display">
            <span className="line"><span>{name}</span></span>
            <span className="line accent"><span>{nameSuffix}</span></span>
          </h1>

          <div className="tagline">
            {tagline.base}
            <span className="ink">{typed}</span>
            <span className="cursor" aria-hidden="true" />
          </div>

          <p className="hero-bio">{bio}</p>

          <div className="hero-actions-bottom">
            <div className="row">
              <a href="#work" className="btn btn-primary" data-cursor-hover>
                View Work <span aria-hidden="true">→</span>
              </a>
              <a
                href="https://github.com/mananjain"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
                data-cursor-hover
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="hint">Click to interact · Scroll to explore</div>
          </div>
        </div>

        {/* Left col: stacked cards (placed left via grid-area) */}
        <StackedCards />
      </div>
    </section>
  );
}
