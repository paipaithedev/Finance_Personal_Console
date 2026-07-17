import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  PiggyBank,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isDarkMode: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  handleLogout: () => void;
  t: (key: string) => string;
}

export default function Sidebar({
  isDarkMode,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  currentView,
  setCurrentView,
  handleLogout,
  t
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'transactions', label: t('transactions'), icon: <Receipt className="w-4 h-4" /> },
    { id: 'budgets', label: t('budgets'), icon: <Wallet className="w-4 h-4" /> },
    { id: 'savings', label: t('savings'), icon: <PiggyBank className="w-4 h-4" /> },
    { id: 'tasks', label: t('tasks'), icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'reports', label: t('reports'), icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: t('settings'), icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        {/* App Branding */}
        <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-zinc-800' : 'border-neutral-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-mono text-white font-bold text-lg">
              W
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block font-sans">WalletWise</span>
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">Personal Finance Dashboard</span>
            </div>
          </div>
          {/* Close button on Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer md:hidden ${
              isDarkMode
                ? 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
                : 'border-neutral-200 bg-slate-100 text-slate-650 hover:bg-slate-200'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDarkMode
                  ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout area at sidebar footer */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-neutral-200'}`}>
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              isDarkMode
                ? 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-850 hover:text-red-400'
                : 'border-neutral-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-red-650'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
