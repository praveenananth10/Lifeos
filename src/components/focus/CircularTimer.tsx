import React from 'react';
import { Play, Pause, RotateCcw, Check, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export interface CircularTimerProps {
  secondsLeft: number;
  totalDurationSeconds: number;
  isActive: boolean;
  mode: 'pomodoro' | 'shortBreak' | 'longBreak' | 'custom';
  sessionLabel: string;
  onToggleActive: () => void;
  onReset: () => void;
  onCompleteEarly: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onEnterZenMode: () => void;
  linkedTaskTitle?: string;
  onCompleteLinkedTask?: () => void;
  isLinkedTaskCompleted?: boolean;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  secondsLeft,
  totalDurationSeconds,
  isActive,
  mode,
  sessionLabel,
  onToggleActive,
  onReset,
  onCompleteEarly,
  soundEnabled,
  onToggleSound,
  onEnterZenMode,
  linkedTaskTitle,
  onCompleteLinkedTask,
  isLinkedTaskCompleted,
}) => {
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalDurationSeconds > 0
    ? Math.max(0, Math.min(1, 1 - secondsLeft / totalDurationSeconds))
    : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const modeColors = {
    pomodoro: 'stroke-indigo-600 dark:stroke-indigo-500 text-indigo-600 dark:text-indigo-400',
    shortBreak: 'stroke-emerald-500 text-emerald-600 dark:text-emerald-400',
    longBreak: 'stroke-sky-500 text-sky-600 dark:text-sky-400',
    custom: 'stroke-purple-600 dark:stroke-purple-500 text-purple-600 dark:text-purple-400',
  };

  const modeBadgeVariant = {
    pomodoro: 'indigo' as const,
    shortBreak: 'success' as const,
    longBreak: 'info' as const,
    custom: 'secondary' as const,
  };

  const modeTitles = {
    pomodoro: 'Deep Focus Sprint',
    shortBreak: 'Short Recovery Break',
    longBreak: 'Long Rest Interval',
    custom: 'Custom Focus Block',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Linked Task Indicator */}
      {linkedTaskTitle && (
        <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 max-w-md text-xs">
          <span className="text-zinc-400 shrink-0 font-medium">Focusing on:</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
            {linkedTaskTitle}
          </span>
          {onCompleteLinkedTask && !isLinkedTaskCompleted && (
            <button
              type="button"
              onClick={onCompleteLinkedTask}
              className="ml-auto text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 font-medium cursor-pointer"
            >
              Done ✓
            </button>
          )}
        </div>
      )}

      {/* SVG Circular Progress Ring */}
      <div className="relative flex items-center justify-center">
        <svg
          className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90 transform"
          viewBox="0 0 300 300"
        >
          {/* Background Track */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            className="text-zinc-100 dark:text-zinc-800/80"
          />

          {/* Animated Progress Arc */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="transparent"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn('transition-all duration-500 ease-linear', modeColors[mode])}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-1 select-none">
          <Badge variant={modeBadgeVariant[mode]} className="text-[10px] uppercase tracking-wider">
            {modeTitles[mode]}
          </Badge>

          {/* Time digits */}
          <div className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
            {formattedTime}
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate max-w-[200px]">
            {sessionLabel || 'Unspecified Target'}
          </p>

          <span className="text-[10px] font-mono text-zinc-400 pt-1">
            {Math.round(progressRatio * 100)}% elapsed
          </span>
        </div>
      </div>

      {/* Control Buttons Strip */}
      <div className="flex items-center gap-3">
        {/* Reset */}
        <Button
          variant="secondary"
          size="icon"
          onClick={onReset}
          title="Reset timer"
          className="h-11 w-11 rounded-xl"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {/* Start / Pause */}
        <Button
          variant="primary"
          size="lg"
          onClick={onToggleActive}
          className={cn(
            'px-8 h-12 text-sm font-semibold rounded-xl shadow-md min-w-[140px]',
            mode === 'shortBreak' && 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500',
            mode === 'longBreak' && 'bg-sky-600 hover:bg-sky-700 dark:bg-sky-500'
          )}
          leftIcon={isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        >
          {isActive ? 'Pause' : 'Start Focus'}
        </Button>

        {/* Complete early */}
        <Button
          variant="secondary"
          size="icon"
          onClick={onCompleteEarly}
          title="Complete &amp; Log Session"
          className="h-11 w-11 rounded-xl hover:text-emerald-600"
        >
          <Check className="h-4 w-4" />
        </Button>

        {/* Sound toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
          className="h-10 w-10 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>

        {/* Zen Mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onEnterZenMode}
          title="Distraction-Free Zen Mode"
          className="h-10 w-10 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
