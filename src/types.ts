export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'Income' | 'Expense';
}

export interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Low';
  completed: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  category: string;
}

export interface ChartMonth {
  name: string;
  Income: number;
  Expense: number;
}
