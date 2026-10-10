import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info } from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useDeshiMart();

  return (
    <div
      aria-live="polite"
      className="absolute top-16 left-1/2 -translate-x-1/2 z-[70] w-full max-w-[380px] px-4 pointer-events-none flex flex-col gap-2"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-content-primary text-white text-xs leading-4 font-medium shadow-lg border border-slate-700"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            )}
            <span className="truncate">{toast.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
