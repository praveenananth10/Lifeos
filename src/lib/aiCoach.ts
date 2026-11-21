import type {
  Task,
  Habit,
  Transaction,
  Goal,
  FocusSession,
  TaskCategory,
  TaskPriority,
} from '../types/lifeos';

export interface WorkspaceSummary {
  tasks: Task[];
  habits: Habit[];
  transactions: Transaction[];
  monthlyBudget: number;
  goals: Goal[];
  focusSessions: FocusSession[];
  todayDate: string;
}

export interface DailyInsights {
  priorityFocus: {
    urgentCount: number;
    topTasks: Task[];
    summary: string;
  };
  habitPulse: {
    completedToday: number;
    totalHabits: number;
    bestStreak: number;
    pendingHabits: Habit[];
    summary: string;
  };
  financialHealth: {
    totalSpent: number;
    monthlyBudget: number;
    usagePercent: number;
    remainingBudget: number;
    safeDailySpendRemaining: number;
    status: 'good' | 'warning' | 'alert';
    summary: string;
  };
  goalVelocity: {
    activeGoalsCount: number;
    completedGoalsCount: number;
    averageProgress: number;
    topGoal?: Goal;
    summary: string;
  };
  focusMomentum: {
    todayMinutes: number;
    totalSessions: number;
    summary: string;
  };
}

export interface SuggestedTask {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedTask?: SuggestedTask;
}

/**
 * Checks if a Gemini API key is configured in the environment
 */
export function isGeminiConfigured(): boolean {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  return Boolean(key && typeof key === 'string' && key.trim() !== '' && !key.includes('your_'));
}

/**
 * Analyzes the user's live workspace and generates daily executive insights
 */
export function generateDailyInsights(
  workspace: WorkspaceSummary,
  userName = 'Builder'
): DailyInsights {
  const { tasks, habits, transactions, monthlyBudget, goals, focusSessions, todayDate } = workspace;

  // 1. Priority Focus
  const pendingTasks = tasks.filter((t) => !t.completed);
  const urgentTasks = pendingTasks.filter(
    (t) => t.priority === 'high' || t.dueDate <= todayDate
  );
  const sortedPending = [...pendingTasks].sort((a, b) => {
    const weights: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };
    if (weights[b.priority] !== weights[a.priority]) {
      return weights[b.priority] - weights[a.priority];
    }
    return a.dueDate.localeCompare(b.dueDate);
  });
  const topTasks = sortedPending.slice(0, 3);

  let prioritySummary = `All tasks are completed, ${userName}! Great job maintaining a clean inbox.`;
  if (urgentTasks.length > 0) {
    prioritySummary = `${userName}, you have ${urgentTasks.length} urgent task${
      urgentTasks.length > 1 ? 's' : ''
    } requiring attention today. Top item: "${topTasks[0]?.title || 'Key sprint'}".`;
  } else if (pendingTasks.length > 0) {
    prioritySummary = `${userName}, you have ${pendingTasks.length} pending task${
      pendingTasks.length > 1 ? 's' : ''
    } on your radar. Steady execution will keep you ahead of schedule.`;
  }

  // 2. Habit Pulse
  const completedToday = habits.filter((h) => h.completedDates.includes(todayDate)).length;
  const totalHabits = habits.length;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;
  const pendingHabits = habits.filter((h) => !h.completedDates.includes(todayDate));

  let habitSummary = 'No active habits tracked yet. Create one to build compounding momentum!';
  if (totalHabits > 0) {
    if (completedToday === totalHabits) {
      habitSummary = `Flawless execution! All ${totalHabits} habit${
        totalHabits > 1 ? 's' : ''
      } completed today with a peak ${bestStreak}-day streak.`;
    } else {
      habitSummary = `${completedToday} of ${totalHabits} habits checked off today. Next to tackle: "${
        pendingHabits[0]?.name || 'Habit'
      }".`;
    }
  }

  // 3. Financial Health
  const currentMonth = todayDate.slice(0, 7); // e.g. "2026-11"
  const totalSpent = transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, t) => acc + t.amount, 0);

  const budget = monthlyBudget > 0 ? monthlyBudget : 2000;
  const usagePercent = Math.min(100, Math.round((totalSpent / budget) * 100));
  const remainingBudget = Math.max(0, budget - totalSpent);

  // Compute days left in month
  const [, , currentDayStr] = todayDate.split('-');
  const currentDay = parseInt(currentDayStr || '1', 10);
  const daysInMonth = 30; // standard estimation
  const daysRemaining = Math.max(1, daysInMonth - currentDay);
  const safeDailySpendRemaining = remainingBudget / daysRemaining;

  let finStatus: 'good' | 'warning' | 'alert' = 'good';
  if (usagePercent > 90) finStatus = 'alert';
  else if (usagePercent > 70) finStatus = 'warning';

  let finSummary = `Budget is healthy at ${usagePercent}% used ($${totalSpent.toLocaleString()} of $${budget.toLocaleString()}).`;
  if (finStatus === 'alert') {
    finSummary = `Budget warning: ${usagePercent}% utilized. Limit discretionary spend to ~$${safeDailySpendRemaining.toFixed(
      0
    )}/day for the next ${daysRemaining} days.`;
  } else if (finStatus === 'warning') {
    finSummary = `${usagePercent}% of monthly budget spent. Safe daily buffer remaining: ~$${safeDailySpendRemaining.toFixed(
      0
    )}/day.`;
  }

  // 4. Goal Velocity
  const completedGoalsCount = goals.filter(
    (g) => g.milestones.length > 0 && g.milestones.every((m) => m.completed)
  ).length;
  const activeGoalsCount = goals.length - completedGoalsCount;

  let averageProgress = 0;
  if (goals.length > 0) {
    const totalProg = goals.reduce((acc, g) => {
      if (g.milestones.length === 0) return acc;
      const done = g.milestones.filter((m) => m.completed).length;
      return acc + (done / g.milestones.length) * 100;
    }, 0);
    averageProgress = Math.round(totalProg / goals.length);
  }

  const topActiveGoal = goals.find(
    (g) => g.milestones.some((m) => !m.completed)
  );

  let goalSummary = 'Define your first quarterly horizon goal to align daily habits with your vision.';
  if (goals.length > 0) {
    goalSummary = `Average velocity is ${averageProgress}% across ${activeGoalsCount} active goal${
      activeGoalsCount !== 1 ? 's' : ''
    }. Top focus: "${topActiveGoal?.title || goals[0]?.title}".`;
  }

  // 5. Focus Momentum
  const todayMinutes = focusSessions
    .filter((f) => f.completedAt.startsWith(todayDate))
    .reduce((acc, f) => acc + f.durationMinutes, 0);

  const focusSummary =
    todayMinutes > 0
      ? `${todayMinutes} minutes of deep focus logged today across ${focusSessions.filter((f) =>
          f.completedAt.startsWith(todayDate)
        ).length} session(s).`
      : 'No deep focus sessions recorded yet today. Block a 25-minute Pomodoro sprint!';

  return {
    priorityFocus: {
      urgentCount: urgentTasks.length,
      topTasks,
      summary: prioritySummary,
    },
    habitPulse: {
      completedToday,
      totalHabits,
      bestStreak,
      pendingHabits,
      summary: habitSummary,
    },
    financialHealth: {
      totalSpent,
      monthlyBudget: budget,
      usagePercent,
      remainingBudget,
      safeDailySpendRemaining,
      status: finStatus,
      summary: finSummary,
    },
    goalVelocity: {
      activeGoalsCount,
      completedGoalsCount,
      averageProgress,
      topGoal: topActiveGoal,
      summary: goalSummary,
    },
    focusMomentum: {
      todayMinutes,
      totalSessions: focusSessions.length,
      summary: focusSummary,
    },
  };
}

/**
 * Builds a structured text prompt describing the current workspace state
 */
function buildWorkspaceContextPrompt(workspace: WorkspaceSummary, userName: string): string {
  const { tasks, habits, transactions, monthlyBudget, goals, focusSessions, todayDate } = workspace;
  const pendingTasks = tasks.filter((t) => !t.completed);
  const currentMonth = todayDate.slice(0, 7);
  const totalSpent = transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, t) => acc + t.amount, 0);

  const todayFocus = focusSessions
    .filter((f) => f.completedAt.startsWith(todayDate))
    .reduce((acc, f) => acc + f.durationMinutes, 0);

  return `
User: ${userName}
Current Date: ${todayDate}

Pending Tasks (${pendingTasks.length} total):
${
  pendingTasks.length > 0
    ? pendingTasks
        .slice(0, 6)
        .map(
          (t) =>
            `- [${t.priority.toUpperCase()}] ${t.title} (Due: ${t.dueDate}, Category: ${t.category})`
        )
        .join('\n')
    : '- All tasks completed.'
}

Habits (${habits.length} total):
${
  habits.length > 0
    ? habits
        .map(
          (h) =>
            `- ${h.name} (${h.streak} day streak, completed today: ${
              h.completedDates.includes(todayDate) ? 'YES' : 'NO'
            })`
        )
        .join('\n')
    : '- No habits tracked.'
}

Financial Snapshot:
- Monthly Budget: $${monthlyBudget}
- Total Spent This Month: $${totalSpent}
- Remaining Budget: $${Math.max(0, monthlyBudget - totalSpent)}

Goals (${goals.length} total):
${
  goals.length > 0
    ? goals
        .map((g) => {
          const done = g.milestones.filter((m) => m.completed).length;
          return `- ${g.title} (${done}/${g.milestones.length} milestones, Target: ${g.targetDate})`;
        })
        .join('\n')
    : '- No goals defined.'
}

Today's Focus: ${todayFocus} minutes logged
`.trim();
}

/**
 * Smart context-aware local response engine (runs offline with zero API keys required)
 */
function generateLocalAssistantResponse(
  userPrompt: string,
  workspace: WorkspaceSummary,
  userName: string
): { text: string; suggestedTask?: SuggestedTask } {
  const query = userPrompt.toLowerCase();
  const { tasks, habits, transactions, monthlyBudget, goals, focusSessions, todayDate } = workspace;

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedHabits = habits.filter((h) => h.completedDates.includes(todayDate));
  const pendingHabits = habits.filter((h) => !h.completedDates.includes(todayDate));
  const currentMonth = todayDate.slice(0, 7);
  const totalSpent = transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, t) => acc + t.amount, 0);
  const remainingBudget = Math.max(0, monthlyBudget - totalSpent);
  const todayFocus = focusSessions
    .filter((f) => f.completedAt.startsWith(todayDate))
    .reduce((acc, f) => acc + f.durationMinutes, 0);

  // 1. Top Priorities / Daily Planning
  if (
    query.includes('priority') ||
    query.includes('plan') ||
    query.includes('top 3') ||
    query.includes('today') ||
    query.includes('what should i do')
  ) {
    const topPending = [...pendingTasks].sort((a, b) => {
      const weights = { high: 3, medium: 2, low: 1 };
      return weights[b.priority] - weights[a.priority] || a.dueDate.localeCompare(b.dueDate);
    });

    const task1 = topPending[0]?.title || 'Review weekly horizons & inbox';
    const task2 = topPending[1]?.title || 'Complete 50m deep focus sprint';
    const task3 = topPending[2]?.title || 'Review financial cash flow and habit check-in';

    const text = `### 🎯 Daily Strategic Plan for ${userName}

Based on your current workspace, here are your **Top 3 Priorities** for today (${todayDate}):

1. **[High Impact]** ${task1} ${
      topPending[0] ? `*(Due: ${topPending[0].dueDate}, ${topPending[0].category})*` : ''
    }
2. **[Execution]** ${task2} ${
      topPending[1] ? `*(Due: ${topPending[1].dueDate}, ${topPending[1].category})*` : ''
    }
3. **[Momentum]** ${task3} ${
      topPending[2] ? `*(Due: ${topPending[2].dueDate}, ${topPending[2].category})*` : ''
    }

💡 **Coach Tip:** Start with Priority #1 before opening notifications or responding to non-urgent messages. Protect your highest cognitive bandwidth for hard tasks.`;

    const suggestedTask: SuggestedTask = {
      title: topPending[0]
        ? `Focus block: ${topPending[0].title}`
        : 'Deep Work: Execute top priority task',
      category: topPending[0]?.category || 'Work',
      priority: 'high',
      dueDate: todayDate,
    };

    return { text, suggestedTask };
  }

  // 2. Habit Streaks & Momentum Audit
  if (
    query.includes('habit') ||
    query.includes('streak') ||
    query.includes('routine') ||
    query.includes('consistency')
  ) {
    const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;
    const nextHabit = pendingHabits[0];

    let text = `### 🔥 Habit & Consistency Audit

- **Completion Today:** ${completedHabits.length} of ${habits.length} habits logged.
- **Top Active Streak:** **${bestStreak} days**\n\n`;

    if (pendingHabits.length > 0) {
      text += `**Pending Habits to Complete Today:**\n`;
      pendingHabits.forEach((h) => {
        text += `- **${h.name}** *(Current streak: ${h.streak}d • Target: ${h.targetDaysPerWeek}x/wk)*\n`;
      });
      text += `\n⚡ **Recommendation:** Tackle **"${nextHabit.name}"** right now. Preserving streaks compounds into identity change over months.`;
    } else if (habits.length > 0) {
      text += `🎉 **Flawless consistency!** You have completed 100% of your habits today. Take a moment to acknowledge this discipline.`;
    } else {
      text += `You haven't set up habits yet. Building 2–3 daily anchor routines (e.g. Morning Hydration, 30m Reading) creates steady momentum.`;
    }

    const suggestedTask: SuggestedTask = {
      title: nextHabit ? `Complete habit: ${nextHabit.name}` : 'Establish 3 daily anchor habits',
      category: 'Health',
      priority: 'medium',
      dueDate: todayDate,
    };

    return { text, suggestedTask };
  }

  // 3. Financial & Budget Health
  if (
    query.includes('finance') ||
    query.includes('budget') ||
    query.includes('money') ||
    query.includes('spent') ||
    query.includes('expense')
  ) {
    const usagePercent = monthlyBudget > 0 ? Math.round((totalSpent / monthlyBudget) * 100) : 0;
    const safeDaily = Math.max(1, remainingBudget / 10).toFixed(0);

    const text = `### 💳 Financial Health & Runway

- **Monthly Budget:** $${monthlyBudget.toLocaleString()}
- **Current Spend:** $${totalSpent.toLocaleString()} (**${usagePercent}%** utilized)
- **Remaining Capital:** $${remainingBudget.toLocaleString()}
- **Safe Daily Spend:** ~$${safeDaily}/day for the remainder of the month.

📊 **Assessment:** ${
      usagePercent > 90
        ? '⚠️ You have used over 90% of your budget. Freeze non-essential purchases until next month.'
        : usagePercent > 70
        ? '⚡ You are tracking moderately high. Keep discretionary dining and shopping within your daily safe limit.'
        : '✅ Financial trajectory is very healthy. Your savings rate is on target.'
    }`;

    const suggestedTask: SuggestedTask = {
      title: 'Review weekly transactions & prune recurring subscriptions',
      category: 'Finance',
      priority: usagePercent > 80 ? 'high' : 'low',
      dueDate: todayDate,
    };

    return { text, suggestedTask };
  }

  // 4. Goals & Milestone Velocity
  if (
    query.includes('goal') ||
    query.includes('milestone') ||
    query.includes('vision') ||
    query.includes('horizon')
  ) {
    const activeGoals = goals.filter(
      (g) => g.milestones.length === 0 || g.milestones.some((m) => !m.completed)
    );

    let text = `### 🏆 Goal Velocity & Milestones

You currently have **${activeGoals.length} active goal${activeGoals.length !== 1 ? 's' : ''}**:\n\n`;

    if (activeGoals.length > 0) {
      activeGoals.forEach((g) => {
        const done = g.milestones.filter((m) => m.completed).length;
        const total = g.milestones.length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        const nextMilestone = g.milestones.find((m) => !m.completed);

        text += `- **${g.title}** (${pct}% complete • ${done}/${total} milestones)\n`;
        if (nextMilestone) {
          text += `  └─ *Next unlock:* ${nextMilestone.title}\n`;
        }
      });
      text += `\n🚀 **Strategic Insight:** Goals succeed when broken into weekly sprint milestones. Pick one milestone above and tie it directly to a task today.`;
    } else {
      text += `All tracked goals are completed or none are defined! Set a 90-day horizon goal to focus your execution.`;
    }

    const firstActive = activeGoals[0];
    const nextM = firstActive?.milestones.find((m) => !m.completed);

    const suggestedTask: SuggestedTask = {
      title: nextM
        ? `Advance goal: ${nextM.title}`
        : 'Draft 90-day horizon goal with 3 milestones',
      category: 'Study',
      priority: 'high',
      dueDate: todayDate,
    };

    return { text, suggestedTask };
  }

  // 5. Focus & Deep Work
  if (
    query.includes('focus') ||
    query.includes('pomodoro') ||
    query.includes('deep work') ||
    query.includes('productivity')
  ) {
    const text = `### ⚡ Deep Work & Focus Analysis

- **Focus Today:** **${todayFocus} minutes** logged.
- **Total Sessions:** ${focusSessions.length} sessions all-time.

🧠 **Productivity Principle:** Research indicates peak cognitive performance occurs in 45–60 minute uninterrupted blocks separated by 5–10 minute physical resets. 

${
  todayFocus < 50
    ? 'You are early in today’s deep work quota. Launch a 25-minute Pomodoro session on your top task.'
    : 'Strong focus momentum today! Consolidate your progress and capture any key takeaways in Notes.'
}`;

    const suggestedTask: SuggestedTask = {
      title: 'Run 45-minute deep focus block on top priority',
      category: 'Work',
      priority: 'medium',
      dueDate: todayDate,
    };

    return { text, suggestedTask };
  }

  // 6. General / Fallback Workspace Synthesis
  const text = `### 🧭 LifeOS Workspace Briefing for ${userName}

Here is a 360° summary of your current operational status:

- **Tasks:** ${pendingTasks.length} pending task${pendingTasks.length !== 1 ? 's' : ''} (Top item: "${
    pendingTasks[0]?.title || 'None'
  }").
- **Habits:** ${completedHabits.length}/${habits.length} completed today.
- **Financial Status:** $${totalSpent.toLocaleString()} spent of $${monthlyBudget.toLocaleString()} ($${remainingBudget.toLocaleString()} remaining).
- **Focus Mode:** ${todayFocus} minutes logged today.

💡 **Suggested Next Step:** Take 5 minutes to clear your highest-leverage pending task or check off your next habit to build momentum.`;

  const suggestedTask: SuggestedTask = {
    title: pendingTasks[0]
      ? `Execute: ${pendingTasks[0].title}`
      : 'Weekly workspace organization and review',
    category: pendingTasks[0]?.category || 'Work',
    priority: 'high',
    dueDate: todayDate,
  };

  return { text, suggestedTask };
}

/**
 * Main interaction entry point: Calls Gemini API if configured, otherwise falls back to smart local engine
 */
export async function askLifeOSAssistant(
  userPrompt: string,
  workspace: WorkspaceSummary,
  userName = 'Builder'
): Promise<AssistantMessage> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const configured = isGeminiConfigured();

  if (configured && apiKey) {
    try {
      const contextPrompt = buildWorkspaceContextPrompt(workspace, userName);
      const systemInstruction = `You are LifeOS AI Coach, an elite executive coach, life architect, and productivity mentor.
You provide clear, concise, actionable, and inspiring guidance directly grounded in the user's real tasks, habits, finances, goals, and focus sessions.
Structure your response cleanly using Markdown headings, bullet points, and bold emphasis. Keep responses under 250 words.
At the very end of your response, if you recommend an immediate action for the user, include an exact single line in this format:
ACTION_TASK: {"title": "Task title here", "category": "Work|Study|Personal|Health|Finance", "priority": "high|medium|low"}`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
        apiKey.trim()
      )}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Workspace Context:\n${contextPrompt}\n\nUser Question:\n${userPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate && typeof candidate === 'string') {
          let cleanText = candidate;
          let suggestedTask: SuggestedTask | undefined;

          // Check for ACTION_TASK json marker
          const actionMatch = candidate.match(/ACTION_TASK:\s*(\{.*\})/);
          if (actionMatch && actionMatch[1]) {
            try {
              const parsed = JSON.parse(actionMatch[1]);
              suggestedTask = {
                title: parsed.title || 'Execute recommended step',
                category: (parsed.category as TaskCategory) || 'Work',
                priority: (parsed.priority as TaskPriority) || 'high',
                dueDate: workspace.todayDate,
              };
              cleanText = candidate.replace(/ACTION_TASK:\s*\{.*\}/, '').trim();
            } catch {
              // Ignore parse error and keep cleanText
            }
          }

          return {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: cleanText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedTask,
          };
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('Gemini API request failed, falling back to local coach engine:', err);
      }
    }
  }

  // Smart local engine fallback
  await new Promise((resolve) => setTimeout(resolve, 350)); // natural micro-pause
  const localRes = generateLocalAssistantResponse(userPrompt, workspace, userName);

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: localRes.text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedTask: localRes.suggestedTask,
  };
}
