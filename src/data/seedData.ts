import type {
  Task,
  CalendarEvent,
  Habit,
  Transaction,
  Note,
  Goal,
  FocusSession,
} from '../types/lifeos';

export const TODAY_DATE = '2026-11-20';
export const DEFAULT_MONTHLY_BUDGET = 3500;

export const SEED_TASKS: Task[] = [
  {
    id: 'tsk-101',
    title: 'Review LifeOS Q4 Design Tokens & Component Hierarchy',
    description: 'Ensure contrast compliance across dark mode surfaces and button hover states.',
    category: 'Work',
    priority: 'high',
    dueDate: '2026-11-20',
    completed: false,
    createdAt: '2026-11-19T09:00:00Z',
  },
  {
    id: 'tsk-102',
    title: 'Ship Data Store & Centralized LifeOS Context',
    description: 'Connect localStorage persistence with clean reactive hooks across all modules.',
    category: 'Work',
    priority: 'high',
    dueDate: '2026-11-20',
    completed: true,
    createdAt: '2026-11-19T11:30:00Z',
  },
  {
    id: 'tsk-103',
    title: 'Weekly Budget Reconciliation & Expense Tagging',
    description: 'Review bank statement against monthly allocations and update savings forecast.',
    category: 'Finance',
    priority: 'medium',
    dueDate: '2026-11-20',
    completed: false,
    createdAt: '2026-11-18T14:00:00Z',
  },
  {
    id: 'tsk-104',
    title: 'Read 2 chapters of "Atomic Habits"',
    description: 'Focus on identity-based habits and friction reduction techniques.',
    category: 'Personal',
    priority: 'low',
    dueDate: '2026-11-20',
    completed: false,
    createdAt: '2026-11-19T18:00:00Z',
  },
  {
    id: 'tsk-105',
    title: 'Prepare System Architecture Notes for Team Sync',
    description: 'Draft diagrams showing Supabase schema parity with frontend TypeScript models.',
    category: 'Study',
    priority: 'medium',
    dueDate: '2026-11-21',
    completed: false,
    createdAt: '2026-11-19T16:20:00Z',
  },
  {
    id: 'tsk-106',
    title: 'Hydration Target: 3.0 Liters',
    description: 'Track daily water intake for focus and cognitive stamina.',
    category: 'Health',
    priority: 'low',
    dueDate: '2026-11-20',
    completed: true,
    createdAt: '2026-11-20T07:00:00Z',
  },
];

export const SEED_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-201',
    title: 'Deep Focus: Core Architecture Sprint',
    date: '2026-11-20',
    startTime: '09:00',
    endTime: '11:00',
    type: 'focus',
    location: 'Focus Chamber',
  },
  {
    id: 'evt-202',
    title: 'Product Design & Token Alignment Review',
    date: '2026-11-20',
    startTime: '13:30',
    endTime: '14:30',
    type: 'event',
    location: 'Design Studio / Zoom',
  },
  {
    id: 'evt-203',
    title: 'Sprint 4 Code Freeze & Build Verification',
    date: '2026-11-20',
    startTime: '17:00',
    endTime: '17:30',
    type: 'deadline',
  },
  {
    id: 'evt-204',
    title: 'Weekly LifeOS Strategy Planning',
    date: '2026-11-21',
    startTime: '10:00',
    endTime: '11:30',
    type: 'event',
    location: 'Workspace',
  },
];

export const SEED_HABITS: Habit[] = [
  {
    id: 'hbt-301',
    name: 'Morning Hydration (750ml)',
    category: 'Health',
    streak: 18,
    completedDates: ['2026-11-18', '2026-11-19', '2026-11-20'],
    targetDaysPerWeek: 7,
  },
  {
    id: 'hbt-302',
    name: 'Mindful Meditation (15 mins)',
    category: 'Mindfulness',
    streak: 9,
    completedDates: ['2026-11-18', '2026-11-19', '2026-11-20'],
    targetDaysPerWeek: 7,
  },
  {
    id: 'hbt-303',
    name: 'Deep Technical Reading',
    category: 'Learning',
    streak: 12,
    completedDates: ['2026-11-18', '2026-11-19'],
    targetDaysPerWeek: 5,
  },
  {
    id: 'hbt-304',
    name: 'Strength Workout / 5k Run',
    category: 'Fitness',
    streak: 5,
    completedDates: ['2026-11-17', '2026-11-19'],
    targetDaysPerWeek: 4,
  },
];

export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-401',
    title: 'Cloud Hosting & CI/CD Infrastructure',
    amount: 145.0,
    type: 'expense',
    category: 'Technology',
    date: '2026-11-19',
  },
  {
    id: 'txn-402',
    title: 'Client Consulting Retainer (Nov)',
    amount: 4200.0,
    type: 'income',
    category: 'Consulting',
    date: '2026-11-15',
  },
  {
    id: 'txn-403',
    title: 'Organic Groceries & Meal Prep',
    amount: 215.5,
    type: 'expense',
    category: 'Groceries',
    date: '2026-11-18',
  },
  {
    id: 'txn-404',
    title: 'Gym & Recovery Club Membership',
    amount: 85.0,
    type: 'expense',
    category: 'Health',
    date: '2026-11-05',
  },
  {
    id: 'txn-405',
    title: 'Artisan Coffee & Work Session',
    amount: 18.25,
    type: 'expense',
    category: 'Dining',
    date: '2026-11-20',
  },
  {
    id: 'txn-406',
    title: 'Technical Books & Course Subscriptions',
    amount: 120.0,
    type: 'expense',
    category: 'Education',
    date: '2026-11-12',
  },
];

export const SEED_NOTES: Note[] = [
  {
    id: 'not-501',
    title: 'LifeOS System Philosophy & Guardrails',
    content:
      'The core ethos is radical calm: low noise, zero cluttered dashboards, high intent. Everything flows from Inbox -> Day Sprint -> Deep Execution.',
    category: 'Work',
    isJournal: false,
    checklist: [
      { id: 'chk-1', text: 'Define 1px crisp border tokens', done: true },
      { id: 'chk-2', text: 'Eliminate loud gradients and noisy charts', done: true },
      { id: 'chk-3', text: 'Build modular data store with React Context', done: true },
    ],
    updatedAt: '2026-11-20T10:15:00Z',
  },
  {
    id: 'not-502',
    title: 'Daily Evening Reflection: Friday Momentum',
    content:
      'Excellent focus on engineering foundations today. Keeping meetings minimal unlocked 3 hours of uninterrupted deep work.',
    category: 'Journal',
    isJournal: true,
    checklist: [
      { id: 'chk-4', text: 'Review habit consistency', done: true },
      { id: 'chk-5', text: 'Clear inbox to zero', done: false },
      { id: 'chk-6', text: 'Prep top 3 targets for tomorrow', done: true },
    ],
    updatedAt: '2026-11-20T18:45:00Z',
  },
];

export const SEED_GOALS: Goal[] = [
  {
    id: 'gol-601',
    title: 'Ship LifeOS 1.0 Production Platform',
    description: 'Complete all 9 stages: Auth, Data Store, Tasks, Calendar, Habits, Finance, Notes, and AI.',
    horizon: 'short-term',
    targetDate: '2026-12-15',
    milestones: [
      { id: 'm-1', title: 'Stage 1: Design System & Tokens', completed: true },
      { id: 'm-2', title: 'Stage 2: Landing Page & Router', completed: true },
      { id: 'm-3', title: 'Stage 3: Auth Layout & Session Context', completed: true },
      { id: 'm-4', title: 'Stage 4: AppShell & Live Store Dashboard', completed: true },
      { id: 'm-5', title: 'Stage 5: Deep Task Manager & Kanban', completed: false },
    ],
  },
  {
    id: 'gol-602',
    title: 'Achieve Sub-45 Min 10k Run Time',
    description: 'Consistent weekly mileage, interval speed workouts, and zone-2 base building.',
    horizon: 'long-term',
    targetDate: '2027-03-30',
    milestones: [
      { id: 'm-6', title: 'Build 35km/week endurance base', completed: true },
      { id: 'm-7', title: 'Track heart rate variability & recovery', completed: true },
      { id: 'm-8', title: 'Run official 10k time trial under 48m', completed: false },
    ],
  },
  {
    id: 'gol-603',
    title: 'Build $20,000 Liquid Emergency Reserve',
    description: 'Fund high-yield liquid reserve to guarantee 6 months of zero-stress financial runway.',
    horizon: 'long-term',
    targetDate: '2027-06-30',
    milestones: [
      { id: 'm-9', title: 'Reach $10,000 baseline milestone', completed: true },
      { id: 'm-10', title: 'Automate 25% recurring monthly transfers', completed: true },
      { id: 'm-11', title: 'Reach full $20,000 reserve goal', completed: false },
    ],
  },
];

export const SEED_FOCUS_SESSIONS: FocusSession[] = [
  {
    id: 'foc-701',
    label: 'Architecture & Token Design',
    durationMinutes: 25,
    completedAt: '2026-11-20T09:30:00Z',
    mode: 'pomodoro',
  },
  {
    id: 'foc-702',
    label: 'Router & Landing Page Sprint',
    durationMinutes: 25,
    completedAt: '2026-11-20T10:15:00Z',
    mode: 'pomodoro',
  },
  {
    id: 'foc-703',
    label: 'State Store Implementation',
    durationMinutes: 20,
    completedAt: '2026-11-20T11:45:00Z',
    mode: 'custom',
  },
];

