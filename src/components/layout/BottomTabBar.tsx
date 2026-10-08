import React from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  Grid,
  Home,
  ShoppingCart,
  User,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { ScreenId } from '../../types/deshimart';

export const BottomTabBar: React.FC = () => {
  const { currentScreen, navigateTo, cartCount, language } = useDeshiMart();

  const hiddenScreens: ScreenId[] = ['splash', 'onboarding', 'auth'];

  if (hiddenScreens.includes(currentScreen)) {
    return null;
  }

  const tabs: {
    id: ScreenId;
    label: string;
    labelBn: string;
    icon: React.FC<{ className?: string }>;
    matchScreens: ScreenId[];
    badge?: number;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      labelBn: 'হোম',
      icon: Home,
      matchScreens: ['home'],
    },
    {
      id: 'categories',
      label: 'Catalog',
      labelBn: 'ক্যাটালগ',
      icon: Grid,
      matchScreens: ['categories', 'category_products', 'product_detail', 'supplier_store'],
    },
    {
      id: 'visual_scan',
      label: 'Scan',
      labelBn: 'স্ক্যান',
      icon: Camera,
      matchScreens: ['visual_scan', 'price_tracker', 'seller_compare', 'spec_compare'],
    },
    {
      id: 'cart',
      label: 'Bag',
      labelBn: 'ব্যাগ',
      icon: ShoppingCart,
      matchScreens: [
        'cart',
        'checkout_shipping',
        'checkout_payment',
        'checkout_review',
        'order_success',
      ],
      badge: cartCount,
    },
    {
      id: 'account',
      label: 'Account',
      labelBn: 'অ্যাকাউন্ট',
      icon: User,
      matchScreens: [
        'account',
        'addresses',
        'payment_methods',
        'orders',
        'order_tracking',
        'wishlist',
        'notifications',
        'support',
        'settings',
        'guides',
      ],
    },
  ];

  // 8pt Grid: h-16 (64px = 8*8), px-2 (8px), gap-1 (4px)
  return (
    <nav
      aria-label="Primary Bottom Navigation"
      className="z-30 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/80 grid grid-cols-5 items-center px-2 gap-1 shrink-0 select-none"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.matchScreens.includes(currentScreen);

        return (
          <motion.button
            key={tab.id}
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => navigateTo(tab.id)}
            className={`relative h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive
                ? 'text-[#059669]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="bottom-tab-indicator"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[#059669]"
              />
            )}

            <div className="relative px-3 py-0.5">
              <Icon
                className={`relative z-10 w-4 h-4 transition-transform duration-150 ${
                  isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'
                }`}
              />
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <motion.span
                  key={tab.badge}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="absolute -top-1.5 -right-0.5 z-20 min-w-[16px] h-4 px-1 rounded-full bg-[#059669] text-white font-mono-num text-[10px] leading-4 font-semibold flex items-center justify-center"
                >
                  {tab.badge}
                </motion.span>
              )}
            </div>
            <span
              className={`text-[10px] leading-3 tracking-tight whitespace-nowrap ${
                isActive ? 'font-semibold text-slate-900' : 'font-normal text-slate-500'
              }`}
            >
              {language === 'BN' ? tab.labelBn : tab.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
};
