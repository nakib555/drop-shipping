import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Minus,
  Plane,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';

export const CartScreen: React.FC = () => {
  const {
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    consolidateParcel,
    setConsolidateParcel,
    promoCode,
    promoVouchers,
    applyPromoCode,
    removePromoCode,
    cartTotals,
    formatPrice,
    language,
    navigateTo,
    showToast,
  } = useDeshiMart();

  const [voucherInput, setVoucherInput] = useState('');
  const isBn = language === 'BN';

  const activeVouchers = promoVouchers.filter((v) => v.active);
  const totalSavingsBdt =
    cartTotals.consolidationSavingsBdt + cartTotals.promoDiscountBdt;

  if (cart.length === 0) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-app-bg">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.18 }}
          className="w-16 h-16 rounded-2xl bg-brand-subtle border border-brand-border text-brand-primary flex items-center justify-center mb-4"
        >
          <ShoppingBag className="w-7 h-7 stroke-[2]" />
        </motion.div>
        <h2 className="text-base font-bold tracking-tight text-content-primary">
          {isBn ? 'আপনার শপিং ব্যাগ খালি' : 'Your Shopping Bag is Empty'}
        </h2>
        <p className="text-xs leading-5 text-content-secondary mt-1.5 max-w-[250px]">
          {isBn
            ? 'কাস্টমস ডিউটি ও ১৫% ভ্যাট অন্তর্ভুক্ত গ্লোবাল পণ্যগুলো ঘুরে দেখুন।'
            : 'Explore verified global products with 10% customs duty & 15% VAT pre-cleared upfront.'}
        </p>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="mt-5 px-6 min-h-[44px] rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <span>{isBn ? 'ক্যাটালগ দেখুন' : 'Explore Global Catalog'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between bg-app-bg">
      <div className="space-y-3.5">
        {/* 1. Top Typographic Meta Header */}
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5 text-xs text-content-secondary min-w-0">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span className="truncate">
              {isBn
                ? `${cartCount}টি পণ্য · শুল্ক ও ভ্যাট অন্তর্ভুক্ত`
                : `${cartCount} ${cartCount === 1 ? 'item' : 'items'} · Duty & 15% VAT included`}
            </span>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-content-secondary hover:text-promo-accent transition-colors shrink-0 ml-2"
          >
            {isBn ? 'ব্যাগ খালি করুন' : 'Clear Bag'}
          </button>
        </div>

        {/* 2. Smart Global Hub Parcel Consolidation Surface */}
        <div
          className={`rounded-2xl border p-4 transition-colors ${
            consolidateParcel && cartCount >= 2
              ? 'bg-brand-subtle/70 border-brand-border'
              : 'bg-white border-app-border'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  consolidateParcel && cartCount >= 2
                    ? 'bg-brand-primary text-white'
                    : 'bg-app-subtle text-content-primary'
                }`}
              >
                <Boxes className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-bold tracking-tight text-content-primary">
                    {isBn
                      ? 'গ্লোবাল হাব পার্সেল কনসলিডেশন'
                      : 'Global Hub Parcel Consolidation'}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-content-secondary mt-1">
                  {cartCount >= 2
                    ? isBn
                      ? 'সব পণ্য ১টি এক্সপোর্ট বক্সে একত্রিত করে এয়ার ফ্রেইটে ২৫% সাশ্রয় করুন।'
                      : 'Combines all items into 1 master export box for 25% international air-freight savings.'
                    : isBn
                    ? 'এয়ার ফ্রেইটে ২৫% সাশ্রয় করতে ২ বা ততোধিক পণ্য যোগ করুন।'
                    : 'Add 2+ items to combine into 1 master parcel and save 25% on air freight.'}
                </p>
                {consolidateParcel && cartCount >= 2 && (
                  <p className="text-xs font-semibold text-brand-primary mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isBn ? 'ফ্রেইট সাশ্রয়:' : 'Active freight savings:'}{' '}
                      <span className="font-mono-num font-bold">
                        -{formatPrice(cartTotals.consolidationSavingsBdt)}
                      </span>
                    </span>
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={consolidateParcel}
              aria-label="Toggle Global Hub Parcel Consolidation"
              onClick={() => {
                const next = !consolidateParcel;
                setConsolidateParcel(next);
                showToast(
                  next
                    ? 'Parcel Consolidation enabled (25% freight savings)'
                    : 'Items will ship in separate parcels',
                  'info'
                );
              }}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 mt-1 ${
                consolidateParcel ? 'bg-brand-primary' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  consolidateParcel ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 3. Itemized Bag Ledger (Single-Elevation Surface with Hairline Dividers) */}
        <div className="bg-white rounded-2xl border border-app-border divide-y divide-app-border overflow-hidden">
          <AnimatePresence initial={false}>
            {cart.map((item) => {
              const prod = products.find((p) => p.id === item.productId);
              if (!prod) return null;
              const route =
                prod.routes.find((r) => r.id === item.selectedRouteId) ||
                prod.routes[0];
              const unitBase = route ? route.basePriceBdt : prod.productPriceBdt;
              const unitFreight = route ? route.shippingBdt : prod.shippingBdt;
              const unitDutyVat = route
                ? route.dutyBdt + route.vatBdt
                : prod.importDutyBdt + prod.vatBdt;
              const unitLanded = route ? route.totalLandedBdt : prod.totalLandedBdt;
              const lineTotalBdt = unitLanded * item.quantity;

              return (
                <motion.div
                  key={`${item.productId}-${item.selectedColor}`}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.16 }}
                  className="p-4 flex items-start gap-3.5"
                >
                  {/* Product Thumbnail Frame */}
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo('product_detail', { productId: prod.id })
                    }
                    className="w-[72px] h-[72px] rounded-xl bg-app-subtle border border-app-border p-1.5 shrink-0 flex items-center justify-center overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </button>

                  {/* Typographic Hierarchy Column */}
                  <div className="flex-1 min-w-0">
                    {/* Kicker: Origin Hub · Route · Delivery SLA */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] leading-4 font-medium text-brand-primary truncate">
                        {prod.originLabel} · {route?.name || 'Direct Air'} ·{' '}
                        <span className="font-mono-num">
                          {route?.deliveryDays || '5–8d'}
                        </span>
                      </p>

                      <button
                        type="button"
                        aria-label={`Remove ${prod.name}`}
                        onClick={() => removeFromCart(prod.id)}
                        className="text-content-muted hover:text-promo-accent p-1 -mr-1 -mt-0.5 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Product Title */}
                    <h3
                      onClick={() =>
                        navigateTo('product_detail', { productId: prod.id })
                      }
                      className="text-sm leading-5 font-bold tracking-tight text-content-primary truncate cursor-pointer hover:underline mt-0.5"
                    >
                      {isBn ? prod.nameBn : prod.name}
                    </h3>

                    {/* Variant & Per-Unit Landed Breakdown */}
                    <p className="text-xs leading-4 text-content-secondary truncate mt-0.5">
                      {item.selectedColor}
                      {item.selectedSize ? ` · Size ${item.selectedSize}` : ''} ·{' '}
                      <span className="font-mono-num">
                        {formatPrice(unitBase)}
                      </span>{' '}
                      base +{' '}
                      <span className="font-mono-num">
                        {formatPrice(unitFreight + unitDutyVat)}
                      </span>{' '}
                      freight & tax
                    </p>

                    {/* Price & Ergonomic Stepper Row */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-app-border/70">
                      <div>
                        <span className="font-mono-num text-base leading-5 font-bold text-content-primary block">
                          {formatPrice(lineTotalBdt)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="font-mono-num text-[11px] leading-4 text-content-secondary">
                            {item.quantity} × {formatPrice(unitLanded)} landed
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 bg-app-subtle border border-app-border rounded-xl p-1 shrink-0">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateCartQuantity(prod.id, -1)}
                          className="w-8 h-8 rounded-lg bg-white text-content-primary hover:bg-slate-50 active:scale-95 flex items-center justify-center transition-all border border-app-border/60"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono-num text-xs font-bold text-content-primary min-w-[26px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateCartQuantity(prod.id, 1)}
                          className="w-8 h-8 rounded-lg bg-white text-content-primary hover:bg-slate-50 active:scale-95 flex items-center justify-center transition-all border border-app-border/60"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* 4. Promo & Customs Voucher Module with One-Tap Voucher Selector */}
        <div className="bg-white rounded-2xl border border-app-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-content-primary">
              {isBn ? 'প্রোমো ও কাস্টমস ভাউচার' : 'Promo & Customs Vouchers'}
            </span>
            {promoCode ? (
              <span className="text-xs font-semibold text-status-success flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-mono-num">{promoCode}</span> Applied
              </span>
            ) : (
              <span className="text-xs text-content-secondary">
                {isBn ? 'ট্যাপ করে প্রয়োগ করুন' : 'Tap a code or enter below'}
              </span>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (applyPromoCode(voucherInput)) {
                setVoucherInput('');
              }
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 text-content-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                placeholder={
                  isBn ? 'প্রোমো কোড লিখুন...' : 'Enter voucher code (e.g. DESHI10)'
                }
                className="w-full h-10 pl-8 pr-3 rounded-xl bg-app-subtle border border-app-border font-mono-num text-xs font-semibold uppercase text-content-primary placeholder:font-sans placeholder:normal-case placeholder:font-normal placeholder:text-content-muted focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold shrink-0 transition-colors whitespace-nowrap"
            >
              {isBn ? 'প্রয়োগ' : 'Apply'}
            </button>
          </form>

          {/* One-Tap Interactive Voucher Strip */}
          {activeVouchers.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
              {activeVouchers.map((v) => {
                const isSelected =
                  promoCode?.toUpperCase() === v.code.toUpperCase();
                return (
                  <button
                    key={v.code}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        removePromoCode();
                      } else {
                        applyPromoCode(v.code);
                      }
                    }}
                    className={`min-h-[34px] px-3 rounded-lg border text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors whitespace-nowrap ${
                      isSelected
                        ? 'bg-brand-subtle border-brand-border text-brand-primary font-semibold'
                        : 'bg-app-subtle border-app-border text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    <span className="font-mono-num font-bold text-content-primary">
                      {v.code}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {v.discountType === 'percent'
                        ? `${v.value}% Off`
                        : `৳ ${v.value} Off`}
                    </span>
                    {isSelected && <X className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 5. Structured Cross-Border Landed Cost Ledger & Primary Checkout Action */}
      <div className="bg-white border border-app-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 bg-app-subtle/70 border-b border-app-border flex items-center justify-between">
          <span className="text-xs font-bold text-content-primary">
            {isBn
              ? 'ল্যান্ডেড প্রাইস ও কাস্টমস ইনভয়েস'
              : 'Landed Cost & Customs Summary'}
          </span>
          <span className="font-mono-num text-xs text-content-secondary">
            HS-Code Pre-Cleared
          </span>
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-baseline text-content-secondary">
              <span>
                {isBn
                  ? `ফ্যাক্টরি মূল্য (${cartCount}টি পণ্য)`
                  : `Factory Base Subtotal (${cartCount} ${
                      cartCount === 1 ? 'item' : 'items'
                    })`}
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
                  ? 'কাস্টমস ডিউটি (১০%) ও ভ্যাট (১৫%)'
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
                    ? `প্রোমো ভাউচার ছাড় (${promoCode})`
                    : `Promo Voucher Discount (${promoCode})`}
                </span>
                <span className="font-mono-num font-semibold">
                  -{formatPrice(cartTotals.promoDiscountBdt)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-baseline text-content-secondary">
              <span>
                {isBn
                  ? 'লোকাল ডোরস্টেপ কুরিয়ার (eCourier)'
                  : 'Local Doorstep Delivery (eCourier)'}
              </span>
              <span className="font-semibold text-status-success">
                {isBn ? 'ফ্রি' : 'Complimentary'}
              </span>
            </div>

            <div className="pt-3 border-t border-app-border flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-content-primary block">
                  {isBn ? 'সর্বমোট ল্যান্ডেড মূল্য' : 'Total Landed Payable'}
                </span>
                <span className="text-[11px] text-content-secondary">
                  {isBn
                    ? 'ডেলিভারির সময় আর কোনো অতিরিক্ত চার্জ নেই'
                    : '100% customs cleared · Zero extra fees on delivery'}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono-num text-xl font-bold text-brand-primary block">
                  {formatPrice(cartTotals.subtotalBdt)}
                </span>
                {totalSavingsBdt > 0 && (
                  <span className="font-mono-num text-[11px] font-semibold text-status-success">
                    {isBn ? 'মোট সাশ্রয়' : 'You save'}{' '}
                    {formatPrice(totalSavingsBdt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('checkout_shipping')}
            className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-hover active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-between px-4 transition-all"
          >
            <span>
              {isBn ? 'চেকআউট নিশ্চিত করুন' : 'Proceed to Secure Checkout'}
            </span>
            <span className="flex items-center gap-1.5 font-mono-num font-bold">
              <span>{formatPrice(cartTotals.subtotalBdt)}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
