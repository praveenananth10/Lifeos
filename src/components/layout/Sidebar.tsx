import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  CheckSquare, 
  Calendar, 
  Flame, 
  Clock, 
  Wallet, 
  FileText, 
  Target, 
  Sparkles, 
  Settings, 
  LogOut, 
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLifeOS } from '../../hooks/useLifeOS';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export interface SidebarProps {
  className?: string;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const { pendingTasksCount, habitsCompletedTodayCount, totalHabitsCount } = useLifeOS();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onCloseMobile) onCloseMobile();
  };

  const displayName = user?.name || 'Alex Morgan';
  const displayEmail = user?.email || 'alex.morgan@lifeos.io';

  const dailyNav = [
    { icon: LayoutGrid, label: 'Overview', to: '/dashboard' },
    { 
      icon: CheckSquare, 
      label: 'Tasks', 
      to: '/tasks', 
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
      badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300'
    },
    { icon: Calendar, label: 'Smart Calendar', to: '/calendar' },
    { 
      icon: Flame, 
      label: 'Habits', 
      to: '/habits',
      badge: `${habitsCompletedTodayCount}/${totalHabitsCount}`,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
    },
    { icon: Clock, label: 'Focus Mode', to: '/focus' },
  ];

  const systemsNav = [
    { icon: Wallet, label: 'Finance', to: '/finance' },
    { icon: FileText, label: 'Notes & Journal', to: '/notes' },
    { icon: Target, label: 'Goal Tracker', to: '/goals' },
  ];

  return (
    <aside
      className={cn(
        'w-64 border-r border-zinc-200/80 dark:border-[#27272A] bg-zinc-50/50 dark:bg-[#121215] flex flex-col justify-between h-full select-none transition-colors duration-200',
        className
      )}
    >
      {/* Top Header & Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          <Link
            to="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative flex h-8 w-8 items-center justify-center shrink-0">
              <img
                src="/icon.png"
                alt="LifeOS Logo"
                className="h-8 w-8 rounded-lg object-cover shadow-2xs group-hover:scale-105 transition-transform"
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                LifeOS
                <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-1 rounded border border-orange-200/50 dark:border-orange-800/40">
                  v1.0
                </span>
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
                Personal Workspace
              </span>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Section 1: Daily Workspace */}
        <div className="space-y-1">
          <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Daily Workspace
          </p>
          <nav className="space-y-0.5">
            {dailyNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 font-semibold shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900/60'
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.2 rounded font-mono font-medium',
                        item.badgeColor
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Systems & Life Architecture */}
        <div className="space-y-1">
          <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Life Architecture
          </p>
          <nav className="space-y-0.5">
            {systemsNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 font-semibold shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900/60'
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Section 3: Intelligence & Settings */}
        <div className="space-y-1">
          <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Intelligence &amp; Settings
          </p>
          <nav className="space-y-0.5">
            {/* AI Assistant Nav Link */}
            <NavLink
              to="/assistant"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 font-semibold shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900/60'
                )
              }
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span>AI Assistant</span>
              </div>
              <Badge variant="orange" className="text-[9px] px-1.5 py-0 font-medium">
                Coach
              </Badge>
            </NavLink>

            {/* Settings */}
            <NavLink
              to="/settings"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 font-semibold shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900/60'
                )
              }
            >
              <div className="flex items-center gap-2.5">
                <Settings className="h-4 w-4 shrink-0" />
                <span>Settings</span>
              </div>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Bottom User Profile Card */}
      <div className="p-3 border-t border-zinc-200/80 dark:border-[#27272A] bg-white/40 dark:bg-[#121215]/40">
        <div className="flex items-center justify-between p-1.5 rounded-xl border border-zinc-200/70 dark:border-[#27272A] bg-white dark:bg-[#18181b] shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate font-mono">
                {displayEmail}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="h-7 w-7 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition-colors shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
