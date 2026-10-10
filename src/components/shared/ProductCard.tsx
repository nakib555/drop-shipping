import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Heart, Package, Plus, Star } from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { Product } from '../../types/deshimart';
import { getCanonicalLandedPricing } from '../../utils/pricingEngine';
// Clean production ProductCard — zero Cultural Vibe badges

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
      className="relative bg-white border border-app-border rounded-2xl overflow-hidden flex flex-col justify-between select-none"
    >
      <div className="w-full aspect-square bg-slate-50 animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 rounded-lg bg-slate-200" />
      </div>

      <div className="p-3 space-y-2">
        <div className="h-4 w-4/5 rounded bg-slate-200 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-slate-100 animate-pulse" />
        <div className="pt-2 flex items-center justify-between">
          <div className="h-5 w-20 rounded bg-slate-200 animate-pulse" />
          <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
        </div>
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
  const pricing = getCanonicalLandedPricing(product, selectedRouteByProduct);
  const landedBdt = pricing.estimatedLandedBdt;
  const isBn = language === 'BN';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (justAdded || !product.inStock) return;
    // If product requires explicit size selection, open Product Detail so user selects size
    if (product.sizes && product.sizes.length > 1) {
      navigateTo('product_detail', { productId: product.id });
      return;
    }
    addToCart(product.id, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 750);
  };

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
      className="group relative bg-white border border-app-border rounded-xl overflow-hidden flex flex-col justify-between hover:border-app-borderStrong transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      {/* Clean 1:1 Image Container */}
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden flex items-center justify-center border-b border-app-border">
        {/* Top-Right Wishlist Button (Hidden in compact carousel cards to prevent icon clutter) */}
        {!compact && (
          <motion.button
            type="button"
            whileTap={{ scale: 1.15 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            aria-label={
              isWishlisted
                ? isBn
                  ? `${product.nameBn} উইশলিস্ট থেকে সরান`
                  : `Remove ${product.name} from wishlist`
                : isBn
                ? `${product.nameBn} উইশলিস্টে যোগ করুন`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={isWishlisted}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full backdrop-blur-xs flex items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
              isWishlisted
                ? 'bg-brand-subtle border-brand-border text-brand-primary'
                : 'bg-white/90 border-app-border text-content-secondary hover:text-brand-primary'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-150 ${
                isWishlisted ? 'fill-brand-primary text-brand-primary' : ''
              }`}
            />
          </motion.button>
        )}

        {!imgError ? (
          <>
            {!imgLoaded && (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-200" />
              </div>
            )}
            <img
              src={product.image}
              alt={isBn ? product.nameBn : product.name}
              width={320}
              height={320}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover group-hover:scale-103 transition-all duration-200 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center bg-slate-50 w-full h-full">
            <Package className="w-8 h-8 text-content-muted mb-2" />
            <span className="text-xs leading-4 font-medium text-content-secondary line-clamp-2">
              {isBn ? product.nameBn : product.name}
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className={`${compact ? 'p-2.5' : 'p-3'} flex-1 flex flex-col justify-between`}>
        <div>
          {/* Product Title */}
          <h3 className="line-clamp-2 text-content-primary text-[13px] font-semibold leading-[1.35] tracking-[-0.01em] min-h-[35px]">
            {isBn ? product.nameBn : product.name}
          </h3>

          {/* Stock Status & Rating Row */}
          <div className="mt-1 flex items-center gap-1.5 text-[11px] leading-4 text-content-secondary truncate">
            <span
              className={`font-medium ${
                product.inStock ? 'text-brand-primary' : 'text-promo-accent'
              }`}
            >
              {product.inStock
                ? isBn
                  ? 'স্টকে আছে'
                  : 'In Stock'
                : isBn
                ? 'স্টকে নেই'
                : 'Out of Stock'}
            </span>
            <span aria-hidden="true" className="text-content-muted">
              ·
            </span>
            <span className="inline-flex items-center gap-0.5 tabular-nums text-content-primary font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
              <span>{product.rating.toFixed(1)}</span>
              {!compact && (
                <span className="text-content-muted font-normal">
                  ({product.reviewCount})
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Clean Price & Quick-Add Row */}
        <div className="mt-2 pt-2 border-t border-app-border flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="block tabular-nums text-content-primary font-bold text-[14px] leading-5 tracking-tight">
              {formatPrice(landedBdt)}
            </span>
            {pricing.hasValidDiscount && pricing.discountPercent > 0 && (
              <span className="block tabular-nums text-content-muted text-[11px] leading-3.5 truncate">
                <span className="line-through">{formatPrice(pricing.originalLandedBdt)}</span>
                <span className="text-brand-primary font-medium ml-1">
                  -{pricing.discountPercent}%
                </span>
              </span>
            )}
          </div>

          {!compact && (
            <motion.button
              type="button"
              disabled={!product.inStock}
              whileTap={product.inStock ? { scale: 0.92 } : undefined}
              aria-label={
                !product.inStock
                  ? isBn
                    ? `${product.nameBn} স্টকে নেই`
                    : `${product.name} out of stock`
                  : product.sizes && product.sizes.length > 1
                  ? isBn
                    ? `${product.nameBn} সাইজ নির্বাচন করুন`
                    : `Select options for ${product.name}`
                  : isBn
                  ? `${product.nameBn} কার্টে যোগ করুন`
                  : `Add ${product.name} to cart`
              }
              onClick={handleQuickAdd}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                !product.inStock
                  ? 'bg-app-subtle text-content-muted cursor-not-allowed'
                  : justAdded
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-subtle hover:bg-brand-primary text-brand-primary hover:text-white border border-brand-border'
              }`}
            >
              {justAdded ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Plus className="w-4 h-4 stroke-[2]" />
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
