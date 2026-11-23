import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Task, CalendarEventType } from '../../types/lifeos';

export interface ScheduleTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  todayDate: string;
  onSchedule: (
    taskId: string,
    date: string,
    startTime: string,
    endTime: string,
    type: CalendarEventType
  ) => void;
}

interface ScheduleTaskModalFormProps {
  task: Task;
  todayDate: string;
  onSchedule: (
    taskId: string,
    date: string,
    startTime: string,
    endTime: string,
    type: CalendarEventType
  ) => void;
  onClose: () => void;
}

const ScheduleTaskModalForm: React.FC<ScheduleTaskModalFormProps> = ({
  task,
  todayDate,
  onSchedule,
  onClose,
}) => {
  const [date, setDate] = useState(task.dueDate || todayDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [type, setType] = useState<CalendarEventType>('focus');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      setError('Date is required');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    onSchedule(task.id, date, startTime, endTime, type);
    onClose();
  };

  const applyPreset = (start: string, end: string, eventType: CalendarEventType) => {
    setStartTime(start);
    setEndTime(end);
    setType(eventType);
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Date */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Scheduled Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full h-9 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Quick Presets */}
      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          Quick Time Slots
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset('09:00', '10:30', 'focus')}
            className="text-[10px] py-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 cursor-pointer flex flex-col items-center"
          >
            <span className="font-semibold">Morning Focus</span>
            <span className="text-zinc-400 text-[9px]">09:00 - 10:30</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset('14:00', '15:30', 'focus')}
            className="text-[10px] py-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 cursor-pointer flex flex-col items-center"
          >
            <span className="font-semibold">Afternoon Sprint</span>
            <span className="text-zinc-400 text-[9px]">14:00 - 15:30</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset('16:30', '17:30', 'deadline')}
            className="text-[10px] py-1.5 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 cursor-pointer flex flex-col items-center"
          >
            <span className="font-semibold">Review / Close</span>
            <span className="text-zinc-400 text-[9px]">16:30 - 17:30</span>
          </button>
        </div>
      </div>

      {/* Start & End Times */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
            <Clock className="h-3 w-3 text-zinc-400" /> Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full h-9 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
            <Clock className="h-3 w-3 text-zinc-400" /> End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full h-9 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Event Type */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Block Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'focus', label: 'Deep Focus', desc: 'Distraction-free' },
              { id: 'deadline', label: 'Deadline', desc: 'Must finish' },
              { id: 'event', label: 'Event', desc: 'Calendar item' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setType(item.id)}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                type === item.id
                  ? 'bg-orange-50/70 dark:bg-orange-950/40 border-orange-500 dark:border-orange-500 text-orange-700 dark:text-orange-300'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
              }`}
            >
              <div className="text-xs font-medium">{item.label}</div>
              <div className="text-[10px] text-zinc-400">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm">
          Add to Calendar
        </Button>
      </div>
    </form>
  );
};

export const ScheduleTaskModal: React.FC<ScheduleTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  todayDate,
  onSchedule,
}) => {
  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <span>Schedule Task on Calendar</span>
        </div>
      }
      description={`Block dedicated time to execute "${task.title}".`}
      maxWidth="md"
    >
      <ScheduleTaskModalForm
        key={task.id}
        task={task}
        todayDate={todayDate}
        onSchedule={onSchedule}
        onClose={onClose}
      />
    </Modal>
  );
};
