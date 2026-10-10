import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
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
   Clean, noise-free visual anchor:
   - Single zoom button in corner (Wishlist lives in TopAppBar, eliminating duplicate hearts)
   - No promotional text badge overlapping the product image
   - Angle thumbnails act as unified pagination (eliminating redundant dots + fraction counter)
   ============================================================================ */
export interface PdpGalleryProps {
  product: Product;
  galleryImages: string[];
  activeImageView: number;
  onSelectImageView: (index: number) => void;
  hasDistinctGalleryImages: boolean;
  onOpenZoom: () => void;
}

export const PdpImageGallery: React.FC<PdpGalleryProps> = ({
  product,
  galleryImages,
  activeImageView,
  onSelectImageView,
  hasDistinctGalleryImages,
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
      className="relative w-full bg-slate-50/70 border-b border-app-border select-none"
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
      {/* Subtle Zoom Button (Top-Right, non-obstructing) */}
      <button
        type="button"
        aria-label="Zoom product image"
        onClick={onOpenZoom}
        className="absolute top-3 right-4 z-10 w-9 h-9 rounded-full bg-white/90 border border-app-border text-content-secondary hover:text-content-primary active:scale-95 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        <Maximize2 className="w-4 h-4 stroke-[1.8]" />
      </button>

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

      {/* Clean Angle Thumbnails Bar (Single unified gallery indicator) */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
                    ? 'border-brand-primary ring-1 ring-brand-primary/15'
                    : 'border-app-border opacity-70 hover:opacity-100'
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

        <span className="text-[11px] font-medium tabular-nums text-content-muted">
          {activeImageView + 1} / {galleryImages.length}
        </span>
      </div>
    </section>
  );
};

/* ============================================================================
   2. CORE PRODUCT INFORMATION & PRICE BLOCK (Section 4.C)
   Clean, unboxed vertical hierarchy directly beneath the gallery.
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
}) => {
  return (
    <section aria-label="Core Product Information" className="space-y-2">
      {/* 1. Clean Category & Origin Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-content-secondary min-w-0 truncate">
        <button
          type="button"
          onClick={onCategoryClick}
          className="font-medium text-brand-primary hover:underline truncate focus-visible:outline-none"
        >
          {categoryLabel}
        </button>
        <span aria-hidden="true" className="text-content-muted">
          ·
        </span>
        <span className="truncate text-content-secondary">
          {product.originLabel.split('·')[0].trim()}
        </span>
      </div>

      {/* 2. Product Name */}
      <h1 className="text-lg sm:text-[19px] leading-snug font-bold tracking-tight text-content-primary">
        {language === 'BN' ? product.nameBn : product.name}
      </h1>

      {/* 3. Star Rating, Review Count, Stock Status & Price History Link */}
      <div className="flex items-center justify-between gap-2 text-xs pt-0.5">
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          <button
            type="button"
            onClick={onScrollToReviews}
            className="inline-flex items-center gap-1 text-content-primary hover:underline focus-visible:outline-none shrink-0"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums font-semibold">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-content-secondary tabular-nums">
              ({product.reviewCount.toLocaleString()})
            </span>
          </button>
          <span aria-hidden="true" className="text-content-muted">
            ·
          </span>
          <span
            className={`font-medium truncate ${
              product.inStock ? 'text-brand-primary' : 'text-promo-accent'
            }`}
          >
            {product.inStock
              ? language === 'BN'
                ? 'স্টকে আছে'
                : 'In Stock'
              : language === 'BN'
              ? 'স্টকে নেই'
              : 'Out of Stock'}
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

      {/* 4. Prominent Selling Price & Discount Badge */}
      <div className="pt-1 flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl leading-7 font-bold tracking-tight tabular-nums text-content-primary">
            {formatPrice(totalLandedBdt)}
          </span>
          {product.discountPercent > 0 && (
            <>
              <span className="text-xs text-content-muted line-through tabular-nums">
                {formatPrice(product.originalLandedBdt)}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-brand-subtle text-[11px] font-semibold text-brand-primary tabular-nums">
                -{product.discountPercent}%
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] text-content-secondary shrink-0">
          Duty & VAT incl.
        </span>
      </div>
    </section>
  );
};

/* ============================================================================
   3. PRODUCT VARIANT SELECTOR MODULE (Section 4.D)
   Compact, unboxed selection chips & swatches with unified emerald active states.
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
  addingState: 'idle' | 'loading' | 'added';
  onAddToCart: () => void;
  onBuyNow: () => void;
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
  addingState,
  onAddToCart,
  onBuyNow,
}) => {
  const isFashion = product.category === 'fashion' || Boolean(product.sizes?.length);
  const editionOptions =
    product.category === 'electronics'
      ? ['Standard Global (220V)', 'Pro Bundle (+Adapter)', 'Regional Unlocked (OOS)']
      : ['Standard Export Pack', 'Gift Box Edition'];

  return (
    <section
      aria-label="Product Variant Selection"
      className="pt-4 border-t border-app-border space-y-3.5"
    >
      {/* 1. Color / Material Swatches */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-content-secondary font-medium">
            {language === 'BN'
              ? 'রঙ / ফিনিশ'
              : isFashion
              ? 'Color / Material'
              : 'Color / Finish'}
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
                className={`h-9 px-3 rounded-lg border flex items-center gap-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
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

      {/* 2. Size Selection (Fashion) OR Model/Configuration Selection (Electronics/Gear) */}
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
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary hover:underline focus-visible:outline-none"
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
                  className={`min-w-[44px] h-9 px-3 rounded-lg tabular-nums text-xs font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                    isUnavailable
                      ? 'bg-slate-50 text-content-muted border-app-border line-through cursor-not-allowed opacity-60'
                      : active
                      ? 'border-brand-primary bg-brand-subtle text-brand-primary'
                      : 'bg-white text-content-primary border-app-border hover:border-app-borderStrong'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-content-secondary font-medium">
              Configuration
            </span>
            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary hover:underline focus-visible:outline-none"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Compatibility</span>
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
                  className={`h-9 px-3 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                    isUnavailable
                      ? 'bg-slate-50 text-content-muted border-app-border line-through cursor-not-allowed opacity-60'
                      : active
                      ? 'border-brand-primary bg-brand-subtle text-brand-primary font-semibold'
                      : 'border-app-border bg-white text-content-primary hover:border-app-borderStrong'
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

      {/* 3. Unified Mobile Quantity, Landed Price & Purchase Actions Card */}
      <div className="p-3.5 rounded-2xl bg-app-bg border border-app-border space-y-3">
        {/* Top Row: Live Landed Price Summary + Ergonomic Quantity Stepper */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-content-secondary">
              <span className="font-medium">
                {language === 'BN' ? 'পরিমাণ ও ল্যান্ডেড মূল্য' : 'Landed Price'}
              </span>
              {quantity > 1 && (
                <span className="text-content-muted tabular-nums">
                  ({quantity} × {formatPrice(totalLandedBdt)})
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold tabular-nums text-content-primary tracking-tight leading-tight">
                {formatPrice(totalLandedBdt * quantity)}
              </span>
              <span className="text-[11px] font-medium text-brand-primary">
                {language === 'BN' ? 'ডিউটি ও ভ্যাটসহ' : 'Duty & VAT incl.'}
              </span>
            </div>
          </div>

          {/* Ergonomic Mobile Stepper */}
          <div className="flex items-center gap-1.5 bg-white border border-app-border rounded-xl p-1 shrink-0 shadow-2xs">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => onChangeQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-app-bg hover:bg-slate-200/70 active:scale-95 text-content-primary disabled:opacity-35 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
            <span className="tabular-nums text-sm font-semibold text-content-primary min-w-[28px] text-center select-none">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= 10}
              onClick={() => onChangeQuantity(Math.min(10, quantity + 1))}
              className="w-8 h-8 rounded-lg bg-app-bg hover:bg-slate-200/70 active:scale-95 text-content-primary disabled:opacity-35 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Mobile-Proportioned Buy Now + Add to Cart Actions */}
        <div className="grid grid-cols-[1fr_1.35fr] gap-2.5 pt-2.5 border-t border-app-border/80">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={onBuyNow}
            className="h-11 px-4 rounded-xl border border-brand-border bg-brand-subtle text-brand-primary hover:bg-emerald-100/70 active:scale-[0.98] disabled:opacity-50 font-semibold text-xs flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            {language === 'BN' ? 'এখনই কিনুন' : 'Buy Now'}
          </button>

          <button
            type="button"
            disabled={!product.inStock || addingState !== 'idle'}
            onClick={onAddToCart}
            className="bg-brand-primary hover:bg-brand-hover active:scale-[0.99] disabled:bg-slate-300 text-white font-semibold rounded-xl h-11 px-4 text-xs flex items-center justify-center gap-2 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            {!product.inStock ? (
              <span>{language === 'BN' ? 'স্টক নেই' : 'Out of Stock'}</span>
            ) : addingState === 'loading' ? (
              <span>{language === 'BN' ? 'যোগ হচ্ছে...' : 'Adding...'}</span>
            ) : addingState === 'added' ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{language === 'BN' ? 'কার্টে যোগ হয়েছে' : 'Added to Cart'}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 stroke-[2]" />
                <span>{language === 'BN' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
   4. SELECTIVE BENTO INFORMATION MODULE (Section 4.E & Section 6)
   Restrained, low-noise 2x2 Bento Grid strictly for secondary logistics & trust.
   Each tile uses a clean icon + label + concise value without heavy icon boxes.
   ============================================================================ */
export interface PdpSelectiveBentoModuleProps {
  product: Product;
  activeRoute?: SellerRoute;
  shippingBdt: number;
  dutyAndVatBdt: number;
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
  formatPrice,
  onCompareRoutes,
  onOpenLandedBreakdown,
  onOpenWarrantyModal,
  onOpenSupplierStore,
}) => {
  return (
    <section
      aria-label="Delivery, Customs, Return Policy, and Seller Highlights"
      className="pt-5 border-t border-app-border"
    >
      <div className="grid grid-cols-2 gap-2.5">
        {/* Bento Tile 1: Delivery Estimate & Shipping Fee */}
        <button
          type="button"
          onClick={onCompareRoutes}
          className="p-3 rounded-xl bg-app-bg border border-app-border hover:border-brand-border text-left flex flex-col justify-between gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <div className="flex items-center justify-between w-full text-content-secondary">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
              <Truck className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span>Delivery</span>
            </span>
            <span className="text-[11px] font-medium text-brand-primary">
              Routes →
            </span>
          </div>
          <div className="text-xs font-semibold text-content-primary tabular-nums truncate">
            {activeRoute?.deliveryDays || '9–14 days'} · {formatPrice(shippingBdt)}
          </div>
        </button>

        {/* Bento Tile 2: Customs & Import Duty */}
        <button
          type="button"
          onClick={onOpenLandedBreakdown}
          className="p-3 rounded-xl bg-app-bg border border-app-border hover:border-brand-border text-left flex flex-col justify-between gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <div className="flex items-center justify-between w-full text-content-secondary">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span>Customs & VAT</span>
            </span>
            <span className="text-[11px] font-medium text-brand-primary">
              Details →
            </span>
          </div>
          <div className="text-xs font-semibold text-content-primary tabular-nums truncate">
            Included ({formatPrice(dutyAndVatBdt)})
          </div>
        </button>

        {/* Bento Tile 3: Return & Warranty Policy */}
        <button
          type="button"
          onClick={onOpenWarrantyModal}
          className="p-3 rounded-xl bg-app-bg border border-app-border hover:border-brand-border text-left flex flex-col justify-between gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <div className="flex items-center justify-between w-full text-content-secondary">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
              <RefreshCcw className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span>Protection</span>
            </span>
            <span className="text-[11px] font-medium text-brand-primary">
              Policy →
            </span>
          </div>
          <div className="text-xs font-semibold text-content-primary truncate">
            {product.specs.warranty || '30-Day Dhaka Return'}
          </div>
        </button>

        {/* Bento Tile 4: Verified Exporter Storefront */}
        <button
          type="button"
          onClick={onOpenSupplierStore}
          className="p-3 rounded-xl bg-app-bg border border-app-border hover:border-brand-border text-left flex flex-col justify-between gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <div className="flex items-center justify-between w-full text-content-secondary">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium truncate">
              <Store className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span className="truncate">Verified Seller</span>
            </span>
            <span className="text-[11px] font-medium text-brand-primary shrink-0">
              Store →
            </span>
          </div>
          <div className="text-xs font-semibold text-content-primary truncate">
            {product.supplierName}
          </div>
        </button>
      </div>
    </section>
  );
};

/* ============================================================================
   5. COLLAPSIBLE PRODUCT INFORMATION & DETAILS ACCORDION (Section 4.F)
   - 4 vertically stacked, full-width accordion rows with independent expansion
   - Subtle height/opacity animation and chevron rotation
   - Category-adaptive content for Description, Technical Specifications,
     Compatibility & Care, and Landed Cost Breakdown (Confirmed vs Estimated)
   ============================================================================ */
export type PdpAccordionId = 'overview' | 'specs' | 'care' | 'landed';

export interface PdpAccordionSectionsProps {
  product: Product;
  activeRoute?: SellerRoute;
  openSections: Record<PdpAccordionId, boolean>;
  onToggleSection: (section: PdpAccordionId) => void;
  baseBdt: number;
  shippingBdt: number;
  dutyBdt: number;
  vatBdt: number;
  totalLandedBdt: number;
  resolvedHsCode: string;
  formatPrice: (bdt: number) => string;
  onCompareSpecs: () => void;
  landedSectionRef?: React.RefObject<HTMLDivElement | null>;
}

export const PdpAccordionSections: React.FC<PdpAccordionSectionsProps> = ({
  product,
  activeRoute,
  openSections,
  onToggleSection,
  baseBdt,
  shippingBdt,
  dutyBdt,
  vatBdt,
  totalLandedBdt,
  resolvedHsCode,
  formatPrice,
  onCompareSpecs,
  landedSectionRef,
}) => {
  const isFashion = product.category === 'fashion' || Boolean(product.sizes?.length);
  const isElectronics = product.category === 'electronics';
  const isDomesticRoute =
    activeRoute?.originCountry?.toLowerCase().includes('bangladesh') ||
    activeRoute?.originCountry?.toLowerCase().includes('dhaka') ||
    (dutyBdt === 0 && vatBdt === 0);

  // Category-adaptive factual specification rows (surfacing all rich API metadata)
  const adaptiveSpecRows = React.useMemo(() => {
    const rows: { label: string; value?: string }[] = [
      { label: 'Brand / Supplier', value: product.supplierName },
      { label: 'API Product SKU', value: product.sku || product.specs.sku },
      { label: 'EAN / Barcode', value: product.barcode || product.specs.barcode },
      {
        label: 'Physical Dimensions',
        value: product.dimensions || product.specs.dimensions,
      },
      {
        label: 'Live Inventory Status',
        value:
          typeof product.stockCount === 'number'
            ? `${product.stockCount} units (${product.availabilityStatus || 'In Stock'})`
            : product.specs.stock,
      },
      {
        label: 'Minimum Order Quantity',
        value: product.minimumOrderQuantity
          ? `${product.minimumOrderQuantity} unit(s)`
          : product.specs.moq,
      },
      {
        label: isFashion
          ? 'Material & Weave'
          : isElectronics
          ? 'Display / Form Factor'
          : 'Primary Construction',
        value: product.specs.display,
      },
      {
        label: isFashion
          ? 'Fabric Weight / Density'
          : isElectronics
          ? 'Battery / Power Rating'
          : 'Capacity / Endurance',
        value: product.specs.battery,
      },
      {
        label: isFashion
          ? 'Finish & Weather Resistance'
          : 'Ingress / Build Protection',
        value: product.specs.waterproof,
      },
      {
        label: isFashion
          ? 'Fit & Stitching Architecture'
          : isElectronics
          ? 'Processor / Core Sensor'
          : 'Core Mechanism',
        value: product.specs.heartRate,
      },
      {
        label: isFashion
          ? 'Origin Standard'
          : isElectronics
          ? 'Wireless / Connectivity'
          : 'System Interface',
        value: product.specs.gps,
      },
      { label: 'Net Parcel Weight', value: product.specs.weight },
      { label: 'Shipping Lead Time', value: product.shippingInformation || product.specs.shippingInfo },
      { label: 'Return Policy', value: product.returnPolicy || product.specs.returnPolicy },
      { label: 'Origin Dispatch Hub', value: product.originLabel },
      { label: 'Warranty Coverage', value: product.specs.warranty },
    ];
    return rows.filter((r) => Boolean(r.value && r.value.trim()));
  }, [isElectronics, isFashion, product]);

  // Category-adaptive compatibility & care rows (showing only relevant fields per category)
  const compatibilityAndCareRows = React.useMemo(() => {
    if (isFashion) {
      return [
        {
          label: 'Size & Fit Standard',
          value: product.sizes?.length
            ? `EU ${product.sizes[0]}–${product.sizes[product.sizes.length - 1]} (True-to-Size BD Fit)`
            : 'Standard Export Fit',
        },
        {
          label: 'Washing & Cleaning',
          value: 'Gentle hand wash or cold cycle (max 30°C) with mild detergent',
        },
        {
          label: 'Drying & Storage',
          value: 'Air dry flat in shade; store in a cool, dry wardrobe away from direct heat',
        },
        {
          label: 'Handling Precautions',
          value: 'Do not bleach or wring; steam or low-heat iron on reverse side only',
        },
      ];
    }

    if (isElectronics) {
      return [
        {
          label: 'System Compatibility',
          value: 'Compatible with iOS, Android, Windows, and macOS devices',
        },
        {
          label: 'Power & Voltage (BD)',
          value: '100V–240V AC 50/60Hz auto-switching (compatible with Bangladesh 220V grid)',
        },
        {
          label: 'Cleaning & Maintenance',
          value: 'Wipe exterior with a dry lint-free microfiber cloth; keep charging contacts dry',
        },
        {
          label: 'Safety Precautions',
          value: 'Use certified USB-PD / surge-protected adapters; avoid extreme humidity',
        },
      ];
    }

    return [
      {
        label: 'Usage & Environment',
        value: 'Designed for standard household and daily commercial use in Bangladesh',
      },
      {
        label: 'Cleaning & Care',
        value: 'Wipe clean with a soft damp cloth and mild soap; dry thoroughly after use',
      },
      {
        label: 'Storage & Handling',
        value: 'Store in a dry, ventilated space away from prolonged direct sunlight',
      },
    ];
  }, [isElectronics, isFashion, product.sizes]);

  return (
    <section
      aria-label="Collapsible Product Information and Details"
      className="pt-4 border-t border-app-border divide-y divide-app-border"
    >
      {/* ===================================================================
          1. PRODUCT DESCRIPTION & KEY FEATURES
          =================================================================== */}
      <div className="py-1 first:pt-0">
        <button
          type="button"
          id="pdp-acc-btn-overview"
          aria-expanded={openSections.overview}
          aria-controls="pdp-acc-panel-overview"
          onClick={() => onToggleSection('overview')}
          className="w-full min-h-[44px] py-2 flex items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg"
        >
          <span className="text-sm font-semibold text-content-primary">
            1. Product Description & Key Features
          </span>
          <ChevronDown
            className={`w-4 h-4 text-content-secondary shrink-0 transition-transform duration-200 ${
              openSections.overview ? 'rotate-180 text-brand-primary' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSections.overview && (
            <motion.div
              id="pdp-acc-panel-overview"
              role="region"
              aria-labelledby="pdp-acc-btn-overview"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pb-3 pt-1 space-y-3 text-xs text-content-secondary leading-relaxed">
                <p className="text-content-primary/90">
                  {product.fullDescription || product.subtitle}
                </p>

                {product.tags && product.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-app-subtle border border-app-border text-[11px] font-medium text-content-secondary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {product.highlights.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-content-primary block">
                      Key Features & Benefits
                    </span>
                    <ul className="space-y-1.5">
                      {product.highlights.map((hl) => (
                        <li
                          key={hl}
                          className="flex items-start gap-2 text-content-primary font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 border-t border-app-border/70 flex items-center justify-between text-[11px]">
                  <span className="text-content-secondary">Included in Package</span>
                  <span className="font-medium text-content-primary text-right">
                    {isElectronics
                      ? `${product.name}, Charging/Data Accessory & Export Documentation`
                      : `${product.name} in Moisture-Sealed Export Packaging`}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===================================================================
          2. TECHNICAL SPECIFICATIONS
          =================================================================== */}
      <div className="py-1">
        <button
          type="button"
          id="pdp-acc-btn-specs"
          aria-expanded={openSections.specs}
          aria-controls="pdp-acc-panel-specs"
          onClick={() => onToggleSection('specs')}
          className="w-full min-h-[44px] py-2 flex items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg"
        >
          <span className="text-sm font-semibold text-content-primary">
            2. Technical Specifications
          </span>
          <ChevronDown
            className={`w-4 h-4 text-content-secondary shrink-0 transition-transform duration-200 ${
              openSections.specs ? 'rotate-180 text-brand-primary' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSections.specs && (
            <motion.div
              id="pdp-acc-panel-specs"
              role="region"
              aria-labelledby="pdp-acc-btn-specs"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pb-3 pt-1 space-y-2">
                <div className="divide-y divide-app-border/80 text-xs">
                  {adaptiveSpecRows.map((row) => (
                    <div
                      key={row.label}
                      className="py-2 first:pt-0 flex items-start justify-between gap-4"
                    >
                      <span className="text-content-secondary shrink-0">
                        {row.label}
                      </span>
                      <span className="font-medium text-content-primary text-right">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={onCompareSpecs}
                    className="text-xs font-medium text-brand-primary hover:underline"
                  >
                    Compare Specifications Side-by-Side →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===================================================================
          3. COMPATIBILITY & CARE
          =================================================================== */}
      <div className="py-1">
        <button
          type="button"
          id="pdp-acc-btn-care"
          aria-expanded={openSections.care}
          aria-controls="pdp-acc-panel-care"
          onClick={() => onToggleSection('care')}
          className="w-full min-h-[44px] py-2 flex items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg"
        >
          <span className="text-sm font-semibold text-content-primary">
            3. Compatibility & Care
          </span>
          <ChevronDown
            className={`w-4 h-4 text-content-secondary shrink-0 transition-transform duration-200 ${
              openSections.care ? 'rotate-180 text-brand-primary' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSections.care && (
            <motion.div
              id="pdp-acc-panel-care"
              role="region"
              aria-labelledby="pdp-acc-btn-care"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pb-3 pt-1 divide-y divide-app-border/80 text-xs">
                {compatibilityAndCareRows.map((row) => (
                  <div
                    key={row.label}
                    className="py-2 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
                  >
                    <span className="text-content-secondary shrink-0">
                      {row.label}
                    </span>
                    <span className="font-medium text-content-primary text-right leading-relaxed">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===================================================================
          4. LANDED COST BREAKDOWN
          =================================================================== */}
      <div ref={landedSectionRef} className="py-1 last:pb-0">
        <button
          type="button"
          id="pdp-acc-btn-landed"
          aria-expanded={openSections.landed}
          aria-controls="pdp-acc-panel-landed"
          onClick={() => onToggleSection('landed')}
          className="w-full min-h-[44px] py-2 flex items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg"
        >
          <span className="text-sm font-semibold text-content-primary">
            4. Landed Cost Breakdown
          </span>
          <ChevronDown
            className={`w-4 h-4 text-content-secondary shrink-0 transition-transform duration-200 ${
              openSections.landed ? 'rotate-180 text-brand-primary' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSections.landed && (
            <motion.div
              id="pdp-acc-panel-landed"
              role="region"
              aria-labelledby="pdp-acc-btn-landed"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pb-3 pt-1 space-y-2.5 text-xs">
                <div className="divide-y divide-app-border/80">
                  <div className="py-1.5 first:pt-0 flex items-center justify-between gap-2">
                    <span className="text-content-secondary">
                      Product Base Price{' '}
                      <span className="text-[10px] text-brand-primary font-medium">
                        (Confirmed)
                      </span>
                    </span>
                    <span className="tabular-nums text-content-primary font-medium">
                      {formatPrice(baseBdt)}
                    </span>
                  </div>

                  <div className="py-1.5 flex items-center justify-between gap-2">
                    <span className="text-content-secondary">
                      {isDomesticRoute
                        ? 'Local Dhaka Hub Courier'
                        : `International Freight (${activeRoute?.deliveryDays || '9–14 days'})`}{' '}
                      <span className="text-[10px] text-brand-primary font-medium">
                        (Confirmed)
                      </span>
                    </span>
                    <span className="tabular-nums text-content-primary font-medium">
                      {formatPrice(shippingBdt)}
                    </span>
                  </div>

                  {!isDomesticRoute && (
                    <>
                      <div className="py-1.5 flex items-center justify-between gap-2">
                        <span className="text-content-secondary">
                          Customs Duty (10% · HS {resolvedHsCode}){' '}
                          <span className="text-[10px] text-content-muted">
                            (Est.)
                          </span>
                        </span>
                        <span className="tabular-nums text-content-primary font-medium">
                          {formatPrice(dutyBdt)}
                        </span>
                      </div>

                      <div className="py-1.5 flex items-center justify-between gap-2">
                        <span className="text-content-secondary">
                          Bangladesh Import VAT (15%){' '}
                          <span className="text-[10px] text-content-muted">
                            (Est.)
                          </span>
                        </span>
                        <span className="tabular-nums text-content-primary font-medium">
                          {formatPrice(vatBdt)}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="py-1.5 flex items-center justify-between gap-2">
                    <span className="text-content-secondary">
                      Customs Clearance & Handling Fee
                    </span>
                    <span className="tabular-nums text-brand-primary font-medium">
                      Included in Freight
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-app-border flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-content-primary block">
                      {isDomesticRoute
                        ? 'Total Domestic Delivery Cost'
                        : 'Estimated Landed Cost Total'}
                    </span>
                    <span className="text-[10px] text-content-muted">
                      {isDomesticRoute
                        ? 'Dispatched from local Dhaka inventory'
                        : 'Pre-clearance estimate · Subject to final customs assessment'}
                    </span>
                  </div>
                  <span className="tabular-nums text-sm font-bold text-brand-primary">
                    {formatPrice(totalLandedBdt)}
                  </span>
                </div>

                {/* Transparent Assumptions Note */}
                <p className="text-[11px] leading-relaxed text-content-muted bg-app-bg p-2.5 rounded-lg border border-app-border">
                  <strong className="text-content-secondary font-medium">
                    Calculation Basis:
                  </strong>{' '}
                  Estimated for delivery to Bangladesh via{' '}
                  <span className="text-content-secondary font-medium">
                    {activeRoute?.name || 'Global Direct'}
                  </span>{' '}
                  based on declared item value ({formatPrice(baseBdt)}) and
                  standard HS {resolvedHsCode} import tariff rules.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          className="text-xs font-medium text-brand-primary flex items-center gap-1 hover:underline"
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
          <div key={rev.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
            <div className="flex items-start justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <span className="font-semibold text-content-primary truncate max-w-[180px]">
                  {rev.author}
                </span>
                {rev.verified && (
                  <span className="px-1.5 py-0.5 rounded bg-brand-subtle text-[10px] text-brand-primary font-semibold shrink-0">
                    Verified
                  </span>
                )}
              </div>
              <span className="text-[11px] text-content-muted tabular-nums shrink-0">
                {rev.date}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-0.5 shrink-0">
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
                <span className="text-[11px] text-content-muted truncate max-w-full">
                  {rev.variantChosen}
                </span>
              )}
            </div>
            <p className="text-xs text-content-secondary leading-relaxed break-words">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>

      {product.reviews.length > 0 && (
        <button
          type="button"
          onClick={onViewAllReviews}
          className="w-full h-9 rounded-lg border border-app-border text-xs font-semibold text-content-primary hover:bg-app-subtle transition-colors"
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
          className="text-xs font-medium text-brand-primary hover:underline"
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
   Clean, mobile-proportioned 2-button action bar (Buy Now + Add to Bag)
   with generous horizontal touch targets.
   ============================================================================ */
export interface PdpStickyPurchaseBarProps {
  inStock: boolean;
  addingState: 'idle' | 'loading' | 'added';
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export const PdpStickyPurchaseBar: React.FC<PdpStickyPurchaseBarProps> = ({
  inStock,
  addingState,
  onAddToCart,
  onBuyNow,
}) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-app-border px-4 py-2.5 flex items-center gap-3">
      {/* Secondary Buy Now Action */}
      <button
        type="button"
        disabled={!inStock}
        onClick={onBuyNow}
        className="h-11 px-4 rounded-xl border border-brand-border bg-brand-subtle text-brand-primary hover:bg-emerald-100/70 active:scale-[0.98] disabled:opacity-50 font-semibold text-xs flex-1 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        Buy Now
      </button>

      {/* Primary Action: Strongest Visual Emphasis Add to Bag Button */}
      <button
        type="button"
        disabled={!inStock || addingState !== 'idle'}
        onClick={onAddToCart}
        className="bg-brand-primary hover:bg-brand-hover active:scale-[0.99] disabled:bg-slate-300 text-white font-semibold rounded-xl h-11 flex-[1.45] text-xs flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
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
