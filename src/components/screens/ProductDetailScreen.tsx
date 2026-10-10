import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  RefreshCcw,
  ShieldCheck,
  Star,
  Store,
  X,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { CATEGORIES } from '../../data/catalogData';
import {
  PdpAccordionId,
  PdpAccordionSections,
  PdpCoreInfoBlock,
  PdpImageGallery,
  PdpRelatedCarousel,
  PdpReviewsSection,
  PdpSelectiveBentoModule,
  PdpVariantSelector,
} from '../pdp/HybridBentoPdpModules';
// Clean production ProductDetailScreen — zero Cultural Vibe imports

export const ProductDetailScreen: React.FC = () => {
  const {
    products,
    selectedProduct,
    selectedRouteByProduct,
    recentlyViewedIds,
    addToCart,
    addProductReview,
    navigateTo,
    formatPrice,
    language,
    showToast,
  } = useDeshiMart();

  const [selectedColor, setSelectedColor] = useState(
    selectedProduct.colors[0]?.name || 'Standard Edition'
  );
  const [selectedSize, setSelectedSize] = useState(
    selectedProduct.sizes?.[1] || selectedProduct.sizes?.[0] || ''
  );
  const [selectedEdition, setSelectedEdition] = useState(
    selectedProduct.category === 'electronics'
      ? 'Standard Global (220V)'
      : 'Standard Export Pack'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageView, setActiveImageView] = useState<number>(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [addingState, setAddingState] = useState<'idle' | 'loading' | 'added'>('idle');
  const [openSections, setOpenSections] = useState<Record<PdpAccordionId, boolean>>({
    overview: false,
    specs: false,
    care: false,
    landed: false,
  });

  const reviewsSectionRef = useRef<HTMLElement | null>(null);
  const landedSectionRef = useRef<HTMLDivElement | null>(null);

  const handleToggleAccordion = (section: PdpAccordionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    setSelectedColor(selectedProduct.colors[0]?.name || 'Standard Edition');
    setSelectedSize(selectedProduct.sizes?.[1] || selectedProduct.sizes?.[0] || '');
    setSelectedEdition(
      selectedProduct.category === 'electronics'
        ? 'Standard Global (220V)'
        : 'Standard Export Pack'
    );
    setQuantity(1);
    setActiveImageView(0);
    setAddingState('idle');
    setOpenSections({
      overview: false,
      specs: false,
      care: false,
      landed: false,
    });
  }, [selectedProduct]);

  const [activeInfoModal, setActiveInfoModal] = useState<
    null | 'supplier' | 'warranty' | 'review' | 'size_guide' | 'all_reviews'
  >(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const activeRouteId =
    selectedRouteByProduct[selectedProduct.id] || selectedProduct.routes[0]?.id;
  const activeRoute =
    selectedProduct.routes.find((r) => r.id === activeRouteId) ||
    selectedProduct.routes[0];

  const baseBdt = activeRoute ? activeRoute.basePriceBdt : selectedProduct.productPriceBdt;
  const shippingBdt = activeRoute ? activeRoute.shippingBdt : selectedProduct.shippingBdt;
  const dutyBdt = activeRoute ? activeRoute.dutyBdt : selectedProduct.importDutyBdt;
  const vatBdt = activeRoute ? activeRoute.vatBdt : selectedProduct.vatBdt;
  const totalLandedBdt = activeRoute
    ? activeRoute.totalLandedBdt
    : selectedProduct.totalLandedBdt;

  const categoryMeta = useMemo(
    () => CATEGORIES.find((c) => c.id === selectedProduct.category),
    [selectedProduct.category]
  );

  // Representative Electronics & Fashion products to demonstrate component reusability (Section 8.6)
  const demoCategoryProducts = useMemo(() => {
    const elec =
      products.find((p) => p.category === 'electronics') || products[0];
    const fash =
      products.find((p) => p.category === 'fashion' && p.sizes && p.sizes.length > 0) ||
      products.find((p) => p.category === 'fashion') ||
      products[1];
    return { elec, fash };
  }, [products]);

  const similarProducts = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.id !== selectedProduct.id && p.category === selectedProduct.category
        )
        .slice(0, 8),
    [products, selectedProduct.category, selectedProduct.id]
  );

  const recentlyViewedProducts = useMemo(
    () =>
      recentlyViewedIds
        .filter((id) => id !== selectedProduct.id)
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .slice(0, 6),
    [products, recentlyViewedIds, selectedProduct.id]
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addProductReview(selectedProduct.id, reviewRating, reviewComment.trim());
    setReviewComment('');
    setActiveInfoModal(null);
  };

  const galleryImages = useMemo(() => {
    const raw =
      selectedProduct.gallery && selectedProduct.gallery.length > 0
        ? selectedProduct.gallery
        : [selectedProduct.image];
    return raw.length >= 3
      ? raw.slice(0, 4)
      : [raw[0], raw[1] || raw[0], raw[2] || raw[0]];
  }, [selectedProduct.gallery, selectedProduct.image]);

  const hasDistinctGalleryImages = new Set(galleryImages).size > 1;
  const activeImageSrc = galleryImages[activeImageView] || selectedProduct.image;

  const resolvedHsCode =
    selectedProduct.hsCode ||
    (selectedProduct.category === 'electronics'
      ? '8517.62.00'
      : selectedProduct.category === 'fashion'
      ? '6203.42.00'
      : selectedProduct.category === 'home_living'
      ? '8516.71.00'
      : selectedProduct.category === 'beauty_health'
      ? '3304.99.00'
      : selectedProduct.category === 'sports_outdoor'
      ? '9506.91.00'
      : selectedProduct.category === 'toys_games'
      ? '9503.00.00'
      : '8525.89.00');

  const unavailableSize =
    selectedProduct.sizes && selectedProduct.sizes.length >= 5
      ? selectedProduct.sizes[selectedProduct.sizes.length - 1]
      : null;

  const ratingDistribution = useMemo(() => {
    const base = selectedProduct.rating;
    const fiveStar = Math.min(88, Math.max(62, Math.round((base - 3.5) * 52)));
    const fourStar = Math.max(8, Math.min(26, 94 - fiveStar));
    const threeStar = Math.max(2, 98 - fiveStar - fourStar);
    const twoStar = 1;
    const oneStar = 1;
    return [
      { stars: 5, pct: fiveStar },
      { stars: 4, pct: fourStar },
      { stars: 3, pct: threeStar },
      { stars: 2, pct: twoStar },
      { stars: 1, pct: oneStar },
    ];
  }, [selectedProduct.rating]);

  const handleAddToCartClick = () => {
    if (!selectedProduct.inStock || addingState !== 'idle') return;
    setAddingState('loading');
    setTimeout(() => {
      addToCart(
        selectedProduct.id,
        quantity,
        selectedColor,
        selectedSize || selectedEdition,
        activeRoute?.id
      );
      setAddingState('added');
      setTimeout(() => {
        setAddingState('idle');
      }, 1100);
    }, 180);
  };

  const handleBuyNowClick = () => {
    if (!selectedProduct.inStock) return;
    addToCart(
      selectedProduct.id,
      quantity,
      selectedColor,
      selectedSize || selectedEdition,
      activeRoute?.id
    );
    navigateTo('checkout_shipping');
  };

  return (
    <div className="flex-1 bg-white flex flex-col justify-between">
      <div>
        {/* B. PRODUCT IMAGE GALLERY (Full-bleed visual anchor, zero overlapping badges) */}
        <PdpImageGallery
          product={selectedProduct}
          galleryImages={galleryImages}
          activeImageView={activeImageView}
          onSelectImageView={setActiveImageView}
          hasDistinctGalleryImages={hasDistinctGalleryImages}
          onOpenZoom={() => setZoomOpen(true)}
        />

        {/* 16px Padded Vertical Product-First Flow + 10–20% Selective Bento Grid */}
        <div className="px-4 pt-4 pb-6 space-y-5">
          {/* C. CORE PRODUCT INFORMATION (Unboxed Vertical Hierarchy) */}
          <PdpCoreInfoBlock
            product={selectedProduct}
            categoryLabel={
              language === 'BN'
                ? categoryMeta?.nameBn || 'ক্যাটালগ'
                : categoryMeta?.name || 'Global Catalog'
            }
            language={language}
            totalLandedBdt={totalLandedBdt}
            formatPrice={formatPrice}
            onCategoryClick={() =>
              navigateTo('category_products', {
                categoryId: selectedProduct.category,
              })
            }
            onScrollToReviews={() =>
              reviewsSectionRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }
            onOpenPriceHistory={() => navigateTo('price_tracker')}
            demoElectronicsProduct={demoCategoryProducts.elec}
            demoFashionProduct={demoCategoryProducts.fash}
            onSwitchDemoProduct={(productId) =>
              navigateTo('product_detail', { productId })
            }
          />

          {/* D. PRODUCT VARIANT SELECTION (Unboxed Compact Chips + Unified Mobile Quantity, Landed Price & Purchase Actions) */}
          <PdpVariantSelector
            product={selectedProduct}
            language={language}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            unavailableSize={unavailableSize}
            selectedEdition={selectedEdition}
            onSelectEdition={setSelectedEdition}
            quantity={quantity}
            onChangeQuantity={setQuantity}
            totalLandedBdt={totalLandedBdt}
            formatPrice={formatPrice}
            onOpenSizeGuide={() => setActiveInfoModal('size_guide')}
            addingState={addingState}
            onAddToCart={handleAddToCartClick}
            onBuyNow={handleBuyNowClick}
          />

          {/* E. SELECTIVE BENTO INFORMATION MODULE (10–20% Restrained 2x2 Grid) */}
          <PdpSelectiveBentoModule
            product={selectedProduct}
            activeRoute={activeRoute}
            shippingBdt={shippingBdt}
            dutyAndVatBdt={dutyBdt + vatBdt}
            formatPrice={formatPrice}
            onCompareRoutes={() => navigateTo('seller_compare')}
            onOpenLandedBreakdown={() => {
              setOpenSections((prev) => ({ ...prev, landed: true }));
              setTimeout(() => {
                landedSectionRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                });
              }, 80);
            }}
            onOpenWarrantyModal={() => setActiveInfoModal('warranty')}
            onOpenSupplierStore={() => navigateTo('supplier_store')}
          />

          {/* F. COLLAPSIBLE PRODUCT INFORMATION & DETAILS (4 Independent Expandable Sections) */}
          <PdpAccordionSections
            product={selectedProduct}
            activeRoute={activeRoute}
            openSections={openSections}
            onToggleSection={handleToggleAccordion}
            baseBdt={baseBdt}
            shippingBdt={shippingBdt}
            dutyBdt={dutyBdt}
            vatBdt={vatBdt}
            totalLandedBdt={totalLandedBdt}
            resolvedHsCode={resolvedHsCode}
            formatPrice={formatPrice}
            onCompareSpecs={() => navigateTo('spec_compare')}
            landedSectionRef={landedSectionRef}
          />

          {/* G. REVIEWS AND RATINGS */}
          <PdpReviewsSection
            product={selectedProduct}
            ratingDistribution={ratingDistribution}
            sectionRef={reviewsSectionRef}
            onWriteReview={() => setActiveInfoModal('review')}
            onViewAllReviews={() => setActiveInfoModal('all_reviews')}
          />

          {/* H. RELATED PRODUCTS CAROUSEL */}
          <PdpRelatedCarousel
            similarProducts={similarProducts}
            recentlyViewedProducts={recentlyViewedProducts}
            onSeeAllCategory={() =>
              navigateTo('category_products', {
                categoryId: selectedProduct.category,
              })
            }
          />
        </div>
      </div>

      {/* Image Zoom Lightbox Modal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {zoomOpen && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Product Image Zoom"
                className="pointer-events-auto absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xs flex flex-col justify-between p-4"
              >
                <div className="flex items-center justify-between text-white">
                  <span className="text-xs font-medium tabular-nums">
                    {activeImageView + 1} / {galleryImages.length}
                  </span>
                  <button
                    type="button"
                    aria-label="Close zoom view"
                    onClick={() => setZoomOpen(false)}
                    className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center relative overflow-hidden my-4">
                  <img
                    src={activeImageSrc}
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain scale-110"
                  />
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() =>
                      setActiveImageView(
                        (prev) =>
                          (prev - 1 + galleryImages.length) % galleryImages.length
                      )
                    }
                    className="absolute left-1 w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() =>
                      setActiveImageView((prev) => (prev + 1) % galleryImages.length)
                    }
                    className="absolute right-1 w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-center text-xs text-slate-300 truncate">
                  {selectedProduct.name}
                </p>
              </div>
            )}
          </AnimatePresence>,
          document.getElementById('mobile-sheet-root') || document.body
        )}

      {/* Viewport-Docked Secondary Modals (Size Guide, All Reviews, Write Review, Warranty, Supplier) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {activeInfoModal && (
              <div
                role="dialog"
                aria-modal="true"
                className="pointer-events-auto absolute inset-0 z-50 flex items-end justify-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveInfoModal(null)}
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="relative z-10 w-full max-h-[85%] bg-white rounded-t-2xl shadow-2xl border-t border-app-border flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0px)]"
                >
                  {/* Drag Handle */}
                  <div className="pt-2.5 pb-1 shrink-0">
                    <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
                  </div>

                  {activeInfoModal === 'size_guide' ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-app-border flex items-center justify-between gap-2 shrink-0">
                        <h3 className="text-sm font-semibold text-content-primary truncate">
                          Size & Regional Compatibility Guide
                        </h3>
                        <button
                          type="button"
                          aria-label="Close size guide"
                          onClick={() => setActiveInfoModal(null)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:bg-app-subtle shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
                        <div className="border border-app-border rounded-xl overflow-hidden text-xs">
                          <div className="grid grid-cols-3 bg-app-subtle p-2.5 font-semibold text-content-primary">
                            <span>EU Size</span>
                            <span>UK / BD</span>
                            <span>Foot Length</span>
                          </div>
                          {[
                            { eu: '39', uk: '6', cm: '24.5 cm' },
                            { eu: '40', uk: '6.5', cm: '25.0 cm' },
                            { eu: '41', uk: '7.5', cm: '26.0 cm' },
                            { eu: '42', uk: '8', cm: '26.5 cm' },
                            { eu: '43', uk: '9', cm: '27.5 cm' },
                          ].map((r) => (
                            <div
                              key={r.eu}
                              className="grid grid-cols-3 p-2.5 border-t border-app-border tabular-nums text-content-secondary"
                            >
                              <span className="font-semibold text-content-primary">
                                {r.eu}
                              </span>
                              <span>{r.uk}</span>
                              <span>{r.cm}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="px-4 py-3 border-t border-app-border bg-white shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveInfoModal(null)}
                          className="w-full h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
                        >
                          Got It
                        </button>
                      </div>
                    </>
                  ) : activeInfoModal === 'all_reviews' ? (
                    <>
                      {/* Pinned Header */}
                      <div className="px-4 py-2.5 border-b border-app-border flex items-center justify-between gap-2 shrink-0">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-content-primary truncate">
                            All Verified Reviews ({selectedProduct.reviewCount.toLocaleString()})
                          </h3>
                          <p className="text-[11px] text-content-secondary truncate">
                            {selectedProduct.rating.toFixed(1)} ★ average · 100% verified buyers
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label="Close reviews"
                          onClick={() => setActiveInfoModal(null)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:bg-app-subtle shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Single Scrollable Reviews List (No nested scroll traps or box overlap) */}
                      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-2.5">
                        {selectedProduct.reviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="p-3 rounded-xl bg-app-bg border border-app-border space-y-1.5"
                          >
                            <div className="flex items-start justify-between gap-2 text-xs">
                              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                <span className="font-semibold text-content-primary truncate max-w-[170px]">
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

                      {/* Pinned Bottom Action Footer */}
                      <div className="px-4 py-3 border-t border-app-border bg-white shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveInfoModal('review')}
                          className="w-full h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
                        >
                          Write a Review
                        </button>
                      </div>
                    </>
                  ) : activeInfoModal === 'review' ? (
                    <form
                      onSubmit={handleReviewSubmit}
                      className="flex flex-col flex-1 min-h-0 overflow-hidden"
                    >
                      <div className="px-4 py-2.5 border-b border-app-border flex items-center justify-between gap-2 shrink-0">
                        <h3 className="text-sm leading-5 font-semibold text-content-primary truncate">
                          {language === 'BN'
                            ? 'আপনার রিভিউ দিন'
                            : 'Write a Verified Review'}
                        </h3>
                        <button
                          type="button"
                          aria-label="Close write review"
                          onClick={() => setActiveInfoModal(null)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:bg-app-subtle shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3">
                        <div>
                          <span className="block text-xs leading-4 font-medium text-content-secondary mb-1">
                            Rating
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="p-1"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= reviewRating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs leading-4 font-medium text-content-secondary mb-1">
                            Your Experience
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your experience with product quality and landed delivery..."
                            className="w-full p-3 rounded-xl bg-app-bg border border-app-border text-xs leading-4 text-content-primary focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                      </div>
                      <div className="px-4 py-3 border-t border-app-border bg-white flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveInfoModal(null)}
                          className="flex-1 h-11 rounded-xl border border-app-border text-xs leading-4 font-semibold text-content-secondary hover:bg-app-subtle"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs leading-4 font-semibold"
                        >
                          Submit Review
                        </button>
                      </div>
                    </form>
                  ) : activeInfoModal === 'supplier' ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-app-border flex items-center justify-between gap-2 shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shrink-0">
                            <Store className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm leading-5 font-semibold text-content-primary truncate">
                              {selectedProduct.supplierName}
                            </h3>
                            <p className="text-xs leading-4 text-brand-primary font-medium truncate">
                              Verified Tier-1 Global Exporter
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label="Close supplier modal"
                          onClick={() => setActiveInfoModal(null)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:bg-app-subtle shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3">
                        <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-app-bg border border-app-border text-xs leading-4">
                          <span className="text-content-secondary">
                            Catalog:{' '}
                            <strong className="tabular-nums text-content-primary">
                              {selectedProduct.supplierProductsCount}
                            </strong>
                          </span>
                          <span className="text-content-secondary">
                            Followers:{' '}
                            <strong className="tabular-nums text-content-primary">
                              {selectedProduct.supplierFollowers}
                            </strong>
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-content-secondary">
                          All shipments from {selectedProduct.supplierName} undergo
                          physical QC verification before boarding air freight.
                        </p>
                      </div>
                      <div className="px-4 py-3 border-t border-app-border bg-white shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInfoModal(null);
                            navigateTo('supplier_store');
                          }}
                          className="w-full h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs leading-4 font-semibold"
                        >
                          Open Supplier Storefront
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2.5 border-b border-app-border flex items-center justify-between gap-2 shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm leading-5 font-semibold text-content-primary truncate">
                              Warranty & Return Protection
                            </h3>
                            <p className="text-xs leading-4 text-content-secondary truncate">
                              {selectedProduct.returnPolicy || 'Up to 30 days return'} · {selectedProduct.specs.warranty || '1 year warranty'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label="Close warranty modal"
                          onClick={() => setActiveInfoModal(null)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:bg-app-subtle shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
                        <div className="divide-y divide-app-border text-xs leading-4 text-content-primary">
                          <div className="py-2.5 first:pt-0 flex items-start gap-2.5">
                            <RefreshCcw className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold block">
                                Easy Local Return Process
                              </span>
                              <span className="text-content-secondary leading-relaxed">
                                Drop off at our Dhaka hub or schedule free eCourier
                                pickup within 30 days.
                              </span>
                            </div>
                          </div>
                          <div className="py-2.5 flex items-start gap-2.5">
                            <Clock className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold block">
                                24-Hour bKash / Card Refund
                              </span>
                              <span className="text-content-secondary leading-relaxed">
                                Refunds are processed within 24 hours of return
                                inspection.
                              </span>
                            </div>
                          </div>
                          <div className="py-2.5 last:pb-0 flex items-start gap-2.5">
                            <MessageSquare className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold block">
                                24/7 Claims Support
                              </span>
                              <span className="text-content-secondary leading-relaxed">
                                Dedicated Bengali & English warranty support team.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 border-t border-app-border bg-white shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInfoModal(null);
                            showToast(
                              'Verified guarantee active on your order',
                              'info'
                            );
                          }}
                          className="w-full h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs leading-4 font-semibold transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.getElementById('mobile-sheet-root') || document.body
        )}
    </div>
  );
};
