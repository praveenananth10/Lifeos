import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Command } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs group-hover:scale-105 transition-transform">
            <span className="font-semibold text-sm tracking-tighter">OS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
              LifeOS
            </span>
            <Badge variant="indigo" className="hidden sm:inline-flex text-[10px] font-medium">
              Design System Spec
            </Badge>
          </div>
        </Link>

        {/* Center / Navigation hint */}
        <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="italic font-light">"Organise Your Life. Focus on What Matters."</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1.5 text-zinc-600 dark:text-zinc-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex text-xs text-zinc-500 dark:text-zinc-400 gap-1.5"
            onClick={() => {}}
          >
            <Command className="h-3.5 w-3.5" />
            <span>K</span>
          </Button>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

          <ThemeToggle showLabel={false} />
        </div>
      </div>
    </header>
  );
};
