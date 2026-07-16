import React from 'react';

interface TransactionItem {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'Income' | 'Expense';
}

interface SavingsGoalItem {
  id: string;
  name: string;
  target: number;
  current: number;
  category: string;
}

interface TransactionsTableProps {
  isDarkMode: boolean;
  transactions: TransactionItem[];
  savingsGoals: SavingsGoalItem[];
  setCurrentView: (view: string) => void;
  formattedValue: (val: number) => string;
  t: (key: string) => string;
}

export default function TransactionsTable({
  isDarkMode,
  transactions,
  savingsGoals,
  setCurrentView,
  formattedValue,
  t
}: TransactionsTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Recent Transactions Table */}
      <div className={`md:col-span-1 lg:col-span-2 p-4 md:p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold tracking-tight font-mono uppercase text-neutral-400">{t('recentTransactions')}</h3>
          <button
            onClick={() => setCurrentView('transactions')}
            className="text-xs text-blue-500 hover:underline font-semibold cursor-pointer"
          >
            View Ledger Operations
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-mono uppercase text-[10px] tracking-wider ${isDarkMode ? 'border-zinc-800 text-zinc-500' : 'border-neutral-200 text-slate-400'}`}>
                <th className="pb-3 font-semibold">{t('date')}</th>
                <th className="pb-3 font-semibold">{t('description')}</th>
                <th className="pb-3 font-semibold">{t('category')}</th>
                <th className="pb-3 font-semibold text-right">{t('amount')}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-zinc-800/40' : 'divide-neutral-100'}`}>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-neutral-500">{t('noTransactions')}</td>
                </tr>
              ) : (
                transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-50/50 dark:hover:bg-zinc-950/20">
                    <td className="py-3 font-mono text-[11px] text-neutral-500">{tx.date}</td>
                    <td className="py-3 font-medium text-neutral-800 dark:text-zinc-200">{tx.description}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-neutral-250 text-slate-600'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className={`py-3 text-right font-mono font-bold ${tx.type === 'Income' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {tx.type === 'Income' ? '+' : '-'}{formattedValue(tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Savings Goals progress bars */}
      <div className={`p-4 md:p-6 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <div>
          <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">{t('savingsGoals')}</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
            {savingsGoals.length === 0 ? (
              <p className="text-xs text-neutral-500 py-4 text-center">{t('noGoals')}</p>
            ) : (
              savingsGoals.map((goal) => {
                const percent = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0;
                return (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-neutral-700 dark:text-zinc-300">{goal.name}</span>
                      <span className="font-mono font-bold text-blue-500">{percent}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                      <span>{formattedValue(goal.current)}</span>
                      <span>Target: {formattedValue(goal.target)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <button
          onClick={() => setCurrentView('savings')}
          className="w-full py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer mt-4"
        >
          Manage Saving Reserves
        </button>
      </div>
    </div>
  );
}
