/**
 * LifeOS Core Data Models (Supabase/PostgreSQL schema ready)
 */

export type TaskCategory = 'Work' | 'Study' | 'Personal' | 'Health' | 'Finance';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string;
}

export type CalendarEventType = 'event' | 'deadline' | 'focus';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: CalendarEventType;
  location?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  streak: number;
  completedDates: string[]; // YYYY-MM-DD[]
  targetDaysPerWeek: number;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
}

export type NoteCategory = 'Personal' | 'Study' | 'Work' | 'Journal';

export interface NoteChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  isJournal: boolean;
  checklist?: NoteChecklistItem[];
  updatedAt: string;
}

export type GoalHorizon = 'short-term' | 'long-term';

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  horizon: GoalHorizon;
  targetDate: string; // YYYY-MM-DD
  milestones: GoalMilestone[];
}

export type FocusMode = 'pomodoro' | 'custom';

export interface FocusSession {
  id: string;
  label: string;
  durationMinutes: number;
  completedAt: string;
  mode: FocusMode;
}

