import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import type { Transaction } from '../../types/lifeos';
import { getLastNDays } from '../../utils/date';

export interface FinanceChartsProps {
  transactions: Transaction[];
  todayDate: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Technology: '#F97316', // Vibrant Orange
  Groceries: '#10B981', // Emerald
  Dining: '#8B5CF6', // Purple
  Health: '#EC4899', // Pink
  Education: '#3B82F6', // Blue
  Travel: '#F59E0B', // Amber
  Entertainment: '#FB923C', // Warm Amber
  Utilities: '#06B6D4', // Cyan
  General: '#71717A', // Zinc
};

const DEFAULT_COLOR = '#A1A1AA';

export const FinanceCharts: React.FC<FinanceChartsProps> = ({ transactions, todayDate }) => {
  // 1. Calculate Expenses by Category for Donut Chart
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalExpenseAmount = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap: Record<string, number> = {};
  expenseTransactions.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({
      name,
      value,
      percent: totalExpenseAmount > 0 ? Math.round((value / totalExpenseAmount) * 100) : 0,
      color: CATEGORY_COLORS[name] || DEFAULT_COLOR,
    }))
    .sort((a, b) => b.value - a.value);

  // 2. Calculate Cash Flow for the last 10 days
  const recentDays = getLastNDays(todayDate, 10);

  const cashFlowData = recentDays.map((dStr) => {
    const dayIncome = transactions
      .filter((t) => t.date === dStr && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const dayExpense = transactions
      .filter((t) => t.date === dStr && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const [, month, day] = dStr.split('-');
    return {
      date: `${month}/${day}`,
      fullDate: dStr,
      Income: dayIncome,
      Expense: dayExpense,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Category Breakdown Donut */}
      <Card variant="default">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Expense Category Breakdown</CardTitle>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Outflow distribution across active spending categories.
          </p>
        </CardHeader>

        <CardContent>
          {categoryData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-zinc-400 italic">
              No expense transactions recorded yet.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="h-48 w-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as (typeof categoryData)[0];
                          return (
                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 shadow-lg text-xs space-y-1">
                              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {data.name}
                              </span>
                              <div className="text-zinc-500">
                                ${data.value.toFixed(2)} ({data.percent}%)
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with percentages */}
              <div className="space-y-1.5 flex-1 w-full max-h-48 overflow-y-auto pr-2">
                {categoryData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-zinc-700 dark:text-zinc-300 truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono">
                      <span className="text-zinc-400 text-[11px]">{item.percent}%</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        ${item.value.toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Cash Flow Dual BarChart */}
      <Card variant="default">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Cash Flow Trajectory (Recent 10 Days)</CardTitle>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Daily comparison of revenue inflows vs expenses.
          </p>
        </CardHeader>

        <CardContent>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#71717a' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e4e4e7' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#71717a' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as (typeof cashFlowData)[0];
                      return (
                        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 shadow-lg text-xs space-y-1">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                            {data.fullDate}
                          </span>
                          <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                            +${data.Income.toFixed(2)} Inflow
                          </div>
                          <div className="text-rose-600 dark:text-rose-400 font-medium">
                            -${data.Expense.toFixed(2)} Outflow
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 6 }}
                  iconType="circle"
                />
                <Bar dataKey="Income" fill="#10B981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Expense" fill="#F43F5E" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

