import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { BottomTabBar } from './BottomTabBar';
import { TopAppBar } from './TopAppBar';
import { ToastContainer } from '../shared/ToastContainer';
import { FloatingExperienceModePill } from '../shared/ExperienceModeSwitcher';

export const MobileShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentScreen,
    selectedProductId,
    language,
    experienceMode,
    darkMode,
  } = useDeshiMart();
  const prefersReducedMotion = useReducedMotion();
  const mainScrollRef = useRef<HTMLElement | null>(null);
  const scrollMemoryRef = useRef<Record<string, number>>({});
  const prevModeRef = useRef(experienceMode);
  const [modeTransitionPulse, setModeTransitionPulse] = useState<'global' | 'bangladesh' | null>(null);

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

  useEffect(() => {
    if (prevModeRef.current !== experienceMode) {
      prevModeRef.current = experienceMode;
      if (!prefersReducedMotion) {
        setModeTransitionPulse(experienceMode);
        const timer = window.setTimeout(() => setModeTransitionPulse(null), 380);
        return () => window.clearTimeout(timer);
      }
    }
  }, [experienceMode, prefersReducedMotion]);

  const handleMainScroll = (e: React.UIEvent<HTMLElement>) => {
    scrollMemoryRef.current[activeRouteKey] = e.currentTarget.scrollTop;
  };

  return (
    <div
      lang={language === 'BN' ? 'bn' : 'en'}
      data-experience-mode={experienceMode}
      className="h-dvh w-full overflow-hidden bg-slate-900 text-content-primary flex items-center justify-center sm:p-4 transition-colors duration-300"
    >
      {/* Clean Mobile Viewport Container (Edge-to-edge on mobile, subtle centered viewport on larger screens) */}
      <div
        data-experience-mode={experienceMode}
        className={`relative w-full max-w-[430px] h-dvh sm:h-[92dvh] sm:max-h-[860px] bg-app-bg sm:rounded-3xl sm:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] sm:border sm:border-slate-700/80 flex flex-col overflow-hidden shrink-0 transition-colors duration-300 ${
          darkMode ? 'contrast-105' : ''
        }`}
      >
        {/* Smooth Non-Blocking Cultural Identity Transition Veil (Preserves scroll & screen state) */}
        <AnimatePresence>
          {modeTransitionPulse && (
            <motion.div
              key={`mode-pulse-${modeTransitionPulse}`}
              aria-hidden="true"
              initial={{ opacity: 0.38, scale: 0.96 }}
              animate={{ opacity: 0, scale: 1.04 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-none absolute inset-0 z-50 ${
                modeTransitionPulse === 'bangladesh'
                  ? 'bg-[radial-gradient(circle_at_85%_85%,rgba(244,42,65,0.22),rgba(0,106,78,0.28)_55%,transparent_85%)]'
                  : 'bg-[radial-gradient(circle_at_85%_85%,rgba(15,23,42,0.16),rgba(248,250,252,0.25)_60%,transparent_85%)]'
              }`}
            />
          )}
        </AnimatePresence>

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

        {/* Floating Experience Mode Quick-Switch Pill on All Discovery Screens */}
        <FloatingExperienceModePill />

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

