import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="secondary"
      size={showLabel ? 'sm' : 'icon'}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn('relative transition-colors duration-200', className)}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Moon className="h-4 w-4 text-zinc-200 transition-transform duration-200 rotate-0" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500 transition-transform duration-200 rotate-0" />
        )}
      </div>
      {showLabel && (
        <span className="ml-2 text-xs font-medium capitalize">
          {theme} mode
        </span>
      )}
    </Button>
  );
};

