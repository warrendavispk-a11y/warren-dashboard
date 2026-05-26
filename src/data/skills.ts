export type SkillStatus = 'idle' | 'running' | 'done' | 'error'

export interface Skill {
  command: string
  role: string
  description: string
  status: SkillStatus
  lastRun?: string
  duration?: string
}

export interface SkillCategory {
  id: string
  title: string
  icon: string
  color: string
  skills: Skill[]
}

export const categories: SkillCategory[] = [
  {
    id: 'planning',
    title: 'Planning',
    icon: 'Lightbulb',
    color: 'amber',
    skills: [
      {
        command: '/office-hours',
        role: 'YC Office Hours',
        description: 'Six forcing questions that reframe products before coding',
        status: 'done',
        lastRun: '2h ago',
        duration: '4m 12s',
      },
      {
        command: '/plan-ceo-review',
        role: 'CEO / Founder',
        description: 'Strategic rethinking with four scope modes',
        status: 'idle',
      },
      {
        command: '/plan-eng-review',
        role: 'Engineering Manager',
        description: 'Locks architecture, data flow, edge cases, test plans',
        status: 'done',
        lastRun: '3h ago',
        duration: '6m 48s',
      },
      {
        command: '/plan-design-review',
        role: 'Senior Designer',
        description: 'Rates design dimensions 0-10, identifies gaps',
        status: 'idle',
      },
      {
        command: '/autoplan',
        role: 'Review Pipeline',
        description: 'CEO → design → eng reviews automatically with decision filters',
        status: 'running',
        lastRun: '12m ago',
      },
    ],
  },
  {
    id: 'building',
    title: 'Building',
    icon: 'Code2',
    color: 'blue',
    skills: [
      {
        command: '/design-consultation',
        role: 'Design Partner',
        description: 'Builds complete design systems from scratch',
        status: 'done',
        lastRun: '1h ago',
        duration: '8m 33s',
      },
      {
        command: '/design-shotgun',
        role: 'Design Explorer',
        description: 'Generates 4-6 AI mockup variants with comparison board',
        status: 'idle',
      },
      {
        command: '/design-html',
        role: 'Design Engineer',
        description: 'Converts mockups to production HTML — 30KB, zero deps',
        status: 'done',
        lastRun: '45m ago',
        duration: '3m 20s',
      },
      {
        command: '/review',
        role: 'Staff Engineer',
        description: 'Finds production bugs, auto-fixes obvious issues, flags gaps',
        status: 'idle',
      },
      {
        command: '/investigate',
        role: 'Debugger',
        description: 'Systematic root-cause analysis with hypothesis testing',
        status: 'error',
        lastRun: '30m ago',
        duration: '2m 05s',
      },
    ],
  },
  {
    id: 'quality',
    title: 'Quality & Security',
    icon: 'ShieldCheck',
    color: 'green',
    skills: [
      {
        command: '/qa',
        role: 'QA Lead',
        description: 'Browser testing, bug detection, atomic fixes, regression tests',
        status: 'running',
        lastRun: '5m ago',
      },
      {
        command: '/qa-only',
        role: 'QA Reporter',
        description: 'Testing without code changes — pure bug reporting',
        status: 'idle',
      },
      {
        command: '/cso',
        role: 'Chief Security Officer',
        description: 'OWASP Top 10 + STRIDE threat modeling with exploit scenarios',
        status: 'done',
        lastRun: '6h ago',
        duration: '11m 44s',
      },
      {
        command: '/benchmark',
        role: 'Performance Engineer',
        description: 'Page load times, Core Web Vitals, resource size baselines',
        status: 'idle',
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping & Ops',
    icon: 'Rocket',
    color: 'purple',
    skills: [
      {
        command: '/ship',
        role: 'Release Engineer',
        description: 'Sync main, run tests, audit coverage, push, open PR',
        status: 'done',
        lastRun: '2h ago',
        duration: '5m 18s',
      },
      {
        command: '/land-and-deploy',
        role: 'Release Engineer',
        description: 'Merge PR, wait for CI/deploy, verify production health',
        status: 'idle',
      },
      {
        command: '/canary',
        role: 'SRE',
        description: 'Post-deploy monitoring for console errors and regressions',
        status: 'idle',
      },
      {
        command: '/document-release',
        role: 'Technical Writer',
        description: 'Auto-updates docs to match shipped changes; catches drift',
        status: 'done',
        lastRun: '2h ago',
        duration: '2m 51s',
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Tools',
    icon: 'Zap',
    color: 'teal',
    skills: [
      {
        command: '/browse',
        role: 'QA Engineer',
        description: 'Real Chromium browser, screenshots, ~100ms per command',
        status: 'idle',
      },
      {
        command: '/pair-agent',
        role: 'Multi-Agent Coordinator',
        description: 'Shares browser across AI agents with scoped tokens',
        status: 'idle',
      },
      {
        command: '/codex',
        role: 'Cross-Vendor Review',
        description: 'Independent review from OpenAI Codex CLI; three modes',
        status: 'idle',
      },
      {
        command: '/learn',
        role: 'Memory',
        description: 'Manages learnings across sessions; per-project patterns',
        status: 'done',
        lastRun: '1d ago',
        duration: '1m 02s',
      },
      {
        command: '/retro',
        role: 'Engineering Manager',
        description: 'Weekly retrospectives with shipping streaks, test trends',
        status: 'idle',
      },
    ],
  },
]

export const sprintStages = [
  { label: 'Think', icon: 'Brain', active: true, done: true },
  { label: 'Plan', icon: 'ClipboardList', active: true, done: true },
  { label: 'Build', icon: 'Code2', active: true, done: false },
  { label: 'Review', icon: 'Eye', active: false, done: false },
  { label: 'Test', icon: 'FlaskConical', active: false, done: false },
  { label: 'Ship', icon: 'Rocket', active: false, done: false },
  { label: 'Reflect', icon: 'RotateCcw', active: false, done: false },
]

export const metrics = [
  { label: 'Productivity Gain', value: '810×', sub: 'vs 2013 baseline', color: 'text-accent-blue' },
  { label: 'Skills Active', value: '32', sub: 'across 5 categories', color: 'text-accent-purple' },
  { label: 'Features Shipped', value: '40+', sub: 'last 60 days', color: 'text-accent-green' },
  { label: 'Concurrent Sprints', value: '12', sub: 'via Conductor', color: 'text-accent-amber' },
]

export const recentActivity = [
  { skill: '/ship', status: 'done', message: 'PR #47 opened — warren-dashboard v0.3.1', time: '2h ago', color: 'green' },
  { skill: '/qa', status: 'running', message: 'Running browser regression suite…', time: '5m ago', color: 'blue' },
  { skill: '/autoplan', status: 'running', message: 'CEO review queued → eng review next', time: '12m ago', color: 'amber' },
  { skill: '/investigate', status: 'error', message: 'Hydration mismatch in <MetricsBar />', time: '30m ago', color: 'red' },
  { skill: '/cso', status: 'done', message: 'OWASP audit passed — 0 critical findings', time: '6h ago', color: 'green' },
  { skill: '/design-html', status: 'done', message: 'Sprint card component — 28KB, zero deps', time: '45m ago', color: 'green' },
]
