import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Transaction, TransactionType } from '../../types/lifeos';
import { cn } from '../../utils/cn';

export interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDeleteTransaction,
}) => {
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return Array.from(set).sort();
  }, [transactions]);

  // Filter and sort transactions (newest date first)
  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (typeFilter !== 'all' && t.type !== typeFilter) return false;
        if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (!t.title.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, typeFilter, categoryFilter, searchQuery]);

  return (
    <Card variant="default">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Transaction History</CardTitle>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Showing {filtered.length} of {transactions.length} recorded entries
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type tabs */}
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80">
            {(['all', 'income', 'expense'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setTypeFilter(tab)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-all cursor-pointer',
                  typeFilter === tab
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-2xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-8 rounded-lg px-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-7 pr-3 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 w-36 sm:w-44"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400 italic">
            No transactions match the selected filters.
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className="group p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                    t.type === 'income'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                  )}
                >
                  {t.type === 'income' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>

                <div className="space-y-0.5 truncate">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {t.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                      {t.category}
                    </Badge>
                    <span>•</span>
                    <span className="font-mono text-[10px]">{t.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={cn(
                    'font-mono text-xs font-bold',
                    t.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-zinc-900 dark:text-zinc-100'
                  )}
                >
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </span>

                <button
                  type="button"
                  onClick={() => onDeleteTransaction(t.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                  title="Delete Transaction"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

