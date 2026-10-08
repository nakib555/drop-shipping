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
        return isBn ? 'প্রাইস ট্র্যাকার (৩০ দিন)' : 'Price Tracker';
      case 'seller_compare':
        return isBn ? '৩টি সেলার ও রুট তুলনা' : 'Compare 3 Sellers / Routes';
      case 'spec_compare':
        return isBn ? 'পণ্যের স্পেসিফিকেশন তুলনা' : 'Compare Products';
      case 'visual_scan':
        return isBn ? 'ছবি বা লিংক স্ক্যান করুন' : 'Scan or Upload Link';
      case 'cart':
        return isBn ? `আপনার কার্ট (${cartCount})` : `Your Cart (${cartCount})`;
      case 'checkout_shipping':
        return isBn ? 'চেকআউট — ডেলিভারি ঠিকানা' : 'Checkout — Shipping';
      case 'checkout_payment':
        return isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method';
      case 'checkout_review':
        return isBn ? 'অর্ডার রিভিউ ও কনফার্ম' : 'Review & Place Order';
      case 'order_success':
        return isBn ? 'অর্ডার সফল হয়েছে' : 'Order Confirmed';
      case 'orders':
        return isBn ? 'আমার অর্ডারসমূহ' : 'My Orders';
      case 'order_tracking':
        return isBn ? 'লাইভ অর্ডার ট্র্যাকিং' : 'Track Order';
      case 'account':
        return isBn ? 'আমার অ্যাকাউন্ট' : 'My Account';
      case 'addresses':
        return isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Addresses';
      case 'payment_methods':
        return isBn ? 'সংরক্ষিত পেমেন্ট মাধ্যম' : 'Payment Methods';
      case 'supplier_store':
        return isBn ? 'ভেরিফাইড সাপ্লায়ার স্টোর' : 'Supplier Storefront';
      case 'wishlist':
        return isBn ? 'পছন্দের তালিকা (Wishlist)' : 'Wishlist';
      case 'notifications':
        return isBn ? 'নোটিফিকেশন' : 'Notifications';
      case 'support':
        return isBn ? 'হেল্প ও সাপোর্ট' : 'Help & Support';
      case 'settings':
        return isBn ? 'কারেন্সি ও ভাষা সেটিংস' : 'Currency & Language';
      case 'guides':
        return isBn ? 'শপিং গাইড ও টিপস' : 'Shopping Guides & Tips';
      default:
        return isBn ? 'দেশিমার্ট' : 'DeshiMart';
    }
  };

  const isProductLiked = wishlist.includes(selectedProduct.id);

  // 8pt Grid: h-14 (56px = 7*8), px-4 (16px = 2*8), gap-2 (8px = 1*8), buttons w-10 h-10 (40px = 5*8)
  return (
    <header className="sticky top-0 z-30 h-14 px-4 bg-white/95 backdrop-blur-md border-b border-slate-200/75 shadow-[0_2px_8px_-4px_rgba(11,61,46,0.06)] flex items-center justify-between gap-2 shrink-0">
      {/* Left Zone */}
      <div className="flex items-center gap-2 min-w-0">
        {isHome ? (
          <>
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
              className="w-10 h-10 -ml-1 rounded-xl flex items-center justify-center text-[#0B3D2E] hover:bg-[#ECFDF5] hover:text-[#0EA75F] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0EA75F] to-[#0B7A47] text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-4 h-4 stroke-[2.3]" />
              </div>
              <div className="leading-none">
                <span className="block text-sm leading-4 font-extrabold tracking-tight text-[#0B3D2E]">
                  DeshiMart
                </span>
                <span className="block text-[10px] leading-3 font-semibold text-[#0EA75F] mt-1">
                  {language === 'BN' ? 'গ্লোবাল শপিং' : 'Global → Doorstep'}
                </span>
              </div>
            </button>
          </>
        ) : (
          <button
            type="button"
            aria-label="Go back"
            onClick={goBack}
            className="w-10 h-10 -ml-1 rounded-xl bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-center text-[#0B3D2E] hover:bg-[#ECFDF5] hover:border-[#0EA75F]/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Center Zone (Sub-screens) */}
      {!isHome && (
        <h1 className="text-sm leading-5 font-extrabold text-[#0B3D2E] truncate text-center flex-1">
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
            className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-center text-[#0B3D2E] hover:bg-rose-50 transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${
                isProductLiked ? 'fill-rose-500 text-rose-500' : 'text-[#0B3D2E]'
              }`}
            />
          </button>
        )}

        {isHome && (
          <button
            type="button"
            aria-label="Search products"
            onClick={() => navigateTo('category_products', { categoryId: 'all' })}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-[#0B3D2E] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          aria-label="Notifications"
          onClick={() => navigateTo('notifications')}
          className="relative w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-[#0B3D2E] transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00C853] ring-2 ring-white" />
          )}
        </button>

        <button
          type="button"
          aria-label="Shopping cart"
          onClick={() => navigateTo('cart')}
          className="relative w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#0EA75F] hover:bg-[#0EA75F] hover:text-white flex items-center justify-center transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#0B3D2E] text-white font-mono-num text-[10px] leading-4 font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
