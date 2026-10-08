import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info } from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useDeshiMart();

  return (
    <div
      aria-live="polite"
      className="absolute top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-[380px] px-4 pointer-events-none flex flex-col gap-2"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#0B3D2E] text-white text-xs font-medium shadow-lg border border-white/10"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#00C853] shrink-0" />
            )}
            <span className="truncate">{toast.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
