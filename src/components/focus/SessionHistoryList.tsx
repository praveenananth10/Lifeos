import React from 'react';
import { Clock, CheckCircle2, Trash2, Sparkles, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { FocusSession } from '../../types/lifeos';

export interface SessionHistoryListProps {
  focusSessions: FocusSession[];
  todayFocusMinutes: number;
  todayFocusSessionsCount: number;
  allTimeFocusSessionsCount: number;
  onDeleteSession: (id: string) => void;
}

export const SessionHistoryList: React.FC<SessionHistoryListProps> = ({
  focusSessions,
  todayFocusMinutes,
  todayFocusSessionsCount,
  allTimeFocusSessionsCount,
  onDeleteSession,
}) => {
  return (
    <div className="space-y-6">
      {/* 3 Summary Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Focused Today */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Focused Today
            </span>
            <div className="h-7 w-7 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400">
                {todayFocusMinutes}
              </span>
              <span className="text-xs text-zinc-400">minutes logged</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Active deep execution intervals
            </p>
          </div>
        </Card>

        {/* Sessions Completed Today */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Sessions Today
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {todayFocusSessionsCount}
              </span>
              <span className="text-xs text-zinc-400">cycles finished</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Pomodoro and custom blocks
            </p>
          </div>
        </Card>

        {/* All-Time Sessions */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              All-Time Focus Sessions
            </span>
            <div className="h-7 w-7 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
                {allTimeFocusSessionsCount}
              </span>
              <span className="text-xs text-zinc-400">total cycles</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Cumulative focused stamina
            </p>
          </div>
        </Card>
      </div>

      {/* Session History List Card */}
      <Card variant="default">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-orange-500" />
            Focus Session History
          </CardTitle>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Chronological log of completed deep focus blocks.
          </p>
        </CardHeader>

        <CardContent className="space-y-2">
          {focusSessions.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400 italic">
              No focus sessions logged yet. Complete a cycle above to begin your log.
            </div>
          ) : (
            focusSessions.map((session) => {
              const formattedTime = new Date(session.completedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const formattedDate = new Date(session.completedAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={session.id}
                  className="group p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>

                    <div className="space-y-0.5 truncate">
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {session.label}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                        <Badge
                          variant={session.mode === 'pomodoro' ? 'orange' : 'secondary'}
                          className="text-[9px] px-1.5 py-0 capitalize"
                        >
                          {session.mode}
                        </Badge>
                        <span>•</span>
                        <span>
                          {formattedDate} at {formattedTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
                      {session.durationMinutes}m
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteSession(session.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-all cursor-pointer"
                      title="Delete session log"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};
