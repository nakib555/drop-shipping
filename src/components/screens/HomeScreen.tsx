import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Plus,
  Scale,
  Search,
  Star,
  TrendingDown,
  Truck,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { CATEGORIES } from '../../data/catalogData';
import { CategoryId } from '../../types/deshimart';
import { ProductCard } from '../shared/ProductCard';

export const HomeScreen: React.FC = () => {
  const {
    products,
    navigateTo,
    addToCart,
    searchQuery,
    setSearchQuery,
    smartFilters,
    setSmartFilters,
    language,
    formatPrice,
  } = useDeshiMart();

  const [homeCategory, setHomeCategory] = useState<CategoryId>('all');
  const [visibleLimit, setVisibleLimit] = useState<number>(24);

  // 1. Interactive 3-Slide Hero Banner Carousel State
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDirection, setHeroDirection] = useState(1);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  // Horizontal Flash Drops Slider Ref
  const dealsSliderRef = useRef<HTMLDivElement | null>(null);

  const heroSlides = [
    {
      id: 'hero-direct',
      kicker:
        language === 'BN'
          ? 'কাস্টমস ডিউটি ও ১৫% ভ্যাট অন্তর্ভুক্ত'
          : 'Customs Duty & 15% VAT Included',
      title:
        language === 'BN'
          ? 'গ্লোবাল ফ্যাক্টরি থেকে সরাসরি আপনার দরজায়'
          : 'Direct Factory Finds, Delivered to Dhaka',
      subtitle:
        language === 'BN'
          ? 'ডেলিভারির সময় কোনো অতিরিক্ত কাস্টমস চার্জ নেই।'
          : 'Compare 3 shipping routes with zero surprise fees on arrival.',
      primaryLabel: language === 'BN' ? 'ক্যাটালগ দেখুন' : 'Explore Catalog',
      primaryAction: () => navigateTo('category_products', { categoryId: 'all' }),
      secondaryLabel: language === 'BN' ? '৩ রুট তুলনা' : 'Compare Routes',
      secondaryAction: () => navigateTo('seller_compare'),
      product: products[0],
    },
    {
      id: 'hero-price-drop',
      kicker:
        language === 'BN'
          ? '৩০ দিনের সর্বনিম্ন ল্যান্ডেড প্রাইস'
          : 'Verified 30-Day Landed Price Drops',
      title:
        language === 'BN'
          ? 'আসল দাম ট্র্যাক করুন, সেরা ডিল কিনুন'
          : 'Track Real Price History Before You Buy',
      subtitle:
        language === 'BN'
          ? 'প্রতিটি পণ্যের ৩০ দিনের দামের ওঠানামা ও ড্রপস্কোর দেখুন।'
          : 'Inspect 30-day landed lows and instant price-drop alerts.',
      primaryLabel: language === 'BN' ? 'প্রাইস হিস্ট্রি' : 'Price Tracker',
      primaryAction: () => navigateTo('price_tracker'),
      secondaryLabel: language === 'BN' ? 'সব ডিল দেখুন' : 'View Drops',
      secondaryAction: () => navigateTo('category_products', { categoryId: 'electronics' }),
      product: products[1] || products[0],
    },
    {
      id: 'hero-fast-air',
      kicker:
        language === 'BN'
          ? 'এক্সপ্রেস এয়ার ও ঢাকা রেডি হাব'
          : 'Express Air Charter & BD Ready Stock',
      title:
        language === 'BN'
          ? '৩ থেকে ৭ দিনে দ্রুত ডোরস্টেপ ডেলিভারি'
          : 'Fast 3–7 Day Delivery Across Bangladesh',
      subtitle:
        language === 'BN'
          ? 'বিকাশ, নগদ অথবা ক্যাশ অন ডেলিভারিতে শতভাগ নিরাপদ পেমেন্ট।'
          : 'Pay securely via Cash on Delivery, bKash, Nagad, or Card.',
      primaryLabel: language === 'BN' ? 'লাইভ ট্র্যাকিং' : 'Track Orders',
      primaryAction: () => navigateTo('order_tracking', { orderId: 'DM123456' }),
      secondaryLabel: language === 'BN' ? 'স্ক্যানার' : 'Visual Scan',
      secondaryAction: () => navigateTo('visual_scan'),
      product: products[3] || products[0],
    },
  ];

  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setHeroDirection(1);
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4800);
    return () => clearInterval(timer);
  }, [isHeroPaused, heroSlides.length]);

  const goToHeroSlide = (nextIdx: number) => {
    setHeroDirection(nextIdx > heroIndex ? 1 : -1);
    setHeroIndex(nextIdx);
  };

  const activeSlide = heroSlides[heroIndex] || heroSlides[0];
  const heroProduct = activeSlide.product;

  // Top Flash Drops for Horizontal Snap Slider
  const flashDeals = products
    .filter((p) => p.discountPercent >= 15)
    .slice(0, 10);

  const scrollDealsSlider = (dir: 'left' | 'right') => {
    if (!dealsSliderRef.current) return;
    const amount = dir === 'left' ? -240 : 240;
    dealsSliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const filteredProducts = products.filter((p) => {
    if (homeCategory !== 'all' && p.category !== homeCategory) {
      return false;
    }
    if (
      searchQuery.trim() &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (smartFilters.under2000Bdt && p.totalLandedBdt > 2000) return false;
    if (smartFilters.arrivesThisWeek && !p.arrivesThisWeek) return false;
    if (smartFilters.verifiedOnly && !p.verifiedSupplier) return false;
    return true;
  });

  const displayedProducts = smartFilters.lowestLandedCost
    ? [...filteredProducts].sort((a, b) => a.totalLandedBdt - b.totalLandedBdt)
    : filteredProducts;

  const slicedProducts = displayedProducts.slice(0, visibleLimit);

  return (
    <div className="p-4 space-y-5 pb-6 bg-[#F8FAFC]">
      {/* 1. Search Bar + Scan Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleLimit(24);
            }}
            placeholder={
              language === 'BN'
                ? 'পণ্য, ব্র্যান্ড বা লিংক খুঁজুন...'
                : 'Search global products or paste URL...'
            }
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200/90 text-xs leading-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
          />
        </div>
        <button
          type="button"
          aria-label="Visual Search or Paste Link"
          onClick={() => navigateTo('visual_scan')}
          className="h-10 px-3.5 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:border-slate-300 flex items-center gap-1.5 text-xs leading-4 font-medium shrink-0 transition-colors"
        >
          <Camera className="w-4 h-4 text-[#059669]" />
          <span>{language === 'BN' ? 'স্ক্যান' : 'Scan'}</span>
        </button>
      </div>

      {/* 2. Interactive Swipeable 3-Slide Hero Banner Carousel */}
      <section
        aria-label="Featured Cross-Border Campaigns"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        onTouchStart={() => setIsHeroPaused(true)}
        onTouchEnd={() => setIsHeroPaused(false)}
        className="relative overflow-hidden rounded-2xl bg-[#0F172A] text-white p-4 select-none"
      >
        <AnimatePresence mode="wait" custom={heroDirection} initial={false}>
          <motion.div
            key={activeSlide.id}
            custom={heroDirection}
            initial={{ opacity: 0, x: heroDirection > 0 ? 48 : -48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: heroDirection > 0 ? -48 : 48 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40) {
                setHeroDirection(1);
                setHeroIndex((prev) => (prev + 1) % heroSlides.length);
              } else if (info.offset.x > 40) {
                setHeroDirection(-1);
                setHeroIndex(
                  (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
                );
              }
            }}
            className="flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing"
          >
            <div className="flex-1 min-w-0 space-y-2">
              <p className="text-[11px] leading-4 text-emerald-400 font-medium">
                {activeSlide.kicker}
              </p>

              <h2 className="text-lg leading-6 font-bold tracking-tight text-white">
                {activeSlide.title}
              </h2>

              <p className="text-xs leading-4 text-slate-300">
                {activeSlide.subtitle}
              </p>

              <div className="pt-1.5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={activeSlide.primaryAction}
                  className="h-8 px-3 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-semibold text-[11px] leading-4 transition-colors whitespace-nowrap"
                >
                  {activeSlide.primaryLabel}
                </button>
                <button
                  type="button"
                  onClick={activeSlide.secondaryAction}
                  className="h-8 px-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 font-medium text-[11px] leading-4 transition-colors whitespace-nowrap"
                >
                  {activeSlide.secondaryLabel}
                </button>
              </div>
            </div>

            {heroProduct && (
              <div
                onClick={() =>
                  navigateTo('product_detail', { productId: heroProduct.id })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigateTo('product_detail', { productId: heroProduct.id });
                  }
                }}
                className="w-[92px] shrink-0 bg-white/10 border border-white/15 rounded-xl p-2 text-center cursor-pointer hover:bg-white/15 transition-colors animate-float-soft"
              >
                <div className="w-full aspect-square rounded-lg bg-white overflow-hidden mb-1.5">
                  <img
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="block font-mono-num text-xs leading-4 font-bold text-white">
                  {formatPrice(heroProduct.totalLandedBdt)}
                </span>
                <span className="block text-[10px] leading-3 text-slate-300 mt-0.5">
                  Landed
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Interactive Sliding Pagination Dots */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            {heroSlides.map((slide, idx) => {
              const active = idx === heroIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => goToHeroSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    active ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/25 hover:bg-white/40'
                  }`}
                />
              );
            })}
          </div>
          <span className="text-[10px] font-mono-num text-slate-400">
            0{heroIndex + 1} / 0{heroSlides.length} · Swipe
          </span>
        </div>
      </section>

      {/* 3. Cross-Border Intelligence Bar (3 Static Informational Cards) */}
      <section aria-label="Cross-Border Highlights" className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-white border border-slate-200/80 text-left">
          <TrendingDown className="w-4 h-4 text-[#059669] mb-2" />
          <span className="block text-xs leading-4 font-semibold text-slate-900">
            {language === 'BN' ? 'প্রাইস হিস্ট্রি' : 'Price History'}
          </span>
          <span className="block text-[10px] leading-3.5 text-slate-500 mt-1">
            30-day landed lows
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200/80 text-left">
          <Scale className="w-4 h-4 text-[#059669] mb-2" />
          <span className="block text-xs leading-4 font-semibold text-slate-900">
            {language === 'BN' ? '৩ রুট তুলনা' : '3-Route Compare'}
          </span>
          <span className="block text-[10px] leading-3.5 text-slate-500 mt-1">
            CN vs. BD vs. Air
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200/80 text-left">
          <Truck className="w-4 h-4 text-[#059669] mb-2" />
          <span className="block text-xs leading-4 font-semibold text-slate-900">
            {language === 'BN' ? 'লাইভ ট্র্যাকিং' : 'Live Tracking'}
          </span>
          <span className="block text-[10px] leading-3.5 text-slate-500 mt-1">
            Customs & courier
          </span>
        </div>
      </section>

      {/* 4. Horizontal Snap-Sliding "Flash Landed Drops" Rail */}
      {!searchQuery.trim() && flashDeals.length > 0 && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm leading-5 font-semibold text-slate-900">
                {language === 'BN' ? 'ফ্ল্যাশ ল্যান্ডেড ড্রপস' : 'Flash Landed Drops'}
              </h2>
              <p className="text-[11px] leading-4 text-slate-500">
                {language === 'BN'
                  ? 'ডানে-বামে সোয়াইপ করে সেরা ডিল দেখুন'
                  : 'Swipe horizontally · Verified factory discounts'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Slide left"
                onClick={() => scrollDealsSlider('left')}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Slide right"
                onClick={() => scrollDealsSlider('right')}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={dealsSliderRef}
            className="flex items-stretch gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1"
          >
            {flashDeals.map((deal) => (
              <motion.div
                key={`flash-${deal.id}`}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('product_detail', { productId: deal.id })}
                className="w-[210px] shrink-0 snap-start bg-white rounded-2xl border border-slate-200/80 p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-slate-300 transition-colors"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-[10px] text-[#059669] font-mono-num font-semibold">
                    <span>-{deal.discountPercent}%</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-0.5 text-slate-600">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      {deal.rating.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 truncate mt-0.5">
                    {language === 'BN' ? deal.nameBn : deal.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-mono-num text-xs font-bold text-slate-900">
                      {formatPrice(deal.totalLandedBdt)}
                    </span>
                    <button
                      type="button"
                      aria-label={`Quick add ${deal.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(deal.id, 1);
                      }}
                      className="w-6 h-6 rounded-md bg-slate-900 hover:bg-[#059669] text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Verified Global Catalog Section with Spring-Sliding Department Pills */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm leading-5 font-semibold text-slate-900">
              {language === 'BN' ? 'ভেরিফাইড গ্লোবাল ক্যাটালগ' : 'Verified Global Catalog'}
            </h2>
            <p className="text-[11px] leading-4 text-slate-500">
              {language === 'BN'
                ? 'সকল মূল্যে শিপিং, ডিউটি ও ভ্যাট অন্তর্ভুক্ত'
                : 'Every price includes shipping, 10% duty & 15% VAT'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('categories')}
            className="text-xs leading-4 font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 shrink-0"
          >
            <span>{language === 'BN' ? 'বিভাগসমূহ' : 'Departments'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Row 1: Spring-Gliding Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setHomeCategory('all');
              setVisibleLimit(24);
            }}
            className={`relative h-8 px-3.5 rounded-xl text-xs leading-4 font-medium whitespace-nowrap shrink-0 transition-colors border ${
              homeCategory === 'all'
                ? 'text-white border-slate-900'
                : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
            }`}
          >
            {homeCategory === 'all' && (
              <motion.span
                layoutId="homeActiveDeptPill"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-slate-900"
              />
            )}
            <span className="relative z-10">
              {language === 'BN' ? 'সব পণ্য' : 'All'}
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const active = homeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setHomeCategory(active ? 'all' : cat.id);
                  setVisibleLimit(24);
                }}
                className={`relative h-8 px-3.5 rounded-xl text-xs leading-4 font-medium whitespace-nowrap shrink-0 transition-colors border ${
                  active
                    ? 'text-white border-slate-900'
                    : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="homeActiveDeptPill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-slate-900"
                  />
                )}
                <span className="relative z-10">
                  {language === 'BN' ? cat.nameBn : cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Smart Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() =>
              setSmartFilters((prev) => ({
                ...prev,
                under2000Bdt: !prev.under2000Bdt,
              }))
            }
            className={`h-7 px-3 rounded-lg text-[11px] leading-4 font-medium whitespace-nowrap shrink-0 transition-colors ${
              smartFilters.under2000Bdt
                ? 'bg-[#059669] text-white'
                : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Under {formatPrice(2000)}
          </button>

          <button
            type="button"
            onClick={() =>
              setSmartFilters((prev) => ({
                ...prev,
                arrivesThisWeek: !prev.arrivesThisWeek,
              }))
            }
            className={`h-7 px-3 rounded-lg text-[11px] leading-4 font-medium whitespace-nowrap shrink-0 transition-colors ${
              smartFilters.arrivesThisWeek
                ? 'bg-[#059669] text-white'
                : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Arrives this week
          </button>

          <button
            type="button"
            onClick={() =>
              setSmartFilters((prev) => ({
                ...prev,
                lowestLandedCost: !prev.lowestLandedCost,
              }))
            }
            className={`h-7 px-3 rounded-lg text-[11px] leading-4 font-medium whitespace-nowrap shrink-0 transition-colors ${
              smartFilters.lowestLandedCost
                ? 'bg-[#059669] text-white'
                : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Lowest landed price
          </button>

          <button
            type="button"
            onClick={() =>
              setSmartFilters((prev) => ({
                ...prev,
                verifiedOnly: !prev.verifiedOnly,
              }))
            }
            className={`h-7 px-3 rounded-lg text-[11px] leading-4 font-medium whitespace-nowrap shrink-0 transition-colors ${
              smartFilters.verifiedOnly
                ? 'bg-[#059669] text-white'
                : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Verified only
          </button>
        </div>

        {/* 2-Column Product Card Grid */}
        {slicedProducts.length > 0 ? (
          <>
            <motion.div
              key={`${homeCategory}-${searchQuery}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-2 gap-3 pt-1"
            >
              {slicedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>

            {displayedProducts.length > visibleLimit && (
              <button
                type="button"
                onClick={() => setVisibleLimit((prev) => prev + 24)}
                className="w-full h-10 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs leading-4 font-semibold text-slate-900 transition-colors"
              >
                Load More Products ({displayedProducts.length - visibleLimit} remaining)
              </button>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/80">
            <p className="text-xs leading-4 font-semibold text-slate-900">
              No matching global products found
            </p>
            <p className="text-[11px] leading-4 text-slate-500 mt-1">
              Try clearing your search or Under {formatPrice(2000)} filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setHomeCategory('all');
                setSmartFilters((prev) => ({
                  ...prev,
                  under2000Bdt: false,
                  arrivesThisWeek: false,
                }));
              }}
              className="mt-3 h-9 px-4 rounded-lg bg-slate-900 text-white text-xs leading-4 font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
