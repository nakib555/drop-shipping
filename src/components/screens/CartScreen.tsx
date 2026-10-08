import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';

export const CartScreen: React.FC = () => {
  const {
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotals,
    formatPrice,
    navigateTo,
  } = useDeshiMart();

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
      <div className="space-y-3">
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

        {/* Itemized Bag List with AnimatePresence */}
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
      </div>

      {/* Summary & Proceed to Checkout */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Landed Subtotal (Incl. Duty & VAT)</span>
            <span className="font-mono-num font-medium text-slate-900">
              {formatPrice(cartTotals.subtotalBdt)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Doorstep Delivery</span>
            <span className="font-medium text-[#059669]">Free</span>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-sm font-semibold text-slate-900">
            <span>Total Payable</span>
            <span className="font-mono-num text-base font-bold text-slate-900">
              {formatPrice(cartTotals.subtotalBdt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-1">
          <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
          <span>Customs pre-cleared · Zero extra fees at delivery</span>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('checkout_shipping')}
          className="w-full h-11 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};
