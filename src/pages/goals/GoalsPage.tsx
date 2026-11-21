import React, { useState, useMemo } from 'react';
import { Target, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { GoalCard } from '../../components/goals/GoalCard';
import { CreateGoalModal } from '../../components/goals/CreateGoalModal';
import { useLifeOS } from '../../hooks/useLifeOS';

type GoalFilterTab = 'all' | 'short-term' | 'long-term' | 'completed';

export const GoalsPage: React.FC = () => {
  const {
    goals,
    todayDate,
    addGoal,
    deleteGoal,
    toggleMilestone,
    addMilestone,
    deleteMilestone,
    averageGoalProgress,
    activeGoalsCount,
    completedGoalsCount,
  } = useLifeOS();

  const [activeTab, setActiveTab] = useState<GoalFilterTab>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const isGoalCompleted =
        goal.milestones.length > 0 && goal.milestones.every((m) => m.completed);

      if (activeTab === 'completed') {
        return isGoalCompleted;
      }
      if (activeTab === 'short-term') {
        return goal.horizon === 'short-term' && !isGoalCompleted;
      }
      if (activeTab === 'long-term') {
        return goal.horizon === 'long-term' && !isGoalCompleted;
      }
      // 'all' = all active goals (or all goals)
      return true;
    });
  }, [goals, activeTab]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Goal Tracker &amp; OKRs
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Connect quarterly targets directly with execution milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            New Goal
          </Button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Goals */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Active Strategic Goals
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
              {activeGoalsCount}
            </span>
            <span className="text-xs text-zinc-400">in execution</span>
          </div>
        </Card>

        {/* Completed Goals */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Goals Achieved (100%)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {completedGoalsCount}
            </span>
            <span className="text-xs text-zinc-400">completed</span>
          </div>
        </Card>

        {/* Average Progress */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Average OKR Completion
            </span>
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {averageGoalProgress}%
            </span>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${averageGoalProgress}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 self-start sm:self-auto overflow-x-auto max-w-fit">
        {(
          [
            { id: 'all', label: 'All Goals' },
            { id: 'short-term', label: 'Short-Term' },
            { id: 'long-term', label: 'Long-Term' },
            { id: 'completed', label: 'Completed' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-2xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Goal Cards Grid */}
      {filteredGoals.length === 0 ? (
        <Card className="p-12 text-center bg-white dark:bg-zinc-900">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No goals found in this view
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Create an ambitious target with incremental milestones to track your progress.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button variant="secondary" size="sm" onClick={() => setActiveTab('all')}>
              View All Goals
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              Create New Goal
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              todayDate={todayDate}
              onToggleMilestone={toggleMilestone}
              onAddMilestone={addMilestone}
              onDeleteMilestone={deleteMilestone}
              onDeleteGoal={deleteGoal}
            />
          ))}
        </div>
      )}

      {/* 5. Create Goal Modal */}
      <CreateGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        todayDate={todayDate}
        onSave={(data) => addGoal(data)}
      />
    </div>
  );
};

