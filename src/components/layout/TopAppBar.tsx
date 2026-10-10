import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Globe,
  Heart,
  MapPin,
  Search,
  Settings,
  Share2,
  ShoppingBag,
  ShoppingCart,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { CATEGORIES } from '../../data/catalogData';
import { EXCHANGE_RATE_SNAPSHOT } from '../../utils/pricingEngine';

export const TopAppBar: React.FC = () => {
  const {
    currentScreen,
    goBack,
    navigateTo,
    cartCount,
    unreadNotificationCount,
    markAllNotificationsRead,
    selectedCategoryId,
    selectedProduct,
    toggleWishlist,
    wishlist,
    language,
    setLanguage,
    experienceMode,
    setExperienceMode,
    currency,
    setCurrency,
    addresses,
    selectedAddressId,
    showToast,
  } = useDeshiMart();

  const [utilityMenuOpen, setUtilityMenuOpen] = useState(false);
  const utilityMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!utilityMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        utilityMenuRef.current &&
        !utilityMenuRef.current.contains(e.target as Node)
      ) {
        setUtilityMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [utilityMenuOpen]);

  if (
    currentScreen === 'splash' ||
    currentScreen === 'onboarding' ||
    currentScreen === 'auth'
  ) {
    return null;
  }

  const isHome = currentScreen === 'home';
  const isNotifications = currentScreen === 'notifications';
  const isBn = language === 'BN';

  const activeAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];
  const deliveryCityLabel = activeAddress
    ? activeAddress.city
    : isBn
    ? 'ঢাকা'
    : 'Dhaka';

  const getScreenTitle = (): string => {
    switch (currentScreen) {
      case 'categories':
        return isBn ? 'সকল ক্যাটাগরি' : 'Categories';
      case 'category_products': {
        if (selectedCategoryId === 'all') {
          return isBn ? 'সকল পণ্য' : 'All Products';
        }
        const cat = CATEGORIES.find((c) => c.id === selectedCategoryId);
        return cat ? (isBn ? cat.nameBn : cat.name) : isBn ? 'পণ্যসমূহ' : 'Products';
      }
      case 'product_detail':
        return isBn ? 'পণ্যের বিবরণ' : 'Product Details';
      case 'price_tracker':
        return isBn ? 'প্রাইস হিস্ট্রি' : 'Price History';
      case 'seller_compare':
        return isBn ? 'রুট তুলনা' : 'Route Compare';
      case 'spec_compare':
        return isBn ? 'স্পেসিফিকেশন তুলনা' : 'Spec Compare';
      case 'cart':
        return isBn
          ? cartCount > 0
            ? `আমার কার্ট (${cartCount})`
            : 'আমার কার্ট'
          : cartCount > 0
          ? `My Cart (${cartCount})`
          : 'My Cart';
      case 'checkout_shipping':
        return isBn ? 'ডেলিভারি ঠিকানা (১/৪)' : 'Delivery Address (1/4)';
      case 'checkout_delivery':
        return isBn ? 'ডেলিভারি পদ্ধতি (২/৪)' : 'Delivery Method (2/4)';
      case 'checkout_payment':
        return isBn ? 'পেমেন্ট মাধ্যম (৩/৪)' : 'Payment Method (3/4)';
      case 'checkout_review':
        return isBn ? 'অর্ডার রিভিউ (৪/৪)' : 'Order Review (4/4)';
      case 'order_success':
        return isBn ? 'অর্ডার নিশ্চিতকরণ' : 'Order Confirmation';
      case 'orders':
        return isBn ? 'আমার অর্ডার' : 'My Orders';
      case 'order_tracking':
        return isBn ? 'অর্ডার ট্র্যাকিং' : 'Order Tracking';
      case 'account':
        return isBn ? 'আমার অ্যাকাউন্ট' : 'Account';
      case 'addresses':
        return isBn ? 'সংরক্ষিত ঠিকানা' : 'Addresses';
      case 'payment_methods':
        return isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Methods';
      case 'supplier_store':
        return selectedProduct.supplierName || (isBn ? 'সাপ্লায়ার স্টোর' : 'Supplier Store');
      case 'wishlist':
        return isBn ? 'উইশলিস্ট' : 'Wishlist';
      case 'notifications':
        return isBn ? 'নোটিফিকেশন' : 'Notifications';
      case 'support':
        return isBn ? 'হেল্প ও সাপোর্ট' : 'Help & Support';
      case 'settings':
        return isBn ? 'সেটিংস' : 'Settings';
      case 'guides':
        return isBn ? 'শপিং গাইড' : 'Shopping Guide';
      case 'admin_dashboard':
        return isBn ? 'অ্যাডমিন কনসোল' : 'Admin Console';
      default:
        return isBn ? 'দেশিমার্ট' : 'DeshiMart';
    }
  };

  const isProductLiked = wishlist.includes(selectedProduct.id);
  const screenTitle = getScreenTitle();

  const handleShareProduct = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    showToast(
      isBn
        ? `${selectedProduct.name} এর লিংক কপি করা হয়েছে`
        : `Link copied for ${selectedProduct.name}`,
      'info'
    );
  };

  const isBangladeshMode = experienceMode === 'bangladesh';

  return (
    <header
      role="banner"
      className={`sticky top-0 z-30 h-14 px-3.5 sm:px-4 backdrop-blur border-b flex items-center justify-between gap-2 shrink-0 select-none relative overflow-hidden transition-colors duration-300 ${
        isBangladeshMode
          ? 'bg-[#006A4E] border-[#00523C] text-[#FFFDF9] dm-nakshi-stitch-bottom'
          : 'bg-white/95 border-app-border text-content-primary'
      }`}
    >
      {/* Subtle Jamdani Geometric Watermark in Bangladesh Vibe Mode */}
      {isBangladeshMode && (
        <svg
          aria-hidden="true"
          viewBox="0 0 120 56"
          fill="none"
          className="pointer-events-none absolute right-16 top-0 h-full w-28 opacity-15"
        >
          <path
            d="M28 8L48 28L28 48L8 28L28 8Z"
            stroke="#FFFDF9"
            strokeWidth="1.2"
          />
          <path
            d="M84 8L104 28L84 48L64 28L84 8Z"
            stroke="#FDE68A"
            strokeWidth="1.2"
          />
          <circle cx="28" cy="28" r="5" fill="#F42A41" />
          <circle cx="84" cy="28" r="4" fill="#FFFDF9" />
        </svg>
      )}

      {/* Left Zone: Clean Single-Line Brand or Back Button + Screen Title */}
      <div className="flex items-center gap-2 min-w-0 flex-1 relative z-10">
        {isHome ? (
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              aria-label={isBn ? 'দেশিমার্ট হোম' : 'DeshiMart Home'}
              onClick={() => navigateTo('home')}
              className={`relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 ${
                isBangladeshMode
                  ? 'bg-[#FFFDF9] text-[#006A4E] focus-visible:ring-white shadow-xs'
                  : 'bg-brand-primary text-white focus-visible:ring-brand-primary'
              }`}
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              {isBangladeshMode && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#F42A41] ring-2 ring-[#006A4E]"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => navigateTo('home')}
              className={`text-[15px] sm:text-base font-bold tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-none ${
                isBangladeshMode ? 'text-[#FFFDF9]' : 'text-content-primary'
              }`}
            >
              {isBn ? 'দেশিমার্ট' : 'DeshiMart'}
            </button>

            <button
              type="button"
              aria-label={
                isBn
                  ? `ডেলিভারি অবস্থান: ${deliveryCityLabel}`
                  : `Delivery location: ${deliveryCityLabel}`
              }
              onClick={() => navigateTo('addresses')}
              className={`flex items-center gap-1 max-w-[108px] sm:max-w-[140px] h-7 px-2 rounded-md text-xs font-medium transition-colors min-w-0 ${
                isBangladeshMode
                  ? 'bg-white/15 hover:bg-white/25 text-[#FFFDF9]'
                  : 'bg-app-subtle hover:bg-slate-200/70 text-content-secondary hover:text-content-primary'
              }`}
            >
              <MapPin
                className={`w-3 h-3 shrink-0 ${
                  isBangladeshMode ? 'text-[#FDE68A]' : 'text-brand-primary'
                }`}
              />
              <span className="truncate">{deliveryCityLabel}</span>
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              aria-label={isBn ? 'পেছনে যান' : 'Go back'}
              onClick={goBack}
              className={`w-9 h-9 -ml-1 rounded-lg flex items-center justify-center active:scale-95 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 ${
                isBangladeshMode
                  ? 'text-[#FFFDF9] hover:bg-white/15 focus-visible:ring-white'
                  : 'text-content-primary hover:bg-app-subtle focus-visible:ring-brand-primary'
              }`}
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>

            <h1
              className={`text-sm font-bold tracking-tight truncate ${
                isBangladeshMode ? 'text-[#FFFDF9]' : 'text-content-primary'
              }`}
            >
              {screenTitle}
            </h1>
          </>
        )}
      </div>

      {/* Right Zone: Clean Contextual Utility Actions */}
      <div className="flex items-center gap-1 shrink-0 relative z-10">
        {isHome && (
          <div ref={utilityMenuRef} className="relative flex items-center gap-1">
            {/* Compact combined Currency & Language control that fits 320px-414px cleanly */}
            <button
              type="button"
              aria-label={
                isBn
                  ? 'মুদ্রা, ভাষা ও অভিজ্ঞতা মোড পরিবর্তন করুন'
                  : 'Currency, language, and experience mode preferences'
              }
              aria-expanded={utilityMenuOpen}
              onClick={() => setUtilityMenuOpen((prev) => !prev)}
              className={`h-8 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 ${
                isBangladeshMode
                  ? 'bg-white/15 hover:bg-white/25 text-[#FFFDF9] focus-visible:ring-white'
                  : 'bg-app-subtle hover:bg-slate-200/70 text-content-primary focus-visible:ring-brand-primary'
              }`}
            >
              <Globe
                className={`w-3.5 h-3.5 shrink-0 ${
                  isBangladeshMode ? 'text-[#FDE68A]' : 'text-brand-primary'
                }`}
              />
              <span className="font-mono-num">
                {currency === 'BDT' ? '৳' : '$'}
              </span>
              <span
                aria-hidden="true"
                className={isBangladeshMode ? 'text-white/60' : 'text-content-muted'}
              >
                ·
              </span>
              <span>{language === 'EN' ? 'EN' : 'বাং'}</span>
            </button>

            {utilityMenuOpen && (
              <div
                role="dialog"
                aria-label={isBn ? 'মুদ্রা ও ভাষা সেটিংস' : 'Region & Currency Preferences'}
                className="absolute right-0 top-10 z-50 w-60 rounded-xl bg-white border border-app-border shadow-lg p-3 space-y-3 text-left"
              >
                <div className="space-y-1.5">
                  <span className="block text-[11px] font-semibold text-content-secondary">
                    {isBn ? 'ভাষা (Language)' : 'Interface Language'}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('EN');
                        setUtilityMenuOpen(false);
                      }}
                      className={`h-8 rounded-lg text-xs font-semibold transition-colors border ${
                        language === 'EN'
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-app-subtle text-content-primary border-transparent hover:border-app-border'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('BN');
                        setUtilityMenuOpen(false);
                      }}
                      className={`h-8 rounded-lg text-xs font-semibold transition-colors border ${
                        language === 'BN'
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-app-subtle text-content-primary border-transparent hover:border-app-border'
                      }`}
                    >
                      বাংলা
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-app-border">
                  <span className="block text-[11px] font-semibold text-content-secondary">
                    {isBn ? 'প্রদর্শিত মুদ্রা (Display Currency)' : 'Display Currency'}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency('BDT');
                        setUtilityMenuOpen(false);
                        showToast(
                          isBn
                            ? 'মূল্য ৳ BDT-তে দেখানো হচ্ছে'
                            : 'Showing prices in ৳ BDT (Settlement Currency)',
                          'info'
                        );
                      }}
                      className={`h-8 rounded-lg text-xs font-mono-num font-semibold transition-colors border ${
                        currency === 'BDT'
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-app-subtle text-content-primary border-transparent hover:border-app-border'
                      }`}
                    >
                      ৳ BDT
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency('USD');
                        setUtilityMenuOpen(false);
                        showToast(
                          isBn
                            ? `আনুমানিক হার: $1 = ৳${EXCHANGE_RATE_SNAPSHOT.bdtPerUsd} (চেকআউট BDT-তে)`
                            : `Indicative display: $1 = ৳${EXCHANGE_RATE_SNAPSHOT.bdtPerUsd} (Checkout settles in BDT)`,
                          'info'
                        );
                      }}
                      className={`h-8 rounded-lg text-xs font-mono-num font-semibold transition-colors border ${
                        currency === 'USD'
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-app-subtle text-content-primary border-transparent hover:border-app-border'
                      }`}
                    >
                      $ USD (Est.)
                    </button>
                  </div>
                  <p className="text-[10px] leading-3.5 text-content-secondary pt-0.5">
                    {isBn
                      ? `আনুমানিক বিনিময় হার: $1 = ৳${EXCHANGE_RATE_SNAPSHOT.bdtPerUsd} (${EXCHANGE_RATE_SNAPSHOT.asOfDate})। অর্ডার পেমেন্ট ৳ BDT-তে সম্পন্ন হয়।`
                      : `Indicative rate: $1 = ৳${EXCHANGE_RATE_SNAPSHOT.bdtPerUsd} (${EXCHANGE_RATE_SNAPSHOT.asOfDate}). All orders settle in ৳ BDT.`}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-app-border">
                  <span className="block text-[11px] font-semibold text-content-secondary">
                    {isBn ? 'অভিজ্ঞতা মোড (Experience Mode)' : 'Experience Mode'}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setExperienceMode('global');
                        setUtilityMenuOpen(false);
                      }}
                      className={`h-8 rounded-lg text-xs font-semibold transition-colors border ${
                        experienceMode === 'global'
                          ? 'bg-[#0F172A] text-white border-[#0F172A]'
                          : 'bg-app-subtle text-content-primary border-transparent hover:border-app-border'
                      }`}
                    >
                      Global
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExperienceMode('bangladesh');
                        setUtilityMenuOpen(false);
                      }}
                      className={`h-8 rounded-lg text-xs font-semibold transition-colors border ${
                        experienceMode === 'bangladesh'
                          ? 'bg-[#006A4E] text-white border-[#006A4E]'
                          : 'bg-app-subtle text-content-primary border-transparent hover:border-app-border'
                      }`}
                    >
                      বাংলাদেশ 🇧🇩
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentScreen === 'product_detail' && (
          <>
            <button
              type="button"
              aria-label={isBn ? 'খুঁজুন' : 'Search products'}
              onClick={() => navigateTo('categories')}
              className={`w-9 h-9 rounded-lg flex items-center justify-center active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 ${
                isBangladeshMode
                  ? 'text-[#FFFDF9] hover:bg-white/15 focus-visible:ring-white'
                  : 'text-content-primary hover:bg-app-subtle focus-visible:ring-brand-primary'
              }`}
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            <button
              type="button"
              aria-label={isBn ? 'উইশলিস্টে যোগ করুন' : 'Toggle wishlist'}
              onClick={() => toggleWishlist(selectedProduct.id)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 ${
                isBangladeshMode
                  ? 'text-[#FFFDF9] hover:bg-white/15 focus-visible:ring-white'
                  : 'text-content-primary hover:bg-app-subtle focus-visible:ring-brand-primary'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isProductLiked
                    ? isBangladeshMode
                      ? 'fill-[#F42A41] text-[#F42A41]'
                      : 'fill-brand-primary text-brand-primary'
                    : isBangladeshMode
                    ? 'text-[#FFFDF9] stroke-[2]'
                    : 'text-content-primary stroke-[2]'
                }`}
              />
            </button>

            <button
              type="button"
              aria-label={isBn ? 'শেয়ার করুন' : 'Share product'}
              onClick={handleShareProduct}
              className={`w-9 h-9 rounded-lg flex items-center justify-center active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 ${
                isBangladeshMode
                  ? 'text-[#FFFDF9] hover:bg-white/15 focus-visible:ring-white'
                  : 'text-content-primary hover:bg-app-subtle focus-visible:ring-brand-primary'
              }`}
            >
              <Share2 className="w-4 h-4 stroke-[2]" />
            </button>

            <button
              type="button"
              aria-label={
                cartCount > 0
                  ? `Shopping cart with ${cartCount} items`
                  : 'Shopping cart'
              }
              onClick={() => navigateTo('cart')}
              className={`relative w-9 h-9 rounded-lg flex items-center justify-center active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 ${
                isBangladeshMode
                  ? 'text-[#FFFDF9] hover:bg-white/15 focus-visible:ring-white'
                  : 'text-content-primary hover:bg-app-subtle focus-visible:ring-brand-primary'
              }`}
            >
              <ShoppingCart className="w-4 h-4 stroke-[2]" />
              {cartCount > 0 && (
                <span
                  className={`absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full text-white tabular-nums text-[9px] leading-none font-bold flex items-center justify-center ${
                    isBangladeshMode ? 'bg-[#F42A41]' : 'bg-brand-primary'
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </>
        )}

        {currentScreen === 'cart' && (
          <button
            type="button"
            aria-label={
              wishlist.length > 0
                ? `${isBn ? 'উইশলিস্ট' : 'Wishlist'} (${wishlist.length})`
                : isBn
                ? 'উইশলিস্ট'
                : 'Wishlist'
            }
            onClick={() => navigateTo('wishlist')}
            className={`relative w-10 h-10 rounded-lg flex items-center justify-center active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 ${
              isBangladeshMode
                ? 'text-[#FFFDF9] hover:bg-white/15 focus-visible:ring-white'
                : 'text-content-primary hover:bg-app-subtle focus-visible:ring-brand-primary'
            }`}
          >
            <Heart className="w-4 h-4 stroke-[2]" />
            {wishlist.length > 0 && (
              <span
                className={`absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-1 rounded-full text-white tabular-nums text-[9px] leading-none font-bold flex items-center justify-center ${
                  isBangladeshMode ? 'bg-[#F42A41]' : 'bg-brand-primary'
                }`}
              >
                {wishlist.length}
              </span>
            )}
          </button>
        )}

        {isNotifications && unreadNotificationCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap ${
              isBangladeshMode
                ? 'bg-white/15 text-[#FFFDF9] hover:bg-white/25'
                : 'text-brand-primary hover:bg-brand-subtle'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{isBn ? 'সব পঠিত' : 'Mark Read'}</span>
          </button>
        )}

        {isNotifications ? (
          <button
            type="button"
            aria-label={isBn ? 'নোটিফিকেশন সেটিংস' : 'Alert preferences'}
            onClick={() => navigateTo('settings')}
            className={`w-9 h-9 rounded-lg flex items-center justify-center active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 ${
              isBangladeshMode
                ? 'text-[#FFFDF9] hover:bg-white/15 focus-visible:ring-white'
                : 'text-content-primary hover:bg-app-subtle focus-visible:ring-brand-primary'
            }`}
          >
            <Settings className="w-4 h-4 stroke-[2]" />
          </button>
        ) : currentScreen !== 'product_detail' ? (
          <button
            type="button"
            aria-label={
              unreadNotificationCount > 0
                ? `${unreadNotificationCount} unread notifications`
                : 'Notifications'
            }
            onClick={() => navigateTo('notifications')}
            className={`relative w-9 h-9 rounded-lg flex items-center justify-center active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 ${
              isBangladeshMode
                ? 'text-[#FFFDF9] hover:bg-white/15 focus-visible:ring-white'
                : 'text-content-primary hover:bg-app-subtle focus-visible:ring-brand-primary'
            }`}
          >
            <Bell className="w-4 h-4 stroke-[2]" />
            {unreadNotificationCount > 0 && (
              <span
                className={`absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-1 rounded-full text-white tabular-nums text-[9px] leading-none font-bold flex items-center justify-center ${
                  isBangladeshMode ? 'bg-[#F42A41]' : 'bg-brand-primary'
                }`}
              >
                {unreadNotificationCount}
              </span>
            )}
          </button>
        ) : null}
      </div>
    </header>
  );
};
