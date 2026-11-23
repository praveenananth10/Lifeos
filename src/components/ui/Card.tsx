import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle';
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, ...props }, ref) => {
    const variants = {
      default:
        'bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-[#27272A] shadow-2xs',
      elevated:
        'bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-[#27272A] shadow-sm hover:shadow-md transition-shadow',
      subtle:
        'bg-zinc-50/60 dark:bg-[#121215]/80 border border-zinc-200/50 dark:border-[#27272A]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl text-zinc-900 dark:text-zinc-100 transition-all duration-200',
          variants[variant],
          interactive &&
            'cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 hover:translate-y-[-1px] active:translate-y-[0px]',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-5 pb-3', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5 pt-2', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-5 pt-0 border-t border-zinc-100 dark:border-zinc-800/60 mt-2', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

