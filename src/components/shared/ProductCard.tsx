import React, { useState } from 'react';
import { Heart, Package, Plus, Star } from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { Product } from '../../types/deshimart';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const {
    navigateTo,
    addToCart,
    wishlist,
    toggleWishlist,
    formatPrice,
    language,
    selectedRouteByProduct,
  } = useDeshiMart();
  const [imgError, setImgError] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const activeRouteId = selectedRouteByProduct[product.id];
  const activeRoute =
    product.routes.find((r) => r.id === activeRouteId) || product.routes[0];
  const landedBdt = activeRoute ? activeRoute.totalLandedBdt : product.totalLandedBdt;

  // 8pt Grid: p-3 (12px), rounded-2xl (16px), mb-2 (8px), w-8 h-8 (32px) buttons
  return (
    <div
      onClick={() => navigateTo('product_detail', { productId: product.id })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateTo('product_detail', { productId: product.id });
        }
      }}
      className="group relative bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col justify-between shadow-[0_2px_8px_-4px_rgba(11,61,46,0.06)] transition-all duration-150 active:scale-[0.98] hover:border-[#0EA75F]/50 cursor-pointer text-left"
    >
      {/* Top Wishlist Button (32px = 4*8) */}
      <button
        type="button"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-xs border border-slate-100"
      >
        <Heart
          className={`w-4 h-4 ${
            isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
          }`}
        />
      </button>

      {/* Product Image Slot with Zero-Broken-Image Fallback */}
      <div>
        <div className="relative w-full aspect-square rounded-xl bg-[#F8FAFC] overflow-hidden mb-2 flex items-center justify-center border border-slate-100/80">
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#ECFDF5] to-[#F1F5F9] w-full h-full">
              <Package className="w-8 h-8 text-[#0EA75F] mb-2" />
              <span className="text-xs leading-4 font-semibold text-[#0B3D2E] line-clamp-2">
                {product.name}
              </span>
            </div>
          )}

          {/* Top-Left Discount Callout */}
          {product.discountPercent > 0 && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-[#0EA75F] text-white font-mono-num text-[10px] leading-4 font-bold">
              -{product.discountPercent}%
            </div>
          )}

          {/* Bottom-Left DropScore Indicator */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-[#0B3D2E]/90 backdrop-blur-xs text-white text-[10px] leading-4 font-mono-num font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
            <span>{product.dropScore.toFixed(1)}</span>
          </div>
        </div>

        {/* Clean Unboxed Origin & Delivery Metadata */}
        <div className="text-[11px] leading-4 text-[#6B7280] truncate mb-1 flex items-center justify-between gap-1">
          <span className="truncate">{product.originLabel}</span>
          <span className="text-[#0EA75F] font-semibold shrink-0">
            {activeRoute?.deliveryDays || '7–12d'}
          </span>
        </div>

        {/* Product Title (12px / 16px line-height) */}
        <h3 className="text-xs leading-4 font-extrabold text-[#0B3D2E] truncate">
          {language === 'BN' ? product.nameBn : product.name}
        </h3>

        {/* Rating Row */}
        {!compact && (
          <div className="flex items-center gap-1 mt-1 text-[11px] leading-4 text-[#6B7280]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-mono-num font-bold text-[#0B3D2E]">
              {product.rating.toFixed(1)}
            </span>
            <span className="font-mono-num text-[10px] leading-4">
              ({product.reviewCount})
            </span>
          </div>
        )}
      </div>

      {/* Price + Tactile Emerald Quick-Add Button */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="block text-[10px] leading-3 font-semibold text-[#6B7280] mb-1">
            {language === 'BN' ? 'ল্যান্ডেড প্রাইস' : 'Landed Price'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono-num text-sm leading-5 font-extrabold text-[#0EA75F]">
              {formatPrice(landedBdt)}
            </span>
            {product.discountPercent > 0 && (
              <span className="font-mono-num text-[10px] leading-4 text-slate-400 line-through truncate">
                {formatPrice(product.originalLandedBdt)}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product.id, 1);
          }}
          className="w-8 h-8 rounded-xl bg-[#0EA75F] hover:bg-[#0B8A4D] text-white flex items-center justify-center transition-colors shadow-2xs shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
