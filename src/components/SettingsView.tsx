import React from 'react';

interface SettingsViewProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  language: 'my' | 'en';
  setLanguage: (val: 'my' | 'en') => void;
  onResetData: () => Promise<void>;
  t: (key: string) => string;
}

export default function SettingsView({
  isDarkMode,
  setIsDarkMode,
  language,
  setLanguage,
  onResetData,
  t
}: SettingsViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Application Controls */}
      <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">Language & Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>Primary Language / ဘာသာစကား</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('my')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  language === 'my'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isDarkMode
                    ? 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
                    : 'border-neutral-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Myanmar (မြန်မာဘာသာ)
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isDarkMode
                    ? 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
                    : 'border-neutral-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                English (US)
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>Theme Setting</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDarkMode(false)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  !isDarkMode
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                Light Theme
              </button>
              <button
                onClick={() => setIsDarkMode(true)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-neutral-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Dark Theme
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data controls */}
      <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">System Records & Ledger Reset</h3>
        <div className="space-y-4">
          <p className="text-xs text-neutral-400 leading-relaxed">
            Resetting active ledger transactions, productivity checklist statuses, and saving benchmarks restores KyatKeeper back to clean factory default state values. All custom inputs are wiped out of your local web sandbox.
          </p>
          <button
            onClick={onResetData}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            {t('resetData')}
          </button>
        </div>
      </div>
    </div>
  );
}
