import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Flame, 
  Wallet, 
  Target, 
  Clock, 
  Plus, 
  ArrowRight, 
  Check, 
  Hourglass,
  ChevronRight,
  DollarSign,
  FilePlus2,
  CalendarDays
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useLifeOS } from '../../hooks/useLifeOS';
import type { TaskCategory, TaskPriority } from '../../types/lifeos';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    tasks,
    habits,
    events,
    goals,
    monthlyBudget,
    todayFocusMinutes,
    completedTasksCount,
    pendingTasksCount,
    totalTasksCount,
    habitsCompletedTodayCount,
    totalHabitsCount,
    totalSpentThisMonth,
    averageGoalProgress,
    bestHabitStreak,
    todayDate,
    toggleTask,
    addTask,
    toggleHabitToday,
    addTransaction,
    addNote,
  } = useLifeOS();

  // Quick inline add task state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('Work');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [showQuickTaskForm, setShowQuickTaskForm] = useState(false);

  // Quick modal states for expense & note
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Groceries');

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Personalized dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(todayDate));

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      dueDate: todayDate,
      completed: false,
    });
    setNewTaskTitle('');
    setShowQuickTaskForm(false);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(expenseAmount);
    if (!expenseTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;
    addTransaction({
      title: expenseTitle.trim(),
      amount: parsedAmount,
      type: 'expense',
      category: expenseCategory,
      date: todayDate,
    });
    setExpenseTitle('');
    setExpenseAmount('');
    setShowExpenseModal(false);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    addNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: 'Personal',
      isJournal: false,
    });
    setNoteTitle('');
    setNoteContent('');
    setShowNoteModal(false);
  };

  // Percentage calculations
  const taskProgressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  const habitProgressPercent = totalHabitsCount > 0 ? Math.round((habitsCompletedTodayCount / totalHabitsCount) * 100) : 0;
  const budgetSpentPercent = monthlyBudget > 0 ? Math.min(100, Math.round((totalSpentThisMonth / monthlyBudget) * 100)) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER ROW: Greeting, Date & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {getGreeting()}, {user?.name || 'Alex'}
            </h1>
            <span className="text-xl">✨</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
            <span>{formattedDate}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-orange-600 dark:text-orange-400 font-medium">
              Sprint Week 47
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowQuickTaskForm(!showQuickTaskForm)}
            className="text-xs h-9 gap-1.5"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            New Task
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowExpenseModal(true)}
            className="text-xs h-9 gap-1.5"
            leftIcon={<DollarSign className="h-3.5 w-3.5" />}
          >
            Log Expense
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowNoteModal(true)}
            className="text-xs h-9 gap-1.5"
            leftIcon={<FilePlus2 className="h-3.5 w-3.5" />}
          >
            Quick Note
          </Button>

          <Link to="/focus">
            <Button
              variant="primary"
              size="sm"
              className="text-xs h-9 gap-1.5 shadow-sm font-semibold"
              leftIcon={<Clock className="h-3.5 w-3.5" />}
            >
              Start Focus Session
            </Button>
          </Link>
        </div>
      </div>

      {/* QUICK INLINE TASK ADD DRAWER */}
      {showQuickTaskForm && (
        <Card variant="default" className="p-4 border-orange-200 dark:border-orange-900/60 bg-orange-50/20 dark:bg-orange-950/10">
          <form onSubmit={handleCreateTask} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                Add Quick Task
              </span>
              <button
                type="button"
                onClick={() => setShowQuickTaskForm(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-6">
                <Input
                  placeholder="Task title (e.g. Prepare system demo for Monday)..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="sm:col-span-3">
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                  className="w-full h-9 rounded-lg px-2.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                  className="w-full h-9 rounded-lg px-2.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <div className="sm:col-span-1">
                <Button type="submit" variant="primary" className="w-full h-9 text-xs">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* 2. TOP 4 KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tasks Overview */}
        <Card variant="default" interactive>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Tasks Completed
              </span>
              <div className="h-8 w-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <CheckSquare className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {completedTasksCount}
                <span className="text-sm font-normal text-zinc-400"> / {totalTasksCount}</span>
              </div>
              <Badge variant={pendingTasksCount === 0 ? 'success' : 'orange'} className="text-[10px]">
                {pendingTasksCount} pending
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-600 dark:bg-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${taskProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>{taskProgressPercent}% finished</span>
                <span>Target: 100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Habit Consistency */}
        <Card variant="default" interactive>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Habit Consistency
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
                <Flame className="h-4 w-4 fill-amber-500" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {habitsCompletedTodayCount}
                <span className="text-sm font-normal text-zinc-400"> / {totalHabitsCount}</span>
              </div>
              <Badge variant="warning" className="text-[10px] gap-1">
                <Flame className="h-3 w-3 fill-amber-500" />
                {bestHabitStreak}d Streak
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${habitProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>{habitProgressPercent}% completed today</span>
                <span>Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Monthly Spending */}
        <Card variant="default" interactive>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Monthly Spending
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Wallet className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                ${totalSpentThisMonth.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                <span className="text-sm font-normal text-zinc-400"> / ${monthlyBudget.toLocaleString()}</span>
              </div>
              <Badge variant={budgetSpentPercent > 90 ? 'danger' : 'success'} className="text-[10px]">
                {budgetSpentPercent}% used
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    budgetSpentPercent > 90 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${budgetSpentPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>${(monthlyBudget - totalSpentThisMonth).toFixed(0)} remaining</span>
                <span>Nov Budget</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Active Goals */}
        <Card variant="default" interactive>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Active Goals &amp; OKRs
              </span>
              <div className="h-8 w-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Target className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {averageGoalProgress}%
                <span className="text-sm font-normal text-zinc-400"> avg</span>
              </div>
              <Badge variant="orange" className="text-[10px]">
                {goals.length} Goals
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-600 dark:bg-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${averageGoalProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>{goals.filter(g => g.horizon === 'short-term').length} short-term</span>
                <span>{goals.filter(g => g.horizon === 'long-term').length} long-term</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. MAIN CONTENT GRID (2-Column Balanced Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Today's Tasks & Daily Habits (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TODAY'S TASKS CARD */}
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-semibold">Today's Priorities</CardTitle>
                  <Badge variant="orange" className="text-[10px]">
                    {pendingTasksCount} remaining
                  </Badge>
                </div>
                <CardDescription className="text-xs mt-0.5">
                  Click to mark complete. Tasks update the global store live.
                </CardDescription>
              </div>

              <Link to="/tasks" className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-medium">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>

            <CardContent className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-400">
                  No tasks recorded. Add your first task above!
                </div>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-start justify-between p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                      task.completed
                        ? 'bg-zinc-50/70 dark:bg-zinc-900/30 border-zinc-200/50 dark:border-zinc-800/50 opacity-70'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-4 w-4 rounded mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          task.completed
                            ? 'bg-emerald-500 text-white'
                            : 'border border-zinc-300 dark:border-zinc-600 hover:border-orange-500'
                        }`}
                      >
                        {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>

                      <div className="space-y-0.5">
                        <p
                          className={`text-xs font-medium leading-snug ${
                            task.completed
                              ? 'line-through text-zinc-400 dark:text-zinc-500'
                              : 'text-zinc-800 dark:text-zinc-200'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {task.category}
                      </span>
                      <Badge
                        variant={
                          task.priority === 'high'
                            ? 'danger'
                            : task.priority === 'medium'
                            ? 'warning'
                            : 'secondary'
                        }
                        dot
                        className="text-[10px]"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>

            <CardFooter className="justify-between text-xs text-zinc-400">
              <span>Showing top 5 tasks</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickTaskForm(true)}
                className="h-7 text-xs text-orange-600 dark:text-orange-400"
              >
                + Add another task
              </Button>
            </CardFooter>
          </Card>

          {/* DAILY HABITS CARD */}
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-semibold">Daily Habit Check-in</CardTitle>
                  <Badge variant="warning" className="text-[10px] gap-1">
                    <Flame className="h-3 w-3 fill-amber-500" />
                    {habitsCompletedTodayCount}/{totalHabitsCount} done
                  </Badge>
                </div>
                <CardDescription className="text-xs mt-0.5">
                  Click the checkmark to record today's habit execution.
                </CardDescription>
              </div>

              <Link to="/habits" className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-medium">
                All habits <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>

            <CardContent className="space-y-2.5">
              {habits.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-400">
                  No habits tracked yet. Create your first habit in Habits!
                </div>
              ) : (
                habits.map((habit) => {
                  const isCompletedToday = habit.completedDates.includes(todayDate);
                  return (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleHabitToday(habit.id)}
                          className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
                            isCompletedToday
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'border border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-emerald-500'
                          }`}
                          aria-label={isCompletedToday ? 'Mark habit incomplete' : 'Mark habit complete'}
                        >
                          <Check className="h-4 w-4 stroke-[2.5]" />
                        </button>

                        <div className="space-y-0.5">
                          <span className={`text-xs font-semibold ${isCompletedToday ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'}`}>
                            {habit.name}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                            <span>{habit.category}</span>
                            <span>•</span>
                            <span>Target: {habit.targetDaysPerWeek}x / week</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-900/40">
                          <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>{habit.streak}d</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Focus Shortcut, Upcoming Schedule & Goals (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* FOCUS TIMER SHORTCUT CARD */}
          <Card variant="default" className="border-orange-200/80 dark:border-orange-900/60 bg-gradient-to-br from-orange-50/30 via-white to-white dark:from-orange-950/20 dark:via-zinc-900 dark:to-zinc-900">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Pomodoro Engine
                </span>
                <Badge variant="orange" className="text-[10px]">
                  Today: {todayFocusMinutes}m
                </Badge>
              </div>
              <CardTitle className="text-base font-semibold mt-1">
                Distraction-Free Focus
              </CardTitle>
              <CardDescription className="text-xs">
                Enter deep work intervals with soundscapes and muted cognitive interruptions.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">
                    Default Cycle
                  </span>
                  <div className="font-mono text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    25:00 <span className="text-xs font-normal text-zinc-400">/ 5:00 break</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Hourglass className="h-5 w-5 animate-pulse" />
                </div>
              </div>

              <Link to="/focus" className="block w-full">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full text-xs font-semibold gap-1.5"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Launch Full Focus Mode
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* UPCOMING EVENTS & SCHEDULE CARD */}
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Today's Schedule</CardTitle>
                <CardDescription className="text-xs">
                  Time-blocked commitments &amp; deadlines
                </CardDescription>
              </div>
              <Link to="/calendar" className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-medium">
                Calendar <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>

            <CardContent className="space-y-2.5">
              {events.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-400">
                  No events scheduled for today. Enjoy your open space!
                </div>
              ) : (
                events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {event.startTime} - {event.endTime}
                      </span>
                      <Badge
                        variant={
                          event.type === 'focus'
                            ? 'orange'
                            : event.type === 'deadline'
                            ? 'danger'
                            : 'secondary'
                        }
                        className="text-[10px] capitalize"
                      >
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {event.title}
                    </p>
                    {event.location && (
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        📍 {event.location}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* ACTIVE GOALS SNAPSHOT CARD */}
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Quarterly Goals Snapshot</CardTitle>
                <CardDescription className="text-xs">
                  OKR milestones &amp; life architecture
                </CardDescription>
              </div>
              <Link to="/goals" className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-medium">
                Goals <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>

            <CardContent className="space-y-3">
              {goals.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-400">
                  No active goals defined. Build your first goal in Goals!
                </div>
              ) : (
                goals.slice(0, 3).map((goal) => {
                  const completedMilestones = goal.milestones.filter((m) => m.completed).length;
                  const totalMilestones = goal.milestones.length;
                  const percent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

                  return (
                    <div
                      key={goal.id}
                      className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                          {goal.title}
                        </span>
                        <span className="text-[10px] font-mono font-medium text-orange-600 dark:text-orange-400">
                          {percent}%
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-600 dark:bg-orange-500 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span>{completedMilestones}/{totalMilestones} Milestones</span>
                        <span className="capitalize">{goal.horizon}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QUICK EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <Card className="w-full max-w-sm p-5 space-y-4 bg-white dark:bg-zinc-900 shadow-xl border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" /> Log Expense
              </CardTitle>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <Input
                label="Description"
                placeholder="e.g. Groceries, Gym, Software"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                autoFocus
              />
              <Input
                label="Amount ($)"
                type="number"
                step="0.01"
                placeholder="45.00"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Category</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full h-9 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="Groceries">Groceries</option>
                  <option value="Dining">Dining</option>
                  <option value="Technology">Technology</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Travel">Travel</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button type="button" variant="secondary" className="flex-1 text-xs" onClick={() => setShowExpenseModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1 text-xs">
                  Save Expense
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* QUICK NOTE MODAL */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <Card className="w-full max-w-sm p-5 space-y-4 bg-white dark:bg-zinc-900 shadow-xl border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FilePlus2 className="h-4 w-4 text-orange-500" /> Quick Note
              </CardTitle>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3">
              <Input
                label="Note Title"
                placeholder="e.g. Project Architecture Thoughts"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                autoFocus
              />
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Content</label>
                <textarea
                  placeholder="Capture ideas without friction..."
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full rounded-lg p-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button type="button" variant="secondary" className="flex-1 text-xs" onClick={() => setShowNoteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1 text-xs">
                  Save Note
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
