import React, { useState } from 'react';
import { Target, Plus, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Goal, GoalHorizon } from '../../types/lifeos';

export interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayDate: string;
  onSave: (goal: Omit<Goal, 'id'>) => void;
}

interface CreateGoalFormProps {
  todayDate: string;
  onSave: (goal: Omit<Goal, 'id'>) => void;
  onClose: () => void;
}

const CreateGoalForm: React.FC<CreateGoalFormProps> = ({ todayDate, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [horizon, setHorizon] = useState<GoalHorizon>('short-term');
  const [targetDate, setTargetDate] = useState(todayDate);
  const [milestones, setMilestones] = useState<string[]>([]);
  const [newMilestoneInput, setNewMilestoneInput] = useState('');
  const [error, setError] = useState('');

  const handleAddMilestone = () => {
    if (!newMilestoneInput.trim()) return;
    setMilestones((prev) => [...prev, newMilestoneInput.trim()]);
    setNewMilestoneInput('');
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Goal title is required');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      horizon,
      targetDate: targetDate || todayDate,
      milestones: milestones.map((m, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        title: m,
        completed: false,
      })),
    });
    onClose();
  };

  const setOffsetDate = (months: number) => {
    const [y, m, d] = todayDate.split('-').map(Number);
    const date = new Date(y, m - 1 + months, d);
    const yStr = date.getFullYear();
    const mStr = String(date.getMonth() + 1).padStart(2, '0');
    const dStr = String(date.getDate()).padStart(2, '0');
    setTargetDate(`${yStr}-${mStr}-${dStr}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Goal Title"
        placeholder="e.g. Ship LifeOS 1.0 Production Platform"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (error) setError('');
        }}
        error={error}
        autoFocus
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Description
        </label>
        <textarea
          placeholder="Clarify what victory looks like and key parameters..."
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg p-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 resize-none"
        />
      </div>

      {/* Horizon selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Time Horizon
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setHorizon('short-term')}
            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
              horizon === 'short-term'
                ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-700 dark:text-orange-300'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <div className="text-xs font-semibold">Short-Term Horizon</div>
            <div className="text-[10px] text-zinc-400">Current quarter (1–3 months)</div>
          </button>
          <button
            type="button"
            onClick={() => setHorizon('long-term')}
            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
              horizon === 'long-term'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <div className="text-xs font-semibold">Long-Term Horizon</div>
            <div className="text-[10px] text-zinc-400">Annual or multi-year vision</div>
          </button>
        </div>
      </div>

      {/* Target Date */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Target Completion Date
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOffsetDate(1)}
              className="text-[10px] text-zinc-500 hover:text-orange-600 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800"
            >
              +1M
            </button>
            <button
              type="button"
              onClick={() => setOffsetDate(3)}
              className="text-[10px] text-zinc-500 hover:text-orange-600 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800"
            >
              +3M
            </button>
            <button
              type="button"
              onClick={() => setOffsetDate(6)}
              className="text-[10px] text-zinc-500 hover:text-orange-600 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800"
            >
              +6M
            </button>
            <button
              type="button"
              onClick={() => setOffsetDate(12)}
              className="text-[10px] text-zinc-500 hover:text-orange-600 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800"
            >
              +1Y
            </button>
          </div>
        </div>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full h-9 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Initial Milestones Builder */}
      <div className="space-y-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Initial Milestones <span className="text-zinc-400 font-normal">(optional)</span>
        </label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add concrete milestone title..."
            value={newMilestoneInput}
            onChange={(e) => setNewMilestoneInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMilestone();
              }
            }}
            className="flex-1 h-8 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddMilestone}
            leftIcon={<Plus className="h-3 w-3" />}
          >
            Add
          </Button>
        </div>

        {milestones.length > 0 && (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pt-1">
            {milestones.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-xs"
              >
                <span className="truncate text-zinc-800 dark:text-zinc-200">{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMilestone(idx)}
                  className="text-zinc-400 hover:text-rose-500 transition-colors p-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm">
          Create Goal
        </Button>
      </div>
    </form>
  );
};

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  todayDate,
  onSave,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <span>New Strategic Goal</span>
        </div>
      }
      description="Define measurable outcomes, target dates, and key milestones."
      maxWidth="md"
    >
      <CreateGoalForm
        key={isOpen ? 'open' : 'closed'}
        todayDate={todayDate}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
};

