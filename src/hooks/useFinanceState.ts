import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { supabaseService } from '../utils/supabaseService';
import { translations } from '../utils/translations';
import { DEFAULT_TRANSACTIONS, DEFAULT_TASKS, DEFAULT_SAVINGS } from '../utils/constants';
import { Transaction, Task, SavingsGoal } from '../types';
import { ToastItem } from '../components/Toast';

export function useFinanceState() {
  // ------------------------------------------
  // TOAST NOTIFICATIONS STATE & HELPERS
  // ------------------------------------------
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ------------------------------------------
  // PERSISTENT STATES
  // ------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('fin_theme') === 'dark';
  });

  const [language, setLanguage] = useState<'my' | 'en'>(() => {
    return (localStorage.getItem('fin_lang') as 'my' | 'en') || 'my';
  });

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [budgetCap, setBudgetCap] = useState<number>(() => {
    return Number(localStorage.getItem('fallback_budget_cap') || '1500000');
  });

  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('fallback_category_budgets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      Meals: 300000,
      Utilities: 150000,
      Software: 200000,
      Health: 150000,
      Equipment: 400000,
      Leisure: 300000
    };
  });
  const [hasFetchedSettings, setHasFetchedSettings] = useState<boolean>(false);

  // Auth Inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Adding Task Inputs
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Low'>('High');

  // ------------------------------------------
  // SIDE-EFFECTS & SYNCING
  // ------------------------------------------
  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fin_theme', 'light');
    }
  }, [isDarkMode]);

  // Handle Language
  useEffect(() => {
    localStorage.setItem('fin_lang', language);
  }, [language]);

  // Check initial Auth session & listen to auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync state with Supabase when authenticated
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch transactions
        const finalTx = await supabaseService.fetchTransactions(userId);
        setTransactions(finalTx);
        localStorage.setItem('fallback_transactions', JSON.stringify(finalTx));

        // 2. Fetch tasks
        const finalTasks = await supabaseService.fetchTasks(userId);
        setTasks(finalTasks);
        localStorage.setItem('fallback_tasks', JSON.stringify(finalTasks));

        // 3. Fetch savings goals
        const finalSavings = await supabaseService.fetchSavingsGoals(userId);
        setSavingsGoals(finalSavings);
        localStorage.setItem('fallback_savings_goals', JSON.stringify(finalSavings));

        // 4. Fetch budget cap setting
        const budgetCapStr = await supabaseService.fetchSetting(userId, 'budgetCap', 'fallback_budget_cap', '1500000');
        const finalBudgetCap = Number(budgetCapStr);
        setBudgetCap(finalBudgetCap);
        localStorage.setItem('fallback_budget_cap', String(finalBudgetCap));

        // 5. Fetch category budgets setting
        const defaultCategoryBudgetsStr = JSON.stringify({
          Meals: 300000,
          Utilities: 150000,
          Software: 200000,
          Health: 150000,
          Equipment: 400000,
          Leisure: 300000
        });
        const catBudgetsStr = await supabaseService.fetchSetting(userId, 'categoryBudgets', 'fallback_category_budgets', defaultCategoryBudgetsStr);
        try {
          const finalCategoryBudgets = JSON.parse(catBudgetsStr);
          setCategoryBudgets(finalCategoryBudgets);
          localStorage.setItem('fallback_category_budgets', JSON.stringify(finalCategoryBudgets));
        } catch (e) {
          console.error('Failed to parse fetched category budgets:', e);
        }

        setHasFetchedSettings(true);
      } catch (err) {
        console.error('Failed to sync with Supabase:', err);
        setHasFetchedSettings(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, userId]);

  // Save budget settings to Supabase settings with a 500ms debounce
  useEffect(() => {
    const saveBudget = setTimeout(async () => {
      localStorage.setItem('fallback_budget_cap', String(budgetCap));
      localStorage.setItem('fallback_category_budgets', JSON.stringify(categoryBudgets));

      if (!isAuthenticated || !userId || !hasFetchedSettings) return;

      // Save budgetCap
      await supabaseService.saveSetting(userId, 'budgetCap', String(budgetCap));

      // Save categoryBudgets
      await supabaseService.saveSetting(userId, 'categoryBudgets', JSON.stringify(categoryBudgets));
    }, 500);

    return () => clearTimeout(saveBudget);
  }, [budgetCap, categoryBudgets, isAuthenticated, userId, hasFetchedSettings]);

  // ------------------------------------------
  // TRANSLATOR HELPER
  // ------------------------------------------
  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  // ------------------------------------------
  // AUTHENTICATION HANDLERS
  // ------------------------------------------
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;

    if (isRegistering) {
      const { error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
      });
      if (error) {
        showToast(`Registration failed: ${error.message}`, 'error');
        return;
      }
      setIsRegistering(false);
      showToast('Registration successful! Please confirm your email if required or log in now.', 'success');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });
      if (error) {
        if (error.message?.includes('Email not confirmed') || (error as any).code === 'email_not_confirmed') {
          showToast(`Login failed: Email not confirmed.\n\nPlease check your inbox/spam for a verification link, or disable "Confirm email" under Authentication -> Providers -> Email in your Supabase Dashboard to log in instantly.`, 'warning');
        } else {
          showToast(`Login failed: ${error.message}`, 'error');
        }
        return;
      }
      setIsAuthenticated(true);
      showToast('Successfully logged in!', 'success');
    }
  };

  const handleGuestLogin = async () => {
    showToast('Guest demo login is disabled in this build. Please register or log in with your own account.', 'info');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  // ------------------------------------------
  // FINANCIAL METRIC HANDLERS
  // ------------------------------------------
  const handleAddTransaction = async (tx: { description: string; amount: number; type: 'Income' | 'Expense'; category: string; date: string }) => {
    const record = {
      id: `tx-${Date.now()}`,
      ...tx,
      user_id: userId
    } as any;

    setTransactions([record, ...transactions]);

    const result = await supabaseService.insertTransaction(record);
    if (!result.success) {
      showToast(`Error saving transaction: ${result.error?.message || 'Unknown error'}`, 'error');
    } else {
      showToast(t('transactionRecorded'), 'success');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
    const result = await supabaseService.deleteTransaction(id);
    if (!result.success) {
      showToast(`Error deleting transaction: ${result.error?.message || 'Unknown error'}`, 'error');
    } else {
      showToast('Transaction deleted successfully.', 'info');
    }
  };

  // ------------------------------------------
  // TASK MANAGEMENT HANDLERS
  // ------------------------------------------
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      priority: newTaskPriority,
      completed: false,
    };

    const taskWithUser = {
      ...task,
      user_id: userId
    };

    setTasks([task, ...tasks]);
    setNewTaskTitle('');

    const result = await supabaseService.insertTask(taskWithUser);
    if (!result.success) {
      showToast(`Error adding task: ${result.error?.message || 'Unknown error'}`, 'error');
    } else {
      showToast(t('taskCreated'), 'success');
    }
  };

  const toggleTask = async (id: string) => {
    const taskToToggle = tasks.find((t) => t.id === id);
    if (!taskToToggle) return;

    const updatedCompleted = !taskToToggle.completed;

    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: updatedCompleted } : task))
    );

    const result = await supabaseService.updateTask(id, updatedCompleted);
    if (!result.success) {
      showToast(`Error updating task: ${result.error?.message || 'Unknown error'}`, 'error');
    } else {
      showToast(updatedCompleted ? 'Task marked as completed!' : 'Task active', 'info');
    }
  };

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    const result = await supabaseService.deleteTask(id);
    if (!result.success) {
      showToast(`Error deleting task: ${result.error?.message || 'Unknown error'}`, 'error');
    } else {
      showToast('Task removed successfully.', 'info');
    }
  };

  // ------------------------------------------
  // SAVINGS GOALS HANDLERS
  // ------------------------------------------
  const handleAddGoal = async (g: { name: string; target: number; current: number; category: string }) => {
    const goal: SavingsGoal = {
      id: `save-${Date.now()}`,
      ...g,
    };

    const goalWithUser = {
      ...goal,
      user_id: userId
    };

    setSavingsGoals([...savingsGoals, goal]);

    const result = await supabaseService.insertSavingsGoal(goalWithUser);
    if (!result.success) {
      showToast(`Error creating savings goal: ${result.error?.message || 'Unknown error'}`, 'error');
    } else {
      showToast('Savings goal created successfully!', 'success');
    }
  };

  const contributeSavings = async (id: string, amount: number) => {
    const goalToContribute = savingsGoals.find((g) => g.id === id);
    if (!goalToContribute) return;

    const updatedCurrent = Math.min(goalToContribute.target, goalToContribute.current + amount);

    setSavingsGoals(
      savingsGoals.map((goal) => {
         if (goal.id === id) {
            return { ...goal, current: updatedCurrent };
         }
         return goal;
       })
    );

    const result = await supabaseService.updateSavingsGoalCurrent(id, updatedCurrent);
    if (!result.success) {
      showToast(`Error contributing to savings: ${result.error?.message || 'Unknown error'}`, 'error');
    } else {
      showToast('Contribution saved successfully!', 'success');
    }
  };

  const deleteGoal = async (id: string) => {
    setSavingsGoals(savingsGoals.filter((g) => g.id !== id));
    const result = await supabaseService.deleteSavingsGoal(id);
    if (!result.success) {
      showToast(`Error deleting savings goal: ${result.error?.message || 'Unknown error'}`, 'error');
    } else {
      showToast('Savings goal removed.', 'info');
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Are you sure you want to reset all database records back to factory seeds?')) {
      setLoading(true);
      try {
        const seededTx = DEFAULT_TRANSACTIONS.map(tx => ({
          id: tx.id,
          date: tx.date,
          description: tx.description,
          category: tx.category,
          amount: tx.amount,
          type: tx.type
        }));

        const seededTasks = DEFAULT_TASKS.map((t, idx) => ({
          id: t.id,
          title: t.title,
          priority: t.priority,
          completed: t.completed,
          created_at: new Date(Date.now() - idx * 1000).toISOString()
        }));

        const seededSavings = DEFAULT_SAVINGS.map(s => ({
          id: s.id,
          name: s.name,
          target: s.target,
          current: s.current,
          category: s.category
        }));

        const result = await supabaseService.resetAllUserData(userId, seededTx, seededTasks, seededSavings);

        if (!result.success) {
          showToast(`Failed to reset database records: ${result.error?.message || 'Unknown error'}`, 'error');
        } else {
          setTransactions(DEFAULT_TRANSACTIONS);
          setTasks(DEFAULT_TASKS);
          setSavingsGoals(DEFAULT_SAVINGS);
          setBudgetCap(1500000);
          setCategoryBudgets({
            Meals: 300000,
            Utilities: 150000,
            Software: 200000,
            Health: 150000,
            Equipment: 400000,
            Leisure: 300000
          });

          // Sync local storage
          localStorage.setItem('fallback_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
          localStorage.setItem('fallback_tasks', JSON.stringify(DEFAULT_TASKS));
          localStorage.setItem('fallback_savings_goals', JSON.stringify(DEFAULT_SAVINGS));
          localStorage.setItem('fallback_budget_cap', '1500000');
          localStorage.setItem('fallback_category_budgets', JSON.stringify({
            Meals: 300000,
            Utilities: 150000,
            Software: 200000,
            Health: 150000,
            Equipment: 400000,
            Leisure: 300000
          }));

          showToast('Application database records reset successfully.', 'success');
        }
      } catch (err) {
        console.error('Failed to reset data:', err);
        showToast('Failed to reset database records.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    toasts,
    removeToast,
    isAuthenticated,
    userId,
    loading,
    isDarkMode,
    setIsDarkMode,
    language,
    setLanguage,
    currentView,
    setCurrentView,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    transactions,
    tasks,
    savingsGoals,
    budgetCap,
    setBudgetCap,
    categoryBudgets,
    setCategoryBudgets,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    isRegistering,
    setIsRegistering,
    newTaskTitle,
    setNewTaskTitle,
    newTaskPriority,
    setNewTaskPriority,
    t,
    handleAuth,
    handleGuestLogin,
    handleLogout,
    handleAddTransaction,
    handleDeleteTransaction,
    handleAddTask,
    toggleTask,
    deleteTask,
    handleAddGoal,
    contributeSavings,
    deleteGoal,
    handleResetData,
  };
}
