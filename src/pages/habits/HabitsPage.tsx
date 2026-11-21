import React, { useState } from 'react';
import { Flame, Plus, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { HabitMatrix } from '../../components/habits/HabitMatrix';
import { HabitAnalytics } from '../../components/habits/HabitAnalytics';
import { CreateHabitModal } from '../../components/habits/CreateHabitModal';
import { useLifeOS } from '../../hooks/useLifeOS';

export const HabitsPage: React.FC = () => {
  const {
    habits,
    todayDate,
    toggleHabitDate,
    addHabit,
    deleteHabit,
    habitsCompletedTodayCount,
    totalHabitsCount,
    bestHabitStreak,
    weeklyConsistencyPercent,
  } = useLifeOS();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayCompletionRate =
    totalHabitsCount > 0
      ? Math.round((habitsCompletedTodayCount / totalHabitsCount) * 100)
      : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
              <Flame className="h-4 w-4 fill-amber-500" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Habit Tracker &amp; Consistency
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Build compounding consistency through daily check-ins and streak retention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            New Habit
          </Button>
        </div>
      </div>

      {/* 2. Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Completion */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Today's Completion
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
                {habitsCompletedTodayCount} / {totalHabitsCount}
              </span>
              <span className="text-xs text-zinc-400">habits done</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${todayCompletionRate}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Best Active Streak */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Best Active Streak
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center">
              <Flame className="h-3.5 w-3.5 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {bestHabitStreak} Days
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Top consecutive unbroken chain across all active rituals.
            </p>
          </div>
        </Card>

        {/* Weekly Consistency */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Weekly Consistency %
            </span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {weeklyConsistencyPercent}%
              </span>
              <Badge variant="indigo" className="text-[10px]">
                Current Week
              </Badge>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${weeklyConsistencyPercent}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Interactive Weekly Matrix */}
      <HabitMatrix
        habits={habits}
        todayDate={todayDate}
        onToggleHabitDate={toggleHabitDate}
        onDeleteHabit={deleteHabit}
        onAddHabit={() => setIsModalOpen(true)}
      />

      {/* 4. Analytics: 14-Day Recharts Bar Chart & 30-Day Heatmap */}
      <HabitAnalytics habits={habits} todayDate={todayDate} />

      {/* 5. Create Habit Modal */}
      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => addHabit(data)}
      />
    </div>
  );
};

