import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastProps) {
  return (
    <div 
      id="toast-container" 
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: (id: string) => void; key?: string }) {
  const { id, message, type } = toast;

  // Auto-close toast
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  // Icons configuration
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  // Styling based on type
  const styleMap = {
    success: 'bg-white dark:bg-zinc-900 border-emerald-500/30 text-zinc-900 dark:text-zinc-100 shadow-[0_4px_12px_rgba(16,185,129,0.12)]',
    error: 'bg-white dark:bg-zinc-900 border-rose-500/30 text-zinc-900 dark:text-zinc-100 shadow-[0_4px_12px_rgba(244,63,94,0.12)]',
    warning: 'bg-white dark:bg-zinc-900 border-amber-500/30 text-zinc-900 dark:text-zinc-100 shadow-[0_4px_12px_rgba(245,158,11,0.12)]',
    info: 'bg-white dark:bg-zinc-900 border-blue-500/30 text-zinc-900 dark:text-zinc-100 shadow-[0_4px_12px_rgba(59,130,246,0.12)]',
  };

  return (
    <motion.div
      id={`toast-${id}`}
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${styleMap[type]} transition-colors duration-300 relative overflow-hidden`}
    >
      {/* Icon */}
      {iconMap[type]}

      {/* Message Content */}
      <div className="flex-1 text-xs font-medium leading-relaxed pr-6 select-text whitespace-pre-line">
        {message}
      </div>

      {/* Dismiss Button */}
      <button
        id={`toast-dismiss-${id}`}
        onClick={() => onClose(id)}
        className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-0.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar Animation */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-[3px] ${
          type === 'success' ? 'bg-emerald-500' :
          type === 'error' ? 'bg-rose-500' :
          type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
        }`}
      />
    </motion.div>
  );
}
