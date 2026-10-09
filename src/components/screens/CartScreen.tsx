import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Boxes,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
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
    applyPromoCode,
    removePromoCode,
    cartTotals,
    formatPrice,
    navigateTo,
    showToast,
  } = useDeshiMart();

  const [voucherInput, setVoucherInput] = useState('');

  if (cart.length === 0) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-app-bg">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="w-16 h-16 rounded-2xl bg-app-subtle border border-app-border text-content-secondary flex items-center justify-center mb-4"
        >
          <ShoppingBag className="w-8 h-8" />
        </motion.div>
        <h2 className="text-lg leading-6 font-semibold text-content-primary">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs leading-4 text-content-secondary mt-2 max-w-[240px]">
          Explore verified global products with customs duty & VAT included upfront.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="mt-6 px-6 h-12 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between bg-app-bg">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs leading-4 text-content-secondary">
            Prices include shipping, 10% duty & 15% VAT
          </span>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs leading-4 font-medium text-content-muted hover:text-promo-accent transition-colors"
          >
            Clear Bag
          </button>
        </div>

        {/* 1. Smart Global Hub Parcel Consolidation Toggle */}
        <div className="bg-white rounded-xl border border-app-border p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shrink-0">
              <Boxes className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm leading-5 font-semibold text-content-primary">
                  Parcel Consolidation
                </h3>
                {consolidateParcel && cartCount >= 2 && (
                  <span className="text-[11px] leading-4 font-semibold font-mono-num text-brand-primary bg-brand-subtle border border-brand-border px-2 py-0.5 rounded-md">
                    Save {formatPrice(cartTotals.consolidationSavingsBdt)}
                  </span>
                )}
              </div>
              <p className="text-xs leading-4 text-content-secondary mt-1">
                {cartCount >= 2
                  ? 'Combines items into 1 export box for 25% lower air freight.'
                  : 'Add 2+ items to combine into 1 parcel and save 25% on freight.'}
              </p>
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
            className={`w-11 h-6 rounded-full transition-colors p-1 shrink-0 mt-0.5 ${
              consolidateParcel ? 'bg-brand-primary' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                consolidateParcel ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 2. Itemized Bag List with AnimatePresence */}
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
                  key={`${item.productId}-${item.selectedColor}`}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.16 }}
                  className="p-4 flex items-center gap-4"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    onClick={() =>
                      navigateTo('product_detail', { productId: prod.id })
                    }
                    className="w-16 h-16 rounded-lg object-contain bg-slate-50 p-2 border border-app-border cursor-pointer shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() =>
                          navigateTo('product_detail', { productId: prod.id })
                        }
                        className="text-sm leading-6 font-medium text-content-primary truncate cursor-pointer hover:underline"
                      >
                        {prod.name}
                      </h3>
                      <button
                        type="button"
                        aria-label={`Remove ${prod.name}`}
                        onClick={() => removeFromCart(prod.id)}
                        className="w-8 h-8 rounded-lg text-content-muted hover:text-promo-accent flex items-center justify-center -mr-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs leading-4 text-content-secondary mt-1 truncate">
                      {item.selectedColor}
                      {item.selectedSize ? ` · EU ${item.selectedSize}` : ''} ·{' '}
                      <span>{route?.name || 'Global Direct'}</span>
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="tabular-nums text-base leading-6 font-bold text-content-primary">
                        {formatPrice(unitLanded * item.quantity)}
                      </span>

                      <div className="flex items-center gap-2 bg-app-subtle border border-app-border rounded-lg p-1">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateCartQuantity(prod.id, -1)}
                          className="w-8 h-8 rounded-md bg-white text-content-primary hover:bg-slate-50 flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="tabular-nums text-xs leading-4 font-semibold text-content-primary min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateCartQuantity(prod.id, 1)}
                          className="w-8 h-8 rounded-md bg-white text-content-primary hover:bg-slate-50 flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* 3. Single Compact Promo Input Row (DESIGN_SYSTEM_SPEC.md Section 5.3) */}
        <div className="bg-white rounded-xl border border-app-border p-4 space-y-2">
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
              <Tag className="w-4 h-4 text-content-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value)}
                placeholder="Promo code (e.g. DESHI10, FIRST500)"
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-app-subtle border border-app-border text-xs uppercase text-content-primary placeholder:normal-case placeholder:text-content-muted focus:outline-none focus:border-app-borderStrong"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold shrink-0 transition-colors"
            >
              Apply
            </button>
          </form>

          {promoCode && (
            <div className="flex items-center justify-between pt-1 text-xs leading-4">
              <span className="text-content-secondary">
                Applied voucher:{' '}
                <strong className="font-semibold text-brand-primary">
                  {promoCode}
                </strong>
              </span>
              <button
                type="button"
                onClick={removePromoCode}
                className="text-xs leading-4 font-medium text-content-secondary hover:text-content-primary inline-flex items-center gap-1"
              >
                <span>Remove</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Neutral Landed Cost Invoice Card & Primary Checkout CTA */}
      <div className="bg-white border border-app-border rounded-xl p-4 space-y-4">
        <div className="space-y-2 text-xs leading-4">
          <div className="flex justify-between text-content-secondary">
            <span>Factory Items ({cartCount} items)</span>
            <span className="tabular-nums font-medium text-content-primary">
              {formatPrice(cartTotals.baseItemsBdt)}
            </span>
          </div>
          <div className="flex justify-between text-content-secondary">
            <span>International Freight</span>
            <span className="tabular-nums font-medium text-content-primary">
              {formatPrice(cartTotals.freightBdt)}
            </span>
          </div>
          <div className="flex justify-between text-content-secondary">
            <span>Pre-paid Customs & VAT</span>
            <span className="tabular-nums font-medium text-content-primary">
              {formatPrice(cartTotals.dutyAndVatBdt)}
            </span>
          </div>

          {cartTotals.consolidationSavingsBdt > 0 && (
            <div className="flex justify-between text-brand-primary font-medium">
              <span>Parcel Consolidation Savings (25%)</span>
              <span className="tabular-nums font-semibold">
                -{formatPrice(cartTotals.consolidationSavingsBdt)}
              </span>
            </div>
          )}

          {cartTotals.promoDiscountBdt > 0 && (
            <div className="flex justify-between text-brand-primary font-medium">
              <span>Promo Voucher ({promoCode})</span>
              <span className="tabular-nums font-semibold">
                -{formatPrice(cartTotals.promoDiscountBdt)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-content-secondary">
            <span>Local Doorstep Delivery (eCourier)</span>
            <span className="font-medium text-content-primary">Free</span>
          </div>

          <div className="pt-4 border-t border-app-border flex justify-between items-baseline">
            <span className="text-sm leading-6 font-semibold text-content-primary">
              Total Landed Payable
            </span>
            <span className="text-content-primary text-xl leading-6 font-bold tabular-nums">
              {formatPrice(cartTotals.subtotalBdt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] leading-4 text-content-secondary">
          <ShieldCheck className="w-4 h-4 text-status-success shrink-0" />
          <span>NBR customs pre-cleared · Zero extra fees on arrival</span>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('checkout_shipping')}
          className="w-full h-12 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm transition-colors"
        >
          Proceed to Checkout · {formatPrice(cartTotals.subtotalBdt)}
        </button>
      </div>
    </div>
  );
};

