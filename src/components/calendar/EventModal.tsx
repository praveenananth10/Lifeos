import React, { useState } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { CalendarEvent, CalendarEventType } from '../../types/lifeos';

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  defaultDate: string;
  onSave: (eventData: Omit<CalendarEvent, 'id'> | CalendarEvent) => void;
  onDelete?: (id: string) => void;
}

interface EventModalFormProps {
  event?: CalendarEvent | null;
  defaultDate: string;
  onSave: (eventData: Omit<CalendarEvent, 'id'> | CalendarEvent) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const EventModalForm: React.FC<EventModalFormProps> = ({
  event,
  defaultDate,
  onSave,
  onDelete,
  onClose,
}) => {
  const [title, setTitle] = useState(event ? event.title : '');
  const [date, setDate] = useState(event ? event.date : defaultDate);
  const [startTime, setStartTime] = useState(event ? event.startTime : '09:00');
  const [endTime, setEndTime] = useState(event ? event.endTime : '10:00');
  const [type, setType] = useState<CalendarEventType>(event ? event.type : 'event');
  const [location, setLocation] = useState(event?.location || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Event title is required');
      return;
    }

    if (!date) {
      setError('Date is required');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    if (event) {
      onSave({
        ...event,
        title: title.trim(),
        date,
        startTime,
        endTime,
        type,
        location: location.trim() || undefined,
      });
    } else {
      onSave({
        title: title.trim(),
        date,
        startTime,
        endTime,
        type,
        location: location.trim() || undefined,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Input
        label="Title"
        placeholder="e.g. Design System Review or Deep Work Sprint"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (error) setError('');
        }}
        autoFocus
      />

      {/* Date */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full h-9 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
        />
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
          Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'event', label: 'Calendar Event' },
              { id: 'focus', label: 'Focus Session' },
              { id: 'deadline', label: 'Key Deadline' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={`py-2 px-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                type === t.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location / Context */}
      <Input
        label="Location or Context (optional)"
        placeholder="e.g. Google Meet, Studio Room 2, or Notion"
        leftIcon={<MapPin className="h-3.5 w-3.5" />}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {/* Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        {event && onDelete ? (
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleDelete}
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
          >
            Delete
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {event ? 'Update Event' : 'Schedule Event'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  defaultDate,
  onSave,
  onDelete,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <span>{event ? 'Edit Event' : 'Schedule New Event'}</span>
        </div>
      }
      description="Time-block your schedule and protect deep work intervals."
      maxWidth="md"
    >
      <EventModalForm
        key={event?.id || `new-event-${defaultDate}`}
        event={event}
        defaultDate={defaultDate}
        onSave={onSave}
        onDelete={onDelete}
        onClose={onClose}
      />
    </Modal>
  );
};
