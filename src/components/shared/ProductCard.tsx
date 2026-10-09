import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Heart, Package, Plus } from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { Product } from '../../types/deshimart';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

function getOriginFlagAndName(originLabel: string): string {
  const lower = originLabel.toLowerCase();
  if (lower.includes('china') || lower.includes('shenzhen') || lower.includes('yiwu')) {
    return '🇨🇳 China';
  }
  if (lower.includes('singapore')) return '🇸🇬 Singapore';
  if (lower.includes('vietnam')) return '🇻🇳 Vietnam';
  if (lower.includes('japan') || lower.includes('tokyo')) return '🇯🇵 Japan';
  if (lower.includes('malaysia') || lower.includes('kuala')) return '🇲🇾 Malaysia';
  if (lower.includes('korea') || lower.includes('seoul')) return '🇰🇷 Korea';
  if (lower.includes('usa') || lower.includes('states')) return '🇺🇸 USA';
  if (lower.includes('bangladesh') || lower.includes('dhaka')) return '🇧🇩 Local';
  const cleaned = originLabel.replace(/^From\s+/i, '').split('·')[0].trim();
  return `🌏 ${cleaned || 'Global'}`;
}

/**
 * 1:1 Structural Ghost Element for Lazy-Loading Product Grids (Zero Layout Shift)
 */
export const ProductCardGhost: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="relative bg-white border border-app-border rounded-xl overflow-hidden flex flex-col justify-between select-none"
    >
      <div className="w-full aspect-square bg-slate-50 animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 rounded-lg bg-slate-200" />
      </div>

      <div className="p-3 space-y-2">
        <div className="h-4 w-4/5 rounded bg-slate-200 animate-pulse" />
        <div className="h-4 w-3/5 rounded bg-slate-100 animate-pulse" />
        <div className="pt-1 flex items-center justify-between">
          <div className="h-6 w-20 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-10 rounded bg-slate-100 animate-pulse" />
        </div>
        <div className="h-4 w-28 rounded bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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
  const deliveryWindow = (activeRoute?.deliveryDays || '7–12 days').replace(/\s*days/i, 'd');
  const originChipText = `${getOriginFlagAndName(product.originLabel)} · ${deliveryWindow}`;

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
      className="group relative bg-white border border-app-border rounded-xl overflow-hidden flex flex-col justify-between hover:border-app-borderStrong transition-colors cursor-pointer text-left"
    >
      {/* 1:1 Image Container (bg-slate-50) with Max 1 Top-Left Origin Pill */}
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden flex items-center justify-center border-b border-app-border">
        {/* Single Top-Left Origin Overlay Pill per DESIGN_SYSTEM_SPEC.md */}
        <span className="absolute top-2 left-2 z-10 bg-slate-900/70 text-white backdrop-blur-sm text-[11px] leading-4 font-medium px-2 py-1 rounded-full">
          {originChipText}
        </span>

        {/* Top-Right Wishlist Button (32x32 4x8pt box at 8px offset) */}
        <motion.button
          type="button"
          whileTap={{ scale: 1.2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full backdrop-blur-xs flex items-center justify-center border transition-colors ${
            isWishlisted
              ? 'bg-promo-subtle border-promo-border text-promo-accent'
              : 'bg-white/90 border-app-border text-content-secondary hover:text-promo-accent'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-150 ${
              isWishlisted ? 'fill-promo-accent text-promo-accent' : ''
            }`}
          />
        </motion.button>

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
          <div className="flex flex-col items-center justify-center p-4 text-center bg-slate-50 w-full h-full">
            <Package className="w-8 h-8 text-content-muted mb-2" />
            <span className="text-xs leading-4 font-medium text-content-secondary line-clamp-2">
              {product.name}
            </span>
          </div>
        )}
      </div>

      {/* Content Container (8pt Sub-Grid p-3 for 2-column density, 8px internal spacing) */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        {/* Title: 2 lines max (line-clamp-2 text-content-primary text-sm font-medium) */}
        <h3 className="line-clamp-2 text-content-primary text-sm font-medium leading-5">
          {language === 'BN' ? product.nameBn : product.name}
        </h3>

        <div className="mt-2 pt-2 border-t border-app-border">
          {/* Price Row */}
          <div className="flex items-center">
            <span className="text-content-primary font-bold text-base leading-6 tabular-nums">
              {formatPrice(landedBdt)}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-content-muted text-xs leading-4 line-through ml-2 tabular-nums truncate">
                {formatPrice(product.originalLandedBdt)}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="bg-promo-subtle text-promo-accent text-[11px] leading-4 font-bold px-2 py-0.5 rounded ml-auto tabular-nums shrink-0">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          {/* Bottom Micro-copy + Restrained Quick-Add */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-[11px] leading-4 text-content-secondary flex items-center gap-1 truncate">
              <span className="text-brand-primary font-bold">✓</span>
              <span className="truncate">
                {language === 'BN' ? 'কাস্টমস ও ডেলিভারিসহ' : 'Incl. Customs & Delivery'}
              </span>
            </span>

            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              aria-label={`Add ${product.name} to bag`}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product.id, 1);
                setJustAdded(true);
                setTimeout(() => setJustAdded(false), 750);
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                justAdded
                  ? 'bg-brand-primary text-white'
                  : 'bg-app-subtle hover:bg-brand-primary text-content-primary hover:text-white border border-app-border'
              }`}
            >
              {justAdded ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Plus className="w-4 h-4 stroke-[2]" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
