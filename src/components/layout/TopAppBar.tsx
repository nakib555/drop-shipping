import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bell,
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
// Clean production TopAppBar — zero Cultural Vibe switcher UI

export const TopAppBar: React.FC = () => {
  const {
    currentScreen,
    goBack,
    navigateTo,
    cartCount,
    unreadNotificationCount,
    selectedCategoryId,
    selectedProduct,
    toggleWishlist,
    wishlist,
    language,
    setLanguage,
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

  return (
    <header
      role="banner"
      className="sticky top-0 z-30 pt-[env(safe-area-inset-top,0px)] bg-white/95 backdrop-blur border-b border-app-border shrink-0 select-none"
    >
      <div className="h-14 px-3.5 sm:px-4 flex items-center justify-between gap-2">
        {/* Left Zone: Clean Single-Line Brand or Back Button + Screen Title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isHome ? (
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                aria-label={isBn ? 'দেশিমার্ট হোম' : 'DeshiMart Home'}
                onClick={() => navigateTo('home')}
                className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              </button>

              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="text-[15px] font-bold tracking-tight text-content-primary whitespace-nowrap shrink-0 focus-visible:outline-none"
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
                className="flex items-center gap-1 max-w-[112px] sm:max-w-[140px] h-7 px-2.5 rounded-lg bg-app-subtle hover:bg-slate-200/70 text-xs font-medium text-content-secondary hover:text-content-primary transition-colors min-w-0"
              >
                <MapPin className="w-3 h-3 text-brand-primary shrink-0" />
                <span className="truncate">{deliveryCityLabel}</span>
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                aria-label={isBn ? 'পেছনে যান' : 'Go back'}
                onClick={goBack}
                className="w-9 h-9 -ml-1 rounded-xl flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <ArrowLeft className="w-[18px] h-[18px] stroke-[2.1]" />
              </button>

              <h1 className="text-[15px] font-bold tracking-tight text-content-primary truncate">
                {screenTitle}
              </h1>
            </>
          )}
        </div>

        {/* Right Zone: Uniform 36x36 Contextual Utility Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {isHome && (
            <div ref={utilityMenuRef} className="relative flex items-center gap-1">
              <button
                type="button"
                aria-label={
                  isBn
                    ? 'মুদ্রা ও ভাষা পরিবর্তন করুন'
                    : 'Currency and language preferences'
                }
                aria-expanded={utilityMenuOpen}
                onClick={() => setUtilityMenuOpen((prev) => !prev)}
                className="h-8 px-2.5 rounded-lg bg-app-subtle hover:bg-slate-200/70 text-[11px] font-semibold text-content-primary flex items-center gap-1 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <Globe className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span className="font-mono-num">
                  {currency === 'BDT' ? '৳' : '$'}
                </span>
                <span aria-hidden="true" className="text-content-muted">
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
                              : 'Showing prices in ৳ BDT',
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
                              ? `আনুমানিক হার: $1 = ৳${EXCHANGE_RATE_SNAPSHOT.bdtPerUsd}`
                              : `Indicative display: $1 = ৳${EXCHANGE_RATE_SNAPSHOT.bdtPerUsd}`,
                            'info'
                          );
                        }}
                        className={`h-8 rounded-lg text-xs font-mono-num font-semibold transition-colors border ${
                          currency === 'USD'
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : 'bg-app-subtle text-content-primary border-transparent hover:border-app-border'
                        }`}
                      >
                        $ USD
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
                className="w-9 h-9 rounded-xl flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <Search className="w-[18px] h-[18px] stroke-[2]" />
              </button>

              <button
                type="button"
                aria-label={isBn ? 'উইশলিস্টে যোগ করুন' : 'Toggle wishlist'}
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <Heart
                  className={`w-[18px] h-[18px] transition-colors ${
                    isProductLiked
                      ? 'fill-brand-primary text-brand-primary'
                      : 'text-content-primary stroke-[2]'
                  }`}
                />
              </button>

              <button
                type="button"
                aria-label={isBn ? 'শেয়ার করুন' : 'Share product'}
                onClick={handleShareProduct}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <Share2 className="w-[18px] h-[18px] stroke-[2]" />
              </button>

              <button
                type="button"
                aria-label={
                  cartCount > 0
                    ? `Shopping cart with ${cartCount} items`
                    : 'Shopping cart'
                }
                onClick={() => navigateTo('cart')}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <ShoppingCart className="w-[18px] h-[18px] stroke-[2]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-brand-primary text-white tabular-nums text-[10px] leading-none font-bold flex items-center justify-center ring-2 ring-white">
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
              className="relative w-9 h-9 rounded-xl hover:bg-app-subtle flex items-center justify-center text-content-primary active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Heart className="w-[18px] h-[18px] stroke-[2]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-brand-primary text-white tabular-nums text-[10px] leading-none font-bold flex items-center justify-center ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </button>
          )}

          {isNotifications ? (
            <button
              type="button"
              aria-label={isBn ? 'নোটিফিকেশন সেটিংস' : 'Alert preferences'}
              onClick={() => navigateTo('settings')}
              className="w-9 h-9 rounded-xl hover:bg-app-subtle flex items-center justify-center text-content-primary active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Settings className="w-[18px] h-[18px] stroke-[2]" />
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
              className="relative w-9 h-9 rounded-xl hover:bg-app-subtle flex items-center justify-center text-content-primary active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Bell className="w-[18px] h-[18px] stroke-[2]" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-brand-primary text-white tabular-nums text-[10px] leading-none font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};
