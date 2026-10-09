import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bell,
  BookOpen,
  ChevronRight,
  CreditCard,
  Globe,
  Grid,
  Heart,
  HelpCircle,
  Home,
  LogOut,
  MapPin,
  Package,
  Play,
  Scale,
  Settings,
  ShieldCheck,
  ShoppingCart,
  TrendingDown,
  X,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { ScreenId } from '../../types/deshimart';

interface NavMenuItem {
  label: string;
  labelBn: string;
  screen: ScreenId;
  matchScreens?: ScreenId[];
  icon: React.FC<{ className?: string }>;
  badge?: number;
  badgeTone?: 'emerald' | 'amber' | 'slate';
}

interface NavMenuGroup {
  id: string;
  title: string;
  titleBn: string;
  items: NavMenuItem[];
}

export const SideDrawer: React.FC = () => {
  const {
    currentScreen,
    drawerOpen,
    setDrawerOpen,
    user,
    navigateTo,
    logoutUser,
    currency,
    setCurrency,
    language,
    setLanguage,
    cartCount,
    orders,
    wishlist,
    unreadNotificationCount,
  } = useDeshiMart();

  // Close drawer on Escape key
  useEffect(() => {
    if (!drawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, setDrawerOpen]);

  const menuGroups: NavMenuGroup[] = [
    {
      id: 'storefront',
      title: 'Storefront',
      titleBn: 'স্টোরফ্রন্ট',
      items: [
        {
          label: 'Home Feed',
          labelBn: 'হোম ফিড',
          screen: 'home',
          matchScreens: ['home'],
          icon: Home,
        },
        {
          label: 'All Departments',
          labelBn: 'সকল বিভাগ',
          screen: 'categories',
          matchScreens: ['categories', 'category_products'],
          icon: Grid,
        },
        {
          label: 'Shopping Bag',
          labelBn: 'শপিং ব্যাগ',
          screen: 'cart',
          matchScreens: ['cart'],
          icon: ShoppingCart,
          badge: cartCount > 0 ? cartCount : undefined,
          badgeTone: 'emerald',
        },
      ],
    },
    {
      id: 'intelligence',
      title: 'Cross-Border Tools',
      titleBn: 'ক্রস-বর্ডার টুলস',
      items: [
        {
          label: '30-Day Price Tracker',
          labelBn: '৩০ দিনের প্রাইস ট্র্যাকার',
          screen: 'price_tracker',
          matchScreens: ['price_tracker'],
          icon: TrendingDown,
        },
        {
          label: '3-Route Cost Compare',
          labelBn: '৩টি শিপিং রুট তুলনা',
          screen: 'seller_compare',
          matchScreens: ['seller_compare', 'spec_compare'],
          icon: Scale,
        },
      ],
    },
    {
      id: 'account',
      title: 'My Account',
      titleBn: 'আমার অ্যাকাউন্ট',
      items: [
        {
          label: 'My Orders & Tracking',
          labelBn: 'আমার অর্ডার ও ট্র্যাকিং',
          screen: 'orders',
          matchScreens: ['orders', 'order_tracking'],
          icon: Package,
          badge: orders.length > 0 ? orders.length : undefined,
          badgeTone: 'slate',
        },
        {
          label: 'Saved Wishlist',
          labelBn: 'উইশলিস্ট',
          screen: 'wishlist',
          matchScreens: ['wishlist'],
          icon: Heart,
          badge: wishlist.length > 0 ? wishlist.length : undefined,
          badgeTone: 'slate',
        },
        {
          label: 'Notifications',
          labelBn: 'নোটিফিকেশন',
          screen: 'notifications',
          matchScreens: ['notifications'],
          icon: Bell,
          badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
          badgeTone: 'emerald',
        },
        {
          label: 'Delivery Addresses',
          labelBn: 'ডেলিভারি ঠিকানা',
          screen: 'addresses',
          matchScreens: ['addresses'],
          icon: MapPin,
        },
        {
          label: 'Payment Methods',
          labelBn: 'পেমেন্ট মাধ্যম',
          screen: 'payment_methods',
          matchScreens: ['payment_methods'],
          icon: CreditCard,
        },
      ],
    },
    {
      id: 'support',
      title: 'Guides & Preferences',
      titleBn: 'গাইড ও সেটিংস',
      items: [
        {
          label: 'Customs & Buying Guides',
          labelBn: 'শপিং ও কাস্টমস গাইড',
          screen: 'guides',
          matchScreens: ['guides'],
          icon: BookOpen,
        },
        {
          label: '24/7 Help & Support',
          labelBn: '২৪/৭ হেল্প ও সাপোর্ট',
          screen: 'support',
          matchScreens: ['support'],
          icon: HelpCircle,
        },
        {
          label: 'Settings & Preferences',
          labelBn: 'সেটিংস ও কারেন্সি',
          screen: 'settings',
          matchScreens: ['settings'],
          icon: Settings,
        },
        {
          label: 'Replay Intro Walkthrough',
          labelBn: 'ইন্ট্রো স্লাইডগুলো দেখুন',
          screen: 'splash',
          matchScreens: ['splash', 'onboarding'],
          icon: Play,
        },
      ],
    },
  ];

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleNavigate = (screen: ScreenId) => {
    setDrawerOpen(false);
    navigateTo(screen);
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation drawer"
          className="absolute inset-0 z-50 flex"
        >
          {/* Animated Scrim Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          {/* Professional 3-Zone Architectural Slide-Out Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[312px] max-w-[86%] bg-white h-full shadow-2xl border-r border-app-border flex flex-col overflow-hidden"
          >
            {/* ZONE 1: Clean Editorial Profile & Preferences Header */}
            <div className="shrink-0 bg-app-bg border-b border-app-border px-4 pt-4 pb-3.5 space-y-3.5">
              {/* Top Profile Row + 44x44 Close Hitbox */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleNavigate('account')}
                  className="flex items-center gap-3 text-left group min-w-0 flex-1 py-0.5 focus-visible:outline-none"
                >
                  <div className="w-11 h-11 rounded-xl bg-content-primary text-white font-semibold text-xs flex items-center justify-center shrink-0 group-hover:bg-brand-primary transition-colors">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm leading-5 font-semibold text-content-primary truncate group-hover:text-brand-primary transition-colors">
                      {user.fullName}
                    </h2>
                    {/* Clean unboxed metadata with middle-dot separator */}
                    <div className="flex items-center gap-1.5 text-xs leading-4 text-content-secondary truncate mt-0.5">
                      <span className="text-brand-primary font-medium">
                        {language === 'BN' ? 'ভেরিফাইড মেম্বার' : 'Verified Buyer'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setDrawerOpen(false)}
                  className="min-w-[44px] min-h-[44px] -mr-1.5 rounded-lg flex items-center justify-center text-content-secondary hover:text-content-primary hover:bg-app-subtle transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Quick-Access Summary Bar (Orders · Wishlist · Bag) */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleNavigate('orders')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-app-border hover:border-app-borderStrong text-left transition-colors"
                >
                  <span className="block tabular-nums text-sm leading-5 font-semibold text-content-primary">
                    {orders.length}
                  </span>
                  <span className="block text-xs leading-4 text-content-secondary mt-0.5 truncate">
                    {language === 'BN' ? 'অর্ডার' : 'Orders'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('wishlist')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-app-border hover:border-app-borderStrong text-left transition-colors"
                >
                  <span className="block tabular-nums text-sm leading-5 font-semibold text-content-primary">
                    {wishlist.length}
                  </span>
                  <span className="block text-xs leading-4 text-content-secondary mt-0.5 truncate">
                    {language === 'BN' ? 'উইশলিস্ট' : 'Saved'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('cart')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-app-border hover:border-app-borderStrong text-left transition-colors"
                >
                  <span className="block tabular-nums text-sm leading-5 font-semibold text-content-primary">
                    {cartCount}
                  </span>
                  <span className="block text-xs leading-4 text-content-secondary mt-0.5 truncate">
                    {language === 'BN' ? 'ব্যাগ' : 'In Bag'}
                  </span>
                </button>
              </div>

              {/* Dual Segmented Controls: Currency & Language */}
              <div className="grid grid-cols-2 gap-2">
                {/* Currency Segmented Control */}
                <div className="bg-app-subtle rounded-lg p-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => setCurrency('BDT')}
                    className={`flex-1 h-8 rounded-md text-xs tabular-nums font-semibold transition-all whitespace-nowrap ${
                      currency === 'BDT'
                        ? 'bg-white text-content-primary shadow-2xs'
                        : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    ৳ BDT
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`flex-1 h-8 rounded-md text-xs tabular-nums font-semibold transition-all whitespace-nowrap ${
                      currency === 'USD'
                        ? 'bg-white text-content-primary shadow-2xs'
                        : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    $ USD
                  </button>
                </div>

                {/* Language Segmented Control */}
                <div className="bg-app-subtle rounded-lg p-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => setLanguage('EN')}
                    className={`flex-1 h-8 rounded-md text-xs font-semibold transition-all inline-flex items-center justify-center gap-1 whitespace-nowrap ${
                      language === 'EN'
                        ? 'bg-white text-content-primary shadow-2xs'
                        : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>EN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('BN')}
                    className={`flex-1 h-8 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                      language === 'BN'
                        ? 'bg-white text-content-primary shadow-2xs'
                        : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    বাংলা
                  </button>
                </div>
              </div>
            </div>

            {/* ZONE 2: Independently Scrollable Categorized Navigation Body */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar px-3 py-3.5 space-y-5">
              {menuGroups.map((group) => (
                <div key={group.id} className="space-y-1">
                  <p className="px-3 text-xs leading-4 font-semibold text-content-muted">
                    {language === 'BN' ? group.titleBn : group.title}
                  </p>
                  <nav aria-label={group.title} className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.matchScreens
                        ? item.matchScreens.includes(currentScreen)
                        : currentScreen === item.screen;

                      return (
                        <button
                          key={item.label}
                          type="button"
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => handleNavigate(item.screen)}
                          className={`group relative w-full min-h-[44px] px-3 rounded-lg flex items-center justify-between gap-3 text-sm leading-5 transition-colors text-left ${
                            isActive
                              ? 'bg-brand-subtle text-brand-primary font-semibold'
                              : 'text-content-secondary font-medium hover:bg-app-subtle hover:text-content-primary'
                          }`}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="sideDrawerActiveBar"
                              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-brand-primary"
                            />
                          )}

                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive
                                  ? 'text-brand-primary stroke-[2.2]'
                                  : 'text-content-muted group-hover:text-content-primary'
                              }`}
                            />
                            <span className="truncate">
                              {language === 'BN' ? item.labelBn : item.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {typeof item.badge === 'number' && item.badge > 0 && (
                              <span
                                className={`tabular-nums text-xs leading-4 font-semibold ${
                                  isActive
                                    ? 'text-brand-primary'
                                    : 'text-content-secondary'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 ${
                                isActive
                                  ? 'text-brand-primary'
                                  : 'text-content-muted group-hover:text-content-secondary'
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            {/* ZONE 3: Clean Sticky Footer with Landed Cost Trust & 44px Sign Out */}
            <div className="shrink-0 p-3 bg-app-bg border-t border-app-border space-y-2">
              <div className="px-3 py-2 flex items-center gap-2.5 text-content-secondary">
                <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
                <p className="text-xs leading-4 truncate">
                  {language === 'BN'
                    ? '১০০% ল্যান্ডেড প্রাইস · ডিউটি ও ১৫% ভ্যাট অন্তর্ভুক্ত'
                    : '100% Landed Price · Duty & 15% VAT included'}
                </p>
              </div>

              <button
                type="button"
                onClick={logoutUser}
                className="w-full min-h-[44px] px-3 rounded-lg bg-white border border-app-border hover:border-promo-border hover:bg-promo-subtle flex items-center justify-between text-xs leading-4 font-semibold text-promo-accent transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'BN' ? 'লগ আউট করুন' : 'Sign Out'}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-promo-accent" />
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

