import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Scale,
  Search,
  TrendingDown,
  Truck,
  X,
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
          ? 'কাস্টমস ডিউটি ও ভ্যাট অন্তর্ভুক্ত'
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
      product: products[0],
    },
    {
      id: 'hero-price-drop',
      kicker:
        language === 'BN'
          ? '৩০ দিনের প্রাইস ইন্টেলিজেন্স'
          : '30-Day Landed Price Drops',
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
      product: products[1] || products[0],
    },
    {
      id: 'hero-fast-air',
      kicker:
        language === 'BN'
          ? 'এক্সপ্রেস এয়ার ও ঢাকা রেডি হাব'
          : 'Express Air & Dhaka Ready Hub',
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
      product: products[3] || products[0],
    },
  ];

  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setHeroDirection(1);
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
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
      {/* 1. Clean Global Search Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-content-muted absolute left-3.5 pointer-events-none" />
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
          className="w-full h-11 pl-10 pr-9 rounded-xl bg-white border border-app-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-content-muted hover:text-content-primary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Clean Emerald Hero Carousel (Single Primary CTA, Quiet Pagination) */}
      <section
        aria-label="Featured Cross-Border Campaigns"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        onTouchStart={() => setIsHeroPaused(true)}
        onTouchEnd={() => setIsHeroPaused(false)}
        className="relative overflow-hidden rounded-2xl bg-brand-primary text-white p-4 select-none"
      >
        <AnimatePresence mode="wait" custom={heroDirection} initial={false}>
          <motion.div
            key={activeSlide.id}
            custom={heroDirection}
            initial={{ opacity: 0, x: heroDirection > 0 ? 36 : -36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: heroDirection > 0 ? -36 : 36 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
            className="flex items-center justify-between gap-3.5 cursor-grab active:cursor-grabbing"
          >
            <div className="flex-1 min-w-0 space-y-1.5">
              <p className="text-xs font-medium text-emerald-100">
                {activeSlide.kicker}
              </p>

              <h2 className="text-base leading-5 font-bold tracking-tight text-white">
                {activeSlide.title}
              </h2>

              <p className="text-xs leading-4 text-emerald-50/90 line-clamp-2">
                {activeSlide.subtitle}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={activeSlide.primaryAction}
                  className="h-9 px-4 rounded-xl bg-white text-brand-primary hover:bg-brand-subtle font-semibold text-xs transition-colors whitespace-nowrap"
                >
                  {activeSlide.primaryLabel}
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
                className="w-22 shrink-0 bg-white/10 border border-white/15 rounded-xl p-1.5 text-center cursor-pointer hover:bg-white/15 transition-colors"
              >
                <div className="w-full aspect-square rounded-lg bg-white overflow-hidden mb-1">
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
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quiet Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-3">
          {heroSlides.map((slide, idx) => {
            const active = idx === heroIndex;
            return (
              <button
                key={slide.id}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => goToHeroSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  active ? 'w-5 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'
                }`}
              />
            );
          })}
        </div>
      </section>

      {/* 3. Unified 3-Tool Shortcut Strip */}
      <section aria-label="Shopping Tools" className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => navigateTo('price_tracker')}
          className="p-3 rounded-2xl bg-white border border-app-border hover:border-app-borderStrong flex flex-col items-start gap-2 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-content-primary whitespace-nowrap">
            {language === 'BN' ? 'প্রাইস হিস্ট্রি' : 'Price History'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('seller_compare')}
          className="p-3 rounded-2xl bg-white border border-app-border hover:border-app-borderStrong flex flex-col items-start gap-2 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-content-primary whitespace-nowrap">
            {language === 'BN' ? 'রুট তুলনা' : 'Route Compare'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('orders')}
          className="p-3 rounded-2xl bg-white border border-app-border hover:border-app-borderStrong flex flex-col items-start gap-2 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-content-primary whitespace-nowrap">
            {language === 'BN' ? 'অর্ডার ট্র্যাক' : 'Order Radar'}
          </span>
        </button>
      </section>

      {/* 4. Clean "Featured Drops" Horizontal Rail */}
      {!searchQuery.trim() && flashDeals.length > 0 && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-content-primary">
              {language === 'BN' ? 'সেরা ল্যান্ডেড ডিল' : 'Featured Landed Drops'}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Slide left"
                onClick={() => scrollDealsSlider('left')}
                className="w-7 h-7 rounded-lg bg-white border border-app-border flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Slide right"
                onClick={() => scrollDealsSlider('right')}
                className="w-7 h-7 rounded-lg bg-white border border-app-border flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={dealsSliderRef}
            className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-0.5"
          >
            {flashDeals.map((deal) => (
              <motion.div
                key={`flash-${deal.id}`}
                whileTap={{ scale: 0.985 }}
                onClick={() => navigateTo('product_detail', { productId: deal.id })}
                className="w-52 shrink-0 snap-start bg-white rounded-2xl border border-app-border p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-app-borderStrong transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-app-border overflow-hidden shrink-0">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-content-primary truncate">
                    {language === 'BN' ? deal.nameBn : deal.name}
                  </h3>
                  <p className="text-[11px] text-brand-primary font-medium mt-0.5">
                    Save {deal.discountPercent}% · Landed
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono-num text-xs font-bold text-content-primary">
                      {formatPrice(deal.totalLandedBdt)}
                    </span>
                    <button
                      type="button"
                      aria-label={`Quick add ${deal.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(deal.id, 1);
                      }}
                      className="w-7 h-7 rounded-lg bg-brand-subtle hover:bg-brand-primary text-brand-primary hover:text-white flex items-center justify-center transition-colors"
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

      {/* 5. Clean "Recently Viewed" Horizontal Rail */}
      {!searchQuery.trim() && recentlyViewedProducts.length > 0 && (
        <section aria-label="Recently Viewed Products" className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-content-primary">
              {language === 'BN' ? 'সম্প্রতি দেখা পণ্য' : 'Recently Viewed'}
            </h2>
          </div>

          <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-0.5">
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
                className="w-44 shrink-0 snap-start bg-white rounded-2xl border border-app-border p-2.5 flex items-center gap-2.5 hover:border-app-borderStrong transition-colors cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-xl object-cover bg-slate-50 border border-app-border shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-content-primary truncate">
                    {language === 'BN' ? item.nameBn : item.name}
                  </p>
                  <p className="font-mono-num text-xs font-bold text-content-primary mt-0.5">
                    {formatPrice(item.totalLandedBdt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Global Catalog Grid with Single-Row Category Filter & Clean Quick Toggles */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-content-primary">
            {language === 'BN' ? 'গ্লোবাল ক্যাটালগ' : 'Global Catalog'}
          </h2>
          <button
            type="button"
            onClick={() => navigateTo('categories')}
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{language === 'BN' ? 'সব বিভাগ' : 'All Categories'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean Category Filter Row (Emerald Active State, No Count Clutter) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setHomeCategory('all');
              setVisibleLimit(PAGE_SIZE);
            }}
            className={`h-8 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors border ${
              homeCategory === 'all'
                ? 'bg-brand-primary text-white border-brand-primary'
                : 'bg-white border-app-border text-content-secondary hover:text-content-primary'
            }`}
          >
            {language === 'BN' ? 'সব পণ্য' : 'All'}
          </button>

          {CATEGORIES.map((cat) => {
            const active = homeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setHomeCategory(active ? 'all' : cat.id);
                  setVisibleLimit(PAGE_SIZE);
                }}
                className={`h-8 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors border ${
                  active
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-white border-app-border text-content-secondary hover:text-content-primary'
                }`}
              >
                {language === 'BN' ? cat.nameBn : cat.name}
              </button>
            );
          })}
        </div>

        {/* Subtle Quick Filter Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(
            [
              {
                key: 'under2000Bdt',
                label: `Under ${formatPrice(2000)}`,
                active: smartFilters.under2000Bdt,
              },
              {
                key: 'arrivesThisWeek',
                label: 'Arrives this week',
                active: smartFilters.arrivesThisWeek,
              },
              {
                key: 'lowestLandedCost',
                label: 'Lowest price',
                active: smartFilters.lowestLandedCost,
              },
              {
                key: 'verifiedOnly',
                label: 'Verified supplier',
                active: smartFilters.verifiedOnly,
              },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() =>
                setSmartFilters((prev) => ({
                  ...prev,
                  [f.key]: !prev[f.key],
                }))
              }
              className={`h-7 px-3 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                f.active
                  ? 'bg-brand-subtle text-brand-primary border border-brand-border font-semibold'
                  : 'bg-app-subtle text-content-secondary hover:text-content-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div
          id="home-items-area"
          aria-busy={isLoadingProducts || isFilteringItems || isLoadingMore}
          className="relative min-h-[280px] pt-0.5"
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

              {hasMoreProducts && (
                <div ref={loadMoreTriggerRef} className="pt-4">
                  {!isLoadingMore && (
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="w-full min-h-[44px] rounded-xl bg-white border border-app-border hover:border-app-borderStrong text-xs font-semibold text-content-primary flex items-center justify-center transition-colors"
                    >
                      Load More Products
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center border border-app-border">
              <p className="text-xs font-semibold text-content-primary">
                No matching products found
              </p>
              <p className="text-xs text-content-secondary mt-1">
                Try clearing your search or active filters.
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
                    lowestLandedCost: false,
                    verifiedOnly: false,
                  }));
                }}
                className="mt-3 h-9 px-4 rounded-xl bg-brand-primary text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
