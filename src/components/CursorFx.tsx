'use client';

import { useEffect, useRef } from 'react';

export function CursorFx() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let rafId: number;

    const dotEl  = dot;
    const ringEl = ring;
    function onMove(e: MouseEvent) {
      mx = e.clientX; my = e.clientY;
      dotEl.style.left = mx + 'px';
      dotEl.style.top  = my + 'px';
    }
    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ringEl.style.left = rx + 'px';
      ringEl.style.top  = ry + 'px';
      rafId = requestAnimationFrame(loop);
    }
    function onOver(e: MouseEvent) {
      if ((e.target as Element).closest('a, button, [data-cursor-hover]'))
        document.body.classList.add('is-hovering');
    }
    function onOut(e: MouseEvent) {
      if ((e.target as Element).closest('a, button, [data-cursor-hover]'))
        document.body.classList.remove('is-hovering');
    }

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
    </>
  );
}
