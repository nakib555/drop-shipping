import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Banknote,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Package,
  Plane,
  Plus,
  ShieldCheck,
  Smartphone,
  Truck,
  Wallet,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { PaymentMethodId } from '../../types/deshimart';

export const CheckoutFlowScreen: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    user,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    shippingMethod,
    setShippingMethod,
    paymentMethod,
    setPaymentMethod,
    cart,
    cartCount,
    products,
    promoCode,
    cartTotals,
    formatPrice,
    language,
    placeOrder,
    selectedOrder,
  } = useDeshiMart();

  const isBn = language === 'BN';

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newName, setNewName] = useState(user.fullName || 'Tanvir Ahmed');
  const [newPhone, setNewPhone] = useState(user.phone || '+880 1712 345678');
  const [newStreet, setNewStreet] = useState('House 14, Road 5, Dhanmondi');
  const [newCity, setNewCity] = useState('Dhaka');
  const [newZip, setNewZip] = useState('1209');

  const [bkashNumber, setBkashNumber] = useState('01712-345678');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8910');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  const activeAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const totalSavingsBdt =
    cartTotals.consolidationSavingsBdt + cartTotals.promoDiscountBdt;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;
    addAddress({
      label: newLabel.trim() || 'Home',
      fullName: newName.trim() || user.fullName,
      phone: newPhone.trim() || user.phone,
      address: newStreet.trim(),
      city: newCity.trim() || 'Dhaka',
      postalCode: newZip.trim() || '1209',
    });
    setShowNewAddressForm(false);
  };

  // Shared 3-Step Mobile Checkout Progress Header
  const renderStepHeader = (activeStep: 1 | 2 | 3) => {
    const steps = [
      {
        num: 1,
        label: isBn ? '১. ডেলিভারি' : '1. Shipping',
        screen: 'checkout_shipping' as const,
      },
      {
        num: 2,
        label: isBn ? '২. পেমেন্ট' : '2. Payment',
        screen: 'checkout_payment' as const,
      },
      {
        num: 3,
        label: isBn ? '৩. রিভিউ' : '3. Review',
        screen: 'checkout_review' as const,
      },
    ];

    return (
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white border border-app-border">
        {steps.map((st) => {
          const isCurrent = st.num === activeStep;
          const isCompleted = st.num < activeStep;
          return (
            <button
              key={st.num}
              type="button"
              disabled={st.num > activeStep}
              onClick={() => {
                if (st.num < activeStep) {
                  navigateTo(st.screen);
                }
              }}
              className={`min-h-[36px] px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
                isCurrent
                  ? 'bg-brand-primary text-white shadow-xs'
                  : isCompleted
                  ? 'bg-brand-subtle text-brand-primary hover:bg-emerald-100/70 cursor-pointer'
                  : 'text-content-muted cursor-default'
              }`}
            >
              {isCompleted && <Check className="w-3.5 h-3.5 shrink-0" />}
              <span className="truncate">{st.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // ===================== STEP 1: SHIPPING ADDRESS & CORRIDOR SPEED =====================
  if (currentScreen === 'checkout_shipping') {
    return (
      <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between bg-app-bg">
        <div className="space-y-4">
          {renderStepHeader(1)}

          {/* 1. Saved Delivery Addresses Ledger (Single-Elevation Surface) */}
          <div className="bg-white rounded-2xl border border-app-border overflow-hidden">
            <div className="px-4 py-3 bg-app-subtle/70 border-b border-app-border flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold tracking-tight text-content-primary">
                  {isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Destination'}
                </h2>
                <p className="text-xs text-content-secondary mt-0.5">
                  {isBn
                    ? 'কাস্টমস ক্লিয়ারেন্সের পর ডোরস্টেপ কুরিয়ার'
                    : 'Doorstep eCourier hub after Dhaka customs clearance'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="min-h-[34px] px-2.5 rounded-lg bg-brand-subtle border border-brand-border text-brand-primary text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isBn ? 'নতুন ঠিকানা' : 'Add New'}</span>
              </button>
            </div>

            <div className="divide-y divide-app-border">
              {addresses.map((addr) => {
                const isSelected = addr.id === selectedAddressId;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-brand-subtle/45'
                        : 'bg-white hover:bg-app-subtle/50'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm leading-5 font-bold tracking-tight text-content-primary truncate">
                          {addr.fullName}
                        </span>
                        <span className="text-xs font-semibold text-brand-primary shrink-0">
                          {addr.label} · {addr.city}
                        </span>
                      </div>
                      <p className="text-xs leading-4 text-content-secondary mt-1">
                        {addr.address}, {addr.city} {addr.postalCode}
                      </p>
                      <p className="font-mono-num text-xs leading-4 text-content-secondary mt-1">
                        {addr.phone}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Collapsible Inline New Address Form */}
            {showNewAddressForm && (
              <form
                onSubmit={handleSaveNewAddress}
                className="p-4 bg-app-subtle/60 border-t border-app-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-content-primary">
                    {isBn ? 'নতুন ঠিকানা যোগ করুন' : 'New Bangladesh Delivery Address'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(false)}
                    className="text-xs font-semibold text-content-secondary hover:text-content-primary"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      required
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Home / Office"
                      className="w-full h-10 px-3 rounded-xl bg-white border border-app-border text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white border border-app-border text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Mobile Number (BD)
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white border border-app-border font-mono-num text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Street, House & Area
                  </label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white border border-app-border text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white border border-app-border text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={newZip}
                      onChange={(e) => setNewZip(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white border border-app-border font-mono-num text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[42px] rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
                >
                  {isBn ? 'ঠিকানা সেভ করুন' : 'Save & Use This Address'}
                </button>
              </form>
            )}
          </div>

          {/* 2. Corridor Delivery Speed Selector (Single-Elevation Surface) */}
          <div className="bg-white rounded-2xl border border-app-border overflow-hidden">
            <div className="px-4 py-3 bg-app-subtle/70 border-b border-app-border flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-tight text-content-primary">
                {isBn ? 'শিপিং ও কুরিয়ার গতি' : 'Corridor & Delivery Speed'}
              </h2>
              <span className="text-xs text-content-secondary">
                eCourier Doorstep
              </span>
            </div>

            <div className="divide-y divide-app-border">
              <button
                type="button"
                onClick={() => setShippingMethod('standard')}
                className={`w-full p-4 flex items-start justify-between gap-3 text-left transition-colors ${
                  shippingMethod === 'standard'
                    ? 'bg-brand-subtle/45'
                    : 'bg-white hover:bg-app-subtle/50'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      shippingMethod === 'standard'
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {shippingMethod === 'standard' && (
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm leading-5 font-bold tracking-tight text-content-primary">
                      {isBn
                        ? 'স্ট্যান্ডার্ড এয়ার ও ডোরস্টেপ (৭–১৪ দিন)'
                        : 'Standard Air & Doorstep (7–14 days)'}
                    </span>
                    <span className="block text-xs leading-4 text-content-secondary mt-0.5">
                      {isBn
                        ? 'প্রি-ক্লিয়ারড কাস্টমস · ই-কুরিয়ার হোম ডেলিভারি'
                        : 'Pre-cleared HS-Code customs · eCourier doorstep'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-status-success shrink-0">
                  {isBn ? 'ফ্রি' : 'Complimentary'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShippingMethod('express')}
                className={`w-full p-4 flex items-start justify-between gap-3 text-left transition-colors ${
                  shippingMethod === 'express'
                    ? 'bg-brand-subtle/45'
                    : 'bg-white hover:bg-app-subtle/50'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      shippingMethod === 'express'
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {shippingMethod === 'express' && (
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm leading-5 font-bold tracking-tight text-content-primary">
                      {isBn
                        ? 'এক্সপ্রেস এয়ার প্রায়োরিটি (৩–৭ দিন)'
                        : 'Express Air Priority (3–7 days)'}
                    </span>
                    <span className="block text-xs leading-4 text-content-secondary mt-0.5">
                      {isBn
                        ? 'সিঙ্গাপুর/হংকং ডিরেক্ট এয়ার চার্টার ফ্লাইট'
                        : 'Direct Singapore / Hong Kong priority air charter'}
                    </span>
                  </div>
                </div>
                <span className="font-mono-num text-xs font-bold text-content-primary shrink-0">
                  +{formatPrice(800)}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Primary Action Footer */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between px-1 text-xs text-content-secondary">
            <span>
              {isBn ? 'ডেলিভারি সহ সর্বমোট:' : 'Estimated Payable Total:'}
            </span>
            <span className="font-mono-num font-bold text-content-primary">
              {formatPrice(cartTotals.totalBdt)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('checkout_payment')}
            className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-hover active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-between px-4 transition-all"
          >
            <span>
              {isBn ? 'পেমেন্ট মাধ্যমে যান' : 'Continue to Payment Method'}
            </span>
            <span className="flex items-center gap-1.5 font-mono-num font-bold">
              <span>Step 2/3</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ===================== STEP 2: PAYMENT METHOD & ESCROW VERIFICATION =====================
  if (currentScreen === 'checkout_payment') {
    const paymentOptions: {
      id: PaymentMethodId;
      title: string;
      subtitle: string;
      metaTag: string;
      icon: React.FC<{ className?: string }>;
    }[] = [
      {
        id: 'cod',
        title: isBn ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery (COD)',
        subtitle: isBn
          ? 'পণ্য হাতে পেয়ে কুরিয়ারকে নগদ অর্থ পরিশোধ করুন'
          : 'Pay in cash when your customs-cleared parcel arrives at your door',
        metaTag: 'Most Popular',
        icon: Banknote,
      },
      {
        id: 'bkash',
        title: isBn ? 'বিকাশ / নগদ ওয়ালেট' : 'bKash / Nagad Mobile Wallet',
        subtitle: isBn
          ? 'তাৎক্ষণিক মোবাইল ব্যাংকিং এসক্রো পেমেন্ট'
          : 'Instant Bangladesh MFS wallet with 100% escrow protection',
        metaTag: 'Instant MFS',
        icon: Smartphone,
      },
      {
        id: 'card',
        title: isBn ? 'ভিসা / মাস্টারকার্ড' : 'Credit / Debit Card',
        subtitle: isBn
          ? 'ভিসা, মাস্টারকার্ড ও অ্যামেক্স (3D সিকিউর)'
          : 'Visa, Mastercard & AMEX via 3D-Secure SSLCommerz',
        metaTag: '3D Secure',
        icon: CreditCard,
      },
      {
        id: 'paypal',
        title: isBn ? 'পেপ্যাল গ্লোবাল' : 'PayPal Global Express',
        subtitle: isBn
          ? 'আন্তর্জাতিক ক্রেতা সুরক্ষা সমর্থিত'
          : 'International USD checkout with global buyer protection',
        metaTag: 'USD / Global',
        icon: Wallet,
      },
    ];

    return (
      <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between bg-app-bg">
        <div className="space-y-4">
          {renderStepHeader(2)}

          {/* 1. Single-Elevation Payment Method Ledger */}
          <div className="bg-white rounded-2xl border border-app-border overflow-hidden">
            <div className="px-4 py-3 bg-app-subtle/70 border-b border-app-border flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-tight text-content-primary">
                {isBn ? 'পেমেন্ট মাধ্যম নির্বাচন করুন' : 'Select Payment Method'}
              </h2>
              <span className="text-xs font-semibold text-brand-primary">
                Escrow Protected
              </span>
            </div>

            <div className="divide-y divide-app-border">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`w-full p-4 flex items-start justify-between gap-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-brand-subtle/45'
                        : 'bg-white hover:bg-app-subtle/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-brand-primary text-white'
                            : 'bg-app-subtle text-content-primary border border-app-border'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-sm leading-5 font-bold tracking-tight text-content-primary truncate">
                            {opt.title}
                          </span>
                        </div>
                        <p className="text-xs leading-4 text-content-secondary mt-0.5">
                          {opt.subtitle}
                        </p>
                        <p className="text-[11px] font-semibold text-brand-primary mt-1">
                          {opt.metaTag} · Zero hidden gateway fee
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-colors ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Contextual Payment Verification & Credentials Surface */}
          {paymentMethod === 'cod' && (
            <div className="bg-brand-subtle border border-brand-border rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-content-primary flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>
                    {isBn
                      ? 'ডোরস্টেপ ক্যাশ অন ডেলিভারি নিশ্চিত'
                      : 'Doorstep Cash on Delivery Terms'}
                  </span>
                </span>
                <span className="font-mono-num font-bold text-brand-primary">
                  {formatPrice(cartTotals.totalBdt)}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-content-secondary">
                {isBn
                  ? 'আপনার পার্সেল ঢাকা কাস্টমস ক্লিয়ার হয়ে ই-কুরিয়ারের মাধ্যমে বাসায় পৌঁছালে নগদ অর্থ পরিশোধ করবেন।'
                  : 'Customs duty & VAT are pre-cleared by DeshiMart. Pay the exact landed total in cash to the eCourier agent upon doorstep inspection.'}
              </p>
            </div>
          )}

          {paymentMethod === 'bkash' && (
            <div className="bg-white rounded-2xl border border-app-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-content-primary">
                  {isBn
                    ? 'বিকাশ / নগদ অ্যাকাউন্ট নম্বর'
                    : 'bKash / Nagad Wallet Number'}
                </label>
                <span className="font-mono-num text-xs font-bold text-brand-primary">
                  {formatPrice(cartTotals.totalBdt)}
                </span>
              </div>
              <input
                type="tel"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-app-subtle border border-app-border font-mono-num text-xs font-semibold text-content-primary focus:outline-none focus:border-brand-primary"
              />
              <p className="text-xs text-content-secondary">
                Held in DeshiMart Escrow until Dhaka customs clearance & courier dispatch.
              </p>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="bg-white rounded-2xl border border-app-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-content-primary">
                  3D-Secure Card Details
                </span>
                <span className="font-mono-num text-xs font-bold text-brand-primary">
                  {formatPrice(cartTotals.totalBdt)}
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-app-subtle border border-app-border font-mono-num text-xs font-semibold text-content-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-app-subtle border border-app-border font-mono-num text-xs font-semibold text-content-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-app-subtle border border-app-border font-mono-num text-xs font-semibold text-content-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="bg-brand-subtle border border-brand-border rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-content-primary">
                  PayPal International Express
                </span>
                <span className="font-mono-num font-bold text-brand-primary">
                  {formatPrice(cartTotals.totalBdt)}
                </span>
              </div>
              <p className="text-xs text-content-secondary">
                Protected by PayPal Global Buyer Protection and DeshiMart Landed Price Guarantee.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Primary Action Footer */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs text-content-secondary">
            <Lock className="w-3.5 h-3.5 text-status-success shrink-0" />
            <span>256-bit SSL encrypted · 100% Escrow Buyer Protection</span>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('checkout_review')}
            className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-hover active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-between px-4 transition-all"
          >
            <span>
              {isBn ? 'অর্ডার রিভিউ করুন' : 'Continue to Final Review'}
            </span>
            <span className="flex items-center gap-1.5 font-mono-num font-bold">
              <span>Step 3/3</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ===================== STEP 3: FINAL REVIEW & LANDED PRICE LOCK =====================
  if (currentScreen === 'checkout_review') {
    const paymentLabels: Record<PaymentMethodId, string> = {
      cod: 'Cash on Delivery (COD · Pay at Door)',
      bkash: `bKash / Nagad Wallet (${bkashNumber})`,
      card: `3D-Secure Card (•••• ${cardNumber.slice(-4)})`,
      paypal: 'PayPal Global Express',
    };

    return (
      <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between bg-app-bg">
        <div className="space-y-4">
          {renderStepHeader(3)}

          {/* 1. Unified Fulfillment & Payment Summary Ledger (Single-Elevation Surface) */}
          <div className="bg-white rounded-2xl border border-app-border divide-y divide-app-border overflow-hidden">
            {/* Delivery Destination Row */}
            <div className="p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-content-secondary block">
                    {isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Destination'}
                  </span>
                  <p className="text-sm leading-5 font-bold tracking-tight text-content-primary truncate mt-0.5">
                    {activeAddress?.fullName} · {activeAddress?.label}
                  </p>
                  <p className="text-xs leading-4 text-content-secondary truncate mt-0.5">
                    {activeAddress?.address}, {activeAddress?.city}{' '}
                    <span className="font-mono-num">
                      {activeAddress?.postalCode}
                    </span>
                  </p>
                  <p className="font-mono-num text-xs leading-4 text-content-secondary mt-0.5">
                    {activeAddress?.phone}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('checkout_shipping')}
                className="text-xs font-semibold text-brand-primary hover:underline shrink-0"
              >
                {isBn ? 'পরিবর্তন' : 'Edit'}
              </button>
            </div>

            {/* Shipping Speed & Payment Method Row */}
            <div className="p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-content-secondary block">
                    {isBn
                      ? 'পেমেন্ট ও কুরিয়ার পদ্ধতি'
                      : 'Payment & Corridor Speed'}
                  </span>
                  <p className="text-sm leading-5 font-bold tracking-tight text-content-primary truncate mt-0.5">
                    {paymentLabels[paymentMethod]}
                  </p>
                  <p className="text-xs leading-4 text-content-secondary truncate mt-0.5">
                    {shippingMethod === 'express'
                      ? 'Express Air Priority (3–7 days) · eCourier'
                      : 'Standard Air & Doorstep (7–14 days) · eCourier'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('checkout_payment')}
                className="text-xs font-semibold text-brand-primary hover:underline shrink-0"
              >
                {isBn ? 'পরিবর্তন' : 'Edit'}
              </button>
            </div>
          </div>

          {/* 2. Itemized Customs Manifest & Landed Tax Invoice */}
          <div className="bg-white rounded-2xl border border-app-border overflow-hidden">
            <div className="px-4 py-3 bg-app-subtle/70 border-b border-app-border flex items-center justify-between">
              <h3 className="text-xs font-bold text-content-primary">
                {isBn
                  ? `কাস্টমস ম্যানিফেস্ট (${cartCount}টি পণ্য)`
                  : `Customs Manifest (${cartCount} ${
                      cartCount === 1 ? 'item' : 'items'
                    })`}
              </h3>
              <span className="font-mono-num text-xs text-brand-primary font-semibold">
                Duty & 15% VAT Locked
              </span>
            </div>

            {/* Item Rows */}
            <div className="divide-y divide-app-border max-h-56 overflow-y-auto">
              {cart.map((item) => {
                const prod = products.find((p) => p.id === item.productId);
                if (!prod) return null;
                const rt =
                  prod.routes.find((r) => r.id === item.selectedRouteId) ||
                  prod.routes[0];
                const unitBdt = rt ? rt.totalLandedBdt : prod.totalLandedBdt;
                return (
                  <div
                    key={`${item.productId}-${item.selectedColor}`}
                    className="px-4 py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-xl object-contain bg-app-subtle p-1 border border-app-border shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-brand-primary truncate">
                          {prod.originLabel} · {rt?.name || 'Direct Air'}
                        </p>
                        <p className="text-xs font-bold text-content-primary truncate mt-0.5">
                          {isBn ? prod.nameBn : prod.name}
                        </p>
                        <p className="text-[11px] text-content-secondary truncate">
                          {item.selectedColor} · Qty{' '}
                          <span className="font-mono-num font-semibold">
                            {item.quantity}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-num text-xs font-bold text-content-primary shrink-0">
                      {formatPrice(unitBdt * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Financial Breakdown Ledger */}
            <div className="p-4 bg-app-subtle/35 border-t border-app-border space-y-2 text-xs">
              <div className="flex justify-between items-baseline text-content-secondary">
                <span>
                  {isBn
                    ? `ফ্যাক্টরি মূল্য (${cartCount}টি পণ্য)`
                    : `Factory Base Subtotal (${cartCount} items)`}
                </span>
                <span className="font-mono-num font-medium text-content-primary">
                  {formatPrice(cartTotals.baseItemsBdt)}
                </span>
              </div>

              <div className="flex justify-between items-baseline text-content-secondary">
                <span>
                  {isBn
                    ? 'আন্তর্জাতিক এয়ার ফ্রেইট'
                    : 'International Air Freight'}
                </span>
                <span className="font-mono-num font-medium text-content-primary">
                  {formatPrice(cartTotals.freightBdt)}
                </span>
              </div>

              <div className="flex justify-between items-baseline text-content-secondary">
                <span>
                  {isBn
                    ? 'প্রি-পেইড কাস্টমস ডিউটি (১০%) ও ভ্যাট (১৫%)'
                    : 'Pre-Paid Customs Duty (10%) & VAT (15%)'}
                </span>
                <span className="font-mono-num font-medium text-content-primary">
                  {formatPrice(cartTotals.dutyAndVatBdt)}
                </span>
              </div>

              {cartTotals.consolidationSavingsBdt > 0 && (
                <div className="flex justify-between items-baseline text-status-success font-medium">
                  <span>
                    {isBn
                      ? 'হাব পার্সেল কনসলিডেশন সাশ্রয় (২৫%)'
                      : 'Hub Parcel Consolidation Savings (25%)'}
                  </span>
                  <span className="font-mono-num font-semibold">
                    -{formatPrice(cartTotals.consolidationSavingsBdt)}
                  </span>
                </div>
              )}

              {cartTotals.promoDiscountBdt > 0 && (
                <div className="flex justify-between items-baseline text-status-success font-medium">
                  <span>
                    {isBn
                      ? `প্রোমো ভাউচার ছাড় (${promoCode || 'PROMO'})`
                      : `Promo Voucher Discount (${promoCode || 'PROMO'})`}
                  </span>
                  <span className="font-mono-num font-semibold">
                    -{formatPrice(cartTotals.promoDiscountBdt)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-baseline text-content-secondary">
                <span>
                  {shippingMethod === 'express'
                    ? isBn
                      ? 'এক্সপ্রেস এয়ার প্রায়োরিটি চার্জ'
                      : 'Express Air Priority Charter'
                    : isBn
                    ? 'স্ট্যান্ডার্ড ডোরস্টেপ কুরিয়ার'
                    : 'Standard Doorstep Delivery (eCourier)'}
                </span>
                <span
                  className={`font-mono-num font-semibold ${
                    cartTotals.shippingBdt === 0
                      ? 'font-sans text-status-success'
                      : 'text-content-primary'
                  }`}
                >
                  {cartTotals.shippingBdt === 0
                    ? isBn
                      ? 'ফ্রি'
                      : 'Complimentary'
                    : formatPrice(cartTotals.shippingBdt)}
                </span>
              </div>

              <div className="pt-3 border-t border-app-border flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-content-primary block">
                    {isBn ? 'সর্বমোট পরিশোধযোগ্য' : 'Total Landed Payable'}
                  </span>
                  <span className="text-[11px] text-content-secondary">
                    {isBn
                      ? '১০০% শুল্ক পরিশোধিত · কোনো লুকানো চার্জ নেই'
                      : '100% customs cleared · Zero extra fees on delivery'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono-num text-xl font-bold text-brand-primary block">
                    {formatPrice(cartTotals.totalBdt)}
                  </span>
                  {totalSavingsBdt > 0 && (
                    <span className="font-mono-num text-[11px] font-semibold text-status-success">
                      {isBn ? 'মোট সাশ্রয়' : 'Saved'}{' '}
                      {formatPrice(totalSavingsBdt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Primary Confirm Order CTA */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={() => {
              const created = placeOrder();
              navigateTo('order_success', { orderId: created.id });
            }}
            className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-hover active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-between px-4 transition-all"
          >
            <span>
              {isBn ? 'অর্ডার নিশ্চিত করুন' : 'Confirm & Lock Landed Order'}
            </span>
            <span className="flex items-center gap-1.5 font-mono-num font-bold">
              <span>{formatPrice(cartTotals.totalBdt)}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          <p className="text-center text-xs text-content-secondary flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span>
              NBR HS-Code pre-cleared · Guaranteed zero extra tax at doorstep
            </span>
          </p>
        </div>
      </div>
    );
  }

  // ===================== STEP 4: ORDER CONFIRMED RECEIPT =====================
  return (
    <div className="p-5 flex-1 flex flex-col justify-between bg-app-bg">
      <div className="my-auto space-y-5 text-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          className="w-16 h-16 rounded-2xl bg-brand-subtle border border-brand-border text-brand-primary flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="w-9 h-9 stroke-[2]" />
        </motion.div>

        <div>
          <span className="text-xs font-semibold text-brand-primary">
            {isBn
              ? 'কাস্টমস প্রি-ক্লিয়ারেন্স সম্পন্ন'
              : 'Customs Pre-Clearance Initiated'}
          </span>
          <h1 className="text-xl font-bold tracking-tight text-content-primary mt-1">
            {isBn ? 'আপনার অর্ডার নিশ্চিত হয়েছে' : 'Order Confirmed & Locked'}
          </h1>
          <p className="text-xs leading-5 text-content-secondary mt-1 max-w-[280px] mx-auto">
            Order{' '}
            <strong className="font-mono-num font-bold text-content-primary">
              #{selectedOrder?.id || 'DM123456'}
            </strong>{' '}
            has been transmitted to the global dispatch hub with 100% pre-paid BD duty & VAT.
          </p>
        </div>

        {/* Structured Order & Courier Receipt Ledger */}
        <div className="bg-white rounded-2xl border border-app-border divide-y divide-app-border text-left overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-content-secondary block">
                {isBn ? 'আনুমানিক ডেলিভারি সময়' : 'Estimated Doorstep Arrival'}
              </span>
              <span className="font-mono-num text-base font-bold text-brand-primary mt-0.5 block">
                {selectedOrder?.estimatedDelivery || '7 – 14 days'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shrink-0">
              <Plane className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 space-y-2 text-xs">
            <div className="flex justify-between text-content-secondary">
              <span>Courier Partner</span>
              <span className="font-semibold text-content-primary">
                {selectedOrder?.courierName || 'eCourier Bangladesh'}
              </span>
            </div>
            <div className="flex justify-between text-content-secondary">
              <span>Live Tracking ID</span>
              <span className="font-mono-num font-bold text-content-primary">
                {selectedOrder?.trackingCode || 'EC8492041BD'}
              </span>
            </div>
            <div className="flex justify-between text-content-secondary">
              <span>Destination City</span>
              <span className="font-semibold text-content-primary">
                {selectedOrder?.shippingAddress.city || 'Dhaka'}
              </span>
            </div>
            <div className="flex justify-between text-content-secondary pt-2 border-t border-app-border">
              <span className="font-bold text-content-primary">
                Total Landed Paid / Locked
              </span>
              <span className="font-mono-num font-bold text-brand-primary">
                {formatPrice(selectedOrder?.totalBdt || cartTotals.totalBdt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 pt-4">
        <button
          type="button"
          onClick={() =>
            navigateTo('order_tracking', {
              orderId: selectedOrder?.id || 'DM123456',
            })
          }
          className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Truck className="w-4 h-4" />
          <span>
            {isBn ? 'লাইভ পার্সেল রাডার দেখুন' : 'Open Live Parcel Radar'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="w-full h-11 rounded-xl bg-white border border-app-border text-xs font-semibold text-content-primary hover:bg-app-subtle transition-colors"
        >
          {isBn ? 'শপিং চালিয়ে যান' : 'Continue Global Shopping'}
        </button>
      </div>
    </div>
  );
};
