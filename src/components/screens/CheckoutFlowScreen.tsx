import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Banknote,
  Check,
  CheckCircle2,
  CreditCard,
  Edit3,
  MapPin,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  Smartphone,
  Trash2,
  Truck,
  Wallet,
} from 'lucide-react';
// Clean production CheckoutFlowScreen — zero Cultural Vibe imports
import { useDeshiMart } from '../../context/DeshiMartContext';
import {
  PaymentMethodId,
  ShippingAddress,
  ShippingMethodId,
} from '../../types/deshimart';
import { validateBangladeshNidInput } from '../../utils/addressAndPaymentValidator';
import {
  CheckoutPriceBreakdown,
  CheckoutProgressHeader,
  CheckoutStickyFooter,
} from '../checkout/CheckoutSharedModules';

const BD_DISTRICTS = [
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  'Mymensingh',
  'Gazipur',
  'Narayanganj',
  'Cumilla',
];

function isValidBangladeshMobile(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('8801') && digits.length === 13) {
    return /^8801[3-9]\d{8}$/.test(digits);
  }
  if (digits.startsWith('01') && digits.length === 11) {
    return /^01[3-9]\d{8}$/.test(digits);
  }
  return false;
}

export const CheckoutFlowScreen: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    shippingMethod,
    setShippingMethod,
    paymentMethod,
    setPaymentMethod,
    checkoutDraft,
    setCheckoutDraft,
    cart,
    cartCount,
    updateCartQuantity,
    promoCode,
    products,
    cartTotals,
    formatPrice,
    placeOrder,
    selectedOrder,
    nidSecurity,
    submitNidVerification,
    user,
  } = useDeshiMart();

  // Address Form State (Add or Edit)
  const [addressFormMode, setAddressFormMode] = useState<
    null | 'add' | 'edit'
  >(null);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [formFullName, setFormFullName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStreet, setFormStreet] = useState('');
  const [formCity, setFormCity] = useState('Dhaka');
  const [formPostal, setFormPostal] = useState('1212');
  const [addressFormErrors, setAddressFormErrors] = useState<
    Record<string, string>
  >({});

  // Payment Validation State
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Order Submission State (Duplicate Guard + Retry)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const submissionLockRef = React.useRef(false);

  // Inline Quick NID Verification State for Checkout Customs Clearance
  const [inlineNidOpen, setInlineNidOpen] = useState(false);
  const [inlineNidNumber, setInlineNidNumber] = useState('');
  const [inlineNidDob, setInlineNidDob] = useState('1996-05-14');
  const [inlineNidError, setInlineNidError] = useState<string | null>(null);

  const activeAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const openAddAddressForm = () => {
    setAddressFormMode('add');
    setEditingAddrId(null);
    setFormLabel('Home');
    setFormFullName('Tanvir Ahmed');
    setFormPhone('+880 1712 345678');
    setFormStreet('');
    setFormCity('Dhaka');
    setFormPostal('1212');
    setAddressFormErrors({});
  };

  const openEditAddressForm = (addr: ShippingAddress) => {
    setAddressFormMode('edit');
    setEditingAddrId(addr.id);
    setFormLabel(
      addr.label === 'Home' || addr.label === 'Office' ? addr.label : 'Other'
    );
    setFormFullName(addr.fullName);
    setFormPhone(addr.phone);
    setFormStreet(addr.address);
    setFormCity(addr.city || 'Dhaka');
    setFormPostal(addr.postalCode || '1212');
    setAddressFormErrors({});
  };

  const validateAndSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (formFullName.trim().length < 2) {
      errs.fullName = 'Recipient full name is required.';
    }
    if (!isValidBangladeshMobile(formPhone)) {
      errs.phone = 'Enter a valid BD mobile number (e.g., 01712345678).';
    }
    if (formStreet.trim().length < 5) {
      errs.street = 'Please enter house, road, and area details.';
    }
    if (!/^\d{4}$/.test(formPostal.trim())) {
      errs.postal = 'Enter a valid 4-digit BD postal code (e.g., 1212).';
    }

    if (Object.keys(errs).length > 0) {
      setAddressFormErrors(errs);
      return;
    }

    if (addressFormMode === 'edit' && editingAddrId) {
      updateAddress(editingAddrId, {
        label: formLabel,
        fullName: formFullName.trim(),
        phone: formPhone.trim(),
        address: formStreet.trim(),
        city: formCity,
        postalCode: formPostal.trim(),
      });
    } else {
      addAddress({
        label: formLabel,
        fullName: formFullName.trim(),
        phone: formPhone.trim(),
        address: formStreet.trim(),
        city: formCity,
        postalCode: formPostal.trim(),
      });
    }
    setAddressFormMode(null);
    setEditingAddrId(null);
    setAddressFormErrors({});
  };

  // =========================================================================
  // SCREEN 2: DELIVERY ADDRESS (Step 1 of 4)
  // =========================================================================
  if (currentScreen === 'checkout_shipping') {
    return (
      <div className="flex-1 flex flex-col justify-between bg-app-bg">
        <div>
          <CheckoutProgressHeader
            activeStep="address"
            onNavigateStep={(scr) => navigateTo(scr)}
          />

          <div className="p-4 space-y-3.5 pb-6">
            {/* Saved Addresses Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-content-primary">
                Delivery Address
              </h2>
              {addressFormMode === null && (
                <button
                  type="button"
                  onClick={openAddAddressForm}
                  className="h-8 px-3 rounded-lg bg-brand-subtle border border-brand-border text-brand-primary text-xs font-semibold inline-flex items-center gap-1 hover:bg-emerald-100/70 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            {/* Saved Address Radio Cards */}
            <div className="space-y-2.5" role="radiogroup" aria-label="Saved Delivery Addresses">
              {addresses.map((addr) => {
                const isSelected = addr.id === selectedAddressId;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedAddressId(addr.id);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-brand-primary bg-brand-subtle/35 ring-1 ring-brand-primary/15'
                        : 'border-app-border hover:border-app-borderStrong'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-brand-primary bg-brand-primary text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-semibold text-content-primary truncate">
                          {addr.fullName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-app-subtle text-[10px] font-semibold text-content-secondary">
                          {addr.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          aria-label={`Edit ${addr.label} address`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditAddressForm(addr);
                          }}
                          className="w-7 h-7 rounded-lg text-content-secondary hover:text-brand-primary hover:bg-app-subtle flex items-center justify-center transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {addresses.length > 1 && (
                          <button
                            type="button"
                            aria-label={`Delete ${addr.label} address`}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAddress(addr.id);
                            }}
                            className="w-7 h-7 rounded-lg text-content-muted hover:text-promo-accent hover:bg-app-subtle flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pl-6 mt-1 space-y-0.5 text-xs text-content-secondary">
                      <p className="leading-snug">{addr.address}</p>
                      <p className="text-[11px] text-content-muted tabular-nums">
                        {addr.city} {addr.postalCode} · {addr.phone}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Responsive Add / Edit Address Form with Validation */}
            {addressFormMode !== null && (
              <form
                onSubmit={validateAndSaveAddress}
                noValidate
                className="bg-white rounded-xl border border-app-border p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-app-border pb-2.5">
                  <h3 className="text-xs font-semibold text-content-primary">
                    {addressFormMode === 'edit'
                      ? 'Edit Address'
                      : 'New Address'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setAddressFormMode(null);
                      setAddressFormErrors({});
                    }}
                    className="text-xs font-medium text-content-muted hover:text-content-primary"
                  >
                    Cancel
                  </button>
                </div>

                {/* Address Label Selector */}
                <div className="flex items-center gap-2">
                  {(['Home', 'Office', 'Other'] as const).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setFormLabel(lbl)}
                      className={`h-8 px-3 rounded-lg text-xs font-medium border transition-colors ${
                        formLabel === lbl
                          ? 'bg-brand-subtle border-brand-primary text-brand-primary font-semibold'
                          : 'bg-app-bg border-app-border text-content-secondary'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-content-secondary mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formFullName}
                    onChange={(e) => {
                      setFormFullName(e.target.value);
                      if (addressFormErrors.fullName) {
                        setAddressFormErrors((p) => ({ ...p, fullName: '' }));
                      }
                    }}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full h-10 px-3 rounded-lg bg-app-bg border border-app-border text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                  />
                  {addressFormErrors.fullName && (
                    <p className="text-[11px] text-red-600 mt-1">
                      {addressFormErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-content-secondary mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => {
                      setFormPhone(e.target.value);
                      if (addressFormErrors.phone) {
                        setAddressFormErrors((p) => ({ ...p, phone: '' }));
                      }
                    }}
                    placeholder="01712345678"
                    className="w-full h-10 px-3 rounded-lg bg-app-bg border border-app-border tabular-nums text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                  />
                  {addressFormErrors.phone && (
                    <p className="text-[11px] text-red-600 mt-1">
                      {addressFormErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-content-secondary mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formStreet}
                    onChange={(e) => {
                      setFormStreet(e.target.value);
                      if (addressFormErrors.street) {
                        setAddressFormErrors((p) => ({ ...p, street: '' }));
                      }
                    }}
                    placeholder="House 14, Road 5, Dhanmondi"
                    className="w-full h-10 px-3 rounded-lg bg-app-bg border border-app-border text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                  />
                  {addressFormErrors.street && (
                    <p className="text-[11px] text-red-600 mt-1">
                      {addressFormErrors.street}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-content-secondary mb-1">
                      City
                    </label>
                    <select
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full h-10 px-2.5 rounded-lg bg-app-bg border border-app-border text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                    >
                      {BD_DISTRICTS.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-content-secondary mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={formPostal}
                      onChange={(e) => {
                        setFormPostal(e.target.value);
                        if (addressFormErrors.postal) {
                          setAddressFormErrors((p) => ({ ...p, postal: '' }));
                        }
                      }}
                      placeholder="1212"
                      className="w-full h-10 px-3 rounded-lg bg-app-bg border border-app-border tabular-nums text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                    />
                    {addressFormErrors.postal && (
                      <p className="text-[11px] text-red-600 mt-1">
                        {addressFormErrors.postal}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[42px] rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
                >
                  {addressFormMode === 'edit'
                    ? 'Save Changes'
                    : 'Save Address'}
                </button>
              </form>
            )}

            {/* Optional Delivery Note */}
            <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-1.5">
              <label
                htmlFor="checkout-delivery-note"
                className="block text-xs font-semibold text-content-primary"
              >
                Delivery Note (Optional)
              </label>
              <input
                id="checkout-delivery-note"
                type="text"
                value={checkoutDraft.deliveryNote}
                onChange={(e) =>
                  setCheckoutDraft((prev) => ({
                    ...prev,
                    deliveryNote: e.target.value,
                  }))
                }
                placeholder="e.g. Call on arrival or leave at reception"
                className="w-full h-9 px-3 rounded-lg bg-app-bg border border-app-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        <CheckoutStickyFooter
          totalLabel="Delivering to"
          totalFormatted={activeAddress ? activeAddress.city : 'Dhaka'}
          subLabel={activeAddress ? activeAddress.address : 'Select an address'}
          primaryLabel="Continue to Delivery"
          disabled={!activeAddress || addressFormMode !== null}
          onPrimaryClick={() => navigateTo('checkout_delivery')}
        />
      </div>
    );
  }

  // =========================================================================
  // SCREEN 3: DELIVERY METHOD (Step 2 of 4)
  // =========================================================================
  if (currentScreen === 'checkout_delivery') {
    const deliveryMethods: {
      id: ShippingMethodId;
      title: string;
      eta: string;
      courier: string;
      feeLabel: string;
      badge?: string;
    }[] = [
      {
        id: 'standard',
        title: 'Standard Doorstep',
        eta: '7–12 days',
        courier: 'eCourier / RedX',
        feeLabel: 'Free',
        badge: 'Recommended',
      },
      {
        id: 'express',
        title: 'Priority Express',
        eta: '3–7 days',
        courier: 'DHL / Pathao Priority',
        feeLabel: `+${formatPrice(800)}`,
        badge: 'Fastest',
      },
      {
        id: 'hub_pickup',
        title: 'Dhaka Pickup Point',
        eta: '5–9 days',
        courier: 'Banani & Dhanmondi',
        feeLabel: `-${formatPrice(150)}`,
      },
    ];

    return (
      <div className="flex-1 flex flex-col justify-between bg-app-bg">
        <div>
          <CheckoutProgressHeader
            activeStep="delivery"
            onNavigateStep={(scr) => navigateTo(scr)}
          />

          <div className="p-4 space-y-3.5 pb-6">
            {/* Compact Selected Address Context Bar */}
            <div className="p-3 rounded-xl bg-white border border-app-border flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold text-content-primary block truncate">
                    {activeAddress?.fullName} · {activeAddress?.city}
                  </span>
                  <span className="text-[11px] text-content-secondary block truncate">
                    {activeAddress?.address}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('checkout_shipping')}
                className="text-xs font-semibold text-brand-primary hover:underline shrink-0"
              >
                Change
              </button>
            </div>

            {/* Delivery Options List */}
            <div className="space-y-2.5" role="radiogroup" aria-label="Delivery Speed and Method">
              {deliveryMethods.map((method) => {
                const isSelected = shippingMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setShippingMethod(method.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all bg-white ${
                      isSelected
                        ? 'border-brand-primary bg-brand-subtle/35 ring-1 ring-brand-primary/15'
                        : 'border-app-border hover:border-app-borderStrong'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-brand-primary bg-brand-primary text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-semibold text-content-primary">
                              {method.title}
                            </span>
                            {method.badge && (
                              <span className="px-1.5 py-0.5 rounded bg-brand-subtle text-[10px] font-semibold text-brand-primary">
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-content-secondary block mt-0.5 tabular-nums">
                            {method.eta} · {method.courier}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`tabular-nums text-xs font-bold shrink-0 ${
                          method.id === 'express'
                            ? 'text-content-primary'
                            : 'text-brand-primary'
                        }`}
                      >
                        {method.feeLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <CheckoutStickyFooter
          totalLabel="Total Payable"
          totalFormatted={formatPrice(cartTotals.totalBdt)}
          primaryLabel="Continue to Payment"
          onPrimaryClick={() => navigateTo('checkout_payment')}
        />
      </div>
    );
  }

  // =========================================================================
  // SCREEN 4: PAYMENT METHOD (Step 3 of 4)
  // Supports Cash on Delivery, bKash, Nagad, and Cards with real validation.
  // =========================================================================
  if (currentScreen === 'checkout_payment') {
    const paymentOptions: {
      id: PaymentMethodId;
      title: string;
      subtitle: string;
      icon: React.FC<{ className?: string }>;
    }[] = [
      {
        id: 'cod',
        title: 'Cash on Delivery',
        subtitle: 'Pay in cash when your order arrives',
        icon: Banknote,
      },
      {
        id: 'bkash',
        title: 'bKash',
        subtitle: 'Pay with your bKash account',
        icon: Smartphone,
      },
      {
        id: 'nagad',
        title: 'Nagad',
        subtitle: 'Pay with your Nagad account',
        icon: Wallet,
      },
      {
        id: 'rocket',
        title: 'Rocket (DBBL)',
        subtitle: 'Pay with your Dutch-Bangla Rocket wallet',
        icon: Smartphone,
      },
      {
        id: 'upay',
        title: 'Upay (UCB)',
        subtitle: 'Pay with your UCB Upay wallet',
        icon: Wallet,
      },
      {
        id: 'card',
        title: 'Credit / Debit Card',
        subtitle: 'Visa, Mastercard, AMEX',
        icon: CreditCard,
      },
    ];

    const handleContinueToReview = () => {
      setPaymentError(null);

      if (paymentMethod === 'bkash') {
        if (!isValidBangladeshMobile(checkoutDraft.bkashPhone)) {
          setPaymentError(
            'Please enter a valid 11-digit bKash number (e.g., 01712345678).'
          );
          return;
        }
      } else if (paymentMethod === 'nagad') {
        if (!isValidBangladeshMobile(checkoutDraft.nagadPhone)) {
          setPaymentError(
            'Please enter a valid 11-digit Nagad number (e.g., 01819345678).'
          );
          return;
        }
      } else if (paymentMethod === 'rocket') {
        if (!isValidBangladeshMobile(checkoutDraft.rocketPhone || '')) {
          setPaymentError(
            'Please enter a valid 11-digit Rocket number (e.g., 01911345678).'
          );
          return;
        }
      } else if (paymentMethod === 'upay') {
        if (!isValidBangladeshMobile(checkoutDraft.upayPhone || '')) {
          setPaymentError(
            'Please enter a valid 11-digit Upay number (e.g., 01615345678).'
          );
          return;
        }
      } else if (paymentMethod === 'card') {
        const cleanDigits = checkoutDraft.cardNumber.replace(/\D/g, '');
        const isAlreadyTokenized =
          checkoutDraft.cardNumber.includes('••••') && cleanDigits.length >= 4;
        if (
          !isAlreadyTokenized &&
          (cleanDigits.length < 13 || cleanDigits.length > 19)
        ) {
          setPaymentError('Please enter a valid 16-digit card number.');
          return;
        }
        if (!/^\d{2}\/\d{2}$/.test(checkoutDraft.cardExpiry.trim())) {
          setPaymentError('Enter card expiry in MM/YY format (e.g., 12/28).');
          return;
        }
        if (
          !isAlreadyTokenized &&
          !/^\d{3,4}$/.test(checkoutDraft.cardCvv.trim())
        ) {
          setPaymentError('Enter a valid 3 or 4 digit security CVV.');
          return;
        }
      }

      navigateTo('checkout_review');
    };

    return (
      <div className="flex-1 flex flex-col justify-between bg-app-bg">
        <div>
          <CheckoutProgressHeader
            activeStep="payment"
            onNavigateStep={(scr) => navigateTo(scr)}
          />

          <div className="p-4 space-y-3.5 pb-6">
            <h2 className="text-sm font-semibold text-content-primary">
              Payment Method
            </h2>

            {/* Payment Option Radio List */}
            <div className="space-y-2.5" role="radiogroup" aria-label="Payment Methods">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      setPaymentMethod(opt.id);
                      setPaymentError(null);
                    }}
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all bg-white ${
                      isSelected
                        ? 'border-brand-primary bg-brand-subtle/35 ring-1 ring-brand-primary/15'
                        : 'border-app-border hover:border-app-borderStrong'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
                          isSelected
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : 'bg-app-bg text-content-secondary border-app-border'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold text-content-primary truncate">
                          {opt.title}
                        </span>
                        <span className="block text-[11px] text-content-secondary truncate mt-0.5">
                          {opt.subtitle}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Contextual Payment Details Input */}
            {paymentMethod === 'cod' && (
              <div className="p-3.5 rounded-xl bg-white border border-app-border text-xs text-content-secondary leading-relaxed">
                Pay{' '}
                <strong className="tabular-nums text-content-primary font-semibold">
                  {formatPrice(cartTotals.totalBdt)}
                </strong>{' '}
                in cash upon delivery in{' '}
                <strong className="text-content-primary font-medium">
                  {activeAddress?.city || 'Dhaka'}
                </strong>
                .
              </div>
            )}

            {paymentMethod === 'bkash' && (
              <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-2">
                <label
                  htmlFor="bkash-phone-input"
                  className="block text-xs font-semibold text-content-primary"
                >
                  bKash Account Number
                </label>
                <input
                  id="bkash-phone-input"
                  type="tel"
                  value={checkoutDraft.bkashPhone}
                  onChange={(e) => {
                    setCheckoutDraft((prev) => ({
                      ...prev,
                      bkashPhone: e.target.value,
                    }));
                    setPaymentError(null);
                  }}
                  placeholder="017XXXXXXXX"
                  className="w-full h-10 px-3 rounded-lg bg-app-bg border border-app-border tabular-nums text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            )}

            {paymentMethod === 'nagad' && (
              <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-2">
                <label
                  htmlFor="nagad-phone-input"
                  className="block text-xs font-semibold text-content-primary"
                >
                  Nagad Account Number
                </label>
                <input
                  id="nagad-phone-input"
                  type="tel"
                  value={checkoutDraft.nagadPhone}
                  onChange={(e) => {
                    setCheckoutDraft((prev) => ({
                      ...prev,
                      nagadPhone: e.target.value,
                    }));
                    setPaymentError(null);
                  }}
                  placeholder="018XXXXXXXX"
                  className="w-full h-10 px-3 rounded-lg bg-app-bg border border-app-border tabular-nums text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            )}

            {paymentMethod === 'rocket' && (
              <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-2">
                <label
                  htmlFor="rocket-phone-input"
                  className="block text-xs font-semibold text-content-primary"
                >
                  Rocket (DBBL) Account Number
                </label>
                <input
                  id="rocket-phone-input"
                  type="tel"
                  value={checkoutDraft.rocketPhone || ''}
                  onChange={(e) => {
                    setCheckoutDraft((prev) => ({
                      ...prev,
                      rocketPhone: e.target.value,
                    }));
                    setPaymentError(null);
                  }}
                  placeholder="019XXXXXXXX"
                  className="w-full h-10 px-3 rounded-lg bg-app-bg border border-app-border tabular-nums text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            )}

            {paymentMethod === 'upay' && (
              <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-2">
                <label
                  htmlFor="upay-phone-input"
                  className="block text-xs font-semibold text-content-primary"
                >
                  Upay (UCB) Account Number
                </label>
                <input
                  id="upay-phone-input"
                  type="tel"
                  value={checkoutDraft.upayPhone || ''}
                  onChange={(e) => {
                    setCheckoutDraft((prev) => ({
                      ...prev,
                      upayPhone: e.target.value,
                    }));
                    setPaymentError(null);
                  }}
                  placeholder="016XXXXXXXX"
                  className="w-full h-10 px-3 rounded-lg bg-app-bg border border-app-border tabular-nums text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-content-secondary mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={checkoutDraft.cardHolder}
                    onChange={(e) => {
                      setCheckoutDraft((prev) => ({
                        ...prev,
                        cardHolder: e.target.value,
                      }));
                      setPaymentError(null);
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-app-bg border border-app-border text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-content-secondary mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={checkoutDraft.cardNumber}
                    onChange={(e) => {
                      setCheckoutDraft((prev) => ({
                        ...prev,
                        cardNumber: e.target.value,
                      }));
                      setPaymentError(null);
                    }}
                    placeholder="4532 •••• •••• 8910"
                    className="w-full h-10 px-3 rounded-lg bg-app-bg border border-app-border tabular-nums text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-content-secondary mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={checkoutDraft.cardExpiry}
                      onChange={(e) => {
                        setCheckoutDraft((prev) => ({
                          ...prev,
                          cardExpiry: e.target.value,
                        }));
                        setPaymentError(null);
                      }}
                      placeholder="12/28"
                      className="w-full h-10 px-3 rounded-lg bg-app-bg border border-app-border tabular-nums text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-content-secondary mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={checkoutDraft.cardCvv}
                      onChange={(e) => {
                        setCheckoutDraft((prev) => ({
                          ...prev,
                          cardCvv: e.target.value,
                        }));
                        setPaymentError(null);
                      }}
                      placeholder="•••"
                      className="w-full h-10 px-3 rounded-lg bg-app-bg border border-app-border tabular-nums text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <CheckoutStickyFooter
          totalLabel="Total Payable"
          totalFormatted={formatPrice(cartTotals.totalBdt)}
          primaryLabel="Review Order"
          errorMessage={paymentError}
          onPrimaryClick={handleContinueToReview}
        />
      </div>
    );
  }

  // =========================================================================
  // SCREEN 5: ORDER REVIEW (Step 4 of 4)
  // =========================================================================
  if (currentScreen === 'checkout_review') {
    const paymentLabels: Record<PaymentMethodId, string> = {
      cod: 'Cash on Delivery',
      bkash: `bKash (${checkoutDraft.bkashPhone})`,
      nagad: `Nagad (${checkoutDraft.nagadPhone})`,
      rocket: `Rocket (${checkoutDraft.rocketPhone || '01911345678'})`,
      upay: `Upay (${checkoutDraft.upayPhone || '01615345678'})`,
      card: `Card (•••• ${checkoutDraft.cardNumber.replace(/\D/g, '').slice(-4) || '8910'})`,
      paypal: 'PayPal',
    };

    const deliveryMethodLabels: Record<
      ShippingMethodId,
      { name: string; eta: string }
    > = {
      standard: { name: 'Standard Doorstep', eta: '7–12 days' },
      express: { name: 'Priority Express', eta: '3–7 days' },
      hub_pickup: { name: 'Dhaka Pickup Point', eta: '5–9 days' },
    };

    const isHighValueCodGuardActive =
      paymentMethod === 'cod' &&
      nidSecurity.codSecurityLock &&
      cartTotals.totalBdt >= 15000 &&
      nidSecurity.status !== 'verified';

    const handleInlineNidVerify = (e: React.FormEvent) => {
      e.preventDefault();
      const holderName = activeAddress?.fullName || user.fullName || 'Tanvir Ahmed';
      const check = validateBangladeshNidInput({
        nidNumber: inlineNidNumber,
        holderName,
        dateOfBirth: inlineNidDob,
      });
      if (!check.valid) {
        setInlineNidError(
          check.errors.nidNumber ||
            check.errors.dateOfBirth ||
            'Enter a valid 10, 13, or 17-digit Bangladesh NID.'
        );
        return;
      }
      setInlineNidError(null);
      const res = submitNidVerification({
        nidNumber: inlineNidNumber,
        holderName,
        dateOfBirth: inlineNidDob,
        frontDocCaptured: true,
        backDocCaptured: true,
      });
      if (res.valid) {
        setInlineNidNumber('');
        setInlineNidOpen(false);
        setOrderError(null);
      }
    };

    const handlePlaceOrderSubmit = () => {
      if (submissionLockRef.current || isPlacingOrder || cart.length === 0) {
        return;
      }
      if (isHighValueCodGuardActive) {
        setInlineNidOpen(true);
        setOrderError(
          'High-value Cash on Delivery (≥ ৳15,000) requires Bangladesh NID verification below.'
        );
        return;
      }
      submissionLockRef.current = true;
      setIsPlacingOrder(true);
      setOrderError(null);

      setTimeout(() => {
        const idempotencyKey = `${cartTotals.quoteId}-${selectedAddressId}-${paymentMethod}`;
        const created = placeOrder(idempotencyKey);
        setIsPlacingOrder(false);
        submissionLockRef.current = false;
        navigateTo('order_success', { orderId: created.id });
      }, 500);
    };

    if (cart.length === 0) {
      return (
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center bg-app-bg">
          <p className="text-sm font-semibold text-content-primary">
            Your cart is empty
          </p>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="mt-3 h-10 px-4 rounded-xl bg-brand-primary text-white text-xs font-semibold"
          >
            Return to Catalog
          </button>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col justify-between bg-app-bg">
        <div>
          <CheckoutProgressHeader
            activeStep="review"
            onNavigateStep={(scr) => navigateTo(scr)}
          />

          <div className="p-4 space-y-3.5 pb-6">
            {/* 1. Summary Grid (Address, Delivery Speed, Payment) */}
            <div className="space-y-2.5">
              {/* Full-Width Address Card with Quick Edit */}
              <div className="p-3.5 rounded-xl bg-white border border-app-border flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-content-primary truncate">
                        {activeAddress?.fullName}
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-app-subtle text-content-secondary">
                        {activeAddress?.label}
                      </span>
                    </div>
                    <p className="text-xs text-content-secondary mt-0.5 leading-snug">
                      {activeAddress?.address}, {activeAddress?.city}{' '}
                      {activeAddress?.postalCode}
                    </p>
                    <p className="tabular-nums text-[11px] text-content-muted mt-0.5">
                      {activeAddress?.phone}
                      {checkoutDraft.deliveryNote
                        ? ` · "${checkoutDraft.deliveryNote}"`
                        : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('checkout_shipping')}
                  className="text-xs font-semibold text-brand-primary hover:underline shrink-0"
                >
                  Change
                </button>
              </div>

              {/* 2-Column Row for Delivery Method & Payment Method */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => navigateTo('checkout_delivery')}
                  className="p-3 rounded-xl bg-white border border-app-border hover:border-brand-border text-left flex flex-col justify-between gap-1.5 transition-colors"
                >
                  <div className="flex items-center justify-between w-full text-content-secondary">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                      <Truck className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>Delivery</span>
                    </span>
                    <span className="text-[11px] font-semibold text-brand-primary">
                      Edit
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-content-primary truncate">
                      {deliveryMethodLabels[shippingMethod].name}
                    </p>
                    <p className="text-[10px] text-content-muted tabular-nums">
                      {deliveryMethodLabels[shippingMethod].eta}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('checkout_payment')}
                  className="p-3 rounded-xl bg-white border border-app-border hover:border-brand-border text-left flex flex-col justify-between gap-1.5 transition-colors"
                >
                  <div className="flex items-center justify-between w-full text-content-secondary">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                      <CreditCard className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>Payment</span>
                    </span>
                    <span className="text-[11px] font-semibold text-brand-primary">
                      Edit
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-content-primary truncate">
                      {paymentLabels[paymentMethod]}
                    </p>
                    <p className="text-[10px] text-content-muted">
                      {paymentMethod === 'cod'
                        ? 'Pay on delivery'
                        : 'Verified'}
                    </p>
                  </div>
                </button>
              </div>

              {/* NBR Customs & Importer NID Security Clearance Card */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  nidSecurity.status === 'verified'
                    ? 'bg-brand-subtle/35 border-brand-primary'
                    : isHighValueCodGuardActive
                    ? 'bg-amber-50/90 border-amber-300'
                    : 'bg-white border-app-border'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <ShieldCheck
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        nidSecurity.status === 'verified'
                          ? 'text-brand-primary'
                          : 'text-amber-600'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-content-primary">
                          NBR Customs & NID Security
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            nidSecurity.status === 'verified'
                              ? 'bg-brand-primary text-white'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {nidSecurity.status === 'verified'
                            ? '✓ Fast-Track'
                            : isHighValueCodGuardActive
                            ? 'Required for COD'
                            : 'Optional'}
                        </span>
                      </div>
                      <p className="text-[11px] text-content-secondary mt-0.5 leading-snug">
                        {nidSecurity.status === 'verified'
                          ? `Verified NID (${nidSecurity.maskedNid}) · Token ${nidSecurity.verificationToken}`
                          : isHighValueCodGuardActive
                          ? 'Orders ≥ ৳15,000 with Cash on Delivery require NID verification for customs & fraud security.'
                          : 'Verify your BD National ID for priority Dhaka Airport customs manifest clearance.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      nidSecurity.status === 'verified'
                        ? navigateTo('nid_security')
                        : setInlineNidOpen((prev) => !prev)
                    }
                    className="text-xs font-semibold text-brand-primary hover:underline shrink-0"
                  >
                    {nidSecurity.status === 'verified'
                      ? 'Manage'
                      : inlineNidOpen
                      ? 'Close'
                      : 'Verify Now'}
                  </button>
                </div>

                {nidSecurity.status !== 'verified' && inlineNidOpen && (
                  <form
                    onSubmit={handleInlineNidVerify}
                    noValidate
                    className="mt-3 pt-3 border-t border-app-border space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-content-primary">
                        Quick BD NID Verification (10 / 13 / 17 Digits)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setInlineNidNumber('1996482910');
                          setInlineNidDob('1996-05-14');
                          setInlineNidError(null);
                        }}
                        className="text-[11px] font-semibold text-brand-primary hover:underline"
                      >
                        Use Sample Smart NID
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={inlineNidNumber}
                        onChange={(e) => {
                          setInlineNidNumber(e.target.value);
                          if (inlineNidError) setInlineNidError(null);
                        }}
                        placeholder="NID Number (e.g. 1996482910)"
                        className="w-full h-9 px-3 rounded-lg bg-white border border-app-border tabular-nums text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                      />
                      <input
                        type="date"
                        value={inlineNidDob}
                        onChange={(e) => {
                          setInlineNidDob(e.target.value);
                          if (inlineNidError) setInlineNidError(null);
                        }}
                        className="w-full h-9 px-3 rounded-lg bg-white border border-app-border tabular-nums text-xs text-content-primary focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    {inlineNidError && (
                      <p role="alert" className="text-[11px] text-red-600">
                        {inlineNidError}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="w-full h-9 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
                    >
                      Verify NID & Unlock Customs Fast-Track
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* 2. Editable Order Items List */}
            <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-2.5">
              <h3 className="text-xs font-semibold text-content-primary">
                Items ({cartCount})
              </h3>

              <div className="divide-y divide-app-border/80">
                {cart.map((item) => {
                  const prod = products.find((p) => p.id === item.productId);
                  if (!prod) return null;
                  const rt =
                    prod.routes.find((r) => r.id === item.selectedRouteId) ||
                    prod.routes[0];
                  const unitBdt = rt ? rt.totalLandedBdt : prod.totalLandedBdt;

                  const variantDescriptor = {
                    color: item.selectedColor,
                    size: item.selectedSize || '',
                    routeId: item.selectedRouteId || 'default',
                  };
                  const compositeKey = `${item.productId}::${item.selectedColor}::${item.selectedSize || ''}::${item.selectedRouteId || 'default'}`;

                  return (
                    <div
                      key={compositeKey}
                      className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-lg object-contain bg-slate-50 p-1 border border-app-border shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-content-primary truncate">
                            {prod.name}
                          </p>
                          <p className="text-[11px] text-content-secondary truncate">
                            {item.selectedColor}
                            {item.selectedSize ? ` · ${item.selectedSize}` : ''}
                            {rt?.name ? ` · ${rt.name}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Inline Quantity Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1 bg-app-bg border border-app-border rounded-lg p-0.5">
                          <button
                            type="button"
                            aria-label={`Decrease ${prod.name} (${item.selectedColor}) quantity`}
                            onClick={() => updateCartQuantity(prod.id, -1, variantDescriptor)}
                            className="w-6 h-6 rounded bg-white text-content-primary flex items-center justify-center shadow-2xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="tabular-nums text-[11px] font-semibold text-content-primary min-w-[18px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase ${prod.name} (${item.selectedColor}) quantity`}
                            onClick={() => updateCartQuantity(prod.id, 1, variantDescriptor)}
                            className="w-6 h-6 rounded bg-white text-content-primary flex items-center justify-center shadow-2xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="tabular-nums font-bold text-content-primary min-w-[64px] text-right">
                          {formatPrice(unitBdt * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Order Summary Breakdown */}
            <CheckoutPriceBreakdown
              itemCount={cartCount}
              baseItemsBdt={cartTotals.baseItemsBdt}
              freightBdt={cartTotals.freightBdt}
              dutyAndVatBdt={cartTotals.dutyAndVatBdt}
              consolidationSavingsBdt={cartTotals.consolidationSavingsBdt}
              promoCode={promoCode}
              promoDiscountBdt={cartTotals.promoDiscountBdt}
              shippingBdt={cartTotals.shippingBdt}
              shippingLabel={deliveryMethodLabels[shippingMethod].name}
              totalBdt={cartTotals.totalBdt}
              formatPrice={formatPrice}
            />
          </div>
        </div>

        <CheckoutStickyFooter
          totalLabel="Total Payable"
          totalFormatted={formatPrice(cartTotals.totalBdt)}
          primaryLabel="Place Order"
          loadingLabel="Placing Order..."
          isLoading={isPlacingOrder}
          errorMessage={orderError}
          onRetry={() => {
            setOrderError(null);
            handlePlaceOrderSubmit();
          }}
          onPrimaryClick={handlePlaceOrderSubmit}
        />
      </div>
    );
  }

  // =========================================================================
  // SCREEN 6: ORDER CONFIRMATION
  // =========================================================================
  const confirmedOrder = selectedOrder;
  const paymentMethodDisplay: Record<PaymentMethodId, string> = {
    cod: 'Cash on Delivery',
    bkash: 'bKash',
    nagad: 'Nagad',
    rocket: 'Rocket (DBBL)',
    upay: 'Upay (UCB)',
    card: 'Card',
    paypal: 'PayPal',
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-app-bg">
      <div className="p-4 space-y-3.5 pb-6">
        {/* Top Confirmation Banner */}
        <div className="bg-white rounded-2xl border border-app-border p-5 text-center space-y-2">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-11 h-11 rounded-full bg-brand-subtle text-brand-primary border border-brand-border flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="w-5 h-5" />
          </motion.div>

          <div className="space-y-1">
            <h1 className="text-base font-bold text-content-primary">
              Order Confirmed
            </h1>
            <p className="text-xs text-content-secondary">
              Order{' '}
              <strong className="tabular-nums text-content-primary font-semibold">
                #{confirmedOrder?.id || 'DM123456'}
              </strong>{' '}
              · Tracking{' '}
              <strong className="tabular-nums text-content-primary font-semibold">
                {confirmedOrder?.trackingCode || 'EC9823412BD'}
              </strong>
            </p>
          </div>
        </div>

        {/* 2x2 Summary Grid (ETA, Courier, Payment, Total) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-white border border-app-border space-y-0.5">
            <span className="text-[11px] text-content-secondary block">
              Estimated Arrival
            </span>
            <span className="tabular-nums text-xs font-bold text-content-primary block">
              {confirmedOrder?.estimatedDelivery || '7–12 days'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-app-border space-y-0.5">
            <span className="text-[11px] text-content-secondary block">
              Courier
            </span>
            <span className="text-xs font-bold text-content-primary block truncate">
              {confirmedOrder?.courierName || 'eCourier'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-app-border space-y-0.5">
            <span className="text-[11px] text-content-secondary block">
              Payment
            </span>
            <span className="text-xs font-semibold text-content-primary block truncate">
              {confirmedOrder
                ? paymentMethodDisplay[confirmedOrder.paymentMethod]
                : 'Cash on Delivery'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-app-border space-y-0.5">
            <span className="text-[11px] text-content-secondary block">
              Total Paid
            </span>
            <span className="tabular-nums text-xs font-bold text-brand-primary block">
              {formatPrice(confirmedOrder?.totalBdt || 0)}
            </span>
          </div>
        </div>

        {/* Delivery Destination & Item Summary Card */}
        {confirmedOrder && (
          <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-3">
            <div className="pb-2.5 border-b border-app-border">
              <span className="text-[11px] font-medium text-content-secondary block">
                Delivering To
              </span>
              <p className="text-xs font-semibold text-content-primary mt-0.5">
                {confirmedOrder.shippingAddress.fullName} ·{' '}
                {confirmedOrder.shippingAddress.phone}
              </p>
              <p className="text-xs text-content-secondary mt-0.5">
                {confirmedOrder.shippingAddress.address},{' '}
                {confirmedOrder.shippingAddress.city}{' '}
                {confirmedOrder.shippingAddress.postalCode}
              </p>
              {confirmedOrder.importerMaskedNid && (
                <p className="text-[11px] text-brand-primary font-semibold mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    NBR Customs NID Verified ({confirmedOrder.importerMaskedNid}) ·{' '}
                    {confirmedOrder.importerNidToken}
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-medium text-content-secondary block">
                Items ({confirmedOrder.items.reduce((s, i) => s + i.quantity, 0)})
              </span>
              <div className="divide-y divide-app-border/70">
                {confirmedOrder.items.map((item, idx) => (
                  <div
                    key={`${item.productId}-${idx}`}
                    className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-contain bg-slate-50 p-1 border border-app-border shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-content-primary truncate">
                          {item.name} × {item.quantity}
                        </p>
                        <p className="text-[11px] text-content-secondary truncate">
                          {item.variant}
                        </p>
                      </div>
                    </div>
                    <span className="tabular-nums font-semibold text-content-primary shrink-0">
                      {formatPrice(item.landedUnitBdt * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom Confirmation Actions */}
      <div className="sticky bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-app-border px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="h-11 px-4 rounded-xl border border-app-border bg-white hover:bg-app-subtle text-content-primary font-semibold text-xs flex items-center justify-center transition-colors"
        >
          Continue Shopping
        </button>
        <button
          type="button"
          onClick={() =>
            navigateTo('order_tracking', {
              orderId: confirmedOrder?.id || 'DM123456',
            })
          }
          className="h-11 px-4 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Package className="w-4 h-4" />
          <span>Track Order</span>
        </button>
      </div>
    </div>
  );
};
