import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Sparkles,
  CheckSquare,
  MapPin,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MonthView } from '../../components/calendar/MonthView';
import { WeekView } from '../../components/calendar/WeekView';
import { DayView } from '../../components/calendar/DayView';
import { EventModal } from '../../components/calendar/EventModal';
import { useLifeOS } from '../../hooks/useLifeOS';
import { MONTH_NAMES, formatDateString } from '../../utils/date';
import type { CalendarEvent } from '../../types/lifeos';

type CalendarViewMode = 'month' | 'week' | 'day';

export const CalendarPage: React.FC = () => {
  const { events, tasks, todayDate, addEvent, updateEvent, deleteEvent, toggleTask } = useLifeOS();

  // Active view mode
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');

  // Currently focused date
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);

  // Month navigation state
  const [initialYear, initialMonth] = todayDate.split('-').map(Number);
  const [currentYear, setCurrentYear] = useState<number>(initialYear);
  const [currentMonth, setCurrentMonth] = useState<number>(initialMonth - 1); // 0-indexed

  // Event modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventModalDate, setEventModalDate] = useState<string>(todayDate);

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((y) => y - 1);
      } else {
        setCurrentMonth((m) => m - 1);
      }
    } else if (viewMode === 'week') {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() - 7);
      const newDateStr = formatDateString(date);
      setSelectedDate(newDateStr);
      setCurrentYear(date.getFullYear());
      setCurrentMonth(date.getMonth());
    } else {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() - 1);
      const newDateStr = formatDateString(date);
      setSelectedDate(newDateStr);
      setCurrentYear(date.getFullYear());
      setCurrentMonth(date.getMonth());
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((y) => y + 1);
      } else {
        setCurrentMonth((m) => m + 1);
      }
    } else if (viewMode === 'week') {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() + 7);
      const newDateStr = formatDateString(date);
      setSelectedDate(newDateStr);
      setCurrentYear(date.getFullYear());
      setCurrentMonth(date.getMonth());
    } else {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() + 1);
      const newDateStr = formatDateString(date);
      setSelectedDate(newDateStr);
      setCurrentYear(date.getFullYear());
      setCurrentMonth(date.getMonth());
    }
  };

  const handleToday = () => {
    setSelectedDate(todayDate);
    const [y, m] = todayDate.split('-').map(Number);
    setCurrentYear(y);
    setCurrentMonth(m - 1);
  };

  // Header period label
  const getPeriodLabel = () => {
    if (viewMode === 'month') {
      return `${MONTH_NAMES[currentMonth]} ${currentYear}`;
    }
    if (viewMode === 'week') {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const baseDate = new Date(y, m - 1, d);
      const weekday = (baseDate.getDay() + 6) % 7;
      const monday = new Date(baseDate);
      monday.setDate(baseDate.getDate() - weekday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const mStart = monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const mEnd = sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${mStart} – ${mEnd}`;
    }
    // Day mode
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(`${selectedDate}T00:00:00`));
  };

  // Modal open helpers
  const handleOpenAddEvent = (date: string = selectedDate) => {
    setEditingEvent(null);
    setEventModalDate(date);
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventModalDate(event.date);
    setIsEventModalOpen(true);
  };

  // Selected Day Items for Month Inspector
  const selectedDayEvents = events
    .filter((e) => e.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDate);

  const formattedInspectorDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${selectedDate}T00:00:00`));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Smart Calendar
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Time-blocking, schedule synchronization, and distraction-free timelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAddEvent(selectedDate)}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Add Event
          </Button>
        </div>
      </div>

      {/* 2. Top Calendar Navigation Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
            aria-label="Previous period"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleToday}
            className="h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
            aria-label="Next period"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 ml-2">
            {getPeriodLabel()}
          </h2>
        </div>

        {/* View Switcher: Month / Week / Day */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 self-start sm:self-auto">
          {(['month', 'week', 'day'] as CalendarViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-2xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Calendar Views */}
      {viewMode === 'month' && (
        <div className="space-y-6">
          <MonthView
            currentYear={currentYear}
            currentMonth={currentMonth}
            todayDate={todayDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            events={events}
            tasks={tasks}
            onEditEvent={handleOpenEditEvent}
            onAddEventForDate={handleOpenAddEvent}
          />

          {/* Month View Selected Day Agenda Inspector */}
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  Agenda for {formattedInspectorDate}
                  {selectedDate === todayDate && (
                    <Badge variant="indigo" className="text-[10px]">
                      Today
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Inspect scheduled events and task deadlines for this day.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className="text-xs"
                >
                  Open Day View
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenAddEvent(selectedDate)}
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                >
                  Add Event
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Events list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5 pb-1 border-b border-zinc-100 dark:border-zinc-800">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                    Scheduled Events ({selectedDayEvents.length})
                  </h4>

                  {selectedDayEvents.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic py-3">
                      No events scheduled for this day.
                    </p>
                  ) : (
                    selectedDayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div>
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
                              className="text-[9px] capitalize"
                            >
                              {evt.type}
                            </Badge>
                          </div>
                          <h5 className="text-xs font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                            {evt.title}
                          </h5>
                          {evt.location && (
                            <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-2.5 w-2.5" /> {evt.location}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditEvent(evt)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="Edit Event"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEvent(evt.id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="Delete Event"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Tasks list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5 pb-1 border-b border-zinc-100 dark:border-zinc-800">
                    <CheckSquare className="h-3.5 w-3.5 text-amber-500" />
                    Deadlines Due ({selectedDayTasks.length})
                  </h4>

                  {selectedDayTasks.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic py-3">
                      No task deadlines due on this day.
                    </p>
                  ) : (
                    selectedDayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => toggleTask(t.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          t.completed
                            ? 'bg-zinc-50/70 dark:bg-zinc-900/30 border-zinc-200/50 dark:border-zinc-800/50 opacity-60'
                            : 'bg-white dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded flex items-center justify-center shrink-0 ${
                              t.completed
                                ? 'bg-emerald-500 text-white'
                                : 'border border-zinc-300 dark:border-zinc-600'
                            }`}
                          >
                            {t.completed && <span className="text-[10px] font-bold">✓</span>}
                          </div>
                          <span
                            className={`text-xs ${
                              t.completed ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'
                            }`}
                          >
                            {t.title}
                          </span>
                        </div>
                        <Badge
                          variant={t.priority === 'high' ? 'danger' : 'secondary'}
                          className="text-[9px]"
                        >
                          {t.priority}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === 'week' && (
        <WeekView
          baseDate={selectedDate}
          todayDate={todayDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          events={events}
          tasks={tasks}
          onToggleTask={toggleTask}
          onEditEvent={handleOpenEditEvent}
          onAddEventForDate={handleOpenAddEvent}
        />
      )}

      {viewMode === 'day' && (
        <DayView
          selectedDate={selectedDate}
          todayDate={todayDate}
          events={events}
          tasks={tasks}
          onToggleTask={toggleTask}
          onEditEvent={handleOpenEditEvent}
          onDeleteEvent={deleteEvent}
          onAddEvent={handleOpenAddEvent}
        />
      )}

      {/* 4. Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={editingEvent}
        defaultDate={eventModalDate}
        onSave={(data) => {
          if (editingEvent) {
            updateEvent(editingEvent.id, data);
          } else {
            addEvent(data as Omit<CalendarEvent, 'id'>);
          }
        }}
        onDelete={(id) => {
          deleteEvent(id);
        }}
      />
    </div>
  );
};

