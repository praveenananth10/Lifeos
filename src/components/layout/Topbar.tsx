import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Clock, Command } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useLifeOS } from '../../hooks/useLifeOS';

export interface TopbarProps {
  onToggleMobileMenu: () => void;
  onOpenCommandPalette?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileMenu,
  onOpenCommandPalette,
}) => {
  const location = useLocation();
  const { todayFocusMinutes } = useLifeOS();

  const getPageTitle = (pathname: string): { title: string; category: string } => {
    switch (pathname) {
      case '/dashboard':
        return { title: 'Overview', category: 'Workspace' };
      case '/tasks':
        return { title: 'Task Manager', category: 'Daily Workspace' };
      case '/calendar':
        return { title: 'Smart Calendar', category: 'Daily Workspace' };
      case '/habits':
        return { title: 'Habit Tracker', category: 'Daily Workspace' };
      case '/focus':
        return { title: 'Focus Mode', category: 'Daily Workspace' };
      case '/finance':
        return { title: 'Finance Manager', category: 'Life Architecture' };
      case '/notes':
        return { title: 'Notes & Journal', category: 'Life Architecture' };
      case '/goals':
        return { title: 'Goal Tracker & OKRs', category: 'Life Architecture' };
      case '/settings':
        return { title: 'Preferences & Settings', category: 'System' };
      case '/design-system':
        return { title: 'Design System Spec', category: 'Developer' };
      default:
        return { title: 'LifeOS Workspace', category: 'Home' };
    }
  };

  const { title, category } = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-200/80 dark:border-[#27272A] bg-white/80 dark:bg-[#09090B]/80 px-4 sm:px-6 backdrop-blur-md transition-colors duration-200">
      {/* Left: Mobile trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMobileMenu}
          className="md:hidden h-8 w-8 text-zinc-600 dark:text-zinc-400"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400 dark:text-zinc-500 font-medium hidden sm:inline">
            {category}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">/</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </span>
        </div>
      </div>

      {/* Right: Quick actions, search hint, focus shortcut, and ThemeToggle */}
      <div className="flex items-center gap-2.5">
        {/* Command shortcut hint */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
          title="Open Command Palette (Ctrl+K or Cmd+K)"
        >
          <Command className="h-3 w-3" />
          <span className="hidden sm:inline">K</span>
          <span className="text-[10px] text-zinc-400 ml-1 hidden lg:inline">Quick Search</span>
        </button>

        {/* Quick Focus Mode CTA */}
        <Link to="/focus">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 text-xs gap-1.5 border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400 hover:bg-orange-50/60 dark:hover:bg-orange-950/30"
          >
            <Clock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Focus</span>
            <span className="font-mono text-[10px] bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 px-1 rounded">
              {todayFocusMinutes}m
            </span>
          </Button>
        </Link>

        <div className="h-4 w-px bg-zinc-200 dark:border-zinc-800 mx-1" />

        <ThemeToggle />
      </div>
    </header>
  );
};
