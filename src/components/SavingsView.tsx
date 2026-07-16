import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  category: string;
}

interface SavingsViewProps {
  savingsGoals: SavingsGoal[];
  onAddGoal: (goal: { name: string; target: number; current: number; category: string }) => Promise<void>;
  onContribute: (id: string, amount: number) => Promise<void>;
  onDeleteGoal: (id: string) => Promise<void>;
  isDarkMode: boolean;
  formattedValue: (val: number) => string;
  t: (key: string) => string;
}

export default function SavingsView({
  savingsGoals,
  onAddGoal,
  onContribute,
  onDeleteGoal,
  isDarkMode,
  formattedValue,
  t
}: SavingsViewProps) {
  // Form States
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalCurrent, setNewGoalCurrent] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('General');
  const [savingContributions, setSavingContributions] = useState<Record<string, string>>({});

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName || !newGoalTarget) return;

    await onAddGoal({
      name: newGoalName,
      target: parseFloat(newGoalTarget),
      current: parseFloat(newGoalCurrent || '0'),
      category: newGoalCategory
    });

    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalCurrent('');
  };

  const handleContributeSubmit = async (id: string) => {
    const amountStr = savingContributions[id];
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    await onContribute(id, amount);
    setSavingContributions({ ...savingContributions, [id]: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add Savings Goal */}
      <div className={`p-6 rounded-xl border h-fit ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">{t('addGoal')}</h3>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>Goal Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Dream Retreat Resort"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-neutral-200 text-slate-800'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>Target (MMK)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="Target MMK"
                value={newGoalTarget}
                onChange={(e) => setNewGoalTarget(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-neutral-200 text-slate-800'}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>Current (MMK)</label>
              <input
                type="number"
                min="0"
                placeholder="Initial MMK"
                value={newGoalCurrent}
                onChange={(e) => setNewGoalCurrent(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-neutral-200 text-slate-800'}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>Goal Category</label>
            <select
              value={newGoalCategory}
              onChange={(e) => setNewGoalCategory(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-lg border outline-none cursor-pointer ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-white border-neutral-200 text-slate-700'}`}
            >
              <option value="General">General Reserves</option>
              <option value="Security">Financial Security</option>
              <option value="Equipment">Tech Hardware</option>
              <option value="Property">Real Estate</option>
              <option value="Business">Business Venture</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer"
          >
            Set Savings Target
          </button>
        </form>
      </div>

      {/* Active list with quick contribute option */}
      <div className="lg:col-span-2 space-y-4">
        {savingsGoals.length === 0 ? (
          <div className={`p-6 rounded-xl border text-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
            <p className="text-xs text-neutral-500">{t('noGoals')}</p>
          </div>
        ) : (
          savingsGoals.map((goal) => {
            const percent = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0;
            return (
              <div key={goal.id} className={`p-6 rounded-xl border space-y-4 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-neutral-250 text-slate-600'
                    }`}>
                      {goal.category}
                    </span>
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-zinc-100 mt-2">{goal.name}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1 rounded text-neutral-400 hover:text-red-500 cursor-pointer"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-neutral-400">Total Progress Level</span>
                    <span className="font-bold text-blue-500">{percent}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                    <span>Saved: {formattedValue(goal.current)}</span>
                    <span>Target Goal: {formattedValue(goal.target)}</span>
                  </div>
                </div>

                {/* Contribution trigger */}
                <div className="pt-4 border-t border-neutral-100 dark:border-zinc-800 flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-400">Contribute:</span>
                  <input
                    type="number"
                    min="1000"
                    placeholder="Add MMK"
                    value={savingContributions[goal.id] || ''}
                    onChange={(e) => setSavingContributions({ ...savingContributions, [goal.id]: e.target.value })}
                    className={`px-3 py-1 text-xs rounded-lg border outline-none w-32 ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-neutral-200 text-slate-800'
                    }`}
                  />
                  <button
                    onClick={() => handleContributeSubmit(goal.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Add Fund
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
