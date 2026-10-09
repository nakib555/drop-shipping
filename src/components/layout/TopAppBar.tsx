import React from 'react';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
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
    currency,
    setCurrency,
    addresses,
    selectedAddressId,
    showToast,
  } = useDeshiMart();

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
      className="sticky top-0 z-30 h-14 px-4 bg-white/95 backdrop-blur border-b border-app-border flex items-center justify-between gap-2 shrink-0 select-none"
    >
      {/* Left Zone: Clean Single-Line Brand or Back Button + Screen Title */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {isHome ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            </button>

            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-base font-bold tracking-tight text-content-primary whitespace-nowrap shrink-0 focus-visible:outline-none"
            >
              {isBn ? 'দেশিমার্ট' : 'DeshiMart'}
            </button>

            <button
              type="button"
              onClick={() => navigateTo('addresses')}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-app-subtle hover:bg-slate-200/70 text-xs font-medium text-content-secondary hover:text-content-primary transition-colors truncate"
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
              className="w-9 h-9 -ml-1 rounded-lg flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>

            <h1 className="text-sm font-bold tracking-tight text-content-primary truncate">
              {screenTitle}
            </h1>
          </>
        )}
      </div>

      {/* Right Zone: Clean Contextual Utility Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {isHome && (
          <>
            <button
              type="button"
              aria-label="Toggle currency between BDT and USD"
              onClick={() => {
                const next = currency === 'BDT' ? 'USD' : 'BDT';
                setCurrency(next);
                showToast(
                  next === 'BDT'
                    ? 'Showing prices in ৳ BDT'
                    : 'Showing prices in $ USD ($1 = ৳ 120)',
                  'info'
                );
              }}
              className="h-8 px-2.5 rounded-lg bg-app-subtle hover:bg-slate-200/70 text-xs font-mono-num font-semibold text-content-primary transition-colors whitespace-nowrap"
            >
              {currency === 'BDT' ? '৳ BDT' : '$ USD'}
            </button>

            <button
              type="button"
              aria-label={isBn ? 'ভাষা পরিবর্তন করুন' : 'Switch language'}
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="h-8 px-2.5 rounded-lg bg-app-subtle hover:bg-slate-200/70 text-xs font-semibold text-content-primary transition-colors whitespace-nowrap"
            >
              {language === 'EN' ? 'বাং' : 'EN'}
            </button>
          </>
        )}

        {currentScreen === 'product_detail' && (
          <>
            <button
              type="button"
              aria-label={isBn ? 'খুঁজুন' : 'Search products'}
              onClick={() => navigateTo('categories')}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            <button
              type="button"
              aria-label={isBn ? 'উইশলিস্টে যোগ করুন' : 'Toggle wishlist'}
              onClick={() => toggleWishlist(selectedProduct.id)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
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
              className="w-9 h-9 rounded-lg flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
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
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <ShoppingCart className="w-4 h-4 stroke-[2]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-brand-primary text-white tabular-nums text-[9px] leading-none font-bold flex items-center justify-center">
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
            className="relative w-10 h-10 rounded-lg hover:bg-app-subtle flex items-center justify-center text-content-primary active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <Heart className="w-4 h-4 stroke-[2]" />
            {wishlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-1 rounded-full bg-brand-primary text-white tabular-nums text-[9px] leading-none font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>
        )}

        {isNotifications && unreadNotificationCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="h-8 px-2.5 rounded-lg text-xs font-semibold text-brand-primary hover:bg-brand-subtle flex items-center gap-1 transition-colors whitespace-nowrap"
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
            className="w-9 h-9 rounded-lg hover:bg-app-subtle flex items-center justify-center text-content-primary active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
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
            className="relative w-9 h-9 rounded-lg hover:bg-app-subtle flex items-center justify-center text-content-primary active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <Bell className="w-4 h-4 stroke-[2]" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-1 rounded-full bg-brand-primary text-white tabular-nums text-[9px] leading-none font-bold flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </button>
        ) : null}
      </div>
    </header>
  );
};
