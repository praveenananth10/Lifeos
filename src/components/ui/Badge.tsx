import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'orange' | 'indigo' | 'success' | 'warning' | 'danger' | 'info';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    default:
      'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900',
    secondary:
      'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300',
    outline:
      'border border-zinc-300 text-zinc-700 dark:border-[#27272A] dark:text-zinc-300',
    orange:
      'bg-orange-50 text-orange-700 border border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60',
    indigo:
      'bg-orange-50 text-orange-700 border border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60',
    success:
      'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40',
    warning:
      'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40',
    danger:
      'bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/40',
    info:
      'bg-sky-50 text-sky-700 border border-sky-200/60 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800/40',
  };

  const dotColors = {
    default: 'bg-white dark:bg-zinc-900',
    secondary: 'bg-zinc-500',
    outline: 'bg-zinc-400 dark:bg-zinc-500',
    orange: 'bg-orange-500',
    indigo: 'bg-orange-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-tight select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
