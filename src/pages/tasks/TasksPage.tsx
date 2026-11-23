import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  AlertCircle,
  Layers,
  List,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TaskItem } from '../../components/tasks/TaskItem';
import { TaskModal } from '../../components/tasks/TaskModal';
import { ScheduleTaskModal } from '../../components/tasks/ScheduleTaskModal';
import { useLifeOS } from '../../hooks/useLifeOS';
import type { Task, TaskCategory, TaskPriority, CalendarEventType } from '../../types/lifeos';

type StatusFilter = 'all' | 'pending' | 'completed';
type SortOption = 'dueDate' | 'priority' | 'newest' | 'title';
type GroupOption = 'none' | 'category' | 'priority';

const CATEGORIES: (TaskCategory | 'All')[] = [
  'All',
  'Work',
  'Study',
  'Personal',
  'Health',
  'Finance',
];

const PRIORITIES: (TaskPriority | 'All')[] = ['All', 'high', 'medium', 'low'];

export const TasksPage: React.FC = () => {
  const {
    tasks,
    todayDate,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    scheduleTaskAsEvent,
    totalTasksCount,
    pendingTasksCount,
    completedTasksCount,
    overdueTasksCount,
  } = useLifeOS();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [groupBy, setGroupBy] = useState<GroupOption>('none');

  // Inline Quick Add Bar state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState<TaskCategory>('Work');
  const [quickPriority, setQuickPriority] = useState<TaskPriority>('medium');
  const [quickDueDate, setQuickDueDate] = useState(todayDate);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulingTask, setSchedulingTask] = useState<Task | null>(null);

  // Handle Quick Add
  const handleQuickAdd = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const trimmedTitle = quickTitle.trim();
    if (!trimmedTitle) return;

    addTask({
      title: trimmedTitle,
      category: quickCategory,
      priority: quickPriority,
      dueDate: quickDueDate || todayDate,
      completed: false,
    });

    setQuickTitle('');
  };

  // Open Edit Modal
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Open Create Modal
  const handleCreateClick = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  // Open Schedule Modal
  const handleScheduleClick = (task: Task) => {
    setSchedulingTask(task);
    setIsScheduleModalOpen(true);
  };

  // Filtered and Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // Category filter
        if (categoryFilter !== 'All' && task.category !== categoryFilter) return false;

        // Priority filter
        if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q) || false;
          if (!matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          // Incomplete overdue first, then earlier due dates, completed last
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'priority') {
          const weights: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };
          return weights[b.priority] - weights[a.priority];
        }
        if (sortBy === 'newest') {
          return b.createdAt.localeCompare(a.createdAt);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, statusFilter, categoryFilter, priorityFilter, searchQuery, sortBy]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('All');
    setPriorityFilter('All');
    setSortBy('dueDate');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header & Live Metric Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <CheckSquare className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Task Manager &amp; Sprints
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Prioritize high-impact execution, eliminate bottlenecks, and schedule time-blocks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateClick}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-2xs">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Total Tasks</div>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 mt-1">
            {totalTasksCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-2xs">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Pending</div>
          <div className="text-xl font-bold font-mono text-orange-600 dark:text-orange-400 mt-1">
            {pendingTasksCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-2xs">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Completed</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {completedTasksCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-2xs">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            {overdueTasksCount > 0 && <AlertCircle className="h-3 w-3 text-rose-500" />}
            Overdue
          </div>
          <div
            className={`text-xl font-bold font-mono mt-1 ${
              overdueTasksCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-400'
            }`}
          >
            {overdueTasksCount}
          </div>
        </div>
      </div>

      {/* 2. Quick-Add Inline Bar */}
      <Card className="p-3 sm:p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border-dashed border-zinc-300/80 dark:border-zinc-800">
        <form onSubmit={handleQuickAdd} className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rapid capture: type task title and press Enter..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleQuickAdd();
                }
              }}
              className="w-full h-9 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Category */}
            <select
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value as TaskCategory)}
              className="h-9 rounded-lg px-2.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
            >
              {(CATEGORIES.filter((c) => c !== 'All') as TaskCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Priority */}
            <select
              value={quickPriority}
              onChange={(e) => setQuickPriority(e.target.value as TaskPriority)}
              className="h-9 rounded-lg px-2.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            {/* Due Date */}
            <input
              type="date"
              value={quickDueDate}
              onChange={(e) => setQuickDueDate(e.target.value)}
              className="h-9 rounded-lg px-2.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
            />

            <Button
              type="button"
              onClick={handleQuickAdd}
              variant="primary"
              size="sm"
              className="whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Task
            </Button>
          </div>
        </form>
      </Card>

      {/* 3. Search, Filter, Sort & Grouping Controls */}
      <div className="space-y-3">
        {/* Top filter row: Status tabs + Search + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto">
            {(
              [
                { id: 'all', label: 'All', count: totalTasksCount },
                { id: 'pending', label: 'Pending', count: pendingTasksCount },
                { id: 'completed', label: 'Completed', count: completedTasksCount },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-200/60 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-8 rounded-lg px-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="newest">Newest</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>

            {/* Group Select */}
            <div className="flex items-center gap-1">
              {groupBy === 'none' ? (
                <List className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              ) : (
                <Layers className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              )}
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as GroupOption)}
                className="h-8 rounded-lg px-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500"
              >
                <option value="none">Flat List</option>
                <option value="category">Group by Category</option>
                <option value="priority">Group by Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Secondary filter pills row: Categories & Priority */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Categories */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3" /> Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Priority */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-zinc-400 mr-1">Priority:</span>
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriorityFilter(p)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium capitalize transition-all cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Task List / Groups */}
      {filteredTasks.length === 0 ? (
        <Card className="p-12 text-center bg-white dark:bg-zinc-900">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
            <CheckSquare className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No tasks match your filters
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Try resetting your search query or status filter to see all active tasks.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateClick}>
              Create New Task
            </Button>
          </div>
        </Card>
      ) : groupBy === 'none' ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              todayDate={todayDate}
              onToggle={toggleTask}
              onEdit={handleEditClick}
              onDelete={deleteTask}
              onSchedule={handleScheduleClick}
            />
          ))}
        </div>
      ) : groupBy === 'category' ? (
        <div className="space-y-6">
          {(CATEGORIES.filter((c) => c !== 'All') as TaskCategory[]).map((cat) => {
            const catTasks = filteredTasks.filter((t) => t.category === cat);
            if (catTasks.length === 0) return null;
            return (
              <div key={cat} className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {cat}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {catTasks.length}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  {catTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      todayDate={todayDate}
                      onToggle={toggleTask}
                      onEdit={handleEditClick}
                      onDelete={deleteTask}
                      onSchedule={handleScheduleClick}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {(['high', 'medium', 'low'] as TaskPriority[]).map((p) => {
            const prioTasks = filteredTasks.filter((t) => t.priority === p);
            if (prioTasks.length === 0) return null;
            return (
              <div key={p} className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                      {p} Priority
                    </span>
                    <Badge
                      variant={p === 'high' ? 'danger' : p === 'medium' ? 'warning' : 'secondary'}
                      className="text-[10px]"
                    >
                      {prioTasks.length}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  {prioTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      todayDate={todayDate}
                      onToggle={toggleTask}
                      onEdit={handleEditClick}
                      onDelete={deleteTask}
                      onSchedule={handleScheduleClick}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        initialTask={editingTask}
        todayDate={todayDate}
        onSave={(data) => {
          if (editingTask) {
            updateTask(editingTask.id, data);
          } else {
            addTask(data);
          }
        }}
      />

      <ScheduleTaskModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        task={schedulingTask}
        todayDate={todayDate}
        onSchedule={(taskId, date, startTime, endTime, type) => {
          scheduleTaskAsEvent(taskId, date, startTime, endTime, type as CalendarEventType);
        }}
      />
    </div>
  );
};
