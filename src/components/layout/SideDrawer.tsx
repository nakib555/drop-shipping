import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bell,
  BookOpen,
  Camera,
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
          label: 'Visual & Link Scanner',
          labelBn: 'ভিজ্যুয়াল ও লিংক স্ক্যানার',
          screen: 'visual_scan',
          matchScreens: ['visual_scan'],
          icon: Camera,
        },
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
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs"
          />

          {/* Professional 3-Zone Architectural Slide-Out Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[312px] max-w-[86%] bg-white h-full shadow-[16px_0_48px_-12px_rgba(15,23,42,0.22)] border-r border-slate-200/80 flex flex-col overflow-hidden"
          >
            {/* ZONE 1: Clean Editorial Profile & Preferences Header */}
            <div className="shrink-0 bg-[#F8FAFC] border-b border-slate-200/80 px-4 pt-4 pb-3.5 space-y-3.5">
              {/* Top Profile Row + 44x44 Close Hitbox */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => navigateTo('account')}
                  className="flex items-center gap-3 text-left group min-w-0 flex-1 py-0.5 focus-visible:outline-none"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#0F172A] text-white font-semibold text-xs flex items-center justify-center shrink-0 ring-2 ring-[#059669]/25 group-hover:bg-[#059669] transition-colors">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm leading-5 font-semibold text-slate-900 truncate group-hover:text-[#059669] transition-colors">
                      {user.fullName}
                    </h2>
                    {/* Clean unboxed metadata with middle-dot separator */}
                    <div className="flex items-center gap-1.5 text-[11px] leading-4 text-slate-500 truncate mt-0.5">
                      <span className="text-[#059669] font-medium">
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
                  className="min-w-[44px] min-h-[44px] -mr-1.5 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Quick-Access Summary Bar (Orders · Wishlist · Bag) */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => navigateTo('orders')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-left transition-colors"
                >
                  <span className="block font-mono-num text-sm leading-5 font-semibold text-slate-900">
                    {orders.length}
                  </span>
                  <span className="block text-[11px] leading-3.5 text-slate-500 mt-0.5 truncate">
                    {language === 'BN' ? 'অর্ডার' : 'Orders'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('wishlist')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-left transition-colors"
                >
                  <span className="block font-mono-num text-sm leading-5 font-semibold text-slate-900">
                    {wishlist.length}
                  </span>
                  <span className="block text-[11px] leading-3.5 text-slate-500 mt-0.5 truncate">
                    {language === 'BN' ? 'উইশলিস্ট' : 'Saved'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('cart')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-left transition-colors"
                >
                  <span className="block font-mono-num text-sm leading-5 font-semibold text-[#059669]">
                    {cartCount}
                  </span>
                  <span className="block text-[11px] leading-3.5 text-slate-500 mt-0.5 truncate">
                    {language === 'BN' ? 'ব্যাগ' : 'In Bag'}
                  </span>
                </button>
              </div>

              {/* Dual Segmented Controls: Currency & Language */}
              <div className="grid grid-cols-2 gap-2">
                {/* Currency Segmented Control */}
                <div className="bg-slate-200/75 rounded-xl p-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => setCurrency('BDT')}
                    className={`flex-1 h-8 rounded-lg text-xs font-mono-num font-semibold transition-all whitespace-nowrap ${
                      currency === 'BDT'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ৳ BDT
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`flex-1 h-8 rounded-lg text-xs font-mono-num font-semibold transition-all whitespace-nowrap ${
                      currency === 'USD'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    $ USD
                  </button>
                </div>

                {/* Language Segmented Control */}
                <div className="bg-slate-200/75 rounded-xl p-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => setLanguage('EN')}
                    className={`flex-1 h-8 rounded-lg text-xs font-semibold transition-all inline-flex items-center justify-center gap-1 whitespace-nowrap ${
                      language === 'EN'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>EN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('BN')}
                    className={`flex-1 h-8 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      language === 'BN'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
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
                  {/* Natural Title Case section heading (no all-caps shouting) */}
                  <p className="px-3 text-xs leading-4 font-semibold text-slate-400">
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
                          onClick={() => navigateTo(item.screen)}
                          className={`group relative w-full min-h-[44px] px-3 rounded-xl flex items-center justify-between gap-3 text-xs leading-4 transition-colors text-left ${
                            isActive
                              ? 'bg-emerald-50/80 text-[#059669] font-semibold'
                              : 'text-slate-700 font-medium hover:bg-slate-100/80 hover:text-slate-900'
                          }`}
                        >
                          {/* Active Left Indicator Bar */}
                          {isActive && (
                            <motion.span
                              layoutId="sideDrawerActiveBar"
                              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-[#059669]"
                            />
                          )}

                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive
                                  ? 'text-[#059669] stroke-[2.2]'
                                  : 'text-slate-400 group-hover:text-slate-700'
                              }`}
                            />
                            <span className="truncate">
                              {language === 'BN' ? item.labelBn : item.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {typeof item.badge === 'number' && item.badge > 0 && (
                              <span
                                className={`font-mono-num text-xs leading-4 font-semibold ${
                                  item.badgeTone === 'emerald' || isActive
                                    ? 'text-[#059669]'
                                    : 'text-slate-500'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 ${
                                isActive
                                  ? 'text-[#059669]'
                                  : 'text-slate-300 group-hover:text-slate-400'
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
            <div className="shrink-0 p-3 bg-[#F8FAFC] border-t border-slate-200/80 space-y-2">
              <div className="px-3 py-2 flex items-center gap-2.5 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
                <p className="text-[11px] leading-4 truncate">
                  {language === 'BN'
                    ? '১০০% ল্যান্ডেড প্রাইস · ডিউটি ও ১৫% ভ্যাট অন্তর্ভুক্ত'
                    : '100% Landed Price · Duty & 15% VAT included'}
                </p>
              </div>

              <button
                type="button"
                onClick={logoutUser}
                className="w-full min-h-[44px] px-3 rounded-xl bg-white border border-slate-200/80 hover:border-rose-200 hover:bg-rose-50/60 flex items-center justify-between text-xs leading-4 font-semibold text-rose-600 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'BN' ? 'লগ আউট করুন' : 'Sign Out'}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

