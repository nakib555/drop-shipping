import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Package,
  Plus,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { PaymentMethodId } from '../../types/deshimart';

export const CheckoutFlowScreen: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    shippingMethod,
    setShippingMethod,
    paymentMethod,
    setPaymentMethod,
    cart,
    products,
    cartTotals,
    formatPrice,
    placeOrder,
    selectedOrder,
  } = useDeshiMart();

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newName, setNewName] = useState('John Doe');
  const [newPhone, setNewPhone] = useState('+880 1712 345678');
  const [newStreet, setNewStreet] = useState('Jatrabari, Dhaka, Bangladesh');
  const [newCity, setNewCity] = useState('Dhaka');
  const [newZip, setNewZip] = useState('1215');

  const [bkashNumber, setBkashNumber] = useState('01712-345678');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8910');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  const activeAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({
      label: 'New Address',
      fullName: newName,
      phone: newPhone,
      address: newStreet,
      city: newCity,
      postalCode: newZip,
    });
    setShowNewAddressForm(false);
  };

  // STEP 1: Checkout - Shipping Address & Method
  if (currentScreen === 'checkout_shipping') {
    return (
      <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between bg-app-bg">
        <div className="space-y-4">
          {/* Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] leading-4 font-semibold">
            <div className="h-8 flex items-center justify-center rounded-lg bg-content-primary text-white">
              1. Shipping
            </div>
            <div className="h-8 flex items-center justify-center rounded-lg bg-white text-content-muted border border-app-border">
              2. Payment
            </div>
            <div className="h-8 flex items-center justify-center rounded-lg bg-white text-content-muted border border-app-border">
              3. Review
            </div>
          </div>

          {/* Saved Shipping Addresses */}
          <div className="bg-white rounded-xl border border-app-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm leading-6 font-semibold text-content-primary">
                Delivery Address
              </h2>
              <button
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="text-xs leading-4 font-semibold text-content-primary hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            </div>

            <div className="space-y-2">
              {addresses.map((addr) => {
                const isSelected = addr.id === selectedAddressId;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-colors ${
                      isSelected
                        ? 'bg-app-subtle border-content-primary'
                        : 'bg-white border-app-border hover:border-app-borderStrong'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-content-secondary shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm leading-6 font-medium text-content-primary">
                          {addr.fullName}
                        </span>
                        <span className="text-[11px] leading-4 font-medium text-content-secondary">
                          {addr.label}
                        </span>
                      </div>
                      <p className="text-xs leading-4 text-content-secondary mt-1">
                        {addr.address}
                      </p>
                      <p className="tabular-nums text-xs leading-4 text-content-secondary mt-1">
                        {addr.phone}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Inline Add New Address Form */}
            {showNewAddressForm && (
              <form
                onSubmit={handleSaveNewAddress}
                className="pt-4 border-t border-app-border space-y-4"
              >
                <div>
                  <label className="block text-[11px] leading-4 font-medium text-content-secondary mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full h-10 px-4 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary focus:outline-none focus:border-app-borderStrong"
                  />
                </div>
                <div>
                  <label className="block text-[11px] leading-4 font-medium text-content-secondary mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full h-10 px-4 rounded-lg bg-app-subtle border border-app-border text-xs tabular-nums text-content-primary focus:outline-none focus:border-app-borderStrong"
                  />
                </div>
                <div>
                  <label className="block text-[11px] leading-4 font-medium text-content-secondary mb-1">
                    Address (Area, Road, House)
                  </label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full h-10 px-4 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary focus:outline-none focus:border-app-borderStrong"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] leading-4 font-medium text-content-secondary mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full h-10 px-4 rounded-lg bg-app-subtle border border-app-border text-xs text-content-primary focus:outline-none focus:border-app-borderStrong"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] leading-4 font-medium text-content-secondary mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={newZip}
                      onChange={(e) => setNewZip(e.target.value)}
                      className="w-full h-10 px-4 rounded-lg bg-app-subtle border border-app-border text-xs tabular-nums text-content-primary focus:outline-none focus:border-app-borderStrong"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-10 rounded-lg bg-content-primary text-white text-xs font-semibold"
                >
                  Save Address
                </button>
              </form>
            )}
          </div>

          {/* Shipping Method Selector */}
          <div className="bg-white rounded-xl border border-app-border p-4 space-y-2">
            <h2 className="text-sm leading-6 font-semibold text-content-primary">
              Delivery Speed
            </h2>

            <button
              type="button"
              onClick={() => setShippingMethod('standard')}
              className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-colors ${
                shippingMethod === 'standard'
                  ? 'bg-app-subtle border-content-primary'
                  : 'bg-white border-app-border'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    shippingMethod === 'standard'
                      ? 'border-content-primary bg-content-primary'
                      : 'border-slate-300'
                  }`}
                >
                  {shippingMethod === 'standard' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className="block text-xs leading-4 font-semibold text-content-primary">
                    Standard Shipping (7–14 days)
                  </span>
                  <span className="block text-[11px] leading-4 text-content-secondary mt-1">
                    Pre-cleared customs + eCourier doorstep
                  </span>
                </div>
              </div>
              <span className="text-xs leading-4 font-semibold text-content-primary">Free</span>
            </button>

            <button
              type="button"
              onClick={() => setShippingMethod('express')}
              className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-colors ${
                shippingMethod === 'express'
                  ? 'bg-app-subtle border-content-primary'
                  : 'bg-white border-app-border'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    shippingMethod === 'express'
                      ? 'border-content-primary bg-content-primary'
                      : 'border-slate-300'
                  }`}
                >
                  {shippingMethod === 'express' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className="block text-xs leading-4 font-semibold text-content-primary">
                    Express Air Priority (3–7 days)
                  </span>
                  <span className="block text-[11px] leading-4 text-content-secondary mt-1">
                    Direct Singapore/Hong Kong Air Charter
                  </span>
                </div>
              </div>
              <span className="tabular-nums text-xs leading-4 font-semibold text-content-primary">
                +{formatPrice(800)}
              </span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('checkout_payment')}
          className="w-full h-12 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    );
  }

  // STEP 2: Payment Method (COD, bKash/Nagad, Card, PayPal)
  if (currentScreen === 'checkout_payment') {
    const paymentOptions: {
      id: PaymentMethodId;
      title: string;
      subtitle: string;
      badge: string;
      accentBg: string;
      accentText: string;
      icon: React.FC<{ className?: string }>;
    }[] = [
      {
        id: 'cod',
        title: 'Cash on Delivery (COD)',
        subtitle: 'Pay in cash when your parcel arrives at your door',
        badge: 'Most Popular',
        accentBg: 'bg-app-subtle border-app-border',
        accentText: 'text-content-primary',
        icon: Banknote,
      },
      {
        id: 'bkash',
        title: 'bKash / Nagad',
        subtitle: 'Instant Bangladesh mobile wallet payment',
        badge: 'Instant MFS',
        accentBg: 'bg-pink-50 border-pink-200',
        accentText: 'text-[#E2136E]',
        icon: Smartphone,
      },
      {
        id: 'card',
        title: 'Credit / Debit Card',
        subtitle: 'Visa, MasterCard, AMEX (3D Secure)',
        badge: 'SSLCommerz',
        accentBg: 'bg-blue-50 border-blue-200',
        accentText: 'text-status-transit',
        icon: CreditCard,
      },
      {
        id: 'paypal',
        title: 'PayPal Global',
        subtitle: 'International buyer protection supported',
        badge: 'USD/Global',
        accentBg: 'bg-amber-50 border-amber-200',
        accentText: 'text-status-warning',
        icon: Wallet,
      },
    ];

    return (
      <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between bg-app-bg">
        <div className="space-y-4">
          {/* Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] leading-4 font-semibold">
            <div className="h-8 flex items-center justify-center rounded-lg bg-app-subtle text-content-secondary">
              1. Shipping ✓
            </div>
            <div className="h-8 flex items-center justify-center rounded-lg bg-content-primary text-white">
              2. Payment
            </div>
            <div className="h-8 flex items-center justify-center rounded-lg bg-white text-content-muted border border-app-border">
              3. Review
            </div>
          </div>

          <div className="space-y-2">
            {paymentOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = paymentMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all bg-white ${
                    isSelected
                      ? 'border-2 border-content-primary'
                      : 'border-app-border hover:border-app-borderStrong'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                        isSelected
                          ? 'bg-content-primary text-white border-content-primary'
                          : `${opt.accentBg} ${opt.accentText}`
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-sm leading-6 font-medium text-content-primary">
                        {opt.title}
                      </span>
                      <span className="block text-xs leading-4 text-content-secondary">
                        {opt.subtitle}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[11px] leading-4 font-semibold shrink-0 ${opt.accentText}`}>
                    {opt.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contextual Payment Details Form */}
          {paymentMethod === 'bkash' && (
            <div className="bg-white rounded-xl border border-app-border p-4 space-y-2">
              <label className="block text-xs leading-4 font-semibold text-content-primary">
                bKash / Nagad Account Number
              </label>
              <input
                type="tel"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                className="w-full h-10 px-4 rounded-lg bg-app-subtle border border-app-border tabular-nums text-xs text-content-primary focus:outline-none focus:border-app-borderStrong"
              />
              <p className="text-xs leading-4 text-content-secondary">
                Amount to authorize:{' '}
                <strong className="tabular-nums text-content-primary">
                  {formatPrice(cartTotals.totalBdt)}
                </strong>
              </p>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="bg-white rounded-xl border border-app-border p-4 space-y-4">
              <div>
                <label className="block text-[11px] leading-4 font-medium text-content-secondary mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full h-10 px-4 rounded-lg bg-app-subtle border border-app-border tabular-nums text-xs text-content-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] leading-4 font-medium text-content-secondary mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full h-10 px-4 rounded-lg bg-app-subtle border border-app-border tabular-nums text-xs text-content-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] leading-4 font-medium text-content-secondary mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full h-10 px-4 rounded-lg bg-app-subtle border border-app-border tabular-nums text-xs text-content-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs leading-4 text-content-secondary">
            <Lock className="w-4 h-4 text-status-success" />
            <span>Your payment is 256-bit SSL encrypted & protected</span>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('checkout_review')}
            className="w-full h-12 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm transition-colors"
          >
            Continue to Review
          </button>
        </div>
      </div>
    );
  }

  // STEP 3: Review & Place Order
  if (currentScreen === 'checkout_review') {
    const paymentLabels: Record<PaymentMethodId, string> = {
      cod: 'Cash on Delivery (COD)',
      bkash: `bKash / Nagad (${bkashNumber})`,
      card: `Visa / MasterCard (${cardNumber.slice(-4)})`,
      paypal: 'PayPal Express',
    };

    return (
      <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between bg-app-bg">
        <div className="space-y-4">
          {/* Shipping Address Card */}
          <div className="bg-white rounded-xl border border-app-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs leading-4 font-semibold text-content-primary">
                Delivery Address
              </span>
              <button
                type="button"
                onClick={() => navigateTo('checkout_shipping')}
                className="text-xs leading-4 font-semibold text-content-primary hover:underline"
              >
                Change
              </button>
            </div>
            <p className="text-sm leading-6 font-medium text-content-primary">
              {activeAddress?.fullName}
            </p>
            <p className="text-xs leading-4 text-content-secondary">{activeAddress?.address}</p>
            <p className="tabular-nums text-xs leading-4 text-content-secondary mt-1">
              {activeAddress?.phone}
            </p>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-xl border border-app-border p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs leading-4 font-semibold text-content-primary">
                Payment Method
              </span>
              <button
                type="button"
                onClick={() => navigateTo('checkout_payment')}
                className="text-xs leading-4 font-semibold text-content-primary hover:underline"
              >
                Change
              </button>
            </div>
            <p className="text-sm leading-6 font-medium text-content-primary">
              {paymentLabels[paymentMethod]}
            </p>
          </div>

          {/* Itemized Order Summary */}
          <div className="bg-white rounded-xl border border-app-border p-4 space-y-4">
            <h3 className="text-sm leading-6 font-semibold text-content-primary">
              Items ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {cart.map((item) => {
                const prod = products.find((p) => p.id === item.productId);
                if (!prod) return null;
                const rt =
                  prod.routes.find((r) => r.id === item.selectedRouteId) ||
                  prod.routes[0];
                const unitBdt = rt ? rt.totalLandedBdt : prod.totalLandedBdt;
                return (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-2 text-xs leading-4"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-app-border shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-content-primary truncate">
                          {prod.name} × {item.quantity}
                        </p>
                        <p className="text-[11px] leading-4 text-content-secondary truncate">
                          {item.selectedColor} · {rt?.name || 'Global Direct'}
                        </p>
                      </div>
                    </div>
                    <span className="tabular-nums font-semibold text-content-primary shrink-0">
                      {formatPrice(unitBdt * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-app-border space-y-2 text-xs leading-4">
              <div className="flex justify-between text-content-secondary">
                <span>Factory Price + Air Freight + Duty/VAT</span>
                <span className="tabular-nums font-medium text-content-primary">
                  {formatPrice(
                    cartTotals.baseItemsBdt +
                      cartTotals.freightBdt +
                      cartTotals.dutyAndVatBdt
                  )}
                </span>
              </div>
              {cartTotals.consolidationSavingsBdt > 0 && (
                <div className="flex justify-between text-promo-accent font-medium">
                  <span>Global Hub Consolidation Savings</span>
                  <span className="tabular-nums font-semibold">
                    -{formatPrice(cartTotals.consolidationSavingsBdt)}
                  </span>
                </div>
              )}
              {cartTotals.promoDiscountBdt > 0 && (
                <div className="flex justify-between text-promo-accent font-medium">
                  <span>Promo Voucher Discount</span>
                  <span className="tabular-nums font-semibold">
                    -{formatPrice(cartTotals.promoDiscountBdt)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-content-secondary">
                <span>
                  {shippingMethod === 'express'
                    ? 'Express Air Priority'
                    : 'Standard Doorstep Shipping'}
                </span>
                <span className="tabular-nums font-medium text-content-primary">
                  {cartTotals.shippingBdt === 0
                    ? 'Free'
                    : formatPrice(cartTotals.shippingBdt)}
                </span>
              </div>
              <div className="pt-4 border-t border-app-border flex justify-between items-baseline">
                <span className="text-sm leading-6 font-semibold text-content-primary">
                  Total Payable
                </span>
                <span className="tabular-nums text-xl leading-6 font-bold text-content-primary">
                  {formatPrice(cartTotals.totalBdt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              const created = placeOrder();
              navigateTo('order_success', { orderId: created.id });
            }}
            className="w-full h-12 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm transition-colors"
          >
            Place Order · {formatPrice(cartTotals.totalBdt)}
          </button>
          <p className="text-center text-[11px] leading-4 text-content-secondary flex items-center justify-center gap-1">
            <Lock className="w-4 h-4 text-status-success" />
            <span>Customs pre-cleared · Zero extra charges on delivery</span>
          </p>
        </div>
      </div>
    );
  }

  // STEP 4: Order Placed Successfully
  return (
    <div className="p-6 flex-1 flex flex-col items-center justify-center text-center bg-white">
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        className="w-16 h-16 rounded-full bg-brand-subtle text-brand-primary flex items-center justify-center mb-4 border border-brand-border"
      >
        <CheckCircle2 className="w-8 h-8" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="text-2xl leading-8 font-bold text-content-primary"
      >
        Order Confirmed
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.2 }}
        className="text-xs leading-4 text-content-secondary mt-2"
      >
        Your order{' '}
        <strong className="tabular-nums text-content-primary">
          #{selectedOrder?.id || 'DM123456'}
        </strong>{' '}
        has been confirmed and customs pre-cleared.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.22, duration: 0.22 }}
        className="my-6 w-full bg-app-subtle rounded-xl p-4 border border-app-border space-y-2"
      >
        <span className="block text-xs leading-4 text-content-secondary">Estimated Delivery</span>
        <span className="block tabular-nums text-lg leading-6 font-bold text-content-primary">
          {selectedOrder?.estimatedDelivery || '7 – 14 days'}
        </span>
        <div className="w-12 h-12 rounded-xl bg-white border border-app-border text-status-transit flex items-center justify-center mx-auto my-2">
          <Package className="w-6 h-6" />
        </div>
        <p className="text-xs leading-4 text-content-secondary">
          Courier: <strong className="text-content-primary font-semibold">eCourier Bangladesh</strong>
        </p>
      </motion.div>

      <div className="w-full space-y-2">
        <button
          type="button"
          onClick={() =>
            navigateTo('order_tracking', {
              orderId: selectedOrder?.id || 'DM123456',
            })
          }
          className="w-full h-12 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm transition-colors"
        >
          View Live Order Tracking
        </button>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="w-full h-12 rounded-lg border border-app-border text-xs font-semibold text-content-primary hover:bg-slate-50 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
