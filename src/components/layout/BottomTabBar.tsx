import React from 'react';
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
      label: 'Categories',
      labelBn: 'ক্যাটাগরি',
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
      label: 'Cart',
      labelBn: 'কার্ট',
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

  // 8pt Grid: h-16 (64px = 8*8), px-2 (8px = 1*8), gap-1 (4px sub-grid)
  return (
    <nav
      aria-label="Primary Bottom Navigation"
      className="z-30 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_-6px_rgba(11,61,46,0.08)] grid grid-cols-5 items-center px-2 gap-1 shrink-0 select-none"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.matchScreens.includes(currentScreen);

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigateTo(tab.id)}
            className={`relative h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
              isActive
                ? 'text-[#0EA75F]'
                : 'text-[#6B7280] hover:text-[#0B3D2E]'
            }`}
          >
            {/* Top Active Indicator Bar (32px wide x 4px tall) */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-[#0EA75F]" />
            )}

            <div
              className={`relative px-3 py-1 rounded-xl transition-colors ${
                isActive ? 'bg-[#ECFDF5]' : 'bg-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#0EA75F] text-white font-mono-num text-[10px] leading-4 font-bold flex items-center justify-center shadow-2xs">
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] leading-3 tracking-tight whitespace-nowrap ${
                isActive ? 'font-extrabold text-[#0EA75F]' : 'font-semibold'
              }`}
            >
              {language === 'BN' ? tab.labelBn : tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
