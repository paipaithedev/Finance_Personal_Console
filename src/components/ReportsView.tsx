import React from 'react';
import {
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ReportsViewProps {
  isDarkMode: boolean;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  transactions: any[];
  getChartData: () => any[];
  formattedValue: (val: number) => string;
  t: (key: string) => string;
}

export default function ReportsView({
  isDarkMode,
  totalIncome,
  totalExpense,
  currentBalance,
  transactions,
  getChartData,
  formattedValue,
  t
}: ReportsViewProps) {
  return (
    <div className="space-y-6">
      {/* Financial Summary Breakdown */}
      <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">{t('allTimeSummary')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-xs text-neutral-400 uppercase font-mono tracking-wider block mb-1">Cumulative Revenues</span>
            <span className="text-2xl font-bold font-mono text-emerald-500">{formattedValue(totalIncome)}</span>
          </div>
          <div>
            <span className="text-xs text-neutral-400 uppercase font-mono tracking-wider block mb-1">Cumulative Outflows</span>
            <span className="text-2xl font-bold font-mono text-red-500">{formattedValue(totalExpense)}</span>
          </div>
          <div>
            <span className="text-xs text-neutral-400 uppercase font-mono tracking-wider block mb-1">Current Net Profitability</span>
            <span className={`text-2xl font-bold font-mono ${currentBalance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {formattedValue(currentBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Report Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Comparison */}
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
          <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">Monthly Comparative Volume</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#27272a' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'}`,
                    borderRadius: '8px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories composition chart */}
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
          <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">Expense Composition (by Sector)</h3>
          <div className="h-72 w-full flex items-center justify-center">
            {(() => {
              const categoriesMap: { [key: string]: number } = {};
              transactions
                .filter((tx) => tx.type === 'Expense')
                .forEach((tx) => {
                  categoriesMap[tx.category] = (categoriesMap[tx.category] || 0) + tx.amount;
                });

              const data = Object.keys(categoriesMap).map((key) => ({
                name: key,
                value: categoriesMap[key]
              }));

              const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6'];

              if (data.length === 0) {
                return <p className="text-xs text-neutral-500">No expense records available to compile breakdown chart.</p>;
              }

              return (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formattedValue(value)}
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
                        border: `1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
                  </PieChart>
                </ResponsiveContainer>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
