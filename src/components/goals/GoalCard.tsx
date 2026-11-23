import React, { useState } from 'react';
import { Calendar, Check, Plus, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { Goal } from '../../types/lifeos';
import { cn } from '../../utils/cn';

export interface GoalCardProps {
  goal: Goal;
  todayDate: string;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onAddMilestone: (goalId: string, title: string) => void;
  onDeleteMilestone: (goalId: string, milestoneId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  todayDate,
  onToggleMilestone,
  onAddMilestone,
  onDeleteMilestone,
  onDeleteGoal,
}) => {
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  const doneCount = goal.milestones.filter((m) => m.completed).length;
  const totalCount = goal.milestones.length;
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const isCompleted = totalCount > 0 && doneCount === totalCount;

  // Calculate days remaining
  const [tY, tM, tD] = goal.targetDate.split('-').map(Number);
  const targetTime = new Date(tY, tM - 1, tD).getTime();
  const [cY, cM, cD] = todayDate.split('-').map(Number);
  const currentTime = new Date(cY, cM - 1, cD).getTime();
  const diffDays = Math.ceil((targetTime - currentTime) / (1000 * 60 * 60 * 24));

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneText.trim()) return;
    onAddMilestone(goal.id, newMilestoneText.trim());
    setNewMilestoneText('');
    setIsAddingMilestone(false);
  };

  return (
    <Card
      variant="default"
      className={cn(
        'p-5 space-y-4 transition-all duration-200 group border',
        isCompleted
          ? 'border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/10 dark:bg-emerald-950/10'
          : 'border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700'
      )}
    >
      {/* Top Meta: Horizon, Target Date & Delete Goal */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant={goal.horizon === 'short-term' ? 'orange' : 'success'}
            className="text-[10px] uppercase tracking-wider"
          >
            {goal.horizon}
          </Badge>

          {isCompleted ? (
            <Badge variant="success" className="text-[10px] gap-1">
              <CheckCircle2 className="h-3 w-3" /> Completed
            </Badge>
          ) : (
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {diffDays > 0 ? `${diffDays} days left` : diffDays === 0 ? 'Due today' : 'Overdue'}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDeleteGoal(goal.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          title="Delete Goal"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Title & Description */}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {goal.title}
        </h3>
        {goal.description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {goal.description}
          </p>
        )}
      </div>

      {/* Progress Bar & Percentage */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">Progress</span>
          <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
            {percent}%
          </span>
        </div>
        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              isCompleted ? 'bg-emerald-500' : 'bg-orange-600 dark:bg-orange-500'
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Milestones Checklist */}
      <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Milestones ({doneCount}/{totalCount})
          </span>

          {!isAddingMilestone && (
            <button
              type="button"
              onClick={() => setIsAddingMilestone(true)}
              className="text-[11px] font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="h-3 w-3" /> Add milestone
            </button>
          )}
        </div>

        {/* Milestone Items */}
        <div className="space-y-1.5">
          {goal.milestones.map((m) => (
            <div
              key={m.id}
              className={cn(
                'group/item flex items-center justify-between p-2 rounded-lg border text-xs transition-colors',
                m.completed
                  ? 'bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/50 opacity-70'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
              )}
            >
              <div
                className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                onClick={() => onToggleMilestone(goal.id, m.id)}
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded flex items-center justify-center shrink-0 transition-colors',
                    m.completed
                      ? 'bg-emerald-500 text-white'
                      : 'border border-zinc-300 dark:border-zinc-600 hover:border-orange-500'
                  )}
                >
                  {m.completed && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <span
                  className={cn(
                    'truncate',
                    m.completed
                      ? 'line-through text-zinc-400 dark:text-zinc-500'
                      : 'text-zinc-800 dark:text-zinc-200'
                  )}
                >
                  {m.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onDeleteMilestone(goal.id, m.id)}
                className="opacity-0 group-hover/item:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-opacity ml-2 shrink-0 cursor-pointer"
                title="Delete Milestone"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Inline Add Milestone Form */}
          {isAddingMilestone && (
            <form onSubmit={handleAddMilestone} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                placeholder="New milestone title..."
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                autoFocus
                className="flex-1 h-8 rounded-lg px-2.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
              />
              <Button type="submit" variant="primary" size="sm" className="h-8 px-2.5 text-xs">
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => {
                  setIsAddingMilestone(false);
                  setNewMilestoneText('');
                }}
              >
                Cancel
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Target Date Footer */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <span>Target: {goal.targetDate}</span>
        <span className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-medium">
          OKRs <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </Card>
  );
};

