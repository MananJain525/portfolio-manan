'use client';

import { useEffect, useRef } from 'react';

interface HeroCanvasProps {
  hostRef: React.RefObject<HTMLElement | null>;
}

export function HeroCanvas({ hostRef }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    if (typeof window === 'undefined') return;

    const ctx = canvas.getContext('2d')!;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let running = true;
    let visible = true;
    let tabVisible = document.visibilityState !== 'hidden';
    let rafId: number | null = null;

    // ── Resize ────────────────────────────────────────────────
    function resize() {
      const r = host!.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
      canvas!.style.width = W + 'px';
      canvas!.style.height = H + 'px';
      canvas!.width = Math.floor(W * DPR);
      canvas!.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    // ── Theme accent ──────────────────────────────────────────
    let accent = '#A855F7';
    let glow = '#A855F7';
    let blendMode: GlobalCompositeOperation = 'source-over';
    let isLight = true;

    function hexToRgb(hex: string) {
      const m = String(hex).trim().match(/^#?([a-f\d]{6}|[a-f\d]{3})$/i);
      if (!m) return null;
      let h = m[1];
      if (h.length === 3) h = h.split('').map(c => c + c).join('');
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
    }
    function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          default: h = (r - g) / d + 4;
        }
        h /= 6;
      }
      return { h, s, l };
    }
    function hslToRgb({ h, s, l }: { h: number; s: number; l: number }) {
      let r: number, g: number, b: number;
      if (s === 0) { r = g = b = l; }
      else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1; if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return { r: Math.round(r! * 255), g: Math.round(g! * 255), b: Math.round(b! * 255) };
    }
    function refreshAccent() {
      const v = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#A855F7';
      let rgb = null;
      const hexMatch = v.match(/^#[0-9a-f]{3,8}$/i);
      const rgbMatch = v.match(/rgba?\s*\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
      if (hexMatch) rgb = hexToRgb(v);
      else if (rgbMatch) rgb = { r: +rgbMatch[1], g: +rgbMatch[2], b: +rgbMatch[3] };
      if (!rgb) return;
      isLight = document.body.dataset.dark !== 'true';
      const hsl = rgbToHsl(rgb);
      const targetL = isLight ? 0.58 : Math.max(hsl.l, 0.62);
      const targetS = Math.max(hsl.s, 0.78);
      const lit = hslToRgb({ h: hsl.h, s: targetS, l: targetL });
      accent = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      glow = `rgb(${lit.r},${lit.g},${lit.b})`;
      blendMode = isLight ? 'source-over' : 'lighter';
    }
    refreshAccent();
    const themeObs = new MutationObserver(refreshAccent);
    themeObs.observe(document.body, { attributes: true, attributeFilter: ['data-dark'] });

    // ── Obstacles ─────────────────────────────────────────────
    type Obstacle = { x: number; y: number; w: number; h: number };
    let obstacles: Obstacle[] = [];
    function refreshObstacles() {
      const cr = host!.getBoundingClientRect();
      obstacles = Array.from(host!.querySelectorAll('[data-obstacle]')).map(el => {
        const r = (el as HTMLElement).getBoundingClientRect();
        return { x: r.left - cr.left, y: r.top - cr.top, w: r.width, h: r.height };
      });
    }
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number };
    function collide(p: Particle, damp = 0.78) {
      for (let i = 0; i < obstacles.length; i++) {
        const o = obstacles[i];
        if (p.x > o.x && p.x < o.x + o.w && p.y > o.y && p.y < o.y + o.h) {
          const dl = p.x - o.x, dr = o.x + o.w - p.x;
          const dt = p.y - o.y, db = o.y + o.h - p.y;
          const m = Math.min(dl, dr, dt, db);
          if (m === dl)      { p.x = o.x - 0.5;       p.vx = -Math.abs(p.vx) * damp; }
          else if (m === dr) { p.x = o.x + o.w + 0.5; p.vx =  Math.abs(p.vx) * damp; }
          else if (m === dt) { p.y = o.y - 0.5;       p.vy = -Math.abs(p.vy) * damp; }
          else               { p.y = o.y + o.h + 0.5; p.vy =  Math.abs(p.vy) * damp; }
        }
      }
    }

    // ── Noise field ───────────────────────────────────────────
    function noise2D(x: number, y: number, t: number) {
      const fx1 = 0.0042, fy1 = 0.0042;
      const fx2 = 0.0090, fy2 = 0.0073;
      const fx3 = 0.0151, fy3 = 0.0117;
      const a = Math.sin(x * fx1 + t * 0.42) * Math.cos(y * fy1 - t * 0.31);
      const b = Math.sin(x * fx2 + y * fy2 + t * 0.55) * 0.65;
      const c = Math.cos((x - y) * fx3 + t * 0.28) * 0.45;
      const d = Math.sin((x * 0.5 + y * 0.7) * fy3 - t * 0.39) * 0.35;
      return a + b + c + d;
    }

    // ── Flow particles ────────────────────────────────────────
    const FLOW: Particle[] = [];
    const FLOW_TARGET = window.innerWidth < 768 ? 95 : 380; // 25% on mobile
    let zT = 0;
    function seedFlow(p: Particle) {
      p.x = Math.random() * W; p.y = Math.random() * H;
      p.vx = 0; p.vy = 0; p.life = 0;
      p.max = 220 + Math.random() * 320;
      p.size = 0.55 + Math.random() * 0.75;
    }
    function topUpFlow() {
      while (FLOW.length < FLOW_TARGET) {
        const p = {} as Particle; seedFlow(p); FLOW.push(p);
      }
    }

    // ── Cursor trail ──────────────────────────────────────────
    const CURSOR: Particle[] = [];
    const CURSOR_MAX = 360;
    let prevMx = -9999, prevMy = -9999;

    function emitParticles(mx: number, my: number) {
      let dirX = 0, dirY = 0;
      if (prevMx > -9000) {
        const ddx = mx - prevMx, ddy = my - prevMy;
        const dl = Math.hypot(ddx, ddy) || 1;
        dirX = ddx / dl; dirY = ddy / dl;
      }
      for (let i = 0; i < 6; i++) {
        const motionAngle = (dirX || dirY) ? Math.atan2(dirY, dirX) : Math.random() * Math.PI * 2;
        const spread = (Math.random() - 0.5) * (Math.PI * 1.1);
        const ang = motionAngle + spread;
        const speed = 0.7 + Math.random() * 2.3;
        if (CURSOR.length >= CURSOR_MAX) CURSOR.shift();
        CURSOR.push({
          x: mx + (Math.random() - 0.5) * 14,
          y: my + (Math.random() - 0.5) * 14,
          vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed,
          life: 0, max: 40 + Math.random() * 40,
          size: 0.9 + Math.random() * 1.6,
        });
      }
      prevMx = mx; prevMy = my;
    }

    function onMouseMove(e: MouseEvent) {
      const r = host!.getBoundingClientRect();
      emitParticles(e.clientX - r.left, e.clientY - r.top);
    }
    function onTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      if (!touch) return;
      const r = host!.getBoundingClientRect();
      emitParticles(touch.clientX - r.left, touch.clientY - r.top);
    }
    host.addEventListener('mousemove', onMouseMove);
    host.addEventListener('touchstart', onTouchMove, { passive: true });
    host.addEventListener('touchmove', onTouchMove, { passive: true });

    // ── Page visibility ───────────────────────────────────────
    function onVisibility() {
      tabVisible = document.visibilityState !== 'hidden';
      if (tabVisible && visible && running && !rafId) {
        rafId = requestAnimationFrame(tick);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    // ── Main loop ─────────────────────────────────────────────
    function tick() {
      if (!running) return;
      if (!tabVisible) { rafId = null; return; } // fully stop when tab hidden
      rafId = requestAnimationFrame(tick);
      if (!visible) return;

      zT += 0.0042;
      topUpFlow();
      if ((performance.now() | 0) % 500 < 17) refreshObstacles();

      const FLOW_SPEED = 0.95, FLOW_ACCEL = 0.12, FLOW_DRAG = 0.92;
      for (let i = 0; i < FLOW.length; i++) {
        const p = FLOW[i];
        p.life++;
        const n = noise2D(p.x, p.y, zT);
        const angle = n * Math.PI * 1.6;
        p.vx = p.vx * FLOW_DRAG + Math.cos(angle) * FLOW_SPEED * FLOW_ACCEL;
        p.vy = p.vy * FLOW_DRAG + Math.sin(angle) * FLOW_SPEED * FLOW_ACCEL;
        p.x += p.vx; p.y += p.vy;
        collide(p, 0.55);
        if (p.life >= p.max || p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40) seedFlow(p);
      }
      for (let i = CURSOR.length - 1; i >= 0; i--) {
        const p = CURSOR[i];
        p.life++; p.x += p.vx; p.y += p.vy; p.vx *= 0.95; p.vy *= 0.95;
        collide(p, 0.82);
        if (p.life >= p.max || p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) CURSOR.splice(i, 1);
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = blendMode;
      ctx.shadowColor = glow;
      ctx.fillStyle = glow;

      ctx.shadowBlur = isLight ? 16 : 12;
      for (let i = 0; i < FLOW.length; i++) {
        const p = FLOW[i];
        const t = p.life / p.max;
        const FADE_IN = 0.18, FADE_OUT_FROM = 0.7;
        const fade = t < FADE_IN ? t / FADE_IN : t > FADE_OUT_FROM ? (1 - t) / (1 - FADE_OUT_FROM) : 1;
        ctx.globalAlpha = 0.7 * fade * (isLight ? 1 : 0.88);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = isLight ? 16 : 14;
      for (let i = 0; i < CURSOR.length; i++) {
        const p = CURSOR[i];
        ctx.globalAlpha = 0.95 * (1 - p.life / p.max);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    // ── Visibility observer ───────────────────────────────────
    const vio = new IntersectionObserver(entries => {
      entries.forEach(en => { visible = en.isIntersecting; });
    }, { threshold: 0.01 });
    vio.observe(host);

    // ── Resize debounce ───────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); refreshObstacles(); }, 80);
    }
    window.addEventListener('resize', onResize);

    resize();
    topUpFlow();
    setTimeout(refreshObstacles, 80);
    setTimeout(refreshObstacles, 600);
    setTimeout(refreshObstacles, 1600);
    tick();

    return () => {
      running = false;
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      host.removeEventListener('mousemove', onMouseMove);
      host.removeEventListener('touchstart', onTouchMove);
      host.removeEventListener('touchmove', onTouchMove);
      themeObs.disconnect();
      vio.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [hostRef]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
