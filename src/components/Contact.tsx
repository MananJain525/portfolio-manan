'use client';

import { useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { sendEmail } from '@/actions/sendEmail';

const { contact } = portfolio;

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [k]: e.target.value });
    setErrors({ ...errors, [k]: null });
    setServerError(null);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Tell me your name';
    if (!form.email.trim()) e.email = 'I need an email to reply';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'That email looks off';
    if (form.message.trim().length < 10) e.message = 'Give me a bit more (10+ chars)';
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSending(true);
    setServerError(null);

    const result = await sendEmail(form);

    setSending(false);

    if (result.status === 'success') {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setForm({ name: '', email: '', message: '' });
      }, 3200);
    } else {
      setServerError(result.message);
    }
  };

  return (
    <section id="contact" data-screen-label="Contact">
      <div className="sec-head" data-reveal>
        <div className="num">03 / Contact</div>
        <h2>Let&rsquo;s <em>make something</em>.</h2>
      </div>

      <div className="contact-grid">
        <div data-reveal>
          <p className="contact-lead">
            Have a problem worth <em>thinking</em> hard about?{' '}
            I&rsquo;m slow to reply but I read every note.
          </p>

          <nav className="contact-socials" aria-label="Social links">
            <a href={contact.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" data-cursor-hover>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>
              </svg>
            </a>
            <a href={contact.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" data-cursor-hover>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/>
                <rect x="2" y="9" width="4" height="12" rx="0.5"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href={contact.socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter / X" data-cursor-hover>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3Z"/>
              </svg>
            </a>
            <a href={`mailto:${contact.email}`} aria-label="Email" data-cursor-hover>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-10 6L2 7"/>
              </svg>
            </a>
          </nav>

          <div className="contact-meta">
            <div>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
            <div style={{ marginTop: 16 }}>{contact.location}</div>
          </div>
        </div>

        {/* IDE-window contact form */}
        <div className="ide-shell" data-reveal>
          <div className="ide-head">
            <div className="ide-dots" aria-hidden="true">
              <span /><span /><span />
            </div>
            <div className="ide-title">contact.ts</div>
            <div className="ide-dots-spacer" aria-hidden="true" />
          </div>

          <form className="ide-form" onSubmit={onSubmit} noValidate>
            <label className={`field ${errors.name ? 'error' : ''}`}>
              <span className="ide-key">const name <span className="ide-op">=</span></span>
              <input value={form.name} onChange={set('name')} placeholder='"Your name"' disabled={sending} />
              <span className="err">{errors.name || ''}</span>
            </label>
            <label className={`field ${errors.email ? 'error' : ''}`}>
              <span className="ide-key">const email <span className="ide-op">=</span></span>
              <input value={form.email} onChange={set('email')} placeholder='"you@studio.com"' type="email" disabled={sending} />
              <span className="err">{errors.email || ''}</span>
            </label>
            <label className={`field ${errors.message ? 'error' : ''}`}>
              <span className="ide-key">const message <span className="ide-op">=</span></span>
              <textarea value={form.message} onChange={set('message')} placeholder='"Tell me about it…"' disabled={sending} />
              <span className="err">{errors.message || ''}</span>
            </label>
            <button type="submit" className="ide-exec" data-cursor-hover disabled={sending}>
              <span className="ide-exec-l">{sending ? '~/sending…' : '~/send_message.sh'}</span>
              <span className="ide-exec-r" aria-hidden="true">→</span>
            </button>
            <div className="ide-foot">
              {sent
                ? <span className="sent">{contact.successMessage}</span>
                : serverError
                ? <span className="err">{serverError}</span>
                : <span className="note">{contact.formNote}</span>
              }
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
