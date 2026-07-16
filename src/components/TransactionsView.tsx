import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface TransactionItem {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'Income' | 'Expense';
}

interface TransactionsViewProps {
  isDarkMode: boolean;
  transactions: TransactionItem[];
  onAddTransaction: (tx: { description: string; amount: number; type: 'Income' | 'Expense'; category: string; date: string }) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
  formattedValue: (val: number) => string;
  t: (key: string) => string;
}

export default function TransactionsView({
  isDarkMode,
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  formattedValue,
  t
}: TransactionsViewProps) {
  // Form States
  const [newTxDesc, setNewTxDesc] = useState('');
  const [newTxAmount, setNewTxAmount] = useState('');
  const [newTxType, setNewTxType] = useState<'Income' | 'Expense'>('Expense');
  const [newTxCategory, setNewTxCategory] = useState('Meals');
  const [newTxDate, setNewTxDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxDesc || !newTxAmount) return;

    await onAddTransaction({
      description: newTxDesc,
      amount: Math.abs(parseFloat(newTxAmount)),
      type: newTxType,
      category: newTxCategory,
      date: newTxDate
    });

    // Reset inputs
    setNewTxDesc('');
    setNewTxAmount('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form to Record Entry */}
      <div className={`p-6 rounded-xl border h-fit ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">{t('addTransaction')}</h3>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>{t('description')}</label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Production Host"
              value={newTxDesc}
              onChange={(e) => setNewTxDesc(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-neutral-200 text-slate-800'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>{t('type')}</label>
              <select
                value={newTxType}
                onChange={(e) => setNewTxType(e.target.value as any)}
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-white border-neutral-200 text-slate-700'}`}
              >
                <option value="Expense">{t('expense')}</option>
                <option value="Income">{t('income')}</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>{t('category')}</label>
              <select
                value={newTxCategory}
                onChange={(e) => setNewTxCategory(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-white border-neutral-200 text-slate-700'}`}
              >
                <option value="Salary">Salary / Revenue</option>
                <option value="Meals">Meals / Food</option>
                <option value="Utilities">Utilities / Fiber</option>
                <option value="Software">Software Licenses</option>
                <option value="Health">Health & Wellness</option>
                <option value="Equipment">Business Equipment</option>
                <option value="Leisure">Entertainment & Travel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>{t('amount')} (MMK)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="MMK magnitude"
                value={newTxAmount}
                onChange={(e) => setNewTxAmount(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-neutral-200 text-slate-800'}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>{t('date')}</label>
              <input
                type="date"
                required
                value={newTxDate}
                onChange={(e) => setNewTxDate(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-neutral-200 text-slate-800'}`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer"
          >
            Commit Log Entry
          </button>
        </form>
      </div>

      {/* Transactions Ledger Panel */}
      <div className={`lg:col-span-2 p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">{t('allTransactions')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-mono uppercase text-[10px] tracking-wider ${isDarkMode ? 'border-zinc-800 text-zinc-500' : 'border-neutral-200 text-slate-400'}`}>
                <th className="pb-3 font-semibold">{t('date')}</th>
                <th className="pb-3 font-semibold">{t('description')}</th>
                <th className="pb-3 font-semibold">{t('category')}</th>
                <th className="pb-3 font-semibold text-right">{t('amount')}</th>
                <th className="pb-3 text-center w-12"></th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-zinc-800/40' : 'divide-neutral-100'}`}>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500">{t('noTransactions')}</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-neutral-50/50 dark:hover:bg-zinc-950/20">
                    <td className="py-3.5 font-mono text-[11px] text-neutral-500">{tx.date}</td>
                    <td className="py-3.5 font-medium text-neutral-800 dark:text-zinc-200">{tx.description}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-neutral-250 text-slate-600'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className={`py-3.5 text-right font-mono font-bold ${tx.type === 'Income' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {tx.type === 'Income' ? '+' : '-'}{formattedValue(tx.amount)}
                    </td>
                    <td className="py-3.5 text-center">
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1 rounded text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
