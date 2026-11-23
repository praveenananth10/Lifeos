import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ShieldAlert, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { isSupabaseConfigured } from '../../lib/supabase';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
  icon,
  footerContent,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-50 dark:bg-[#09090B] p-4 sm:p-6 transition-colors duration-200 selection:bg-orange-600 selection:text-white dark:selection:bg-orange-500">
      {/* Top Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to LifeOS</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/icon.png"
              alt="LifeOS Logo"
              className="h-7 w-7 rounded-lg object-cover shadow-xs"
            />
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 hidden sm:inline">
              LifeOS
            </span>
          </Link>
          <div className="h-4 w-px bg-zinc-200 dark:border-zinc-800" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Centered Card Container */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <Card variant="default" className="shadow-sm border-zinc-200/90 dark:border-zinc-800">
          <CardHeader className="text-center pb-4 pt-6 px-6 sm:px-8">
            {icon && (
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-[#121215] text-orange-600 dark:text-orange-400 border border-zinc-200/70 dark:border-[#27272A] shadow-2xs">
                {icon}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mb-1.5">
              <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {title}
              </CardTitle>
            </div>

            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              {description}
            </CardDescription>

            <div className="pt-2 flex justify-center">
              <Badge
                variant={isSupabaseConfigured ? 'success' : 'orange'}
                className="text-[10px] font-mono gap-1"
              >
                {isSupabaseConfigured ? (
                  <>
                    <ShieldCheck className="h-3 w-3" />
                    Supabase Auth Connected
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    Frontend Preview • Demo Mode
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pb-6 space-y-4">
            {children}

            {/* Subtly styled disclaimer */}
            <div className="pt-2">
              <div className="rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-2.5 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-start gap-2">
                {isSupabaseConfigured ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-0.5" />
                )}
                <span>
                  {isSupabaseConfigured
                    ? 'Live Supabase authentication active. Account credentials and OAuth sessions are securely validated against your backend.'
                    : 'Demo authentication active. Sessions are stored locally in your browser and will be replaced by Supabase in production.'}
                </span>
              </div>
            </div>
          </CardContent>

          {footerContent && (
            <CardFooter className="justify-center text-xs text-zinc-500 dark:text-zinc-400 px-6 sm:px-8 py-4 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-b-xl">
              {footerContent}
            </CardFooter>
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-zinc-400 dark:text-zinc-500 py-4 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-zinc-200/40 dark:border-[#27272A]">
        <span>LifeOS &copy; 2026 • Organise Your Life. Focus on What Matters.</span>
        <span className="text-[11px]">Sleek Orange &amp; Black Architecture</span>
      </footer>
    </div>
  );
};

