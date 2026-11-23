import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from '../ui/CommandPalette';
import { useLifeOS } from '../../hooks/useLifeOS';

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { syncError, clearSyncError } = useLifeOS();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Desktop Fixed Left Sidebar */}
      <div className="hidden md:flex md:w-64 md:shrink-0 sticky top-0 h-screen">
        <Sidebar className="h-full w-full" />
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer container */}
          <div className="relative flex w-72 max-w-[85vw] flex-col bg-white dark:bg-[#121215] shadow-xl z-10">
            <Sidebar
              className="h-full w-full"
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Workspace Frame (Topbar + Content Area) */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {syncError && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <div className="truncate">
                <span className="font-semibold">Supabase Cloud Sync Error: </span>
                <span className="font-mono text-[11px]">{syncError}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={clearSyncError}
              className="p-1 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
              title="Dismiss error alert"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {children}
        </main>

        <footer className="border-t border-zinc-200/60 dark:border-[#27272A] py-4 px-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <span>LifeOS Workspace &copy; 2026 • Organise Your Life. Focus on What Matters.</span>
            <span>Centralized Live Store Active</span>
          </div>
        </footer>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};
