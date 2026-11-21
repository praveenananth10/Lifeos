import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Habit } from '../../types/lifeos';

export interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates'>) => void;
}

const HABIT_CATEGORIES = [
  'Health',
  'Mindfulness',
  'Learning',
  'Fitness',
  'Productivity',
  'Personal',
];

interface CreateHabitFormProps {
  onSave: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates'>) => void;
  onClose: () => void;
}

const CreateHabitForm: React.FC<CreateHabitFormProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Health');
  const [targetDaysPerWeek, setTargetDaysPerWeek] = useState(7);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Habit name is required');
      return;
    }

    onSave({
      name: name.trim(),
      category,
      targetDaysPerWeek,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Habit Name"
        placeholder="e.g. Morning Hydration (750ml) or 20m Read"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError('');
        }}
        error={error}
        autoFocus
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-9 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
        >
          {HABIT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Weekly Frequency Target
          </label>
          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {targetDaysPerWeek} days / week
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setTargetDaysPerWeek(num)}
              className={`h-9 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                targetDaysPerWeek === num
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
              }`}
            >
              {num}d
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm">
          Create Habit
        </Button>
      </div>
    </form>
  );
};

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
          <span>New Daily Habit</span>
        </div>
      }
      description="Design a small, repeatable daily ritual to build consistency."
      maxWidth="md"
    >
      <CreateHabitForm key={isOpen ? 'open' : 'closed'} onSave={onSave} onClose={onClose} />
    </Modal>
  );
};

