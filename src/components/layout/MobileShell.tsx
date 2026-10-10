import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { BottomTabBar } from './BottomTabBar';
import { TopAppBar } from './TopAppBar';
import { ToastContainer } from '../shared/ToastContainer';
// Clean production MobileShell — zero Cultural Vibe or FloatingExperienceModePill UI

export const MobileShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentScreen,
    selectedProductId,
    language,
    darkMode,
  } = useDeshiMart();
  const mainScrollRef = useRef<HTMLElement | null>(null);
  const scrollMemoryRef = useRef<Record<string, number>>({});
  const activeRouteKey =
    currentScreen === 'product_detail'
      ? `product_detail:${selectedProductId}`
      : currentScreen;

  useEffect(() => {
    const el = mainScrollRef.current;
    if (!el) return;
    const savedScroll = scrollMemoryRef.current[activeRouteKey] ?? 0;
    requestAnimationFrame(() => {
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTop = savedScroll;
      }
    });
  }, [activeRouteKey]);

  const handleMainScroll = (e: React.UIEvent<HTMLElement>) => {
    scrollMemoryRef.current[activeRouteKey] = e.currentTarget.scrollTop;
  };

  return (
    <div
      lang={language === 'BN' ? 'bn' : 'en'}
      className="h-dvh w-full overflow-hidden bg-slate-900 text-content-primary flex items-center justify-center sm:p-4"
    >
      {/* Clean Mobile Viewport Container (Edge-to-edge on mobile, subtle centered viewport on larger screens) */}
      <div
        className={`relative w-full max-w-[430px] h-dvh sm:h-[92dvh] sm:max-h-[860px] bg-app-bg sm:rounded-3xl sm:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] sm:border sm:border-slate-700/80 flex flex-col overflow-hidden shrink-0 ${
          darkMode ? 'contrast-105' : ''
        }`}
      >
        {/* Fixed Top App Bar */}
        <TopAppBar />

        {/* Frame-Anchored Toast Feedback Overlay */}
        <ToastContainer />

        {/* Dedicated Scrollable Screen Body */}
        <main
          ref={mainScrollRef}
          onScroll={handleMainScroll}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain no-scrollbar flex flex-col relative"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${currentScreen}-${selectedProductId}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Viewport-Locked Modal & Bottom Sheet Portal Slot */}
        <div
          id="mobile-sheet-root"
          className="pointer-events-none absolute inset-0 z-[60] overflow-hidden"
        />

        {/* Fixed Bottom Navigation Bar */}
        <BottomTabBar />
      </div>
    </div>
  );
};
