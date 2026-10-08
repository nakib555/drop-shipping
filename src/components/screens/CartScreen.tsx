import React from 'react';
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
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-base font-extrabold text-[#0B3D2E]">
          Your Cart is Empty
        </h2>
        <p className="text-xs text-[#6B7280] mt-1 max-w-[240px]">
          Explore verified global products with customs duty & VAT included upfront.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="mt-5 px-6 h-11 rounded-xl bg-[#0EA75F] text-white text-xs font-bold shadow-md"
        >
          Start Exploring
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-6 flex-1 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs leading-4 font-semibold text-[#6B7280]">
            All prices include shipping, duty & VAT
          </span>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs leading-4 font-bold text-rose-600 hover:underline"
          >
            Clear All
          </button>
        </div>

        {/* Itemized Cart Cards (Matching Screen 11 / 15 in UI Kits) */}
        <div className="space-y-2">
          {cart.map((item) => {
            const prod = products.find((p) => p.id === item.productId);
            if (!prod) return null;
            const route =
              prod.routes.find((r) => r.id === item.selectedRouteId) ||
              prod.routes[0];
            const unitLanded = route ? route.totalLandedBdt : prod.totalLandedBdt;

            return (
              <div
                key={`${item.productId}-${item.selectedColor}`}
                className="bg-white rounded-2xl border border-slate-200/80 p-3 flex items-center gap-3"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  onClick={() =>
                    navigateTo('product_detail', { productId: prod.id })
                  }
                  className="w-16 h-16 rounded-xl object-cover bg-[#F8FAFC] border border-slate-100 cursor-pointer shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() =>
                        navigateTo('product_detail', { productId: prod.id })
                      }
                      className="text-xs font-extrabold text-[#0B3D2E] truncate cursor-pointer"
                    >
                      {prod.name}
                    </h3>
                    <button
                      type="button"
                      aria-label={`Remove ${prod.name}`}
                      onClick={() => removeFromCart(prod.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 -mr-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#6B7280] mt-0.5">
                    {item.selectedColor}
                    {item.selectedSize ? ` · Size ${item.selectedSize}` : ''} ·{' '}
                    <span className="text-[#0EA75F] font-semibold">In Stock</span>
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono-num text-sm font-extrabold text-[#0EA75F]">
                      {formatPrice(unitLanded * item.quantity)}
                    </span>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 rounded-xl px-1.5 py-1">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateCartQuantity(prod.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white text-[#0B3D2E] flex items-center justify-center shadow-2xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono-num text-xs font-bold text-[#0B3D2E] min-w-[16px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateCartQuantity(prod.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white text-[#0B3D2E] flex items-center justify-center shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary & Proceed to Checkout */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-[#6B7280]">
            <span>Landed Subtotal (Duty & VAT Included)</span>
            <span className="font-mono-num font-bold text-[#0B3D2E]">
              {formatPrice(cartTotals.subtotalBdt)}
            </span>
          </div>
          <div className="flex justify-between text-[#6B7280]">
            <span>Standard Doorstep Delivery</span>
            <span className="font-bold text-[#0EA75F]">Free</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-extrabold text-[#0B3D2E]">
            <span>Total Landed Amount</span>
            <span className="font-mono-num text-base text-[#0EA75F]">
              {formatPrice(cartTotals.subtotalBdt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] bg-[#ECFDF5] px-3 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-[#0EA75F] shrink-0" />
          <span>Guaranteed zero customs fee at delivery</span>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('checkout_shipping')}
          className="w-full h-12 rounded-xl bg-[#0EA75F] hover:bg-[#0B8A4D] text-white font-bold text-sm shadow-md transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};
