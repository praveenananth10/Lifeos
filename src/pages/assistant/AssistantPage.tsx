import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Plus,
  Check,
  RefreshCw,
  Flame,
  CheckSquare,
  Wallet,
  Clock,
  ArrowRight,
  Trash2,
  Zap,
  Target,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useLifeOS } from '../../hooks/useLifeOS';
import { useAuth } from '../../hooks/useAuth';
import {
  generateDailyInsights,
  askLifeOSAssistant,
  isGeminiConfigured,
  type AssistantMessage,
  type SuggestedTask,
  type WorkspaceSummary,
} from '../../lib/aiCoach';

const QUICK_STARTERS = [
  { label: 'Plan my top 3 priorities today', icon: CheckSquare },
  { label: 'Audit my habit streaks', icon: Flame },
  { label: 'Check my monthly budget health', icon: Wallet },
  { label: 'Summarize my goal progress', icon: Target },
  { label: 'Deep work & focus strategy', icon: Clock },
];

export const AssistantPage: React.FC = () => {
  const { user } = useAuth();
  const {
    tasks,
    habits,
    transactions,
    monthlyBudget,
    goals,
    focusSessions,
    todayDate,
    addTask,
  } = useLifeOS();

  const userName = user?.name ? user.name.split(' ')[0] : 'Builder';
  const isGeminiLive = isGeminiConfigured();

  // Workspace snapshot
  const workspaceData: WorkspaceSummary = useMemo(
    () => ({
      tasks,
      habits,
      transactions,
      monthlyBudget,
      goals,
      focusSessions,
      todayDate,
    }),
    [tasks, habits, transactions, monthlyBudget, goals, focusSessions, todayDate]
  );

  // Compute daily insights
  const [insightsKey, setInsightsKey] = useState(0);
  const insights = useMemo(() => {
    // insightsKey allows manual re-calc
    void insightsKey;
    return generateDailyInsights(workspaceData, userName);
  }, [workspaceData, userName, insightsKey]);

  // Chat message state with default welcome message
  const [messages, setMessages] = useState<AssistantMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `### 👋 Good day, ${userName}!\n\nI am your **LifeOS AI Personal Coach**, connected live to your tasks, habits, finances, and goals.\n\nHere is your quick summary today:\n- **${insights.priorityFocus.urgentCount} urgent task(s)** pending attention.\n- **${insights.habitPulse.completedToday} of ${insights.habitPulse.totalHabits} habits** checked off.\n- Budget is **${insights.financialHealth.usagePercent}%** utilized.\n\nHow can I help accelerate your execution today? Choose a starter chip below or ask anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedTasks, setAddedTasks] = useState<Record<string, boolean>>({});

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle sending user message
  const handleSendMessage = async (promptToSend?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const assistantRes = await askLifeOSAssistant(text, workspaceData, userName);
      setMessages((prev) => [...prev, assistantRes]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "I encountered a momentary delay connecting to the coach service. Here's my quick recommendation: check your top task on `/tasks` and run a 25-minute focus session!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Create Task from suggestion
  const handleCreateTaskFromSuggestion = (messageId: string, suggestion: SuggestedTask) => {
    addTask({
      title: suggestion.title,
      category: suggestion.category,
      priority: suggestion.priority,
      dueDate: suggestion.dueDate || todayDate,
      completed: false,
    });
    setAddedTasks((prev) => ({ ...prev, [messageId]: true }));
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Chat cleared. Workspace is synced live with ${tasks.length} tasks and ${habits.length} habits. What would you like to explore next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header & Live AI Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              AI Personal Coach
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time workspace synthesis, daily executive briefings, and intelligent decision support.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-zinc-700 dark:text-zinc-300 text-[11px]">
              {isGeminiLive ? 'Gemini 2.5 Flash Connected' : 'Live Workspace Context (Local)'}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setInsightsKey((k) => k + 1)}
            title="Recalculate insights"
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh Briefing
          </Button>
        </div>
      </div>

      {/* 2. Morning Executive Briefing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Priority Focus */}
        <Card className="p-4 bg-white dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckSquare className="h-3.5 w-3.5 text-orange-500" /> Priority Focus
              </span>
              <Badge
                variant={insights.priorityFocus.urgentCount > 0 ? 'danger' : 'secondary'}
                className="text-[10px]"
              >
                {insights.priorityFocus.urgentCount} Urgent
              </Badge>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-3 leading-relaxed">
              {insights.priorityFocus.summary}
            </p>
          </div>
          {insights.priorityFocus.topTasks.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="truncate">Top: {insights.priorityFocus.topTasks[0]?.title}</span>
              <ArrowRight className="h-3 w-3 shrink-0 ml-1" />
            </div>
          )}
        </Card>

        {/* Card 2: Habit Pulse */}
        <Card className="p-4 bg-white dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Flame className="h-3.5 w-3.5 text-amber-500" /> Habit Momentum
              </span>
              <Badge variant="warning" className="text-[10px]">
                {insights.habitPulse.bestStreak}d Best Streak
              </Badge>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-3 leading-relaxed">
              {insights.habitPulse.summary}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>
              {insights.habitPulse.completedToday}/{insights.habitPulse.totalHabits} Completed Today
            </span>
            <span className="font-mono font-medium text-amber-600 dark:text-amber-400">
              {insights.habitPulse.totalHabits > 0
                ? Math.round(
                    (insights.habitPulse.completedToday / insights.habitPulse.totalHabits) * 100
                  )
                : 0}
              %
            </span>
          </div>
        </Card>

        {/* Card 3: Financial Health */}
        <Card className="p-4 bg-white dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Wallet className="h-3.5 w-3.5 text-emerald-500" /> Budget Health
              </span>
              <Badge
                variant={
                  insights.financialHealth.status === 'alert'
                    ? 'danger'
                    : insights.financialHealth.status === 'warning'
                    ? 'warning'
                    : 'success'
                }
                className="text-[10px]"
              >
                {insights.financialHealth.usagePercent}% Used
              </Badge>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-3 leading-relaxed">
              {insights.financialHealth.summary}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>Safe Daily Burn</span>
            <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
              ${insights.financialHealth.safeDailySpendRemaining.toFixed(0)}/day
            </span>
          </div>
        </Card>

        {/* Card 4: Goal & Deep Work Velocity */}
        <Card className="p-4 bg-white dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Target className="h-3.5 w-3.5 text-orange-500" /> Goal Velocity
              </span>
              <Badge variant="orange" className="text-[10px]">
                {insights.goalVelocity.averageProgress}% Progress
              </Badge>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-3 leading-relaxed">
              {insights.goalVelocity.summary}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>Today&apos;s Deep Focus</span>
            <span className="font-mono font-medium text-orange-600 dark:text-orange-400">
              {insights.focusMomentum.todayMinutes} mins
            </span>
          </div>
        </Card>
      </div>

      {/* 3. Interactive Coach Chat Workspace */}
      <Card className="bg-white dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col h-[580px]">
        {/* Chat Header Bar */}
        <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Live Interactive Session
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
              • Context Aware
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
            title="Clear current session messages"
          >
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        </div>

        {/* Message Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isTaskAdded = addedTasks[msg.id];

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="h-7 w-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-orange-600 text-white rounded-br-xs'
                      : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200/70 dark:border-zinc-700/60 rounded-bl-xs'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-wrap font-sans space-y-1.5">
                    {msg.text.split('\n\n').map((paragraph, idx) => {
                      // Simple heading check
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4
                            key={idx}
                            className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mt-1 mb-1"
                          >
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      return (
                        <p key={idx} className="leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Suggestion Task Action Card */}
                  {msg.suggestedTask && (
                    <div className="mt-3 pt-2.5 border-t border-zinc-200/70 dark:border-zinc-700/60">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-orange-200/80 dark:border-orange-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1">
                              <Zap className="h-2.5 w-2.5" /> Action Recommendation
                            </span>
                            <Badge variant="orange" className="text-[9px] px-1 py-0">
                              {msg.suggestedTask.priority}
                            </Badge>
                          </div>
                          <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {msg.suggestedTask.title}
                          </div>
                        </div>

                        {isTaskAdded ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 self-start sm:self-auto shrink-0">
                            <Check className="h-3 w-3" /> Added to /tasks
                          </span>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-xs h-7 px-2.5 self-start sm:self-auto shrink-0 whitespace-nowrap"
                            onClick={() =>
                              handleCreateTaskFromSuggestion(msg.id, msg.suggestedTask!)
                            }
                            leftIcon={<Plus className="h-3 w-3" />}
                          >
                            Create Task
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    className={`text-[9px] mt-2 text-right ${
                      isUser ? 'text-orange-200' : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="h-7 w-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              </div>
              <div className="rounded-2xl px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-700/60 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-bounce" />
                <span
                  className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />
                <span
                  className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
                <span className="ml-1 text-[11px]">Synthesizing workspace insights...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* 4. Quick Starter Chips & Input Box */}
        <div className="p-3 sm:p-4 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/40">
          {/* Quick Starter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_STARTERS.map((starter) => {
              const Icon = starter.icon;
              return (
                <button
                  key={starter.label}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendMessage(starter.label)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/40 dark:hover:bg-orange-950/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-150 shrink-0 shadow-2xs disabled:opacity-50"
                >
                  <Icon className="h-3 w-3 text-orange-500 shrink-0" />
                  <span>{starter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask your coach anything about your tasks, habits, budget, or goals..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1 h-10 rounded-xl px-3.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 shadow-2xs"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputPrompt.trim() || isLoading}
              className="h-10 px-4 rounded-xl"
              rightIcon={<Send className="h-3.5 w-3.5" />}
            >
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
