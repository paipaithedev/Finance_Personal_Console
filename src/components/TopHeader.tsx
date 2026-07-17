import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';

interface TopHeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  language: 'my' | 'en';
  setLanguage: (lang: 'my' | 'en') => void;
  setIsMobileMenuOpen: (val: boolean) => void;
  currentView: string;
  currentBalance: number;
  formattedValue: (val: number) => string;
  t: (key: string) => string;
}

export default function TopHeader({
  isDarkMode,
  setIsDarkMode,
  language,
  setLanguage,
  setIsMobileMenuOpen,
  currentView,
  currentBalance,
  formattedValue,
  t
}: TopHeaderProps) {
  return (
    <header className={`h-16 border-b px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800 backdrop-blur-md' : 'bg-white/90 border-neutral-200 backdrop-blur-md'}`}>
      <div className="flex items-center gap-3">
        {/* Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`p-2 rounded-lg border transition-colors cursor-pointer md:hidden ${
            isDarkMode
              ? 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800'
              : 'border-neutral-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          title="Open Menu"
        >
          <Menu className="w-4 h-4" />
        </button>
        <h1 className="text-base md:text-lg font-bold tracking-tight text-neutral-800 dark:text-zinc-100">
          {t(currentView)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Balance Widget */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">{t('activeBalance')}</span>
          <span className={`text-sm font-mono font-bold ${currentBalance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {formattedValue(currentBalance)}
          </span>
        </div>

        <div className="h-6 w-[1px] bg-neutral-200 dark:bg-zinc-800 hidden sm:block"></div>

        {/* Language Selector */}
        <button
          onClick={() => setLanguage(language === 'my' ? 'en' : 'my')}
          className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-colors cursor-pointer ${isDarkMode ? 'border-zinc-950 text-zinc-300 hover:bg-zinc-800 border-zinc-800' : 'border-neutral-200 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          title="Change Language / ဘာသာစကားပြောင်းရန်"
        >
          {language === 'my' ? 'EN' : 'MY'}
        </button>

        {/* Dark Mode Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${isDarkMode ? 'border-zinc-800 bg-zinc-950 text-yellow-400 hover:bg-zinc-800' : 'border-neutral-200 bg-slate-100 text-slate-650 hover:bg-slate-200'}`}
          title="Toggle Dark Mode / အလင်းအမှောင်ပြောင်းရန်"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
