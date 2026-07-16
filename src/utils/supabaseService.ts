import { supabase } from './supabaseClient';
import { Transaction, Task, SavingsGoal } from '../types';

export const supabaseService = {
  // 1. Transactions API
  async fetchTransactions(userId: string | null): Promise<Transaction[]> {
    if (!userId) return [];
    try {
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (txError) {
        console.error('Error fetching transactions: ' + (txError.message || JSON.stringify(txError)));
        return JSON.parse(localStorage.getItem('fallback_transactions') || '[]');
      }
      return txData || [];
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      return JSON.parse(localStorage.getItem('fallback_transactions') || '[]');
    }
  },

  async insertTransaction(record: any): Promise<{ success: boolean; error?: any }> {
    const { error } = await supabase.from('transactions').insert(record);
    if (error) {
      console.error('Error inserting transaction:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  async deleteTransaction(id: string): Promise<{ success: boolean; error?: any }> {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      return { success: false, error };
    }
    return { success: true };
  },

  // 2. Tasks API
  async fetchTasks(userId: string | null): Promise<Task[]> {
    if (!userId) return [];
    try {
      const { data: tData, error: tError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (tError) {
        console.error('Error fetching tasks: ' + (tError.message || JSON.stringify(tError)));
        return JSON.parse(localStorage.getItem('fallback_tasks') || '[]');
      }
      return tData || [];
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      return JSON.parse(localStorage.getItem('fallback_tasks') || '[]');
    }
  },

  async insertTask(task: any): Promise<{ success: boolean; error?: any }> {
    const { error } = await supabase.from('tasks').insert(task);
    if (error) {
      console.error('Error adding task:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  async updateTask(id: string, completed: boolean): Promise<{ success: boolean; error?: any }> {
    const { error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', id);

    if (error) {
      return { success: false, error };
    }
    return { success: true };
  },

  async deleteTask(id: string): Promise<{ success: boolean; error?: any }> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      return { success: false, error };
    }
    return { success: true };
  },

  // 3. Savings Goals API
  async fetchSavingsGoals(userId: string | null): Promise<SavingsGoal[]> {
    if (!userId) return [];
    try {
      const { data: sData, error: sError } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId);

      if (sError) {
        console.error('Error fetching savings goals: ' + (sError.message || JSON.stringify(sError)));
        return JSON.parse(localStorage.getItem('fallback_savings_goals') || '[]');
      }
      return sData || [];
    } catch (err) {
      console.error('Failed to fetch savings goals:', err);
      return JSON.parse(localStorage.getItem('fallback_savings_goals') || '[]');
    }
  },

  async insertSavingsGoal(goal: any): Promise<{ success: boolean; error?: any }> {
    const { error } = await supabase.from('savings_goals').insert(goal);
    if (error) {
      console.error('Error creating savings goal:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  async updateSavingsGoalCurrent(id: string, current: number): Promise<{ success: boolean; error?: any }> {
    const { error } = await supabase
      .from('savings_goals')
      .update({ current })
      .eq('id', id);

    if (error) {
      return { success: false, error };
    }
    return { success: true };
  },

  async deleteSavingsGoal(id: string): Promise<{ success: boolean; error?: any }> {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id);
    if (error) {
      return { success: false, error };
    }
    return { success: true };
  },

  // 4. Settings API (Budget Cap / Category Budgets)
  async fetchSetting(userId: string | null, key: string, fallbackStorageKey: string, defaultValue: string): Promise<string> {
    if (!userId) return localStorage.getItem(fallbackStorageKey) || defaultValue;
    try {
      const { data: settingData, error: settingError } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .eq('key', key)
        .maybeSingle();

      if (settingError) {
        console.error(`Error fetching settings for ${key}: ` + (settingError.message || JSON.stringify(settingError)));
        return localStorage.getItem(fallbackStorageKey) || defaultValue;
      } else if (settingData) {
        return settingData.value;
      } else {
        return localStorage.getItem(fallbackStorageKey) || defaultValue;
      }
    } catch (err) {
      console.error(`Failed to fetch setting ${key}:`, err);
      return localStorage.getItem(fallbackStorageKey) || defaultValue;
    }
  },

  async saveSetting(userId: string | null, key: string, value: string): Promise<{ success: boolean; error?: any }> {
    if (!userId) return { success: false, error: 'No authenticated user' };
    try {
      const { error } = await supabase.from('settings').upsert({ user_id: userId, key, value });
      if (error) {
        console.error(`Error saving setting ${key} with user_id:`, error);
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      console.error(`Failed to save setting ${key}:`, err);
      return { success: false, error: err };
    }
  },

  // 5. System Reset & Seed API
  async resetAllUserData(userId: string | null, seededTx: any[], seededTasks: any[], seededSavings: any[]): Promise<{ success: boolean; error?: any }> {
    if (!userId) {
      return { success: false, error: 'No authenticated user' };
    }

    try {
      const safeDelete = async (tableName: string) => {
        const { error } = await supabase.from(tableName).delete().eq('user_id', userId);
        if (error) {
          console.error(`Delete failed on ${tableName}:`, error);
          throw error;
        }
      };

      const safeInsert = async (tableName: string, records: any[]) => {
        if (records.length === 0) return;

        const recordsToInsert = records.map(r => ({ ...r, user_id: userId }));
        const { error } = await supabase.from(tableName).insert(recordsToInsert);
        if (error) {
          console.error(`Insert failed on ${tableName}:`, error);
          throw error;
        }
      };

      // Delete existing records
      await safeDelete('transactions');
      await safeDelete('tasks');
      await safeDelete('savings_goals');
      
      // Delete settings
      const { error: settingsDeleteError } = await supabase.from('settings').delete().eq('user_id', userId);
      if (settingsDeleteError) {
        console.error('Delete settings failed:', settingsDeleteError);
        throw settingsDeleteError;
      }

      // Insert fresh seed records
      await safeInsert('transactions', seededTx);
      await safeInsert('tasks', seededTasks);
      await safeInsert('savings_goals', seededSavings);

      // Insert standard default settings
      const settingsToInsert = [
        { key: 'budgetCap', value: '1500000' },
        { 
          key: 'categoryBudgets', 
          value: JSON.stringify({
            Meals: 300000,
            Utilities: 150000,
            Software: 200000,
            Health: 150000,
            Equipment: 400000,
            Leisure: 300000
          }) 
        }
      ];

      const settingsWithUser = settingsToInsert.map(s => ({ ...s, user_id: userId }));
      const { error: settingsError } = await supabase.from('settings').insert(settingsWithUser);
      if (settingsError) {
        console.error('Insert settings failed:', settingsError);
        throw settingsError;
      }

      return { success: true };
    } catch (err) {
      console.error('Failed to reset user data in Supabase:', err);
      return { success: false, error: err };
    }
  }
};
