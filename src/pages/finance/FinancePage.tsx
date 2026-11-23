import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Gauge,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FinanceCharts } from '../../components/finance/FinanceCharts';
import { TransactionList } from '../../components/finance/TransactionList';
import { AddTransactionModal } from '../../components/finance/AddTransactionModal';
import { EditBudgetModal } from '../../components/finance/EditBudgetModal';
import { useLifeOS } from '../../hooks/useLifeOS';

export const FinancePage: React.FC = () => {
  const {
    transactions,
    monthlyBudget,
    todayDate,
    totalSpentThisMonth,
    totalIncomeThisMonth,
    netSavingsThisMonth,
    savingsRatePercent,
    budgetUsagePercent,
    addTransaction,
    deleteTransaction,
    updateMonthlyBudget,
  } = useLifeOS();

  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [isEditBudgetModalOpen, setIsEditBudgetModalOpen] = useState(false);

  // Status for budget usage
  const getBudgetStatus = () => {
    if (budgetUsagePercent > 100) return { label: 'Over Budget', color: 'text-rose-600', bar: 'bg-rose-500' };
    if (budgetUsagePercent >= 85) return { label: 'Near Limit', color: 'text-amber-600', bar: 'bg-amber-500' };
    return { label: 'On Track', color: 'text-emerald-600', bar: 'bg-emerald-500' };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Finance Manager &amp; Cash Flow
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Cash flow logging, monthly budget allocations, and net balance trajectory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditBudgetModalOpen(true)}
            leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          >
            Edit Budget
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddTxModalOpen(true)}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* 2. Top 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Income */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Total Inflow (Nov)
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              +${totalIncomeThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">
              Recorded revenue &amp; earnings
            </p>
          </div>
        </Card>

        {/* 2. Total Expenses */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Total Outflow (Nov)
            </span>
            <div className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
              -${totalSpentThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">
              Living costs &amp; allocations
            </p>
          </div>
        </Card>

        {/* 3. Net Savings & Savings Rate */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Net Savings &amp; Velocity
            </span>
            <div className="h-7 w-7 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
                ${netSavingsThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <Badge variant="orange" className="text-[10px]">
                {savingsRatePercent}% Rate
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Retained capital this cycle
            </p>
          </div>
        </Card>

        {/* 4. Monthly Budget Usage */}
        <Card variant="default" className="p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Monthly Budget Usage
            </span>
            <div className="h-7 w-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
              <Gauge className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                ${totalSpentThisMonth.toFixed(0)} / ${monthlyBudget.toLocaleString()}
              </span>
              <span className={`text-[11px] font-mono font-bold ${budgetStatus.color}`}>
                {budgetUsagePercent}% ({budgetStatus.label})
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${budgetStatus.bar}`}
                style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Spending Analytics Charts */}
      <FinanceCharts transactions={transactions} todayDate={todayDate} />

      {/* 4. Transaction History Table */}
      <TransactionList
        transactions={transactions}
        onDeleteTransaction={deleteTransaction}
      />

      {/* 5. Modals */}
      <AddTransactionModal
        isOpen={isAddTxModalOpen}
        onClose={() => setIsAddTxModalOpen(false)}
        todayDate={todayDate}
        onSave={(data) => addTransaction(data)}
      />

      <EditBudgetModal
        isOpen={isEditBudgetModalOpen}
        onClose={() => setIsEditBudgetModalOpen(false)}
        currentBudget={monthlyBudget}
        onSave={(newAmount) => updateMonthlyBudget(newAmount)}
      />
    </div>
  );
};

