import { Transaction, Task, SavingsGoal } from '../types';

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', date: '2026-07-14', description: 'Monthly Salary / SaaS Income', category: 'Salary', amount: 1500000, type: 'Income' },
  { id: 'tx-2', date: '2026-07-13', description: 'Weekly Groceries Store', category: 'Meals', amount: 120000, type: 'Expense' },
  { id: 'tx-3', date: '2026-07-12', description: 'Office Internet High-Speed Bill', category: 'Utilities', amount: 55000, type: 'Expense' },
  { id: 'tx-4', date: '2026-07-10', description: 'Freelance Mobile App Design', category: 'Salary', amount: 850000, type: 'Income' },
  { id: 'tx-5', date: '2026-07-08', description: 'Dental Clinic Dental Checkup', category: 'Health', amount: 90000, type: 'Expense' }
];

export const DEFAULT_TASKS: Task[] = [
  { id: 'task-1', title: 'Review June quarterly ledger audit logs', priority: 'High', completed: false },
  { id: 'task-2', title: 'Settle office co-working rent fee', priority: 'High', completed: true },
  { id: 'task-3', title: 'Update production server environment scripts', priority: 'Low', completed: false },
  { id: 'task-4', title: 'Automate weekly database backup snapshots', priority: 'Low', completed: true },
  { id: 'task-5', title: 'Issue client invoice for cloud integration', priority: 'High', completed: false }
];

export const DEFAULT_SAVINGS: SavingsGoal[] = [
  { id: 'save-1', name: 'Emergency Contingency Reserve', target: 5000000, current: 3500000, category: 'Security' },
  { id: 'save-2', name: 'Premium Server Hardware Rig', target: 3000000, current: 1200000, category: 'Equipment' }
];
