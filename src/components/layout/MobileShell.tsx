import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { BottomTabBar } from './BottomTabBar';
import { TopAppBar } from './TopAppBar';
import { ToastContainer } from '../shared/ToastContainer';
import { PWAInstallPopup } from '../shared/PWAInstallPopup';
// Clean production MobileShell — full-bleed on all mobile screens and installed standalone PWAs

export const MobileShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentScreen,
    selectedProductId,
    language,
    darkMode,
  } = useDeshiMart();
  const { isInstalled } = usePWAInstall();
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
      className={`h-dvh w-full max-w-[100vw] overflow-hidden text-content-primary flex items-center justify-center ${
        isInstalled ? 'bg-app-bg' : 'bg-app-bg lg:bg-slate-900 lg:p-4'
      }`}
    >
      {/* Full edge-to-edge on all mobile/tablet screens (<1024px) & installed PWAs; framed preview only on large desktop browsers */}
      <div
        className={`relative w-full max-w-[100vw] h-dvh bg-app-bg flex flex-col overflow-hidden shrink-0 ${
          isInstalled
            ? 'lg:max-w-none lg:h-dvh lg:rounded-none lg:border-0 lg:shadow-none'
            : 'lg:max-w-[440px] lg:h-[92dvh] lg:max-h-[880px] lg:rounded-3xl lg:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] lg:border lg:border-slate-700/80'
        } ${darkMode ? 'contrast-105' : ''}`}
      >
        {/* Fixed Top App Bar */}
        <TopAppBar />

        {/* Browser-Style Top Pop-Up PWA Install Notification */}
        <PWAInstallPopup />

        {/* Frame-Anchored Toast Feedback Overlay */}
        <ToastContainer />

        {/* Dedicated Scrollable Screen Body */}
        <main
          ref={mainScrollRef}
          onScroll={handleMainScroll}
          className="flex-1 min-h-0 w-full max-w-full overflow-y-auto overflow-x-hidden overscroll-contain no-scrollbar flex flex-col relative"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${currentScreen}-${selectedProductId}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col min-h-full w-full max-w-full min-w-0"
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

