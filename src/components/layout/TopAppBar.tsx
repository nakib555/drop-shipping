import React from 'react';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Heart,
  MapPin,
  Menu,
  Search,
  Settings,
  Share2,
  ShieldCheck,
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
  const isCart = currentScreen === 'cart';
  const isBn = language === 'BN';

  const activeAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];
  const deliveryLocationLabel = activeAddress
    ? `${activeAddress.label} · ${activeAddress.city}`
    : isBn
    ? 'ঢাকা, বাংলাদেশ'
    : 'Dhaka, BD';

  const getScreenMeta = (): { title: string; subtitle?: string } => {
    switch (currentScreen) {
      case 'categories':
        return {
          title: isBn ? 'সকল ক্যাটাগরি' : 'Global Catalog',
          subtitle: isBn ? '৮টি গ্লোবাল হাব · ডিউটিসহ মূল্য' : '8 Global Hubs · Duty & VAT Included',
        };
      case 'category_products': {
        if (selectedCategoryId === 'all') {
          return {
            title: isBn ? 'সকল গ্লোবাল পণ্য' : 'All Global Products',
            subtitle: isBn ? 'ল্যান্ডেড প্রাইস গ্যারান্টি' : '100% Landed Price Guarantee',
          };
        }
        const cat = CATEGORIES.find((c) => c.id === selectedCategoryId);
        return {
          title: cat ? (isBn ? cat.nameBn : cat.name) : isBn ? 'পণ্যসমূহ' : 'Products',
          subtitle: isBn ? 'ভেরিফাইড ইমপোর্ট রুট' : 'Verified Direct Import Routes',
        };
      }
      case 'product_detail':
        return {
          title: selectedProduct.supplierName || (isBn ? 'পণ্যের বিবরণ' : 'Product Details'),
          subtitle: isBn
            ? `${selectedProduct.originLabel} · ডিউটি পেইড`
            : `${selectedProduct.originLabel} · Customs Cleared`,
        };
      case 'price_tracker':
        return {
          title: isBn ? 'প্রাইস হিস্ট্রি (৩০ দিন)' : '30-Day Price History',
          subtitle: isBn ? 'রিয়েল-টাইম মার্কেট ইন্টেলিজেন্স' : 'Real-Time Landed Cost Analytics',
        };
      case 'seller_compare':
        return {
          title: isBn ? '৩টি রুট তুলনা' : 'Shipping Route Compare',
          subtitle: isBn ? 'ডিরেক্ট · লোকাল · কনসলিডেটেড' : 'Direct Air · Local Ready · Consolidated',
        };
      case 'spec_compare':
        return {
          title: isBn ? 'স্পেসিফিকেশন তুলনা' : 'Spec Comparison',
          subtitle: isBn ? 'পাশাপাশি মডেল যাচাই' : 'Side-by-Side Technical Audit',
        };
      case 'cart':
        return {
          title: isBn ? `শপিং ব্যাগ (${cartCount})` : `Shopping Bag (${cartCount})`,
          subtitle: isBn ? 'কাস্টমস ডিউটি ও ভ্যাট অন্তর্ভুক্ত' : 'Includes Customs Duty & 15% VAT',
        };
      case 'checkout_shipping':
        return {
          title: isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Address',
          subtitle: isBn ? 'ধাপ ১/৩ · ডোরস্টেপ কুরিয়ার' : 'Step 1 of 3 · Doorstep Courier',
        };
      case 'checkout_payment':
        return {
          title: isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method',
          subtitle: isBn ? 'ধাপ ২/৩ · এসক্রো সুরক্ষিত' : 'Step 2 of 3 · Escrow Protected',
        };
      case 'checkout_review':
        return {
          title: isBn ? 'অর্ডার রিভিউ' : 'Review & Confirm',
          subtitle: isBn ? 'ধাপ ৩/৩ · ল্যান্ডেড প্রাইস লক' : 'Step 3 of 3 · Landed Price Lock',
        };
      case 'order_success':
        return {
          title: isBn ? 'অর্ডার সফল' : 'Order Confirmed',
          subtitle: isBn ? 'কাস্টমস প্রি-ক্লিয়ারেন্স শুরু হয়েছে' : 'Customs Pre-Clearance Initiated',
        };
      case 'orders':
        return {
          title: isBn ? 'আমার অর্ডার' : 'My Orders',
          subtitle: isBn ? 'আন্তর্জাতিক ও লোকাল শিপমেন্ট' : 'International & Local Shipments',
        };
      case 'order_tracking':
        return {
          title: isBn ? 'লাইভ অর্ডার ট্র্যাকিং' : 'Live Parcel Radar',
          subtitle: isBn ? 'অরিজিন হাব থেকে ঢাকা কাস্টমস' : 'Origin Hub to Dhaka Customs',
        };
      case 'account':
        return {
          title: isBn ? 'আমার অ্যাকাউন্ট' : 'Member Profile',
          subtitle: isBn ? 'ভেরিফাইড ক্রস-বর্ডার মেম্বার' : 'Verified Cross-Border Member',
        };
      case 'addresses':
        return {
          title: isBn ? 'সংরক্ষিত ঠিকানা' : 'Saved Addresses',
          subtitle: isBn ? 'হোম ও অফিস ডেলিভারি হাব' : 'Home & Office Delivery Hubs',
        };
      case 'payment_methods':
        return {
          title: isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Wallets',
          subtitle: isBn ? 'বিকাশ · নগদ · কার্ড · ক্যাশ অন ডেলিভারি' : 'bKash · Nagad · Cards · COD',
        };
      case 'supplier_store':
        return {
          title: isBn ? 'সাপ্লায়ার স্টোর' : 'Verified Supplier Hub',
          subtitle: isBn ? 'সরাসরি ফ্যাক্টরি ও অনুমোদিত ডিলার' : 'Direct Factory & Authorized Dealer',
        };
      case 'wishlist':
        return {
          title: isBn ? 'উইশলিস্ট' : 'Saved Wishlist',
          subtitle: isBn ? 'প্রাইস ড্রপ অ্যালার্ট সক্রিয়' : 'Price Drop Monitoring Active',
        };
      case 'notifications':
        return {
          title: isBn ? 'নোটিফিকেশন' : 'Activity & Alerts',
          subtitle:
            unreadNotificationCount > 0
              ? isBn
                ? `${unreadNotificationCount}টি অপঠিত আপডেট`
                : `${unreadNotificationCount} Unread · Shipment & Price Updates`
              : isBn
              ? 'সকল আপডেট পড়া হয়েছে'
              : 'All Caught Up · Shipment & Price Updates',
        };
      case 'support':
        return {
          title: isBn ? 'হেল্প ও সাপোর্ট' : 'Concierge Support',
          subtitle: isBn ? '২৪/৭ কাস্টমস ও অর্ডার সহায়তা' : '24/7 Customs & Order Assistance',
        };
      case 'settings':
        return {
          title: isBn ? 'সেটিংস' : 'App Preferences',
          subtitle: isBn ? 'কারেন্সি, ভাষা ও নোটিফিকেশন' : 'Currency, Language & Alerts',
        };
      case 'guides':
        return {
          title: isBn ? 'শপিং গাইড' : 'Import & Customs Guide',
          subtitle: isBn ? 'বাংলাদেশ কাস্টমস ও ডিউটি নিয়মাবলী' : 'BD HS-Code & Duty Transparency',
        };
      default:
        return {
          title: isBn ? 'দেশিমার্ট' : 'DeshiMart',
          subtitle: isBn ? 'গ্লোবাল শপিং' : 'Global Commerce',
        };
    }
  };

  const isProductLiked = wishlist.includes(selectedProduct.id);
  const screenMeta = getScreenMeta();

  const handleShareProduct = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    showToast(
      isBn
        ? `${selectedProduct.name} এর লিংক কপি করা হয়েছে`
        : `Copied landed-price link for ${selectedProduct.name}`,
      'info'
    );
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-30 h-14 px-3 bg-white/95 backdrop-blur border-b border-app-border flex items-center justify-between gap-2 shrink-0 select-none"
    >
      {/* Left Zone: Ergonomic 44x44 Menu/Back Trigger + Brand / Screen Context */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        {isHome ? (
          <>
            <button
              type="button"
              aria-label={isBn ? 'নেভিগেশন মেনু খুলুন' : 'Open navigation menu'}
              onClick={() => setDrawerOpen(true)}
              className="relative w-11 h-11 -ml-1 rounded-lg flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              </button>

              <div className="min-w-0 flex flex-col justify-center">
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="text-base leading-5 font-semibold tracking-tight text-content-primary truncate text-left focus-visible:outline-none"
                >
                  {isBn ? 'দেশিমার্ট' : 'DeshiMart'}
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('addresses')}
                  className="flex items-center gap-1 text-xs leading-4 text-content-secondary hover:text-content-primary transition-colors truncate text-left"
                >
                  <MapPin className="w-3 h-3 text-content-secondary shrink-0" />
                  <span className="truncate">{deliveryLocationLabel}</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              aria-label={isBn ? 'পেছনে যান' : 'Go back'}
              onClick={goBack}
              className="w-11 h-11 -ml-1 rounded-lg flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>

            <div className="min-w-0 flex-1 pl-0.5">
              <h1 className="text-base leading-5 font-semibold tracking-tight text-content-primary truncate">
                {screenMeta.title}
              </h1>
              {screenMeta.subtitle && (
                <p className="text-xs leading-4 text-content-secondary truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-brand-primary shrink-0" />
                  <span className="truncate">{screenMeta.subtitle}</span>
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right Zone: Contextual Utility Actions */}
      <div className="flex items-center gap-0.5 shrink-0">
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
              className="h-9 px-2 rounded-lg text-xs font-mono-num font-semibold text-content-secondary hover:text-content-primary hover:bg-app-subtle transition-colors"
            >
              {currency === 'BDT' ? '৳ BDT' : '$ USD'}
            </button>

            <button
              type="button"
              aria-label={isBn ? 'ভাষা পরিবর্তন করুন' : 'Switch language'}
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="h-9 px-2 rounded-lg text-xs font-semibold text-content-secondary hover:text-content-primary hover:bg-app-subtle transition-colors"
            >
              {language === 'EN' ? 'বাং' : 'EN'}
            </button>

            <button
              type="button"
              aria-label={isBn ? 'পণ্য খুঁজুন' : 'Search global catalog'}
              onClick={() => navigateTo('category_products', { categoryId: 'all' })}
              className="w-10 h-10 rounded-lg hover:bg-app-subtle flex items-center justify-center text-content-primary active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>
          </>
        )}

        {currentScreen === 'product_detail' && (
          <>
            <button
              type="button"
              aria-label={isBn ? 'শেয়ার করুন' : 'Share product'}
              onClick={handleShareProduct}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Share2 className="w-4 h-4 stroke-[2]" />
            </button>

            <button
              type="button"
              aria-label={isBn ? 'উইশলিস্টে যোগ করুন' : 'Toggle wishlist'}
              onClick={() => toggleWishlist(selectedProduct.id)}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-content-primary hover:bg-app-subtle active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isProductLiked
                    ? 'fill-promo-accent text-promo-accent'
                    : 'text-content-primary stroke-[2]'
                }`}
              />
            </button>
          </>
        )}

        {isNotifications && unreadNotificationCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="h-9 px-2.5 rounded-lg text-xs font-semibold text-brand-primary hover:bg-brand-subtle flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{isBn ? 'সব পঠিত' : 'Mark Read'}</span>
          </button>
        )}

        {isNotifications && (
          <button
            type="button"
            aria-label={isBn ? 'নোটিফিকেশন সেটিংস' : 'Alert preferences'}
            onClick={() => navigateTo('settings')}
            className="w-10 h-10 rounded-lg hover:bg-app-subtle flex items-center justify-center text-content-primary active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <Settings className="w-4 h-4 stroke-[2]" />
          </button>
        )}

        <button
          type="button"
          aria-label={
            unreadNotificationCount > 0
              ? `${unreadNotificationCount} unread notifications`
              : 'Notifications'
          }
          aria-current={isNotifications ? 'page' : undefined}
          onClick={() => navigateTo('notifications')}
          className={`relative w-10 h-10 rounded-lg flex items-center justify-center active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            isNotifications
              ? 'bg-brand-subtle text-brand-primary'
              : 'hover:bg-app-subtle text-content-primary'
          }`}
        >
          <Bell className="w-4 h-4 stroke-[2]" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-promo-accent text-white tabular-nums text-[10px] leading-4 font-bold flex items-center justify-center">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        <button
          type="button"
          aria-label={`Shopping bag with ${cartCount} items`}
          aria-current={isCart ? 'page' : undefined}
          onClick={() => navigateTo('cart')}
          className={`relative w-10 h-10 rounded-lg flex items-center justify-center active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            isCart
              ? 'bg-brand-subtle text-brand-primary'
              : 'hover:bg-app-subtle text-content-primary'
          }`}
        >
          <ShoppingCart className="w-4 h-4 stroke-[2]" />
          {cartCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-promo-accent text-white tabular-nums text-[10px] leading-4 font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

