import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Boxes,
  CheckCircle2,
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
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-white">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4"
        >
          <ShoppingBag className="w-8 h-8" />
        </motion.div>
        <h2 className="text-base font-bold text-slate-900">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
          Explore verified global products with customs duty & VAT included upfront.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="mt-5 px-5 h-10 rounded-xl bg-slate-900 text-white text-xs font-semibold"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between bg-[#F8FAFC]">
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs leading-4 text-slate-500">
            Prices include shipping, 10% duty & 15% VAT
          </span>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs leading-4 font-medium text-slate-500 hover:text-rose-600"
          >
            Clear
          </button>
        </div>

        {/* 1. Smart Global Hub Parcel Consolidation Toggle (Saves 25% on International Freight) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
              <Boxes className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs leading-4 font-semibold text-slate-900">
                  Global Hub Parcel Consolidation
                </h3>
                {consolidateParcel && cartCount >= 2 && (
                  <span className="text-[10px] leading-3.5 font-mono-num font-semibold text-[#059669] bg-emerald-50 px-1.5 py-0.5 rounded">
                    -{formatPrice(cartTotals.consolidationSavingsBdt)}
                  </span>
                )}
              </div>
              <p className="text-[11px] leading-4 text-slate-500 mt-0.5">
                {cartCount >= 2
                  ? 'Combines your items into 1 pre-cleared export box to save 25% on international air freight.'
                  : 'Add 2+ items to combine into 1 export parcel and save 25% on air freight.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={consolidateParcel}
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
              consolidateParcel ? 'bg-[#059669]' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                consolidateParcel ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 2. Itemized Bag List with AnimatePresence */}
        <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
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
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.16 }}
                  className="p-3.5 flex items-center gap-3"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    onClick={() =>
                      navigateTo('product_detail', { productId: prod.id })
                    }
                    className="w-16 h-16 rounded-xl object-contain bg-white p-1.5 border border-slate-100 cursor-pointer shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() =>
                          navigateTo('product_detail', { productId: prod.id })
                        }
                        className="text-xs font-semibold text-slate-900 truncate cursor-pointer"
                      >
                        {prod.name}
                      </h3>
                      <button
                        type="button"
                        aria-label={`Remove ${prod.name}`}
                        onClick={() => removeFromCart(prod.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 -mr-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {item.selectedColor}
                      {item.selectedSize ? ` · EU ${item.selectedSize}` : ''} ·{' '}
                      <span>{route?.name || 'Global Direct'}</span>
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono-num text-sm font-bold text-slate-900">
                        {formatPrice(unitLanded * item.quantity)}
                      </span>

                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-1">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateCartQuantity(prod.id, -1)}
                          className="w-7 h-7 rounded-md bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono-num text-xs font-semibold text-slate-900 min-w-[18px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateCartQuantity(prod.id, 1)}
                          className="w-7 h-7 rounded-md bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-2xs"
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

        {/* 3. Promo / Voucher Code & bKash Cashback Engine */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs leading-4 font-semibold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#059669]" />
              <span>Promo Voucher & MFS Offer</span>
            </span>
            {promoCode && (
              <button
                type="button"
                onClick={removePromoCode}
                className="text-[11px] leading-4 font-medium text-rose-600 flex items-center gap-1"
              >
                <span>Remove {promoCode}</span>
                <X className="w-3 h-3" />
              </button>
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
            <input
              type="text"
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value)}
              placeholder="Enter voucher code (e.g. DESHI10)"
              className="flex-1 h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-4 uppercase text-slate-900 placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
            />
            <button
              type="submit"
              className="h-9 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs leading-4 font-semibold shrink-0 transition-colors"
            >
              Apply
            </button>
          </form>

          {/* One-Tap Quick Apply Voucher Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            {(
              [
                { code: 'DESHI10', desc: '10% Off (Up to ৳1,500)' },
                { code: 'FIRST500', desc: '৳500 Duty Rebate' },
                { code: 'BKASHCB', desc: '5% bKash Cashback' },
              ] as const
            ).map((v) => {
              const active = promoCode === v.code;
              return (
                <button
                  key={v.code}
                  type="button"
                  onClick={() =>
                    active ? removePromoCode() : applyPromoCode(v.code)
                  }
                  className={`h-7 px-2.5 rounded-lg text-[11px] leading-4 font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1 border transition-colors ${
                    active
                      ? 'bg-emerald-50 border-[#059669] text-[#059669]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {active && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                  <span className="font-mono-num font-semibold">{v.code}</span>
                  <span className="text-slate-400">·</span>
                  <span>{v.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Itemized Landed Cost Summary & Proceed to Checkout */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Factory Items Price ({cartCount} items)</span>
            <span className="font-mono-num text-slate-900">
              {formatPrice(cartTotals.baseItemsBdt)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>International Air Freight</span>
            <span className="font-mono-num text-slate-900">
              {formatPrice(cartTotals.freightBdt)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>BD Customs Duty (10%) & VAT (15%)</span>
            <span className="font-mono-num text-slate-900">
              {formatPrice(cartTotals.dutyAndVatBdt)}
            </span>
          </div>

          {cartTotals.consolidationSavingsBdt > 0 && (
            <div className="flex justify-between text-[#059669] font-medium">
              <span>Hub Parcel Consolidation Savings (25%)</span>
              <span className="font-mono-num">
                -{formatPrice(cartTotals.consolidationSavingsBdt)}
              </span>
            </div>
          )}

          {cartTotals.promoDiscountBdt > 0 && (
            <div className="flex justify-between text-[#059669] font-medium">
              <span>Promo Voucher ({promoCode})</span>
              <span className="font-mono-num">
                -{formatPrice(cartTotals.promoDiscountBdt)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-slate-500">
            <span>Local Doorstep Delivery (eCourier)</span>
            <span className="font-medium text-[#059669]">Free</span>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-sm font-semibold text-slate-900">
            <span>Total Landed Payable</span>
            <span className="font-mono-num text-base font-bold text-[#059669]">
              {formatPrice(cartTotals.subtotalBdt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-1">
          <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
          <span>NBR customs pre-cleared · Zero extra fees on arrival</span>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('checkout_shipping')}
          className="w-full h-11 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs transition-colors"
        >
          Proceed to Checkout · {formatPrice(cartTotals.subtotalBdt)}
        </button>
      </div>
    </div>
  );
};
