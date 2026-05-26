'use client';

import { useEffect, useMemo, useState } from 'react';
import { portfolio } from '@/data/portfolio';

const { about } = portfolio;
const WEEKS = 52;
const DAYS = 7;

function buildContribGrid(): number[] {
  const cells: number[] = [];
  for (let w = 0; w < WEEKS; w++) {
    const bias = 0.25 + 0.55 * Math.abs(Math.sin(w * 0.31 + 1.2));
    for (let d = 0; d < DAYS; d++) {
      const r = Math.random();
      const weekendDamp = (d === 0 || d === 6) ? 0.6 : 1;
      const t = r * bias * weekendDamp;
      let lvl = 0;
      if (t > 0.7)       lvl = 4;
      else if (t > 0.5)  lvl = 3;
      else if (t > 0.34) lvl = 2;
      else if (t > 0.18) lvl = 1;
      cells.push(lvl);
    }
  }
  return cells;
}

const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

// Placeholder cells for SSR (all level 1 — visually coherent but no random)
const SSR_CELLS = Array.from({ length: WEEKS * DAYS }, (_, i) => (i % 5 === 0 ? 2 : 1));

export function About() {
  const [cells, setCells] = useState<number[]>(SSR_CELLS);
  useEffect(() => { setCells(buildContribGrid()); }, []);
  const total = useMemo(
    () => cells.reduce((acc, v) => acc + ((v * 1.7) | 0), 0) + 420,
    [cells],
  );

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
        {/* GitHub contribution calendar */}
        <div className="glass-panel about-panel" data-reveal>
          <div className="panel-head">
            <div>
              <div className="panel-eye">// github</div>
              <div className="panel-title">
                {total.toLocaleString()} contributions <em>this year</em>
              </div>
            </div>
            <div className="panel-meta">{about.github.handle} · {about.github.period}</div>
          </div>

          <div className="gh-months" aria-hidden="true">
            {MONTHS.map((m, i) => (
              <span key={i} style={{ gridColumn: `${i * 4 + 2} / span 4` }}>{m}</span>
            ))}
          </div>

          <div className="gh-body">
            <div className="gh-days" aria-hidden="true">
              <span>Mon</span><span>Wed</span><span>Fri</span>
            </div>
            <div className="gh-grid" role="img" aria-label="GitHub-style contribution graph">
              {cells.map((lvl, i) => (
                <div key={i} className="gh-cell" data-lvl={lvl} />
              ))}
            </div>
          </div>

          <div className="gh-legend">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map(l => <div key={l} className="gh-cell" data-lvl={l} />)}
            <span>More</span>
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
