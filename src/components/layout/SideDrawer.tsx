import React from 'react';
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

  if (!drawerOpen) return null;

  const menuItems: { label: string; labelBn: string; screen: ScreenId; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Home', labelBn: 'হোম', screen: 'home', icon: Home },
    { label: 'My Orders', labelBn: 'আমার অর্ডার', screen: 'orders', icon: Package },
    { label: 'Wishlist', labelBn: 'উইশলিস্ট', screen: 'wishlist', icon: Heart },
    { label: 'Addresses', labelBn: 'ঠিকানা', screen: 'addresses', icon: MapPin },
    { label: 'Payment Methods', labelBn: 'পেমেন্ট মাধ্যম', screen: 'payment_methods', icon: CreditCard },
    { label: 'Notifications', labelBn: 'নোটিফিকেশন', screen: 'notifications', icon: Bell },
    { label: 'Shopping Guides & Blog', labelBn: 'শপিং গাইড ও ব্লগ', screen: 'guides', icon: BookOpen },
    { label: 'Help & Support', labelBn: 'হেল্প ও সাপোর্ট', screen: 'support', icon: HelpCircle },
    { label: 'Settings & Currency', labelBn: 'সেটিংস ও কারেন্সি', screen: 'settings', icon: Settings },
    { label: 'Replay Animated Onboarding', labelBn: 'অ্যানিমেটেড অনবোর্ডিং দেখুন', screen: 'splash', icon: Play },
  ];

  return (
    <div className="absolute inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Content */}
      <aside className="relative z-10 w-72 max-w-[82%] bg-white h-full shadow-2xl flex flex-col justify-between p-4 overflow-y-auto">
        <div>
          {/* Top User Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#0EA75F] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                JD
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0B3D2E]">{user.fullName}</h2>
                <p className="text-xs text-[#6B7280]">{user.email}</p>
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
            <div className="p-2.5 rounded-xl bg-[#F1F5F9] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0B3D2E]">
                <Globe className="w-4 h-4 text-[#0EA75F]" />
                <span>{language === 'BN' ? 'কারেন্সি' : 'Currency'}</span>
              </div>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrency('BDT')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    currency === 'BDT'
                      ? 'bg-[#0EA75F] text-white'
                      : 'text-[#6B7280] hover:text-[#0B3D2E]'
                  }`}
                >
                  ৳ BDT
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    currency === 'USD'
                      ? 'bg-[#0EA75F] text-white'
                      : 'text-[#6B7280] hover:text-[#0B3D2E]'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F1F5F9] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0B3D2E]">
                {language === 'BN' ? 'ভাষা (Language)' : 'Language (ভাষা)'}
              </span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLanguage('EN')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    language === 'EN'
                      ? 'bg-[#0EA75F] text-white'
                      : 'text-[#6B7280] hover:text-[#0B3D2E]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('BN')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    language === 'BN'
                      ? 'bg-[#0EA75F] text-white'
                      : 'text-[#6B7280] hover:text-[#0B3D2E]'
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>
          </div>

          {/* Navigation List */}
          <nav className="space-y-1 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigateTo(item.screen)}
                  className="w-full h-10 px-3 rounded-xl flex items-center gap-3 text-xs font-semibold text-[#0B3D2E] hover:bg-[#ECFDF5] hover:text-[#0EA75F] transition-colors text-left"
                >
                  <Icon className="w-4 h-4 text-[#0EA75F]" />
                  <span className="truncate">
                    {language === 'BN' ? item.labelBn : item.label}
                  </span>
                </button>
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
            <span>{language === 'BN' ? 'লগ আউট' : 'Log Out'}</span>
          </button>
          <p className="mt-2.5 text-[11px] text-[#6B7280] px-3">
            DeshiMart™ · Global Products → Your Door
          </p>
        </div>
      </aside>
    </div>
  );
};
