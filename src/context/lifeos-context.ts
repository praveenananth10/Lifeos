import { createContext } from 'react';
import type {
  Task,
  CalendarEvent,
  CalendarEventType,
  Habit,
  Transaction,
  Note,
  Goal,
  FocusSession,
} from '../types/lifeos';

export interface LifeOSContextType {
  todayDate: string;
  isLoadingData: boolean;
  syncError: string | null;
  clearSyncError: () => void;
  // State
  tasks: Task[];
  events: CalendarEvent[];
  habits: Habit[];
  transactions: Transaction[];
  monthlyBudget: number;
  notes: Note[];
  goals: Goal[];
  focusSessions: FocusSession[];

  // CRUD Actions
  toggleTask: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;

  toggleHabitToday: (id: string) => void;
  toggleHabitDate: (id: string, dateStr: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates'>) => void;
  deleteHabit: (id: string) => void;

  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  scheduleTaskAsEvent: (
    taskId: string,
    date: string,
    startTime: string,
    endTime: string,
    type?: CalendarEventType
  ) => void;

  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setMonthlyBudget: (amount: number) => void;
  updateMonthlyBudget: (amount: number) => void;

  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleNoteChecklistItem: (noteId: string, itemId: string) => void;
  addNoteChecklistItem: (noteId: string, text: string) => void;
  deleteNoteChecklistItem: (noteId: string, itemId: string) => void;

  addGoal: (goal: Omit<Goal, 'id'>) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  deleteGoal: (id: string) => void;

  logFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;
  deleteFocusSession: (id: string) => void;
  resetToSampleData: () => void;

  // Computed KPI Metrics
  completedTasksCount: number;
  pendingTasksCount: number;
  totalTasksCount: number;
  overdueTasksCount: number;
  habitsCompletedTodayCount: number;
  totalHabitsCount: number;
  totalSpentThisMonth: number;
  totalIncomeThisMonth: number;
  netSavingsThisMonth: number;
  savingsRatePercent: number;
  budgetUsagePercent: number;
  todayFocusMinutes: number;
  todayFocusSessionsCount: number;
  allTimeFocusSessionsCount: number;
  averageGoalProgress: number;
  bestHabitStreak: number;
  weeklyConsistencyPercent: number;
  activeGoalsCount: number;
  completedGoalsCount: number;
}

export const LifeOSContext = createContext<LifeOSContextType | undefined>(undefined);


