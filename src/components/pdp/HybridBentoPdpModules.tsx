import React from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Heart,
  Maximize2,
  Minus,
  Package,
  Plus,
  RefreshCcw,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Truck,
} from 'lucide-react';
import { Product, SellerRoute } from '../../types/deshimart';
import { ProductCard } from '../shared/ProductCard';

/* ============================================================================
   1. PRODUCT GALLERY MODULE (Section 4.B)
   Primary visual anchor: full-bleed 4:3 stage, swipeable, pagination dots,
   angle thumbnails, optional zoom trigger, and non-obstructing wishlist button.
   ============================================================================ */
export interface PdpGalleryProps {
  product: Product;
  galleryImages: string[];
  activeImageView: number;
  onSelectImageView: (index: number) => void;
  hasDistinctGalleryImages: boolean;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onOpenZoom: () => void;
}

export const PdpImageGallery: React.FC<PdpGalleryProps> = ({
  product,
  galleryImages,
  activeImageView,
  onSelectImageView,
  hasDistinctGalleryImages,
  isWishlisted,
  onToggleWishlist,
  onOpenZoom,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const touchStartXRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setImgError(false);
  }, [product.id, activeImageView]);

  const activeImageSrc = galleryImages[activeImageView] || product.image;

  const viewTransformClasses = hasDistinctGalleryImages
    ? ['scale-100 rotate-0', 'scale-100 rotate-0', 'scale-100 rotate-0', 'scale-100 rotate-0']
    : ['scale-100 rotate-0', 'scale-110 -rotate-2', 'scale-105 rotate-2', 'scale-100 rotate-0'];

  return (
    <section
      aria-label="Product Image Gallery"
      className="relative w-full bg-slate-50/90 border-b border-app-border select-none"
      onTouchStart={(e) => {
        touchStartXRef.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartXRef.current === null) return;
        const deltaX =
          (e.changedTouches[0]?.clientX ?? touchStartXRef.current) -
          touchStartXRef.current;
        if (Math.abs(deltaX) > 40) {
          if (deltaX < 0) {
            onSelectImageView((activeImageView + 1) % galleryImages.length);
          } else {
            onSelectImageView(
              (activeImageView - 1 + galleryImages.length) % galleryImages.length
            );
          }
        }
        touchStartXRef.current = null;
      }}
    >
      {/* Top-Left Product-Specific Promotional Badge (only when relevant) */}
      {product.discountPercent >= 12 && (
        <div className="absolute top-3 left-4 z-10 px-2.5 py-1 rounded-md bg-brand-primary text-white text-[11px] font-semibold tabular-nums">
          -{product.discountPercent}% Landed Drop
        </div>
      )}

      {/* Top-Right Non-Obstructing Floating Controls (Zoom + Wishlist) */}
      <div className="absolute top-3 right-4 z-10 flex items-center gap-2">
        <button
          type="button"
          aria-label="Zoom product image"
          onClick={onOpenZoom}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs border border-app-border text-content-secondary hover:text-content-primary active:scale-95 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <Maximize2 className="w-4 h-4 stroke-[2]" />
        </button>
        <button
          type="button"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={isWishlisted}
          onClick={onToggleWishlist}
          className={`w-10 h-10 rounded-full backdrop-blur-xs border active:scale-95 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            isWishlisted
              ? 'bg-brand-subtle border-brand-border text-brand-primary'
              : 'bg-white/90 border-app-border text-content-secondary hover:text-brand-primary'
          }`}
        >
          <Heart
            className={`w-4 h-4 stroke-[2] ${
              isWishlisted ? 'fill-brand-primary text-brand-primary' : ''
            }`}
          />
        </button>
      </div>

      {/* Main Product Photography Stage */}
      <div
        onClick={onOpenZoom}
        className="w-full aspect-[4/3] max-h-72 px-6 py-5 flex items-center justify-center cursor-zoom-in overflow-hidden"
      >
        {!imgError ? (
          <img
            key={`${product.id}-${activeImageView}`}
            src={activeImageSrc}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={`w-full h-full object-contain transition-transform duration-200 ${
              viewTransformClasses[activeImageView] || ''
            }`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Package className="w-10 h-10 text-content-muted mb-2" />
            <span className="text-xs font-medium text-content-secondary">
              {product.name}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Gallery Bar: Angle Thumbnails + Swipe Pagination Indicators */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {galleryImages.map((src, idx) => {
            const isSelected = activeImageView === idx;
            return (
              <button
                key={idx}
                type="button"
                aria-label={`View product angle ${idx + 1}`}
                aria-pressed={isSelected}
                onClick={() => onSelectImageView(idx)}
                className={`w-11 h-11 rounded-lg bg-white border p-1 overflow-hidden transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                  isSelected
                    ? 'border-brand-primary ring-1 ring-brand-primary/20'
                    : 'border-app-border opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={src}
                  alt=""
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-contain ${
                    !hasDistinctGalleryImages && idx === 1
                      ? 'scale-125'
                      : !hasDistinctGalleryImages && idx === 2
                      ? 'scale-110 rotate-3'
                      : ''
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Pagination Indicator Dots & Counter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to image ${idx + 1}`}
                onClick={() => onSelectImageView(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  activeImageView === idx
                    ? 'w-4 bg-brand-primary'
                    : 'w-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium tabular-nums text-content-secondary">
            {activeImageView + 1}/{galleryImages.length}
          </span>
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
   2. CORE PRODUCT INFORMATION & PRICE BLOCK (Section 4.C)
   Unboxed vertical hierarchy directly beneath the gallery:
   Category breadcrumb -> 2-line title -> rating/review nav + stock -> prominent price.
   ============================================================================ */
export interface PdpCoreInfoBlockProps {
  product: Product;
  categoryLabel: string;
  language: 'EN' | 'BN';
  totalLandedBdt: number;
  formatPrice: (bdt: number) => string;
  onCategoryClick: () => void;
  onScrollToReviews: () => void;
  onOpenPriceHistory: () => void;
  demoElectronicsProduct?: Product;
  demoFashionProduct?: Product;
  demoHomeProduct?: Product;
  onSwitchDemoProduct: (productId: string) => void;
}

export const PdpCoreInfoBlock: React.FC<PdpCoreInfoBlockProps> = ({
  product,
  categoryLabel,
  language,
  totalLandedBdt,
  formatPrice,
  onCategoryClick,
  onScrollToReviews,
  onOpenPriceHistory,
  demoElectronicsProduct,
  demoFashionProduct,
  demoHomeProduct,
  onSwitchDemoProduct,
}) => {
  return (
    <section aria-label="Core Product Information" className="space-y-3">
      {/* 1. Category Breadcrumb + Reusable Category Template Switcher (Section 8.6) */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-app-border">
        <div className="flex items-center gap-1.5 text-xs text-content-secondary min-w-0 truncate">
          <button
            type="button"
            onClick={onCategoryClick}
            className="font-medium text-brand-primary hover:underline truncate focus-visible:outline-none"
          >
            {categoryLabel}
          </button>
          <span aria-hidden="true" className="text-content-muted">
            /
          </span>
          <span className="truncate text-content-secondary">
            {product.originLabel.split('·')[0].trim()}
          </span>
        </div>

        {/* Category Template Switcher (Demonstrating Electronics vs Fashion vs Home reusability) */}
        <div
          role="group"
          aria-label="Switch product category demonstration"
          className="flex items-center gap-0.5 bg-app-subtle p-0.5 rounded-lg border border-app-border shrink-0"
        >
          {demoElectronicsProduct && (
            <button
              type="button"
              onClick={() => onSwitchDemoProduct(demoElectronicsProduct.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                product.category === 'electronics'
                  ? 'bg-white text-brand-primary font-semibold shadow-2xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Electronics
            </button>
          )}
          {demoFashionProduct && (
            <button
              type="button"
              onClick={() => onSwitchDemoProduct(demoFashionProduct.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                product.category === 'fashion'
                  ? 'bg-white text-brand-primary font-semibold shadow-2xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Fashion
            </button>
          )}
          {demoHomeProduct && (
            <button
              type="button"
              onClick={() => onSwitchDemoProduct(demoHomeProduct.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                product.category === 'home_living'
                  ? 'bg-white text-brand-primary font-semibold shadow-2xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Home
            </button>
          )}
        </div>
      </div>

      {/* 2. Product Name (Supports two-line titles cleanly) */}
      <div>
        <h1 className="text-[19px] leading-[1.3] font-semibold tracking-tight text-content-primary">
          {language === 'BN' ? product.nameBn : product.name}
        </h1>
        <p className="text-[13px] leading-[1.45] text-content-secondary mt-1 line-clamp-2">
          {product.subtitle}
        </p>
      </div>

      {/* 3 & 6. Star Rating, Review Count, Review Navigation & Meaningful Stock Status */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onScrollToReviews}
            className="inline-flex items-center gap-1.5 text-content-primary hover:underline focus-visible:outline-none"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums font-semibold">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-content-secondary tabular-nums">
              ({product.reviewCount.toLocaleString()} reviews)
            </span>
          </button>
          <span aria-hidden="true" className="text-content-muted">
            ·
          </span>
          <span
            className={`inline-flex items-center gap-1 font-medium ${
              product.inStock ? 'text-brand-primary' : 'text-promo-accent'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.inStock ? 'bg-brand-primary' : 'bg-promo-accent'
              }`}
            />
            {product.inStock ? 'In Stock · Ready to Ship' : 'Currently Out of Stock'}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenPriceHistory}
          className="text-xs font-semibold text-brand-primary hover:underline shrink-0"
        >
          Price History →
        </button>
      </div>

      {/* 4 & 5. Prominent Current Selling Price, Original Price & Informative Discount */}
      <div className="pt-1 flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="text-[24px] leading-7 font-bold tracking-tight tabular-nums text-content-primary">
            {formatPrice(totalLandedBdt)}
          </span>
          {product.discountPercent > 0 && (
            <>
              <span className="text-xs text-content-muted line-through tabular-nums">
                {formatPrice(product.originalLandedBdt)}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-brand-subtle border border-brand-border text-[11px] font-semibold text-brand-primary tabular-nums">
                Save {product.discountPercent}%
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] text-content-secondary shrink-0">
          Customs & 15% VAT incl.
        </span>
      </div>
    </section>
  );
};

/* ============================================================================
   3. PRODUCT VARIANT SELECTOR MODULE (Section 4.D)
   Compact selection chips, swatches, size/compatibility guide, unavailable state,
   and quantity stepper with 44px touch targets.
   ============================================================================ */
export interface PdpVariantSelectorProps {
  product: Product;
  language: 'EN' | 'BN';
  selectedColor: string;
  onSelectColor: (colorName: string) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  unavailableSize: string | null;
  selectedEdition: string;
  onSelectEdition: (edition: string) => void;
  quantity: number;
  onChangeQuantity: (nextQty: number) => void;
  totalLandedBdt: number;
  formatPrice: (bdt: number) => string;
  onOpenSizeGuide: () => void;
}

export const PdpVariantSelector: React.FC<PdpVariantSelectorProps> = ({
  product,
  language,
  selectedColor,
  onSelectColor,
  selectedSize,
  onSelectSize,
  unavailableSize,
  selectedEdition,
  onSelectEdition,
  quantity,
  onChangeQuantity,
  totalLandedBdt,
  formatPrice,
  onOpenSizeGuide,
}) => {
  const isFashion = product.category === 'fashion' || Boolean(product.sizes?.length);
  const editionOptions =
    product.category === 'electronics'
      ? ['Standard Global (220V)', 'Pro Bundle (+Adapter)', 'Regional Unlocked (OOS)']
      : ['Standard Export Pack', 'Gift Box Edition'];

  return (
    <section
      aria-label="Product Variant Selection"
      className="pt-5 border-t border-app-border space-y-4"
    >
      {/* 1. Color / Material Swatches */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-content-secondary font-medium">
            {language === 'BN'
              ? 'রঙ / ফিনিশ'
              : isFashion
              ? 'Color / Material'
              : 'Finish / Colorway'}
          </span>
          <span className="font-semibold text-content-primary">
            {selectedColor}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {product.colors.map((c) => {
            const active = selectedColor === c.name;
            return (
              <button
                key={c.name}
                type="button"
                aria-pressed={active}
                onClick={() => onSelectColor(c.name)}
                className={`min-h-[44px] px-3 rounded-lg border flex items-center gap-2 text-xs font-medium active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                  active
                    ? 'border-brand-primary bg-brand-subtle text-brand-primary font-semibold'
                    : 'border-app-border bg-white text-content-primary hover:border-app-borderStrong'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
                {active && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Size Selection (for Fashion/Apparel) OR Model/Edition Selection (for Electronics/Gear) */}
      {product.sizes && product.sizes.length > 0 ? (
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-content-secondary font-medium">
              Size (EU) ·{' '}
              <strong className="text-content-primary font-semibold tabular-nums">
                {selectedSize}
              </strong>
            </span>
            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline focus-visible:outline-none"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Size Guide</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {product.sizes.map((sz) => {
              const isUnavailable = sz === unavailableSize;
              const active = selectedSize === sz && !isUnavailable;
              return (
                <button
                  key={sz}
                  type="button"
                  disabled={isUnavailable}
                  aria-disabled={isUnavailable}
                  aria-pressed={active}
                  onClick={() => {
                    if (!isUnavailable) onSelectSize(sz);
                  }}
                  className={`min-w-[46px] h-11 px-3 rounded-lg tabular-nums text-xs font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                    isUnavailable
                      ? 'bg-slate-50 text-content-muted border-app-border line-through cursor-not-allowed opacity-60'
                      : active
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-content-primary border-app-border hover:border-app-borderStrong active:scale-95'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
          {unavailableSize && (
            <p className="text-[11px] text-content-muted mt-1.5">
              Size {unavailableSize} is currently unavailable for direct air dispatch.
            </p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-content-secondary font-medium">
              Model / Regional Configuration
            </span>
            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline focus-visible:outline-none"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Compatibility Guide</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {editionOptions.map((ed) => {
              const isUnavailable = ed.includes('(OOS)');
              const active = selectedEdition === ed && !isUnavailable;
              return (
                <button
                  key={ed}
                  type="button"
                  disabled={isUnavailable}
                  aria-disabled={isUnavailable}
                  aria-pressed={active}
                  onClick={() => {
                    if (!isUnavailable) onSelectEdition(ed);
                  }}
                  className={`min-h-[44px] px-3 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                    isUnavailable
                      ? 'bg-slate-50 text-content-muted border-app-border line-through cursor-not-allowed opacity-60'
                      : active
                      ? 'border-brand-primary bg-brand-subtle text-brand-primary font-semibold'
                      : 'border-app-border bg-white text-content-primary hover:border-app-borderStrong active:scale-[0.98]'
                  }`}
                >
                  <span>{ed.replace(' (OOS)', '')}</span>
                  {active && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Quantity Stepper Row */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-medium text-content-secondary block">
            {language === 'BN' ? 'পরিমাণ' : 'Quantity'}
          </span>
          <span className="text-[11px] text-content-muted tabular-nums">
            Total for {quantity} {quantity === 1 ? 'unit' : 'units'}:{' '}
            <strong className="text-content-primary font-semibold">
              {formatPrice(totalLandedBdt * quantity)}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2 bg-app-subtle border border-app-border rounded-xl p-1">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => onChangeQuantity(Math.max(1, quantity - 1))}
            className="w-9 h-9 rounded-lg bg-white text-content-primary hover:bg-slate-50 active:scale-95 disabled:opacity-40 flex items-center justify-center transition-all shadow-2xs"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="tabular-nums text-xs font-semibold text-content-primary min-w-[28px] text-center">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= 10}
            onClick={() => onChangeQuantity(Math.min(10, quantity + 1))}
            className="w-9 h-9 rounded-lg bg-white text-content-primary hover:bg-slate-50 active:scale-95 disabled:opacity-40 flex items-center justify-center transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
   4. SELECTIVE BENTO INFORMATION MODULE (Section 4.E & Section 6)
   Restrained 2x2 Bento Grid (10–20% screen ratio) strictly for secondary
   logistics, customs pre-clearance, warranty/returns, and verified exporter trust.
   ============================================================================ */
export interface PdpSelectiveBentoModuleProps {
  product: Product;
  activeRoute?: SellerRoute;
  shippingBdt: number;
  dutyAndVatBdt: number;
  resolvedHsCode: string;
  formatPrice: (bdt: number) => string;
  onCompareRoutes: () => void;
  onOpenLandedBreakdown: () => void;
  onOpenWarrantyModal: () => void;
  onOpenSupplierStore: () => void;
}

export const PdpSelectiveBentoModule: React.FC<PdpSelectiveBentoModuleProps> = ({
  product,
  activeRoute,
  shippingBdt,
  dutyAndVatBdt,
  resolvedHsCode,
  formatPrice,
  onCompareRoutes,
  onOpenLandedBreakdown,
  onOpenWarrantyModal,
  onOpenSupplierStore,
}) => {
  return (
    <section
      aria-label="Delivery, Customs, Return Policy, and Verified Seller Highlights"
      className="pt-5 border-t border-app-border"
    >
      <div className="grid grid-cols-2 gap-2.5">
        {/* Bento Tile 1: Delivery Estimate & Shipping Fee */}
        <button
          type="button"
          onClick={onCompareRoutes}
          className="p-3 rounded-xl bg-app-bg border border-app-border hover:border-brand-border active:scale-[0.99] text-left flex flex-col justify-between gap-2 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-7 h-7 rounded-lg bg-brand-subtle text-brand-primary flex items-center justify-center">
              <Truck className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-brand-primary group-hover:underline">
              {product.routes.length} Routes →
            </span>
          </div>
          <div>
            <span className="text-[11px] text-content-secondary block">
              {activeRoute?.name || 'Direct Air Line'}
            </span>
            <span className="text-xs font-semibold text-content-primary tabular-nums block mt-0.5">
              {activeRoute?.deliveryDays || '9–14 days'} · {formatPrice(shippingBdt)}
            </span>
          </div>
        </button>

        {/* Bento Tile 2: Customs & Import Protection */}
        <button
          type="button"
          onClick={onOpenLandedBreakdown}
          className="p-3 rounded-xl bg-app-bg border border-app-border hover:border-brand-border active:scale-[0.99] text-left flex flex-col justify-between gap-2 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-7 h-7 rounded-lg bg-brand-subtle text-brand-primary flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-[11px] font-medium text-content-muted tabular-nums">
              HS {resolvedHsCode.slice(0, 4)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-content-secondary block">
              Customs & 15% VAT
            </span>
            <span className="text-xs font-semibold text-content-primary tabular-nums block mt-0.5">
              Pre-Cleared ({formatPrice(dutyAndVatBdt)})
            </span>
          </div>
        </button>

        {/* Bento Tile 3: Return, Refund & Warranty Policy */}
        <button
          type="button"
          onClick={onOpenWarrantyModal}
          className="p-3 rounded-xl bg-app-bg border border-app-border hover:border-brand-border active:scale-[0.99] text-left flex flex-col justify-between gap-2 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-7 h-7 rounded-lg bg-brand-subtle text-brand-primary flex items-center justify-center">
              <RefreshCcw className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-brand-primary group-hover:underline">
              Policy →
            </span>
          </div>
          <div>
            <span className="text-[11px] text-content-secondary block">
              Return & Warranty
            </span>
            <span className="text-xs font-semibold text-content-primary truncate block mt-0.5">
              {product.specs.warranty || '30-Day Dhaka Return'}
            </span>
          </div>
        </button>

        {/* Bento Tile 4: Verified Exporter Information */}
        <button
          type="button"
          onClick={onOpenSupplierStore}
          className="p-3 rounded-xl bg-app-bg border border-app-border hover:border-brand-border active:scale-[0.99] text-left flex flex-col justify-between gap-2 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-7 h-7 rounded-lg bg-brand-subtle text-brand-primary flex items-center justify-center">
              <Store className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-brand-primary group-hover:underline">
              Store →
            </span>
          </div>
          <div>
            <span className="text-[11px] text-content-secondary truncate block">
              {product.supplierName}
            </span>
            <span className="text-xs font-semibold text-content-primary tabular-nums block mt-0.5">
              {activeRoute?.onTimeRate || '98.4%'} On-Time Dispatch
            </span>
          </div>
        </button>
      </div>
    </section>
  );
};

/* ============================================================================
   5. PRODUCT DESCRIPTION, SPECIFICATIONS & CARE ACCORDIONS (Section 4.F)
   Expandable sections with aligned label-value pairs instead of decorative cards.
   ============================================================================ */
export type PdpAccordionId = 'overview' | 'specs' | 'landed' | 'care';

export interface PdpAccordionSectionsProps {
  product: Product;
  activeRoute?: SellerRoute;
  openSection: PdpAccordionId;
  onToggleSection: (section: PdpAccordionId) => void;
  specRows: { label: string; value?: string }[];
  baseBdt: number;
  shippingBdt: number;
  dutyBdt: number;
  vatBdt: number;
  totalLandedBdt: number;
  resolvedHsCode: string;
  formatPrice: (bdt: number) => string;
  onCompareSpecs: () => void;
}

export const PdpAccordionSections: React.FC<PdpAccordionSectionsProps> = ({
  product,
  activeRoute,
  openSection,
  onToggleSection,
  specRows,
  baseBdt,
  shippingBdt,
  dutyBdt,
  vatBdt,
  totalLandedBdt,
  resolvedHsCode,
  formatPrice,
  onCompareSpecs,
}) => {
  const isFashion = product.category === 'fashion' || Boolean(product.sizes?.length);

  return (
    <section
      aria-label="Product Description, Specifications, and Care Information"
      className="pt-5 border-t border-app-border divide-y divide-app-border"
    >
      {/* 1. Product Description & Key Features */}
      <div className="py-3 first:pt-0">
        <button
          type="button"
          aria-expanded={openSection === 'overview'}
          onClick={() =>
            onToggleSection(openSection === 'overview' ? 'specs' : 'overview')
          }
          className="w-full flex items-center justify-between text-left py-1 focus-visible:outline-none"
        >
          <span className="text-sm font-semibold text-content-primary">
            Product Description & Key Features
          </span>
          <ChevronDown
            className={`w-4 h-4 text-content-secondary transition-transform ${
              openSection === 'overview' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'overview' && (
          <div className="pt-2.5 space-y-2.5 text-xs text-content-secondary leading-relaxed">
            <p>{product.subtitle}</p>
            <ul className="space-y-1.5 pt-1">
              {product.highlights.map((hl) => (
                <li
                  key={hl}
                  className="flex items-center gap-2 text-content-primary font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 2. Technical Specifications, Materials & Dimensions Table */}
      <div className="py-3">
        <button
          type="button"
          aria-expanded={openSection === 'specs'}
          onClick={() =>
            onToggleSection(openSection === 'specs' ? 'overview' : 'specs')
          }
          className="w-full flex items-center justify-between text-left py-1 focus-visible:outline-none"
        >
          <span className="text-sm font-semibold text-content-primary">
            {isFashion
              ? 'Materials, Dimensions & Specifications'
              : 'Technical Specifications & Dimensions'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-content-secondary transition-transform ${
              openSection === 'specs' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'specs' && (
          <div className="pt-2.5 space-y-2">
            <div className="divide-y divide-app-border text-xs">
              {specRows.map((row) => (
                <div
                  key={row.label}
                  className="py-2 flex items-center justify-between gap-4"
                >
                  <span className="text-content-secondary">{row.label}</span>
                  <span className="font-medium text-content-primary text-right">
                    {row.value}
                  </span>
                </div>
              ))}
              <div className="py-2 flex items-center justify-between gap-4">
                <span className="text-content-secondary">Origin Corridor</span>
                <span className="font-medium text-content-primary text-right">
                  {product.originLabel}
                </span>
              </div>
            </div>
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={onCompareSpecs}
                className="text-xs font-semibold text-brand-primary hover:underline"
              >
                Compare Side-by-Side →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Compatibility & Care Instructions */}
      <div className="py-3">
        <button
          type="button"
          aria-expanded={openSection === 'care'}
          onClick={() =>
            onToggleSection(openSection === 'care' ? 'overview' : 'care')
          }
          className="w-full flex items-center justify-between text-left py-1 focus-visible:outline-none"
        >
          <span className="text-sm font-semibold text-content-primary">
            {isFashion
              ? 'Care Instructions & Fit Guidance'
              : 'Compatibility & Care Instructions'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-content-secondary transition-transform ${
              openSection === 'care' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'care' && (
          <div className="pt-2.5 space-y-2 text-xs text-content-secondary leading-relaxed">
            {isFashion ? (
              <>
                <div className="flex justify-between py-1 border-b border-app-border">
                  <span>Care Method</span>
                  <span className="font-medium text-content-primary">
                    Gentle clean · Air dry in shade
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-app-border">
                  <span>Sizing Standard</span>
                  <span className="font-medium text-content-primary">
                    Standard EU / BD True-to-Size
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Packaging</span>
                  <span className="font-medium text-content-primary">
                    Moisture-sealed export box
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between py-1 border-b border-app-border">
                  <span>Power / Voltage</span>
                  <span className="font-medium text-content-primary">
                    100V–240V Auto-Switching (BD Compatible)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-app-border">
                  <span>Connectivity</span>
                  <span className="font-medium text-content-primary">
                    iOS, Android & Windows / macOS
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Maintenance</span>
                  <span className="font-medium text-content-primary">
                    Keep dry; clean contacts with microfiber cloth
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 4. Itemized Landed Cost & Customs Calculation */}
      <div className="py-3 last:pb-0">
        <button
          type="button"
          aria-expanded={openSection === 'landed'}
          onClick={() =>
            onToggleSection(openSection === 'landed' ? 'overview' : 'landed')
          }
          className="w-full flex items-center justify-between text-left py-1 focus-visible:outline-none"
        >
          <span className="text-sm font-semibold text-content-primary">
            Landed Cost & Customs Breakdown
          </span>
          <ChevronDown
            className={`w-4 h-4 text-content-secondary transition-transform ${
              openSection === 'landed' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSection === 'landed' && (
          <div className="pt-2.5 space-y-2 text-xs">
            <div className="flex justify-between text-content-secondary">
              <span>Factory Item Price</span>
              <span className="tabular-nums text-content-primary font-medium">
                {formatPrice(baseBdt)}
              </span>
            </div>
            <div className="flex justify-between text-content-secondary">
              <span>
                International Air Freight ({activeRoute?.deliveryDays || '9–14 days'})
              </span>
              <span className="tabular-nums text-content-primary font-medium">
                {formatPrice(shippingBdt)}
              </span>
            </div>
            <div className="flex justify-between text-content-secondary">
              <span>Bangladesh Import Duty (10%) & VAT (15%)</span>
              <span className="tabular-nums text-content-primary font-medium">
                {formatPrice(dutyBdt + vatBdt)}
              </span>
            </div>
            <div className="flex justify-between text-content-secondary">
              <span>HS Customs Classification</span>
              <span className="tabular-nums text-content-secondary">
                {resolvedHsCode}
              </span>
            </div>
            <div className="pt-2 border-t border-app-border flex justify-between items-center font-semibold text-content-primary">
              <span>Total Guaranteed Landed Price</span>
              <span className="tabular-nums text-sm font-bold text-brand-primary">
                {formatPrice(totalLandedBdt)}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* ============================================================================
   6. REVIEWS AND RATINGS MODULE (Section 4.G)
   Average rating, 5-bar rating distribution, verified-purchase labels, and
   view-all trigger.
   ============================================================================ */
export interface PdpReviewsSectionProps {
  product: Product;
  ratingDistribution: { stars: number; pct: number }[];
  sectionRef: React.RefObject<HTMLElement | null>;
  onWriteReview: () => void;
  onViewAllReviews: () => void;
}

export const PdpReviewsSection: React.FC<PdpReviewsSectionProps> = ({
  product,
  ratingDistribution,
  sectionRef,
  onWriteReview,
  onViewAllReviews,
}) => {
  return (
    <section
      ref={sectionRef}
      aria-label="Customer Reviews and Ratings"
      className="pt-5 border-t border-app-border space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-content-primary">
          Ratings & Verified Reviews
        </h2>
        <button
          type="button"
          onClick={onWriteReview}
          className="text-xs font-semibold text-brand-primary flex items-center gap-1 hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Write Review</span>
        </button>
      </div>

      {/* Average Rating & 5-Star Distribution */}
      <div className="p-3.5 rounded-xl bg-app-bg border border-app-border flex items-center gap-4">
        <div className="text-center pr-4 border-r border-app-border shrink-0">
          <span className="text-2xl font-bold tabular-nums text-content-primary block leading-none">
            {product.rating.toFixed(1)}
          </span>
          <div className="flex items-center justify-center gap-0.5 my-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3 h-3 ${
                  s <= Math.round(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-content-secondary tabular-nums block">
            {product.reviewCount.toLocaleString()} reviews
          </span>
        </div>

        <div className="flex-1 space-y-1">
          {ratingDistribution.map((row) => (
            <div
              key={row.stars}
              className="flex items-center gap-2 text-[11px]"
            >
              <span className="w-3 tabular-nums text-content-secondary font-medium">
                {row.stars}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="w-7 text-right tabular-nums text-content-muted">
                {row.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Previews */}
      <div className="divide-y divide-app-border">
        {product.reviews.slice(0, 2).map((rev) => (
          <div key={rev.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-content-primary">
                  {rev.author}
                </span>
                {rev.verified && (
                  <span className="text-[11px] text-brand-primary font-medium">
                    · Verified Purchase
                  </span>
                )}
              </div>
              <span className="text-[11px] text-content-muted">{rev.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((st) => (
                  <Star
                    key={st}
                    className={`w-3 h-3 ${
                      st <= rev.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              {rev.variantChosen && (
                <span className="text-[11px] text-content-muted">
                  · {rev.variantChosen}
                </span>
              )}
            </div>
            <p className="text-xs text-content-secondary leading-relaxed">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>

      {product.reviews.length > 0 && (
        <button
          type="button"
          onClick={onViewAllReviews}
          className="w-full h-10 rounded-lg border border-app-border text-xs font-semibold text-content-primary hover:bg-app-subtle transition-colors"
        >
          View All {product.reviewCount.toLocaleString()} Reviews
        </button>
      )}
    </section>
  );
};

/* ============================================================================
   7. RELATED PRODUCTS CAROUSEL (Section 4.H)
   Horizontally scrollable carousel for Similar Products & Recently Viewed.
   ============================================================================ */
export interface PdpRelatedCarouselProps {
  similarProducts: Product[];
  recentlyViewedProducts: Product[];
  onSeeAllCategory: () => void;
}

export const PdpRelatedCarousel: React.FC<PdpRelatedCarouselProps> = ({
  similarProducts,
  recentlyViewedProducts,
  onSeeAllCategory,
}) => {
  const [relatedTab, setRelatedTab] = React.useState<'similar' | 'recent'>('similar');
  const activeList =
    relatedTab === 'recent' && recentlyViewedProducts.length > 0
      ? recentlyViewedProducts
      : similarProducts;

  return (
    <section
      aria-label="Related Products"
      className="pt-5 border-t border-app-border space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRelatedTab('similar')}
            className={`text-xs font-semibold transition-colors ${
              relatedTab === 'similar'
                ? 'text-content-primary'
                : 'text-content-muted hover:text-content-secondary'
            }`}
          >
            Similar Products
          </button>
          {recentlyViewedProducts.length > 0 && (
            <>
              <span className="text-content-muted">·</span>
              <button
                type="button"
                onClick={() => setRelatedTab('recent')}
                className={`text-xs font-semibold transition-colors ${
                  relatedTab === 'recent'
                    ? 'text-content-primary'
                    : 'text-content-muted hover:text-content-secondary'
                }`}
              >
                Recently Viewed
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onSeeAllCategory}
          className="text-xs font-semibold text-brand-primary hover:underline"
        >
          See All →
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
        {activeList.map((item) => (
          <div key={item.id} className="w-40 shrink-0">
            <ProductCard product={item} compact />
          </div>
        ))}
      </div>
    </section>
  );
};

/* ============================================================================
   8. STICKY BOTTOM PURCHASE BAR (Section 4.I)
   Persistent bottom bar with concise price summary, secondary Buy Now, and
   high-emphasis Add to Bag button with idle/loading/added/unavailable states.
   ============================================================================ */
export interface PdpStickyPurchaseBarProps {
  inStock: boolean;
  quantity: number;
  totalLandedBdt: number;
  addingState: 'idle' | 'loading' | 'added';
  formatPrice: (bdt: number) => string;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export const PdpStickyPurchaseBar: React.FC<PdpStickyPurchaseBarProps> = ({
  inStock,
  quantity,
  totalLandedBdt,
  addingState,
  formatPrice,
  onAddToCart,
  onBuyNow,
}) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-app-border px-4 py-2.5 flex items-center gap-3">
      {/* Concise Price Summary */}
      <div className="min-w-[88px] shrink-0">
        <span className="block text-[10px] text-content-secondary">
          Landed ({quantity}x)
        </span>
        <span className="block text-base font-bold tabular-nums text-content-primary leading-tight">
          {formatPrice(totalLandedBdt * quantity)}
        </span>
      </div>

      {/* Optional Buy Now Action */}
      <button
        type="button"
        disabled={!inStock}
        onClick={onBuyNow}
        className="h-11 px-3.5 rounded-xl border border-brand-border bg-brand-subtle text-brand-primary hover:bg-emerald-100/70 active:scale-[0.98] disabled:opacity-50 font-semibold text-xs flex items-center justify-center transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        Buy Now
      </button>

      {/* Primary Action: Strongest Visual Emphasis Add to Bag Button */}
      <button
        type="button"
        disabled={!inStock || addingState !== 'idle'}
        onClick={onAddToCart}
        className="bg-brand-primary hover:bg-brand-hover active:scale-[0.99] disabled:bg-slate-300 text-white font-semibold rounded-xl h-11 flex-1 text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        {!inStock ? (
          <span>Out of Stock</span>
        ) : addingState === 'loading' ? (
          <span>Adding...</span>
        ) : addingState === 'added' ? (
          <>
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Added to Bag</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 stroke-[2]" />
            <span>Add to Bag</span>
          </>
        )}
      </button>
    </div>
  );
};
