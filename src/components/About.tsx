'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { portfolio } from '@/data/portfolio';

function GithubMark({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 98 96" fill="currentColor" aria-hidden="true">
      <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
    </svg>
  );
}

const { about } = portfolio;
const COLS = 15; // 15 columns × 4 rows = 60 cells
const ROWS = 4;

function buildGrid60(): number[] {
  return Array.from({ length: COLS * ROWS }, () => {
    const r = Math.random();
    if (r > 0.85) return 4;
    if (r > 0.65) return 3;
    if (r > 0.45) return 2;
    if (r > 0.28) return 1;
    return 0;
  });
}

// Deterministic SSR placeholder — no random
const SSR_CELLS_60 = Array.from({ length: COLS * ROWS }, (_, i) =>
  i % 7 === 0 ? 4 : i % 5 === 0 ? 2 : i % 3 === 0 ? 1 : 0,
);

export function About() {
  const [cells, setCells] = useState<number[]>(SSR_CELLS_60);
  useEffect(() => { setCells(buildGrid60()); }, []);

  return (
    <section id="about" data-screen-label="About">
      <div className="sec-head" data-reveal>
        <div className="num">01 / About</div>
        <h2>The <em>last twelve months</em>, plotted.</h2>
      </div>

      <div className="about-intro" data-reveal>
        <div className="ai-col">
          <div className="ai-label">About me</div>
          <p>{about.intro.aboutMe}</p>
        </div>
        <div className="ai-col">
          <div className="ai-label">Currently</div>
          <ul className="ai-list">
            {about.intro.currently.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="about2-grid">
        {/* GitHub 60-day contribution grid */}
        <div className="glass-panel about-panel" data-reveal>
          <div className="gh60-head">
            <span className="panel-eye gh60-label">GITHUB — 60 DAYS</span>
            <a
              href="https://github.com/MananJain525"
              target="_blank"
              rel="noopener noreferrer"
              className="gh60-link"
              data-cursor-hover
            >
              <GithubMark size={12} />
              <span>MananJain525</span>
              <ArrowUpRight size={11} aria-hidden="true" />
            </a>
          </div>

          <div
            className="gh60-grid"
            role="img"
            aria-label="GitHub contributions — last 60 days"
          >
            {cells.map((lvl, i) => (
              <div key={i} className="gh60-cell" data-lvl={lvl} />
            ))}
          </div>
        </div>

        {/* Tech skills */}
        <div className="glass-panel about-panel" data-reveal>
          <div className="panel-head">
            <div>
              <div className="panel-eye">// stack</div>
              <div className="panel-title">Tools I reach for <em>without thinking</em>.</div>
            </div>
            <div className="panel-meta">{about.skills.length} primaries</div>
          </div>

          <div className="skills-pills">
            {about.skills.map(s => (
              <span key={s.tag} className="pill" data-cursor-hover title={s.note}>
                {s.tag}
                <i className="pill-dot" aria-hidden="true" />
              </span>
            ))}
          </div>

          <div className="skills-foot">
            <span className="panel-eye">// also</span>
            <span>{about.skillsAlso}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
