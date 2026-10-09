import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
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
import { ProductCard, ProductCardGhost } from '../shared/ProductCard';

const PAGE_SIZE = 16;

export const HomeScreen: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    recentlyViewedIds,
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
  const [visibleLimit, setVisibleLimit] = useState<number>(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isFilteringItems, setIsFilteringItems] = useState<boolean>(false);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const loadingTimerRef = useRef<number | null>(null);
  const filterTimerRef = useRef<number | null>(null);

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
          ? 'প্রতিটি পণ্যের ৩০ দিনের দামের ওঠানামা ও প্রাইস অ্যালার্ট দেখুন।'
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
      secondaryLabel: language === 'BN' ? 'শপিং গাইড' : 'Customs Guide',
      secondaryAction: () => navigateTo('guides'),
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
    if (smartFilters.verifiedOnly && (!p.verifiedSupplier || p.dropScore < 8.5))
      return false;
    return true;
  });

  const displayedProducts = smartFilters.lowestLandedCost
    ? [...filteredProducts].sort((a, b) => a.totalLandedBdt - b.totalLandedBdt)
    : filteredProducts;

  const slicedProducts = displayedProducts.slice(0, visibleLimit);
  const hasMoreProducts = displayedProducts.length > visibleLimit;
  const recentlyViewedProducts = recentlyViewedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMoreProducts) return;
    setIsLoadingMore(true);
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
    }
    loadingTimerRef.current = window.setTimeout(() => {
      setVisibleLimit((prev) => prev + PAGE_SIZE);
      setIsLoadingMore(false);
    }, 360);
  }, [hasMoreProducts, isLoadingMore]);

  useEffect(() => {
    setVisibleLimit(PAGE_SIZE);
    setIsLoadingMore(false);
    setIsFilteringItems(true);
    if (filterTimerRef.current) {
      window.clearTimeout(filterTimerRef.current);
    }
    filterTimerRef.current = window.setTimeout(() => {
      setIsFilteringItems(false);
    }, 220);
  }, [
    homeCategory,
    searchQuery,
    smartFilters.under2000Bdt,
    smartFilters.arrivesThisWeek,
    smartFilters.lowestLandedCost,
    smartFilters.verifiedOnly,
  ]);

  useEffect(() => {
    const node = loadMoreTriggerRef.current;
    if (!node || !hasMoreProducts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { rootMargin: '140px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMoreProducts, isLoadingMore]);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
      }
      if (filterTimerRef.current) {
        window.clearTimeout(filterTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4 space-y-5 pb-6 bg-app-bg">
      {/* 1. Global Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setVisibleLimit(24);
          }}
          placeholder={
            language === 'BN'
              ? 'পণ্য, ব্র্যান্ড বা ক্যাটাগরি খুঁজুন...'
              : 'Search global products, brands, or categories...'
          }
          className="w-full h-11 pl-10 pr-3 rounded-lg bg-white border border-app-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-app-borderStrong transition-colors"
        />
      </div>

      {/* 2. Interactive Swipeable 3-Slide Hero Banner Carousel */}
      <section
        aria-label="Featured Cross-Border Campaigns"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        onTouchStart={() => setIsHeroPaused(true)}
        onTouchEnd={() => setIsHeroPaused(false)}
        className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 text-white p-4 select-none shadow-xs"
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
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400">
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
                  className="h-9 px-3.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-colors whitespace-nowrap"
                >
                  {activeSlide.primaryLabel}
                </button>
                <button
                  type="button"
                  onClick={activeSlide.secondaryAction}
                  className="h-9 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-slate-100 font-medium text-xs transition-colors whitespace-nowrap"
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
                className="w-[92px] shrink-0 bg-white/10 border border-white/15 rounded-xl p-2 text-center cursor-pointer hover:bg-white/15 transition-colors"
              >
                <div className="w-full aspect-square rounded-lg bg-white overflow-hidden mb-1.5">
                  <img
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="block tabular-nums text-xs leading-4 font-bold text-white">
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
                    active ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                />
              );
            })}
          </div>
          <span className="text-[10px] tabular-nums text-slate-400">
            0{heroIndex + 1} / 0{heroSlides.length} · Swipe
          </span>
        </div>
      </section>

      {/* 3. Cross-Border Intelligence Bar (Interactive Tool Shortcuts) */}
      <section aria-label="Cross-Border Highlights" className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => navigateTo('price_tracker')}
          className="p-3 rounded-xl bg-white border border-app-border hover:border-app-borderStrong text-left transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-app-subtle text-content-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <TrendingDown className="w-4 h-4" />
          </div>
          <span className="block text-xs leading-4 font-semibold text-content-primary">
            {language === 'BN' ? 'প্রাইস হিস্ট্রি' : 'Price History'}
          </span>
          <span className="block text-[11px] leading-3.5 text-content-secondary mt-0.5">
            30-day landed lows
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('seller_compare')}
          className="p-3 rounded-xl bg-white border border-app-border hover:border-app-borderStrong text-left transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-app-subtle text-content-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Scale className="w-4 h-4" />
          </div>
          <span className="block text-xs leading-4 font-semibold text-content-primary">
            {language === 'BN' ? '৩ রুট তুলনা' : '3-Route Compare'}
          </span>
          <span className="block text-[11px] leading-3.5 text-content-secondary mt-0.5">
            CN vs. BD vs. Air
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('orders')}
          className="p-3 rounded-xl bg-white border border-app-border hover:border-app-borderStrong text-left transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-status-transit flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Truck className="w-4 h-4" />
          </div>
          <span className="block text-xs leading-4 font-semibold text-content-primary">
            {language === 'BN' ? 'লাইভ ট্র্যাকিং' : 'Live Tracking'}
          </span>
          <span className="block text-[11px] leading-3.5 text-content-secondary mt-0.5">
            Customs & courier
          </span>
        </button>
      </section>

      {/* 4. Horizontal Snap-Sliding "Flash Landed Drops" Rail */}
      {!searchQuery.trim() && flashDeals.length > 0 && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-content-primary">
                {language === 'BN' ? 'ফ্ল্যাশ ল্যান্ডেড ড্রপস' : 'Flash Landed Drops'}
              </h2>
              <p className="text-xs text-content-secondary">
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
                className="w-8 h-8 rounded-lg bg-white border border-app-border flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Slide right"
                onClick={() => scrollDealsSlider('right')}
                className="w-8 h-8 rounded-lg bg-white border border-app-border flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors"
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
                className="w-[220px] shrink-0 snap-start bg-white rounded-xl border border-app-border p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-app-borderStrong transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-slate-50 border border-app-border overflow-hidden shrink-0">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="bg-promo-subtle text-promo-accent font-bold px-1.5 py-0.5 rounded tabular-nums">
                      -{deal.discountPercent}%
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-content-secondary tabular-nums">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {deal.rating.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="text-xs font-medium text-content-primary truncate mt-1">
                    {language === 'BN' ? deal.nameBn : deal.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="tabular-nums text-sm font-bold text-content-primary">
                      {formatPrice(deal.totalLandedBdt)}
                    </span>
                    <button
                      type="button"
                      aria-label={`Quick add ${deal.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(deal.id, 1);
                      }}
                      className="w-7 h-7 rounded-lg bg-app-subtle hover:bg-slate-200 text-content-primary flex items-center justify-center transition-colors"
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

      {/* 5. Verified Global Catalog Section with Department Pills */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-content-primary">
              {language === 'BN' ? 'ভেরিফাইড গ্লোবাল ক্যাটালগ' : 'Verified Global Catalog'}
            </h2>
            <p className="text-xs text-content-secondary">
              {language === 'BN'
                ? 'সকল মূল্যে শিপিং, ডিউটি ও ভ্যাট অন্তর্ভুক্ত'
                : 'Every price includes shipping, 10% duty & 15% VAT'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('categories')}
            className="text-xs font-semibold text-content-primary hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{language === 'BN' ? 'বিভাগসমূহ' : 'Departments'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Row 1: Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setHomeCategory('all');
              setVisibleLimit(PAGE_SIZE);
            }}
            className={`relative h-9 px-3.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors border ${
              homeCategory === 'all'
                ? 'text-white border-content-primary'
                : 'bg-white border-app-border text-content-secondary hover:border-app-borderStrong'
            }`}
          >
            {homeCategory === 'all' && (
              <motion.span
                layoutId="homeActiveDeptPill"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-lg bg-content-primary"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1">
              <span>{language === 'BN' ? 'সব পণ্য' : 'All'}</span>
              <span
                className={`tabular-nums text-[11px] ${
                  homeCategory === 'all' ? 'text-slate-300' : 'text-content-muted'
                }`}
              >
                · {products.length}
              </span>
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const active = homeCategory === cat.id;
            const deptCount = products.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setHomeCategory(active ? 'all' : cat.id);
                  setVisibleLimit(PAGE_SIZE);
                }}
                className={`relative h-9 px-3.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors border ${
                  active
                    ? 'text-white border-content-primary'
                    : 'bg-white border-app-border text-content-secondary hover:border-app-borderStrong'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="homeActiveDeptPill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-content-primary"
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-1.5">
                  <span>{language === 'BN' ? cat.nameBn : cat.name}</span>
                  <span
                    className={`tabular-nums text-[11px] ${
                      active ? 'text-slate-300' : 'text-content-muted'
                    }`}
                  >
                    · {deptCount}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Smart Filter Pills (Neutral Slate Active State) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() =>
              setSmartFilters((prev) => ({
                ...prev,
                under2000Bdt: !prev.under2000Bdt,
              }))
            }
            className={`h-8 px-3 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors ${
              smartFilters.under2000Bdt
                ? 'bg-content-primary text-white font-semibold'
                : 'bg-app-subtle text-content-secondary hover:bg-slate-200/70'
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
            className={`h-8 px-3 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors ${
              smartFilters.arrivesThisWeek
                ? 'bg-content-primary text-white font-semibold'
                : 'bg-app-subtle text-content-secondary hover:bg-slate-200/70'
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
            className={`h-8 px-3 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors ${
              smartFilters.lowestLandedCost
                ? 'bg-content-primary text-white font-semibold'
                : 'bg-app-subtle text-content-secondary hover:bg-slate-200/70'
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
            className={`h-8 px-3 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors ${
              smartFilters.verifiedOnly
                ? 'bg-content-primary text-white font-semibold'
                : 'bg-app-subtle text-content-secondary hover:bg-slate-200/70'
            }`}
          >
            Verified only
          </button>
        </div>

        {/* Scoped Items Area */}
        <div
          id="home-items-area"
          aria-busy={isLoadingProducts || isFilteringItems || isLoadingMore}
          className="relative min-h-[280px] pt-1"
        >
          {isLoadingProducts || isFilteringItems ? (
            <div role="status" aria-live="polite">
              <span className="sr-only">Loading products...</span>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <ProductCardGhost key={`home-filter-ghost-${idx}`} />
                ))}
              </div>
            </div>
          ) : slicedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {slicedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}

                {isLoadingMore &&
                  Array.from({ length: 4 }).map((_, idx) => (
                    <ProductCardGhost key={`home-more-ghost-${idx}`} />
                  ))}
              </div>

              {displayedProducts.length > PAGE_SIZE && (
                <div
                  ref={loadMoreTriggerRef}
                  role="status"
                  aria-live="polite"
                  className="pt-3 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-[11px] text-content-secondary px-0.5">
                    <span>
                      Showing{' '}
                      <strong className="tabular-nums text-content-primary font-semibold">
                        {slicedProducts.length}
                      </strong>{' '}
                      of{' '}
                      <strong className="tabular-nums text-content-primary font-semibold">
                        {displayedProducts.length}
                      </strong>{' '}
                      items
                    </span>
                    <span className="tabular-nums text-content-muted">
                      {Math.round(
                        (slicedProducts.length / displayedProducts.length) * 100
                      )}
                      % loaded
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-app-border overflow-hidden">
                    <div
                      className="h-full bg-content-primary rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (slicedProducts.length / displayedProducts.length) * 100
                          )
                        )}%`,
                      }}
                    />
                  </div>

                  {hasMoreProducts ? (
                    !isLoadingMore && (
                      <button
                        type="button"
                        onClick={handleLoadMore}
                        className="w-full min-h-[44px] rounded-xl bg-white border border-app-border hover:border-app-borderStrong text-xs font-semibold text-content-primary flex items-center justify-center gap-2 transition-colors shadow-2xs"
                      >
                        <span>
                          Load More Items (
                          {displayedProducts.length - visibleLimit} remaining)
                        </span>
                      </button>
                    )
                  ) : (
                    <p className="text-center text-xs text-content-muted py-1">
                      All {displayedProducts.length} items loaded
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl p-6 text-center border border-app-border">
              <p className="text-xs font-semibold text-content-primary">
                No matching global products found
              </p>
              <p className="text-xs text-content-secondary mt-1">
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
                className="mt-3 h-9 px-4 rounded-lg bg-content-primary text-white text-xs font-medium"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Recently Viewed Products Horizontal Rail */}
      {recentlyViewedProducts.length > 0 && (
        <section
          aria-label="Recently Viewed Products"
          className="space-y-2.5 pt-2 border-t border-app-border"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-content-primary">
              {language === 'BN' ? 'সম্প্রতি দেখা পণ্য' : 'Recently Viewed'}
            </h2>
            <span className="text-xs text-content-muted tabular-nums">
              {recentlyViewedProducts.length} items
            </span>
          </div>

          <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
            {recentlyViewedProducts.map((item) => (
              <div
                key={`recent-${item.id}`}
                onClick={() =>
                  navigateTo('product_detail', { productId: item.id })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigateTo('product_detail', { productId: item.id });
                  }
                }}
                className="w-40 shrink-0 snap-start bg-white rounded-xl border border-app-border p-2.5 flex items-center gap-2.5 hover:border-app-borderStrong transition-colors cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-lg object-contain bg-slate-50 p-1 border border-app-border shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-content-primary truncate">
                    {language === 'BN' ? item.nameBn : item.name}
                  </p>
                  <p className="tabular-nums text-xs font-bold text-content-primary mt-0.5">
                    {formatPrice(item.totalLandedBdt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
