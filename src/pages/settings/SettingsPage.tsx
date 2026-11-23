import React, { useState } from 'react';
import {
  Settings,
  User,
  Palette,
  Database,
  SlidersHorizontal,
  Cloud,
  Download,
  RotateCcw,
  Check,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useLifeOS } from '../../hooks/useLifeOS';
import { useTheme } from '../../hooks/useTheme';
import { isSupabaseConfigured } from '../../lib/supabase';
import { cn } from '../../utils/cn';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const {
    monthlyBudget,
    updateMonthlyBudget,
    resetToSampleData,
    tasks,
    habits,
    events,
    transactions,
    notes,
    goals,
    focusSessions,
  } = useLifeOS();
  const { theme, setTheme } = useTheme();

  // Profile Form state
  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [email, setEmail] = useState(user?.email || 'alex.morgan@lifeos.io');
  const [role, setRole] = useState(user?.role || 'Student • Builder');
  const [isProfileSaved, setIsProfileSaved] = useState(false);

  // Budget state
  const [budgetString, setBudgetString] = useState(String(monthlyBudget));
  const [isBudgetSaved, setIsBudgetSaved] = useState(false);

  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetDone, setIsResetDone] = useState(false);

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
    });
    setIsProfileSaved(true);
    setTimeout(() => setIsProfileSaved(false), 2500);
  };

  // Handle Budget Save
  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(budgetString);
    if (!isNaN(parsed) && parsed > 0) {
      updateMonthlyBudget(parsed);
      setIsBudgetSaved(true);
      setTimeout(() => setIsBudgetSaved(false), 2000);
    }
  };

  // Handle Backup Export
  const handleExportBackup = () => {
    const backup = {
      appName: 'LifeOS',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user: { name, email, role },
      monthlyBudget,
      tasks,
      habits,
      events,
      transactions,
      notes,
      goals,
      focusSessions,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifeos-workspace-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle Reset Data
  const handleConfirmReset = () => {
    resetToSampleData();
    setShowResetConfirm(false);
    setIsResetDone(true);
    setTimeout(() => setIsResetDone(false), 3000);
  };

  const userInitials = (name.trim() || 'Alex Morgan')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Settings className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Preferences &amp; Settings
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your personal profile, visual theme, budget defaults, and workspace data.
          </p>
        </div>

        <Badge variant="outline" className="font-mono text-xs self-start sm:self-auto">
          LifeOS v1.0 • Local First
        </Badge>
      </div>

      {/* 2. User Profile Card */}
      <Card variant="default">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-sm font-semibold">User Profile &amp; Identity</CardTitle>
            </div>
            {isProfileSaved && (
              <Badge variant="success" className="text-[10px] gap-1 animate-in fade-in">
                <Check className="h-3 w-3" /> Profile Saved
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            Your personal identity displayed in the sidebar and daily greeting.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4 pb-2">
              {/* Live Avatar */}
              <div className="h-14 w-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0">
                {userInitials}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{name}</h3>
                <p className="text-xs text-zinc-400 font-mono">{email}</p>
                <Badge variant="secondary" className="text-[10px]">
                  {role}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@lifeos.io"
              />
            </div>

            <Input
              label="Role / Title"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Student • Builder or Software Engineer"
            />

            <div className="flex items-center justify-end pt-2">
              <Button type="submit" variant="primary" size="sm">
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 3. Appearance & Theme Visual Selector Card */}
      <Card variant="default">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <CardTitle className="text-sm font-semibold">Appearance &amp; Color System</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Choose between Soft Alabaster (Light Mode) and Deep Obsidian (Dark Mode).
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Light Mode Selector Card */}
            <div
              onClick={() => setTheme('light')}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer space-y-3 relative',
                theme === 'light'
                  ? 'border-orange-600 dark:border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/15'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              )}
            >
              {theme === 'light' && (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                  <Sun className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-900">Soft Alabaster</h4>
                  <span className="text-[10px] text-zinc-400">Linear Light Mode</span>
                </div>
              </div>

              {/* Visual Preview Swatch */}
              <div className="rounded-lg border border-zinc-200 bg-[#FAFAFA] p-3 space-y-2">
                <div className="h-2 w-20 rounded bg-zinc-900" />
                <div className="h-1.5 w-32 rounded bg-zinc-300" />
                <div className="h-5 rounded bg-white border border-zinc-200 flex items-center px-2">
                  <div className="h-2 w-12 rounded bg-orange-600" />
                </div>
              </div>
            </div>

            {/* Dark Mode Selector Card */}
            <div
              onClick={() => setTheme('dark')}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer space-y-3 relative',
                theme === 'dark'
                  ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-950/20'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              )}
            >
              {theme === 'dark' && (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-100">
                  <Moon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-100">Deep Carbon Black</h4>
                  <span className="text-[10px] text-zinc-400">Orange &amp; Black Palette</span>
                </div>
              </div>

              {/* Visual Preview Swatch */}
              <div className="rounded-lg border border-[#27272A] bg-[#09090B] p-3 space-y-2">
                <div className="h-2 w-20 rounded bg-zinc-100" />
                <div className="h-1.5 w-32 rounded bg-zinc-700" />
                <div className="h-5 rounded bg-[#121215] border border-[#27272A] flex items-center px-2">
                  <div className="h-2 w-12 rounded bg-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Workspace Defaults Card */}
      <Card variant="default">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-sm font-semibold">Workspace Defaults &amp; Budget</CardTitle>
            </div>
            {isBudgetSaved && (
              <Badge variant="success" className="text-[10px] gap-1 animate-in fade-in">
                <Check className="h-3 w-3" /> Budget Updated
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            Configure system targets like your monthly spending ceiling.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSaveBudget} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1">
                <Input
                  label="Monthly Finance Budget Target ($)"
                  type="number"
                  step="100"
                  value={budgetString}
                  onChange={(e) => setBudgetString(e.target.value)}
                  placeholder="3000"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" className="whitespace-nowrap">
                Update Budget
              </Button>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-xs text-zinc-400 mr-1">Quick Presets:</span>
              {[2000, 3000, 4000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setBudgetString(String(amt));
                    updateMonthlyBudget(amt);
                    setIsBudgetSaved(true);
                    setTimeout(() => setIsBudgetSaved(false), 2000);
                  }}
                  className="px-2 py-0.5 rounded text-xs font-mono font-medium border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  ${amt.toLocaleString()}
                </button>
              ))}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 5. Data & Backup Management Card */}
      <Card variant="default" className="border-zinc-200/90 dark:border-zinc-800">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <CardTitle className="text-sm font-semibold">Data &amp; Backup Management</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Download an offline JSON export of your workspace or reset to factory sample data.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isResetDone && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Workspace data has been reset to default sample state.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
            <div>
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Export Workspace Backup (.json)
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Download all tasks, habits, events, transactions, notes, and focus logs.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportBackup}
              leftIcon={<Download className="h-3.5 w-3.5" />}
              className="whitespace-nowrap"
            >
              Export JSON
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20">
            <div>
              <h4 className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                Reset to Sample Data
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Replaces current local workspace data with the factory demo seed data.
              </p>
            </div>

            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResetConfirm(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleConfirmReset}
                  className="text-xs"
                >
                  Confirm Reset
                </Button>
              </div>
            ) : (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="whitespace-nowrap"
              >
                Reset Data
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 6. Integrations & Cloud Sync Status Card */}
      <Card variant="default">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <CardTitle className="text-sm font-semibold">Cloud Sync &amp; Integrations</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Infrastructure connectivity and persistence layer health.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Row 1: Local Storage */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Local Browser Storage
                </h4>
                <p className="text-[11px] text-zinc-400 font-mono">
                  key: lifeos-workspace-data (0ms latency)
                </p>
              </div>
            </div>
            <Badge variant="success" dot className="text-[10px]">
              Active
            </Badge>
          </div>

          {/* Row 2: Supabase */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Cloud className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {isSupabaseConfigured && user?.isAuthenticated
                    ? 'Supabase PostgreSQL Cloud Sync (Connected)'
                    : 'Supabase Cloud Sync'}
                </h4>
                <p className="text-[11px] text-zinc-400">
                  {isSupabaseConfigured && user?.isAuthenticated
                    ? 'All 8 modules active • RLS authenticated persistence'
                    : 'PostgreSQL schema parity validated'}
                </p>
              </div>
            </div>
            <Badge
              variant={isSupabaseConfigured && user?.isAuthenticated ? 'success' : 'orange'}
              dot={isSupabaseConfigured && user?.isAuthenticated}
              className="text-[10px]"
            >
              {isSupabaseConfigured && user?.isAuthenticated ? 'Connected' : 'Ready for Backend'}
            </Badge>
          </div>

          {/* Row 3: AI Assistant */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  AI Personal Assistant
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Automated executive morning briefings &amp; cognitive insights
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              Coming Soon
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
