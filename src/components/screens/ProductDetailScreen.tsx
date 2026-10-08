import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Lock,
  MessageSquare,
  Package,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Truck,
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
    .filter((p) => p.id !== selectedProduct.id)
    .slice(0, 2);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addProductReview(selectedProduct.id, reviewRating, reviewComment.trim());
    setReviewComment('');
    setActiveInfoModal(null);
  };

  const viewTransformClasses = [
    'scale-100 rotate-0',
    'scale-110 -rotate-3',
    'scale-105 rotate-3',
  ];

  // 8pt Grid: p-4 (16px), space-y-4 (16px), gap-2 (8px), gap-3 (12px), h-10 (40px), h-12 (48px)
  return (
    <div className="flex-1 bg-white flex flex-col justify-between">
      {/* Clean Single-Surface Product Details (No Bento Grid Boxes) */}
      <div className="p-4 space-y-4">
        {/* 1. Product Image Showcase + Interactive 3-Angle Thumbnail Strip */}
        <div className="space-y-2">
          <div className="relative w-full aspect-square max-h-64 rounded-2xl bg-[#F8FAFC] border border-slate-100 overflow-hidden flex items-center justify-center">
            {!imgError ? (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className={`w-full h-full object-contain transition-transform duration-300 ${viewTransformClasses[activeImageView]}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <Package className="w-12 h-12 text-[#0EA75F] mb-2" />
                <span className="text-xs leading-4 font-bold text-[#0B3D2E]">
                  {selectedProduct.name}
                </span>
              </div>
            )}

            <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200/80 text-[10px] leading-4 font-bold text-[#0B3D2E]">
              {activeImageView === 0
                ? 'Studio View'
                : activeImageView === 1
                ? 'Close-Up Detail'
                : 'Side Profile'}
            </div>
          </div>

          {/* 3-Angle Thumbnail Selector Row (w-12 h-12 = 48px = 6*8, gap-2 = 8px) */}
          <div className="flex items-center justify-center gap-2">
            {(['Studio', 'Detail', 'Profile'] as const).map((label, idx) => {
              const isSelected = activeImageView === idx;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveImageView(idx as 0 | 1 | 2)}
                  className={`w-12 h-12 rounded-xl bg-[#F8FAFC] border overflow-hidden p-1 transition-all ${
                    isSelected
                      ? 'border-2 border-[#0EA75F] ring-2 ring-[#0EA75F]/20'
                      : 'border-slate-200 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={selectedProduct.image}
                    alt={`${selectedProduct.name} ${label}`}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover rounded-lg ${
                      idx === 1 ? 'scale-125' : idx === 2 ? 'scale-110 rotate-6' : ''
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Core Product Title, Origin, Rating, Price & DropScore */}
        <div className="space-y-2">
          {/* Unboxed Origin & Delivery Metadata */}
          <div className="flex items-center justify-between text-xs leading-4 text-[#6B7280]">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#0EA75F]" />
              <span className="font-semibold text-[#0B3D2E]">
                {selectedProduct.originLabel} · Verified Supplier
              </span>
            </div>
            <span className="text-[#0EA75F] font-bold">
              {activeRoute?.deliveryDays || '7–12 days'}
            </span>
          </div>

          <div>
            <h1 className="text-lg leading-6 font-extrabold text-[#0B3D2E]">
              {language === 'BN' ? selectedProduct.nameBn : selectedProduct.name}
            </h1>
            <p className="text-xs leading-4 text-[#6B7280] mt-1">
              {selectedProduct.subtitle}
            </p>
          </div>

          {/* Rating & Reviews Summary */}
          <div className="flex items-center justify-between text-xs leading-4 text-[#6B7280]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span className="font-mono-num font-bold text-[#0B3D2E]">
                {selectedProduct.rating.toFixed(1)}
              </span>
              <span>({selectedProduct.reviewCount.toLocaleString()} reviews)</span>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('price_tracker')}
              className="text-xs leading-4 font-bold text-[#0EA75F] hover:underline"
            >
              {language === 'BN' ? 'প্রাইস হিস্ট্রি দেখুন' : 'Price History →'}
            </button>
          </div>

          {/* Primary Landed Price Callout (24px / 32px line-height = 4*8) */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-mono-num text-2xl leading-8 font-extrabold text-[#0EA75F]">
              {formatPrice(totalLandedBdt)}
            </span>
            <span className="font-mono-num text-xs leading-4 text-slate-400 line-through">
              {formatPrice(selectedProduct.originalLandedBdt)}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-[#ECFDF5] text-xs leading-4 font-mono-num font-extrabold text-[#0EA75F]">
              -{selectedProduct.discountPercent}% OFF
            </span>
          </div>

          {/* Signature DropScore™ Component */}
          <DropScoreBadge
            score={selectedProduct.dropScore}
            label={selectedProduct.dropScoreLabel}
          />

          {/* Unboxed Feature Highlights */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-xs leading-4 text-[#6B7280]">
            {selectedProduct.highlights.map((hl, idx) => (
              <React.Fragment key={hl}>
                <span className="text-[#0B3D2E] font-medium">{hl}</span>
                {idx < selectedProduct.highlights.length - 1 && (
                  <span aria-hidden="true">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 3. Clean Landed Cost Breakdown */}
        <section className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs leading-4 font-extrabold text-[#0B3D2E]">
                {language === 'BN'
                  ? 'ল্যান্ডেড প্রাইস ব্রেকডাউন (সকল খরচসহ)'
                  : 'Landed Cost Breakdown'}
              </h2>
              <p className="text-[11px] leading-4 text-[#6B7280] mt-0.5">
                {activeRoute?.name} · {activeRoute?.originCountry}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('seller_compare')}
              className="text-xs leading-4 font-bold text-[#0EA75F] hover:underline"
            >
              {language === 'BN' ? 'রুট তুলনা করুন' : 'Compare Routes →'}
            </button>
          </div>

          <div className="space-y-2 text-xs leading-4 pt-1">
            <div className="flex justify-between text-[#6B7280]">
              <span>{language === 'BN' ? 'পণ্যের মূল দাম' : 'Product Price'}</span>
              <span className="font-mono-num font-semibold text-[#0B3D2E]">
                {formatPrice(baseBdt)}
              </span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>
                {language === 'BN'
                  ? `শিপিং চার্জ (${activeRoute?.deliveryDays})`
                  : `Shipping (${activeRoute?.deliveryDays})`}
              </span>
              <span className="font-mono-num font-semibold text-[#0B3D2E]">
                {formatPrice(shippingBdt)}
              </span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>
                {language === 'BN'
                  ? 'ইমপোর্ট ডিউটি (১০%)'
                  : 'Import Duty (10%)'}
              </span>
              <span className="font-mono-num font-semibold text-[#0B3D2E]">
                {formatPrice(dutyBdt)}
              </span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>
                {language === 'BN' ? 'ভ্যাট (১৫%)' : 'VAT (15%)'}
              </span>
              <span className="font-mono-num font-semibold text-[#0B3D2E]">
                {formatPrice(vatBdt)}
              </span>
            </div>
            <div className="p-3 mt-1 rounded-xl bg-[#ECFDF5] flex justify-between items-center font-bold text-[#0B3D2E]">
              <span>
                {language === 'BN'
                  ? 'সর্বমোট ল্যান্ডেড প্রাইস'
                  : 'Total Landed Cost'}
              </span>
              <span className="font-mono-num text-sm leading-5 font-extrabold text-[#0EA75F]">
                {formatPrice(totalLandedBdt)}
              </span>
            </div>
          </div>
        </section>

        {/* 4. Variant Selection (Color & Size) */}
        <section className="pt-4 border-t border-slate-100 space-y-3">
          <div>
            <span className="block text-xs leading-4 font-bold text-[#0B3D2E] mb-2">
              {language === 'BN' ? 'রঙ (Color): ' : 'Color: '}
              <span className="text-[#0EA75F]">{selectedColor}</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {selectedProduct.colors.map((c) => {
                const active = selectedColor === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`h-8 px-3 rounded-xl border flex items-center gap-2 text-xs leading-4 font-semibold transition-all ${
                      active
                        ? 'border-[#0EA75F] bg-[#ECFDF5] text-[#0B3D2E]'
                        : 'border-slate-200 bg-white text-[#6B7280]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
            <div className="pt-2">
              <span className="block text-xs leading-4 font-bold text-[#0B3D2E] mb-2">
                Size (EU): <span className="text-[#0EA75F]">{selectedSize}</span>
              </span>
              <div className="flex items-center gap-2">
                {selectedProduct.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`w-10 h-10 rounded-xl font-mono-num text-xs leading-4 font-bold border transition-colors ${
                      selectedSize === sz
                        ? 'bg-[#0EA75F] text-white border-[#0EA75F]'
                        : 'bg-white text-[#0B3D2E] border-slate-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clean Inline Trust Row */}
          <div className="pt-2 flex items-center justify-between text-[11px] leading-4 text-[#6B7280]">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#0EA75F]" />
              <span>Worldwide Shipping</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <RefreshCcw className="w-3.5 h-3.5 text-[#0EA75F]" />
              <span>30 Days Return</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#0EA75F]" />
              <span>Secure Payment</span>
            </span>
          </div>
        </section>

        {/* 5. Technical Specifications List */}
        <section className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs leading-4 font-extrabold text-[#0B3D2E]">
              {language === 'BN' ? 'টেকনিক্যাল স্পেসিফিকেশন' : 'Technical Specifications'}
            </h3>
            <button
              type="button"
              onClick={() => navigateTo('spec_compare')}
              className="text-xs leading-4 font-bold text-[#0EA75F] hover:underline"
            >
              {language === 'BN' ? 'তুলনা করুন →' : 'Compare Specs →'}
            </button>
          </div>
          <div className="divide-y divide-slate-100 text-xs leading-4">
            {specRows.map((row) => (
              <div key={row.label} className="py-2 flex items-center justify-between gap-4">
                <span className="text-[#6B7280]">{row.label}</span>
                <span className="font-semibold text-[#0B3D2E] text-right">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Verified Supplier & Warranty Row */}
        <section className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="text-xs leading-4 font-extrabold text-[#0B3D2E]">
                    {selectedProduct.supplierName}
                  </h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0EA75F]" />
                </div>
                <p className="text-[11px] leading-4 text-[#6B7280] mt-0.5">
                  On-time {activeRoute?.onTimeRate || '98%'} · Return{' '}
                  {activeRoute?.returnRate || '2%'} · Response{' '}
                  {activeRoute?.responseTime || '< 6h'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('supplier_store')}
              className="text-xs leading-4 font-bold text-[#0EA75F] hover:underline"
            >
              {language === 'BN' ? 'স্টোর দেখুন →' : 'Visit Store →'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveInfoModal('warranty')}
            className="w-full pt-2 border-t border-slate-100 flex items-center justify-between text-xs leading-4 font-semibold text-[#0B3D2E] hover:text-[#0EA75F]"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0EA75F]" />
              <span>{selectedProduct.specs.warranty}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </section>

        {/* 7. Verified Buyer Reviews + Write a Review */}
        <section className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs leading-4 font-extrabold text-[#0B3D2E]">
              {language === 'BN'
                ? `ভেরিফাইড ক্রেতা রিভিউ (${selectedProduct.reviewCount})`
                : `Verified Buyer Reviews (${selectedProduct.reviewCount})`}
            </h3>
            <button
              type="button"
              onClick={() => setActiveInfoModal('review')}
              className="text-xs leading-4 font-bold text-[#0EA75F] flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'BN' ? 'রিভিউ লিখুন' : 'Write Review'}</span>
            </button>
          </div>

          {selectedProduct.reviews.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {selectedProduct.reviews.map((rev) => (
                <div key={rev.id} className="py-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs leading-4 font-bold text-[#0B3D2E]">
                      {rev.author} ·{' '}
                      <span className="text-[#0EA75F] font-medium">Verified Buyer</span>
                    </span>
                    <span className="text-[10px] leading-4 text-[#6B7280]">{rev.date}</span>
                  </div>
                  <p className="text-xs leading-4 text-[#0B3D2E]">{rev.comment}</p>
                  <p className="text-[10px] leading-4 text-[#6B7280]">{rev.variantChosen}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs leading-4 text-[#6B7280]">
              98% positive feedback from verified Bangladesh cross-border buyers.
            </p>
          )}
        </section>

        {/* 8. Related Global Products */}
        <section className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs leading-4 font-extrabold text-[#0B3D2E]">
              {language === 'BN' ? 'আপনার জন্য আরও পণ্য' : 'You May Also Like'}
            </h3>
            <button
              type="button"
              onClick={() => navigateTo('category_products', { categoryId: 'all' })}
              className="text-xs leading-4 font-bold text-[#0EA75F]"
            >
              {language === 'BN' ? 'সব দেখুন' : 'View All'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} compact />
            ))}
          </div>
        </section>
      </div>

      {/* Contiguous Sticky Bottom Purchase Bar Docked Above Fixed Bottom Nav (p-3 = 12px, gap-2 = 8px, h-12 = 48px) */}
      <div className="sticky bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 flex items-center gap-2 shadow-[0_-8px_20px_-6px_rgba(0,0,0,0.08)]">
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
          className="flex-1 h-12 rounded-xl border-2 border-[#0EA75F] text-[#0EA75F] hover:bg-[#ECFDF5] font-bold text-xs leading-4 flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{language === 'BN' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
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
          className="flex-1 h-12 rounded-xl bg-[#0EA75F] hover:bg-[#0B8A4D] text-white font-bold text-xs leading-4 flex items-center justify-center gap-2 shadow-md transition-colors"
        >
          <span>
            {language === 'BN' ? 'এখনই কিনুন' : 'Buy Now'} ·{' '}
            {formatPrice(totalLandedBdt)}
          </span>
        </button>
      </div>

      {/* Supplier / Warranty / Review Bottom Sheet Modal */}
      {activeInfoModal && (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
          <div
            onClick={() => setActiveInfoModal(null)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="relative z-10 w-full bg-white rounded-t-3xl p-4 shadow-2xl space-y-3">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />

            {activeInfoModal === 'review' ? (
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <h3 className="text-sm leading-5 font-extrabold text-[#0B3D2E]">
                  {language === 'BN' ? 'আপনার রিভিউ দিন' : 'Write a Verified Review'}
                </h3>
                <div>
                  <span className="block text-xs leading-4 font-semibold text-[#6B7280] mb-1">
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
                  <label className="block text-xs leading-4 font-semibold text-[#0B3D2E] mb-1">
                    Your Experience
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with product quality and landed delivery..."
                    className="w-full p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs leading-4 text-[#0B3D2E] focus:outline-none focus:border-[#0EA75F]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveInfoModal(null)}
                    className="flex-1 h-10 rounded-xl border border-slate-200 text-xs leading-4 font-bold text-[#6B7280]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-[#0EA75F] text-white text-xs leading-4 font-bold"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            ) : activeInfoModal === 'supplier' ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm leading-5 font-extrabold text-[#0B3D2E]">
                      {selectedProduct.supplierName}
                    </h3>
                    <p className="text-xs leading-4 text-[#0EA75F] font-semibold">
                      Verified Tier-1 Global Exporter
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-y border-slate-100 text-xs leading-4">
                  <span className="text-[#6B7280]">
                    Catalog:{' '}
                    <strong className="font-mono-num text-[#0B3D2E]">
                      {selectedProduct.supplierProductsCount}
                    </strong>
                  </span>
                  <span className="text-[#6B7280]">
                    Followers:{' '}
                    <strong className="font-mono-num text-[#0B3D2E]">
                      {selectedProduct.supplierFollowers}
                    </strong>
                  </span>
                </div>
                <p className="text-xs leading-4 text-[#6B7280]">
                  All shipments from {selectedProduct.supplierName} undergo automated X-ray and physical QC verification at DeshiMart hub before boarding air freight.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveInfoModal(null);
                    navigateTo('supplier_store');
                  }}
                  className="w-full h-10 rounded-xl bg-[#0EA75F] text-white text-xs leading-4 font-bold"
                >
                  Open Full Supplier Store
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm leading-5 font-extrabold text-[#0B3D2E]">
                      Warranty & Return Protection
                    </h3>
                    <p className="text-xs leading-4 text-[#6B7280]">
                      Up to 30 days return · 1 year local warranty
                    </p>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 text-xs leading-4 text-[#0B3D2E]">
                  <div className="py-2 flex items-start gap-2">
                    <RefreshCcw className="w-4 h-4 text-[#0EA75F] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Easy Local Return Process</span>
                      <span className="text-[#6B7280]">
                        Drop off at our Dhaka hub or schedule free eCourier pickup within 30 days.
                      </span>
                    </div>
                  </div>
                  <div className="py-2 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#0EA75F] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Instant bKash / Card Refund</span>
                      <span className="text-[#6B7280]">
                        Refunds are processed within 24 hours of return inspection.
                      </span>
                    </div>
                  </div>
                  <div className="py-2 flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-[#0EA75F] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">24/7 Claims Support</span>
                      <span className="text-[#6B7280]">
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
                  className="w-full h-10 rounded-xl bg-[#0EA75F] text-white text-xs leading-4 font-bold"
                >
                  Got It
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
