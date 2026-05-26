'use client';

import { useEffect, useRef, useState } from 'react';
import { portfolio } from '@/data/portfolio';
import type { Project } from '@/data/portfolio';

const { projects } = portfolio;

interface WorkProps {
  onOpenProject: (p: Project) => void;
}

export function Work({ onOpenProject }: WorkProps) {
  const [hover, setHover] = useState<string | null>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  // Smooth cursor-following HUD
  useEffect(() => {
    function onMove(e: MouseEvent) {
      targetRef.current.x = e.clientX + 22;
      targetRef.current.y = e.clientY + 22;
    }
    function tick() {
      const t = targetRef.current, c = currentRef.current;
      c.x += (t.x - c.x) * 0.18;
      c.y += (t.y - c.y) * 0.18;
      const hud = hudRef.current;
      if (hud) {
        const w = hud.offsetWidth || 220, h = hud.offsetHeight || 140;
        const x = Math.max(12, Math.min(c.x, window.innerWidth - w - 12));
        const y = Math.max(12, Math.min(c.y, window.innerHeight - h - 12));
        hud.style.setProperty('--hud-x', x + 'px');
        hud.style.setProperty('--hud-y', y + 'px');
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const hoveredProject = hover ? projects.find(p => p.id === hover) : null;

  return (
    <section id="work" data-screen-label="Selected Work">
      <div className="sec-head" data-reveal>
        <div className="num">02 / Selected Work</div>
        <h2>Selected <em>things made</em>.</h2>
      </div>

      <div className="work-list" data-reveal>
        {projects.map((p, i) => {
          const pills = p.stack.split(',').map(s => s.trim()).filter(Boolean);
          return (
            <div
              key={p.id}
              className={`work-row ${hover === p.id ? 'is-hover' : ''}`}
              data-cursor-hover
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onOpenProject(p)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') onOpenProject(p); }}
              aria-label={`Open ${p.title}`}
            >
              <div className="idx">0{i + 1}</div>
              <div className="title">{p.title}</div>
              <div className="tech-pills">
                {pills.map(t => <span className="tp" key={t}>{t}</span>)}
              </div>
              <div className="year">{p.year}</div>
              <div className="arr">→</div>
            </div>
          );
        })}
      </div>

      {/* Cursor-following live metrics HUD */}
      <div
        ref={hudRef}
        className={`work-hud ${hoveredProject ? 'is-visible' : ''}`}
        aria-hidden="true"
      >
        {hoveredProject && (
          <>
            <div className="hud-head">Live · {hoveredProject.title}</div>
            {hoveredProject.metrics.map(([k, v]) => (
              <div className="hud-row" key={k}>
                <span className="k">{k}:</span>
                <span className="v">{v}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
