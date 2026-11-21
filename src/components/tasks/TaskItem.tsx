import React from 'react';
import { Check, Calendar, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { Task } from '../../types/lifeos';
import { formatTaskDueDate } from '../../utils/date';
import { cn } from '../../utils/cn';

export interface TaskItemProps {
  task: Task;
  todayDate: string;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onSchedule: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  todayDate,
  onToggle,
  onEdit,
  onDelete,
  onSchedule,
}) => {
  const { label: dueLabel, isOverdue, isToday, isTomorrow } = formatTaskDueDate(
    task.dueDate,
    todayDate
  );

  const categoryColors: Record<string, string> = {
    Work: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40',
    Study: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/40',
    Personal: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/40',
    Health: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40',
    Finance: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40',
  };

  return (
    <div
      className={cn(
        'group relative flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150',
        task.completed
          ? 'bg-zinc-50/70 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/40 opacity-60'
          : 'bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-2xs hover:shadow-xs'
      )}
    >
      {/* Left: Checkbox & Content */}
      <div className="flex items-start gap-3 min-w-0 pr-3">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={cn(
            'h-4.5 w-4.5 rounded-md mt-0.5 flex items-center justify-center transition-all shrink-0 cursor-pointer',
            task.completed
              ? 'bg-emerald-500 text-white'
              : 'border border-zinc-300 dark:border-zinc-600 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30'
          )}
          aria-label={task.completed ? 'Mark task pending' : 'Mark task completed'}
        >
          {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
        </button>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-xs sm:text-sm font-medium tracking-tight truncate cursor-pointer select-none',
                task.completed
                  ? 'line-through text-zinc-400 dark:text-zinc-500'
                  : 'text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400'
              )}
              onClick={() => onToggle(task.id)}
            >
              {task.title}
            </span>
          </div>

          {task.description && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 pr-4">
              {task.description}
            </p>
          )}

          {/* Metadata badges for mobile */}
          <div className="flex sm:hidden items-center gap-1.5 pt-0.5 flex-wrap">
            <span
              className={cn(
                'text-[9px] font-medium px-1.5 py-0.5 rounded border',
                categoryColors[task.category] || 'bg-zinc-100 text-zinc-600'
              )}
            >
              {task.category}
            </span>
            <Badge
              variant={
                task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'secondary'
              }
              dot
              className="text-[9px] px-1.5 py-0"
            >
              {task.priority}
            </Badge>
            <span
              className={cn(
                'text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center gap-0.5',
                isOverdue && !task.completed
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold'
                  : isToday
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 font-medium'
                  : 'text-zinc-400'
              )}
            >
              {isOverdue && !task.completed && <AlertCircle className="h-2.5 w-2.5 inline" />}
              {dueLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Badges & Hover Actions (Desktop) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Category Pill */}
        <span
          className={cn(
            'hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded border',
            categoryColors[task.category] || 'bg-zinc-100 text-zinc-600'
          )}
        >
          {task.category}
        </span>

        {/* Priority Badge */}
        <Badge
          variant={
            task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'secondary'
          }
          dot
          className="hidden sm:inline-flex text-[10px]"
        >
          {task.priority}
        </Badge>

        {/* Due Date Pill */}
        <span
          className={cn(
            'hidden sm:flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border',
            isOverdue && !task.completed
              ? 'bg-rose-50 border-rose-200/80 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/40 dark:text-rose-300 font-semibold'
              : isToday
              ? 'bg-indigo-50 border-indigo-200/80 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/40 dark:text-indigo-300 font-medium'
              : isTomorrow
              ? 'bg-amber-50 border-amber-200/80 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900/40 dark:text-amber-300'
              : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400'
          )}
        >
          {isOverdue && !task.completed && <AlertCircle className="h-3 w-3" />}
          {dueLabel}
        </span>

        {/* Action Buttons: Schedule, Edit, Delete */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onSchedule(task)}
            title="Schedule on Calendar"
            className="h-7 w-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Calendar className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="h-7 w-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            title="Delete Task"
            className="h-7 w-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

