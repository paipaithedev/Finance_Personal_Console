import { Transaction, Task, ChartMonth } from '../types';

/**
 * Format a number value to currency with standard formatting + MMK suffix
 */
export const formattedValue = (val: number): string => {
  return new Intl.NumberFormat('en-US').format(val) + ' MMK';
};

/**
 * Calculate standard financial metrics based on the current transaction list
 */
export const calculateFinanceMetrics = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter((tx) => tx.type === 'Income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === 'Expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    currentBalance,
  };
};

/**
 * Calculate task statistics based on the tasks list
 */
export const calculateTaskStats = (tasks: Task[]) => {
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const totalTasksCount = tasks.length;
  const taskCompletionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return {
    completedTasksCount,
    totalTasksCount,
    taskCompletionRate,
  };
};

/**
 * Aggregates comparative transaction volumes for the last 6 months
 */
export const generateChartData = (transactions: Transaction[]): ChartMonth[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result: ChartMonth[] = [];
  const now = new Date();
  
  // Generate last 6 months dynamically based on the current date
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = months[d.getMonth()];
    const yearStr = d.getFullYear().toString();
    const monthStr = (d.getMonth() + 1).toString().padStart(2, '0');
    const yearMonthPattern = `${yearStr}-${monthStr}`; // e.g. "2026-07"
    
    const income = transactions
      .filter((tx) => tx.type === 'Income' && tx.date.startsWith(yearMonthPattern))
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const expense = transactions
      .filter((tx) => tx.type === 'Expense' && tx.date.startsWith(yearMonthPattern))
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    result.push({
      name: monthLabel,
      Income: income || 0,
      Expense: expense || 0
    });
  }
  
  return result;
};
