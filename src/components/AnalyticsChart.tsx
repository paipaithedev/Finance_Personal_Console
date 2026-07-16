import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsChartProps {
  isDarkMode: boolean;
  chartData: any[];
  t: (key: string) => string;
}

export default function AnalyticsChart({
  isDarkMode,
  chartData,
  t
}: AnalyticsChartProps) {
  return (
    <div className={`md:col-span-1 lg:col-span-2 p-4 md:p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
      <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">{t('incomeVsExpenses')}</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#27272a' : '#f1f5f9'} />
            <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
            <YAxis stroke="#888888" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'}`,
                borderRadius: '8px',
                color: isDarkMode ? '#f4f4f5' : '#1e293b'
              }}
            />
            <Area type="monotone" dataKey="Income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
            <Area type="monotone" dataKey="Expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
