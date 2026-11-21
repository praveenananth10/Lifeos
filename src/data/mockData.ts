import type { Task, MetricStat } from '../types';

export const SAMPLE_STATS: MetricStat[] = [
  { label: 'Weekly Focus Score', value: '94%', change: '+6%', trend: 'up' },
  { label: 'Tasks Completed', value: '28/32', change: '+12%', trend: 'up' },
  { label: 'Deep Work Hours', value: '34.5 hrs', change: '+2.5 hrs', trend: 'up' },
  { label: 'Active Projects', value: '4', change: 'On Track', trend: 'neutral' },
];

export const SAMPLE_TASKS: Task[] = [
  {
    id: 'tsk-001',
    title: 'Finalize LifeOS Design System Tokens',
    description: 'Ensure color variables, typography, and crisp borders align across both themes.',
    category: 'Work',
    completed: false,
    priority: 'high',
    dueDate: '2026-11-20',
    createdAt: '2026-11-20T08:00:00Z',
  },
  {
    id: 'tsk-002',
    title: 'Weekly Life Architecture Review',
    description: 'Review habit consistency, project progress, and cognitive load.',
    category: 'Personal',
    completed: false,
    priority: 'high',
    dueDate: '2026-11-21',
    createdAt: '2026-11-19T10:30:00Z',
  },
  {
    id: 'tsk-003',
    title: 'Archive Completed Milestones for Q4',
    description: 'Clean up workspace state to keep cognitive friction at zero.',
    category: 'Work',
    completed: true,
    priority: 'low',
    dueDate: '2026-11-19',
    createdAt: '2026-11-18T14:15:00Z',
  },
];
