import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import type { Habit } from '../../types/lifeos';
import { getLastNDays } from '../../utils/date';
import { cn } from '../../utils/cn';

export interface HabitAnalyticsProps {
  habits: Habit[];
  todayDate: string;
}

export const HabitAnalytics: React.FC<HabitAnalyticsProps> = ({ habits, todayDate }) => {
  // 1. Prepare 14-day completion data for the Bar Chart
  const last14Days = getLastNDays(todayDate, 14);

  const chartData = last14Days.map((dateStr) => {
    const [, month, day] = dateStr.split('-');
    const completedCount = habits.filter((h) => h.completedDates.includes(dateStr)).length;
    const totalCount = habits.length;
    const rate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      date: `${month}/${day}`,
      fullDate: dateStr,
      rate,
      completedCount,
      totalCount,
    };
  });

  // 2. Prepare 30-day activity heatmap data
  const last30Days = getLastNDays(todayDate, 30);

  const getHeatmapColor = (completedCount: number, totalCount: number) => {
    if (completedCount === 0 || totalCount === 0) {
      return 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200/60 dark:border-zinc-700/50';
    }
    const ratio = completedCount / totalCount;
    if (ratio <= 0.34) {
      return 'bg-indigo-200 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-800/60';
    }
    if (ratio <= 0.67) {
      return 'bg-indigo-400 dark:bg-indigo-600/70 border-indigo-500 dark:border-indigo-500/60';
    }
    return 'bg-indigo-600 dark:bg-indigo-500 border-indigo-700 dark:border-indigo-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 14-Day Completion Rate Chart */}
      <Card variant="default">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            14-Day Completion Rate (%)
          </CardTitle>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Overall daily percentage of active habits executed.
          </p>
        </CardHeader>

        <CardContent>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#71717a' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e4e4e7' }}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 50, 100]}
                  tick={{ fontSize: 10, fill: '#71717a' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as (typeof chartData)[0];
                      return (
                        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 shadow-lg text-xs space-y-1">
                          <div className="font-semibold text-zinc-900 dark:text-zinc-50 font-mono">
                            {data.fullDate}
                          </div>
                          <div className="text-indigo-600 dark:text-indigo-400 font-bold">
                            {data.rate}% Completion
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            {data.completedCount} of {data.totalCount} habits done
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="rate"
                  fill="#4F46E5"
                  radius={[4, 4, 0, 0]}
                  className="fill-indigo-600 dark:fill-indigo-500"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 30-Day Consistency Heatmap Grid */}
      <Card variant="default">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            30-Day Activity Heatmap
          </CardTitle>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Visual momentum and daily habit consistency over the last month.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Heatmap Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 pt-2">
            {last30Days.map((dStr) => {
              const completedCount = habits.filter((h) => h.completedDates.includes(dStr)).length;
              const totalCount = habits.length;
              const rate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
              const isToday = dStr === todayDate;

              return (
                <div
                  key={dStr}
                  title={`${dStr}: ${completedCount}/${totalCount} habits (${rate}%)`}
                  className={cn(
                    'h-8 sm:h-9 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer select-none relative group',
                    getHeatmapColor(completedCount, totalCount),
                    isToday && 'ring-2 ring-indigo-500 ring-offset-1'
                  )}
                >
                  <span
                    className={cn(
                      'text-[9px] font-mono font-medium',
                      rate > 50 ? 'text-white font-bold' : 'text-zinc-600 dark:text-zinc-300'
                    )}
                  >
                    {dStr.split('-')[2]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span>Past 30 Days</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="h-3 w-3 rounded-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
              <div className="h-3 w-3 rounded-xs bg-indigo-200 dark:bg-indigo-950/70" />
              <div className="h-3 w-3 rounded-xs bg-indigo-400 dark:bg-indigo-600/70" />
              <div className="h-3 w-3 rounded-xs bg-indigo-600 dark:bg-indigo-500" />
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

