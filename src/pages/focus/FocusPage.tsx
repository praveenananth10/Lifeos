import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CircularTimer } from '../../components/focus/CircularTimer';
import { TaskLinkSelector } from '../../components/focus/TaskLinkSelector';
import { ZenOverlay } from '../../components/focus/ZenOverlay';
import { SessionHistoryList } from '../../components/focus/SessionHistoryList';
import { useLifeOS } from '../../hooks/useLifeOS';
import { playCompletionChime, isSoundEnabled, setSoundEnabled } from '../../utils/audio';
import type { Task } from '../../types/lifeos';
import { cn } from '../../utils/cn';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'custom';

const MODE_DURATIONS: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
  custom: 45 * 60,
};

export const FocusPage: React.FC = () => {
  const {
    tasks,
    toggleTask,
    todayFocusMinutes,
    todayFocusSessionsCount,
    allTimeFocusSessionsCount,
    focusSessions,
    logFocusSession,
    deleteFocusSession,
  } = useLifeOS();

  // Mode & Duration State
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(45);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // Label & Linked Task
  const [sessionLabel, setSessionLabel] = useState('Deep Work Architecture Sprint');
  const [linkedTask, setLinkedTask] = useState<Task | null>(null);

  // Sound & Zen Mode
  const [soundOn, setSoundOn] = useState<boolean>(() => isSoundEnabled());
  const [isZenModeOpen, setIsZenModeOpen] = useState(false);

  // Ref to hold current state for timer callbacks
  const stateRef = useRef({
    mode,
    totalDurationSeconds,
    sessionLabel,
    soundOn,
  });

  useEffect(() => {
    stateRef.current = {
      mode,
      totalDurationSeconds,
      sessionLabel,
      soundOn,
    };
  }, [mode, totalDurationSeconds, sessionLabel, soundOn]);

  // Clean interval timer with unmount cleanup
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);

          // Play peaceful chime
          playCompletionChime();

          // Log session if focus or custom
          const cur = stateRef.current;
          if (cur.mode === 'pomodoro' || cur.mode === 'custom') {
            logFocusSession({
              label: cur.sessionLabel || 'Focus Session',
              durationMinutes: Math.round(cur.totalDurationSeconds / 60),
              mode: cur.mode === 'pomodoro' ? 'pomodoro' : 'custom',
            });
          }

          return cur.totalDurationSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, logFocusSession]);

  // Handle Mode Change
  const handleModeChange = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    const duration = newMode === 'custom' ? customMinutes * 60 : MODE_DURATIONS[newMode];
    setTotalDurationSeconds(duration);
    setSecondsLeft(duration);
  };

  // Handle Custom Duration selection
  const handleCustomDurationChange = (mins: number) => {
    setCustomMinutes(mins);
    if (mode === 'custom') {
      setIsActive(false);
      setTotalDurationSeconds(mins * 60);
      setSecondsLeft(mins * 60);
    }
  };

  // Reset Timer
  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(totalDurationSeconds);
  };

  // Complete & Log Early
  const handleCompleteEarly = () => {
    setIsActive(false);
    const elapsedSeconds = totalDurationSeconds - secondsLeft;
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    playCompletionChime();

    if (mode === 'pomodoro' || mode === 'custom') {
      logFocusSession({
        label: sessionLabel || 'Focus Session',
        durationMinutes: elapsedMinutes,
        mode: mode === 'pomodoro' ? 'pomodoro' : 'custom',
      });
    }

    setSecondsLeft(totalDurationSeconds);
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // Complete Linked Task
  const handleCompleteLinkedTask = () => {
    if (linkedTask) {
      toggleTask(linkedTask.id);
    }
  };

  const isLinkedTaskCompleted = linkedTask
    ? tasks.find((t) => t.id === linkedTask.id)?.completed || false
    : false;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Focus Mode &amp; Deep Work
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Calm, distraction-free time-blocking with audio chime cues and linked task execution.
          </p>
        </div>

        <Badge variant="orange" className="font-mono text-xs self-start sm:self-auto">
          Today's Total: {todayFocusMinutes}m Focused
        </Badge>
      </div>

      {/* 2. Main Timer Card Container */}
      <Card variant="default" className="p-6 sm:p-10 space-y-6 border-zinc-200/90 dark:border-zinc-800 shadow-sm">
        {/* Mode Switcher Segmented Control */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 max-w-lg mx-auto">
          {(
            [
              { id: 'pomodoro', label: 'Pomodoro (25m)' },
              { id: 'shortBreak', label: 'Short Break (5m)' },
              { id: 'longBreak', label: 'Long Break (15m)' },
              { id: 'custom', label: 'Custom' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleModeChange(m.id)}
              className={cn(
                'px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap',
                mode === m.id
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Custom duration selector if mode === 'custom' */}
        {mode === 'custom' && (
          <div className="flex items-center justify-center gap-2 pt-1 animate-in fade-in">
            <span className="text-xs font-medium text-zinc-400">Duration:</span>
            {[15, 30, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => handleCustomDurationChange(mins)}
                className={cn(
                  'px-2.5 py-1 text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer',
                  customMinutes === mins
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800 font-bold'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                )}
              >
                {mins}m
              </button>
            ))}
          </div>
        )}

        {/* Task Link Selector */}
        <TaskLinkSelector
          tasks={tasks}
          sessionLabel={sessionLabel}
          onSessionLabelChange={setSessionLabel}
          linkedTaskId={linkedTask ? linkedTask.id : null}
          onSelectTask={setLinkedTask}
        />

        {/* Circular Countdown Timer */}
        <CircularTimer
          secondsLeft={secondsLeft}
          totalDurationSeconds={totalDurationSeconds}
          isActive={isActive}
          mode={mode}
          sessionLabel={sessionLabel}
          onToggleActive={() => setIsActive(!isActive)}
          onReset={handleReset}
          onCompleteEarly={handleCompleteEarly}
          soundEnabled={soundOn}
          onToggleSound={handleToggleSound}
          onEnterZenMode={() => setIsZenModeOpen(true)}
          linkedTaskTitle={linkedTask?.title}
          onCompleteLinkedTask={handleCompleteLinkedTask}
          isLinkedTaskCompleted={isLinkedTaskCompleted}
        />
      </Card>

      {/* 3. Focus Analytics & Session History Panel */}
      <SessionHistoryList
        focusSessions={focusSessions}
        todayFocusMinutes={todayFocusMinutes}
        todayFocusSessionsCount={todayFocusSessionsCount}
        allTimeFocusSessionsCount={allTimeFocusSessionsCount}
        onDeleteSession={deleteFocusSession}
      />

      {/* 4. Full-Screen Distraction-Free Zen Overlay */}
      <ZenOverlay
        isOpen={isZenModeOpen}
        onClose={() => setIsZenModeOpen(false)}
        secondsLeft={secondsLeft}
        totalDurationSeconds={totalDurationSeconds}
        isActive={isActive}
        mode={mode}
        sessionLabel={sessionLabel}
        onToggleActive={() => setIsActive(!isActive)}
        onReset={handleReset}
        onCompleteEarly={handleCompleteEarly}
        soundEnabled={soundOn}
        onToggleSound={handleToggleSound}
        linkedTaskTitle={linkedTask?.title}
        onCompleteLinkedTask={handleCompleteLinkedTask}
        isLinkedTaskCompleted={isLinkedTaskCompleted}
      />
    </div>
  );
};
