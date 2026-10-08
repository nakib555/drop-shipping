import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Camera,
  CheckCircle2,
  CreditCard,
  Globe,
  Grid,
  Heart,
  HelpCircle,
  Home,
  Layers,
  Lock,
  Package,
  Play,
  Scale,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  TrendingDown,
  Truck,
  User,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { ScreenId } from '../../types/deshimart';
import { BottomTabBar } from './BottomTabBar';
import { SideDrawer } from './SideDrawer';
import { TopAppBar } from './TopAppBar';
import { ToastContainer } from '../shared/ToastContainer';

export const MobileShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentScreen,
    selectedProductId,
    navigateTo,
    currency,
    setCurrency,
    language,
    setLanguage,
  } = useDeshiMart();
  const [showFlowDock, setShowFlowDock] = useState(true);
  const mainScrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [currentScreen, selectedProductId]);

  const flowGroups: {
    groupTitle: string;
    screens: { id: ScreenId; label: string; icon: React.FC<{ className?: string }> }[];
  }[] = [
    {
      groupTitle: '01. Onboarding & Auth',
      screens: [
        { id: 'splash', label: 'Splash Screen', icon: Sparkles },
        { id: 'onboarding', label: 'Onboarding Walkthrough', icon: Globe },
        { id: 'auth', label: 'Sign In / Create Account', icon: Lock },
      ],
    },
    {
      groupTitle: '02. Store & Discovery',
      screens: [
        { id: 'home', label: 'Home & Smart Feed', icon: Home },
        { id: 'categories', label: 'Category Directory', icon: Grid },
        { id: 'category_products', label: 'Catalog & Filters', icon: Layers },
      ],
    },
    {
      groupTitle: '03. Product & Intelligence',
      screens: [
        { id: 'product_detail', label: 'Product Details', icon: ShoppingBag },
        { id: 'price_tracker', label: '30-Day Price History', icon: TrendingDown },
        { id: 'seller_compare', label: 'Compare 3 Shipping Routes', icon: Scale },
        { id: 'spec_compare', label: 'Compare Specifications', icon: Layers },
        { id: 'visual_scan', label: 'Visual & Link Scanner', icon: Camera },
      ],
    },
    {
      groupTitle: '04. Cart & Local Checkout',
      screens: [
        { id: 'cart', label: 'Shopping Bag', icon: ShoppingCart },
        { id: 'checkout_shipping', label: '1. Delivery Address', icon: Truck },
        { id: 'checkout_payment', label: '2. Payment (COD / bKash)', icon: CreditCard },
        { id: 'checkout_review', label: '3. Order Review', icon: CheckCircle2 },
        { id: 'order_success', label: 'Order Confirmed', icon: CheckCircle2 },
      ],
    },
    {
      groupTitle: '05. Orders & Account',
      screens: [
        { id: 'orders', label: 'Order History', icon: Package },
        { id: 'order_tracking', label: 'Live Customs Tracking', icon: Truck },
        { id: 'wishlist', label: 'Saved Wishlist', icon: Heart },
        { id: 'account', label: 'Account Overview', icon: User },
        { id: 'addresses', label: 'Saved Addresses', icon: Truck },
        { id: 'payment_methods', label: 'Payment Methods', icon: CreditCard },
        { id: 'supplier_store', label: 'Supplier Storefront', icon: Globe },
        { id: 'support', label: '24/7 Support & FAQs', icon: HelpCircle },
      ],
    },
  ];

  return (
    <div
      lang={language === 'BN' ? 'bn' : 'en'}
      className="h-dvh w-full overflow-hidden bg-[#0F172A] text-[#0F172A] flex flex-col lg:flex-row items-center justify-center lg:gap-10 lg:p-6"
    >
      {/* Desktop Left Screen Navigator */}
      {showFlowDock && (
        <aside className="hidden lg:flex flex-col w-76 h-[852px] max-h-[92dvh] bg-slate-900/90 backdrop-blur-xl text-slate-100 rounded-3xl border border-slate-800 p-5 shadow-2xl overflow-hidden shrink-0">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#059669] flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight text-white">
                  DeshiMart
                </h2>
                <p className="text-[11px] text-slate-400">
                  Cross-Border Commerce
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('splash')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Play className="w-3 h-3" />
              <span>Intro</span>
            </button>
          </div>

          {/* Currency & Language Switchers */}
          <div className="grid grid-cols-2 gap-2 my-3 shrink-0">
            <button
              type="button"
              onClick={() => setCurrency(currency === 'BDT' ? 'USD' : 'BDT')}
              className="px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-xs font-medium flex items-center justify-between transition-colors border border-slate-700/60"
            >
              <span className="text-slate-400">Currency</span>
              <span className="font-mono-num font-semibold text-white">
                {currency === 'BDT' ? '৳ BDT' : '$ USD'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-xs font-medium flex items-center justify-between transition-colors border border-slate-700/60"
            >
              <span className="text-slate-400">Language</span>
              <span className="font-semibold text-white">
                {language === 'EN' ? 'EN' : 'বাংলা'}
              </span>
            </button>
          </div>

          <div className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-1 no-scrollbar pt-1">
            {flowGroups.map((group) => (
              <div key={group.groupTitle}>
                <h3 className="text-[11px] font-semibold text-slate-400 mb-1.5 px-2">
                  {group.groupTitle}
                </h3>
                <div className="space-y-0.5">
                  {group.screens.map((item) => {
                    const Icon = item.icon;
                    const active = currentScreen === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigateTo(item.id)}
                        className={`w-full px-2.5 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors text-left ${
                          active
                            ? 'bg-[#059669] text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-medium'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0 opacity-85" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* Primary Mobile App Viewport */}
      <div className="relative w-full sm:w-[412px] h-dvh sm:h-[852px] sm:max-h-[92dvh] bg-[#F8FAFC] sm:rounded-[40px] sm:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)] sm:border-[6px] sm:border-slate-800 flex flex-col overflow-hidden shrink-0">
        {/* Clean Minimal Status Bar */}
        <div className="hidden sm:flex items-center justify-between px-6 py-1.5 bg-white text-slate-900 text-[11px] font-mono-num font-medium select-none border-b border-slate-100 shrink-0 z-30">
          <span>9:41</span>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-[10px] font-sans font-medium">5G</span>
            <div className="w-4 h-2.5 rounded-xs border border-slate-400 p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-800" />
            </div>
          </div>
        </div>

        {/* Fixed Top App Bar */}
        <TopAppBar />

        {/* Frame-Anchored Toast Feedback Overlay */}
        <ToastContainer />

        {/* Frame-Anchored Slide-Out Side Navigation Drawer */}
        <SideDrawer />

        {/* Dedicated Scrollable Screen Body */}
        <main
          ref={mainScrollRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain no-scrollbar flex flex-col relative"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${currentScreen}-${selectedProductId}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Fixed Bottom Navigation Bar */}
        <BottomTabBar />
      </div>

      {/* Desktop Toggle Button for Screen Navigator */}
      <button
        type="button"
        onClick={() => setShowFlowDock((prev) => !prev)}
        className="hidden lg:flex fixed bottom-5 right-5 z-40 items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-slate-200 text-xs font-medium border border-slate-800 shadow-lg hover:bg-slate-800 transition-colors"
      >
        <Smartphone className="w-4 h-4 text-[#059669]" />
        <span>{showFlowDock ? 'Hide Navigator' : 'Screen Navigator'}</span>
      </button>
    </div>
  );
};
