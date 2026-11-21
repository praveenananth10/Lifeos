import React, { useState, useEffect, useMemo } from 'react';
import { LifeOSContext } from './lifeos-context';
import type {
  Task,
  CalendarEvent,
  CalendarEventType,
  Habit,
  Transaction,
  Note,
  NoteChecklistItem,
  Goal,
  GoalMilestone,
  FocusSession,
} from '../types/lifeos';
import { calculateHabitStreak, getWeekDays } from '../utils/date';
import {
  TODAY_DATE,
  DEFAULT_MONTHLY_BUDGET,
  SEED_TASKS,
  SEED_EVENTS,
  SEED_HABITS,
  SEED_TRANSACTIONS,
  SEED_NOTES,
  SEED_GOALS,
  SEED_FOCUS_SESSIONS,
} from '../data/seedData';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  generateEntityId,
  fetchAllUserDataFromSupabase,
  cloudUpsertMonthlyBudget,
  cloudInsertTask,
  cloudUpdateTask,
  cloudDeleteTask,
  cloudInsertEvent,
  cloudUpdateEvent,
  cloudDeleteEvent,
  cloudInsertHabit,
  cloudUpdateHabit,
  cloudDeleteHabit,
  cloudInsertTransaction,
  cloudDeleteTransaction,
  cloudInsertNote,
  cloudUpdateNote,
  cloudDeleteNote,
  cloudInsertGoal,
  cloudUpdateGoal,
  cloudDeleteGoal,
  cloudInsertFocusSession,
  cloudDeleteFocusSession,
  seedUserDataInSupabase,
} from '../lib/lifeosDb';

export { LifeOSContext } from './lifeos-context';
export type { LifeOSContextType } from './lifeos-context';

const STORAGE_KEY = 'lifeos-workspace-data';

interface StoredData {
  tasks: Task[];
  events: CalendarEvent[];
  habits: Habit[];
  transactions: Transaction[];
  monthlyBudget: number;
  notes: Note[];
  goals: Goal[];
  focusSessions: FocusSession[];
}

const EMPTY_CLOUD_WORKSPACE: StoredData = {
  tasks: [],
  events: [],
  habits: [],
  transactions: [],
  monthlyBudget: DEFAULT_MONTHLY_BUDGET,
  notes: [],
  goals: [],
  focusSessions: [],
};

export const LifeOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;

  // Determine if cloud sync with real Supabase user is active
  const isCloudActive = Boolean(
    isSupabaseConfigured &&
      user?.isAuthenticated &&
      userId &&
      !userId.startsWith('demo-') &&
      !userId.startsWith('google-demo-')
  );

  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const isLoadingData = Boolean(
    (isCloudActive && userId && loadedUserId !== userId) || isSeeding
  );

  // Initialize state: for Supabase environments, start clean with empty arrays
  // so real user data is never mixed with mock tasks
  const [data, setData] = useState<StoredData>(() => {
    if (!isSupabaseConfigured) {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            return JSON.parse(stored);
          }
        } catch (err) {
          if (import.meta.env.DEV) {
            console.error('Failed to load LifeOS workspace data from storage', err);
          }
        }
      }
      return {
        tasks: SEED_TASKS,
        events: SEED_EVENTS,
        habits: SEED_HABITS,
        transactions: SEED_TRANSACTIONS,
        monthlyBudget: DEFAULT_MONTHLY_BUDGET,
        notes: SEED_NOTES,
        goals: SEED_GOALS,
        focusSessions: SEED_FOCUS_SESSIONS,
      };
    }
    return EMPTY_CLOUD_WORKSPACE;
  });

  // Fetch all 8 tables from Supabase when authenticated user is detected
  useEffect(() => {
    if (!isCloudActive || !userId) {
      return;
    }

    let isMounted = true;

    fetchAllUserDataFromSupabase(userId)
      .then((cloudData) => {
        if (!isMounted) return;
        setData(cloudData);
        setLoadedUserId(userId);
        setSyncError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (import.meta.env.DEV) {
          console.error('Failed to fetch user data from Supabase:', err);
        }
        setSyncError(err?.message || 'Failed to sync with Supabase cloud database.');
        setLoadedUserId(userId);
      });

    return () => {
      isMounted = false;
    };
  }, [isCloudActive, userId]);

  // Sync to localStorage only when in demo mode (unconfigured or demo user)
  useEffect(() => {
    if (!isCloudActive) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isCloudActive]);

  const clearSyncError = () => {
    setSyncError(null);
  };

  // Helper for background cloud writes with clean error capture
  const syncToCloud = (promise: Promise<unknown>) => {
    if (!isCloudActive || !userId) return;
    promise
      .then(() => {
        setSyncError(null);
      })
      .catch((err) => {
        if (import.meta.env.DEV) {
          console.error('Cloud synchronization error:', err);
        }
        setSyncError(err?.message || 'Cloud write error');
      });
  };

  // -------------------------------------------------------------
  // Tasks Actions
  // -------------------------------------------------------------
  const toggleTask = (id: string) => {
    const target = data.tasks.find((t) => t.id === id);
    if (!target) return;
    const newCompleted = !target.completed;

    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t)),
    }));

    if (userId) {
      syncToCloud(cloudUpdateTask(id, { completed: newCompleted }, userId));
    }
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateEntityId(),
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));

    if (userId) {
      syncToCloud(cloudInsertTask(newTask, userId));
    }
  };

  const deleteTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));

    if (userId) {
      syncToCloud(cloudDeleteTask(id, userId));
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    if (userId) {
      syncToCloud(cloudUpdateTask(id, updates, userId));
    }
  };

  // -------------------------------------------------------------
  // Habits Actions
  // -------------------------------------------------------------
  const toggleHabitDate = (id: string, dateStr: string) => {
    const habit = data.habits.find((h) => h.id === id);
    if (!habit) return;

    const exists = habit.completedDates.includes(dateStr);
    const newDates = exists
      ? habit.completedDates.filter((d) => d !== dateStr)
      : [...habit.completedDates, dateStr];
    const newStreak = calculateHabitStreak(newDates, TODAY_DATE);

    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) =>
        h.id === id ? { ...h, completedDates: newDates, streak: newStreak } : h
      ),
    }));

    if (userId) {
      syncToCloud(cloudUpdateHabit(id, { completedDates: newDates, streak: newStreak }, userId));
    }
  };

  const toggleHabitToday = (id: string) => {
    toggleHabitDate(id, TODAY_DATE);
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'streak' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...habit,
      id: generateEntityId(),
      streak: 0,
      completedDates: [],
    };

    setData((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));

    if (userId) {
      syncToCloud(cloudInsertHabit(newHabit, userId));
    }
  };

  const deleteHabit = (id: string) => {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
    }));

    if (userId) {
      syncToCloud(cloudDeleteHabit(id, userId));
    }
  };

  // -------------------------------------------------------------
  // Events Actions
  // -------------------------------------------------------------
  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: generateEntityId(),
    };

    setData((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));

    if (userId) {
      syncToCloud(cloudInsertEvent(newEvent, userId));
    }
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));

    if (userId) {
      syncToCloud(cloudUpdateEvent(id, updates, userId));
    }
  };

  const deleteEvent = (id: string) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));

    if (userId) {
      syncToCloud(cloudDeleteEvent(id, userId));
    }
  };

  const scheduleTaskAsEvent = (
    taskId: string,
    date: string,
    startTime: string,
    endTime: string,
    type: CalendarEventType = 'deadline'
  ) => {
    const task = data.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newEvent: CalendarEvent = {
      id: generateEntityId(),
      title: task.title,
      date,
      startTime,
      endTime,
      type,
      location: task.category,
    };

    setData((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));

    if (userId) {
      syncToCloud(cloudInsertEvent(newEvent, userId));
    }
  };

  // -------------------------------------------------------------
  // Transactions Actions
  // -------------------------------------------------------------
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTxn: Transaction = {
      ...transaction,
      id: generateEntityId(),
    };

    setData((prev) => ({
      ...prev,
      transactions: [newTxn, ...prev.transactions],
    }));

    if (userId) {
      syncToCloud(cloudInsertTransaction(newTxn, userId));
    }
  };

  const deleteTransaction = (id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));

    if (userId) {
      syncToCloud(cloudDeleteTransaction(id, userId));
    }
  };

  const setMonthlyBudget = (amount: number) => {
    setData((prev) => ({
      ...prev,
      monthlyBudget: amount,
    }));

    if (userId) {
      syncToCloud(cloudUpsertMonthlyBudget(userId, amount));
    }
  };

  // -------------------------------------------------------------
  // Notes Actions
  // -------------------------------------------------------------
  const addNote = (note: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: generateEntityId(),
      updatedAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));

    if (userId) {
      syncToCloud(cloudInsertNote(newNote, userId));
    }
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updatedAt = new Date().toISOString();
    setData((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt } : n
      ),
    }));

    if (userId) {
      syncToCloud(cloudUpdateNote(id, { ...updates, updatedAt }, userId));
    }
  };

  const deleteNote = (id: string) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));

    if (userId) {
      syncToCloud(cloudDeleteNote(id, userId));
    }
  };

  const toggleNoteChecklistItem = (noteId: string, itemId: string) => {
    const note = data.notes.find((n) => n.id === noteId);
    if (!note) return;

    const checklist = note.checklist || [];
    const updatedChecklist = checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    const updatedAt = new Date().toISOString();

    setData((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === noteId ? { ...n, checklist: updatedChecklist, updatedAt } : n
      ),
    }));

    if (userId) {
      syncToCloud(cloudUpdateNote(noteId, { checklist: updatedChecklist, updatedAt }, userId));
    }
  };

  const addNoteChecklistItem = (noteId: string, text: string) => {
    const note = data.notes.find((n) => n.id === noteId);
    if (!note) return;

    const newItem: NoteChecklistItem = {
      id: generateEntityId(),
      text,
      done: false,
    };
    const updatedChecklist = [...(note.checklist || []), newItem];
    const updatedAt = new Date().toISOString();

    setData((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === noteId ? { ...n, checklist: updatedChecklist, updatedAt } : n
      ),
    }));

    if (userId) {
      syncToCloud(cloudUpdateNote(noteId, { checklist: updatedChecklist, updatedAt }, userId));
    }
  };

  const deleteNoteChecklistItem = (noteId: string, itemId: string) => {
    const note = data.notes.find((n) => n.id === noteId);
    if (!note) return;

    const updatedChecklist = (note.checklist || []).filter((item) => item.id !== itemId);
    const updatedAt = new Date().toISOString();

    setData((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === noteId ? { ...n, checklist: updatedChecklist, updatedAt } : n
      ),
    }));

    if (userId) {
      syncToCloud(cloudUpdateNote(noteId, { checklist: updatedChecklist, updatedAt }, userId));
    }
  };

  // -------------------------------------------------------------
  // Goals Actions
  // -------------------------------------------------------------
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: generateEntityId(),
    };

    setData((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));

    if (userId) {
      syncToCloud(cloudInsertGoal(newGoal, userId));
    }
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = data.goals.find((g) => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, milestones: updatedMilestones } : g
      ),
    }));

    if (userId) {
      syncToCloud(cloudUpdateGoal(goalId, { milestones: updatedMilestones }, userId));
    }
  };

  const addMilestone = (goalId: string, title: string) => {
    const goal = data.goals.find((g) => g.id === goalId);
    if (!goal) return;

    const newMilestone: GoalMilestone = {
      id: generateEntityId(),
      title,
      completed: false,
    };
    const updatedMilestones = [...goal.milestones, newMilestone];

    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, milestones: updatedMilestones } : g
      ),
    }));

    if (userId) {
      syncToCloud(cloudUpdateGoal(goalId, { milestones: updatedMilestones }, userId));
    }
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    const goal = data.goals.find((g) => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.filter((m) => m.id !== milestoneId);

    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, milestones: updatedMilestones } : g
      ),
    }));

    if (userId) {
      syncToCloud(cloudUpdateGoal(goalId, { milestones: updatedMilestones }, userId));
    }
  };

  const deleteGoal = (id: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));

    if (userId) {
      syncToCloud(cloudDeleteGoal(id, userId));
    }
  };

  // -------------------------------------------------------------
  // Focus Actions
  // -------------------------------------------------------------
  const logFocusSession = (session: Omit<FocusSession, 'id' | 'completedAt'>) => {
    const newSession: FocusSession = {
      ...session,
      id: generateEntityId(),
      completedAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      focusSessions: [newSession, ...prev.focusSessions],
    }));

    if (userId) {
      syncToCloud(cloudInsertFocusSession(newSession, userId));
    }
  };

  const deleteFocusSession = (id: string) => {
    setData((prev) => ({
      ...prev,
      focusSessions: prev.focusSessions.filter((f) => f.id !== id),
    }));

    if (userId) {
      syncToCloud(cloudDeleteFocusSession(id, userId));
    }
  };

  // -------------------------------------------------------------
  // Reset To Sample Data
  // -------------------------------------------------------------
  const resetToSampleData = () => {
    if (isCloudActive && userId) {
      setIsSeeding(true);
      seedUserDataInSupabase(userId)
        .then((cloudData) => {
          setData(cloudData);
          setSyncError(null);
        })
        .catch((err) => {
          if (import.meta.env.DEV) {
            console.error('Failed to seed cloud sample data:', err);
          }
          setSyncError(err?.message || 'Failed to seed sample data in Supabase');
        })
        .finally(() => {
          setIsSeeding(false);
        });
    } else {
      const fresh: StoredData = {
        tasks: SEED_TASKS,
        events: SEED_EVENTS,
        habits: SEED_HABITS,
        transactions: SEED_TRANSACTIONS,
        monthlyBudget: DEFAULT_MONTHLY_BUDGET,
        notes: SEED_NOTES,
        goals: SEED_GOALS,
        focusSessions: SEED_FOCUS_SESSIONS,
      };
      setData(fresh);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    }
  };

  // -------------------------------------------------------------
  // Computed KPI Metrics
  // -------------------------------------------------------------
  const completedTasksCount = useMemo(
    () => data.tasks.filter((t) => t.completed).length,
    [data.tasks]
  );
  const totalTasksCount = data.tasks.length;
  const pendingTasksCount = totalTasksCount - completedTasksCount;

  const overdueTasksCount = useMemo(() => {
    return data.tasks.filter((t) => !t.completed && t.dueDate < TODAY_DATE).length;
  }, [data.tasks]);

  const habitsCompletedTodayCount = useMemo(
    () => data.habits.filter((h) => h.completedDates.includes(TODAY_DATE)).length,
    [data.habits]
  );
  const totalHabitsCount = data.habits.length;

  const bestHabitStreak = useMemo(
    () => (data.habits.length > 0 ? Math.max(...data.habits.map((h) => h.streak)) : 0),
    [data.habits]
  );

  const totalSpentThisMonth = useMemo(() => {
    return data.transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith('2026-11'))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [data.transactions]);

  const totalIncomeThisMonth = useMemo(() => {
    return data.transactions
      .filter((t) => t.type === 'income' && t.date.startsWith('2026-11'))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [data.transactions]);

  const netSavingsThisMonth = useMemo(
    () => totalIncomeThisMonth - totalSpentThisMonth,
    [totalIncomeThisMonth, totalSpentThisMonth]
  );

  const savingsRatePercent = useMemo(() => {
    if (totalIncomeThisMonth <= 0) return 0;
    return Math.max(0, Math.round((netSavingsThisMonth / totalIncomeThisMonth) * 100));
  }, [netSavingsThisMonth, totalIncomeThisMonth]);

  const budgetUsagePercent = useMemo(() => {
    if (data.monthlyBudget <= 0) return 0;
    return Math.round((totalSpentThisMonth / data.monthlyBudget) * 100);
  }, [totalSpentThisMonth, data.monthlyBudget]);

  const todayFocusMinutes = useMemo(() => {
    return data.focusSessions
      .filter((f) => f.completedAt.startsWith(TODAY_DATE))
      .reduce((sum, f) => sum + f.durationMinutes, 0);
  }, [data.focusSessions]);

  const todayFocusSessionsCount = useMemo(() => {
    return data.focusSessions.filter((f) => f.completedAt.startsWith(TODAY_DATE)).length;
  }, [data.focusSessions]);

  const allTimeFocusSessionsCount = data.focusSessions.length;

  const averageGoalProgress = useMemo(() => {
    if (data.goals.length === 0) return 0;
    const totalProgress = data.goals.reduce((acc, g) => {
      if (g.milestones.length === 0) return acc;
      const done = g.milestones.filter((m) => m.completed).length;
      return acc + (done / g.milestones.length) * 100;
    }, 0);
    return Math.round(totalProgress / data.goals.length);
  }, [data.goals]);

  const weeklyConsistencyPercent = useMemo(() => {
    if (data.habits.length === 0) return 0;
    const weekDays = getWeekDays(TODAY_DATE, TODAY_DATE);
    const weekDateStrs = weekDays.map((d) => d.date);

    let totalCompletedThisWeek = 0;
    data.habits.forEach((h) => {
      const inWeek = h.completedDates.filter((d) => weekDateStrs.includes(d)).length;
      totalCompletedThisWeek += inWeek;
    });

    const totalTarget = data.habits.reduce((acc, h) => acc + h.targetDaysPerWeek, 0);
    if (totalTarget === 0) return 0;
    return Math.min(100, Math.round((totalCompletedThisWeek / totalTarget) * 100));
  }, [data.habits]);

  const completedGoalsCount = useMemo(() => {
    return data.goals.filter(
      (g) => g.milestones.length > 0 && g.milestones.every((m) => m.completed)
    ).length;
  }, [data.goals]);

  const activeGoalsCount = data.goals.length - completedGoalsCount;

  return (
    <LifeOSContext.Provider
      value={{
        todayDate: TODAY_DATE,
        isLoadingData,
        syncError,
        clearSyncError,

        tasks: data.tasks,
        events: data.events,
        habits: data.habits,
        transactions: data.transactions,
        monthlyBudget: data.monthlyBudget,
        notes: data.notes,
        goals: data.goals,
        focusSessions: data.focusSessions,

        toggleTask,
        addTask,
        deleteTask,
        updateTask,

        toggleHabitToday,
        toggleHabitDate,
        addHabit,
        deleteHabit,

        addEvent,
        updateEvent,
        deleteEvent,
        scheduleTaskAsEvent,

        addTransaction,
        deleteTransaction,
        setMonthlyBudget,
        updateMonthlyBudget: setMonthlyBudget,

        addNote,
        updateNote,
        deleteNote,
        toggleNoteChecklistItem,
        addNoteChecklistItem,
        deleteNoteChecklistItem,

        addGoal,
        toggleMilestone,
        addMilestone,
        deleteMilestone,
        deleteGoal,

        logFocusSession,
        deleteFocusSession,
        resetToSampleData,

        completedTasksCount,
        pendingTasksCount,
        totalTasksCount,
        overdueTasksCount,
        habitsCompletedTodayCount,
        totalHabitsCount,
        totalSpentThisMonth,
        totalIncomeThisMonth,
        netSavingsThisMonth,
        savingsRatePercent,
        budgetUsagePercent,
        todayFocusMinutes,
        todayFocusSessionsCount,
        allTimeFocusSessionsCount,
        averageGoalProgress,
        bestHabitStreak,
        weeklyConsistencyPercent,
        activeGoalsCount,
        completedGoalsCount,
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
};
