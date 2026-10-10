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
  Download,
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
import { triggerPWAInstallPopup, usePWAInstall } from '../../hooks/usePWAInstall';
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

  const { isInstalled } = usePWAInstall();
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'order' | 'price_drop'>('all');

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'agent',
      text: 'Hello! Welcome to DeshiMart Support. How can we help with your order today?',
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
          text: 'Thanks for reaching out! Our support team has received your message and will assist you shortly.',
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
              ? 'পছন্দের পণ্য সেভ করে রাখুন এবং প্রাইস ড্রপ ট্র্যাক করুন।'
              : 'Save your favorite items and track price drops here.'}
          </p>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="mt-5 px-6 min-h-[44px] rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
          >
            {language === 'BN' ? 'শপিং শুরু করুন' : 'Explore Products'}
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
              ? `ডেলিভারি ঠিকানা (${addresses.length})`
              : `Delivery Addresses (${addresses.length})`}
          </span>
          <button
            type="button"
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'BN' ? 'নতুন ঠিকানা' : 'Add New'}</span>
          </button>
        </div>

        {showAddAddress && (
          <form
            onSubmit={handleCreateAddress}
            className="bg-white rounded-xl border border-app-border p-4 space-y-2.5"
          >
            <h3 className="text-sm font-semibold text-content-primary">
              {language === 'BN' ? 'নতুন ঠিকানা' : 'New Address'}
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
                  Full Name
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
                Street Address
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
                        : '✓ Default'
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
        name: 'Cash on Delivery',
        detail: 'Pay in cash when your order arrives',
        status: 'Available',
        icon: Banknote,
      },
      {
        id: 'bkash',
        name: 'bKash',
        detail: '+880 1712-345678',
        status: 'Saved',
        icon: Smartphone,
      },
      {
        id: 'nagad',
        name: 'Nagad',
        detail: '+880 1819-345678',
        status: 'Saved',
        icon: Wallet,
      },
      {
        id: 'card',
        name: 'Visa •••• 8910',
        detail: 'Expires 12/28',
        status: 'Saved',
        icon: CreditCard,
      },
    ];

    return (
      <div className="p-4 space-y-3.5 pb-6 bg-app-bg">
        <div className="px-0.5">
          <h2 className="text-sm font-semibold text-content-primary">
            {language === 'BN' ? 'পেমেন্ট মাধ্যম' : 'Payment Methods'}
          </h2>
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
                    <p className="text-xs font-semibold text-content-primary truncate">
                      {m.name}
                    </p>
                    <p className="text-[11px] text-content-secondary truncate mt-0.5">
                      {m.detail}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold shrink-0 ml-2 ${
                    active ? 'text-brand-primary' : 'text-content-muted'
                  }`}
                >
                  {active ? '✓ Default' : m.status}
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
                  {selectedProduct.originLabel} · Verified Seller
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
              ? 'সাপ্লায়ারের পণ্যসমূহ'
              : `Products (${supplierCatalog.length})`}
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
          };
        case 'price_drop':
          return {
            Icon: TrendingDown,
            bg: read
              ? 'bg-app-subtle text-content-secondary'
              : 'bg-brand-subtle text-brand-primary',
          };
        default:
          return {
            Icon: Sparkles,
            bg: read
              ? 'bg-app-subtle text-content-secondary'
              : 'bg-brand-subtle text-brand-primary',
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
      <div className="p-4 space-y-3 pb-6 bg-app-bg">
        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-app-subtle border border-app-border rounded-xl overflow-x-auto no-scrollbar">
          {[
            {
              id: 'all' as const,
              label: isBn ? 'সব' : 'All',
            },
            {
              id: 'unread' as const,
              label:
                unreadNotificationCount > 0
                  ? isBn
                    ? `অপঠিত (${unreadNotificationCount})`
                    : `Unread (${unreadNotificationCount})`
                  : isBn
                  ? 'অপঠিত'
                  : 'Unread',
            },
            {
              id: 'order' as const,
              label: isBn ? 'অর্ডার' : 'Orders',
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
                className={`flex-1 min-w-fit px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
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

        {/* Clean Action Bar */}
        {(unreadNotificationCount > 0 || hasReadNotifications) && (
          <div className="flex items-center justify-end gap-3 px-0.5">
            {unreadNotificationCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
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
        )}

        {/* Notification List or Empty State */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-app-border p-8 text-center space-y-3">
            <div className="w-11 h-11 rounded-xl bg-app-subtle text-content-secondary flex items-center justify-center mx-auto">
              <Bell className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-content-primary">
                {notifFilter === 'unread'
                  ? isBn
                    ? 'কোনো অপঠিত নোটিফিকেশন নেই'
                    : 'All Caught Up'
                  : isBn
                  ? 'কোনো নোটিফিকেশন নেই'
                  : 'No Notifications'}
              </h3>
              <p className="text-xs text-content-secondary max-w-[230px] mx-auto leading-relaxed">
                {isBn
                  ? 'আপনার অর্ডার আপডেট এবং প্রাইস অ্যালার্ট এখানে দেখা যাবে।'
                  : 'Order updates and price alerts will appear here.'}
              </p>
            </div>
            {notifFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setNotifFilter('all')}
                className="px-4 py-2 rounded-lg bg-app-subtle hover:bg-slate-200 text-xs font-semibold text-content-primary transition-colors"
              >
                {isBn ? 'সব দেখুন' : 'View All'}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-app-border divide-y divide-app-border overflow-hidden">
            {filteredNotifications.map((notif) => {
              const { Icon, bg } = getNotifIconConfig(notif.type, notif.read);
              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNotificationClick(notif);
                    }
                  }}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    !notif.read
                      ? 'bg-brand-subtle/20 hover:bg-brand-subtle/35'
                      : 'bg-white hover:bg-app-subtle/40'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-xs leading-snug line-clamp-1 ${
                          !notif.read
                            ? 'font-bold text-content-primary'
                            : 'font-medium text-content-primary'
                        }`}
                      >
                        {notif.title}
                      </h3>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] text-content-muted whitespace-nowrap">
                          {notif.timestamp}
                        </span>
                        <button
                          type="button"
                          aria-label="Delete notification"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="w-6 h-6 -mr-1 rounded-md text-content-muted hover:text-promo-accent flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-content-secondary mt-0.5 leading-relaxed line-clamp-2">
                      {notif.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 6. SHOPPING GUIDES SCREEN
  if (currentScreen === 'guides') {
    return (
      <div className="p-4 space-y-3.5 pb-6 bg-app-bg">
        <div className="bg-white rounded-xl border border-app-border p-4">
          <h2 className="text-sm font-semibold text-content-primary">
            Shopping Guides
          </h2>
          <p className="text-xs text-content-secondary mt-1">
            Helpful tips for international orders, delivery options, and returns.
          </p>
        </div>

        <div className="space-y-3">
          {shoppingGuides.map((guide) => (
            <article
              key={guide.id}
              className="bg-white rounded-xl border border-app-border p-4 space-y-2"
            >
              <div className="flex items-center gap-1.5 text-[11px] text-content-secondary">
                <span className="font-semibold text-brand-primary">{guide.category}</span>
                <span aria-hidden="true">·</span>
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

  // 7. APP SETTINGS SCREEN
  if (currentScreen === 'settings') {
    return (
      <div className="p-4 space-y-3.5 pb-6 bg-app-bg">
        {/* Currency Selection */}
        <div className="bg-white rounded-xl border border-app-border p-4 space-y-2.5">
          <h2 className="text-xs font-semibold text-content-primary">
            Currency
          </h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setCurrency('BDT');
                showToast('Currency set to BDT (৳)');
              }}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                currency === 'BDT'
                  ? 'bg-brand-subtle/40 border-brand-primary'
                  : 'bg-white border-app-border'
              }`}
            >
              <span className="text-xs font-semibold text-content-primary">
                BDT (৳) — Bangladeshi Taka
              </span>
              {currency === 'BDT' && (
                <span className="text-xs font-semibold text-brand-primary">
                  ✓ Active
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrency('USD');
                showToast('Currency set to USD ($)');
              }}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                currency === 'USD'
                  ? 'bg-brand-subtle/40 border-brand-primary'
                  : 'bg-white border-app-border'
              }`}
            >
              <span className="text-xs font-semibold text-content-primary">
                USD ($) — US Dollar
              </span>
              <span className="text-xs tabular-nums font-medium text-content-secondary">
                {currency === 'USD' ? '✓ Active' : '$1 = ৳ 120'}
              </span>
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-xl border border-app-border p-4 space-y-2.5">
          <h2 className="text-xs font-semibold text-content-primary">Language</h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setLanguage('EN');
                showToast('Language set to English');
              }}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                language === 'EN'
                  ? 'bg-brand-subtle/40 border-brand-primary'
                  : 'bg-white border-app-border'
              }`}
            >
              <span className="text-xs font-semibold text-content-primary">English</span>
              {language === 'EN' && (
                <span className="text-xs font-semibold text-brand-primary">
                  ✓ Active
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setLanguage('BN');
                showToast('ভাষা বাংলায় পরিবর্তন করা হয়েছে');
              }}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                language === 'BN'
                  ? 'bg-brand-subtle/40 border-brand-primary'
                  : 'bg-white border-app-border'
              }`}
            >
              <span className="text-xs font-semibold text-content-primary">
                বাংলা (Bengali)
              </span>
              {language === 'BN' && (
                <span className="text-xs font-semibold text-brand-primary">
                  ✓ সক্রিয়
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="bg-white rounded-xl border border-app-border p-4 space-y-2.5">
          <h2 className="text-xs font-semibold text-content-primary">
            Display
          </h2>
          <label className="flex items-center justify-between text-xs font-medium text-content-primary cursor-pointer py-0.5">
            <span>High-Contrast Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="w-4 h-4 accent-emerald-700"
            />
          </label>
        </div>

        {/* Progressive Web App Installation & Auto-Update Status */}
        <div className="bg-white rounded-xl border border-app-border p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xs font-semibold text-content-primary">
              {language === 'BN' ? 'DeshiMart অ্যাপ' : 'DeshiMart Web App'}
            </h2>
            <p className="text-[11px] text-content-secondary mt-0.5">
              {isInstalled
                ? language === 'BN'
                  ? 'ইনস্টল করা আছে · স্বয়ংক্রিয় আপডেট চালু'
                  : 'Installed · Auto-updates active'
                : language === 'BN'
                ? 'হোম স্ক্রিনে যোগ করুন · স্বয়ংক্রিয় আপডেট চালু'
                : 'Add to home screen · Auto-updates active'}
            </p>
          </div>
          {!isInstalled && (
            <button
              type="button"
              onClick={() => triggerPWAInstallPopup()}
              className="h-9 px-3.5 rounded-lg bg-brand-subtle hover:bg-brand-primary text-brand-primary hover:text-white border border-brand-border text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'BN' ? 'ইনস্টল' : 'Install'}</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigateTo('account')}
          className="w-full h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  // 8. HELP & SUPPORT SCREEN
  if (currentScreen === 'support') {
    return (
      <div className="p-4 space-y-3.5 pb-6 bg-app-bg">
        <div className="bg-white rounded-xl border border-app-border p-4 space-y-3">
          <h2 className="text-sm font-semibold text-content-primary">
            Contact Support
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="p-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white flex flex-col items-center text-center gap-1 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-emerald-100" />
              <span className="text-xs font-semibold">
                Live Chat
              </span>
              <span className="text-[11px] text-emerald-100/90">Available 24/7</span>
            </button>

            <button
              type="button"
              onClick={() =>
                showToast('Calling Support: +880 1712 345678')
              }
              className="p-3.5 rounded-xl bg-brand-subtle border border-brand-border flex flex-col items-center text-center gap-1"
            >
              <PhoneCall className="w-5 h-5 text-brand-primary" />
              <span className="text-xs font-semibold text-content-primary">
                Call Support
              </span>
              <span className="text-[11px] tabular-nums text-content-secondary">
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
          <div className="divide-y divide-app-border">
            {SUPPORT_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="py-3 first:pt-0 last:pb-0 space-y-1"
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

        {/* Viewport-Docked Live Chat Drawer */}
        {typeof document !== 'undefined' &&
          createPortal(
            <AnimatePresence>
              {chatOpen && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="DeshiMart Support Chat"
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
                          DeshiMart Support
                        </h3>
                        <span className="text-[11px] text-status-success font-medium block truncate">
                          Online
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
                        placeholder="Write a message..."
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
              ? 'আমার অর্ডার'
              : 'My Orders',
          subtitle: `${orders.length} orders · ${activeOrdersCount} active`,
          icon: Package,
          screen: 'orders' as const,
        },
        {
          label:
            language === 'BN'
              ? 'ডেলিভারি ঠিকানা'
              : 'Delivery Addresses',
          subtitle: `${addresses.length} saved`,
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
              : 'Wishlist',
          subtitle: `${wishlist.length} saved items`,
          icon: Heart,
          screen: 'wishlist' as const,
        },
        {
          label:
            language === 'BN'
              ? '৩০ দিনের প্রাইস হিস্ট্রি'
              : 'Price History',
          subtitle: '30-day price trends',
          icon: TrendingDown,
          screen: 'price_tracker' as const,
        },
        {
          label:
            language === 'BN'
              ? 'শিপিং রুট তুলনা'
              : 'Route Compare',
          subtitle: 'Compare delivery speed & cost',
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
              ? `${unreadNotificationCount} unread`
              : 'All caught up',
          icon: Bell,
          screen: 'notifications' as const,
        },
        {
          label:
            language === 'BN'
              ? 'হেল্প ও সাপোর্ট'
              : 'Help & Support',
          subtitle: 'Live chat & FAQs',
          icon: HelpCircle,
          screen: 'support' as const,
        },
        {
          label:
            language === 'BN'
              ? 'শপিং গাইড'
              : 'Shopping Guides',
          subtitle: 'Delivery & return tips',
          icon: BookOpen,
          screen: 'guides' as const,
        },
        {
          label:
            language === 'BN'
              ? 'অ্যাপ সেটিংস'
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
