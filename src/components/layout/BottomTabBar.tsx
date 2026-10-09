import React from 'react';
import { motion } from 'motion/react';
import {
  Grid,
  Home,
  Package,
  ShoppingCart,
  User,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { ScreenId } from '../../types/deshimart';

export const BottomTabBar: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    cartCount,
    orders,
    unreadNotificationCount,
    language,
  } = useDeshiMart();

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
    hasDot?: boolean;
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
      matchScreens: [
        'categories',
        'category_products',
        'product_detail',
        'supplier_store',
        'price_tracker',
        'seller_compare',
        'spec_compare',
      ],
    },
    {
      id: 'orders',
      label: 'Orders',
      labelBn: 'অর্ডার',
      icon: Package,
      matchScreens: ['orders', 'order_tracking'],
      badge: orders.length > 0 ? orders.length : undefined,
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
        'wishlist',
        'notifications',
        'support',
        'settings',
        'guides',
      ],
      hasDot: unreadNotificationCount > 0,
    },
  ];

  // 8pt Grid: h-16 (64px), px-2 (8px), gap-1 (4px)
  return (
    <nav
      role="navigation"
      aria-label="Primary Bottom Navigation"
      className="z-30 h-16 bg-white/95 backdrop-blur-md border-t border-[#DFEAE3] shadow-[0_-4px_16px_-6px_rgba(15,29,23,0.06)] grid grid-cols-5 items-center px-2 gap-1 shrink-0 select-none"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.matchScreens.includes(currentScreen);

        return (
          <motion.button
            key={tab.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigateTo(tab.id)}
            className="group relative h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
          >
            {/* Top hairline active indicator */}
            {isActive && (
              <motion.span
                layoutId="bottom-tab-top-line"
                transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] rounded-full bg-[#059669]"
              />
            )}

            {/* Icon Container with Material 3 / Apple HIG Active Capsule */}
            <div className="relative flex items-center justify-center w-12 h-7 rounded-full">
              {isActive && (
                <motion.span
                  layoutId="bottom-tab-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#ECFDF5] border border-[#A7F3D0]/70"
                />
              )}

              <Icon
                className={`relative z-10 w-[17px] h-[17px] transition-all duration-150 ${
                  isActive
                    ? 'text-[#059669] stroke-[2.3]'
                    : 'text-[#485B52] group-hover:text-[#0F1D17] stroke-[1.85]'
                }`}
              />

              {/* Numeric Badge */}
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <motion.span
                  key={tab.badge}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="absolute -top-1 right-1 z-20 min-w-[16px] h-4 px-1 rounded-full bg-[#059669] text-white font-mono-num text-[10px] leading-4 font-semibold flex items-center justify-center ring-2 ring-white shadow-2xs"
                >
                  {tab.badge}
                </motion.span>
              )}

              {/* Subtle Unread Dot on Account Tab */}
              {tab.hasDot && (
                <span className="absolute top-0.5 right-2.5 z-20 w-2 h-2 rounded-full bg-[#059669] ring-2 ring-white" />
              )}
            </div>

            {/* Destination Label */}
            <span
              className={`text-[10px] leading-3 tracking-tight whitespace-nowrap transition-colors ${
                isActive
                  ? 'font-bold text-[#0F1D17]'
                  : 'font-medium text-[#485B52] group-hover:text-[#0F1D17]'
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


