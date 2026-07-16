import React from 'react';
import { TrendingUp, TrendingDown, Wallet, CheckSquare } from 'lucide-react';

interface StatCardsProps {
  isDarkMode: boolean;
  totalIncome: number;
  totalExpense: number;
  budgetCap: number;
  completedTasksCount: number;
  totalTasksCount: number;
  taskCompletionRate: number;
  formattedValue: (val: number) => string;
  t: (key: string) => string;
}

export default function StatCards({
  isDarkMode,
  totalIncome,
  totalExpense,
  budgetCap,
  completedTasksCount,
  totalTasksCount,
  taskCompletionRate,
  formattedValue,
  t
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Income Card */}
      <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-neutral-400">{t('totalIncome')}</span>
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-xl font-bold font-mono tracking-tight text-emerald-500">
          {formattedValue(totalIncome)}
        </div>
        <p className="text-[10px] text-neutral-400 mt-1">July overall accumulated revenues</p>
      </div>

      {/* Total Expenses Card */}
      <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-neutral-400">{t('totalExpenses')}</span>
          <TrendingDown className="w-4 h-4 text-red-500" />
        </div>
        <div className="text-xl font-bold font-mono tracking-tight text-red-500">
          {formattedValue(totalExpense)}
        </div>
        <p className="text-[10px] text-neutral-400 mt-1">July overall expenditures logged</p>
      </div>

      {/* Active Budget Card */}
      <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-neutral-400">{t('activeBudget')}</span>
          <Wallet className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-xl font-bold font-mono tracking-tight text-blue-500">
          {formattedValue(budgetCap)}
        </div>
        <div className="mt-2 w-full bg-neutral-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${totalExpense > budgetCap ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min(100, (totalExpense / budgetCap) * 100)}%` }}
          />
        </div>
        <p className="text-[9px] text-neutral-400 mt-1">
          {budgetCap > 0 ? Math.round((totalExpense / budgetCap) * 100) : 0}% expended of monthly cap
        </p>
      </div>

      {/* Task Completion Card */}
      <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-neutral-400">{t('taskCompletion')}</span>
          <CheckSquare className="w-4 h-4 text-purple-500" />
        </div>
        <div className="text-xl font-bold font-mono tracking-tight text-purple-500">
          {completedTasksCount} / {totalTasksCount}
        </div>
        <div className="mt-2 w-full bg-neutral-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${taskCompletionRate}%` }}
          />
        </div>
        <p className="text-[9px] text-neutral-400 mt-1">
          {taskCompletionRate}% daily productivity checklist completion
        </p>
      </div>
    </div>
  );
}
