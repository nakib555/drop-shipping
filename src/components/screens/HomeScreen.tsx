import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  RotateCcw,
  Scale,
  Search,
  TrendingDown,
  Truck,
  X,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { CATEGORIES } from '../../data/catalogData';
import { CategoryId } from '../../types/deshimart';
import {
  doesProductArriveThisWeek,
  EXCHANGE_RATE_SNAPSHOT,
  getCanonicalLandedPricing,
  isVerifiedQualitySupplier,
} from '../../utils/pricingEngine';
import { ProductCard, ProductCardGhost } from '../shared/ProductCard';

const PAGE_SIZE = 16;

export const HomeScreen: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    isSearchingRemote,
    catalogSyncError,
    refreshCatalogFromApi,
    fetchMoreFromApi,
    recentlyViewedIds,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedRouteByProduct,
    navigateTo,
    addToCart,
    searchQuery,
    setSearchQuery,
    smartFilters,
    setSmartFilters,
    resetSmartFilters,
    language,
    currency,
    formatPrice,
    orders,
  } = useDeshiMart();

  const prefersReducedMotion = useReducedMotion();
  const isBn = language === 'BN';

  const [visibleLimit, setVisibleLimit] = useState<number>(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [loadMoreError, setLoadMoreError] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [justAddedFlashId, setJustAddedFlashId] = useState<string | null>(null);

  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingPageRef = useRef<boolean>(false);
  const filterEpochRef = useRef<number>(0);

  // 1. Compact Hero Carousel State (respects reduced motion, visibilityState, and user interaction)
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDirection, setHeroDirection] = useState(1);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  // Horizontal Featured Landed Drops Slider Ref
  const dealsSliderRef = useRef<HTMLDivElement | null>(null);

  const latestOrderId = orders[0]?.id || 'DM123456';

  const heroSlides = useMemo(
    () => [
      {
        id: 'hero-direct',
        kicker: isBn
          ? 'আনুমানিক কাস্টমস ডিউটি ও ভ্যাট হিসাবসহ'
          : 'Estimated Duty & 15% VAT Breakdown',
        title: isBn
          ? 'গ্লোবাল ফ্যাক্টরি থেকে সরাসরি ঢাকা ডেলিভারি'
          : 'Direct Factory Finds, Delivered to Dhaka',
        subtitle: isBn
          ? 'অর্ডার করার আগেই পণ্যমূল্য, এয়ার ফ্রেইট ও কাস্টমস চার্জ তুলনা করুন।'
          : 'Compare item price, international freight, and estimated customs duties upfront.',
        primaryLabel: isBn ? 'ক্যাটালগ দেখুন' : 'Explore Catalog',
        primaryAction: () => {
          const catalogEl = document.getElementById('home-catalog-section');
          if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          } else {
            navigateTo('category_products', { categoryId: 'all' });
          }
        },
        product: products[0],
      },
      {
        id: 'hero-price-drop',
        kicker: isBn
          ? '৩০ দিনের ল্যান্ডেড প্রাইস ট্র্যাকার'
          : '30-Day Historical Landed Price Tracker',
        title: isBn
          ? 'দামের ইতিহাস যাচাই করে সেরা ডিলে কিনুন'
          : 'Verify Historical Landed Prices Before Buying',
        subtitle: isBn
          ? 'গত ৩০ দিনের ল্যান্ডেড মূল্যের চার্ট দেখুন এবং প্রাইস অ্যালার্ট সেট করুন।'
          : 'Inspect 30-day landed price trends and set target price alerts.',
        primaryLabel: isBn ? 'প্রাইস হিস্ট্রি' : 'Price History',
        primaryAction: () => navigateTo('price_tracker'),
        product: products[1] || products[0],
      },
      {
        id: 'hero-fast-air',
        kicker: isBn
          ? 'রুট তুলনা ও অর্ডার ট্র্যাকিং'
          : 'Multi-Route Shipping & Order Tracking',
        title: isBn
          ? 'এয়ার এক্সপ্রেস ও ঢাকা হাব রুট তুলনা করুন'
          : 'Compare Air Express vs. Dhaka Hub Routes',
        subtitle: isBn
          ? 'ক্যাশ অন ডেলিভারি, বিকাশ, নগদ অথবা কার্ডে নিরাপদে পেমেন্ট করুন।'
          : 'Pay in BDT via Cash on Delivery, bKash, Nagad, or Card.',
        primaryLabel: isBn ? 'রুট তুলনা করুন' : 'Compare Routes',
        primaryAction: () => navigateTo('seller_compare'),
        product: products[3] || products[0],
      },
    ],
    [isBn, navigateTo, prefersReducedMotion, products]
  );

  useEffect(() => {
    if (isHeroPaused || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
        return;
      }
      setHeroDirection(1);
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [isHeroPaused, prefersReducedMotion, heroSlides.length]);

  const goToHeroSlide = (nextIdx: number) => {
    setHeroDirection(nextIdx > heroIndex ? 1 : -1);
    setHeroIndex(nextIdx);
  };

  const activeSlide = heroSlides[heroIndex] || heroSlides[0];
  const heroProduct = activeSlide.product;
  const heroPricing = useMemo(
    () =>
      heroProduct
        ? getCanonicalLandedPricing(heroProduct, selectedRouteByProduct)
        : null,
    [heroProduct, selectedRouteByProduct]
  );

  // Deduplicated catalog products by stable product ID
  const uniqueCatalogProducts = useMemo(() => {
    const seen = new Set<string>();
    return products.filter((p) => {
      if (!p?.id || seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [products]);

  // Search suggestions matching product names, brands/suppliers, or categories
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return ['Smart Watch', 'Earbuds', 'Backpack', 'Espresso', 'Drone'];
    }
    const matches: { id: string; label: string; categoryId: CategoryId }[] = [];
    for (const p of uniqueCatalogProducts) {
      if (
        p.name.toLowerCase().includes(q) ||
        p.nameBn.toLowerCase().includes(q) ||
        p.supplierName.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q)
      ) {
        matches.push({
          id: p.id,
          label: isBn ? p.nameBn : p.name,
          categoryId: p.category,
        });
      }
      if (matches.length >= 5) break;
    }
    return matches;
  }, [searchQuery, uniqueCatalogProducts, isBn]);

  // Canonical Filtering (Name, Bangla Name, Brand/Supplier, Category, and Smart Filters)
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return uniqueCatalogProducts.filter((p) => {
      if (selectedCategoryId !== 'all' && p.category !== selectedCategoryId) {
        return false;
      }

      if (q) {
        const categoryMeta = CATEGORIES.find((c) => c.id === p.category);
        const matchesName = p.name.toLowerCase().includes(q) || p.nameBn.toLowerCase().includes(q);
        const matchesBrandOrSub =
          p.subtitle.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q) ||
          p.originLabel.toLowerCase().includes(q);
        const matchesCat =
          categoryMeta?.name.toLowerCase().includes(q) ||
          categoryMeta?.nameBn.toLowerCase().includes(q);

        if (!matchesName && !matchesBrandOrSub && !matchesCat) {
          return false;
        }
      }

      const pricing = getCanonicalLandedPricing(p, selectedRouteByProduct);

      if (smartFilters.under2000Bdt && pricing.estimatedLandedBdt > 2000) {
        return false;
      }
      if (
        smartFilters.arrivesThisWeek &&
        !doesProductArriveThisWeek(p, selectedRouteByProduct)
      ) {
        return false;
      }
      if (smartFilters.verifiedOnly && !isVerifiedQualitySupplier(p)) {
        return false;
      }
      return true;
    });
  }, [
    uniqueCatalogProducts,
    selectedCategoryId,
    searchQuery,
    selectedRouteByProduct,
    smartFilters.under2000Bdt,
    smartFilters.arrivesThisWeek,
    smartFilters.verifiedOnly,
  ]);

  const displayedProducts = useMemo(() => {
    if (!smartFilters.lowestLandedCost) return filteredProducts;
    return [...filteredProducts].sort((a, b) => {
      const priceA = getCanonicalLandedPricing(a, selectedRouteByProduct).estimatedLandedBdt;
      const priceB = getCanonicalLandedPricing(b, selectedRouteByProduct).estimatedLandedBdt;
      return priceA - priceB;
    });
  }, [filteredProducts, smartFilters.lowestLandedCost, selectedRouteByProduct]);

  const slicedProducts = useMemo(
    () => displayedProducts.slice(0, visibleLimit),
    [displayedProducts, visibleLimit]
  );
  const hasMoreProducts = displayedProducts.length > visibleLimit;

  // Featured Landed Drops: Only genuine discounts >= 15% where originalLandedBdt > estimatedLandedBdt
  const flashDeals = useMemo(() => {
    return uniqueCatalogProducts
      .map((product) => ({
        product,
        pricing: getCanonicalLandedPricing(product, selectedRouteByProduct),
      }))
      .filter(
        ({ product, pricing }) =>
          product.inStock &&
          pricing.hasValidDiscount &&
          pricing.discountPercent >= 15
      )
      .sort((a, b) => b.pricing.discountPercent - a.pricing.discountPercent)
      .slice(0, 10);
  }, [uniqueCatalogProducts, selectedRouteByProduct]);

  // Recently Viewed: Deduplicated, ordered by most recent view
  const recentlyViewedProducts = useMemo(() => {
    const seen = new Set<string>();
    const list = [];
    for (const id of recentlyViewedIds) {
      if (seen.has(id)) continue;
      const found = uniqueCatalogProducts.find((p) => p.id === id);
      if (found) {
        seen.add(id);
        list.push(found);
      }
    }
    return list;
  }, [recentlyViewedIds, uniqueCatalogProducts]);

  const scrollDealsSlider = (dir: 'left' | 'right') => {
    if (!dealsSliderRef.current) return;
    const amount = dir === 'left' ? -240 : 240;
    dealsSliderRef.current.scrollBy({
      left: amount,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  // Reset pagination cleanly when search or filters change without showing fake skeleton flashes
  useEffect(() => {
    filterEpochRef.current += 1;
    isFetchingPageRef.current = false;
    setVisibleLimit(PAGE_SIZE);
    setIsLoadingMore(false);
    setLoadMoreError(false);
  }, [
    selectedCategoryId,
    searchQuery,
    smartFilters.under2000Bdt,
    smartFilters.arrivesThisWeek,
    smartFilters.lowestLandedCost,
    smartFilters.verifiedOnly,
  ]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || isFetchingPageRef.current || !hasMoreProducts) return;
    const requestEpoch = filterEpochRef.current;
    isFetchingPageRef.current = true;
    setIsLoadingMore(true);
    setLoadMoreError(false);

    try {
      if (visibleLimit + PAGE_SIZE * 2 >= displayedProducts.length) {
        await fetchMoreFromApi();
      }
      if (requestEpoch === filterEpochRef.current) {
        setVisibleLimit((prev) => prev + PAGE_SIZE);
      }
    } catch {
      if (requestEpoch === filterEpochRef.current) {
        setLoadMoreError(true);
      }
    } finally {
      if (requestEpoch === filterEpochRef.current) {
        isFetchingPageRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [
    displayedProducts.length,
    fetchMoreFromApi,
    hasMoreProducts,
    isLoadingMore,
    visibleLimit,
  ]);

  useEffect(() => {
    const node = loadMoreTriggerRef.current;
    if (!node || !hasMoreProducts || loadMoreError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          !isLoadingMore &&
          !isFetchingPageRef.current
        ) {
          void handleLoadMore();
        }
      },
      { rootMargin: '160px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMoreProducts, isLoadingMore, loadMoreError]);

  const hasActiveFilters =
    selectedCategoryId !== 'all' ||
    Boolean(searchQuery.trim()) ||
    smartFilters.under2000Bdt ||
    smartFilters.arrivesThisWeek ||
    smartFilters.lowestLandedCost ||
    smartFilters.verifiedOnly;

  const clearAllCatalogFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId('all');
    resetSmartFilters();
  };

  return (
    <div className="p-4 space-y-5 pb-8 bg-app-bg">
      {/* 1. Global Product Search with Suggestions, Clear Action & Live Status */}
      <div className="relative z-20">
        <div className="relative flex items-center">
          <Search
            aria-hidden="true"
            className="w-4 h-4 text-content-muted absolute left-3.5 pointer-events-none"
          />
          <input
            type="search"
            role="searchbox"
            aria-label={
              isBn
                ? 'পণ্য, ব্র্যান্ড বা ক্যাটাগরি খুঁজুন'
                : 'Search global products, brands, or categories'
            }
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              window.setTimeout(() => setIsSearchFocused(false), 160);
            }}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder={
              isBn
                ? 'পণ্য, ব্র্যান্ড বা ক্যাটাগরি খুঁজুন...'
                : 'Search global products, brands, or categories...'
            }
            className="w-full h-11 pl-10 pr-16 rounded-xl bg-white border border-app-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary transition-colors"
          />
          <div className="absolute right-2.5 flex items-center gap-1">
            {isSearchingRemote && (
              <Loader2
                aria-label={isBn ? 'খোঁজা হচ্ছে' : 'Searching catalog'}
                className="w-3.5 h-3.5 text-brand-primary animate-spin"
              />
            )}
            {searchQuery && (
              <button
                type="button"
                aria-label={isBn ? 'সার্চ মুছুন' : 'Clear search'}
                onClick={() => setSearchQuery('')}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-content-muted hover:text-content-primary hover:bg-app-subtle transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Suggestions Dropdown when focused */}
        {isSearchFocused && searchQuery.trim().length > 0 && Array.isArray(searchSuggestions) && searchSuggestions.length > 0 && typeof searchSuggestions[0] === 'object' && (
          <div
            role="listbox"
            aria-label={isBn ? 'সার্চ সাজেশন' : 'Search suggestions'}
            className="mt-1.5 rounded-xl bg-white border border-app-border shadow-md py-1.5 overflow-hidden"
          >
            {(searchSuggestions as { id: string; label: string; categoryId: CategoryId }[]).map(
              (item) => (
                <button
                  key={`sug-${item.id}`}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsSearchFocused(false);
                    navigateTo('product_detail', { productId: item.id });
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-content-primary hover:bg-app-subtle flex items-center justify-between gap-2 transition-colors"
                >
                  <span className="truncate font-medium">{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-content-muted shrink-0" />
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* 2. Compact Promotional Hero Carousel (Hidden while actively typing a search query so results appear immediately) */}
      {!searchQuery.trim() && (
        <section
          aria-label={
            isBn
              ? 'ক্রস-বর্ডার শপিং হাইলাইটস'
              : 'Cross-Border Shopping Highlights'
          }
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
          onTouchStart={() => setIsHeroPaused(true)}
          onTouchEnd={() => setIsHeroPaused(false)}
          onFocusCapture={() => setIsHeroPaused(true)}
          onBlurCapture={() => setIsHeroPaused(false)}
          className="relative overflow-hidden rounded-2xl bg-brand-primary text-white p-3.5 sm:p-4 select-none"
        >
          <AnimatePresence mode="wait" custom={heroDirection} initial={false}>
            <motion.div
              key={activeSlide.id}
              custom={heroDirection}
              initial={
                prefersReducedMotion
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: heroDirection > 0 ? 28 : -28 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: heroDirection > 0 ? -28 : 28 }
              }
              transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
              drag={prefersReducedMotion ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x < -36) {
                  setHeroDirection(1);
                  setHeroIndex((prev) => (prev + 1) % heroSlides.length);
                } else if (info.offset.x > 36) {
                  setHeroDirection(-1);
                  setHeroIndex(
                    (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
                  );
                }
              }}
              className="flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-[11px] font-medium text-emerald-100 truncate">
                  {activeSlide.kicker}
                </p>

                <h2 className="text-[15px] sm:text-base leading-5 font-bold tracking-tight text-white line-clamp-2">
                  {activeSlide.title}
                </h2>

                <p className="text-xs leading-4 text-emerald-50/90 line-clamp-2">
                  {activeSlide.subtitle}
                </p>

                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={activeSlide.primaryAction}
                    className="h-9 px-3.5 rounded-xl bg-white text-brand-primary hover:bg-brand-subtle font-semibold text-xs transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {activeSlide.primaryLabel}
                  </button>
                </div>
              </div>

              {heroProduct && heroPricing && (
                <div
                  onClick={() =>
                    navigateTo('product_detail', { productId: heroProduct.id })
                  }
                  role="button"
                  tabIndex={0}
                  aria-label={`${isBn ? heroProduct.nameBn : heroProduct.name}, ${formatPrice(
                    heroPricing.estimatedLandedBdt
                  )}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigateTo('product_detail', { productId: heroProduct.id });
                    }
                  }}
                  className="w-20 sm:w-22 shrink-0 bg-white/10 border border-white/15 rounded-xl p-1.5 text-center cursor-pointer hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <div className="w-full aspect-square rounded-lg bg-white overflow-hidden mb-1">
                    <img
                      src={heroProduct.image}
                      alt={isBn ? heroProduct.nameBn : heroProduct.name}
                      width={88}
                      height={88}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="block font-mono-num text-[11px] leading-3.5 font-bold text-white truncate">
                    {formatPrice(heroPricing.estimatedLandedBdt)}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Quiet Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2.5">
            {heroSlides.map((slide, idx) => {
              const active = idx === heroIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={
                    isBn ? `স্লাইড ${idx + 1}` : `Go to slide ${idx + 1}`
                  }
                  aria-current={active ? 'true' : undefined}
                  onClick={() => goToHeroSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    active ? 'w-5 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'
                  }`}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Three-Tool Shortcut Strip (Price History, Route Compare, Order Tracking) */}
      {!searchQuery.trim() && (
        <section
          aria-label={isBn ? 'শপিং টুলস' : 'Cross-Border Shopping Tools'}
          className="grid grid-cols-3 gap-2 sm:gap-2.5"
        >
          <button
            type="button"
            onClick={() => navigateTo('price_tracker')}
            className="p-2.5 sm:p-3 rounded-2xl bg-white border border-app-border hover:border-app-borderStrong flex flex-col items-start gap-1.5 transition-colors text-left min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-content-primary truncate w-full">
              {isBn ? 'প্রাইস হিস্ট্রি' : 'Price History'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('seller_compare')}
            className="p-2.5 sm:p-3 rounded-2xl bg-white border border-app-border hover:border-app-borderStrong flex flex-col items-start gap-1.5 transition-colors text-left min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-content-primary truncate w-full">
              {isBn ? 'রুট তুলনা' : 'Route Compare'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('order_tracking', { orderId: latestOrderId })}
            className="p-2.5 sm:p-3 rounded-2xl bg-white border border-app-border hover:border-app-borderStrong flex flex-col items-start gap-1.5 transition-colors text-left min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-content-primary truncate w-full">
              {isBn ? 'অর্ডার ট্র্যাক' : 'Order Radar'}
            </span>
          </button>
        </section>
      )}

      {/* 4, 5, 6 & 7. Global Catalog Heading, Category Filters, Smart Filters & Two-Column Product Grid */}
      <section
        id="home-catalog-section"
        aria-label={isBn ? 'গ্লোবাল ক্যাটালগ' : 'Global Product Catalog'}
        className="space-y-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-content-primary">
              {isBn ? 'গ্লোবাল ক্যাটালগ' : 'Global Catalog'}
            </h2>
            <p className="text-[11px] text-content-secondary truncate">
              {isBn
                ? 'আনুমানিক কাস্টমস ও ডেলিভারি চার্জসহ ল্যান্ডেড মূল্য'
                : currency === 'USD'
                ? `Est. landed prices ($1 = ৳${EXCHANGE_RATE_SNAPSHOT.bdtPerUsd} · Settles in BDT)`
                : 'Estimated total landed prices including freight & customs'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('categories')}
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1 shrink-0 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
          >
            <span>{isBn ? 'সব বিভাগ' : 'All Categories'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5. Horizontally Scrollable Category Filter Chips (Shared Context State) */}
        <div
          role="group"
          aria-label={isBn ? 'ক্যাটাগরি ফিল্টার' : 'Category filters'}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5"
        >
          <button
            type="button"
            aria-pressed={selectedCategoryId === 'all'}
            onClick={() => setSelectedCategoryId('all')}
            className={`h-8 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
              selectedCategoryId === 'all'
                ? 'bg-brand-primary text-white border-brand-primary'
                : 'bg-white border-app-border text-content-secondary hover:text-content-primary'
            }`}
          >
            {isBn ? 'সব পণ্য' : 'All'}
          </button>

          {CATEGORIES.map((cat) => {
            const active = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedCategoryId(active ? 'all' : cat.id)}
                className={`h-8 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                  active
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-white border-app-border text-content-secondary hover:text-content-primary'
                }`}
              >
                {isBn ? cat.nameBn : cat.name}
              </button>
            );
          })}
        </div>

        {/* 6. Smart Product Filters with Clear Individual & Reset All Controls */}
        <div
          role="group"
          aria-label={isBn ? 'স্মার্ট ফিল্টার' : 'Smart product filters'}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5"
        >
          {(
            [
              {
                key: 'under2000Bdt',
                label: isBn
                  ? `${formatPrice(2000)}-এর নিচে`
                  : `Under ${formatPrice(2000)}`,
                active: smartFilters.under2000Bdt,
              },
              {
                key: 'arrivesThisWeek',
                label: isBn ? 'এই সপ্তাহেই ডেলিভারি' : 'Arrives this week',
                active: smartFilters.arrivesThisWeek,
              },
              {
                key: 'lowestLandedCost',
                label: isBn ? 'সবচেয়ে কম ল্যান্ডেড দাম' : 'Lowest landed price',
                active: smartFilters.lowestLandedCost,
              },
              {
                key: 'verifiedOnly',
                label: isBn ? 'ভেরিফায়েড সাপ্লায়ার' : 'Verified supplier',
                active: smartFilters.verifiedOnly,
              },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={f.active}
              onClick={() =>
                setSmartFilters((prev) => ({
                  ...prev,
                  [f.key]: !prev[f.key],
                }))
              }
              className={`h-7 px-3 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                f.active
                  ? 'bg-brand-subtle text-brand-primary border border-brand-border font-semibold'
                  : 'bg-app-subtle text-content-secondary hover:text-content-primary border border-transparent'
              }`}
            >
              <span>{f.label}</span>
              {f.active && <X className="w-3 h-3 shrink-0" />}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllCatalogFilters}
              className="h-7 px-2.5 rounded-lg text-xs font-semibold text-brand-primary hover:bg-brand-subtle whitespace-nowrap shrink-0 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isBn ? 'রিসেট' : 'Reset'}</span>
            </button>
          )}
        </div>

        {/* Optional Recoverable API Sync Notice */}
        {catalogSyncError && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-white border border-app-border flex items-center justify-between gap-2 text-xs text-content-secondary"
          >
            <span className="truncate">{catalogSyncError}</span>
            <button
              type="button"
              onClick={() => void refreshCatalogFromApi()}
              className="px-2.5 py-1 rounded-lg bg-brand-subtle text-brand-primary font-semibold shrink-0"
            >
              {isBn ? 'আবার চেষ্টা করুন' : 'Retry'}
            </button>
          </div>
        )}

        {/* 7. Two-Column Product Grid */}
        <div
          id="home-items-area"
          aria-busy={isLoadingProducts || isLoadingMore}
          className="relative min-h-[260px] pt-0.5"
        >
          {isLoadingProducts && slicedProducts.length === 0 ? (
            <div role="status" aria-live="polite">
              <span className="sr-only">
                {isBn ? 'পণ্য লোড হচ্ছে...' : 'Loading products...'}
              </span>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <ProductCardGhost key={`home-init-ghost-${idx}`} />
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
                  Array.from({ length: 2 }).map((_, idx) => (
                    <ProductCardGhost key={`home-more-ghost-${idx}`} />
                  ))}
              </div>

              {loadMoreError && (
                <div className="pt-3 text-center">
                  <p className="text-xs text-content-secondary mb-2">
                    {isBn
                      ? 'অতিরিক্ত পণ্য লোড করা যায়নি।'
                      : 'Could not load additional products.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleLoadMore()}
                    className="h-9 px-4 rounded-xl bg-brand-subtle text-brand-primary text-xs font-semibold"
                  >
                    {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry Loading'}
                  </button>
                </div>
              )}

              {hasMoreProducts && !loadMoreError && (
                <div ref={loadMoreTriggerRef} className="pt-4">
                  <button
                    type="button"
                    disabled={isLoadingMore}
                    onClick={() => void handleLoadMore()}
                    className="w-full min-h-[44px] rounded-xl bg-white border border-app-border hover:border-app-borderStrong text-xs font-semibold text-content-primary flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                  >
                    {isLoadingMore && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                    )}
                    <span>
                      {isLoadingMore
                        ? isBn
                          ? 'লোড হচ্ছে...'
                          : 'Loading more products...'
                        : isBn
                        ? 'আরও পণ্য দেখুন'
                        : 'Load More Products'}
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center border border-app-border">
              <p className="text-xs font-semibold text-content-primary">
                {isBn
                  ? 'কোনো মিলে যাওয়া পণ্য পাওয়া যায়নি'
                  : 'No matching products found'}
              </p>
              <p className="text-xs text-content-secondary mt-1">
                {isBn
                  ? 'আপনার সার্চ বা সক্রিয় ফিল্টার পরিবর্তন করে দেখুন।'
                  : 'Try clearing your search query or resetting active filters.'}
              </p>
              <button
                type="button"
                onClick={clearAllCatalogFilters}
                className="mt-3 h-9 px-4 rounded-xl bg-brand-primary text-white text-xs font-semibold"
              >
                {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 8. Featured Landed Drops Horizontal Rail (Shown when qualifying deals >= 15% exist) */}
      {!searchQuery.trim() && flashDeals.length > 0 && (
        <section
          aria-label={isBn ? 'সেরা ল্যান্ডেড ডিল' : 'Featured Landed Drops'}
          className="space-y-2.5 pt-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-content-primary">
                {isBn ? 'সেরা ল্যান্ডেড ডিল' : 'Featured Landed Drops'}
              </h2>
              <p className="text-[11px] text-content-secondary">
                {isBn
                  ? 'যাচাইকৃত ১৫%+ ল্যান্ডেড মূল্য ছাড়'
                  : 'Verified 15%+ savings on estimated landed price'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label={isBn ? 'বামে স্ক্রল করুন' : 'Scroll deals left'}
                onClick={() => scrollDealsSlider('left')}
                className="w-8 h-8 rounded-lg bg-white border border-app-border flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label={isBn ? 'ডানে স্ক্রল করুন' : 'Scroll deals right'}
                onClick={() => scrollDealsSlider('right')}
                className="w-8 h-8 rounded-lg bg-white border border-app-border flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={dealsSliderRef}
            className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-0.5"
          >
            {flashDeals.map(({ product: deal, pricing }) => {
              const isFlashAdded = justAddedFlashId === deal.id;
              return (
                <motion.div
                  key={`flash-${deal.id}`}
                  whileTap={{ scale: 0.985 }}
                  onClick={() =>
                    navigateTo('product_detail', { productId: deal.id })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigateTo('product_detail', { productId: deal.id });
                    }
                  }}
                  className="w-56 shrink-0 snap-start bg-white rounded-2xl border border-app-border p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-app-borderStrong transition-colors text-left"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-app-border overflow-hidden shrink-0">
                    <img
                      src={deal.image}
                      alt={isBn ? deal.nameBn : deal.name}
                      width={56}
                      height={56}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-content-primary truncate">
                      {isBn ? deal.nameBn : deal.name}
                    </h3>
                    <p className="text-[11px] text-brand-primary font-medium mt-0.5 truncate">
                      {isBn
                        ? `সাশ্রয় ${formatPrice(pricing.savingsBdt)} (${pricing.discountPercent}%)`
                        : `Save ${formatPrice(pricing.savingsBdt)} (${pricing.discountPercent}%)`}
                    </p>
                    <div className="flex items-center justify-between mt-1 gap-1">
                      <div className="min-w-0">
                        <span className="font-mono-num text-xs font-bold text-content-primary block truncate">
                          {formatPrice(pricing.estimatedLandedBdt)}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label={
                          isBn
                            ? `${deal.nameBn} কার্টে যোগ করুন`
                            : `Quick add ${deal.name}`
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFlashAdded) return;
                          if (deal.sizes && deal.sizes.length > 1) {
                            navigateTo('product_detail', { productId: deal.id });
                            return;
                          }
                          addToCart(deal.id, 1);
                          setJustAddedFlashId(deal.id);
                          window.setTimeout(() => setJustAddedFlashId(null), 750);
                        }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          isFlashAdded
                            ? 'bg-brand-primary text-white'
                            : 'bg-brand-subtle hover:bg-brand-primary text-brand-primary hover:text-white border border-brand-border'
                        }`}
                      >
                        {isFlashAdded ? (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* 9. Recently Viewed Horizontal Rail (Deduplicated, ordered by most recent view) */}
      {!searchQuery.trim() && recentlyViewedProducts.length > 0 && (
        <section
          aria-label={isBn ? 'সম্প্রতি দেখা পণ্য' : 'Recently Viewed Products'}
          className="space-y-2 pt-1"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-content-primary">
              {isBn ? 'সম্প্রতি দেখা পণ্য' : 'Recently Viewed'}
            </h2>
          </div>

          <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-0.5">
            {recentlyViewedProducts.map((item) => {
              const itemPricing = getCanonicalLandedPricing(
                item,
                selectedRouteByProduct
              );
              return (
                <div
                  key={`recent-${item.id}`}
                  onClick={() =>
                    navigateTo('product_detail', { productId: item.id })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigateTo('product_detail', { productId: item.id });
                    }
                  }}
                  className="w-44 shrink-0 snap-start bg-white rounded-2xl border border-app-border p-2.5 flex items-center gap-2.5 hover:border-app-borderStrong transition-colors cursor-pointer text-left"
                >
                  <img
                    src={item.image}
                    alt={isBn ? item.nameBn : item.name}
                    width={44}
                    height={44}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover bg-slate-50 border border-app-border shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-content-primary truncate">
                      {isBn ? item.nameBn : item.name}
                    </p>
                    <p className="font-mono-num text-xs font-bold text-content-primary mt-0.5">
                      {formatPrice(itemPricing.estimatedLandedBdt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

