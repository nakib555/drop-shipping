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
      <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between bg-[#F8FAFC]">
        <div className="space-y-4">
          {/* Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
            <div className="py-1.5 rounded-lg bg-slate-900 text-white">
              1. Shipping
            </div>
            <div className="py-1.5 rounded-lg bg-white text-slate-400 border border-slate-200/80">
              2. Payment
            </div>
            <div className="py-1.5 rounded-lg bg-white text-slate-400 border border-slate-200/80">
              3. Review
            </div>
          </div>

          {/* Saved Shipping Addresses */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-900">
                Delivery Address
              </h2>
              <button
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="text-xs font-medium text-[#059669] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
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
                    className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-slate-50 border-slate-900'
                        : 'bg-white border-slate-200/80'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">
                          {addr.fullName}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {addr.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {addr.address}
                      </p>
                      <p className="font-mono-num text-[11px] text-slate-700 mt-0.5">
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
                className="pt-3 border-t border-slate-100 space-y-2.5"
              >
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono-num text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Address (Area, Road, House)
                  </label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={newZip}
                      onChange={(e) => setNewZip(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono-num text-slate-900"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                >
                  Save Address
                </button>
              </form>
            )}
          </div>

          {/* Shipping Method Selector */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
            <h2 className="text-xs font-semibold text-slate-900">
              Delivery Speed
            </h2>

            <button
              type="button"
              onClick={() => setShippingMethod('standard')}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                shippingMethod === 'standard'
                  ? 'bg-slate-50 border-slate-900'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    shippingMethod === 'standard'
                      ? 'border-[#059669] bg-[#059669]'
                      : 'border-slate-300'
                  }`}
                >
                  {shippingMethod === 'standard' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-900">
                    Standard Shipping (7–14 days)
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    Pre-cleared customs + eCourier doorstep
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#059669]">Free</span>
            </button>

            <button
              type="button"
              onClick={() => setShippingMethod('express')}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                shippingMethod === 'express'
                  ? 'bg-slate-50 border-slate-900'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    shippingMethod === 'express'
                      ? 'border-[#059669] bg-[#059669]'
                      : 'border-slate-300'
                  }`}
                >
                  {shippingMethod === 'express' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-900">
                    Express Air Priority (3–7 days)
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    Direct Singapore/Hong Kong Air Charter
                  </span>
                </div>
              </div>
              <span className="font-mono-num text-xs font-semibold text-slate-900">
                +{formatPrice(800)}
              </span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('checkout_payment')}
          className="w-full h-11 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs transition-colors"
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
      icon: React.FC<{ className?: string }>;
    }[] = [
      {
        id: 'cod',
        title: 'Cash on Delivery (COD)',
        subtitle: 'Pay in cash when your parcel arrives at your door',
        badge: 'Most Popular',
        icon: Banknote,
      },
      {
        id: 'bkash',
        title: 'bKash / Nagad',
        subtitle: 'Instant Bangladesh mobile wallet payment',
        badge: 'Instant',
        icon: Smartphone,
      },
      {
        id: 'card',
        title: 'Credit / Debit Card',
        subtitle: 'Visa, MasterCard, AMEX (3D Secure)',
        badge: 'Card',
        icon: CreditCard,
      },
      {
        id: 'paypal',
        title: 'PayPal Global',
        subtitle: 'International buyer protection supported',
        badge: 'USD/Global',
        icon: Wallet,
      },
    ];

    return (
      <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between bg-[#F8FAFC]">
        <div className="space-y-4">
          {/* Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
            <div className="py-1.5 rounded-lg bg-slate-200/70 text-slate-700">
              1. Shipping ✓
            </div>
            <div className="py-1.5 rounded-lg bg-slate-900 text-white">
              2. Payment
            </div>
            <div className="py-1.5 rounded-lg bg-white text-slate-400 border border-slate-200/80">
              3. Review
            </div>
          </div>

          <div className="space-y-2.5">
            {paymentOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = paymentMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all bg-white ${
                    isSelected
                      ? 'border-2 border-slate-900'
                      : 'border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-slate-900">
                        {opt.title}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {opt.subtitle}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-[#059669] shrink-0">
                    {opt.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contextual Payment Details Form */}
          {paymentMethod === 'bkash' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
              <label className="block text-xs font-semibold text-slate-900">
                bKash / Nagad Account Number
              </label>
              <input
                type="tel"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-mono-num text-xs text-slate-900"
              />
              <p className="text-[11px] text-slate-500">
                Amount to authorize:{' '}
                <strong className="font-mono-num text-slate-900">
                  {formatPrice(cartTotals.totalBdt)}
                </strong>
              </p>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-mono-num text-xs text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-mono-num text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-mono-num text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-[#059669]" />
            <span>Your payment is 256-bit SSL encrypted & protected</span>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('checkout_review')}
            className="w-full h-11 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs transition-colors"
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
      <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between bg-[#F8FAFC]">
        <div className="space-y-4">
          {/* Shipping Address Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-900">
                Delivery Address
              </span>
              <button
                type="button"
                onClick={() => navigateTo('checkout_shipping')}
                className="text-xs font-medium text-[#059669]"
              >
                Change
              </button>
            </div>
            <p className="text-xs font-semibold text-slate-900">
              {activeAddress?.fullName}
            </p>
            <p className="text-xs text-slate-500">{activeAddress?.address}</p>
            <p className="font-mono-num text-[11px] text-slate-500 mt-0.5">
              {activeAddress?.phone}
            </p>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-900">
                Payment Method
              </span>
              <button
                type="button"
                onClick={() => navigateTo('checkout_payment')}
                className="text-xs font-medium text-[#059669]"
              >
                Change
              </button>
            </div>
            <p className="text-xs font-medium text-slate-700">
              {paymentLabels[paymentMethod]}
            </p>
          </div>

          {/* Itemized Order Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-900">
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
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-slate-50 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {prod.name} × {item.quantity}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {item.selectedColor} · {rt?.name || 'Global Direct'}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-num font-semibold text-slate-900 shrink-0">
                      {formatPrice(unitBdt * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2.5 border-t border-slate-100 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Factory Price + Air Freight + Duty/VAT</span>
                <span className="font-mono-num font-medium text-slate-900">
                  {formatPrice(
                    cartTotals.baseItemsBdt +
                      cartTotals.freightBdt +
                      cartTotals.dutyAndVatBdt
                  )}
                </span>
              </div>
              {cartTotals.consolidationSavingsBdt > 0 && (
                <div className="flex justify-between text-[#059669] font-medium">
                  <span>Global Hub Consolidation Savings</span>
                  <span className="font-mono-num">
                    -{formatPrice(cartTotals.consolidationSavingsBdt)}
                  </span>
                </div>
              )}
              {cartTotals.promoDiscountBdt > 0 && (
                <div className="flex justify-between text-[#059669] font-medium">
                  <span>Promo Voucher Discount</span>
                  <span className="font-mono-num">
                    -{formatPrice(cartTotals.promoDiscountBdt)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>
                  {shippingMethod === 'express'
                    ? 'Express Air Priority'
                    : 'Standard Doorstep Shipping'}
                </span>
                <span className="font-mono-num font-medium text-[#059669]">
                  {cartTotals.shippingBdt === 0
                    ? 'Free'
                    : formatPrice(cartTotals.shippingBdt)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-semibold text-slate-900">
                <span>Total Payable</span>
                <span className="font-mono-num text-base text-[#059669]">
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
            className="w-full h-11 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs transition-colors"
          >
            Place Order · {formatPrice(cartTotals.totalBdt)}
          </button>
          <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-[#059669]" />
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
        className="w-18 h-18 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center mb-4 border border-emerald-200/60"
      >
        <CheckCircle2 className="w-10 h-10" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="text-xl font-semibold text-slate-900"
      >
        Order Confirmed
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.2 }}
        className="text-xs text-slate-500 mt-1"
      >
        Your order{' '}
        <strong className="font-mono-num text-slate-900">
          #{selectedOrder?.id || 'DM123456'}
        </strong>{' '}
        has been confirmed and customs pre-cleared.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.22, duration: 0.22 }}
        className="my-6 w-full bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2"
      >
        <span className="block text-xs text-slate-500">Estimated Delivery</span>
        <span className="block font-mono-num text-lg font-semibold text-[#059669]">
          {selectedOrder?.estimatedDelivery || '7 – 14 days'}
        </span>
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 text-[#059669] flex items-center justify-center mx-auto my-2 animate-float-soft">
          <Package className="w-6 h-6" />
        </div>
        <p className="text-[11px] text-slate-500">
          Courier: <strong className="text-slate-900 font-semibold">eCourier Bangladesh</strong>
        </p>
      </motion.div>

      <div className="w-full space-y-2.5">
        <button
          type="button"
          onClick={() =>
            navigateTo('order_tracking', {
              orderId: selectedOrder?.id || 'DM123456',
            })
          }
          className="w-full h-11 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs transition-colors"
        >
          View Live Order Tracking
        </button>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="w-full h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
