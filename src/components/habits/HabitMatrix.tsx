import React from 'react';
import { Flame, Check, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { Habit } from '../../types/lifeos';
import { getWeekDays } from '../../utils/date';
import { cn } from '../../utils/cn';

export interface HabitMatrixProps {
  habits: Habit[];
  todayDate: string;
  onToggleHabitDate: (habitId: string, dateStr: string) => void;
  onDeleteHabit: (habitId: string) => void;
  onAddHabit: () => void;
}

export const HabitMatrix: React.FC<HabitMatrixProps> = ({
  habits,
  todayDate,
  onToggleHabitDate,
  onDeleteHabit,
  onAddHabit,
}) => {
  const weekDays = getWeekDays(todayDate, todayDate);

  if (habits.length === 0) {
    return (
      <Card className="p-12 text-center bg-white dark:bg-zinc-900">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500 mb-3">
          <Flame className="h-6 w-6 fill-amber-500" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          No habits tracked yet
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
          Start small with 1 or 2 high-leverage rituals to establish consistent streaks.
        </p>
        <Button variant="primary" size="sm" onClick={onAddHabit} className="mt-4">
          Create First Habit
        </Button>
      </Card>
    );
  }

  return (
    <Card variant="default" className="overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Weekly Habit Matrix
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Check off daily completions across the current calendar week.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onAddHabit}
          leftIcon={<Plus className="h-3.5 w-3.5" />}
        >
          Add Habit
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60">
              <th className="py-3 px-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 w-1/3">
                Habit Ritual
              </th>
              <th className="py-3 px-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 text-center w-20">
                Streak
              </th>
              <th className="py-3 px-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 text-center w-24">
                Weekly Target
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.date}
                  className={cn(
                    'py-3 px-2 text-center transition-colors',
                    day.isToday && 'bg-indigo-50/50 dark:bg-indigo-950/30'
                  )}
                >
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    {day.dayName}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-mono font-bold inline-flex items-center justify-center h-5 w-5 rounded-full mt-0.5',
                      day.isToday
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-zinc-700 dark:text-zinc-300'
                    )}
                  >
                    {day.dayNumber}
                  </span>
                </th>
              ))}
              <th className="py-3 px-3 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400 w-12">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 text-xs">
            {habits.map((habit) => {
              const weekDateStrs = weekDays.map((d) => d.date);
              const completedInWeek = habit.completedDates.filter((d) =>
                weekDateStrs.includes(d)
              ).length;
              const isTargetMet = completedInWeek >= habit.targetDaysPerWeek;

              return (
                <tr
                  key={habit.id}
                  className="group hover:bg-zinc-50/60 dark:hover:bg-zinc-850/40 transition-colors"
                >
                  {/* Habit Name & Category */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                        {habit.name}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {habit.category}
                      </Badge>
                    </div>
                  </td>

                  {/* Active Streak */}
                  <td className="py-3.5 px-2 text-center">
                    <div className="inline-flex items-center gap-1 font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40">
                      <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{habit.streak}d</span>
                    </div>
                  </td>

                  {/* Target Progress */}
                  <td className="py-3.5 px-2 text-center font-mono">
                    <div className="inline-flex items-center gap-1">
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          isTargetMet
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-zinc-600 dark:text-zinc-300'
                        )}
                      >
                        {completedInWeek}/{habit.targetDaysPerWeek}
                      </span>
                      {isTargetMet && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                  </td>

                  {/* 7 Daily Checkboxes */}
                  {weekDays.map((day) => {
                    const isDone = habit.completedDates.includes(day.date);

                    return (
                      <td
                        key={day.date}
                        className={cn(
                          'py-3 px-2 text-center',
                          day.isToday && 'bg-indigo-50/30 dark:bg-indigo-950/20'
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => onToggleHabitDate(habit.id, day.date)}
                          className={cn(
                            'h-7 w-7 rounded-lg inline-flex items-center justify-center transition-all cursor-pointer',
                            isDone
                              ? 'bg-emerald-500 text-white shadow-2xs hover:bg-emerald-600'
                              : 'border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 text-transparent'
                          )}
                          title={`${habit.name} on ${day.dayName} (${day.date}): ${isDone ? 'Done' : 'Incomplete'}`}
                        >
                          <Check className={cn('h-4 w-4 stroke-[2.5]', isDone ? 'opacity-100' : 'opacity-0')} />
                        </button>
                      </td>
                    );
                  })}

                  {/* Delete Action */}
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                      title="Delete Habit"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

