import React from 'react';
import { Plus, MapPin, Check } from 'lucide-react';
import type { CalendarEvent, Task } from '../../types/lifeos';
import { getWeekDays } from '../../utils/date';
import { cn } from '../../utils/cn';

export interface WeekViewProps {
  baseDate: string;
  todayDate: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  events: CalendarEvent[];
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onAddEventForDate: (date: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  baseDate,
  todayDate,
  selectedDate,
  onSelectDate,
  events,
  tasks,
  onToggleTask,
  onEditEvent,
  onAddEventForDate,
}) => {
  const weekDays = getWeekDays(baseDate, todayDate);

  const getEventBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'focus':
        return 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300';
      case 'deadline':
        return 'border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300';
      case 'event':
      default:
        return 'border-orange-200 dark:border-orange-900 bg-orange-50/70 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300';
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
      {/* 7 Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/70 dark:divide-zinc-800/70">
        {weekDays.map((day) => {
          const isToday = day.isToday;
          const isSelected = day.date === selectedDate;
          const dayEvents = events
            .filter((e) => e.date === day.date)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          const dayTasks = tasks.filter((t) => t.dueDate === day.date);

          return (
            <div
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className={cn(
                'min-h-[380px] p-2.5 sm:p-3 flex flex-col transition-all cursor-pointer select-none group',
                isSelected
                  ? 'bg-orange-50/20 dark:bg-orange-950/20'
                  : 'bg-white dark:bg-zinc-900 hover:bg-zinc-50/60 dark:hover:bg-zinc-850/40'
              )}
            >
              {/* Day Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="text-left">
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                      {day.dayName}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-mono font-bold h-6 w-6 rounded-full inline-flex items-center justify-center transition-colors',
                        isToday
                          ? 'bg-orange-600 text-white shadow-xs'
                          : isSelected
                          ? 'text-orange-600 dark:text-orange-400 font-bold'
                          : 'text-zinc-850 dark:text-zinc-150'
                      )}
                    >
                      {day.dayNumber}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEventForDate(day.date);
                  }}
                  title="Add Event on this day"
                  className="h-6 w-6 rounded-md opacity-60 group-hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-orange-600 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Day Content: Scheduled Blocks */}
              <div className="space-y-2 flex-1">
                {dayEvents.length === 0 && dayTasks.length === 0 && (
                  <div className="py-8 text-center text-[11px] text-zinc-400 italic">
                    No items scheduled
                  </div>
                )}

                {/* Scheduled Events */}
                {dayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEvent(evt);
                    }}
                    className={cn(
                      'p-2 rounded-xl border text-left transition-all cursor-pointer hover:shadow-2xs',
                      getEventBadge(evt.type)
                    )}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-semibold">
                      <span>
                        {evt.startTime} – {evt.endTime}
                      </span>
                      <span className="uppercase text-[9px] opacity-75">{evt.type}</span>
                    </div>

                    <h5 className="text-xs font-semibold mt-1 tracking-tight truncate">
                      {evt.title}
                    </h5>

                    {evt.location && (
                      <p className="text-[10px] opacity-80 flex items-center gap-1 mt-1 truncate">
                        <MapPin className="h-2.5 w-2.5" /> {evt.location}
                      </p>
                    )}
                  </div>
                ))}

                {/* Tasks Due Today in this week column */}
                {dayTasks.length > 0 && (
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                      Deadlines ({dayTasks.length})
                    </span>

                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTask(task.id);
                        }}
                        className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                          task.completed
                            ? 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/50 opacity-60'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                        }`}
                      >
                        <div
                          className={`h-3.5 w-3.5 rounded flex items-center justify-center shrink-0 ${
                            task.completed
                              ? 'bg-emerald-500 text-white'
                              : 'border border-zinc-300 dark:border-zinc-600'
                          }`}
                        >
                          {task.completed && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-[11px] truncate ${
                            task.completed ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
