import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  MessageSquare,
  Package,
  Plus,
  RefreshCcw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { ProductCard } from '../shared/ProductCard';

export const ProductDetailScreen: React.FC = () => {
  const {
    products,
    selectedProduct,
    selectedRouteByProduct,
    addToCart,
    addProductReview,
    navigateTo,
    formatPrice,
    language,
    showToast,
  } = useDeshiMart();

  const [selectedColor, setSelectedColor] = useState(
    selectedProduct.colors[0]?.name || 'Obsidian Black'
  );
  const [selectedSize, setSelectedSize] = useState(
    selectedProduct.sizes?.[2] || selectedProduct.sizes?.[0] || ''
  );
  const [activeImageView, setActiveImageView] = useState<0 | 1 | 2>(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setSelectedColor(selectedProduct.colors[0]?.name || 'Standard');
    setSelectedSize(selectedProduct.sizes?.[2] || selectedProduct.sizes?.[0] || '');
    setActiveImageView(0);
    setImgError(false);
  }, [selectedProduct]);

  const [activeInfoModal, setActiveInfoModal] = useState<
    null | 'supplier' | 'warranty' | 'review'
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

  const specRows = [
    { label: 'Display / Build', value: selectedProduct.specs.display },
    { label: 'Battery / Power', value: selectedProduct.specs.battery },
    { label: 'Durability', value: selectedProduct.specs.waterproof },
    { label: 'Sensors / Tech', value: selectedProduct.specs.heartRate },
    { label: 'Connectivity', value: selectedProduct.specs.gps },
    { label: 'Net Weight', value: selectedProduct.specs.weight },
    { label: 'Warranty', value: selectedProduct.specs.warranty },
  ].filter((row) => Boolean(row.value));

  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== selectedProduct.id && p.category === selectedProduct.category
    )
    .slice(0, 4);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addProductReview(selectedProduct.id, reviewRating, reviewComment.trim());
    setReviewComment('');
    setActiveInfoModal(null);
  };

  const galleryImages =
    selectedProduct.gallery && selectedProduct.gallery.length > 0
      ? selectedProduct.gallery
      : [selectedProduct.image];

  const activeImageSrc =
    galleryImages[activeImageView] || selectedProduct.image;

  const hasDistinctGalleryImages = galleryImages.length > 1;

  const viewTransformClasses = hasDistinctGalleryImages
    ? ['scale-100 rotate-0', 'scale-100 rotate-0', 'scale-100 rotate-0']
    : ['scale-100 rotate-0', 'scale-110 -rotate-2', 'scale-105 rotate-2'];

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

  return (
    <div className="flex-1 bg-white flex flex-col justify-between">
      <div className="p-4 space-y-6">
        {/* 1. Product Image Showcase + 3-Angle Selector */}
        <div className="space-y-2.5">
          <div className="relative w-full aspect-square max-h-64 rounded-xl bg-slate-50 border border-app-border p-4 overflow-hidden flex items-center justify-center">
            {!imgError ? (
              <motion.img
                key={`${selectedProduct.id}-${activeImageView}`}
                initial={{ opacity: 0.6, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.16 }}
                src={activeImageSrc}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className={`w-full h-full object-contain transition-transform duration-200 ${viewTransformClasses[activeImageView]}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <Package className="w-10 h-10 text-content-muted mb-2" />
                <span className="text-xs leading-4 font-medium text-content-secondary">
                  {selectedProduct.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2">
            {(['Studio', 'Detail', 'Profile'] as const).map((label, idx) => {
              const isSelected = activeImageView === idx;
              const thumbSrc = galleryImages[idx] || selectedProduct.image;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveImageView(idx as 0 | 1 | 2)}
                  className={`w-12 h-12 rounded-lg bg-slate-50 border overflow-hidden p-1.5 transition-all ${
                    isSelected
                      ? 'border-content-primary ring-1 ring-content-primary/10'
                      : 'border-app-border opacity-65 hover:opacity-100'
                  }`}
                >
                  <img
                    src={thumbSrc}
                    alt={`${selectedProduct.name} ${label}`}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-contain rounded ${
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
        </div>

        {/* 2. Product Title, Hero Price Container & Single Trust Banner */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs leading-4 text-content-secondary">
            <span className="flex items-center gap-1.5 text-content-primary font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
              {selectedProduct.originLabel}
            </span>
            <div className="flex items-center gap-2.5">
              <span>{activeRoute?.deliveryDays || '7–12 days'}</span>
              <button
                type="button"
                aria-label="Share product link"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast(`Copied verified link for ${selectedProduct.name}`);
                }}
                className="inline-flex items-center gap-1 text-content-secondary hover:text-content-primary font-medium"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-lg leading-6 font-semibold text-content-primary">
              {language === 'BN' ? selectedProduct.nameBn : selectedProduct.name}
            </h1>
            <p className="text-xs leading-4 text-content-secondary mt-1">
              {selectedProduct.subtitle}
            </p>
          </div>

          {/* Unboxed Rating & Price History Link */}
          <div className="flex items-center justify-between text-xs leading-4 text-content-secondary">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="tabular-nums font-semibold text-content-primary">
                {selectedProduct.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span>{selectedProduct.reviewCount.toLocaleString()} reviews</span>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('price_tracker')}
              className="text-xs leading-4 font-semibold text-brand-primary hover:underline"
            >
              {language === 'BN' ? 'প্রাইস হিস্ট্রি →' : '30-Day Price History →'}
            </button>
          </div>

          {/* Hero Price Container per DESIGN_SYSTEM_SPEC.md Section 5.2 */}
          <div className="pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tabular-nums text-content-primary">
                {formatPrice(totalLandedBdt)}
              </span>
              {selectedProduct.discountPercent > 0 && (
                <>
                  <span className="text-xs text-content-muted line-through tabular-nums">
                    {formatPrice(selectedProduct.originalLandedBdt)}
                  </span>
                  <span className="bg-promo-subtle text-promo-accent text-[11px] font-bold px-1.5 py-0.5 rounded tabular-nums">
                    -{selectedProduct.discountPercent}%
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-content-secondary mt-1">
              {language === 'BN'
                ? 'আপনার দরজায় পৌঁছানো পর্যন্ত সব খরচ অন্তর্ভুক্ত (ল্যান্ডেড প্রাইস)'
                : 'All-inclusive landed price at your doorstep'}
            </p>
          </div>

          {/* Single Trust Banner per DESIGN_SYSTEM_SPEC.md Section 5.2 */}
          <div className="flex items-center gap-3 p-3 bg-brand-subtle border border-brand-border rounded-xl">
            <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-primary">
                {language === 'BN'
                  ? '১০০% গ্যারান্টিযুক্ত ল্যান্ডেড প্রাইস'
                  : '100% Guaranteed Landed Price'}
              </p>
              <p className="text-[11px] text-content-secondary leading-relaxed">
                {language === 'BN'
                  ? 'কাস্টমস, ভ্যাট এবং লোকাল কুরিয়ার চার্জ প্রি-ক্লিয়ারড। ডেলিভারির সময় কোনো অতিরিক্ত চার্জ নেই।'
                  : 'Customs, NBR duty, and domestic transit pre-cleared. No surprise fees on delivery.'}
              </p>
            </div>
          </div>

          {/* Unboxed Feature Highlights */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-xs leading-4 text-content-secondary">
            {selectedProduct.highlights.map((hl, idx) => (
              <React.Fragment key={hl}>
                <span>{hl}</span>
                {idx < selectedProduct.highlights.length - 1 && (
                  <span aria-hidden="true" className="text-content-muted">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 3. Variant Selection (Color & Size) */}
        <section className="pt-4 border-t border-app-border space-y-3">
          <div>
            <span className="block text-xs leading-4 font-medium text-content-secondary mb-2">
              {language === 'BN' ? 'রঙ: ' : 'Color: '}
              <strong className="text-content-primary font-semibold">{selectedColor}</strong>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {selectedProduct.colors.map((c) => {
                const active = selectedColor === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`min-h-[40px] px-3 rounded-lg border flex items-center gap-2 text-xs leading-4 font-medium transition-colors ${
                      active
                        ? 'border-content-primary bg-content-primary text-white'
                        : 'border-app-border bg-white text-content-primary hover:border-app-borderStrong'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
            <div className="pt-1">
              <span className="block text-xs leading-4 font-medium text-content-secondary mb-2">
                Size (EU): <strong className="text-content-primary font-semibold">{selectedSize}</strong>
              </span>
              <div className="flex items-center gap-2">
                {selectedProduct.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`w-11 h-11 rounded-lg tabular-nums text-xs leading-4 font-semibold border transition-colors ${
                      selectedSize === sz
                        ? 'bg-content-primary text-white border-content-primary'
                        : 'bg-white text-content-primary border-app-border hover:border-app-borderStrong'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 4. Secondary Disclosure Accordion for Landed Cost & Customs Details (Anti-Jargon Rule) */}
        <section className="pt-4 border-t border-app-border">
          <details className="group">
            <summary className="list-none cursor-pointer flex items-center justify-between py-1 text-sm font-medium text-content-primary">
              <div>
                <span>
                  {language === 'BN'
                    ? 'ল্যান্ডেড প্রাইস ও কাস্টমস ডিউটি ব্রেকডাউন'
                    : 'Landed Cost & Customs Duty Breakdown'}
                </span>
                <p className="text-xs font-normal text-content-secondary mt-0.5">
                  {activeRoute?.name} · {activeRoute?.originCountry}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-content-secondary transition-transform group-open:rotate-180" />
            </summary>

            <div className="pt-3 mt-2 border-t border-app-border space-y-2 text-xs leading-4">
              <div className="flex justify-between text-content-secondary">
                <span>{language === 'BN' ? 'পণ্যের মূল দাম' : 'Factory Item Price'}</span>
                <span className="tabular-nums text-content-primary font-medium">
                  {formatPrice(baseBdt)}
                </span>
              </div>
              <div className="flex justify-between text-content-secondary">
                <span>
                  {language === 'BN'
                    ? `আন্তর্জাতিক শিপিং (${activeRoute?.deliveryDays})`
                    : `International Freight (${activeRoute?.deliveryDays})`}
                </span>
                <span className="tabular-nums text-content-primary font-medium">
                  {formatPrice(shippingBdt)}
                </span>
              </div>
              <div className="flex justify-between text-content-secondary">
                <span>
                  {language === 'BN'
                    ? 'কাস্টমস ডিউটি ও ভ্যাট (প্রি-পেইড)'
                    : 'Pre-paid Customs Duty & VAT'}
                </span>
                <span className="tabular-nums text-content-primary font-medium">
                  {formatPrice(dutyBdt + vatBdt)}
                </span>
              </div>
              <div className="flex justify-between text-content-secondary">
                <span>Customs Classification</span>
                <span className="tabular-nums text-content-secondary">
                  HS {resolvedHsCode}
                </span>
              </div>
              <div className="pt-2 border-t border-app-border flex justify-between items-center font-semibold text-content-primary">
                <span>Total Landed Price</span>
                <span className="tabular-nums text-sm font-bold text-content-primary">
                  {formatPrice(totalLandedBdt)}
                </span>
              </div>
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigateTo('seller_compare')}
                  className="text-xs font-semibold text-brand-primary hover:underline"
                >
                  {language === 'BN' ? '৩টি রুট তুলনা করুন →' : 'Compare 3 Shipping Routes →'}
                </button>
              </div>
            </div>
          </details>
        </section>

        {/* 5. Technical Specifications List */}
        <section className="pt-4 border-t border-app-border space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-content-primary">
              {language === 'BN' ? 'স্পেসিফিকেশন' : 'Specifications'}
            </h3>
            <button
              type="button"
              onClick={() => navigateTo('spec_compare')}
              className="text-xs leading-4 font-semibold text-brand-primary hover:underline"
            >
              {language === 'BN' ? 'তুলনা করুন →' : 'Compare Specs →'}
            </button>
          </div>
          <div className="divide-y divide-app-border text-xs leading-4">
            {specRows.map((row) => (
              <div key={row.label} className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-content-secondary">{row.label}</span>
                <span className="font-medium text-content-primary text-right">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Verified Supplier & Warranty Row */}
        <section className="pt-4 border-t border-app-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-app-subtle text-content-primary flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-content-primary">
                  {selectedProduct.supplierName}
                </h3>
                <p className="text-xs text-content-secondary">
                  On-time {activeRoute?.onTimeRate || '98%'} · Return{' '}
                  {activeRoute?.returnRate || '2%'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('supplier_store')}
              className="text-xs leading-4 font-semibold text-brand-primary hover:underline"
            >
              {language === 'BN' ? 'স্টোর দেখুন →' : 'Storefront →'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveInfoModal('warranty')}
            className="w-full pt-2.5 border-t border-app-border flex items-center justify-between text-xs leading-4 font-medium text-content-secondary hover:text-content-primary"
          >
            <span>{selectedProduct.specs.warranty}</span>
            <ChevronRight className="w-4 h-4 text-content-muted" />
          </button>
        </section>

        {/* 7. Verified Buyer Reviews */}
        <section className="pt-4 border-t border-app-border space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-content-primary">
              {language === 'BN'
                ? `ক্রেতা রিভিউ (${selectedProduct.reviewCount})`
                : `Buyer Reviews (${selectedProduct.reviewCount})`}
            </h3>
            <button
              type="button"
              onClick={() => setActiveInfoModal('review')}
              className="text-xs leading-4 font-semibold text-brand-primary flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'BN' ? 'রিভিউ লিখুন' : 'Write Review'}</span>
            </button>
          </div>

          {selectedProduct.reviews.length > 0 ? (
            <div className="divide-y divide-app-border">
              {selectedProduct.reviews.map((rev) => (
                <div key={rev.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between text-xs leading-4">
                    <span className="font-semibold text-content-primary">
                      {rev.author} <span className="text-brand-primary font-medium">· Verified</span>
                    </span>
                    <span className="text-xs text-content-muted">{rev.date}</span>
                  </div>
                  <p className="text-xs leading-4 text-content-secondary">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs leading-4 text-content-secondary">
              98% positive feedback from verified Bangladesh cross-border buyers.
            </p>
          )}
        </section>

        {/* 8. Related Global Products */}
        <section className="pt-4 border-t border-app-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-content-primary">
              {language === 'BN' ? 'সম্পর্কিত পণ্য' : 'Related Products'}
            </h3>
            <button
              type="button"
              onClick={() => navigateTo('category_products', { categoryId: 'all' })}
              className="text-xs leading-4 font-semibold text-brand-primary hover:underline"
            >
              {language === 'BN' ? 'সব দেখুন' : 'View All'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} compact />
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Bottom CTA per DESIGN_SYSTEM_SPEC.md Section 5.2 */}
      <div className="sticky bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-app-border p-3 flex gap-3">
        <button
          type="button"
          onClick={() =>
            addToCart(
              selectedProduct.id,
              1,
              selectedColor,
              selectedSize || undefined,
              activeRoute?.id
            )
          }
          className="h-12 px-4 rounded-lg border border-app-borderStrong bg-white text-content-primary hover:bg-app-subtle font-semibold text-xs leading-4 flex items-center justify-center gap-1.5 transition-colors shrink-0"
        >
          <ShoppingCart className="w-4 h-4 text-content-primary" />
          <span>{language === 'BN' ? 'ব্যাগে দিন' : 'Add to Bag'}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            addToCart(
              selectedProduct.id,
              1,
              selectedColor,
              selectedSize || undefined,
              activeRoute?.id
            );
            navigateTo('checkout_shipping');
          }}
          className="bg-brand-primary hover:bg-brand-hover text-white font-semibold rounded-lg h-12 flex-1 text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <span>
            {language === 'BN' ? 'এখনই কিনুন' : 'Buy Now'} ·{' '}
            <span className="tabular-nums">{formatPrice(totalLandedBdt)}</span>
          </span>
        </button>
      </div>

      {/* Supplier / Warranty / Review Bottom Sheet Modal */}
      <AnimatePresence>
        {activeInfoModal && (
          <div className="absolute inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveInfoModal(null)}
              className="absolute inset-0 bg-[#0F1D17]/55 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="relative z-10 w-full bg-white rounded-t-2xl p-4 shadow-2xl space-y-3 border-t border-app-border"
            >
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />

            {activeInfoModal === 'review' ? (
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <h3 className="text-sm leading-5 font-semibold text-content-primary">
                  {language === 'BN' ? 'আপনার রিভিউ দিন' : 'Write a Verified Review'}
                </h3>
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
                    className="w-full p-3 rounded-lg bg-app-subtle border border-app-border text-xs leading-4 text-content-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveInfoModal(null)}
                    className="flex-1 h-11 rounded-lg border border-app-border text-xs leading-4 font-semibold text-content-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-11 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs leading-4 font-semibold"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            ) : activeInfoModal === 'supplier' ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-app-subtle text-content-primary flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm leading-5 font-semibold text-content-primary">
                      {selectedProduct.supplierName}
                    </h3>
                    <p className="text-xs leading-4 text-brand-primary font-medium">
                      Verified Tier-1 Global Exporter
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-y border-app-border text-xs leading-4">
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
                <p className="text-xs leading-4 text-content-secondary">
                  All shipments from {selectedProduct.supplierName} undergo physical QC verification before boarding air freight.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveInfoModal(null);
                    navigateTo('supplier_store');
                  }}
                  className="w-full h-11 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs leading-4 font-semibold"
                >
                  Open Supplier Storefront
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm leading-5 font-semibold text-content-primary">
                      Warranty & Return Protection
                    </h3>
                    <p className="text-xs leading-4 text-content-secondary">
                      Up to 30 days return · 1 year local warranty
                    </p>
                  </div>
                </div>
                <div className="divide-y divide-app-border text-xs leading-4 text-content-primary">
                  <div className="py-2 flex items-start gap-2.5">
                    <RefreshCcw className="w-4 h-4 text-content-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Easy Local Return Process</span>
                      <span className="text-content-secondary">
                        Drop off at our Dhaka hub or schedule free eCourier pickup within 30 days.
                      </span>
                    </div>
                  </div>
                  <div className="py-2 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-content-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">24-Hour bKash / Card Refund</span>
                      <span className="text-content-secondary">
                        Refunds are processed within 24 hours of return inspection.
                      </span>
                    </div>
                  </div>
                  <div className="py-2 flex items-start gap-2.5">
                    <MessageSquare className="w-4 h-4 text-content-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">24/7 Claims Support</span>
                      <span className="text-content-secondary">
                        Dedicated Bengali & English warranty support team.
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveInfoModal(null);
                    showToast('Verified guarantee active on your order', 'info');
                  }}
                  className="w-full h-11 rounded-lg bg-content-primary text-white text-xs leading-4 font-semibold"
                >
                  Close
                </button>
              </>
            )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
