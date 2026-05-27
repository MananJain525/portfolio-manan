'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const IDLE_MS   = 15_000;
const IDLE_HOLD = 4_000;
const TYPE_SPD  = 26; // ms / char

const IDLE_LINES = [
  '[SYS]: Checking latent space…',
  '[SYS]: Field coherence nominal.',
  '[SYS]: Tracing vector drift…',
  '[SYS]: Cursor entropy: 0.47',
  '[SYS]: Caching last 4096 frames.',
  '[SYS]: Awaiting input…',
];

type Row = { id: number; text: string; cls: 'sys' | 'bot' | 'user' };
let _id = 0;

function pickReply(raw: string): string {
  const s = raw.toLowerCase().trim();
  if (!s)                               return 'Empty command. Try: help, stack, work, contact.';
  if (/^help/.test(s))                  return 'commands: stack · work · contact · theme · clear';
  if (/stack|tech|build/.test(s))      return 'Python + TS, distributed training, prod LLM infra.';
  if (/work|project/.test(s))          return 'See section 02 above — each row is a case study.';
  if (/contact|email|hire/.test(s))    return 'Scroll to section 04. He reads everything.';
  if (/theme|dark|light/.test(s))      return 'Toggle in the pill nav at the bottom of the page.';
  if (/^(hi|hello|hey|sup)/.test(s))  return 'hey. orbital.sh online — ask me about the work.';
  return 'unknown command. try: help';
}

export function CliPhantom() {
  const [open, setOpen]         = useState(false);
  const [idle, setIdle]         = useState(false);
  const [idleLine, setIdleLine] = useState('');
  const [rows, setRows]         = useState<Row[]>([]);
  const [greeted, setGreeted]   = useState(false);
  const [input, setInput]       = useState('');

  const openRef    = useRef(false);
  const inputEl    = useRef<HTMLInputElement>(null);
  const logEl      = useRef<HTMLDivElement>(null);
  const idleTimer  = useRef<ReturnType<typeof setTimeout>>();
  const typeTimer  = useRef<ReturnType<typeof setTimeout>>();
  const holdTimer  = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { openRef.current = open; }, [open]);

  // Auto-scroll log on new messages
  useEffect(() => {
    if (logEl.current) logEl.current.scrollTop = logEl.current.scrollHeight;
  }, [rows]);

  // Typewriter for idle line
  const typeIdle = useCallback((text: string) => {
    let i = 0;
    function step() {
      if (openRef.current) { setIdleLine(''); return; }
      setIdleLine(text.slice(0, i++));
      if (i <= text.length) {
        typeTimer.current = setTimeout(step, TYPE_SPD + Math.random() * 18);
      } else {
        holdTimer.current = setTimeout(() => {
          setIdle(false);
          setIdleLine('');
        }, IDLE_HOLD);
      }
    }
    step();
  }, []);

  const armIdle = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (openRef.current) return;
      const line = IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)];
      setIdle(true);
      setTimeout(() => typeIdle(line), 320);
    }, IDLE_MS);
  }, [typeIdle]);

  useEffect(() => {
    armIdle();
    const bump = () => armIdle();
    window.addEventListener('mousemove', bump, { passive: true });
    window.addEventListener('keydown', bump);
    window.addEventListener('scroll', bump, { passive: true });
    return () => {
      clearTimeout(idleTimer.current);
      clearTimeout(typeTimer.current);
      clearTimeout(holdTimer.current);
      window.removeEventListener('mousemove', bump);
      window.removeEventListener('keydown', bump);
      window.removeEventListener('scroll', bump);
    };
  }, [armIdle]);

  // Escape closes; 'cli-open' custom event (from MobileFab) opens
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && openRef.current) handleClose();
    }
    function onCliOpen() { handleOpen(); }
    window.addEventListener('keydown', onKey);
    window.addEventListener('cli-open', onCliOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('cli-open', onCliOpen);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOpen() {
    if (open) return;
    clearTimeout(typeTimer.current);
    clearTimeout(holdTimer.current);
    setIdle(false);
    setIdleLine('');
    setOpen(true);
    if (!greeted) {
      setGreeted(true);
      setTimeout(() => {
        setRows([
          { id: _id++, text: `orbital.sh v0.4 — booted ${new Date().toLocaleTimeString()}`, cls: 'sys' },
          { id: _id++, text: 'Hi. I\'m a stand-in for Manan. Type "help" for commands.', cls: 'bot' },
        ]);
      }, 380);
    }
    setTimeout(() => inputEl.current?.focus(), 480);
  }

  function handleClose() {
    setOpen(false);
    armIdle();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = input.trim();
    if (!v) return;
    setInput('');
    if (v.toLowerCase() === 'clear') { setRows([]); return; }
    setRows(prev => [...prev, { id: _id++, text: v, cls: 'user' }]);
    const r = pickReply(v);
    setTimeout(() => setRows(prev => [...prev, { id: _id++, text: r, cls: 'bot' }]), 220);
  }

  return (
    <div className={`cli-root${idle ? ' is-idle' : ''}${open ? ' is-open' : ''}`}>
      <motion.div
        className="cli-pill"
        role="button"
        tabIndex={0}
        aria-label={open ? 'Terminal open' : 'Open terminal companion'}
        data-cursor-hover
        onClick={() => !open && handleOpen()}
        onKeyDown={e => {
          if (!open && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleOpen(); }
        }}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.15 }}
      >
        <span className="cli-prompt">&gt;_<span className="cli-blink" /></span>
        <span className="cli-line" aria-live="polite">{idleLine}</span>

        <AnimatePresence>
          {open && (
            <motion.div
              className="cli-term"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.22 } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              <div className="cli-head">
                <b>orbital.sh</b>
                <button
                  className="cli-close"
                  aria-label="Close terminal"
                  onClick={e => { e.stopPropagation(); handleClose(); }}
                >×</button>
              </div>
              <div className="cli-log" ref={logEl}>
                {rows.map(r => (
                  <div key={r.id} className={`cli-row ${r.cls}`}>{r.text}</div>
                ))}
              </div>
              <form
                className="cli-form"
                onSubmit={handleSubmit}
                autoComplete="off"
                onClick={e => e.stopPropagation()}
              >
                <span>&gt;</span>
                <input
                  ref={inputEl}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="type a command…"
                  aria-label="Terminal input"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
