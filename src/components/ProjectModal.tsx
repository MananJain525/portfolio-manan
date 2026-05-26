'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '@/data/portfolio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="pmodal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.div
            className="pmodal"
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="pmodal-close"
              onClick={onClose}
              aria-label="Close modal"
              data-cursor-hover
            >
              [ Esc ]
            </button>

            <div className="pmodal-hero" style={{ background: project.color }}>
              <span className="pmodal-hero-ph">{project.title} · architecture diagram</span>
            </div>

            <div className="pmodal-body">
              <div className="pmodal-meta">
                <span>{project.tag}</span><span>·</span>
                <span>{project.year}</span><span>·</span>
                <span>{project.status}</span>
              </div>

              <h3 className="pmodal-title">{project.title}</h3>

              <div className="pmodal-cols">
                <div>
                  <div className="pmodal-k">Problem</div>
                  <p>{project.summary}</p>
                </div>
                <div>
                  <div className="pmodal-k">Solution</div>
                  <p>{project.tldr}</p>
                </div>
              </div>

              <div className="pmodal-actions">
                <a
                  className="pd-btn"
                  href="#"
                  onClick={e => e.preventDefault()}
                  data-cursor-hover
                >
                  View Live <span className="arr" aria-hidden="true">→</span>
                </a>
                <a
                  className="pd-btn"
                  href="https://github.com/mananjain"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-hover
                >
                  Source Code <span className="arr" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
