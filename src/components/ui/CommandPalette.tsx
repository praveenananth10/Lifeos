import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Flame,
  Wallet,
  FileText,
  Target,
  Clock,
  Settings,
  Sun,
  Moon,
  Home,
  Layers,
  Download,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useLifeOS } from '../../hooks/useLifeOS';
import { cn } from '../../utils/cn';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  category: 'Navigation' | 'Actions';
  icon: React.ComponentType<{ className?: string }>;
  perform: () => void;
  shortcut?: string;
}

interface CommandPaletteModalProps {
  onClose: () => void;
}

const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const lifeos = useLifeOS();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define commands
  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Dashboard Overview',
      description: 'System health, KPIs, and daily momentum',
      category: 'Navigation',
      icon: LayoutDashboard,
      perform: () => {
        navigate('/dashboard');
        onClose();
      },
      shortcut: 'G D',
    },
    {
      id: 'nav-tasks',
      title: 'Task Manager',
      description: 'Linear-inspired task inbox, priority, and categories',
      category: 'Navigation',
      icon: CheckSquare,
      perform: () => {
        navigate('/tasks');
        onClose();
      },
      shortcut: 'G T',
    },
    {
      id: 'nav-calendar',
      title: 'Smart Calendar',
      description: 'Month, week, day views & focus block scheduling',
      category: 'Navigation',
      icon: Calendar,
      perform: () => {
        navigate('/calendar');
        onClose();
      },
      shortcut: 'G C',
    },
    {
      id: 'nav-habits',
      title: 'Habit Tracker',
      description: 'Streaks, weekly progress, and completion heatmap',
      category: 'Navigation',
      icon: Flame,
      perform: () => {
        navigate('/habits');
        onClose();
      },
      shortcut: 'G H',
    },
    {
      id: 'nav-finance',
      title: 'Finance Manager',
      description: 'Cash flow, expense breakdown, and monthly budget',
      category: 'Navigation',
      icon: Wallet,
      perform: () => {
        navigate('/finance');
        onClose();
      },
      shortcut: 'G F',
    },
    {
      id: 'nav-notes',
      title: 'Notes & Journal',
      description: '2-column Notion-style notes and daily reflections',
      category: 'Navigation',
      icon: FileText,
      perform: () => {
        navigate('/notes');
        onClose();
      },
      shortcut: 'G N',
    },
    {
      id: 'nav-goals',
      title: 'Goal Tracker',
      description: 'Quarterly & annual horizons with milestone checklists',
      category: 'Navigation',
      icon: Target,
      perform: () => {
        navigate('/goals');
        onClose();
      },
      shortcut: 'G G',
    },
    {
      id: 'nav-focus',
      title: 'Focus Mode',
      description: 'Pomodoro timer, Zen mode, and session history',
      category: 'Navigation',
      icon: Clock,
      perform: () => {
        navigate('/focus');
        onClose();
      },
      shortcut: 'G O',
    },
    {
      id: 'nav-assistant',
      title: 'AI Personal Coach',
      description: 'Interactive workspace analyzer, daily briefing, and smart guidance',
      category: 'Navigation',
      icon: Sparkles,
      perform: () => {
        navigate('/assistant');
        onClose();
      },
      shortcut: 'G A',
    },
    {
      id: 'nav-settings',
      title: 'Profile & Settings',
      description: 'Theme, budget limits, profile, and data management',
      category: 'Navigation',
      icon: Settings,
      perform: () => {
        navigate('/settings');
        onClose();
      },
      shortcut: 'G S',
    },
    {
      id: 'nav-landing',
      title: 'Landing Page',
      description: 'Public marketing showcase and feature overview',
      category: 'Navigation',
      icon: Home,
      perform: () => {
        navigate('/');
        onClose();
      },
    },
    {
      id: 'nav-design-system',
      title: 'Design System Gallery',
      description: 'Explore all UI tokens, badges, cards, and buttons',
      category: 'Navigation',
      icon: Layers,
      perform: () => {
        navigate('/design-system');
        onClose();
      },
    },

    // Quick Actions
    {
      id: 'act-toggle-theme',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      description: `Toggle application surface to ${theme === 'dark' ? 'Soft Alabaster' : 'Deep Obsidian'}`,
      category: 'Actions',
      icon: theme === 'dark' ? Sun : Moon,
      perform: () => {
        toggleTheme();
        onClose();
      },
      shortcut: '⌘ T',
    },
    {
      id: 'act-create-task',
      title: 'Create Quick Task',
      description: 'Add a high priority task to your inbox',
      category: 'Actions',
      icon: CheckSquare,
      perform: () => {
        const title = prompt('Enter new task title:');
        if (title && title.trim()) {
          lifeos.addTask({
            title: title.trim(),
            category: 'Work',
            priority: 'high',
            completed: false,
            dueDate: new Date().toISOString().split('T')[0],
          });
        }
        navigate('/tasks');
        onClose();
      },
      shortcut: 'N T',
    },
    {
      id: 'act-new-journal',
      title: "Write Today's Journal",
      description: 'Add daily reflection entry with automated prompts',
      category: 'Actions',
      icon: Sparkles,
      perform: () => {
        navigate('/notes');
        onClose();
      },
      shortcut: 'N J',
    },
    {
      id: 'act-export-data',
      title: 'Export LifeOS Backup (JSON)',
      description: 'Download full workspace snapshot to your device',
      category: 'Actions',
      icon: Download,
      perform: () => {
        const payload = {
          exportDate: new Date().toISOString(),
          version: '1.0.0',
          tasks: lifeos.tasks,
          events: lifeos.events,
          habits: lifeos.habits,
          transactions: lifeos.transactions,
          notes: lifeos.notes,
          goals: lifeos.goals,
          focusSessions: lifeos.focusSessions,
          monthlyBudget: lifeos.monthlyBudget,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lifeos-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        onClose();
      },
    },
  ];

  // Filter commands by query
  const filteredCommands = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.description?.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation inside modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].perform();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search modules..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Command Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2 divide-y divide-zinc-100/50 dark:divide-zinc-800/50">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-zinc-500 mt-1">Try searching for Tasks, Notes, Finance, or Theme</p>
            </div>
          ) : (
            filteredCommands.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.perform()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'group flex items-center justify-between px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors',
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors',
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/60'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold tracking-tight truncate">
                          {item.title}
                        </span>
                        <span
                          className={cn(
                            'text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-sm',
                            item.category === 'Actions'
                              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                              : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          )}
                        >
                          {item.category}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-3 shrink-0">
                    {item.shortcut && (
                      <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-300/60 dark:border-zinc-700">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>LifeOS Command Palette</span>
        </div>
      </div>
    </div>
  );
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <CommandPaletteModal onClose={onClose} />;
};
