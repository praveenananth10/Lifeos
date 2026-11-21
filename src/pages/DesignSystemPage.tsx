import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  ArrowRight, 
  Check, 
  Search, 
  Plus, 
  Trash2,
  Calendar,
  ShieldCheck,
  Zap,
  TrendingUp,
  Layout,
  Sun,
  Moon
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import { SAMPLE_STATS, SAMPLE_TASKS } from '../data/mockData';

export const DesignSystemPage: React.FC = () => {
  const { theme } = useTheme();
  const [loadingButton, setLoadingButton] = useState(false);
  const [testSearch, setTestSearch] = useState('');

  const triggerLoading = () => {
    setLoadingButton(true);
    setTimeout(() => setLoadingButton(false), 1500);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero / Header Section */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-8 sm:p-10 shadow-2xs">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Stage 1: Design System &amp; Theme Engine Verified</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              LifeOS
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 font-normal">
              Organise Your Life. Focus on What Matters.
            </p>
          </div>

          <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            A premium, minimalist personal productivity operating system inspired by the precision of Linear, the versatility of Notion, and the design restraint of Apple. This environment validates our core typography, color contrast, micro-interactions, and component primitives in both light and dark themes.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <ThemeToggle showLabel />
            <Button variant="secondary" size="sm" onClick={triggerLoading} isLoading={loadingButton}>
              Test Interaction
            </Button>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 ml-auto flex items-center gap-1.5">
              <span>Current theme:</span>
              <Badge variant="outline" className="font-mono text-[10px] uppercase">
                {theme}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Stats Cards Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Key Metrics &amp; Statistical Cards
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Subtle elevation, high contrast metrics, and minimal borders
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_STATS.map((stat, idx) => (
            <Card key={idx} variant="default" interactive>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {stat.label}
                  </span>
                  {idx === 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : idx === 1 ? (
                    <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                  ) : idx === 2 ? (
                    <Clock className="h-4 w-4 text-zinc-400" />
                  ) : (
                    <Layers className="h-4 w-4 text-zinc-400" />
                  )}
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {stat.value}
                  </span>
                  {stat.change && (
                    <Badge variant={stat.trend === 'up' ? 'success' : 'secondary'} className="text-[10px]">
                      {stat.change}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Buttons Showcase */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Button Component Hierarchy
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Strict hierarchy: Primary (dominant action), Secondary (standard), Outline, Ghost, and Danger
          </p>
        </div>

        <Card variant="default">
          <CardContent className="p-6 space-y-6">
            {/* Variants */}
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                Variants
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">
                  Primary Action
                </Button>
                <Button variant="secondary">
                  Secondary Action
                </Button>
                <Button variant="outline">
                  Outline Button
                </Button>
                <Button variant="ghost">
                  Ghost Button
                </Button>
                <Button variant="danger" leftIcon={<Trash2 className="h-3.5 w-3.5" />}>
                  Delete Item
                </Button>
              </div>
            </div>

            {/* Sizes */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                Sizes &amp; States
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" variant="secondary">
                  Small (sm)
                </Button>
                <Button size="md" variant="secondary">
                  Medium (md)
                </Button>
                <Button size="lg" variant="secondary">
                  Large (lg)
                </Button>
                <Button size="md" variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                  With Left Icon
                </Button>
                <Button size="md" variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  With Right Icon
                </Button>
                <Button size="md" variant="primary" isLoading>
                  Loading State
                </Button>
                <Button size="md" variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Badges & Status Indicators */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Badges &amp; Status Indicators
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Compact status representations for tasks, priorities, and workflow states
          </p>
        </div>

        <Card variant="default">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="indigo">Indigo Accent</Badge>
              <Badge variant="success" dot>Active / Complete</Badge>
              <Badge variant="warning" dot>In Progress / Warning</Badge>
              <Badge variant="danger" dot>Urgent / Blocked</Badge>
              <Badge variant="info" dot>Information</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Form Primitives Showcase */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Input &amp; Field Primitives
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Clean typography, precision borders, and high-readability placeholder text
          </p>
        </div>

        <Card variant="default">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Task Search"
                placeholder="Search across all modules..."
                leftIcon={<Search className="h-4 w-4" />}
                value={testSearch}
                onChange={(e) => setTestSearch(e.target.value)}
              />
              <Input
                label="Project Name"
                placeholder="e.g. Life Architecture 2026"
                helperText="Will be linked to your quarterly goals."
              />
              <Input
                label="Due Date Validation"
                defaultValue="Invalid Date"
                error="Date must be today or in the future."
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Realistic Sample Task Cards Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Interactive Card Patterns (Sample Tasks)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Realistic card structures with headers, metadata tags, and footer actions
            </p>
          </div>
          <Button variant="secondary" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
            New Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_TASKS.map((task) => (
            <Card key={task.id} variant="default" interactive className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-1">
                    <Badge
                      variant={
                        task.priority === 'high'
                          ? 'danger'
                          : task.priority === 'medium'
                          ? 'warning'
                          : 'secondary'
                      }
                      dot
                    >
                      {task.priority}
                    </Badge>
                    <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                      {task.id}
                    </span>
                  </div>
                  <CardTitle className="text-sm font-semibold mt-1">
                    {task.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {task.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Due: {task.dueDate}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      #{task.category}
                    </span>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="justify-between">
                <span className="text-[11px] text-zinc-400">
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                  <Check className="h-3.5 w-3.5 mr-1" /> Toggle
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Design System Checklist & Token Verification */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Stage 1 Architecture &amp; Token Verification
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            System architectural verification against specifications
          </p>
        </div>

        <Card variant="subtle">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Typography</span>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Inter / system sans-serif with optimized letter-spacing and font-smoothing.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                  <Zap className="h-4 w-4 text-emerald-500" />
                  <span>Theme Engine</span>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  LocalStorage-persisted theme toggle with automatic OS color-scheme fallback.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                  <Layout className="h-4 w-4 text-emerald-500" />
                  <span>Modular Folders</span>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Structured `types/`, `context/`, `hooks/`, `components/`, `data/`, `utils/`, and `pages/`.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                  {theme === 'dark' ? (
                    <Moon className="h-4 w-4 text-sky-400" />
                  ) : (
                    <Sun className="h-4 w-4 text-amber-500" />
                  )}
                  <span>Crisp Contrast</span>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Zero heavy gradients, zero loud saturation. Crisp 1px borders &amp; quiet surfaces.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
