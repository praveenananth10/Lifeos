import React from 'react';
import { CheckSquare } from 'lucide-react';
import type { CalendarEvent, Task } from '../../types/lifeos';
import { DAY_NAMES, getMonthGrid } from '../../utils/date';
import { cn } from '../../utils/cn';

export interface MonthViewProps {
  currentYear: number;
  currentMonth: number;
  todayDate: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  events: CalendarEvent[];
  tasks: Task[];
  onEditEvent: (event: CalendarEvent) => void;
  onAddEventForDate: (date: string) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentYear,
  currentMonth,
  todayDate,
  selectedDate,
  onSelectDate,
  events,
  tasks,
  onEditEvent,
}) => {
  const grid = getMonthGrid(currentYear, currentMonth, todayDate);

  const getPillStyles = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'focus':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/60';
      case 'deadline':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/70 dark:border-rose-800/60';
      case 'event':
      default:
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200/70 dark:border-orange-800/60';
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
      {/* 7-column Weekday Header */}
      <div className="grid grid-cols-7 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/80">
        {DAY_NAMES.map((day) => (
          <div
            key={day}
            className="py-2.5 text-center text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
        {grid.map((cell) => {
          const dayEvents = events.filter((e) => e.date === cell.date);
          const dayTasks = tasks.filter((t) => t.dueDate === cell.date && !t.completed);
          const isSelected = cell.date === selectedDate;

          const totalItems = dayEvents.length + (dayTasks.length > 0 ? 1 : 0);
          const maxVisible = 2;
          const overflowCount = totalItems - maxVisible;

          return (
            <div
              key={cell.date}
              onClick={() => onSelectDate(cell.date)}
              className={cn(
                'min-h-[96px] sm:min-h-[110px] p-1.5 sm:p-2 transition-all flex flex-col justify-between cursor-pointer select-none relative group',
                !cell.isCurrentMonth && 'bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-400',
                cell.isCurrentMonth && 'bg-white dark:bg-zinc-900 hover:bg-zinc-50/80 dark:hover:bg-zinc-850/50',
                isSelected && 'ring-2 ring-orange-500 ring-inset bg-orange-50/15 dark:bg-orange-950/20 z-10'
              )}
            >
              {/* Day Header: Number & Indicators */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'text-xs font-mono font-medium h-6 w-6 rounded-full flex items-center justify-center transition-colors',
                    cell.isToday
                      ? 'bg-orange-600 text-white font-bold shadow-xs'
                      : isSelected
                      ? 'text-orange-600 dark:text-orange-400 font-bold'
                      : cell.isCurrentMonth
                      ? 'text-zinc-800 dark:text-zinc-200'
                      : 'text-zinc-400 dark:text-zinc-600'
                  )}
                >
                  {cell.dayNumber}
                </span>

                {dayTasks.length > 0 && (
                  <span
                    title={`${dayTasks.length} pending task(s) due`}
                    className="flex items-center gap-0.5 text-[10px] font-mono font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1 py-0.2 rounded"
                  >
                    <CheckSquare className="h-2.5 w-2.5" />
                    <span>{dayTasks.length}</span>
                  </span>
                )}
              </div>

              {/* Event Pills */}
              <div className="space-y-1 mt-1.5 flex-1 overflow-hidden">
                {dayEvents.slice(0, maxVisible).map((evt) => (
                  <div
                    key={evt.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEvent(evt);
                    }}
                    className={cn(
                      'text-[10px] truncate px-1.5 py-0.5 rounded border transition-all cursor-pointer font-medium flex items-center justify-between',
                      getPillStyles(evt.type)
                    )}
                    title={`${evt.startTime} - ${evt.endTime}: ${evt.title}`}
                  >
                    <span className="truncate">{evt.title}</span>
                    <span className="hidden sm:inline font-mono text-[9px] opacity-75 shrink-0 ml-1">
                      {evt.startTime}
                    </span>
                  </div>
                ))}

                {overflowCount > 0 && (
                  <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 px-1 font-medium">
                    +{overflowCount} more
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

