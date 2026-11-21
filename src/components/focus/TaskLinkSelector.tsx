import React, { useState } from 'react';
import { CheckSquare, ChevronDown, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { Task } from '../../types/lifeos';

export interface TaskLinkSelectorProps {
  tasks: Task[];
  sessionLabel: string;
  onSessionLabelChange: (label: string) => void;
  linkedTaskId: string | null;
  onSelectTask: (task: Task | null) => void;
}

export const TaskLinkSelector: React.FC<TaskLinkSelectorProps> = ({
  tasks,
  sessionLabel,
  onSessionLabelChange,
  linkedTaskId,
  onSelectTask,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const pendingTasks = tasks.filter((t) => !t.completed);

  const handlePickTask = (task: Task) => {
    onSelectTask(task);
    onSessionLabelChange(task.title);
    setIsOpen(false);
  };

  const handleClearTask = () => {
    onSelectTask(null);
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Focus Target &amp; Sprint Label
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium flex items-center gap-1 cursor-pointer"
        >
          <CheckSquare className="h-3 w-3" />
          <span>{linkedTaskId ? 'Change linked task' : 'Link from tasks'}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="e.g. Deep Architecture Review or Signals &amp; Systems"
          value={sessionLabel}
          onChange={(e) => {
            onSessionLabelChange(e.target.value);
            if (linkedTaskId) onSelectTask(null); // Unlink if customized manually
          }}
          className="w-full h-10 px-3.5 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
        />

        {/* Dropdown list of pending tasks */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-12 z-20 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-2 space-y-1 max-h-56 overflow-y-auto">
            <div className="flex items-center justify-between pb-1 px-2 border-b border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
              <span>Select Pending Task</span>
              {linkedTaskId && (
                <button
                  type="button"
                  onClick={handleClearTask}
                  className="text-rose-500 hover:underline cursor-pointer"
                >
                  Unlink Task
                </button>
              )}
            </div>

            {pendingTasks.length === 0 ? (
              <div className="py-4 text-center text-xs text-zinc-400 italic">
                No pending tasks found. Type custom label above.
              </div>
            ) : (
              pendingTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handlePickTask(t)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                    linkedTaskId === t.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-800 dark:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Sparkles className="h-3 w-3 text-indigo-500 shrink-0" />
                    <span className="truncate font-medium">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="secondary" className="text-[9px] px-1 py-0">
                      {t.category}
                    </Badge>
                    <Badge
                      variant={t.priority === 'high' ? 'danger' : 'secondary'}
                      className="text-[9px] px-1 py-0"
                    >
                      {t.priority}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
