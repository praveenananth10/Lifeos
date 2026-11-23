import React, { useEffect } from 'react';
import { Minimize2, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { CircularTimer } from './CircularTimer';

export interface ZenOverlayProps {
  isOpen: boolean;
  onClose: () => void;
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
  linkedTaskTitle?: string;
  onCompleteLinkedTask?: () => void;
  isLinkedTaskCompleted?: boolean;
}

export const ZenOverlay: React.FC<ZenOverlayProps> = ({
  isOpen,
  onClose,
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
  linkedTaskTitle,
  onCompleteLinkedTask,
  isLinkedTaskCompleted,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 flex flex-col justify-between p-6 sm:p-10 select-none animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
            L
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Zen Focus Chamber
            </span>
            <span className="text-[10px] text-zinc-400 block -mt-0.5">
              Distraction shields active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-xs"
            leftIcon={<Minimize2 className="h-3.5 w-3.5" />}
          >
            Exit Zen Mode (Esc)
          </Button>
        </div>
      </div>

      {/* Center: The Focused Circular Timer */}
      <div className="my-auto py-6">
        <CircularTimer
          secondsLeft={secondsLeft}
          totalDurationSeconds={totalDurationSeconds}
          isActive={isActive}
          mode={mode}
          sessionLabel={sessionLabel}
          onToggleActive={onToggleActive}
          onReset={onReset}
          onCompleteEarly={onCompleteEarly}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
          onEnterZenMode={onClose}
          linkedTaskTitle={linkedTaskTitle}
          onCompleteLinkedTask={onCompleteLinkedTask}
          isLinkedTaskCompleted={isLinkedTaskCompleted}
        />
      </div>

      {/* Bottom Subtext */}
      <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 text-center">
        <ShieldAlert className="h-3.5 w-3.5 text-orange-500" />
        <span>Silence notifications. Single-task with complete clarity.</span>
      </div>
    </div>
  );
};
