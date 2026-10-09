import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  Boxes,
  Check,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { CATEGORIES } from '../../data/catalogData';
import {
  CheckoutPriceBreakdown,
  CheckoutStickyFooter,
} from '../checkout/CheckoutSharedModules';

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
    applyPromoCode,
    removePromoCode,
    promoVouchers,
    cartTotals,
    formatPrice,
    navigateTo,
    setSelectedCategoryId,
    showToast,
    language,
  } = useDeshiMart();

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherState, setVoucherState] = useState<
    'idle' | 'applying' | 'applied' | 'error'
  >('idle');
  const [voucherErrorMsg, setVoucherErrorMsg] = useState<string | null>(null);

  const isBn = language === 'BN';

  if (cart.length === 0) {
    const popularProducts = products
      .filter((p) => p.inStock && p.totalLandedBdt > 0)
      .slice(0, 4);

    return (
      <div className="flex-1 flex flex-col justify-between bg-[#F9FAFB] text-[#111827] pb-6">
        <div>
          {/* B. Empty Cart State (Compact 8pt-grid hierarchy, keeps primary CTA above the fold) */}
          <section
            aria-labelledby="empty-cart-heading"
            className="px-4 pt-6 pb-6 flex flex-col items-center text-center border-b border-slate-200/80 bg-white"
          >
            {/* Tasteful, minimal 2D shopping-bag illustration */}
            <div
              aria-hidden="true"
              className="w-16 h-16 rounded-2xl bg-[#ECFDF5]/70 border border-[#A7F3D0]/70 flex items-center justify-center mb-4 shadow-2xs"
            >
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9"
              >
                {/* Soft inner bag depth */}
                <path
                  d="M16 23C16 20.7909 17.7909 19 20 19H44C46.2091 19 48 20.7909 48 23L50 49C50.1844 51.3976 48.2903 53.44 45.8856 53.44H18.1144C15.7097 53.44 13.8156 51.3976 14 49L16 23Z"
                  fill="#D1FAE5"
                  fillOpacity="0.55"
                />
                {/* Bag body outline */}
                <path
                  d="M15.5 23.5C15.68 21.1 17.68 19.25 20.09 19.25H43.91C46.32 19.25 48.32 21.1 48.5 23.5L50.35 48.2C50.56 50.98 48.36 53.35 45.57 53.35H18.43C15.64 53.35 13.44 50.98 13.65 48.2L15.5 23.5Z"
                  stroke="#065F46"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Bag handles */}
                <path
                  d="M24 24V17C24 12.5817 27.5817 9 32 9C36.4183 9 40 12.5817 40 17V24"
                  stroke="#065F46"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Minimal resting detail crease */}
                <path
                  d="M25 36.5C27.2 38.3 30 39.2 32 39.2C34 39.2 36.8 38.3 39 36.5"
                  stroke="#047857"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Handle grommet dots */}
                <circle cx="24" cy="24.5" r="1.4" fill="#065F46" />
                <circle cx="40" cy="24.5" r="1.4" fill="#065F46" />
              </svg>
            </div>

            <h2
              id="empty-cart-heading"
              className="text-lg font-bold tracking-tight text-[#111827]"
            >
              {isBn
                ? 'আপনার কার্ট এখন খালি।'
                : 'Your cart is taking a break.'}
            </h2>

            <p className="text-xs text-[#4B5563] mt-1.5 max-w-[264px] leading-relaxed">
              {isBn
                ? 'আপনি এখনো কিছু যোগ করেননি। আপনার পছন্দের পণ্যগুলো খুঁজে নিন।'
                : "You haven't added anything yet. Discover products you'll love."}
            </p>

            {/* Primary CTA & Secondary Text Action */}
            <div className="w-full max-w-[264px] mt-5 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="w-full min-h-[46px] px-5 rounded-xl bg-brand-primary hover:bg-brand-hover active:scale-[0.99] text-white text-xs font-semibold tracking-tight flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                <span>{isBn ? 'পণ্য খুঁজুন' : 'Explore Products'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>

              <button
                type="button"
                onClick={() => navigateTo('categories')}
                className="min-h-[44px] px-4 rounded-lg text-xs font-semibold text-[#374151] hover:text-brand-primary hover:bg-slate-100/80 active:scale-[0.99] inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {isBn ? 'ক্যাটাগরি ব্রাউজ করুন' : 'Browse Categories'}
              </button>
            </div>
          </section>

          {/* C. Product Discovery Section ("Popular right now") */}
          <section
            aria-labelledby="popular-discovery-heading"
            className="px-4 pt-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                id="popular-discovery-heading"
                className="text-sm font-bold tracking-tight text-[#111827]"
              >
                {isBn ? 'এখন জনপ্রিয়' : 'Popular right now'}
              </h3>
              <button
                type="button"
                onClick={() => navigateTo('categories')}
                className="min-h-[36px] px-1.5 -mr-1.5 text-xs font-semibold text-brand-primary hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
              >
                <span>{isBn ? 'সব দেখুন' : 'See all'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {popularProducts.length >= 2 ? (
              <div className="grid grid-cols-2 gap-3">
                {popularProducts.map((product) => (
                  <article
                    key={product.id}
                    onClick={() =>
                      navigateTo('product_detail', { productId: product.id })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigateTo('product_detail', { productId: product.id });
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${
                      isBn && product.nameBn ? product.nameBn : product.name
                    }, ${formatPrice(product.totalLandedBdt)}`}
                    className="group bg-white rounded-xl border border-slate-200/90 hover:border-brand-border overflow-hidden flex flex-col justify-between text-left cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    <div>
                      {/* Consistent 4:3 product image container with clean background */}
                      <div className="aspect-[4/3] w-full bg-slate-50/90 border-b border-slate-100 p-3 flex items-center justify-center overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      <div className="p-2.5 pb-1.5">
                        <h4 className="text-xs font-semibold text-[#111827] line-clamp-1 leading-snug">
                          {isBn && product.nameBn ? product.nameBn : product.name}
                        </h4>

                        <div className="mt-1 flex items-center justify-between gap-1">
                          <span className="tabular-nums text-xs font-bold text-[#111827]">
                            {formatPrice(product.totalLandedBdt)}
                          </span>

                          {product.verifiedSupplier && product.rating > 0 && (
                            <span
                              aria-label={`Rated ${product.rating} out of 5`}
                              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#4B5563] tabular-nums shrink-0"
                            >
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{product.rating.toFixed(1)}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Subtle "View product" action row */}
                    <div className="px-2.5 pb-2.5 pt-1 flex items-center justify-between text-[11px] font-semibold text-brand-primary">
                      <span>{isBn ? 'পণ্য দেখুন' : 'View product'}</span>
                      <ArrowRight className="w-3 h-3 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Fallback: Category shortcuts when suitable product recommendations are unavailable */
              <div className="grid grid-cols-2 gap-2.5">
                {CATEGORIES.slice(0, 4).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      navigateTo('category_products', { categoryId: cat.id });
                    }}
                    className="min-h-[48px] p-3 rounded-xl bg-white border border-slate-200/90 hover:border-brand-border text-left flex items-center justify-between gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-[#111827] block truncate">
                        {isBn ? cat.nameBn : cat.name}
                      </span>
                      <span className="text-[11px] text-[#6B7280] block truncate">
                        {cat.deliveryRange}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = voucherInput.trim().toUpperCase();
    if (!trimmed) {
      setVoucherState('error');
      setVoucherErrorMsg('Please enter a valid promo code.');
      return;
    }

    setVoucherState('applying');
    setVoucherErrorMsg(null);

    setTimeout(() => {
      const ok = applyPromoCode(trimmed);
      if (ok) {
        setVoucherInput('');
        setVoucherState('applied');
      } else {
        setVoucherState('error');
        const activeCodes = promoVouchers
          .filter((v) => v.active)
          .map((v) => v.code)
          .join(', ');
        setVoucherErrorMsg(
          `Code "${trimmed}" is invalid. Try ${activeCodes || 'DESHI10'}.`
        );
      }
    }, 240);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-app-bg">
      <div className="p-4 space-y-4 pb-6">
        {/* Top Summary & Clear Cart Action */}
        <div className="flex items-center justify-between px-0.5">
          <span className="text-xs font-medium text-content-secondary">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} · Customs & VAT pre-calculated
          </span>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-medium text-content-muted hover:text-promo-accent transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* 1. Itemized Cart List (Product-First Hierarchy) */}
        <div className="bg-white rounded-xl border border-app-border divide-y divide-app-border overflow-hidden">
          <AnimatePresence initial={false}>
            {cart.map((item) => {
              const prod = products.find((p) => p.id === item.productId);
              if (!prod) return null;
              const route =
                prod.routes.find((r) => r.id === item.selectedRouteId) ||
                prod.routes[0];
              const unitLanded = route ? route.totalLandedBdt : prod.totalLandedBdt;

              return (
                <motion.div
                  key={`${item.productId}-${item.selectedColor}-${item.selectedSize || ''}`}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="p-3.5 flex items-start gap-3"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    onClick={() =>
                      navigateTo('product_detail', { productId: prod.id })
                    }
                    className="w-16 h-16 rounded-lg object-contain bg-slate-50 p-1.5 border border-app-border cursor-pointer shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() =>
                          navigateTo('product_detail', { productId: prod.id })
                        }
                        className="text-xs font-semibold text-content-primary line-clamp-2 cursor-pointer hover:underline leading-snug"
                      >
                        {prod.name}
                      </h3>
                      <button
                        type="button"
                        aria-label={`Remove ${prod.name}`}
                        onClick={() => removeFromCart(prod.id)}
                        className="w-7 h-7 rounded-lg text-content-muted hover:text-promo-accent flex items-center justify-center -mr-1 -mt-0.5 shrink-0 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-content-secondary mt-0.5 truncate">
                      {item.selectedColor}
                      {item.selectedSize ? ` · ${item.selectedSize}` : ''} ·{' '}
                      <span>{route?.name || 'Direct Air'}</span>
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      <div>
                        <span className="tabular-nums text-sm font-bold text-content-primary block leading-tight">
                          {formatPrice(unitLanded * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="tabular-nums text-[10px] text-content-muted">
                            {formatPrice(unitLanded)} each
                          </span>
                        )}
                      </div>

                      {/* Accessible Mobile Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-app-bg border border-app-border rounded-xl p-1">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${prod.name}`}
                          onClick={() => updateCartQuantity(prod.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white text-content-primary hover:bg-slate-100 active:scale-95 flex items-center justify-center transition-all shadow-2xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="tabular-nums text-xs font-semibold text-content-primary min-w-[22px] text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${prod.name}`}
                          onClick={() => updateCartQuantity(prod.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white text-content-primary hover:bg-slate-100 active:scale-95 flex items-center justify-center transition-all shadow-2xs"
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

        {/* 2. Selective Bento Module (10–20% Secondary Logistics & Parcel Consolidation) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Bento Tile 1: Combined Parcel Freight Savings */}
          <button
            type="button"
            role="switch"
            aria-checked={consolidateParcel}
            onClick={() => {
              const next = !consolidateParcel;
              setConsolidateParcel(next);
              showToast(
                next
                  ? 'Combined Parcel enabled (25% air freight savings)'
                  : 'Items will ship in individual parcels',
                'info'
              );
            }}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1.5 transition-colors ${
              consolidateParcel
                ? 'bg-brand-subtle/50 border-brand-border'
                : 'bg-white border-app-border'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-content-secondary">
                <Boxes className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span>Combine Box</span>
              </span>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  consolidateParcel
                    ? 'bg-brand-primary text-white'
                    : 'bg-app-subtle text-content-muted'
                }`}
              >
                {consolidateParcel ? 'ON' : 'OFF'}
              </span>
            </div>
            <div className="text-xs font-semibold text-content-primary truncate">
              {cartCount >= 2 && consolidateParcel
                ? `Save ${formatPrice(cartTotals.consolidationSavingsBdt)}`
                : '25% off 2+ items'}
            </div>
          </button>

          {/* Bento Tile 2: Pre-Cleared Bangladesh Customs Guarantee */}
          <div className="p-3 rounded-xl bg-white border border-app-border flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between w-full text-content-secondary">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                <Truck className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span>BD Customs</span>
              </span>
              <span className="text-[10px] font-medium text-brand-primary">
                Included
              </span>
            </div>
            <div className="text-xs font-semibold text-content-primary truncate">
              Zero fee on arrival
            </div>
          </div>
        </div>

        {/* 3. Promo Voucher Input with Validation, Loading & Applied States */}
        <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-2.5">
          <form onSubmit={handleApplyPromo} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={voucherInput}
                onChange={(e) => {
                  setVoucherInput(e.target.value);
                  if (voucherState === 'error') {
                    setVoucherState('idle');
                    setVoucherErrorMsg(null);
                  }
                }}
                placeholder="Promo code (DESHI10, FIRST500)"
                aria-label="Promo code"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-app-bg border border-app-border text-xs uppercase text-content-primary placeholder:normal-case placeholder:text-content-muted focus:outline-none focus:border-brand-primary"
              />
            </div>
            <button
              type="submit"
              disabled={voucherState === 'applying'}
              className="h-10 px-4 rounded-lg bg-brand-primary hover:bg-brand-hover disabled:bg-slate-300 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors"
            >
              {voucherState === 'applying' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking</span>
                </>
              ) : (
                <span>Apply</span>
              )}
            </button>
          </form>

          {/* Quick-Tap Available Vouchers */}
          {!promoCode && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
              {promoVouchers
                .filter((v) => v.active)
                .map((v) => (
                  <button
                    key={v.code}
                    type="button"
                    onClick={() => {
                      setVoucherInput(v.code);
                      setVoucherErrorMsg(null);
                      applyPromoCode(v.code);
                      setVoucherState('applied');
                    }}
                    className="h-6 px-2 rounded-md bg-app-bg hover:bg-brand-subtle border border-app-border hover:border-brand-border text-[10px] font-mono-num font-semibold text-content-secondary hover:text-brand-primary whitespace-nowrap transition-colors"
                  >
                    Tap: {v.code}
                  </button>
                ))}
            </div>
          )}

          {voucherErrorMsg && (
            <div
              role="alert"
              className="flex items-center gap-1.5 text-[11px] text-red-600 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{voucherErrorMsg}</span>
            </div>
          )}

          {promoCode && (
            <div className="flex items-center justify-between pt-1 border-t border-app-border/70 text-xs">
              <span className="inline-flex items-center gap-1.5 text-brand-primary font-semibold">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>
                  {promoCode} applied (-{formatPrice(cartTotals.promoDiscountBdt)})
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  removePromoCode();
                  setVoucherState('idle');
                }}
                className="text-xs font-medium text-content-secondary hover:text-content-primary inline-flex items-center gap-1"
              >
                <span>Remove</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 4. Complete Landed Price Breakdown */}
        <CheckoutPriceBreakdown
          itemCount={cartCount}
          baseItemsBdt={cartTotals.baseItemsBdt}
          freightBdt={cartTotals.freightBdt}
          dutyAndVatBdt={cartTotals.dutyAndVatBdt}
          consolidationSavingsBdt={cartTotals.consolidationSavingsBdt}
          promoCode={promoCode}
          promoDiscountBdt={cartTotals.promoDiscountBdt}
          shippingBdt={cartTotals.shippingBdt}
          shippingLabel="Doorstep Delivery (Selected at Checkout)"
          totalBdt={cartTotals.subtotalBdt}
          formatPrice={formatPrice}
        />
      </div>

      {/* 5. Sticky Bottom Checkout Bar */}
      <CheckoutStickyFooter
        totalLabel={`Cart Total (${cartCount} ${cartCount === 1 ? 'item' : 'items'})`}
        totalFormatted={formatPrice(cartTotals.subtotalBdt)}
        subLabel="Customs duty & 15% VAT pre-cleared"
        primaryLabel="Proceed to Checkout"
        onPrimaryClick={() => navigateTo('checkout_shipping')}
      />
    </div>
  );
};
