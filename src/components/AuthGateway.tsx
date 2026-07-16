import React from 'react';
import { User, Lock, Sun, Moon } from 'lucide-react';

interface AuthGatewayProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  language: 'my' | 'en';
  setLanguage: (lang: 'my' | 'en') => void;
  authEmail: string;
  setAuthEmail: (val: string) => void;
  authPassword: string;
  setAuthPassword: (val: string) => void;
  isRegistering: boolean;
  setIsRegistering: (val: boolean) => void;
  handleAuth: (e: React.FormEvent) => void;
  handleGuestLogin: () => void;
  t: (key: string) => string;
}

export default function AuthGateway({
  isDarkMode,
  setIsDarkMode,
  language,
  setLanguage,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  isRegistering,
  setIsRegistering,
  handleAuth,
  handleGuestLogin,
  t
}: AuthGatewayProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Language Toggle in Auth */}
        <button
          onClick={() => setLanguage(language === 'my' ? 'en' : 'my')}
          className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition-colors cursor-pointer ${isDarkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800' : 'border-neutral-200 bg-white text-neutral-600 hover:bg-slate-100'}`}
        >
          {language === 'my' ? 'EN' : 'မြန်မာ'}
        </button>
        {/* Dark Mode in Auth */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${isDarkMode ? 'border-zinc-800 bg-zinc-900 text-yellow-400 hover:bg-zinc-800' : 'border-neutral-200 bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className={`w-full max-w-md p-8 rounded-xl border transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2 leading-relaxed">
            {t('title')}
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            {isRegistering ? 'Register your private ledger credential' : 'Secure Enterprise Login Keyway'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
              {t('email')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-neutral-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="e.g. user@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-zinc-950 border-zinc-800 text-white focus:border-blue-500'
                    : 'bg-white border-neutral-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
              {t('password')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-neutral-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-zinc-950 border-zinc-800 text-white focus:border-blue-500'
                    : 'bg-white border-neutral-200 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            {isRegistering ? t('register') : t('login')}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className={`text-xs text-center transition-colors hover:underline ${isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Register Now"}
          </button>

          <div className={`relative flex py-2 items-center ${isDarkMode ? 'text-zinc-800' : 'text-slate-200'}`}>
            <div className="flex-grow border-t border-current"></div>
            <span className={`flex-shrink mx-4 text-xs font-mono font-bold ${isDarkMode ? 'text-zinc-600' : 'text-slate-400'}`}>OR</span>
            <div className="flex-grow border-t border-current"></div>
          </div>

          {/* Quick Guest Auto Fill Button */}
          <button
            onClick={handleGuestLogin}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            {t('guestLogin')}
          </button>
        </div>

      </div>
    </div>
  );
}
