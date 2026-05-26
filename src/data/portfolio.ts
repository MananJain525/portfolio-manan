export type Metric = [string, string];

export interface Project {
  id: string;
  title: string;
  tag: string;
  year: string;
  color: string;
  summary: string;
  role: string;
  stack: string;
  status: string;
  metrics: Metric[];
  tldr: string;
  bullets: string[];
}

export interface Skill {
  tag: string;
  note: string;
}

export const portfolio = {
  name: 'MANAN',
  nameSuffix: 'JAIN.',

  eyebrow: {
    school: 'BITS PILANI GOA · CLASS OF 2027',
    availability: 'AVAILABLE · SUMMER \'26',
  },

  tagline: {
    base: 'Building systems that ',
    words: [
      '.scale',
      '.compute',
      '.quantify',
      '.reason',
      '.hedge',
      '.execute',
      '.optimize',
      '.integrate',
      '.deploy',
      '.model',
    ],
  },

  bio: 'Exploring AI-native engineering, product thinking, and community at scale — through deliberate iteration. Currently shipping at the seam of design and code.',

  marquee: {
    items: [
      'Available for Summer 2026',
      'Product engineering',
      'AI-native interfaces',
      'Design systems',
      'Open to collaborations',
      'Goa → World',
    ],
  },

  about: {
    intro: {
      aboutMe:
        'I\'m Manan — a designer/engineer at BITS Goa, building at the seam between interfaces and inference. I like systems that feel calm under load and writing that earns its line breaks. Mostly happy in a terminal or a notebook.',
      currently: [
        'Shipping low-latency LLM infra for an early-stage team.',
        'Writing a weekly note on what broke and why.',
        'Learning CUDA, slowly and with great suffering.',
        'Open to summer \'26 internships.',
      ],
    },
    github: {
      handle: '@mananjain',
      period: '2025–26',
    },
    skills: [
      { tag: 'TypeScript',         note: 'everyday' },
      { tag: 'Python',             note: 'data + AI' },
      { tag: 'React / Next',       note: 'shipping' },
      { tag: 'Rust',               note: 'learning' },
      { tag: 'Swift',              note: 'mac/iOS' },
      { tag: 'Postgres',           note: 'pgvector' },
      { tag: 'LLM Infrastructure', note: 'on-device' },
      { tag: 'Vector DBs',         note: 'qdrant, pinecone' },
      { tag: 'Tailwind',           note: 'styling' },
      { tag: 'Framer Motion',      note: 'animation' },
      { tag: 'Cloudflare Workers', note: 'edge' },
      { tag: 'Figma',              note: 'fluent' },
      { tag: 'D3 / Visx',          note: 'data viz' },
      { tag: 'tRPC',               note: 'glue' },
      { tag: 'Docker',             note: 'shipping' },
      { tag: 'Astro / MDX',        note: 'writing' },
    ] as Skill[],
    skillsAlso: 'Design systems · LLM evals · Prompt eng · Postgres tuning · Editorial design',
  },

  projects: [
    {
      id: 'aura',
      title: 'Aura',
      tag: 'AI · Interface',
      year: '2025',
      color: '#7e1f1f',
      summary:
        'A native interface for AI assistance that prioritises voice + glance over chat. Built end-to-end: research → systems → ship.',
      role: 'Solo · Design + Eng',
      stack: 'Swift, MLX, Tailwind',
      status: 'Beta',
      metrics: [['STATUS', 'Beta'], ['USERS', '1.2k+'], ['LATENCY', '198ms']] as Metric[],
      tldr: 'Voice-first AI command bar with on-device inference. Replaces ~80% of chat-style interactions with a single glanceable surface.',
      bullets: [
        'Designed a minimal command-bar paradigm that replaces 80% of chat turns.',
        'Shipped on-device inference with sub-200ms first-token latency.',
        'Onboarded 1.2k early users via Twitter + IndieHackers.',
      ],
    },
    {
      id: 'paper',
      title: 'Paper Trail',
      tag: 'Tooling · OSS',
      year: '2025',
      color: '#1f3a3a',
      summary:
        'A reading companion that turns highlights into a personal knowledge graph. Open source, weekend project that got loud.',
      role: 'OSS Maintainer',
      stack: 'Next.js, Postgres, pgvector',
      status: 'v0.3',
      metrics: [['STATUS', 'v0.3'], ['STARS', '1.4k'], ['GRAPHS', '3.2k']] as Metric[],
      tldr: 'Turns reading highlights into a per-user knowledge graph using pgvector embeddings. Open source; weekend project that hit HN front page.',
      bullets: [
        '1.4k GitHub stars in the first month.',
        'Wrote the first version of the highlights-to-graph algorithm.',
        'Featured in two newsletters.',
      ],
    },
    {
      id: 'campus',
      title: 'Campus Compass',
      tag: 'Community · Product',
      year: '2024',
      color: '#3a2f1f',
      summary:
        'A campus-wide event + mentorship platform used by 2k students at BITS Goa. Designed, built, and runs on a Cloudflare worker.',
      role: 'PM + Eng',
      stack: 'Remix, D1, Cloudflare Workers',
      status: 'Live',
      metrics: [['STATUS', 'Deployed'], ['USERS', '2.0k'], ['LATENCY', '42ms']] as Metric[],
      tldr: 'Campus event + mentorship hub for 2k students, running entirely on a Cloudflare Worker + D1. Onboarded 28 clubs in one semester.',
      bullets: [
        'Onboarded 28 student clubs in the first semester.',
        'Reduced event coordination time from days to minutes.',
        'Built with two friends over 14 weekends.',
      ],
    },
    {
      id: 'kerning',
      title: 'Kerning',
      tag: 'Type · Tool',
      year: '2024',
      color: '#444',
      summary:
        'A tiny browser tool for letterpair kerning practice. Started as a tweet, became a thing typographers actually use.',
      role: 'Solo',
      stack: 'Svelte, Variable fonts',
      status: 'Live',
      metrics: [['STATUS', 'Live'], ['USERS', '12k'], ['SESSIONS', '38k']] as Metric[],
      tldr: 'Lightweight Svelte tool for practising letter-pair kerning by ear-and-eye. Quietly adopted by two type design programs.',
      bullets: [
        '12k unique users since launch.',
        'Used at two type design workshops.',
        'Featured by Sidebar.io.',
      ],
    },
    {
      id: 'fold',
      title: 'Fold',
      tag: 'Experiment · Motion',
      year: '2023',
      color: '#5d6b27',
      summary:
        'A scroll-driven essay about origami, paper engineering, and software architecture. A love letter to slow web.',
      role: 'Solo · Design + Eng',
      stack: 'GSAP, WebGL',
      status: 'Archived',
      metrics: [['STATUS', 'Archived'], ['VIEWS', '84k'], ['FPS', '60']] as Metric[],
      tldr: 'Scroll-driven WebGL essay on origami as a metaphor for software architecture. Two-week build, picked up on Awwwards.',
      bullets: [
        'Two-week build, viral on Awwwards.',
        'Sparked an ongoing essay series.',
        'Taught me to think in keyframes.',
      ],
    },
    {
      id: 'studio',
      title: 'Studio Notes',
      tag: 'Writing · Habit',
      year: 'Ongoing',
      color: '#7e1f1f',
      summary:
        'A weekly note about what I shipped, what I learned, and what broke. Long-running attempt at thinking in public.',
      role: 'Solo',
      stack: 'Astro, MDX',
      status: 'Weekly',
      metrics: [['STATUS', 'Weekly'], ['ISSUES', '72'], ['SUBS', '600+']] as Metric[],
      tldr: 'Weekly long-form notes on what I shipped, broke, and learned. Three years running; 600+ subscribers and counting.',
      bullets: [
        '72 issues and counting.',
        '600+ subscribers.',
        'Best decision I made in 2023.',
      ],
    },
  ] as Project[],

  contact: {
    email: 'mananjaingadiya@gmail.com',
    location: 'Goa, India · UTC+5:30',
    socials: {
      github: 'https://github.com/mananjain',
      linkedin: 'https://linkedin.com/in/mananjain',
      twitter: 'https://twitter.com/mananjain',
    },
    formNote: 'Replies within ~48h',
    successMessage: 'Message sent. I\'ll be in touch.',
  },

  footer: {
    copyright: '© 2026 · MANAN JAIN',
    tagline: 'Designed in Goa · Built deliberately',
  },
} as const;
