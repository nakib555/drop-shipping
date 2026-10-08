import React from 'react';
import {
  ArrowLeft,
  Bell,
  Heart,
  Menu,
  Search,
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
    setDrawerOpen,
    cartCount,
    unreadNotificationCount,
    selectedCategoryId,
    selectedProduct,
    toggleWishlist,
    wishlist,
    language,
    currency,
    setCurrency,
  } = useDeshiMart();

  if (
    currentScreen === 'splash' ||
    currentScreen === 'onboarding' ||
    currentScreen === 'auth'
  ) {
    return null;
  }

  const isHome = currentScreen === 'home';

  const getScreenTitle = (): string => {
    const isBn = language === 'BN';
    switch (currentScreen) {
      case 'categories':
        return isBn ? 'সকল ক্যাটাগরি' : 'Categories';
      case 'category_products': {
        if (selectedCategoryId === 'all')
          return isBn ? 'সকল গ্লোবাল পণ্য' : 'All Global Products';
        const cat = CATEGORIES.find((c) => c.id === selectedCategoryId);
        return cat ? (isBn ? cat.nameBn : cat.name) : isBn ? 'পণ্যসমূহ' : 'Products';
      }
      case 'product_detail':
        return isBn ? 'পণ্যের বিবরণ' : 'Product Details';
      case 'price_tracker':
        return isBn ? 'প্রাইস হিস্ট্রি (৩০ দিন)' : 'Price History';
      case 'seller_compare':
        return isBn ? '৩টি রুট তুলনা' : 'Shipping Routes';
      case 'spec_compare':
        return isBn ? 'স্পেসিফিকেশন তুলনা' : 'Compare Specs';
      case 'visual_scan':
        return isBn ? 'ভিজ্যুয়াল ও লিংক স্ক্যান' : 'Visual & Link Search';
      case 'cart':
        return isBn ? `শপিং ব্যাগ (${cartCount})` : `Shopping Bag (${cartCount})`;
      case 'checkout_shipping':
        return isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Address';
      case 'checkout_payment':
        return isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method';
      case 'checkout_review':
        return isBn ? 'অর্ডার রিভিউ' : 'Review Order';
      case 'order_success':
        return isBn ? 'অর্ডার সফল' : 'Order Confirmed';
      case 'orders':
        return isBn ? 'আমার অর্ডার' : 'My Orders';
      case 'order_tracking':
        return isBn ? 'লাইভ অর্ডার ট্র্যাকিং' : 'Live Tracking';
      case 'account':
        return isBn ? 'অ্যাকাউন্ট' : 'Account';
      case 'addresses':
        return isBn ? 'সংরক্ষিত ঠিকানা' : 'Saved Addresses';
      case 'payment_methods':
        return isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Methods';
      case 'supplier_store':
        return isBn ? 'সাপ্লায়ার স্টোর' : 'Supplier Store';
      case 'wishlist':
        return isBn ? 'উইশলিস্ট' : 'Wishlist';
      case 'notifications':
        return isBn ? 'নোটিফিকেশন' : 'Notifications';
      case 'support':
        return isBn ? 'হেল্প ও সাপোর্ট' : 'Help & Support';
      case 'settings':
        return isBn ? 'সেটিংস' : 'Preferences';
      case 'guides':
        return isBn ? 'শপিং গাইড' : 'Buying Guides';
      default:
        return isBn ? 'দেশিমার্ট' : 'DeshiMart';
    }
  };

  const isProductLiked = wishlist.includes(selectedProduct.id);

  // 8pt Grid: h-14 (56px = 7*8), px-4 (16px = 2*8), gap-2 (8px), w-10 h-10 (40px)
  return (
    <header className="sticky top-0 z-30 h-14 px-4 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
      {/* Left Zone */}
      <div className="flex items-center gap-2 min-w-0">
        {isHome ? (
          <>
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
              className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-[#059669] text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-base leading-5 font-bold tracking-tight text-slate-900">
                DeshiMart
              </span>
            </button>
          </>
        ) : (
          <button
            type="button"
            aria-label="Go back"
            onClick={goBack}
            className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Center Zone (Sub-screens) */}
      {!isHome && (
        <h1 className="text-sm leading-5 font-semibold text-slate-900 truncate text-center flex-1">
          {getScreenTitle()}
        </h1>
      )}

      {/* Right Zone */}
      <div className="flex items-center gap-1 shrink-0">
        {currentScreen === 'product_detail' && (
          <button
            type="button"
            aria-label="Toggle wishlist"
            onClick={() => toggleWishlist(selectedProduct.id)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${
                isProductLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
              }`}
            />
          </button>
        )}

        {isHome && (
          <button
            type="button"
            aria-label="Search products"
            onClick={() => navigateTo('category_products', { categoryId: 'all' })}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          aria-label="Notifications"
          onClick={() => navigateTo('notifications')}
          className="relative w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#059669] ring-2 ring-white" />
          )}
        </button>

        <button
          type="button"
          aria-label="Shopping bag"
          onClick={() => navigateTo('cart')}
          className="relative w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#059669] text-white font-mono-num text-[10px] leading-4 font-semibold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
