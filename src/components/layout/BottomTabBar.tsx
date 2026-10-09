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
        'admin_dashboard',
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

  return (
    <nav
      role="navigation"
      aria-label="Primary Bottom Navigation"
      className="z-50 h-16 bg-white/95 backdrop-blur border-t border-app-border flex items-center justify-around px-2 shrink-0 select-none"
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
            className={`group relative min-w-[56px] min-h-[44px] py-1.5 px-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
              isActive
                ? 'text-brand-primary text-[11px] font-semibold'
                : 'text-content-secondary hover:text-content-primary text-[11px] font-medium'
            }`}
          >
            {/* Active top indicator bar */}
            {isActive && (
              <motion.span
                layoutId="bottom-tab-top-line"
                transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-brand-primary"
              />
            )}

            <div className="relative flex items-center justify-center">
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? 'text-brand-primary stroke-[2.25]'
                    : 'text-content-secondary group-hover:text-content-primary stroke-[1.85]'
                }`}
              />

              {/* Crimson Badge per DESIGN_SYSTEM_SPEC.md Section 5.5 */}
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <motion.span
                  key={tab.badge}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="absolute -top-1 -right-2.5 bg-promo-accent text-white text-[10px] font-bold tabular-nums h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center ring-2 ring-white"
                >
                  {tab.badge}
                </motion.span>
              )}

              {/* Subtle Unread Dot on Account Tab */}
              {tab.hasDot && (
                <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-promo-accent ring-2 ring-white" />
              )}
            </div>

            {/* Destination Label */}
            <span className="leading-3.5 whitespace-nowrap">
              {language === 'BN' ? tab.labelBn : tab.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
};


