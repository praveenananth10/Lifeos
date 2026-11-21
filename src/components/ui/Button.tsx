import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles: minimalist, high-precision, subtle micro-interactions
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

    const variants = {
      primary:
        'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400 dark:active:bg-indigo-600 shadow-xs focus-visible:ring-indigo-500/40',
      secondary:
        'bg-white text-zinc-900 border border-zinc-200/90 hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-850 dark:hover:border-zinc-700 shadow-2xs focus-visible:ring-zinc-400',
      outline:
        'bg-transparent border border-zinc-300/80 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:ring-zinc-400',
      ghost:
        'bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/80 focus-visible:ring-zinc-400',
      danger:
        'bg-rose-50 text-rose-600 border border-rose-200/80 hover:bg-rose-100/80 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50 dark:hover:bg-rose-950/60 focus-visible:ring-rose-500/40',
    };

    const sizes = {
      sm: 'h-8 px-2.5 text-xs rounded-md gap-1.5',
      md: 'h-9 px-3.5 text-sm rounded-lg gap-2',
      lg: 'h-11 px-5 text-base rounded-xl gap-2.5',
      icon: 'h-9 w-9 p-0 rounded-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
