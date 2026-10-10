import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Car,
  ChevronRight,
  Cpu,
  Dumbbell,
  Gamepad2,
  HeartHandshake,
  Home,
  Search,
  Shirt,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { CATEGORIES } from '../../data/catalogData';
import { searchFreeProductApis } from '../../services/productApi';
import {
  doesProductArriveThisWeek,
  getCanonicalLandedPricing,
  isVerifiedQualitySupplier,
} from '../../utils/pricingEngine';
import { ProductCard, ProductCardGhost } from '../shared/ProductCard';

const PAGE_SIZE = 16;

export const CategoriesScreen: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    products,
    isLoadingProducts,
    fetchMoreFromApi,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedRouteByProduct,
    smartFilters,
    setSmartFilters,
    resetSmartFilters,
    formatPrice,
    language,
  } = useDeshiMart();

  const [catSearch, setCatSearch] = useState('');
  const [sortBy, setSortBy] = useState<'best' | 'price_asc' | 'rating'>('best');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState<number>(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isFilteringItems, setIsFilteringItems] = useState<boolean>(false);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const loadingTimerRef = useRef<number | null>(null);
  const filterTimerRef = useRef<number | null>(null);

  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    electronics: Cpu,
    fashion: Shirt,
    home_living: Home,
    beauty_health: HeartHandshake,
    sports_outdoor: Dumbbell,
    toys_games: Gamepad2,
    automotive: Car,
  };

  // Compute filtered & paginated products before any early return so all Hooks run unconditionally
  const filtered = products
    .filter((p) => {
      if (selectedCategoryId !== 'all' && p.category !== selectedCategoryId) {
        return false;
      }
      if (
        catSearch.trim() &&
        !p.name.toLowerCase().includes(catSearch.toLowerCase()) &&
        !p.subtitle.toLowerCase().includes(catSearch.toLowerCase())
      ) {
        return false;
      }
      const pricing = getCanonicalLandedPricing(p, selectedRouteByProduct);
      if (smartFilters.inStockOnly && !p.inStock) return false;
      if (smartFilters.dealsOnly && !pricing.hasValidDiscount) return false;
      if (smartFilters.under2000Bdt && pricing.estimatedLandedBdt > 2000) return false;
      if (
        smartFilters.arrivesThisWeek &&
        !doesProductArriveThisWeek(p, selectedRouteByProduct)
      ) {
        return false;
      }
      if (smartFilters.verifiedOnly && !isVerifiedQualitySupplier(p)) return false;
      if (pricing.estimatedLandedBdt > smartFilters.maxPriceBdt) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc' || smartFilters.lowestLandedCost) {
        const priceA = getCanonicalLandedPricing(a, selectedRouteByProduct).estimatedLandedBdt;
        const priceB = getCanonicalLandedPricing(b, selectedRouteByProduct).estimatedLandedBdt;
        return priceA - priceB;
      }
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.dropScore - a.dropScore;
    });

  const slicedProducts = filtered.slice(0, visibleLimit);
  const hasMoreProducts = filtered.length > visibleLimit;

  const activeFilterCount =
    (smartFilters.inStockOnly ? 1 : 0) +
    (smartFilters.dealsOnly ? 1 : 0) +
    (smartFilters.verifiedOnly ? 1 : 0) +
    (smartFilters.maxPriceBdt < 250000 ? 1 : 0);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMoreProducts) return;
    setIsLoadingMore(true);
    if (visibleLimit + PAGE_SIZE * 2 >= filtered.length) {
      void fetchMoreFromApi();
    }
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
    }
    loadingTimerRef.current = window.setTimeout(() => {
      setVisibleLimit((prev) => prev + PAGE_SIZE);
      setIsLoadingMore(false);
    }, 360);
  }, [
    fetchMoreFromApi,
    filtered.length,
    hasMoreProducts,
    isLoadingMore,
    visibleLimit,
  ]);

  useEffect(() => {
    const q = catSearch.trim();
    if (q.length < 2) return;
    const timer = window.setTimeout(() => {
      void searchFreeProductApis(q).then(() => fetchMoreFromApi());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [catSearch, fetchMoreFromApi]);

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
    selectedCategoryId,
    catSearch,
    sortBy,
    smartFilters.inStockOnly,
    smartFilters.dealsOnly,
    smartFilters.maxPriceBdt,
    smartFilters.verifiedOnly,
  ]);

  useEffect(() => {
    if (currentScreen !== 'category_products') return;
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
  }, [currentScreen, handleLoadMore, hasMoreProducts, isLoadingMore]);

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

  // Screen 1: Clean Single-Grid Category Directory
  if (currentScreen === 'categories') {
    const visibleCategories = CATEGORIES.filter((c) =>
      c.name.toLowerCase().includes(catSearch.toLowerCase())
    );

    return (
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder={
              language === 'BN' ? 'বিভাগ খুঁজুন...' : 'Search departments...'
            }
            className="w-full h-11 pl-10 pr-9 rounded-xl bg-white border border-app-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary transition-colors"
          />
          {catSearch && (
            <button
              type="button"
              onClick={() => setCatSearch('')}
              aria-label="Clear department search"
              className="w-7 h-7 rounded-lg text-content-muted hover:text-content-primary flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* All Global Products Banner — Cohesive Forest Emerald */}
        <button
          type="button"
          onClick={() => navigateTo('category_products', { categoryId: 'all' })}
          className="w-full p-4 rounded-2xl bg-brand-primary text-white flex items-center justify-between text-left hover:bg-brand-hover transition-colors"
        >
          <div>
            <h2 className="text-sm font-semibold">
              {language === 'BN'
                ? 'সকল গ্লোবাল পণ্য দেখুন'
                : 'Browse All Global Products'}
            </h2>
            <p className="text-xs text-emerald-50/90 mt-0.5 font-mono-num">
              {products.length} items · Duty & VAT included
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-100 shrink-0" />
        </button>

        {/* Clean 2-Column Department Cards (One visual focal point per card) */}
        <div className="grid grid-cols-2 gap-3">
          {visibleCategories.map((cat, idx) => {
            const Icon = iconMap[cat.id] || Cpu;
            const liveCount = products.filter((p) => p.category === cat.id).length;

            return (
              <motion.button
                key={cat.id}
                type="button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.025, duration: 0.16 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigateTo('category_products', { categoryId: cat.id })
                }
                className="bg-white rounded-xl p-3.5 border border-app-border flex flex-col justify-between text-left hover:border-brand-border transition-colors group"
              >
                <div className="w-full flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-content-muted group-hover:text-brand-primary transition-colors shrink-0" />
                </div>

                <div className="w-full">
                  <h3 className="text-sm font-semibold text-content-primary truncate">
                    {language === 'BN' ? cat.nameBn : cat.name}
                  </h3>
                  <p className="text-[11px] text-content-secondary font-mono-num mt-1 truncate">
                    {liveCount} items · {cat.deliveryRange}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Screen 2: Category Product Listing + Filter Sheet
  return (
    <div className="p-4 space-y-3.5 pb-6 bg-app-bg">
      {/* Search + Filter Drawer Trigger */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder={
              language === 'BN' ? 'ক্যাটালগে খুঁজুন...' : 'Search in catalog...'
            }
            className="w-full h-11 pl-10 pr-8 rounded-xl bg-white border border-app-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary transition-colors"
          />
          {catSearch && (
            <button
              type="button"
              onClick={() => setCatSearch('')}
              aria-label="Clear search"
              className="w-7 h-7 rounded-lg text-content-muted hover:text-content-primary flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setFilterSheetOpen(true)}
          className={`h-11 px-3.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
            activeFilterCount > 0
              ? 'bg-brand-subtle border-brand-border text-brand-primary font-semibold'
              : 'bg-white border-app-border text-content-primary hover:border-app-borderStrong'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="font-mono-num text-[11px]">
              ({activeFilterCount})
            </span>
          )}
        </button>
      </div>

      {/* Category Switcher Slidebar — Unified Brand Emerald Active State */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => setSelectedCategoryId('all')}
          className={`h-9 px-3.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 justify-center transition-colors border ${
            selectedCategoryId === 'all'
              ? 'bg-brand-primary text-white border-brand-primary font-semibold'
              : 'bg-white text-content-secondary border-app-border hover:border-app-borderStrong'
          }`}
        >
          <span>{language === 'BN' ? 'সব পণ্য' : 'All'}</span>
          <span
            className={`font-mono-num text-[11px] ${
              selectedCategoryId === 'all'
                ? 'text-emerald-100'
                : 'text-content-muted'
            }`}
          >
            {products.length}
          </span>
        </button>
        {CATEGORIES.map((c) => {
          const count = products.filter((p) => p.category === c.id).length;
          const isSelected = selectedCategoryId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategoryId(c.id)}
              className={`h-9 px-3.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 justify-center transition-colors border ${
                isSelected
                  ? 'bg-brand-primary text-white border-brand-primary font-semibold'
                  : 'bg-white text-content-secondary border-app-border hover:border-app-borderStrong'
              }`}
            >
              <span>{language === 'BN' ? c.nameBn : c.name}</span>
              <span
                className={`font-mono-num text-[11px] ${
                  isSelected ? 'text-emerald-100' : 'text-content-muted'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort Bar — Soft Emerald Active State */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          {(
            [
              { id: 'best', label: 'Best Match' },
              { id: 'price_asc', label: 'Lowest Landed' },
              { id: 'rating', label: 'Top Rated' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSortBy(tab.id)}
              className={`h-8 px-3 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 inline-flex items-center justify-center transition-colors border ${
                sortBy === tab.id
                  ? 'bg-brand-subtle text-brand-primary border-brand-border font-semibold'
                  : 'bg-white text-content-secondary border-app-border hover:text-content-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigateTo('spec_compare')}
          className="text-xs font-medium text-brand-primary hover:underline whitespace-nowrap shrink-0"
        >
          Compare Specs
        </button>
      </div>

      {/* Scoped Items Area */}
      <div
        id="catalog-items-area"
        aria-busy={isLoadingProducts || isFilteringItems || isLoadingMore}
        className="relative min-h-[280px]"
      >
        {isLoadingProducts || isFilteringItems ? (
          <div role="status" aria-live="polite">
            <span className="sr-only">Loading catalog products...</span>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductCardGhost key={`cat-filter-ghost-${idx}`} />
              ))}
            </div>
          </div>
        ) : slicedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              {slicedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}

              {isLoadingMore &&
                Array.from({ length: 4 }).map((_, idx) => (
                  <ProductCardGhost key={`cat-more-ghost-${idx}`} />
                ))}
            </div>

            {hasMoreProducts && (
              <div
                ref={loadMoreTriggerRef}
                role="status"
                aria-live="polite"
                className="pt-3"
              >
                {!isLoadingMore && (
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="w-full min-h-[44px] rounded-xl bg-white border border-app-border hover:border-brand-border text-xs font-semibold text-content-primary flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>
                      Load More Products ({filtered.length - visibleLimit}{' '}
                      remaining)
                    </span>
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl p-6 text-center border border-app-border">
            <p className="text-xs font-semibold text-content-primary">
              No products in this filter range
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryId('all');
                setCatSearch('');
                resetSmartFilters();
              }}
              className="mt-3 h-9 px-4 rounded-lg bg-brand-primary text-white text-xs font-medium hover:bg-brand-hover transition-colors"
            >
              Show All Products
            </button>
          </div>
        )}
      </div>

      {/* Viewport-Docked Filter Bottom Sheet */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {filterSheetOpen && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Filter Catalog"
                className="pointer-events-auto absolute inset-0 z-50 flex items-end justify-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setFilterSheetOpen(false)}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="relative z-10 w-full max-h-[85%] bg-white rounded-t-2xl shadow-2xl border-t border-app-border flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0px)]"
                >
                  <div className="pt-2.5 pb-1 shrink-0">
                    <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
                  </div>
                  <div className="px-4 py-2.5 border-b border-app-border flex items-center justify-between gap-2 shrink-0">
                    <h3 className="text-sm font-semibold text-content-primary">
                      Filter Catalog
                    </h3>
                    <button
                      type="button"
                      aria-label="Close filters"
                      onClick={() => setFilterSheetOpen(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:bg-app-subtle shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4">
                    {/* Max Landed Price Range Slidebar */}
                    <div className="p-3.5 rounded-xl bg-app-bg border border-app-border space-y-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-medium text-content-secondary">
                          Max Total Landed Price
                        </span>
                        <span className="font-mono-num text-sm font-bold text-brand-primary">
                          {formatPrice(smartFilters.maxPriceBdt)}
                        </span>
                      </div>

                      {/* Tactile Range Slider Track */}
                      <div className="relative flex items-center h-7">
                        <div className="w-full h-2 rounded-full bg-app-border overflow-hidden">
                          <div
                            className="h-full bg-brand-primary rounded-full transition-all duration-75"
                            style={{
                              width: `${Math.max(
                                2,
                                Math.min(
                                  100,
                                  ((smartFilters.maxPriceBdt - 1500) /
                                    (250000 - 1500)) *
                                    100
                                )
                              )}%`,
                            }}
                          />
                        </div>
                        <input
                          type="range"
                          aria-label="Maximum total landed price"
                          min={1500}
                          max={250000}
                          step={1000}
                          value={smartFilters.maxPriceBdt}
                          onChange={(e) =>
                            setSmartFilters((prev) => ({
                              ...prev,
                              maxPriceBdt: Number(e.target.value),
                            }))
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute w-5 h-5 rounded-full bg-white border-2 border-brand-primary shadow-sm -translate-x-1/2 transition-all duration-75"
                          style={{
                            left: `${Math.max(
                              3,
                              Math.min(
                                97,
                                ((smartFilters.maxPriceBdt - 1500) /
                                  (250000 - 1500)) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>

                      {/* Quick Price Preset Buttons */}
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { label: '≤ 5k', value: 5000 },
                          { label: '≤ 25k', value: 25000 },
                          { label: '≤ 100k', value: 100000 },
                          { label: 'Any', value: 250000 },
                        ].map((preset) => {
                          const active = smartFilters.maxPriceBdt === preset.value;
                          return (
                            <button
                              key={preset.value}
                              type="button"
                              onClick={() =>
                                setSmartFilters((prev) => ({
                                  ...prev,
                                  maxPriceBdt: preset.value,
                                }))
                              }
                              className={`h-8 rounded-lg font-mono-num text-[11px] font-medium transition-colors border ${
                                active
                                  ? 'bg-brand-primary text-white border-brand-primary font-semibold'
                                  : 'bg-white border-app-border text-content-secondary hover:border-app-borderStrong hover:text-content-primary'
                              }`}
                            >
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="divide-y divide-app-border border border-app-border rounded-xl bg-white px-3.5">
                      <label className="min-h-[44px] flex items-center justify-between text-xs font-medium text-content-primary cursor-pointer">
                        <span>In Stock & Ready to Ship Only</span>
                        <input
                          type="checkbox"
                          checked={smartFilters.inStockOnly}
                          onChange={(e) =>
                            setSmartFilters((prev) => ({
                              ...prev,
                              inStockOnly: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 accent-emerald-700 rounded"
                        />
                      </label>

                      <label className="min-h-[44px] flex items-center justify-between text-xs font-medium text-content-primary cursor-pointer">
                        <span>Deals & Price Drops Only</span>
                        <input
                          type="checkbox"
                          checked={smartFilters.dealsOnly}
                          onChange={(e) =>
                            setSmartFilters((prev) => ({
                              ...prev,
                              dealsOnly: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 accent-emerald-700 rounded"
                        />
                      </label>

                      <label className="min-h-[44px] flex items-center justify-between text-xs font-medium text-content-primary cursor-pointer">
                        <span>Verified Factory Exporters Only</span>
                        <input
                          type="checkbox"
                          checked={smartFilters.verifiedOnly}
                          onChange={(e) =>
                            setSmartFilters((prev) => ({
                              ...prev,
                              verifiedOnly: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 accent-emerald-700 rounded"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-app-border bg-white grid grid-cols-2 gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={resetSmartFilters}
                      className="min-h-[44px] rounded-xl border border-app-border text-xs font-semibold text-content-primary hover:bg-app-subtle transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterSheetOpen(false)}
                      className="min-h-[44px] rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-hover transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.getElementById('mobile-sheet-root') || document.body
        )}
    </div>
  );
};
