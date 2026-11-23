import React, { useState } from 'react';
import { DollarSign, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Transaction, TransactionType } from '../../types/lifeos';

export interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayDate: string;
  onSave: (tx: Omit<Transaction, 'id'>) => void;
}

const EXPENSE_CATEGORIES = [
  'Groceries',
  'Dining',
  'Technology',
  'Health',
  'Education',
  'Travel',
  'Entertainment',
  'Utilities',
  'General',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Consulting',
  'Investments',
  'Freelance',
  'Side Project',
  'Bonus',
  'Other',
];

interface AddTransactionFormProps {
  todayDate: string;
  onSave: (tx: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  todayDate,
  onSave,
  onClose,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [date, setDate] = useState(todayDate);
  const [error, setError] = useState('');

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'Salary' : 'Groceries');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Transaction description is required');
      return;
    }

    const parsedAmount = parseFloat(amountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than $0');
      return;
    }

    onSave({
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      date: date || todayDate,
    });
    onClose();
  };

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Segmented Type Toggle: Expense vs Income */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            type === 'expense'
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 shadow-2xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          Expense (Outflow)
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            type === 'income'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 shadow-2xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          Income (Inflow)
        </button>
      </div>

      {/* Title */}
      <Input
        label="Description / Title"
        placeholder={type === 'expense' ? 'e.g. Figma Subscription, Whole Foods' : 'e.g. Monthly Client Retainer'}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (error) setError('');
        }}
        autoFocus
      />

      {/* Amount & Category */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Amount ($)"
          type="number"
          step="0.01"
          placeholder="45.00"
          value={amountStr}
          onChange={(e) => {
            setAmountStr(e.target.value);
            if (error) setError('');
          }}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-9 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
          >
            {currentCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Transaction Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full h-9 rounded-lg px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className={type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : undefined}
        >
          {type === 'income' ? 'Record Income' : 'Record Expense'}
        </Button>
      </div>
    </form>
  );
};

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  todayDate,
  onSave,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <span>New Transaction</span>
        </div>
      }
      description="Record income inflows and expense outlays with clear categorization."
      maxWidth="md"
    >
      <AddTransactionForm
        key={isOpen ? 'open' : 'closed'}
        todayDate={todayDate}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
};

