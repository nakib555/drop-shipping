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
      groupTitle: '1. Animated Splash & Onboarding',
      screens: [
        { id: 'splash', label: 'Splash Screen (Animated)', icon: Sparkles },
        { id: 'onboarding', label: 'Onboarding (3 Animated Slides)', icon: Globe },
        { id: 'auth', label: 'Login / Register', icon: Lock },
      ],
    },
    {
      groupTitle: '2. Discovery & Catalog',
      screens: [
        { id: 'home', label: 'Home & Smart Discovery', icon: Home },
        { id: 'categories', label: 'All Categories', icon: Grid },
        { id: 'category_products', label: 'Category Listing & Filters', icon: Layers },
      ],
    },
    {
      groupTitle: '3. Product Details & Tools',
      screens: [
        { id: 'product_detail', label: 'Product Details', icon: ShoppingBag },
        { id: 'price_tracker', label: '30-Day Price Tracker', icon: TrendingDown },
        { id: 'seller_compare', label: 'Compare 3 Sellers / Routes', icon: Scale },
        { id: 'spec_compare', label: 'Compare Product Specs', icon: Layers },
        { id: 'visual_scan', label: 'Visual Scan / Link Finder', icon: Camera },
      ],
    },
    {
      groupTitle: '4. Cart & Local Checkout',
      screens: [
        { id: 'cart', label: 'Shopping Cart', icon: ShoppingCart },
        { id: 'checkout_shipping', label: 'Checkout — Shipping', icon: Truck },
        { id: 'checkout_payment', label: 'Payment (COD / bKash / Card)', icon: CreditCard },
        { id: 'checkout_review', label: 'Review & Place Order', icon: CheckCircle2 },
        { id: 'order_success', label: 'Order Confirmation', icon: CheckCircle2 },
      ],
    },
    {
      groupTitle: '5. Tracking & Account',
      screens: [
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'order_tracking', label: 'Live Cross-Border Tracking', icon: Truck },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'account', label: 'Account & Profile', icon: User },
        { id: 'addresses', label: 'Saved Addresses', icon: Truck },
        { id: 'payment_methods', label: 'Saved Payment Methods', icon: CreditCard },
        { id: 'supplier_store', label: 'Verified Supplier Store', icon: Globe },
        { id: 'support', label: 'Help, FAQs & Live Chat', icon: HelpCircle },
      ],
    },
  ];

  return (
    <div
      lang={language === 'BN' ? 'bn' : 'en'}
      className="h-dvh w-full overflow-hidden bg-[#07261C] text-[#0B3D2E] flex flex-col lg:flex-row items-center justify-center lg:gap-8 lg:p-6"
    >
      {/* Desktop Left Brand & Quick Flow Jump Explorer (Hidden on Mobile Devices) */}
      {showFlowDock && (
        <aside className="hidden lg:flex flex-col w-80 h-[852px] max-h-[92dvh] bg-[#0B3D2E] text-white rounded-3xl border border-white/10 p-5 shadow-2xl overflow-hidden shrink-0">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0EA75F] flex items-center justify-center text-white shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight text-white">
                  DeshiMart™
                </h2>
                <p className="text-[11px] text-emerald-300/90">
                  Global Products → Your Door
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('splash')}
              className="px-2.5 py-1 rounded-lg bg-[#0EA75F] hover:bg-[#00C853] text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Intro</span>
            </button>
          </div>

          {/* Live Currency & Language Quick Toggle */}
          <div className="grid grid-cols-2 gap-2 my-3 shrink-0">
            <button
              type="button"
              onClick={() => setCurrency(currency === 'BDT' ? 'USD' : 'BDT')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span className="text-emerald-200">Currency</span>
              <span className="font-mono-num font-bold text-white">
                {currency === 'BDT' ? '৳ BDT' : '$ USD'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span className="text-emerald-200">ভাষা / Lang</span>
              <span className="font-bold text-white">
                {language === 'EN' ? 'EN' : 'বাংলা'}
              </span>
            </button>
          </div>

          <p className="text-[11px] text-emerald-200/80 mb-2.5 leading-relaxed shrink-0">
            Top & bottom bars are strictly fixed inside the mobile viewport. Tap any screen below to jump directly:
          </p>

          <div className="space-y-3.5 flex-1 min-h-0 overflow-y-auto pr-1 no-scrollbar">
            {flowGroups.map((group) => (
              <div key={group.groupTitle}>
                <h3 className="text-[11px] font-bold text-emerald-300/90 mb-1.5">
                  {group.groupTitle}
                </h3>
                <div className="space-y-1">
                  {group.screens.map((item) => {
                    const Icon = item.icon;
                    const active = currentScreen === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigateTo(item.id)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors text-left ${
                          active
                            ? 'bg-[#0EA75F] text-white font-bold shadow-xs'
                            : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
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

      {/* Primary Mobile App Viewport — Locked Height so Top & Bottom Bars Stay Fixed */}
      <div className="relative w-full sm:w-[412px] h-dvh sm:h-[852px] sm:max-h-[92dvh] bg-[#F1F5F9] sm:rounded-[38px] sm:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.65)] sm:border-[6px] sm:border-[#0B3D2E] flex flex-col overflow-hidden shrink-0">
        {/* Subtle Mobile Status Bar (Desktop/Tablet Frame Only — Fixed Top) */}
        <div className="hidden sm:flex items-center justify-between px-6 py-1.5 bg-white text-[#0B3D2E] text-[11px] font-mono-num font-semibold select-none border-b border-slate-100 shrink-0 z-30">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#0EA75F] font-sans font-bold">
              5G · DeshiMart
            </span>
            <div className="w-4 h-2.5 rounded-xs border border-[#0B3D2E] p-0.5 flex items-center">
              <div className="w-full h-full bg-[#0EA75F]" />
            </div>
          </div>
        </div>

        {/* Fixed Top App Bar */}
        <TopAppBar />

        {/* Frame-Anchored Toast Feedback Overlay */}
        <ToastContainer />

        {/* Frame-Anchored Slide-Out Side Navigation Drawer */}
        <SideDrawer />

        {/* Dedicated Scrollable Screen Body Between Fixed Top Bar and Fixed Bottom Bar */}
        <main
          ref={mainScrollRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain no-scrollbar flex flex-col relative"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${currentScreen}-${selectedProductId}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Fixed Bottom Navigation Bar */}
        <BottomTabBar />
      </div>

      {/* Desktop Toggle Button for Flow Explorer */}
      <button
        type="button"
        onClick={() => setShowFlowDock((prev) => !prev)}
        className="hidden lg:flex fixed bottom-5 right-5 z-40 items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold border border-white/15 shadow-lg hover:bg-[#0EA75F] transition-colors"
      >
        <Smartphone className="w-4 h-4" />
        <span>{showFlowDock ? 'Hide Screen Explorer' : 'Show All 20+ Screens'}</span>
      </button>
    </div>
  );
};
