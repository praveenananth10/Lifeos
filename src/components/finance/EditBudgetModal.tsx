import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number;
  onSave: (amount: number) => void;
}

interface EditBudgetFormProps {
  currentBudget: number;
  onSave: (amount: number) => void;
  onClose: () => void;
}

const EditBudgetForm: React.FC<EditBudgetFormProps> = ({ currentBudget, onSave, onClose }) => {
  const [budgetStr, setBudgetStr] = useState(String(currentBudget));
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(budgetStr);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid monthly budget greater than $0');
      return;
    }

    onSave(parsed);
    onClose();
  };

  const setPreset = (val: number) => {
    setBudgetStr(String(val));
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Monthly Budget Target ($)"
        type="number"
        step="100"
        placeholder="3000"
        value={budgetStr}
        onChange={(e) => {
          setBudgetStr(e.target.value);
          if (error) setError('');
        }}
        error={error}
        autoFocus
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Quick Presets
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[2000, 3000, 4000, 5000].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setPreset(amount)}
              className="py-1.5 text-xs font-mono font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 cursor-pointer"
            >
              ${amount.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm">
          Save Budget
        </Button>
      </div>
    </form>
  );
};

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({
  isOpen,
  onClose,
  currentBudget,
  onSave,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Adjust Monthly Budget Limit</span>
        </div>
      }
      description="Set your monthly spending ceiling to track outflow discipline."
      maxWidth="sm"
    >
      <EditBudgetForm
        key={isOpen ? 'open' : 'closed'}
        currentBudget={currentBudget}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
};

