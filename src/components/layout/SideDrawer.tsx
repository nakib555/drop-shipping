import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bell,
  BookOpen,
  CreditCard,
  Globe,
  Heart,
  HelpCircle,
  Home,
  LogOut,
  MapPin,
  Package,
  Play,
  Settings,
  X,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { ScreenId } from '../../types/deshimart';

export const SideDrawer: React.FC = () => {
  const {
    drawerOpen,
    setDrawerOpen,
    user,
    navigateTo,
    logoutUser,
    currency,
    setCurrency,
    language,
    setLanguage,
  } = useDeshiMart();

  const menuItems: { label: string; labelBn: string; screen: ScreenId; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Home', labelBn: 'হোম', screen: 'home', icon: Home },
    { label: 'My Orders', labelBn: 'আমার অর্ডার', screen: 'orders', icon: Package },
    { label: 'Wishlist', labelBn: 'উইশলিস্ট', screen: 'wishlist', icon: Heart },
    { label: 'Saved Addresses', labelBn: 'ঠিকানা', screen: 'addresses', icon: MapPin },
    { label: 'Payment Methods', labelBn: 'পেমেন্ট মাধ্যম', screen: 'payment_methods', icon: CreditCard },
    { label: 'Notifications', labelBn: 'নোটিফিকেশন', screen: 'notifications', icon: Bell },
    { label: 'Buying Guides', labelBn: 'শপিং গাইড ও ব্লগ', screen: 'guides', icon: BookOpen },
    { label: 'Help & 24/7 Support', labelBn: 'হেল্প ও সাপোর্ট', screen: 'support', icon: HelpCircle },
    { label: 'Settings & Preferences', labelBn: 'সেটিংস ও কারেন্সি', screen: 'settings', icon: Settings },
    { label: 'Replay Intro Walkthrough', labelBn: 'অনবোর্ডিং দেখুন', screen: 'splash', icon: Play },
  ];

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="absolute inset-0 z-50 flex">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
          />

          {/* Slide-Out Drawer Content */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="relative z-10 w-72 max-w-[82%] bg-white h-full shadow-2xl flex flex-col justify-between p-4 overflow-y-auto"
          >
            <div>
              {/* Top User Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {user.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{user.fullName}</h2>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setDrawerOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Currency & Language Switchers */}
              <div className="my-3 space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                    <Globe className="w-4 h-4 text-[#059669]" />
                    <span>{language === 'BN' ? 'কারেন্সি' : 'Currency'}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setCurrency('BDT')}
                      className={`px-2 py-1 rounded-md text-[11px] font-mono-num font-semibold transition-colors ${
                        currency === 'BDT'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      ৳ BDT
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('USD')}
                      className={`px-2 py-1 rounded-md text-[11px] font-mono-num font-semibold transition-colors ${
                        currency === 'USD'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      $ USD
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">
                    {language === 'BN' ? 'ভাষা (Language)' : 'Language'}
                  </span>
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setLanguage('EN')}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        language === 'EN'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('BN')}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        language === 'BN'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      বাংলা
                    </button>
                  </div>
                </div>
              </div>

              {/* Staggered Navigation List */}
              <nav className="space-y-1 mt-2">
                {menuItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      type="button"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02, duration: 0.15 }}
                      onClick={() => navigateTo(item.screen)}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-3 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="truncate">
                        {language === 'BN' ? item.labelBn : item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Logout & Trust Footer */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={logoutUser}
                className="w-full h-10 px-3 rounded-xl flex items-center gap-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === 'BN' ? 'লগ আউট' : 'Sign Out'}</span>
              </button>
              <p className="mt-2 text-[11px] text-slate-400 px-3">
                DeshiMart · Landed Cost Included
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
