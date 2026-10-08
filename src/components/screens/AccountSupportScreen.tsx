import React, { useState } from 'react';
import {
  Banknote,
  Bell,
  BookOpen,
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
  Star,
  Store,
  Trash2,
  Wallet,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { SHOPPING_GUIDES, SUPPORT_FAQS } from '../../data/catalogData';
import { PaymentMethodId } from '../../types/deshimart';
import { ProductCard } from '../shared/ProductCard';

export const AccountSupportScreen: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    user,
    updateUserProfile,
    logoutUser,
    wishlist,
    toggleWishlist,
    products,
    selectedProduct,
    addToCart,
    formatPrice,
    notifications,
    markAllNotificationsRead,
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

  // 1. WISHLIST SCREEN (Including Empty State from Image 2 Screen 28 & Image 4 Screen 19)
  if (currentScreen === 'wishlist') {
    const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

    if (wishlistedProducts.length === 0) {
      return (
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center bg-white">
          <div className="w-20 h-20 rounded-full bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center mb-4">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-base font-extrabold text-[#0B3D2E]">
            {language === 'BN' ? 'আপনার উইশলিস্ট খালি' : 'Your Wishlist is Empty'}
          </h2>
          <p className="text-xs text-[#6B7280] mt-1 max-w-[230px]">
            {language === 'BN'
              ? 'পছন্দের গ্লোবাল পণ্য সেভ করে রাখুন এবং ল্যান্ডেড প্রাইস ড্রপ ট্র্যাক করুন।'
              : 'Save your favorite global items and track their landed price drops here.'}
          </p>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="mt-5 px-6 h-11 rounded-xl bg-[#0EA75F] text-white text-xs font-bold shadow-md"
          >
            {language === 'BN' ? 'শপিং শুরু করুন' : 'Start Exploring'}
          </button>
        </div>
      );
    }

    return (
      <div className="p-3.5 space-y-3 pb-6">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#0B3D2E]">
            {language === 'BN'
              ? `সংরক্ষিত পণ্য (${wishlistedProducts.length})`
              : `Saved Items (${wishlistedProducts.length})`}
          </span>
          <span className="text-[11px] text-[#0EA75F] font-semibold">
            {language === 'BN' ? 'ল্যান্ডেড প্রাইস অন্তর্ভুক্ত' : 'Landed Price Included'}
          </span>
        </div>

        <div className="space-y-2.5">
          {wishlistedProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-3 flex items-center gap-3"
            >
              <img
                src={prod.image}
                alt={prod.name}
                referrerPolicy="no-referrer"
                onClick={() =>
                  navigateTo('product_detail', { productId: prod.id })
                }
                className="w-16 h-16 rounded-xl object-cover bg-[#F8FAFC] cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3
                    onClick={() =>
                      navigateTo('product_detail', { productId: prod.id })
                    }
                    className="text-xs font-extrabold text-[#0B3D2E] truncate cursor-pointer"
                  >
                    {language === 'BN' ? prod.nameBn : prod.name}
                  </h3>
                  <button
                    type="button"
                    aria-label="Remove from wishlist"
                    onClick={() => toggleWishlist(prod.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 -mr-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#6B7280] mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-mono-num font-bold text-[#0B3D2E]">
                    {prod.rating.toFixed(1)}
                  </span>
                  <span>({prod.reviewCount})</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono-num text-sm font-extrabold text-[#0EA75F]">
                    {formatPrice(prod.totalLandedBdt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => addToCart(prod.id, 1)}
                    className="px-3 py-1.5 rounded-xl bg-[#0EA75F] text-white text-xs font-bold flex items-center gap-1"
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
      <div className="p-3.5 space-y-3.5 pb-6">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold text-[#0B3D2E]">
            {language === 'BN'
              ? `আপনার ডেলিভারি ঠিকানা (${addresses.length})`
              : `Saved Delivery Addresses (${addresses.length})`}
          </span>
          <button
            type="button"
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="text-xs font-bold text-[#0EA75F] flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'BN' ? 'নতুন ঠিকানা' : 'Add Address'}</span>
          </button>
        </div>

        {showAddAddress && (
          <form
            onSubmit={handleCreateAddress}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5"
          >
            <h3 className="text-xs font-extrabold text-[#0B3D2E]">
              {language === 'BN' ? 'নতুন ডেলিভারি ঠিকানা যোগ করুন' : 'New Delivery Address'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                  Label
                </label>
                <input
                  type="text"
                  required
                  value={addrLabel}
                  onChange={(e) => setAddrLabel(e.target.value)}
                  placeholder="Home / Office"
                  className="w-full h-10 px-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#0B3D2E]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#0B3D2E]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                Street / Area / House
              </label>
              <input
                type="text"
                required
                value={addrStreet}
                onChange={(e) => setAddrStreet(e.target.value)}
                placeholder="House 14, Road 5, Dhanmondi"
                className="w-full h-10 px-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#0B3D2E]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#0B3D2E]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={addrPostal}
                  onChange={(e) => setAddrPostal(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F8FAFC] border border-slate-200 font-mono-num text-xs text-[#0B3D2E]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-10 rounded-xl bg-[#0EA75F] text-white text-xs font-bold"
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
                className={`p-3.5 rounded-2xl border bg-white space-y-2 ${
                  isDefault ? 'border-[#0EA75F]' : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0EA75F]" />
                    <span className="text-xs font-extrabold text-[#0B3D2E]">
                      {addr.fullName}
                    </span>
                    <span className="text-[10px] font-bold text-[#0EA75F] bg-[#ECFDF5] px-2 py-0.5 rounded-md">
                      {addr.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Delete address"
                    onClick={() => deleteAddress(addr.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#6B7280]">{addr.address}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono-num text-[11px] font-semibold text-[#0B3D2E]">
                    {addr.phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAddressId(addr.id);
                      showToast('Default delivery address updated');
                    }}
                    className={`text-xs font-bold ${
                      isDefault ? 'text-[#0EA75F]' : 'text-[#6B7280] hover:text-[#0B3D2E]'
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
        name: 'bKash / Nagad Personal Wallet',
        detail: '+880 1712-345678 · Instant Tokenized Checkout',
        status: 'Connected',
        icon: Smartphone,
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
      <div className="p-3.5 space-y-3.5 pb-6">
        <div className="bg-[#ECFDF5] border border-[#0EA75F]/30 rounded-2xl p-3.5 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#0EA75F] shrink-0" />
          <p className="text-xs text-[#0B3D2E] leading-relaxed">
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
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  active
                    ? 'bg-[#ECFDF5] border-2 border-[#0EA75F]'
                    : 'bg-white border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      active
                        ? 'bg-[#0EA75F] text-white'
                        : 'bg-[#F8FAFC] text-[#0B3D2E]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#0B3D2E] truncate">
                      {m.name}
                    </p>
                    <p className="text-[11px] text-[#6B7280] truncate">{m.detail}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#0EA75F] shrink-0 ml-2">
                  {active ? '✓ Active' : m.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 4. DEDICATED VERIFIED SUPPLIER STOREFRONT (Screen 25 in UI Kits)
  if (currentScreen === 'supplier_store') {
    const supplierName = selectedProduct.supplierName;
    const supplierCatalog = products.filter(
      (p) => p.supplierName === supplierName || p.category === selectedProduct.category
    );

    return (
      <div className="p-3.5 space-y-4 pb-6">
        {/* Supplier Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h2 className="text-sm font-extrabold text-[#0B3D2E]">
                    {supplierName}
                  </h2>
                  <CheckCircle2 className="w-4 h-4 text-[#0EA75F]" />
                </div>
                <p className="text-xs text-[#6B7280]">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                isFollowingSupplier
                  ? 'bg-[#ECFDF5] text-[#0EA75F] border border-[#0EA75F]'
                  : 'bg-[#0EA75F] text-white'
              }`}
            >
              {isFollowingSupplier ? 'Following ✓' : '+ Follow'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            <div>
              <span className="font-mono-num font-extrabold text-[#0B3D2E] block">
                {selectedProduct.supplierProductsCount}
              </span>
              <span className="text-[10px] text-[#6B7280]">Products</span>
            </div>
            <div>
              <span className="font-mono-num font-extrabold text-[#0EA75F] block">
                98.4%
              </span>
              <span className="text-[10px] text-[#6B7280]">On-Time Ship</span>
            </div>
            <div>
              <span className="font-mono-num font-extrabold text-[#0B3D2E] block">
                {selectedProduct.supplierFollowers}
              </span>
              <span className="text-[10px] text-[#6B7280]">Followers</span>
            </div>
          </div>
        </div>

        {/* Supplier Product Grid */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold text-[#0B3D2E] px-1">
            {language === 'BN'
              ? 'সাপ্লায়ারের ভেরিফাইড পণ্যসমূহ'
              : 'Verified Factory Catalog (Landed Price)'}
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {supplierCatalog.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 5. NOTIFICATIONS SCREEN (Screen 20 in UI Kits 2 & 3)
  if (currentScreen === 'notifications') {
    return (
      <div className="p-3.5 space-y-3 pb-6">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#0B3D2E]">
            Recent Alerts & Updates
          </span>
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-[#0EA75F]"
          >
            Mark all read
          </button>
        </div>

        <div className="space-y-2.5">
          {notifications.map((notif) => (
            <button
              key={notif.id}
              type="button"
              onClick={() => {
                if (notif.targetScreen) {
                  navigateTo(notif.targetScreen, {
                    productId: notif.targetProductId,
                    orderId: notif.targetOrderId,
                  });
                }
              }}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-colors ${
                !notif.read
                  ? 'bg-[#ECFDF5]/70 border-[#0EA75F]/40'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#0EA75F] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-extrabold text-[#0B3D2E] truncate">
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-[#6B7280] shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                  {notif.body}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 6. SHOPPING GUIDES / BLOG SCREEN (Screen 26 in Image 2 & Screen 27 in Image 4)
  if (currentScreen === 'guides') {
    return (
      <div className="p-3.5 space-y-3.5 pb-6">
        <div className="bg-[#0B3D2E] text-white rounded-2xl p-4">
          <h2 className="text-sm font-extrabold">
            Smarter Cross-Border Shopping Guides
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            Learn how DeshiMart eliminates customs surprises and verifies factories.
          </p>
        </div>

        <div className="space-y-3">
          {SHOPPING_GUIDES.map((guide) => (
            <article
              key={guide.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5"
            >
              <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                <span className="font-bold text-[#0EA75F]">{guide.category}</span>
                <span>·</span>
                <span>{guide.date}</span>
                <span>·</span>
                <span>{guide.readTime}</span>
              </div>
              <h3 className="text-sm font-extrabold text-[#0B3D2E]">
                {guide.title}
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {guide.summary}
              </p>
              <ul className="space-y-1.5 pt-1">
                {guide.bulletPoints.map((bp, i) => (
                  <li
                    key={i}
                    className="text-xs text-[#0B3D2E] flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA75F] mt-1.5 shrink-0" />
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

  // 7. SETTINGS & CURRENCY / LANGUAGE SCREEN (Screen 27 in Image 2 & Screen 24 in Image 4)
  if (currentScreen === 'settings') {
    return (
      <div className="p-3.5 space-y-4 pb-6">
        {/* Currency Selection */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
          <h2 className="text-xs font-extrabold text-[#0B3D2E]">
            Landed Cost Display Currency
          </h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setCurrency('BDT');
                showToast('Currency set to BDT (৳) Bangladeshi Taka');
              }}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left ${
                currency === 'BDT'
                  ? 'bg-[#ECFDF5] border-[#0EA75F]'
                  : 'bg-[#F8FAFC] border-slate-200'
              }`}
            >
              <span className="text-xs font-bold text-[#0B3D2E]">
                BDT (৳) — Bangladeshi Taka
              </span>
              <span className="text-xs font-mono-num font-bold text-[#0EA75F]">
                Bangladesh
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrency('USD');
                showToast('Currency set to USD ($) US Dollar');
              }}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left ${
                currency === 'USD'
                  ? 'bg-[#ECFDF5] border-[#0EA75F]'
                  : 'bg-[#F8FAFC] border-slate-200'
              }`}
            >
              <span className="text-xs font-bold text-[#0B3D2E]">
                USD ($) — US Dollar
              </span>
              <span className="text-xs font-mono-num font-bold text-[#6B7280]">
                Global ($1 = ৳120)
              </span>
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
          <h2 className="text-xs font-extrabold text-[#0B3D2E]">App Language</h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setLanguage('EN');
                showToast('Language set to English');
              }}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left ${
                language === 'EN'
                  ? 'bg-[#ECFDF5] border-[#0EA75F]'
                  : 'bg-[#F8FAFC] border-slate-200'
              }`}
            >
              <span className="text-xs font-bold text-[#0B3D2E]">English</span>
              <span className="text-xs text-[#0EA75F] font-semibold">
                Plus Jakarta Sans
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLanguage('BN');
                showToast('ভাষা বাংলায় পরিবর্তন করা হয়েছে (Noto Sans Bengali)');
              }}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left ${
                language === 'BN'
                  ? 'bg-[#ECFDF5] border-[#0EA75F]'
                  : 'bg-[#F8FAFC] border-slate-200'
              }`}
            >
              <span className="text-xs font-bold text-[#0B3D2E]">
                বাংলা (Bengali)
              </span>
              <span className="text-xs text-[#0EA75F] font-semibold">
                Noto Sans Bengali
              </span>
            </button>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <h2 className="text-xs font-extrabold text-[#0B3D2E]">
            App Preferences
          </h2>
          <label className="flex items-center justify-between text-xs font-semibold text-[#0B3D2E] cursor-pointer">
            <span>High-Contrast Outdoor Legibility</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="w-4 h-4 accent-[#0EA75F]"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="w-full h-12 rounded-xl bg-[#0EA75F] text-white font-bold text-xs shadow-md"
        >
          Save Changes
        </button>
      </div>
    );
  }

  // 8. HELP & SUPPORT SCREEN (Screen 20/21/23 in UI Kits)
  if (currentScreen === 'support') {
    return (
      <div className="p-3.5 space-y-4 pb-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <h2 className="text-sm font-extrabold text-[#0B3D2E]">
            How can we help you today?
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="p-3 rounded-2xl bg-[#ECFDF5] border border-[#0EA75F]/30 flex flex-col items-center text-center gap-1"
            >
              <MessageCircle className="w-5 h-5 text-[#0EA75F]" />
              <span className="text-xs font-extrabold text-[#0B3D2E]">
                24/7 Live Chat
              </span>
              <span className="text-[10px] text-[#6B7280]">Replies in &lt; 2m</span>
            </button>

            <button
              type="button"
              onClick={() =>
                showToast('Calling DeshiMart Dhaka Support: +880 1712 345678')
              }
              className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col items-center text-center gap-1"
            >
              <PhoneCall className="w-5 h-5 text-[#0B3D2E]" />
              <span className="text-xs font-extrabold text-[#0B3D2E]">
                Call Support
              </span>
              <span className="text-[10px] font-mono-num text-[#6B7280]">
                +880 1712 345678
              </span>
            </button>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
          <h3 className="text-xs font-extrabold text-[#0B3D2E]">
            Frequently Asked Questions
          </h3>
          <div className="space-y-2.5">
            {SUPPORT_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 space-y-1"
              >
                <h4 className="text-xs font-bold text-[#0B3D2E]">
                  {faq.question}
                </h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Chat Drawer */}
        {chatOpen && (
          <div className="absolute inset-0 z-50 flex items-end justify-center">
            <div
              onClick={() => setChatOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <div className="relative z-10 w-full bg-white rounded-t-3xl p-4 shadow-2xl flex flex-col h-[420px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-extrabold text-[#0B3D2E]">
                    DeshiMart Live Support (Dhaka Hub)
                  </h3>
                  <span className="text-[10px] text-[#0EA75F] font-semibold">
                    Online · Customs & Order Specialist
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="text-xs font-bold text-slate-400 px-2 py-1"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'ml-auto bg-[#0EA75F] text-white'
                        : 'bg-[#F1F5F9] text-[#0B3D2E]'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your order or customs duty..."
                  className="flex-1 h-10 px-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#0B3D2E]"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="w-10 h-10 rounded-xl bg-[#0EA75F] text-white flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 9. DEFAULT: ACCOUNT / PROFILE DASHBOARD (Screen 18 / 22 in UI Kits)
  const accountLinks = [
    {
      label: language === 'BN' ? 'আমার অর্ডার ও লাইভ ট্র্যাকিং' : 'My Orders & Live Tracking',
      subtitle: 'Track customs & courier progress',
      icon: Package,
      screen: 'orders' as const,
    },
    {
      label: language === 'BN' ? 'উইশলিস্ট ও সেভ করা পণ্য' : 'Wishlist & Saved Items',
      subtitle: `${wishlist.length} items with price alerts`,
      icon: Heart,
      screen: 'wishlist' as const,
    },
    {
      label: language === 'BN' ? 'ডেলিভারি ঠিকানা' : 'Delivery Addresses',
      subtitle: `${addresses.length} saved addresses in Bangladesh`,
      icon: MapPin,
      screen: 'addresses' as const,
    },
    {
      label: language === 'BN' ? 'পেমেন্ট মাধ্যম' : 'Payment Methods',
      subtitle: 'COD, bKash, Nagad, Visa, PayPal',
      icon: CreditCard,
      screen: 'payment_methods' as const,
    },
    {
      label: language === 'BN' ? 'ভেরিফাইড সাপ্লায়ার স্টোর' : 'Verified Supplier Storefront',
      subtitle: `${selectedProduct.supplierName} (${selectedProduct.originLabel})`,
      icon: Store,
      screen: 'supplier_store' as const,
    },
    {
      label: language === 'BN' ? 'নোটিফিকেশন ও প্রাইস অ্যালার্ট' : 'Notifications & Price Drop Alerts',
      subtitle: 'Order & 30-day deal notifications',
      icon: Bell,
      screen: 'notifications' as const,
    },
    {
      label: language === 'BN' ? 'কারেন্সি ও ভাষা' : 'Currency & Language',
      subtitle: `${currency} · ${language === 'EN' ? 'English' : 'বাংলা (Noto Sans Bengali)'}`,
      icon: Globe,
      screen: 'settings' as const,
    },
    {
      label: language === 'BN' ? 'ক্রস-বর্ডার শপিং গাইড' : 'Cross-Border Shopping Guides',
      subtitle: 'How to buy globally without hidden tax',
      icon: BookOpen,
      screen: 'guides' as const,
    },
    {
      label: language === 'BN' ? 'হেল্প ও ২৪/৭ সাপোর্ট' : 'Help & 24/7 Support',
      subtitle: 'FAQs, Live Chat & 30-Day Return Policy',
      icon: HelpCircle,
      screen: 'support' as const,
    },
  ];

  return (
    <div className="p-4 space-y-4 pb-6">
      {/* Profile Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#0EA75F] text-white font-extrabold text-lg flex items-center justify-center shadow-sm">
            {user.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#0B3D2E]">
              {user.fullName}
            </h2>
            <p className="text-xs text-[#6B7280]">{user.email}</p>
            <p className="font-mono-num text-[11px] text-[#0EA75F] font-semibold mt-0.5">
              {user.phone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Edit profile"
            onClick={() => {
              setEditName(user.fullName);
              setEditEmail(user.email);
              setEditPhone(user.phone);
              setEditProfileOpen(true);
            }}
            className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Account settings"
            onClick={() => navigateTo('settings')}
            className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center text-[#0B3D2E]"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Tap List Rows */}
      <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
        {accountLinks.map((row) => {
          const Icon = row.icon;
          return (
            <button
              key={row.label}
              type="button"
              onClick={() => navigateTo(row.screen)}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#0B3D2E] truncate">
                    {row.label}
                  </p>
                  <p className="text-[11px] text-[#6B7280] truncate">
                    {row.subtitle}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={logoutUser}
        className="w-full h-11 rounded-2xl bg-white border border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>{language === 'BN' ? 'লগ আউট করুন' : 'Log Out'}</span>
      </button>

      {/* Edit Profile Bottom Sheet Modal */}
      {editProfileOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
          <div
            onClick={() => setEditProfileOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <form
            onSubmit={handleSaveProfile}
            className="relative z-10 w-full bg-white rounded-t-3xl p-5 shadow-2xl space-y-3"
          >
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1" />
            <h3 className="text-sm font-extrabold text-[#0B3D2E]">
              {language === 'BN' ? 'প্রোফাইল আপডেট করুন' : 'Edit Profile Details'}
            </h3>
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#0B3D2E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#0B3D2E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] mb-1">
                Phone Number (Bangladesh)
              </label>
              <input
                type="tel"
                required
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#F8FAFC] border border-slate-200 font-mono-num text-xs text-[#0B3D2E]"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-xs font-bold text-[#6B7280]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-xl bg-[#0EA75F] text-white text-xs font-bold"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
