import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
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
import { DropScoreBadge } from '../shared/DropScoreBadge';
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

  const viewTransformClasses = [
    'scale-100 rotate-0',
    'scale-110 -rotate-2',
    'scale-105 rotate-2',
  ];

  // Clean Single-Surface Product Detail Architecture (No Nested Card Clutter)
  return (
    <div className="flex-1 bg-white flex flex-col justify-between">
      <div className="p-4 space-y-5">
        {/* 1. Product Image Showcase + 3-Angle Selector */}
        <div className="space-y-2">
          <div className="relative w-full aspect-square max-h-64 rounded-2xl bg-white border border-slate-200/80 p-4 overflow-hidden flex items-center justify-center">
            {!imgError ? (
              <motion.img
                key={`${selectedProduct.id}-${activeImageView}`}
                initial={{ opacity: 0.6, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.16 }}
                src={selectedProduct.image}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className={`w-full h-full object-contain transition-transform duration-200 ${viewTransformClasses[activeImageView]}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <Package className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-xs leading-4 font-medium text-slate-700">
                  {selectedProduct.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2">
            {(['Studio', 'Detail', 'Profile'] as const).map((label, idx) => {
              const isSelected = activeImageView === idx;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveImageView(idx as 0 | 1 | 2)}
                  className={`w-12 h-12 rounded-xl bg-white border overflow-hidden p-1.5 transition-all ${
                    isSelected
                      ? 'border-slate-900'
                      : 'border-slate-200 opacity-65 hover:opacity-100'
                  }`}
                >
                  <img
                    src={selectedProduct.image}
                    alt={`${selectedProduct.name} ${label}`}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-contain rounded-lg ${
                      idx === 1 ? 'scale-125' : idx === 2 ? 'scale-110 rotate-3' : ''
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Product Title, Unboxed Metadata, Landed Price & DropScore */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs leading-4 text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              {selectedProduct.originLabel}
            </span>
            <div className="flex items-center gap-2.5">
              <span>{activeRoute?.deliveryDays || '7–12 days'} delivery</span>
              <button
                type="button"
                aria-label="Share product link"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast(`Copied verified link for ${selectedProduct.name}`);
                }}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
              >
                <Share2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-lg leading-6 font-semibold text-slate-900">
              {language === 'BN' ? selectedProduct.nameBn : selectedProduct.name}
            </h1>
            <p className="text-xs leading-4 text-slate-500 mt-1">
              {selectedProduct.subtitle}
            </p>
          </div>

          {/* Unboxed Rating & Price History Link */}
          <div className="flex items-center justify-between text-xs leading-4 text-slate-500">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono-num font-semibold text-slate-900">
                {selectedProduct.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span>{selectedProduct.reviewCount.toLocaleString()} reviews</span>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('price_tracker')}
              className="text-xs leading-4 font-medium text-[#059669] hover:underline"
            >
              {language === 'BN' ? 'প্রাইস হিস্ট্রি →' : '30-Day Price History →'}
            </button>
          </div>

          {/* Primary Landed Price Callout (Zero-Pill Unboxed Metadata) */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-mono-num text-2xl leading-8 font-semibold text-slate-900">
              {formatPrice(totalLandedBdt)}
            </span>
            <span className="font-mono-num text-xs leading-4 text-slate-400 line-through">
              {formatPrice(selectedProduct.originalLandedBdt)}
            </span>
            <span className="text-xs leading-4 font-mono-num font-medium text-[#059669]">
              Save {selectedProduct.discountPercent}%
            </span>
          </div>

          {/* Editorial DropScore Row */}
          <DropScoreBadge
            score={selectedProduct.dropScore}
            label={selectedProduct.dropScoreLabel}
          />

          {/* Unboxed Feature Highlights */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-xs leading-4 text-slate-500">
            {selectedProduct.highlights.map((hl, idx) => (
              <React.Fragment key={hl}>
                <span className="text-slate-700">{hl}</span>
                {idx < selectedProduct.highlights.length - 1 && (
                  <span aria-hidden="true">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 3. Transparent Landed Cost Breakdown */}
        <section className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs leading-4 font-semibold text-slate-900">
                {language === 'BN'
                  ? 'ল্যান্ডেড প্রাইস ব্রেকডাউন'
                  : 'True Landed Cost Breakdown'}
              </h2>
              <p className="text-[11px] leading-4 text-slate-500 mt-0.5">
                {activeRoute?.name} · {activeRoute?.originCountry}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('seller_compare')}
              className="text-xs leading-4 font-medium text-[#059669] hover:underline"
            >
              {language === 'BN' ? '৩ রুট তুলনা →' : 'Compare 3 Routes →'}
            </button>
          </div>

          <div className="space-y-1.5 text-xs leading-4 pt-1">
            <div className="flex justify-between text-slate-500">
              <span>{language === 'BN' ? 'পণ্যের মূল দাম' : 'Factory Price'}</span>
              <span className="font-mono-num text-slate-900">
                {formatPrice(baseBdt)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>
                {language === 'BN'
                  ? `শিপিং (${activeRoute?.deliveryDays})`
                  : `International Shipping (${activeRoute?.deliveryDays})`}
              </span>
              <span className="font-mono-num text-slate-900">
                {formatPrice(shippingBdt)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>
                {language === 'BN'
                  ? 'ইমপোর্ট ডিউটি (১০%)'
                  : 'Customs Import Duty (10%)'}
              </span>
              <span className="font-mono-num text-slate-900">
                {formatPrice(dutyBdt)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>{language === 'BN' ? 'ভ্যাট (১৫%)' : 'Bangladesh VAT (15%)'}</span>
              <span className="font-mono-num text-slate-900">
                {formatPrice(vatBdt)}
              </span>
            </div>
            <div className="pt-2.5 mt-1 border-t border-slate-100 flex justify-between items-center font-semibold text-slate-900">
              <span>
                {language === 'BN'
                  ? 'সর্বমোট ল্যান্ডেড প্রাইস'
                  : 'Total Landed Price'}
              </span>
              <span className="font-mono-num text-sm leading-5 text-[#059669]">
                {formatPrice(totalLandedBdt)}
              </span>
            </div>

            {/* Official Bangladesh NBR Customs HS-Code Tariff Classification */}
            <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-[11px] leading-4 text-slate-600">
              <span>
                NBR Customs HS-Code:{' '}
                <strong className="font-mono-num text-slate-900 font-semibold">
                  {selectedProduct.category === 'electronics'
                    ? '8517.62.00'
                    : selectedProduct.category === 'fashion'
                    ? '6203.42.00'
                    : selectedProduct.category === 'home_living'
                    ? '9405.42.00'
                    : '3304.99.00'}
                </strong>
              </span>
              <span className="text-[#059669] font-medium">Pre-Cleared CIF</span>
            </div>
          </div>
        </section>

        {/* 4. Variant Selection (Color & Size) */}
        <section className="pt-4 border-t border-slate-100 space-y-3">
          <div>
            <span className="block text-xs leading-4 font-medium text-slate-500 mb-2">
              {language === 'BN' ? 'রঙ: ' : 'Color: '}
              <strong className="text-slate-900 font-semibold">{selectedColor}</strong>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {selectedProduct.colors.map((c) => {
                const active = selectedColor === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`h-8 px-3 rounded-lg border flex items-center gap-2 text-xs leading-4 font-medium transition-colors ${
                      active
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
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
              <span className="block text-xs leading-4 font-medium text-slate-500 mb-2">
                Size (EU): <strong className="text-slate-900 font-semibold">{selectedSize}</strong>
              </span>
              <div className="flex items-center gap-2">
                {selectedProduct.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`w-10 h-10 rounded-lg font-mono-num text-xs leading-4 font-semibold border transition-colors ${
                      selectedSize === sz
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Unboxed Guarantee Metadata */}
          <div className="pt-1 text-[11px] leading-4 text-slate-500 flex items-center gap-1.5">
            <span>Worldwide Air Freight</span>
            <span aria-hidden="true">·</span>
            <span>30-Day Dhaka Return</span>
            <span aria-hidden="true">·</span>
            <span>COD & bKash</span>
          </div>
        </section>

        {/* 5. Technical Specifications List */}
        <section className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs leading-4 font-semibold text-slate-900">
              {language === 'BN' ? 'স্পেসিফিকেশন' : 'Specifications'}
            </h3>
            <button
              type="button"
              onClick={() => navigateTo('spec_compare')}
              className="text-xs leading-4 font-medium text-[#059669] hover:underline"
            >
              {language === 'BN' ? 'তুলনা করুন →' : 'Compare Specs →'}
            </button>
          </div>
          <div className="divide-y divide-slate-100 text-xs leading-4">
            {specRows.map((row) => (
              <div key={row.label} className="py-2 flex items-center justify-between gap-4">
                <span className="text-slate-500">{row.label}</span>
                <span className="font-medium text-slate-900 text-right">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Verified Supplier & Warranty Row */}
        <section className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs leading-4 font-semibold text-slate-900">
                  {selectedProduct.supplierName}
                </h3>
                <p className="text-[11px] leading-4 text-slate-500 mt-0.5">
                  On-time {activeRoute?.onTimeRate || '98%'} · Return{' '}
                  {activeRoute?.returnRate || '2%'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('supplier_store')}
              className="text-xs leading-4 font-medium text-[#059669] hover:underline"
            >
              {language === 'BN' ? 'স্টোর দেখুন →' : 'Storefront →'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveInfoModal('warranty')}
            className="w-full pt-2 border-t border-slate-100 flex items-center justify-between text-xs leading-4 font-medium text-slate-700 hover:text-slate-900"
          >
            <span>{selectedProduct.specs.warranty}</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </section>

        {/* 7. Verified Buyer Reviews */}
        <section className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs leading-4 font-semibold text-slate-900">
              {language === 'BN'
                ? `ক্রেতা রিভিউ (${selectedProduct.reviewCount})`
                : `Buyer Reviews (${selectedProduct.reviewCount})`}
            </h3>
            <button
              type="button"
              onClick={() => setActiveInfoModal('review')}
              className="text-xs leading-4 font-medium text-[#059669] flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'BN' ? 'রিভিউ লিখুন' : 'Write Review'}</span>
            </button>
          </div>

          {selectedProduct.reviews.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {selectedProduct.reviews.map((rev) => (
                <div key={rev.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between text-xs leading-4">
                    <span className="font-semibold text-slate-900">
                      {rev.author} <span className="text-slate-400 font-normal">· Verified</span>
                    </span>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                  <p className="text-xs leading-4 text-slate-600">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs leading-4 text-slate-500">
              98% positive feedback from verified Bangladesh cross-border buyers.
            </p>
          )}
        </section>

        {/* 8. Related Global Products */}
        <section className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs leading-4 font-semibold text-slate-900">
              {language === 'BN' ? 'সম্পর্কিত পণ্য' : 'Related Products'}
            </h3>
            <button
              type="button"
              onClick={() => navigateTo('category_products', { categoryId: 'all' })}
              className="text-xs leading-4 font-medium text-slate-500 hover:text-slate-900"
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

      {/* Sticky Bottom Purchase Bar (Single Emerald Primary CTA) */}
      <div className="sticky bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 flex items-center gap-2">
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
          className="h-11 px-4 rounded-xl border border-slate-200 text-slate-900 hover:bg-slate-50 font-semibold text-xs leading-4 flex items-center justify-center gap-1.5 transition-colors shrink-0"
        >
          <ShoppingCart className="w-4 h-4" />
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
          className="flex-1 h-11 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs leading-4 flex items-center justify-center gap-2 transition-colors"
        >
          <span>
            {language === 'BN' ? 'এখনই কিনুন' : 'Buy Now'} ·{' '}
            <span className="font-mono-num">{formatPrice(totalLandedBdt)}</span>
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
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="relative z-10 w-full bg-white rounded-t-3xl p-4 shadow-2xl space-y-3"
            >
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />

            {activeInfoModal === 'review' ? (
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <h3 className="text-sm leading-5 font-semibold text-slate-900">
                  {language === 'BN' ? 'আপনার রিভিউ দিন' : 'Write a Verified Review'}
                </h3>
                <div>
                  <span className="block text-xs leading-4 font-medium text-slate-500 mb-1">
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
                  <label className="block text-xs leading-4 font-medium text-slate-700 mb-1">
                    Your Experience
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with product quality and landed delivery..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-4 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveInfoModal(null)}
                    className="flex-1 h-10 rounded-xl border border-slate-200 text-xs leading-4 font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-[#059669] text-white text-xs leading-4 font-semibold"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            ) : activeInfoModal === 'supplier' ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm leading-5 font-semibold text-slate-900">
                      {selectedProduct.supplierName}
                    </h3>
                    <p className="text-xs leading-4 text-[#059669] font-medium">
                      Verified Tier-1 Global Exporter
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-y border-slate-100 text-xs leading-4">
                  <span className="text-slate-500">
                    Catalog:{' '}
                    <strong className="font-mono-num text-slate-900">
                      {selectedProduct.supplierProductsCount}
                    </strong>
                  </span>
                  <span className="text-slate-500">
                    Followers:{' '}
                    <strong className="font-mono-num text-slate-900">
                      {selectedProduct.supplierFollowers}
                    </strong>
                  </span>
                </div>
                <p className="text-xs leading-4 text-slate-600">
                  All shipments from {selectedProduct.supplierName} undergo physical QC verification before boarding air freight.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveInfoModal(null);
                    navigateTo('supplier_store');
                  }}
                  className="w-full h-10 rounded-xl bg-slate-900 text-white text-xs leading-4 font-semibold"
                >
                  Open Supplier Storefront
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#059669]" />
                  </div>
                  <div>
                    <h3 className="text-sm leading-5 font-semibold text-slate-900">
                      Warranty & Return Protection
                    </h3>
                    <p className="text-xs leading-4 text-slate-500">
                      Up to 30 days return · 1 year local warranty
                    </p>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 text-xs leading-4 text-slate-900">
                  <div className="py-2 flex items-start gap-2.5">
                    <RefreshCcw className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Easy Local Return Process</span>
                      <span className="text-slate-500">
                        Drop off at our Dhaka hub or schedule free eCourier pickup within 30 days.
                      </span>
                    </div>
                  </div>
                  <div className="py-2 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">24-Hour bKash / Card Refund</span>
                      <span className="text-slate-500">
                        Refunds are processed within 24 hours of return inspection.
                      </span>
                    </div>
                  </div>
                  <div className="py-2 flex items-start gap-2.5">
                    <MessageSquare className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">24/7 Claims Support</span>
                      <span className="text-slate-500">
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
                  className="w-full h-10 rounded-xl bg-slate-900 text-white text-xs leading-4 font-semibold"
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
