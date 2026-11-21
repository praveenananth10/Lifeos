import React from 'react';
import { Clock, MapPin, Plus, Check, CheckSquare, Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { CalendarEvent, Task } from '../../types/lifeos';

export interface DayViewProps {
  selectedDate: string;
  todayDate: string;
  events: CalendarEvent[];
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onAddEvent: (date: string) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  todayDate,
  events,
  tasks,
  onToggleTask,
  onEditEvent,
  onDeleteEvent,
  onAddEvent,
}) => {
  const dayEvents = events
    .filter((e) => e.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const dayTasks = tasks.filter((t) => t.dueDate === selectedDate);

  const formattedSelectedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${selectedDate}T00:00:00`));

  const isToday = selectedDate === todayDate;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Chronological Timeline */}
      <div className="lg:col-span-2 space-y-4">
        <Card variant="default">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">
                  {formattedSelectedDate}
                </CardTitle>
                {isToday && (
                  <Badge variant="indigo" className="text-[10px]">
                    Today
                  </Badge>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {dayEvents.length} scheduled block(s) for this day.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddEvent(selectedDate)}
              leftIcon={<Plus className="h-3.5 w-3.5" />}
            >
              Add Event
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {dayEvents.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
                  <Clock className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  No scheduled events for this day
                </p>
                <p className="text-[11px] text-zinc-400 mt-1 max-w-xs mx-auto">
                  Protect deep focus time or schedule important meetings and reviews.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3 text-xs"
                  onClick={() => onAddEvent(selectedDate)}
                >
                  Schedule Event
                </Button>
              </div>
            ) : (
              dayEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {evt.startTime} – {evt.endTime}
                      </span>
                      <Badge
                        variant={
                          evt.type === 'focus'
                            ? 'success'
                            : evt.type === 'deadline'
                            ? 'danger'
                            : 'indigo'
                        }
                        className="text-[10px] capitalize"
                      >
                        {evt.type}
                      </Badge>
                    </div>

                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {evt.title}
                    </h4>

                    {evt.location && (
                      <p className="text-xs text-zinc-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {evt.location}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditEvent(evt)}
                      leftIcon={<Pencil className="h-3 w-3" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteEvent(evt.id)}
                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Col: Tasks Due on this Day */}
      <div className="space-y-4">
        <Card variant="default">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-amber-500" />
                Deadlines Due
              </CardTitle>
              <Badge variant="outline" className="font-mono text-xs">
                {dayTasks.length}
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Tasks with target completion set to this date.
            </p>
          </CardHeader>

          <CardContent className="space-y-2">
            {dayTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400 italic">
                No task deadlines for this day.
              </div>
            ) : (
              dayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`flex items-start justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-zinc-50/70 dark:bg-zinc-900/30 border-zinc-200/50 dark:border-zinc-800/50 opacity-60'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`h-4 w-4 rounded mt-0.5 flex items-center justify-center shrink-0 ${
                        task.completed
                          ? 'bg-emerald-500 text-white'
                          : 'border border-zinc-300 dark:border-zinc-600'
                      }`}
                    >
                      {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <div>
                      <span
                        className={`text-xs font-medium block ${
                          task.completed ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-[10px] text-zinc-400">{task.category}</span>
                    </div>
                  </div>

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
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

