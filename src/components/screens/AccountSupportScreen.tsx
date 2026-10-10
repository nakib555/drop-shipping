import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Banknote,
  Bell,
  BookOpen,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Edit3,
  Globe,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  PhoneCall,
  Plus,
  Send,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Trash2,
  TrendingDown,
  Truck,
  Wallet,
} from 'lucide-react';
// Clean production AccountSupportScreen — zero ExperienceModeStudioCard UI
import { useDeshiMart } from '../../context/DeshiMartContext';
import { SUPPORT_FAQS } from '../../data/catalogData';
import { AppNotification, PaymentMethodId } from '../../types/deshimart';
import { ProductCard } from '../shared/ProductCard';

export const AccountSupportScreen: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    user,
    switchUserRole,
    updateUserProfile,
    logoutUser,
    orders,
    priceAlerts,
    promoVouchers,
    wishlist,
    toggleWishlist,
    products,
    selectedProduct,
    addToCart,
    formatPrice,
    notifications,
    shoppingGuides,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearReadNotifications,
    currency,
    setCurrency,
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    deleteAddress,
    paymentMethod,
    setPaymentMethod,
    showToast,
  } = useDeshiMart();

  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'order' | 'price_drop'>('all');

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'agent',
      text: 'Assalamu Alaikum! Welcome to DeshiMart 24/7 Support. How can we help with your cross-border order or landed cost today?',
    },
  ]);

  // Edit Profile Modal State
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user.fullName);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);

  // Add Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrName, setAddrName] = useState(user.fullName);
  const [addrPhone, setAddrPhone] = useState(user.phone);
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('Dhaka');
  const [addrPostal, setAddrPostal] = useState('1212');

  // Supplier Follow State
  const [isFollowingSupplier, setIsFollowingSupplier] = useState(false);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: 'Thanks for reaching out! All DeshiMart orders include 100% pre-cleared customs duty & VAT. A specialist in Dhaka has logged your request.',
        },
      ]);
    }, 450);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName: editName.trim() || 'John Doe',
      email: editEmail.trim() || 'john@example.com',
      phone: editPhone.trim() || '+880 1712 345678',
    });
    setEditProfileOpen(false);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet.trim()) return;
    addAddress({
      label: addrLabel,
      fullName: addrName,
      phone: addrPhone,
      address: addrStreet,
      city: addrCity,
      postalCode: addrPostal,
    });
    setAddrStreet('');
    setShowAddAddress(false);
  };

  // 1. WISHLIST SCREEN
  if (currentScreen === 'wishlist') {
    const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

    if (wishlistedProducts.length === 0) {
      return (
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center bg-app-bg">
          <div className="w-16 h-16 rounded-2xl bg-app-subtle border border-app-border text-content-secondary flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-semibold text-content-primary">
            {language === 'BN' ? 'আপনার উইশলিস্ট খালি' : 'Your Wishlist is Empty'}
          </h2>
          <p className="text-xs text-content-secondary mt-1 max-w-[230px]">
            {language === 'BN'
              ? 'পছন্দের গ্লোবাল পণ্য সেভ করে রাখুন এবং ল্যান্ডেড প্রাইস ড্রপ ট্র্যাক করুন।'
              : 'Save your favorite global items and track their landed price drops here.'}
          </p>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="mt-5 px-6 min-h-[44px] rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
          >
            {language === 'BN' ? 'শপিং শুরু করুন' : 'Explore Catalog'}
          </button>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-semibold text-content-primary">
            {language === 'BN'
              ? `সংরক্ষিত পণ্য (${wishlistedProducts.length})`
              : `Saved Items (${wishlistedProducts.length})`}
          </span>
          <span className="text-xs text-content-secondary">
            {language === 'BN' ? 'ল্যান্ডেড প্রাইস অন্তর্ভুক্ত' : 'Landed Price Included'}
          </span>
        </div>

        <div className="space-y-2.5">
          {wishlistedProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-app-border p-3 flex items-center gap-3"
            >
              <img
                src={prod.image}
                alt={prod.name}
                referrerPolicy="no-referrer"
                onClick={() =>
                  navigateTo('product_detail', { productId: prod.id })
                }
                className="w-16 h-16 rounded-lg object-cover bg-slate-50 border border-app-border cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3
                    onClick={() =>
                      navigateTo('product_detail', { productId: prod.id })
                    }
                    className="text-sm font-medium text-content-primary truncate cursor-pointer hover:underline"
                  >
                    {language === 'BN' ? prod.nameBn : prod.name}
                  </h3>
                  <button
                    type="button"
                    aria-label="Remove from wishlist"
                    onClick={() => toggleWishlist(prod.id)}
                    className="text-content-muted hover:text-promo-accent p-1 -mr-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-xs text-content-secondary mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="tabular-nums font-semibold text-content-primary">
                    {prod.rating.toFixed(1)}
                  </span>
                  <span>({prod.reviewCount})</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="tabular-nums text-base font-bold text-content-primary">
                    {formatPrice(prod.totalLandedBdt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => addToCart(prod.id, 1)}
                    className="px-3.5 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{language === 'BN' ? 'কার্টে দিন' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. DEDICATED SAVED ADDRESSES MANAGER
  if (currentScreen === 'addresses') {
    return (
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-semibold text-content-primary">
            {language === 'BN'
              ? `আপনার ডেলিভারি ঠিকানা (${addresses.length})`
              : `Saved Delivery Addresses (${addresses.length})`}
          </span>
          <button
            type="button"
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'BN' ? 'নতুন ঠিকানা' : 'Add Address'}</span>
          </button>
        </div>

        {showAddAddress && (
          <form
            onSubmit={handleCreateAddress}
            className="bg-white rounded-xl border border-app-border p-4 space-y-2.5"
          >
            <h3 className="text-sm font-semibold text-content-primary">
              {language === 'BN' ? 'নতুন ডেলিভারি ঠিকানা যোগ করুন' : 'New Delivery Address'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-content-secondary mb-1">
                  Label
                </label>
                <input
                  type="text"
                  required
                  value={addrLabel}
                  onChange={(e) => setAddrLabel(e.target.value)}
                  placeholder="Home / Office"
                  className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-content-secondary mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-content-secondary mb-1">
                Street / Area / House
              </label>
              <input
                type="text"
                required
                value={addrStreet}
                onChange={(e) => setAddrStreet(e.target.value)}
                placeholder="House 14, Road 5, Dhanmondi"
                className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-content-secondary mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-content-secondary mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={addrPostal}
                  onChange={(e) => setAddrPostal(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border tabular-nums text-xs text-content-primary"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-10 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
            >
              {language === 'BN' ? 'ঠিকানা সেভ করুন' : 'Save Address'}
            </button>
          </form>
        )}

        <div className="space-y-2.5">
          {addresses.map((addr) => {
            const isDefault = addr.id === selectedAddressId;
            return (
              <div
                key={addr.id}
                className={`p-3.5 rounded-xl border bg-white space-y-2 ${
                  isDefault
                    ? 'border-brand-primary bg-brand-subtle/40'
                    : 'border-app-border'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin
                      className={`w-4 h-4 ${
                        isDefault ? 'text-brand-primary' : 'text-content-secondary'
                      }`}
                    />
                    <span className="text-sm font-medium text-content-primary">
                      {addr.fullName}
                    </span>
                    <span className="text-xs text-content-secondary">
                      · {addr.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Delete address"
                    onClick={() => deleteAddress(addr.id)}
                    className="text-content-muted hover:text-promo-accent p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-content-secondary">{addr.address}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="tabular-nums text-xs text-content-secondary">
                    {addr.phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAddressId(addr.id);
                      showToast('Default delivery address updated');
                    }}
                    className={`text-xs font-semibold ${
                      isDefault
                        ? 'text-brand-primary'
                        : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    {isDefault
                      ? language === 'BN'
                        ? '✓ ডিফল্ট ঠিকানা'
                        : '✓ Default Address'
                      : language === 'BN'
                      ? 'ডিফল্ট হিসেবে সেট করুন'
                      : 'Set as Default'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. DEDICATED SAVED PAYMENT METHODS SCREEN
  if (currentScreen === 'payment_methods') {
    const savedMethods: {
      id: PaymentMethodId;
      name: string;
      detail: string;
      status: string;
      icon: React.FC<{ className?: string }>;
    }[] = [
      {
        id: 'cod',
        name: 'Cash on Delivery (COD)',
        detail: 'Pay in BDT cash upon doorstep delivery anywhere in Bangladesh',
        status: 'Verified Default',
        icon: Banknote,
      },
      {
        id: 'bkash',
        name: 'bKash Personal Wallet',
        detail: '+880 1712-345678 · Instant Tokenized Checkout',
        status: 'Connected',
        icon: Smartphone,
      },
      {
        id: 'nagad',
        name: 'Nagad Mobile Banking',
        detail: '+880 1819-345678 · Fast Bangladesh MFS',
        status: 'Connected',
        icon: Wallet,
      },
      {
        id: 'card',
        name: 'Visa Platinum •••• 8910',
        detail: 'Expires 12/28 · 3D Secure Cross-Border Enabled',
        status: 'Saved Card',
        icon: CreditCard,
      },
      {
        id: 'paypal',
        name: 'PayPal Global Express',
        detail: user.email,
        status: 'USD Supported',
        icon: Wallet,
      },
    ];

    return (
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        <div className="bg-brand-subtle border border-brand-border rounded-xl p-4 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-brand-primary shrink-0" />
          <p className="text-xs text-content-secondary leading-relaxed">
            {language === 'BN'
              ? 'দেশিমার্টে ক্যাশ অন ডেলিভারি, বিকাশ/নগদ এবং কার্ড পেমেন্ট শতভাগ নিরাপদ।'
              : 'All payment methods include DeshiMart 30-day return & customs protection.'}
          </p>
        </div>

        <div className="space-y-2.5">
          {savedMethods.map((m) => {
            const Icon = m.icon;
            const active = paymentMethod === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setPaymentMethod(m.id);
                  showToast(`Default payment set to ${m.name}`);
                }}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  active
                    ? 'bg-brand-subtle/40 border-brand-primary'
                    : 'bg-white border-app-border hover:border-app-borderStrong'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      active
                        ? 'bg-brand-primary text-white'
                        : 'bg-app-subtle text-content-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-content-primary truncate">
                      {m.name}
                    </p>
                    <p className="text-xs text-content-secondary truncate">{m.detail}</p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold shrink-0 ml-2 ${
                    active ? 'text-brand-primary' : 'text-content-secondary'
                  }`}
                >
                  {active ? '✓ Active' : m.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 4. DEDICATED VERIFIED SUPPLIER STOREFRONT
  if (currentScreen === 'supplier_store') {
    const supplierName = selectedProduct.supplierName;
    const supplierCatalog = products.filter(
      (p) => p.supplierName === supplierName || p.category === selectedProduct.category
    );

    return (
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        {/* Supplier Header Card */}
        <div className="bg-white rounded-xl border border-app-border p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h2 className="text-sm font-bold text-content-primary">
                    {supplierName}
                  </h2>
                  <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                </div>
                <p className="text-xs text-content-secondary">
                  {selectedProduct.originLabel} · Tier-1 Direct Exporter
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsFollowingSupplier(!isFollowingSupplier);
                showToast(
                  !isFollowingSupplier
                    ? `Following ${supplierName}`
                    : `Unfollowed ${supplierName}`,
                  'info'
                );
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isFollowingSupplier
                  ? 'bg-brand-subtle text-brand-primary border border-brand-border'
                  : 'bg-brand-primary hover:bg-brand-hover text-white'
              }`}
            >
              {isFollowingSupplier ? 'Following ✓' : '+ Follow'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-app-border text-center text-xs">
            <div>
              <span className="tabular-nums font-bold text-content-primary block">
                {selectedProduct.supplierProductsCount}
              </span>
              <span className="text-[11px] text-content-secondary">Products</span>
            </div>
            <div>
              <span className="tabular-nums font-bold text-content-primary block">
                98.4%
              </span>
              <span className="text-[11px] text-content-secondary">On-Time Ship</span>
            </div>
            <div>
              <span className="tabular-nums font-bold text-content-primary block">
                {selectedProduct.supplierFollowers}
              </span>
              <span className="text-[11px] text-content-secondary">Followers</span>
            </div>
          </div>
        </div>

        {/* Supplier Product Grid */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-semibold text-content-primary px-1">
            {language === 'BN'
              ? 'সাপ্লায়ারের ভেরিফাইড পণ্যসমূহ'
              : `Verified Catalog (${supplierCatalog.length} items)`}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {supplierCatalog.slice(0, 24).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 5. NOTIFICATIONS SCREEN
  if (currentScreen === 'notifications') {
    const isBn = language === 'BN';
    const filteredNotifications = notifications.filter((n) => {
      if (notifFilter === 'unread') return !n.read;
      if (notifFilter === 'order') return n.type === 'order' || n.type === 'arrival';
      if (notifFilter === 'price_drop') return n.type === 'price_drop';
      return true;
    });

    const hasReadNotifications = notifications.some((n) => n.read);

    const getNotifIconConfig = (type: AppNotification['type'], read: boolean) => {
      switch (type) {
        case 'order':
        case 'arrival':
          return {
            Icon: Truck,
            bg: read
              ? 'bg-app-subtle text-content-secondary'
              : 'bg-brand-subtle text-brand-primary',
            categoryLabel: isBn ? 'শিপমেন্ট ট্র্যাকিং' : 'Shipment Update',
            ctaLabel: isBn ? 'পার্সেল ট্র্যাক করুন' : 'Track Live Parcel',
          };
        case 'price_drop':
          return {
            Icon: TrendingDown,
            bg: read
              ? 'bg-app-subtle text-content-secondary'
              : 'bg-brand-subtle text-brand-primary',
            categoryLabel: isBn ? 'প্রাইস ড্রপ অ্যালার্ট' : 'Landed Price Drop',
            ctaLabel: isBn ? 'মূল্য চার্ট দেখুন' : 'View Price Radar',
          };
        default:
          return {
            Icon: Sparkles,
            bg: read
              ? 'bg-app-subtle text-content-secondary'
              : 'bg-brand-subtle text-brand-primary',
            categoryLabel: isBn ? 'কাস্টমস ডিল' : 'Curated Offer',
            ctaLabel: isBn ? 'ক্যাটালগ দেখুন' : 'Explore Deal',
          };
      }
    };

    const handleNotificationClick = (notif: AppNotification) => {
      if (!notif.read) {
        markNotificationRead(notif.id);
      }
      if (notif.targetScreen) {
        navigateTo(notif.targetScreen, {
          productId: notif.targetProductId,
          orderId: notif.targetOrderId,
        });
      }
    };

    return (
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-app-subtle border border-app-border rounded-xl overflow-x-auto no-scrollbar">
          {[
            {
              id: 'all' as const,
              label: isBn ? `সব (${notifications.length})` : `All (${notifications.length})`,
            },
            {
              id: 'unread' as const,
              label: isBn
                ? `অপঠিত (${unreadNotificationCount})`
                : `Unread (${unreadNotificationCount})`,
            },
            {
              id: 'order' as const,
              label: isBn ? 'শিপমেন্ট' : 'Orders',
            },
            {
              id: 'price_drop' as const,
              label: isBn ? 'প্রাইস ড্রপ' : 'Price Drops',
            },
          ].map((tab) => {
            const active = notifFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setNotifFilter(tab.id)}
                className={`flex-1 min-w-fit px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-white text-content-primary shadow-2xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Summary & Bulk Action Row */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-content-secondary">
            {isBn
              ? `${filteredNotifications.length}টি নোটিফিকেশন`
              : `Showing ${filteredNotifications.length} ${
                  filteredNotifications.length === 1 ? 'update' : 'updates'
                }`}
          </span>
          <div className="flex items-center gap-3">
            {unreadNotificationCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="text-xs font-semibold text-content-primary hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{isBn ? 'সব পঠিত করুন' : 'Mark all read'}</span>
              </button>
            )}
            {hasReadNotifications && (
              <button
                type="button"
                onClick={clearReadNotifications}
                className="text-xs font-medium text-content-muted hover:text-promo-accent transition-colors"
              >
                {isBn ? 'পঠিত মুছুন' : 'Clear read'}
              </button>
            )}
          </div>
        </div>

        {/* Notification List or Empty State */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-app-border p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-app-subtle text-content-secondary flex items-center justify-center mx-auto">
              <Bell className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-content-primary">
                {notifFilter === 'unread'
                  ? isBn
                    ? 'কোনো অপঠিত নোটিফিকেশন নেই'
                    : 'You’re All Caught Up'
                  : isBn
                  ? 'কোনো নোটিফিকেশন পাওয়া যায়নি'
                  : 'No Notifications Found'}
              </h3>
              <p className="text-xs text-content-secondary max-w-[240px] mx-auto leading-relaxed">
                {isBn
                  ? 'আপনার অর্ডার শিপমেন্ট এবং ৩০ দিনের প্রাইস ড্রপ অ্যালার্ট এখানে তাৎক্ষণিক দেখা যাবে।'
                  : 'Live customs clearance milestones and 30-day landed price drop alerts will appear here.'}
              </p>
            </div>
            {notifFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setNotifFilter('all')}
                className="px-4 py-2 rounded-lg bg-app-subtle hover:bg-slate-200 text-xs font-semibold text-content-primary transition-colors"
              >
                {isBn ? 'সব নোটিফিকেশন দেখুন' : 'Show All Notifications'}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredNotifications.map((notif) => {
              const { Icon, bg, categoryLabel, ctaLabel } = getNotifIconConfig(
                notif.type,
                notif.read
              );
              return (
                <div
                  key={notif.id}
                  className={`rounded-xl border p-3.5 transition-all bg-white ${
                    !notif.read
                      ? 'border-app-borderStrong shadow-2xs'
                      : 'border-app-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(notif)}
                      className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0 mt-0.5 transition-colors`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* Metadata Kicker Row */}
                      <div className="flex items-center justify-between gap-2 text-[11px] text-content-secondary">
                        <div className="flex items-center gap-1.5 min-w-0 truncate">
                          <span
                            className={`font-semibold ${
                              !notif.read ? 'text-content-primary' : 'text-content-secondary'
                            }`}
                          >
                            {categoryLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-content-muted">{notif.timestamp}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {!notif.read && (
                            <button
                              type="button"
                              title={isBn ? 'পঠিত হিসেবে চিহ্নিত করুন' : 'Mark as read'}
                              onClick={() => markNotificationRead(notif.id)}
                              className="text-[10px] font-semibold text-content-primary hover:underline px-1"
                            >
                              {isBn ? 'পঠিত' : 'Mark read'}
                            </button>
                          )}
                          <button
                            type="button"
                            aria-label="Delete notification"
                            onClick={() => deleteNotification(notif.id)}
                            className="p-1 text-content-muted hover:text-promo-accent rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Main Clickable Content */}
                      <button
                        type="button"
                        onClick={() => handleNotificationClick(notif)}
                        className="w-full text-left mt-1 group"
                      >
                        <h3
                          className={`text-xs leading-snug group-hover:underline ${
                            !notif.read
                              ? 'font-bold text-content-primary'
                              : 'font-medium text-content-secondary'
                          }`}
                        >
                          {notif.title}
                        </h3>
                        <p className="text-xs text-content-secondary mt-1 leading-relaxed">
                          {notif.body}
                        </p>

                        {notif.targetScreen && (
                          <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-content-primary group-hover:translate-x-0.5 transition-transform">
                            <span>{ctaLabel}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 6. SHOPPING GUIDES / BLOG SCREEN
  if (currentScreen === 'guides') {
    return (
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        <div className="bg-brand-primary text-white rounded-2xl p-4">
          <h2 className="text-sm font-semibold">
            Cross-Border Shopping Guides
          </h2>
          <p className="text-xs text-emerald-50/90 mt-1">
            Learn how DeshiMart pre-clears customs duty and verifies factory exporters.
          </p>
        </div>

        <div className="space-y-3">
          {shoppingGuides.map((guide) => (
            <article
              key={guide.id}
              className="bg-white rounded-xl border border-app-border p-4 space-y-2.5"
            >
              <div className="flex items-center gap-2 text-[11px] text-content-secondary">
                <span className="font-semibold text-brand-primary">{guide.category}</span>
                <span>·</span>
                <span>{guide.date}</span>
                <span>·</span>
                <span>{guide.readTime}</span>
              </div>
              <h3 className="text-sm font-semibold text-content-primary">
                {guide.title}
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                {guide.summary}
              </p>
              <ul className="space-y-1.5 pt-1">
                {guide.bulletPoints.map((bp, i) => (
                  <li
                    key={i}
                    className="text-xs text-content-secondary flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    );
  }

  // 7. SETTINGS & CURRENCY / LANGUAGE SCREEN
  if (currentScreen === 'settings') {
    return (
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        {/* Currency Selection */}
        <div className="bg-white rounded-xl border border-app-border p-4 space-y-2.5">
          <h2 className="text-sm font-semibold text-content-primary">
            Landed Cost Display Currency
          </h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setCurrency('BDT');
                showToast('Currency set to BDT (৳) Bangladeshi Taka');
              }}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                currency === 'BDT'
                  ? 'bg-brand-subtle/60 border-brand-primary'
                  : 'bg-white border-app-border'
              }`}
            >
              <span className="text-xs font-semibold text-content-primary">
                BDT (৳) — Bangladeshi Taka
              </span>
              <span className="text-xs tabular-nums font-semibold text-brand-primary">
                Bangladesh
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrency('USD');
                showToast('Currency set to USD ($) US Dollar');
              }}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                currency === 'USD'
                  ? 'bg-brand-subtle/60 border-brand-primary'
                  : 'bg-white border-app-border'
              }`}
            >
              <span className="text-xs font-semibold text-content-primary">
                USD ($) — US Dollar
              </span>
              <span className="text-xs tabular-nums font-medium text-content-secondary">
                Global ($1 = ৳ 120)
              </span>
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-xl border border-app-border p-4 space-y-2.5">
          <h2 className="text-sm font-semibold text-content-primary">App Language</h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setLanguage('EN');
                showToast('Language set to English');
              }}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                language === 'EN'
                  ? 'bg-brand-subtle/60 border-brand-primary'
                  : 'bg-white border-app-border'
              }`}
            >
              <span className="text-xs font-semibold text-content-primary">English</span>
              <span className="text-xs text-content-secondary font-medium">
                Plus Jakarta Sans
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLanguage('BN');
                showToast('ভাষা বাংলায় পরিবর্তন করা হয়েছে (Noto Sans Bengali)');
              }}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                language === 'BN'
                  ? 'bg-brand-subtle/60 border-brand-primary'
                  : 'bg-white border-app-border'
              }`}
            >
              <span className="text-xs font-semibold text-content-primary">
                বাংলা (Bengali)
              </span>
              <span className="text-xs text-content-secondary font-medium">
                Noto Sans Bengali
              </span>
            </button>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white rounded-xl border border-app-border p-4 space-y-3">
          <h2 className="text-sm font-semibold text-content-primary">
            App Preferences
          </h2>
          <label className="flex items-center justify-between text-xs font-medium text-content-secondary cursor-pointer">
            <span>High-Contrast Outdoor Legibility</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="w-4 h-4 accent-emerald-700"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm transition-colors"
        >
          Save Changes
        </button>
      </div>
    );
  }

  // 8. HELP & SUPPORT SCREEN
  if (currentScreen === 'support') {
    return (
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        <div className="bg-white rounded-xl border border-app-border p-4 space-y-3">
          <h2 className="text-sm font-semibold text-content-primary">
            How can we help you today?
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="p-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white flex flex-col items-center text-center gap-1 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-emerald-100" />
              <span className="text-xs font-semibold">
                24/7 Live Chat
              </span>
              <span className="text-[10px] text-emerald-100/90">Replies in &lt; 2m</span>
            </button>

            <button
              type="button"
              onClick={() =>
                showToast('Calling DeshiMart Dhaka Support: +880 1712 345678')
              }
              className="p-3.5 rounded-xl bg-brand-subtle border border-brand-border flex flex-col items-center text-center gap-1"
            >
              <PhoneCall className="w-5 h-5 text-brand-primary" />
              <span className="text-xs font-semibold text-content-primary">
                Call Support
              </span>
              <span className="text-[10px] tabular-nums text-content-secondary">
                +880 1712 345678
              </span>
            </button>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-xl border border-app-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-content-primary">
            Frequently Asked Questions
          </h3>
          <div className="space-y-2.5">
            {SUPPORT_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="p-3 rounded-lg bg-app-subtle border border-app-border space-y-1"
              >
                <h4 className="text-xs font-semibold text-content-primary">
                  {faq.question}
                </h4>
                <p className="text-xs text-content-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Viewport-Docked Live Chat Drawer (Docked above BottomTabBar via #mobile-sheet-root) */}
        {typeof document !== 'undefined' &&
          createPortal(
            <AnimatePresence>
              {chatOpen && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="DeshiMart Live Support"
                  className="pointer-events-auto absolute inset-0 z-50 flex items-end justify-center"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setChatOpen(false)}
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                  />
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="relative z-10 w-full max-h-[85%] h-[420px] bg-white rounded-t-2xl shadow-2xl flex flex-col border-t border-app-border overflow-hidden pb-[env(safe-area-inset-bottom,0px)]"
                  >
                    <div className="pt-2.5 pb-1 shrink-0">
                      <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
                    </div>
                    <div className="px-4 py-2.5 flex items-center justify-between border-b border-app-border shrink-0">
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-content-primary truncate">
                          DeshiMart Live Support (Dhaka Hub)
                        </h3>
                        <span className="text-[10px] text-status-success font-medium block truncate">
                          Online · Customs & Order Specialist
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setChatOpen(false)}
                        className="text-xs font-semibold text-content-muted hover:text-content-primary px-2 py-1 shrink-0"
                      >
                        Close
                      </button>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-2.5">
                      {chatMessages.map((m, idx) => (
                        <div
                          key={idx}
                          className={`max-w-[82%] p-3 rounded-xl text-xs leading-relaxed break-words ${
                            m.sender === 'user'
                              ? 'ml-auto bg-brand-primary text-white'
                              : 'bg-app-subtle border border-app-border text-content-primary'
                          }`}
                        >
                          {m.text}
                        </div>
                      ))}
                    </div>

                    <form
                      onSubmit={handleSendChat}
                      className="px-4 py-3 border-t border-app-border bg-white flex gap-2 shrink-0"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about your order or customs duty..."
                        className="flex-1 h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
                      />
                      <button
                        type="submit"
                        aria-label="Send message"
                        className="w-10 h-10 rounded-lg bg-brand-primary text-white flex items-center justify-center shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.getElementById('mobile-sheet-root') || document.body
          )}
      </div>
    );
  }

  // 9. DEFAULT: ACCOUNT / PROFILE DASHBOARD (Customer Suite + Admin Role Switcher)
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered').length;
  const activeVouchersCount = promoVouchers.filter((v) => v.active).length;

  const accountSections = [
    {
      heading:
        language === 'BN' ? 'অর্ডার ও ডেলিভারি' : 'Orders & Delivery',
      items: [
        {
          label:
            language === 'BN'
              ? 'আমার অর্ডার ও ট্র্যাকিং'
              : 'My Orders & Tracking',
          subtitle: `${orders.length} orders · ${activeOrdersCount} in transit`,
          icon: Package,
          screen: 'orders' as const,
        },
        {
          label:
            language === 'BN'
              ? 'ডেলিভারি ঠিকানা'
              : 'Delivery Addresses',
          subtitle: `${addresses.length} saved addresses`,
          icon: MapPin,
          screen: 'addresses' as const,
        },
        {
          label:
            language === 'BN'
              ? 'পেমেন্ট মাধ্যম'
              : 'Payment Methods',
          subtitle: 'bKash, Nagad, Card, COD',
          icon: CreditCard,
          screen: 'payment_methods' as const,
        },
      ],
    },
    {
      heading:
        language === 'BN' ? 'সংরক্ষিত পণ্য ও তুলনা' : 'Saved & Price Tools',
      items: [
        {
          label:
            language === 'BN'
              ? 'উইশলিস্ট'
              : 'Saved Wishlist',
          subtitle: `${wishlist.length} saved items`,
          icon: Heart,
          screen: 'wishlist' as const,
        },
        {
          label:
            language === 'BN'
              ? '৩০ দিনের প্রাইস ট্র্যাকার'
              : '30-Day Price History',
          subtitle: 'Landed price trends',
          icon: TrendingDown,
          screen: 'price_tracker' as const,
        },
        {
          label:
            language === 'BN'
              ? 'শিপিং রুট তুলনা'
              : 'Shipping Route Compare',
          subtitle: 'Direct Air vs Consolidated',
          icon: Truck,
          screen: 'seller_compare' as const,
        },
      ],
    },
    {
      heading:
        language === 'BN' ? 'সাপোর্ট ও সেটিংস' : 'Support & Preferences',
      items: [
        {
          label:
            language === 'BN'
              ? 'নোটিফিকেশন'
              : 'Notifications',
          subtitle:
            unreadNotificationCount > 0
              ? `${unreadNotificationCount} unread updates`
              : 'All caught up',
          icon: Bell,
          screen: 'notifications' as const,
        },
        {
          label:
            language === 'BN'
              ? 'হেল্প ও সাপোর্ট'
              : 'Help & Support',
          subtitle: '24/7 Live Chat & FAQs',
          icon: HelpCircle,
          screen: 'support' as const,
        },
        {
          label:
            language === 'BN'
              ? 'শপিং গাইড'
              : 'Import & Customs Guide',
          subtitle: 'Duty & delivery overview',
          icon: BookOpen,
          screen: 'guides' as const,
        },
        {
          label:
            language === 'BN'
              ? 'সেটিংস'
              : 'App Settings',
          subtitle: `${currency} · ${language === 'EN' ? 'English' : 'বাংলা'}`,
          icon: Globe,
          screen: 'settings' as const,
        },
      ],
    },
  ];

  return (
    <div className="p-4 space-y-4 pb-6 bg-app-bg">
      {/* 1. Clean Customer Profile Card with Role Switcher & 4-Stat Strip */}
      <div className="bg-white rounded-2xl border border-app-border overflow-hidden">
        {/* Role Switcher Bar */}
        <div className="px-4 py-2.5 bg-app-subtle border-b border-app-border flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-content-secondary">
            {language === 'BN' ? 'অ্যাকাউন্ট মোড' : 'Account Mode'}
          </span>
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-app-border">
            <button
              type="button"
              onClick={() => {
                if (user.role !== 'customer') switchUserRole('customer');
              }}
              className={`h-7 px-3 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                user.role === 'customer'
                  ? 'bg-brand-primary text-white'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              {language === 'BN' ? 'কাস্টমার' : 'Customer'}
            </button>
            <button
              type="button"
              onClick={() => switchUserRole('admin')}
              className={`h-7 px-3 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                user.role === 'admin'
                  ? 'bg-brand-primary text-white'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              {language === 'BN' ? 'অ্যাডমিন' : 'Admin'}
            </button>
          </div>
        </div>

        {/* Member Identity Block */}
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-brand-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
              {user.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-content-primary truncate">
                {user.fullName}
              </h2>
              <p className="text-xs text-content-secondary truncate mt-0.5">
                {user.email}
              </p>
              <p className="font-mono-num text-xs text-content-secondary mt-0.5">
                {user.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              aria-label="Edit profile"
              onClick={() => {
                setEditName(user.fullName);
                setEditEmail(user.email);
                setEditPhone(user.phone);
                setEditProfileOpen(true);
              }}
              className="w-9 h-9 rounded-lg bg-app-subtle border border-app-border text-content-secondary hover:text-content-primary flex items-center justify-center transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Account settings"
              onClick={() => navigateTo('settings')}
              className="w-9 h-9 rounded-lg bg-app-subtle border border-app-border text-content-secondary hover:text-content-primary flex items-center justify-center transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-Column Hairline Summary Strip */}
        <div className="grid grid-cols-4 divide-x divide-app-border border-t border-app-border bg-app-subtle/30">
          <button
            type="button"
            onClick={() => navigateTo('orders')}
            className="py-2.5 px-2 hover:bg-app-subtle text-center transition-colors"
          >
            <p className="font-mono-num text-sm font-bold text-content-primary">
              {orders.length}
            </p>
            <p className="text-xs text-content-secondary truncate">Orders</p>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('wishlist')}
            className="py-2.5 px-2 hover:bg-app-subtle text-center transition-colors"
          >
            <p className="font-mono-num text-sm font-bold text-content-primary">
              {wishlist.length}
            </p>
            <p className="text-xs text-content-secondary truncate">Wishlist</p>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('addresses')}
            className="py-2.5 px-2 hover:bg-app-subtle text-center transition-colors"
          >
            <p className="font-mono-num text-sm font-bold text-content-primary">
              {addresses.length}
            </p>
            <p className="text-xs text-content-secondary truncate">Addresses</p>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('cart')}
            className="py-2.5 px-2 hover:bg-app-subtle text-center transition-colors"
          >
            <p className="font-mono-num text-sm font-bold text-brand-primary">
              {activeVouchersCount}
            </p>
            <p className="text-xs text-content-secondary truncate">Vouchers</p>
          </button>
        </div>
      </div>

      {/* 2. Clean Categorized Navigation Sections */}
      {accountSections.map((section) => (
        <div key={section.heading} className="space-y-1.5">
          <h3 className="px-1 text-xs font-semibold text-content-secondary">
            {section.heading}
          </h3>
          <div className="bg-white rounded-2xl border border-app-border divide-y divide-app-border overflow-hidden">
            {section.items.map((row) => {
              const Icon = row.icon;
              return (
                <button
                  key={row.label}
                  type="button"
                  onClick={() => navigateTo(row.screen)}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-app-subtle/60 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-content-primary truncate">
                        {row.label}
                      </p>
                      <p className="text-xs text-content-secondary truncate">
                        {row.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-content-muted shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Logout Button */}
      <button
        type="button"
        onClick={logoutUser}
        className="w-full h-11 rounded-xl bg-white border border-app-border text-promo-accent font-semibold text-xs flex items-center justify-center gap-2 hover:bg-promo-subtle transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>{language === 'BN' ? 'লগ আউট করুন' : 'Sign Out'}</span>
      </button>

      {/* Viewport-Docked Edit Profile Bottom Sheet Modal (Docked above BottomTabBar via #mobile-sheet-root) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {editProfileOpen && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Edit Profile Details"
                className="pointer-events-auto absolute inset-0 z-50 flex items-end justify-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setEditProfileOpen(false)}
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                />
                <motion.form
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  onSubmit={handleSaveProfile}
                  className="relative z-10 w-full max-h-[85%] bg-white rounded-t-2xl shadow-2xl border-t border-app-border flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0px)]"
                >
                  <div className="pt-2.5 pb-1 shrink-0">
                    <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
                  </div>
                  <div className="px-4 py-2.5 border-b border-app-border flex items-center justify-between gap-2 shrink-0">
                    <h3 className="text-sm font-bold text-content-primary truncate">
                      {language === 'BN' ? 'প্রোফাইল আপডেট করুন' : 'Edit Profile Details'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditProfileOpen(false)}
                      className="text-xs font-semibold text-content-muted hover:text-content-primary px-2 py-1 shrink-0"
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-content-secondary mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-content-secondary mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-content-secondary mb-1">
                        Phone Number (Bangladesh)
                      </label>
                      <input
                        type="tel"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-app-subtle border border-app-border tabular-nums text-xs text-content-primary"
                      />
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-app-border bg-white flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditProfileOpen(false)}
                      className="flex-1 h-11 rounded-xl border border-app-border text-xs font-semibold text-content-primary hover:bg-app-subtle"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold"
                    >
                      Save Profile
                    </button>
                  </div>
                </motion.form>
              </div>
            )}
          </AnimatePresence>,
          document.getElementById('mobile-sheet-root') || document.body
        )}
    </div>
  );
};
