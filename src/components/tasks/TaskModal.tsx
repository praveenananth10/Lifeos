import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Task, TaskCategory, TaskPriority } from '../../types/lifeos';

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task | null;
  todayDate: string;
  onSave: (taskData: {
    title: string;
    description?: string;
    category: TaskCategory;
    priority: TaskPriority;
    dueDate: string;
    completed: boolean;
  }) => void;
}

const CATEGORIES: TaskCategory[] = ['Work', 'Study', 'Personal', 'Health', 'Finance'];
const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

interface TaskModalFormProps {
  initialTask?: Task | null;
  todayDate: string;
  onSave: (taskData: {
    title: string;
    description?: string;
    category: TaskCategory;
    priority: TaskPriority;
    dueDate: string;
    completed: boolean;
  }) => void;
  onClose: () => void;
}

const TaskModalForm: React.FC<TaskModalFormProps> = ({
  initialTask,
  todayDate,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialTask ? initialTask.title : '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category || 'Work');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || todayDate);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      dueDate: dueDate || todayDate,
      completed: initialTask ? initialTask.completed : false,
    });
    onClose();
  };

  const setRelativeDate = (offsetDays: number) => {
    const [y, m, d] = todayDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + offsetDays);
    const yStr = date.getFullYear();
    const mStr = String(date.getMonth() + 1).padStart(2, '0');
    const dStr = String(date.getDate()).padStart(2, '0');
    setDueDate(`${yStr}-${mStr}-${dStr}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Task Title */}
      <Input
        label="Title"
        placeholder="e.g. Implement OAuth Flow or Review budget"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (error) setError('');
        }}
        error={error}
        autoFocus
      />

      {/* Description */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Description <span className="text-zinc-400 font-normal">(optional)</span>
        </label>
        <textarea
          placeholder="Add relevant notes, checklist items, or subtext..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg p-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 resize-none transition-all"
        />
      </div>

      {/* Category & Priority in 2-col */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            className="w-full h-9 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500 transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Priority
          </label>
          <div className="grid grid-cols-3 gap-1">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`h-9 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  priority === p.value
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Due Date & Quick presets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Due Date
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setRelativeDate(0)}
              className="text-[10px] text-zinc-500 hover:text-orange-600 dark:hover:text-orange-400 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setRelativeDate(1)}
              className="text-[10px] text-zinc-500 hover:text-orange-600 dark:hover:text-orange-400 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setRelativeDate(7)}
              className="text-[10px] text-zinc-500 hover:text-orange-600 dark:hover:text-orange-400 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
            >
              +1 Week
            </button>
          </div>
        </div>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full h-9 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm">
          {initialTask ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  initialTask,
  todayDate,
  onSave,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? 'Edit Task' : 'Create New Task'}
      description="Linear-style rapid task capture and prioritization."
      maxWidth="md"
    >
      <TaskModalForm
        key={initialTask?.id || 'new-task'}
        initialTask={initialTask}
        todayDate={todayDate}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
};
