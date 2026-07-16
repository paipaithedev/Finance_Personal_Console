import React from 'react';

// Import custom state management hook
import { useFinanceState } from './hooks/useFinanceState';

// Import pure utility helpers for calculations and formatters
import {
  formattedValue,
  calculateFinanceMetrics,
  calculateTaskStats,
  generateChartData
} from './utils/financeHelpers';

// Import modular viewport components
import AuthGateway from './components/AuthGateway';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import StatCards from './components/StatCards';
import AnalyticsChart from './components/AnalyticsChart';
import TasksWorkspace from './components/TasksWorkspace';
import TransactionsTable from './components/TransactionsTable';
import TransactionsView from './components/TransactionsView';
import BudgetsView from './components/BudgetsView';
import SavingsView from './components/SavingsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';

// Import custom toast component
import ToastContainer from './components/Toast';

export default function App() {
  // Destructure state, loaders, sync status, and handlers from the custom state hook
  const {
    toasts,
    removeToast,
    isAuthenticated,
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
  } = useFinanceState();

  // ------------------------------------------
  // CALCULATED METRICS
  // ------------------------------------------
  const { totalIncome, totalExpense, currentBalance } = calculateFinanceMetrics(transactions);
  const { completedTasksCount, totalTasksCount, taskCompletionRate } = calculateTaskStats(tasks);
  const chartData = generateChartData(transactions);

  // ------------------------------------------
  // LOGIN / AUTHENTICATION GATEWAY
  // ------------------------------------------
  if (!isAuthenticated) {
    return (
      <>
        <AuthGateway
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          language={language}
          setLanguage={setLanguage}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          isRegistering={isRegistering}
          setIsRegistering={setIsRegistering}
          handleAuth={handleAuth}
          handleGuestLogin={handleGuestLogin}
          t={t}
        />
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </>
    );
  }

  // ------------------------------------------
  // PRIMARY DASHBOARD LAYOUT & VIEWPORTS
  // ------------------------------------------
  return (
    <div className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-300 ${isDarkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* SIDEBAR Component */}
      <Sidebar
        isDarkMode={isDarkMode}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
        t={t}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* HEADER Component */}
        <TopHeader
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          language={language}
          setLanguage={setLanguage}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentView={currentView}
          currentBalance={currentBalance}
          formattedValue={formattedValue}
          t={t}
        />

        {/* WORKSPACE AREA */}
        <main className="p-4 md:p-6 grow space-y-6">
          {/* Mobile Balance Bar */}
          <div className={`sm:hidden p-4 rounded-xl border flex justify-between items-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
            <span className="text-xs font-semibold text-neutral-400">{t('activeBalance')}</span>
            <span className={`text-base font-mono font-bold ${currentBalance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {formattedValue(currentBalance)}
            </span>
          </div>

          {/* LOADING STATUS SPINNER */}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="ml-2.5 text-xs font-mono text-neutral-400">Syncing database changes...</span>
            </div>
          )}

          {/* DYNAMIC VIEWS ROUTER */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards component */}
              <StatCards
                isDarkMode={isDarkMode}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                budgetCap={budgetCap}
                completedTasksCount={completedTasksCount}
                totalTasksCount={totalTasksCount}
                taskCompletionRate={taskCompletionRate}
                formattedValue={formattedValue}
                t={t}
              />

              {/* Middle Row: Recharts Area Chart & Tasks checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Area Chart Component */}
                <AnalyticsChart
                  isDarkMode={isDarkMode}
                  chartData={chartData}
                  t={t}
                />

                {/* Checklist Component */}
                <TasksWorkspace
                  isDarkMode={isDarkMode}
                  tasks={tasks}
                  toggleTask={toggleTask}
                  handleAddTask={handleAddTask}
                  newTaskTitle={newTaskTitle}
                  setNewTaskTitle={setNewTaskTitle}
                  newTaskPriority={newTaskPriority}
                  setNewTaskPriority={setNewTaskPriority}
                  t={t}
                />
              </div>

              {/* Bottom Row component: Recent Transactions & Savings Goals */}
              <TransactionsTable
                isDarkMode={isDarkMode}
                transactions={transactions}
                savingsGoals={savingsGoals}
                setCurrentView={setCurrentView}
                formattedValue={formattedValue}
                t={t}
              />
            </div>
          )}

          {/* VIEW: TRANSACTIONS (LEDGER AUDIT) */}
          {currentView === 'transactions' && (
            <TransactionsView
              isDarkMode={isDarkMode}
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              formattedValue={formattedValue}
              t={t}
            />
          )}

          {/* VIEW: BUDGETS CEILINGS */}
          {currentView === 'budgets' && (
            <BudgetsView
              isDarkMode={isDarkMode}
              budgetCap={budgetCap}
              setBudgetCap={setBudgetCap}
              categoryBudgets={categoryBudgets}
              setCategoryBudgets={setCategoryBudgets}
              totalExpense={totalExpense}
              transactions={transactions}
              formattedValue={formattedValue}
              t={t}
            />
          )}

          {/* VIEW: SAVINGS RESERVES */}
          {currentView === 'savings' && (
            <SavingsView
              savingsGoals={savingsGoals}
              onAddGoal={handleAddGoal}
              onContribute={contributeSavings}
              onDeleteGoal={deleteGoal}
              isDarkMode={isDarkMode}
              formattedValue={formattedValue}
              t={t}
            />
          )}

          {/* VIEW: DAILY TASKS */}
          {currentView === 'tasks' && (
            <div className="max-w-2xl mx-auto">
              <TasksWorkspace
                isDarkMode={isDarkMode}
                tasks={tasks}
                toggleTask={toggleTask}
                handleAddTask={handleAddTask}
                newTaskTitle={newTaskTitle}
                setNewTaskTitle={setNewTaskTitle}
                newTaskPriority={newTaskPriority}
                setNewTaskPriority={setNewTaskPriority}
                t={t}
              />
            </div>
          )}

          {/* VIEW: REPORTS */}
          {currentView === 'reports' && (
            <ReportsView
              isDarkMode={isDarkMode}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              currentBalance={currentBalance}
              transactions={transactions}
              getChartData={() => chartData}
              formattedValue={formattedValue}
              t={t}
            />
          )}

          {/* VIEW: SETTINGS */}
          {currentView === 'settings' && (
            <SettingsView
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              language={language}
              setLanguage={setLanguage}
              onResetData={handleResetData}
              t={t}
            />
          )}
        </main>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
