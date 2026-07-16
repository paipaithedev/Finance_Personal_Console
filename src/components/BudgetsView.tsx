import React from 'react';
import { AlertCircle } from 'lucide-react';

interface BudgetsViewProps {
  isDarkMode: boolean;
  budgetCap: number;
  setBudgetCap: (val: number) => void;
  categoryBudgets: Record<string, number>;
  setCategoryBudgets: (val: Record<string, number>) => void;
  totalExpense: number;
  transactions: any[];
  formattedValue: (val: number) => string;
  t: (key: string) => string;
}

export default function BudgetsView({
  isDarkMode,
  budgetCap,
  setBudgetCap,
  categoryBudgets,
  setCategoryBudgets,
  totalExpense,
  transactions,
  formattedValue,
  t
}: BudgetsViewProps) {
  const sumOfCatBudgets = (Object.values(categoryBudgets) as number[]).reduce((a, b) => a + b, 0);
  const isOverMaster = sumOfCatBudgets > budgetCap;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Budget Configuration Column */}
      <div className="space-y-6 lg:col-span-1">
        {/* Master Budget Config */}
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
          <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">Master Budget</h3>
          <div className="space-y-5">
            <div>
              <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                {t('budgetCapText')}
              </label>
              
              {/* Precise Input & Display */}
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="number"
                  value={budgetCap}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setBudgetCap(isNaN(val) ? 0 : val);
                  }}
                  className={`w-full px-3 py-1.5 text-base font-bold font-mono rounded-lg border outline-none ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-blue-400' : 'bg-slate-50 border-neutral-200 text-blue-600'
                  }`}
                  placeholder="Enter custom budget"
                />
                <span className="text-xs font-mono text-neutral-400 shrink-0">MMK</span>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min="100000"
                max="10000000"
                step="50000"
                value={budgetCap}
                onChange={(e) => setBudgetCap(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                <span>100K MMK</span>
                <span>10M MMK</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider mb-2 text-neutral-400">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[500000, 1500000, 3000000, 5000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBudgetCap(preset)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border font-medium cursor-pointer transition-all ${
                      budgetCap === preset
                        ? 'bg-blue-500 text-white border-blue-500 shadow-sm shadow-blue-500/20'
                        : isDarkMode
                          ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                          : 'bg-slate-50 border-neutral-200 hover:border-neutral-300 text-slate-700'
                    }`}
                  >
                    {preset >= 1000000 ? `${preset / 1000000}M MMK` : `${preset / 1000}K MMK`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info and Tips */}
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
          <h4 className="text-xs font-bold font-mono uppercase text-neutral-400 mb-2">Budgeting Strategies</h4>
          <ul className="text-xs space-y-2 text-neutral-500 dark:text-neutral-400 list-disc pl-4 font-sans leading-relaxed">
            <li><strong>50/30/20 Rule:</strong> Allocate 50% for Needs, 30% for Wants, and 20% for Savings.</li>
            <li><strong>Zero-Based Budgeting:</strong> Give every single Kyat a job before the month starts.</li>
            <li>Always maintain at least <strong>10%</strong> buffer room for unplanned emergency utilities.</li>
          </ul>
        </div>
      </div>

      {/* Status & Category Budgets Column */}
      <div className="space-y-6 lg:col-span-2">
        {/* Status breakdown card */}
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
          <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">{t('activeBudget')}</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-sm mb-2 font-mono">
                <span className="text-neutral-500 dark:text-neutral-400">Consolidated Spent Level</span>
                <span className="font-bold">{formattedValue(totalExpense)} / {formattedValue(budgetCap)}</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${totalExpense > budgetCap ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${budgetCap > 0 ? Math.min(100, (totalExpense / budgetCap) * 100) : 0}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-neutral-400 mt-2 font-mono">
                <span>{budgetCap > 0 ? Math.round((totalExpense / budgetCap) * 100) : 0}% Used</span>
                <span>{formattedValue(Math.max(0, budgetCap - totalExpense))} remaining headroom</span>
              </div>
            </div>

            {totalExpense > budgetCap && (
              <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-500 uppercase font-mono tracking-wider">Ceiling Threshold Exceeded</h4>
                  <p className="text-xs text-red-400 mt-1">Consolidated ledger expenditures have breached the assigned monthly MMK budget cap. Consider tuning down luxury sectors.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Allocations card */}
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold tracking-tight font-mono uppercase text-neutral-400">Flexible Category Budgets</h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">Allocate and track custom budget allowances for individual sectors.</p>
            </div>
            <div className={`px-2.5 py-1 rounded text-right font-mono text-xs font-semibold ${
              isOverMaster ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
            }`}>
              Sum: {formattedValue(sumOfCatBudgets)} / {formattedValue(budgetCap)}
            </div>
          </div>

          {isOverMaster && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2.5 text-xs text-amber-500">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>The total sum of your category budget allocations exceeds your Master Budget Cap. Your actual spending warning will still trigger based on the Master Cap.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {['Meals', 'Utilities', 'Software', 'Health', 'Equipment', 'Leisure'].map((category) => {
              const spend = transactions
                .filter((tx) => tx.type === 'Expense' && tx.category === category)
                .reduce((sum, tx) => sum + tx.amount, 0);
              const limit = categoryBudgets[category] || 0;
              const percent = limit > 0 ? Math.round((spend / limit) * 100) : 0;
              
              let progressColor = 'bg-emerald-500';
              if (percent >= 100) progressColor = 'bg-red-500';
              else if (percent >= 75) progressColor = 'bg-amber-500';

              return (
                <div key={category} className={`p-4 rounded-lg border ${
                  isDarkMode ? 'bg-zinc-950/40 border-zinc-800/60' : 'bg-neutral-50/50 border-neutral-200/60'
                }`}>
                  <div className="flex justify-between items-center mb-1.5 font-mono text-xs">
                    <span className="font-semibold text-neutral-700 dark:text-zinc-300">{category}</span>
                    <span className="text-neutral-400">
                      {formattedValue(spend)} / {formattedValue(limit)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-neutral-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${limit > 0 ? Math.min(100, (spend / limit) * 100) : 0}%` }}
                    />
                  </div>

                  {/* Interactive Range Input & Number Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-neutral-400 font-mono">{percent}% of limit spent</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={limit}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setCategoryBudgets({
                              ...categoryBudgets,
                              [category]: isNaN(val) ? 0 : val
                            });
                          }}
                          className={`w-24 px-1.5 py-0.5 text-right font-mono text-xs font-bold rounded border ${
                            isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-neutral-200 text-slate-700'
                          }`}
                        />
                        <span className="text-[9px] font-mono text-neutral-400">MMK</span>
                      </div>
                    </div>
                    
                    <input
                      type="range"
                      min="0"
                      max="3000000"
                      step="25000"
                      value={limit}
                      onChange={(e) => {
                        setCategoryBudgets({
                          ...categoryBudgets,
                          [category]: parseFloat(e.target.value)
                        });
                      }}
                      className="w-full h-1 bg-neutral-200 dark:bg-zinc-800 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
