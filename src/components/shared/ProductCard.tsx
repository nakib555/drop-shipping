import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Heart, Package, Plus, Star } from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { Product } from '../../types/deshimart';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

/**
 * 1:1 Structural Ghost Element for Lazy-Loading Product Grids (Zero Layout Shift)
 */
export const ProductCardGhost: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="relative bg-white rounded-2xl border border-[#DFEAE3] p-3 flex flex-col justify-between select-none overflow-hidden"
    >
      {/* Top-Right Wishlist Circle Ghost */}
      <div className="absolute top-5 right-5 z-10 w-7 h-7 rounded-full bg-[#EFF4F1] animate-pulse" />

      <div>
        {/* Square Image Slot Ghost */}
        <div className="w-full aspect-square rounded-xl bg-[#F5F8F6] mb-2.5 border border-[#EAF0EC] animate-pulse flex items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#DFEAE3]" />
        </div>

        {/* Unboxed Metadata Line Ghost (Origin · Delivery · Rating) */}
        <div className="flex items-center gap-1.5 mb-1.5 h-3.5">
          <div className="h-2.5 w-12 rounded-md bg-[#DFEAE3] animate-pulse" />
          <div className="h-2.5 w-8 rounded-md bg-[#EFF4F1] animate-pulse" />
          <div className="h-2.5 w-7 rounded-md bg-[#DFEAE3] animate-pulse" />
        </div>

        {/* Product Title Ghost */}
        <div className="h-3.5 w-4/5 rounded-md bg-[#DFEAE3] animate-pulse" />
      </div>

      {/* Price + Quick-Add Button Footer Ghost */}
      <div className="mt-2.5 pt-2 border-t border-[#EAF0EC] flex items-center justify-between gap-2">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-16 rounded-md bg-[#DFEAE3] animate-pulse" />
            <div className="h-3 w-10 rounded-md bg-[#EFF4F1] animate-pulse" />
          </div>
          <div className="h-2.5 w-14 rounded-md bg-[#EFF4F1] animate-pulse" />
        </div>

        {/* Quick-Add Button Ghost */}
        <div className="w-8 h-8 rounded-lg bg-[#DFEAE3] animate-pulse shrink-0" />
      </div>
    </div>
  );
};

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
  const [imgLoaded, setImgLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const activeRouteId = selectedRouteByProduct[product.id];
  const activeRoute =
    product.routes.find((r) => r.id === activeRouteId) || product.routes[0];
  const landedBdt = activeRoute ? activeRoute.totalLandedBdt : product.totalLandedBdt;
  const corridorLabel =
    product.corridorTag ||
    product.originLabel.replace(/^From\s+/i, '').split('·')[0].trim();

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => navigateTo('product_detail', { productId: product.id })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateTo('product_detail', { productId: product.id });
        }
      }}
      className="group relative bg-white rounded-2xl border border-[#DFEAE3] p-3 flex flex-col justify-between hover:border-[#A7C4B5] transition-colors cursor-pointer text-left"
    >
      {/* Top Wishlist Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 1.25 }}
        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-5 right-5 z-10 w-7 h-7 rounded-full backdrop-blur-xs flex items-center justify-center border transition-colors ${
          isWishlisted
            ? 'bg-[#FFF1F2] border-[#FECDD3] text-[#E11D48]'
            : 'bg-white/90 border-[#DFEAE3] text-[#5C7066] hover:text-[#E11D48]'
        }`}
      >
        <Heart
          className={`w-3.5 h-3.5 transition-transform duration-150 ${
            isWishlisted ? 'fill-[#E11D48] text-[#E11D48]' : ''
          }`}
        />
      </motion.button>

      {/* Clean Product Image Slot with Per-Image Ghost Placeholder */}
      <div>
        <div className="relative w-full aspect-square rounded-xl bg-[#F8FAF9] overflow-hidden mb-2.5 flex items-center justify-center border border-[#EAF0EC]">
          {!imgError ? (
            <>
              {!imgLoaded && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#EFF4F1] animate-pulse flex items-center justify-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#DFEAE3]" />
                </div>
              )}
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover group-hover:scale-103 transition-all duration-200 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center bg-[#F5F8F6] w-full h-full">
              <Package className="w-7 h-7 text-[#74887E] mb-1.5" />
              <span className="text-xs leading-4 font-medium text-[#485B52] line-clamp-2">
                {product.name}
              </span>
            </div>
          )}
        </div>

        {/* Clean Unboxed Metadata Line */}
        <div className="text-[11px] leading-4 text-[#5C7066] truncate mb-1 flex items-center gap-1">
          <span className="truncate text-[#065F46] font-medium">{corridorLabel}</span>
          <span className="text-[#A7C4B5]" aria-hidden="true">·</span>
          <span>{activeRoute?.deliveryDays || '7–12d'}</span>
          {!compact && (
            <>
              <span className="text-[#A7C4B5]" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-0.5 font-mono-num text-[#0F1D17] font-semibold">
                <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B] inline" />
                {product.rating.toFixed(1)}
              </span>
            </>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-xs leading-4 font-semibold text-[#0F1D17] truncate">
          {language === 'BN' ? product.nameBn : product.name}
        </h3>
      </div>

      {/* Price + Restrained Quick-Add Button */}
      <div className="mt-2.5 pt-2 border-t border-[#EAF0EC] flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono-num text-sm leading-5 font-semibold text-[#0F1D17]">
              {formatPrice(landedBdt)}
            </span>
            {product.discountPercent > 0 && (
              <span className="font-mono-num text-[10px] leading-4 text-[#74887E] line-through truncate">
                {formatPrice(product.originalLandedBdt)}
              </span>
            )}
          </div>
          <span className="block text-[10px] leading-3 text-[#059669] font-medium mt-0.5">
            {language === 'BN' ? 'ডিউটি ও ভ্যাটসহ' : 'Incl. duty & VAT'}
          </span>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          aria-label={`Add ${product.name} to cart`}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product.id, 1);
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 750);
          }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
            justAdded
              ? 'bg-[#059669] text-white'
              : 'bg-[#0F1D17] hover:bg-[#059669] text-white'
          }`}
        >
          {justAdded ? (
            <Check className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <Plus className="w-4 h-4 stroke-[2.2]" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
