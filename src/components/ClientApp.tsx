'use client';

import { useState } from 'react';
import { Hero } from './Hero';
import { MarqueeStrip } from './MarqueeStrip';
import { About } from './About';
import { Work } from './Work';
import { ProjectModal } from './ProjectModal';
import { Contact } from './Contact';
import { FootNav } from './FootNav';
import { Topbar } from './Topbar';
import { CursorFx } from './CursorFx';
import { CliPhantom } from './CliPhantom';
import { useTheme } from './ThemeProvider';
import { portfolio } from '@/data/portfolio';
import type { Project } from '@/data/portfolio';

export function ClientApp() {
  const { dark, toggleDark, activeSection } = useTheme();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <>
      <div className="scroll-prog" id="scrollProg" aria-hidden="true" />
      <CursorFx />

      <Topbar />

      <main>
        <Hero />
        <MarqueeStrip />
        <About />
        <Work onOpenProject={setActiveProject} />
        <Contact />

        <section style={{
          borderTop: '1px solid var(--rule)',
          padding: '40px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>
          <span>{portfolio.footer.copyright}</span>
          <span>{portfolio.footer.tagline}</span>
        </section>
      </main>

      <FootNav
        dark={dark}
        onToggleDark={toggleDark}
        active={activeSection}
      />

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />

      <CliPhantom />
    </>
  );
}
