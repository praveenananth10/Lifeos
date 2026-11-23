import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Check, 
  CheckSquare, 
  Calendar, 
  Flame, 
  Wallet, 
  FileText, 
  Target, 
  Clock, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Sliders, 
  Zap, 
  ChevronRight,
  Inbox,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PublicNavbar } from '../components/layout/PublicNavbar';

export const LandingPage: React.FC = () => {
  // Interactive Preview State: Tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Finalize personal quarterly OKRs', completed: true, tag: 'Strategy' },
    { id: 2, title: 'Complete 90m deep work sprint on LifeOS', completed: false, tag: 'Focus' },
    { id: 3, title: 'Evening mindful reflection & habit log', completed: false, tag: 'Routine' },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Interactive Preview State: Focus Timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setSecondsLeft(25 * 60);
  };

  const coreModules = [
    {
      icon: CheckSquare,
      title: 'Task Manager',
      description: 'Streamlined Kanban & lists with sub-tasks, priority tags, and clean sprint management.',
      status: 'Core',
    },
    {
      icon: Calendar,
      title: 'Smart Calendar',
      description: 'Unified time-blocking, automated agenda views, and distraction-free daily timelines.',
      status: 'Core',
    },
    {
      icon: Flame,
      title: 'Habit Tracker',
      description: 'Atomic habit consistency with multi-week streaks and friction-free daily check-ins.',
      status: 'Core',
    },
    {
      icon: Wallet,
      title: 'Finance Manager',
      description: 'Minimalist cash flow logging, category budgeting, and net worth trajectory tracking.',
      status: 'Core',
    },
    {
      icon: FileText,
      title: 'Notes & Journal',
      description: 'Distraction-free Markdown editor with daily reflection prompts and interconnected wikis.',
      status: 'Core',
    },
    {
      icon: Target,
      title: 'Goal Tracker',
      description: 'High-level OKR architecture connecting your 5-year visions directly to today’s actions.',
      status: 'Core',
    },
    {
      icon: Clock,
      title: 'Focus Mode',
      description: 'Built-in Pomodoro cycles, customized soundscapes, and digital cognitive shields.',
      status: 'Core',
    },
    {
      icon: Sparkles,
      title: 'AI Personal Assistant',
      description: 'Context-aware daily summaries, smart schedule optimization, and proactive cognitive alerts.',
      status: 'Coming Soon',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Capture Everything',
      tagline: 'Zero cognitive friction',
      description:
        'Dump ideas, incoming tasks, links, and quick notes into a unified inbox in milliseconds without breaking your current mental flow.',
      icon: Inbox,
    },
    {
      step: '02',
      title: 'Plan Your Day',
      tagline: 'Intentional time-blocking',
      description:
        'Transform chaotic backlogs into clear 3-task daily priorities, scheduled focus windows, and structured habit commitments.',
      icon: Sliders,
    },
    {
      step: '03',
      title: 'Deep Focus & Track',
      tagline: 'Execute with clarity',
      description:
        'Engage distraction-free focus sessions, maintain unbroken consistency streaks, and review your personal momentum each evening.',
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/10 dark:bg-orange-600/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="relative space-y-6 max-w-4xl mx-auto">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 px-3.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 shadow-2xs backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span>LifeOS 1.0 • Your Personal Operating System</span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-0.5">
                Sleek Orange &amp; Black <ChevronRight className="h-3 w-3 inline" />
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.08]">
              Organise Your Life.{' '}
              <span className="bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300 bg-clip-text text-transparent">
                Focus on What Matters.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Replace scattered to-do apps, disconnected spreadsheets, habit trackers, and notes with one calm, unified workspace engineered for clarity, intent, and momentum.
            </p>

            {/* Primary Calls to Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-sm px-6 h-12 shadow-sm font-semibold"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Start for Free
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto text-sm px-6 h-12 border-zinc-200 dark:border-zinc-800"
                >
                  Explore Live Demo
                </Button>
              </Link>
            </div>

            {/* Micro-trust indicators */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Local-first privacy architecture
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-orange-500" />
                Zero subscription fatigue
              </span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE UI PREVIEW MOCKUP */}
        <section id="preview" className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-24">
          <div className="text-center mb-6 space-y-1">
            <Badge variant="orange" className="text-[10px]">
              Interactive Preview
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              The Calm, High-Precision Workspace
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Click tasks to toggle completion or activate the focus timer below.
            </p>
          </div>

          {/* SaaS App Window Container */}
          <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/90 shadow-2xl shadow-orange-500/5 dark:shadow-none overflow-hidden transition-all duration-300">
            {/* macOS / Linear Window Chrome */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/70 select-none">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="ml-2 text-xs font-mono text-zinc-400 dark:text-zinc-500 hidden sm:inline">
                  LifeOS Personal Edition
                </span>
              </div>

              {/* URL bar indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                <Lock className="h-3 w-3 text-emerald-500" />
                <span>app.lifeos.io/today</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Synced
                </span>
              </div>
            </div>

            {/* Window Interior Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
              {/* Mini Sidebar */}
              <div className="hidden md:flex md:col-span-3 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/30 p-4 flex-col justify-between text-xs select-none">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="h-5 w-5 rounded-md bg-orange-600 dark:bg-orange-500 text-white flex items-center justify-center font-bold text-[10px]">
                      OS
                    </div>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">Personal Hub</span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="px-2 py-1.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckSquare className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" /> Today's Sprint
                      </span>
                      <span className="font-mono text-[10px] bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 px-1.5 rounded">3</span>
                    </div>
                    <div className="px-2 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" /> Calendar
                    </div>
                    <div className="px-2 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center gap-2">
                      <Flame className="h-3.5 w-3.5 text-amber-500" /> Habits
                    </div>
                    <div className="px-2 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center gap-2">
                      <Wallet className="h-3.5 w-3.5" /> Finances
                    </div>
                    <div className="px-2 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" /> Notes &amp; Wiki
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">Day Velocity</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                  </div>
                </div>
              </div>

              {/* Main Preview Work Area */}
              <div className="md:col-span-9 p-5 sm:p-6 space-y-6">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      Today's Priorities
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      3 vital targets for maximum cognitive effectiveness
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="orange" className="text-[11px]">
                      Deep Work Sprint
                    </Badge>
                    <span className="text-xs text-zinc-400 font-mono">
                      Nov 20, 2026
                    </span>
                  </div>
                </div>

                {/* Split: Interactive Tasks + Interactive Focus Timer */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Interactive Tasks */}
                  <div className="lg:col-span-7 space-y-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Interactive Tasks (Click to test)
                    </p>
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                            task.completed
                              ? 'bg-zinc-50/80 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 opacity-75'
                              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-orange-400 dark:hover:border-orange-500 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-4 w-4 rounded flex items-center justify-center transition-colors ${
                                task.completed
                                  ? 'bg-emerald-500 text-white'
                                  : 'border border-zinc-300 dark:border-zinc-600'
                              }`}
                            >
                              {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>
                            <span
                              className={`text-xs font-medium ${
                                task.completed
                                  ? 'line-through text-zinc-400 dark:text-zinc-500'
                                  : 'text-zinc-800 dark:text-zinc-200'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>
                          <Badge
                            variant={task.completed ? 'secondary' : 'orange'}
                            className="text-[10px]"
                          >
                            {task.tag}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* Habit Streak Mini-Row */}
                    <div className="pt-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                        Active Habits
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
                          <span className="text-zinc-700 dark:text-zinc-300 font-medium">Hydration (2.5L)</span>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1 font-semibold">
                            <Flame className="h-3 w-3 fill-amber-500 text-amber-500" /> 14d
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
                          <span className="text-zinc-700 dark:text-zinc-300 font-medium">Read 20 pages</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Done
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Focus Timer Widget */}
                  <div className="lg:col-span-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-4 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-orange-500" /> Focus Session
                        </span>
                        <Badge variant="orange" className="text-[10px]">
                          Pomodoro
                        </Badge>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Target: "Complete 90m deep work sprint"
                      </p>
                    </div>

                    <div className="my-5 text-center">
                      <div className="font-mono text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {formatTimer(secondsLeft)}
                      </div>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                        {timerRunning ? 'Timer active • Distractions muted' : 'Ready to start focus block'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={timerRunning ? 'secondary' : 'primary'}
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => setTimerRunning(!timerRunning)}
                        leftIcon={timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      >
                        {timerRunning ? 'Pause' : 'Start Focus'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400"
                        onClick={resetTimer}
                        title="Reset timer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE MODULES BENTO GRID (#features) */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200/60 dark:border-zinc-800/60">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <Badge variant="orange" className="text-[10px]">
              Complete Personal Ecosystem
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              8 Core Modules. Zero App-Switching.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Every system you need to manage your personal, professional, and cognitive life, unified under a singular, high-performance design language.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreModules.map((module) => {
              const Icon = module.icon;
              const isComingSoon = module.status === 'Coming Soon';
              return (
                <Card
                  key={module.title}
                  variant="default"
                  interactive
                  className="flex flex-col justify-between p-6 group hover:border-orange-300 dark:hover:border-orange-800"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/60 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      {isComingSoon ? (
                        <Badge variant="orange" className="text-[10px]">
                          Coming Soon
                        </Badge>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-400">
                          Included
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <CardTitle className="text-base font-semibold group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {module.title}
                      </CardTitle>
                      <CardDescription className="text-xs leading-relaxed">
                        {module.description}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-850 flex items-center justify-between text-xs text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                    <span>Learn more</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* WORKFLOW SECTION (#how-it-works) */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200/60 dark:border-zinc-800/60">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <Badge variant="secondary" className="text-[10px]">
              Methodology
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Built for How High Performers Actually Work
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Designed specifically for students, software engineers, founders, and creators who demand clean speed without bloated setup ceremonies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workflowSteps.map((ws) => {
              const Icon = ws.icon;
              return (
                <div
                  key={ws.step}
                  className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 space-y-4 shadow-2xs relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-zinc-200 dark:text-zinc-800">
                      {ws.step}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {ws.title}
                    </h3>
                    <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
                      {ws.tagline}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-1">
                      {ws.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CLOSING CALL TO ACTION BANNER */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white via-zinc-50/50 to-zinc-100/50 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 p-8 sm:p-14 shadow-lg space-y-6 relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-4">
              <Badge variant="orange" className="text-[10px]">
                Ready for Clarity?
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Reclaim Your Attention.{' '}
                <span className="text-orange-600 dark:text-orange-400">Organise Today.</span>
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Join thousands of students, builders, and professionals who have consolidated their digital life into LifeOS.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-sm px-6 h-11 font-semibold"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Create Your Free Workspace
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto text-sm px-6 h-11"
                >
                  Explore Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                OS
              </div>
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                LifeOS
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Organise Your Life. Focus on What Matters.
            </p>
            <span className="inline-block text-[11px] text-zinc-400">
              Sleek Orange &amp; Black Architecture
            </span>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[10px]">
              Navigation
            </p>
            <ul className="space-y-1.5">
              <li>
                <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                  Features &amp; Modules
                </a>
              </li>
              <li>
                <a href="#preview" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                  Interactive Preview
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                  Methodology
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                  Live Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[10px]">
              System &amp; Specs
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link to="/design-system" className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1">
                  Design System Spec <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <span className="text-zinc-400">Carbon &amp; Charcoal Surfaces</span>
              </li>
              <li>
                <span className="text-zinc-400">Vibrant Orange Tokens</span>
              </li>
              <li>
                <span className="text-zinc-400">Stage 2 Routing Active</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[10px]">
              Account
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link to="/login" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                  Create Workspace
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                  Reset Password
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
          <span>&copy; 2026 LifeOS Inc. All rights reserved.</span>
          <span>Engineered with React 19, TypeScript, and Tailwind CSS.</span>
        </div>
      </footer>
    </div>
  );
};
