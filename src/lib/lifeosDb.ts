import { supabase } from './supabase';
import type {
  Task,
  CalendarEvent,
  CalendarEventType,
  Habit,
  Transaction,
  Note,
  NoteCategory,
  Goal,
  GoalHorizon,
  FocusSession,
  FocusMode,
  TaskCategory,
  TaskPriority,
} from '../types/lifeos';
import {
  DEFAULT_MONTHLY_BUDGET,
  SEED_TASKS,
  SEED_EVENTS,
  SEED_HABITS,
  SEED_TRANSACTIONS,
  SEED_NOTES,
  SEED_GOALS,
  SEED_FOCUS_SESSIONS,
} from '../data/seedData';

// Generate standard UUID v4 for PostgreSQL UUID/Text primary keys
export function generateEntityId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// -------------------------------------------------------------
// Database Row Types (PostgreSQL snake_case schema)
// -------------------------------------------------------------

export interface DbUserSettings {
  user_id: string;
  monthly_budget: number;
}

export interface DbTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string;
  category: string;
  completed: boolean;
  created_at?: string;
}

export interface DbCalendarEvent {
  id: string;
  user_id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  category: string;
  notes: string | null;
}

export interface DbHabit {
  id: string;
  user_id: string;
  name: string;
  category: string;
  target_days_per_week: number;
  completed_dates: string[];
  streak: number;
}

export interface DbTransaction {
  id: string;
  user_id: string;
  title: string;
  amount: number | string;
  type: string;
  category: string;
  date: string;
}

export interface DbNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_journal: boolean;
  checklist: unknown;
  updated_at: string;
}

export interface DbGoal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  horizon: string;
  target_date: string;
  milestones: unknown;
}

export interface DbFocusSession {
  id: string;
  user_id: string;
  label: string;
  duration_minutes: number;
  mode: string;
  completed_at: string;
}

// -------------------------------------------------------------
// Model Mappers: PostgreSQL snake_case <-> TypeScript camelCase
// -------------------------------------------------------------

export function mapDbTaskToTask(db: DbTask): Task {
  const isDone =
    typeof db.completed === 'boolean'
      ? db.completed
      : db.status === 'done' || db.status === 'completed';
  return {
    id: db.id,
    title: db.title,
    description: db.description || undefined,
    priority: (db.priority as TaskPriority) || 'medium',
    category: (db.category as TaskCategory) || 'Work',
    dueDate: db.due_date,
    completed: isDone,
    createdAt: db.created_at || new Date().toISOString(),
  };
}

export function mapTaskToDb(task: Task, userId: string): DbTask {
  return {
    id: task.id,
    user_id: userId,
    title: task.title,
    description: task.description || null,
    priority: task.priority,
    status: task.completed ? 'done' : 'todo',
    due_date: task.dueDate,
    category: task.category,
    completed: Boolean(task.completed),
  };
}

export function mapDbEventToEvent(db: DbCalendarEvent): CalendarEvent {
  return {
    id: db.id,
    title: db.title,
    date: db.date,
    startTime: db.start_time,
    endTime: db.end_time,
    type: (db.category as CalendarEventType) || 'event',
    location: db.notes || undefined,
  };
}

export function mapEventToDb(event: CalendarEvent, userId: string): DbCalendarEvent {
  return {
    id: event.id,
    user_id: userId,
    title: event.title,
    date: event.date,
    start_time: event.startTime,
    end_time: event.endTime,
    category: event.type,
    notes: event.location || null,
  };
}

export function mapDbHabitToHabit(db: DbHabit): Habit {
  return {
    id: db.id,
    name: db.name,
    category: db.category,
    targetDaysPerWeek: Number(db.target_days_per_week) || 1,
    completedDates: Array.isArray(db.completed_dates) ? db.completed_dates : [],
    streak: Number(db.streak) || 0,
  };
}

export function mapHabitToDb(habit: Habit, userId: string): DbHabit {
  return {
    id: habit.id,
    user_id: userId,
    name: habit.name,
    category: habit.category,
    target_days_per_week: habit.targetDaysPerWeek,
    completed_dates: habit.completedDates,
    streak: habit.streak,
  };
}

export function mapDbTransactionToTransaction(db: DbTransaction): Transaction {
  return {
    id: db.id,
    title: db.title,
    amount: typeof db.amount === 'number' ? db.amount : parseFloat(String(db.amount)) || 0,
    type: db.type === 'income' ? 'income' : 'expense',
    category: db.category,
    date: db.date,
  };
}

export function mapTransactionToDb(tx: Transaction, userId: string): DbTransaction {
  return {
    id: tx.id,
    user_id: userId,
    title: tx.title,
    amount: tx.amount,
    type: tx.type,
    category: tx.category,
    date: tx.date,
  };
}

export function mapDbNoteToNote(db: DbNote): Note {
  let checklist: Note['checklist'] = [];
  if (Array.isArray(db.checklist)) {
    checklist = db.checklist;
  }
  return {
    id: db.id,
    title: db.title,
    content: db.content || '',
    category: (db.category as NoteCategory) || 'Personal',
    isJournal: Boolean(db.is_journal),
    checklist,
    updatedAt: db.updated_at,
  };
}

export function mapNoteToDb(note: Note, userId: string): DbNote {
  return {
    id: note.id,
    user_id: userId,
    title: note.title,
    content: note.content,
    category: note.category,
    is_journal: note.isJournal,
    checklist: note.checklist || [],
    updated_at: note.updatedAt,
  };
}

export function mapDbGoalToGoal(db: DbGoal): Goal {
  let milestones: Goal['milestones'] = [];
  if (Array.isArray(db.milestones)) {
    milestones = db.milestones;
  }
  return {
    id: db.id,
    title: db.title,
    description: db.description || '',
    horizon: (db.horizon as GoalHorizon) || 'short-term',
    targetDate: db.target_date,
    milestones,
  };
}

export function mapGoalToDb(goal: Goal, userId: string): DbGoal {
  return {
    id: goal.id,
    user_id: userId,
    title: goal.title,
    description: goal.description,
    horizon: goal.horizon,
    target_date: goal.targetDate,
    milestones: goal.milestones,
  };
}

export function mapDbSessionToSession(db: DbFocusSession): FocusSession {
  return {
    id: db.id,
    label: db.label,
    durationMinutes: Number(db.duration_minutes) || 0,
    mode: (db.mode as FocusMode) || 'pomodoro',
    completedAt: db.completed_at,
  };
}

export function mapSessionToDb(session: FocusSession, userId: string): DbFocusSession {
  return {
    id: session.id,
    user_id: userId,
    label: session.label,
    duration_minutes: session.durationMinutes,
    mode: session.mode,
    completed_at: session.completedAt,
  };
}

// -------------------------------------------------------------
// Cloud Queries & Persistence Service
// -------------------------------------------------------------

export interface UserCloudData {
  tasks: Task[];
  events: CalendarEvent[];
  habits: Habit[];
  transactions: Transaction[];
  notes: Note[];
  goals: Goal[];
  focusSessions: FocusSession[];
  monthlyBudget: number;
}

/**
 * Fetches all 8 modules' data in parallel from Supabase PostgreSQL for a specific user
 */
export async function fetchAllUserDataFromSupabase(userId: string): Promise<UserCloudData> {
  const [
    settingsRes,
    tasksRes,
    eventsRes,
    habitsRes,
    transactionsRes,
    notesRes,
    goalsRes,
    focusSessionsRes,
  ] = await Promise.all([
    supabase.from('user_settings').select('monthly_budget').eq('user_id', userId).maybeSingle(),
    supabase.from('tasks').select('*').eq('user_id', userId),
    supabase.from('calendar_events').select('*').eq('user_id', userId),
    supabase.from('habits').select('*').eq('user_id', userId),
    supabase.from('transactions').select('*').eq('user_id', userId),
    supabase.from('notes').select('*').eq('user_id', userId),
    supabase.from('goals').select('*').eq('user_id', userId),
    supabase.from('focus_sessions').select('*').eq('user_id', userId),
  ]);

  // Handle errors if any table fails
  if (tasksRes.error) throw new Error(`Tasks table: ${tasksRes.error.message}`);
  if (eventsRes.error) throw new Error(`Calendar events table: ${eventsRes.error.message}`);
  if (habitsRes.error) throw new Error(`Habits table: ${habitsRes.error.message}`);
  if (transactionsRes.error) throw new Error(`Transactions table: ${transactionsRes.error.message}`);
  if (notesRes.error) throw new Error(`Notes table: ${notesRes.error.message}`);
  if (goalsRes.error) throw new Error(`Goals table: ${goalsRes.error.message}`);
  if (focusSessionsRes.error) throw new Error(`Focus sessions table: ${focusSessionsRes.error.message}`);

  const monthlyBudget = settingsRes.data?.monthly_budget
    ? Number(settingsRes.data.monthly_budget)
    : DEFAULT_MONTHLY_BUDGET;

  const tasks = ((tasksRes.data as DbTask[]) || [])
    .map(mapDbTaskToTask)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const events = ((eventsRes.data as DbCalendarEvent[]) || [])
    .map(mapDbEventToEvent)
    .sort((a, b) => a.date.localeCompare(b.date));

  const habits = ((habitsRes.data as DbHabit[]) || []).map(mapDbHabitToHabit);

  const transactions = ((transactionsRes.data as DbTransaction[]) || [])
    .map(mapDbTransactionToTransaction)
    .sort((a, b) => b.date.localeCompare(a.date));

  const notes = ((notesRes.data as DbNote[]) || [])
    .map(mapDbNoteToNote)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const goals = ((goalsRes.data as DbGoal[]) || [])
    .map(mapDbGoalToGoal)
    .sort((a, b) => a.targetDate.localeCompare(b.targetDate));

  const focusSessions = ((focusSessionsRes.data as DbFocusSession[]) || [])
    .map(mapDbSessionToSession)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  return {
    monthlyBudget,
    tasks,
    events,
    habits,
    transactions,
    notes,
    goals,
    focusSessions,
  };
}

// --- Individual Cloud Mutations ---

export async function cloudUpsertMonthlyBudget(userId: string, budget: number) {
  const { error } = await supabase.from('user_settings').upsert(
    {
      user_id: userId,
      monthly_budget: budget,
    },
    { onConflict: 'user_id' }
  );
  if (error) throw error;
}

export async function cloudInsertTask(task: Task, userId: string) {
  const { error } = await supabase.from('tasks').insert(mapTaskToDb(task, userId));
  if (error) throw error;
}

export async function cloudUpdateTask(id: string, updates: Partial<Task>, userId: string) {
  const dbUpdates: Partial<DbTask> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description || null;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
  if (updates.completed !== undefined) {
    dbUpdates.completed = Boolean(updates.completed);
    dbUpdates.status = updates.completed ? 'done' : 'todo';
  }

  const { error } = await supabase
    .from('tasks')
    .update(dbUpdates)
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function cloudDeleteTask(id: string, userId: string) {
  const { error } = await supabase.from('tasks').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}

export async function cloudInsertEvent(event: CalendarEvent, userId: string) {
  const { error } = await supabase.from('calendar_events').insert(mapEventToDb(event, userId));
  if (error) throw error;
}

export async function cloudUpdateEvent(id: string, updates: Partial<CalendarEvent>, userId: string) {
  const dbUpdates: Partial<DbCalendarEvent> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.date !== undefined) dbUpdates.date = updates.date;
  if (updates.startTime !== undefined) dbUpdates.start_time = updates.startTime;
  if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime;
  if (updates.type !== undefined) dbUpdates.category = updates.type;
  if (updates.location !== undefined) dbUpdates.notes = updates.location || null;

  const { error } = await supabase
    .from('calendar_events')
    .update(dbUpdates)
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function cloudDeleteEvent(id: string, userId: string) {
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function cloudInsertHabit(habit: Habit, userId: string) {
  const { error } = await supabase.from('habits').insert(mapHabitToDb(habit, userId));
  if (error) throw error;
}

export async function cloudUpdateHabit(id: string, updates: Partial<Habit>, userId: string) {
  const dbUpdates: Partial<DbHabit> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.targetDaysPerWeek !== undefined) dbUpdates.target_days_per_week = updates.targetDaysPerWeek;
  if (updates.completedDates !== undefined) dbUpdates.completed_dates = updates.completedDates;
  if (updates.streak !== undefined) dbUpdates.streak = updates.streak;

  const { error } = await supabase
    .from('habits')
    .update(dbUpdates)
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function cloudDeleteHabit(id: string, userId: string) {
  const { error } = await supabase.from('habits').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}

export async function cloudInsertTransaction(tx: Transaction, userId: string) {
  const { error } = await supabase.from('transactions').insert(mapTransactionToDb(tx, userId));
  if (error) throw error;
}

export async function cloudDeleteTransaction(id: string, userId: string) {
  const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}

export async function cloudInsertNote(note: Note, userId: string) {
  const { error } = await supabase.from('notes').insert(mapNoteToDb(note, userId));
  if (error) throw error;
}

export async function cloudUpdateNote(id: string, updates: Partial<Note>, userId: string) {
  const dbUpdates: Partial<DbNote> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.content !== undefined) dbUpdates.content = updates.content;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.isJournal !== undefined) dbUpdates.is_journal = updates.isJournal;
  if (updates.checklist !== undefined) dbUpdates.checklist = updates.checklist;
  if (updates.updatedAt !== undefined) dbUpdates.updated_at = updates.updatedAt;

  const { error } = await supabase
    .from('notes')
    .update(dbUpdates)
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function cloudDeleteNote(id: string, userId: string) {
  const { error } = await supabase.from('notes').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}

export async function cloudInsertGoal(goal: Goal, userId: string) {
  const { error } = await supabase.from('goals').insert(mapGoalToDb(goal, userId));
  if (error) throw error;
}

export async function cloudUpdateGoal(id: string, updates: Partial<Goal>, userId: string) {
  const dbUpdates: Partial<DbGoal> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.horizon !== undefined) dbUpdates.horizon = updates.horizon;
  if (updates.targetDate !== undefined) dbUpdates.target_date = updates.targetDate;
  if (updates.milestones !== undefined) dbUpdates.milestones = updates.milestones;

  const { error } = await supabase
    .from('goals')
    .update(dbUpdates)
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function cloudDeleteGoal(id: string, userId: string) {
  const { error } = await supabase.from('goals').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}

export async function cloudInsertFocusSession(session: FocusSession, userId: string) {
  const { error } = await supabase
    .from('focus_sessions')
    .insert(mapSessionToDb(session, userId));
  if (error) throw error;
}

export async function cloudDeleteFocusSession(id: string, userId: string) {
  const { error } = await supabase
    .from('focus_sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

/**
 * Seeds sample records into Supabase PostgreSQL for the authenticated user
 */
export async function seedUserDataInSupabase(userId: string): Promise<UserCloudData> {
  // Clear any existing user records first
  await Promise.all([
    supabase.from('tasks').delete().eq('user_id', userId),
    supabase.from('calendar_events').delete().eq('user_id', userId),
    supabase.from('habits').delete().eq('user_id', userId),
    supabase.from('transactions').delete().eq('user_id', userId),
    supabase.from('notes').delete().eq('user_id', userId),
    supabase.from('goals').delete().eq('user_id', userId),
    supabase.from('focus_sessions').delete().eq('user_id', userId),
  ]);

  // Prepare seed batches with UUIDs and user_id
  const seedTasks: Task[] = SEED_TASKS.map((t) => ({ ...t, id: generateEntityId() }));
  const seedEvents: CalendarEvent[] = SEED_EVENTS.map((e) => ({ ...e, id: generateEntityId() }));
  const seedHabits: Habit[] = SEED_HABITS.map((h) => ({ ...h, id: generateEntityId() }));
  const seedTransactions: Transaction[] = SEED_TRANSACTIONS.map((tx) => ({
    ...tx,
    id: generateEntityId(),
  }));
  const seedNotes: Note[] = SEED_NOTES.map((n) => ({ ...n, id: generateEntityId() }));
  const seedGoals: Goal[] = SEED_GOALS.map((g) => ({
    ...g,
    id: generateEntityId(),
    milestones: g.milestones.map((m) => ({ ...m, id: generateEntityId() })),
  }));
  const seedSessions: FocusSession[] = SEED_FOCUS_SESSIONS.map((s) => ({
    ...s,
    id: generateEntityId(),
  }));

  // Insert into all 8 tables
  await Promise.all([
    cloudUpsertMonthlyBudget(userId, DEFAULT_MONTHLY_BUDGET),
    supabase.from('tasks').insert(seedTasks.map((t) => mapTaskToDb(t, userId))),
    supabase.from('calendar_events').insert(seedEvents.map((e) => mapEventToDb(e, userId))),
    supabase.from('habits').insert(seedHabits.map((h) => mapHabitToDb(h, userId))),
    supabase.from('transactions').insert(seedTransactions.map((tx) => mapTransactionToDb(tx, userId))),
    supabase.from('notes').insert(seedNotes.map((n) => mapNoteToDb(n, userId))),
    supabase.from('goals').insert(seedGoals.map((g) => mapGoalToDb(g, userId))),
    supabase.from('focus_sessions').insert(seedSessions.map((s) => mapSessionToDb(s, userId))),
  ]);

  return {
    monthlyBudget: DEFAULT_MONTHLY_BUDGET,
    tasks: seedTasks,
    events: seedEvents,
    habits: seedHabits,
    transactions: seedTransactions,
    notes: seedNotes,
    goals: seedGoals,
    focusSessions: seedSessions,
  };
}
