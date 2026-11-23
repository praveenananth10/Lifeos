import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  ArrowLeft,
  CheckSquare,
  Calendar,
  Flame,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Habits', path: '/habits', icon: Flame },
    { label: 'Notes', path: '/notes', icon: FileText },
    { label: 'Focus Mode', path: '/focus', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors selection:bg-orange-500/20 selection:text-orange-600 dark:selection:text-orange-400">
      {/* Top Header */}
      <header className="h-16 px-6 sm:px-10 flex items-center justify-between border-b border-zinc-200/80 dark:border-[#27272A] bg-white/70 dark:bg-[#09090B]/70 backdrop-blur-md sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              LifeOS
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium border border-zinc-200 dark:border-zinc-700">
                404
              </span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 text-center">
        <div className="max-w-md w-full">
          {/* Compass Icon Badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/50 text-orange-600 dark:text-orange-400 mb-6 shadow-sm">
            <Compass className="w-7 h-7 stroke-[1.75]" />
          </div>

          {/* 404 Code */}
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-2">
            Error 404
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Lost in your system?
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
            The page or resource you are looking for has been relocated, archived, or does not exist in your LifeOS workspace.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              leftIcon={<LayoutDashboard className="w-4 h-4" />}
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/')}
            >
              Return Home
            </Button>
          </div>

          {/* Quick Jump Shortcuts */}
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
              Quick Workspace Destinations
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-2 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 hover:border-orange-400/50 dark:hover:border-orange-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-all text-left group"
                  >
                    <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800/60">
        <p>LifeOS • Organise Your Life. Focus on What Matters.</p>
      </footer>
    </div>
  );
};
