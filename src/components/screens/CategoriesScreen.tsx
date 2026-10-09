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
import { ProductCard, ProductCardGhost } from '../shared/ProductCard';

const PAGE_SIZE = 16;

export const CategoriesScreen: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    products,
    isLoadingProducts,
    selectedCategoryId,
    setSelectedCategoryId,
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
      if (smartFilters.inStockOnly && !p.inStock) return false;
      if (smartFilters.dealsOnly && p.discountPercent <= 0) return false;
      if (smartFilters.verifiedOnly && (!p.verifiedSupplier || p.dropScore < 8.5))
        return false;
      if (p.totalLandedBdt > smartFilters.maxPriceBdt) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.totalLandedBdt - b.totalLandedBdt;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.dropScore - a.dropScore;
    });

  const slicedProducts = filtered.slice(0, visibleLimit);
  const hasMoreProducts = filtered.length > visibleLimit;

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

  // Screen 1: Clean Single-Grid Category Directory with Live API Counts
  if (currentScreen === 'categories') {
    const visibleCategories = CATEGORIES.filter((c) =>
      c.name.toLowerCase().includes(catSearch.toLowerCase())
    );

    return (
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        <div className="relative">
          <Search className="w-4 h-4 text-content-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder="Search departments..."
            className="w-full h-11 pl-9 pr-3 rounded-lg bg-white border border-app-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-app-borderStrong"
          />
        </div>

        {/* All Global Products Banner */}
        <button
          type="button"
          onClick={() => navigateTo('category_products', { categoryId: 'all' })}
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-white flex items-center justify-between text-left hover:opacity-95 transition-opacity"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400 block">
              Full Cross-Border Catalog
            </span>
            <h2 className="text-sm font-semibold mt-0.5">
              {language === 'BN' ? 'সকল গ্লোবাল পণ্য দেখুন' : 'Browse All Global Products'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 tabular-nums">
              {products.length} verified items · Duty & VAT included
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
        </button>

        {/* Clean 2-Column Department Cards */}
        <div className="grid grid-cols-2 gap-3">
          {visibleCategories.map((cat, idx) => {
            const Icon = iconMap[cat.id] || Cpu;
            const liveCount = products.filter((p) => p.category === cat.id).length;
            const flagshipItem = products.find((p) => p.category === cat.id);
            const thumbSrc = cat.featuredImage || flagshipItem?.image;

            return (
              <motion.button
                key={cat.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.18 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigateTo('category_products', { categoryId: cat.id })
                }
                className="bg-white rounded-xl p-3.5 border border-app-border flex flex-col justify-between text-left hover:border-app-borderStrong transition-colors group"
              >
                <div className="w-full flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-app-subtle text-content-primary flex items-center justify-center group-hover:bg-content-primary group-hover:text-white transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  {thumbSrc && (
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-app-border overflow-hidden shrink-0">
                      <img
                        src={thumbSrc}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <h3 className="text-sm font-medium text-content-primary truncate">
                    {language === 'BN' ? cat.nameBn : cat.name}
                  </h3>
                  {cat.subtitle && (
                    <p className="text-xs text-content-secondary truncate mt-0.5">
                      {cat.subtitle}
                    </p>
                  )}
                  <div className="mt-2 pt-2 border-t border-app-border text-xs text-content-secondary flex items-center justify-between gap-1">
                    <span className="tabular-nums font-semibold text-content-primary">
                      {liveCount} items
                    </span>
                    <span className="text-[11px] text-content-secondary">
                      {cat.deliveryRange}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Screen 2: Category Product Listing + Animated Filter Sheet

  return (
    <div className="p-4 space-y-4 pb-6 bg-app-bg">
      {/* Search + Filter Drawer Trigger */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-content-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder="Search in catalog..."
            className="w-full h-11 pl-9 pr-3 rounded-lg bg-white border border-app-border text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-app-borderStrong"
          />
        </div>
        <button
          type="button"
          onClick={() => setFilterSheetOpen(true)}
          className="h-11 px-3.5 rounded-lg bg-white border border-app-border text-xs font-medium text-content-primary flex items-center gap-2 hover:border-app-borderStrong"
        >
          <SlidersHorizontal className="w-4 h-4 text-content-secondary" />
          <span>Filters</span>
        </button>
      </div>

      {/* Category Switcher Slidebar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => setSelectedCategoryId('all')}
          className={`relative h-10 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 justify-center transition-colors border ${
            selectedCategoryId === 'all'
              ? 'text-white border-content-primary'
              : 'bg-white text-content-secondary border-app-border hover:border-app-borderStrong'
          }`}
        >
          {selectedCategoryId === 'all' && (
            <motion.span
              layoutId="catActiveSlidePill"
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 rounded-lg bg-content-primary"
            />
          )}
          <span className="relative z-10">{language === 'BN' ? 'সব পণ্য' : 'All'}</span>
          <span
            aria-hidden="true"
            className={`relative z-10 ${
              selectedCategoryId === 'all' ? 'text-slate-400' : 'text-slate-300'
            }`}
          >
            ·
          </span>
          <span
            className={`relative z-10 tabular-nums text-[11px] ${
              selectedCategoryId === 'all' ? 'text-slate-300' : 'text-content-muted'
            }`}
          >
            {products.length}
          </span>
        </button>
        {CATEGORIES.map((c) => {
          const count = products.filter((p) => p.category === c.id).length;
          const Icon = iconMap[c.id] || Cpu;
          const isSelected = selectedCategoryId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategoryId(c.id)}
              className={`relative h-10 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 justify-center transition-colors border ${
                isSelected
                  ? 'text-white border-content-primary'
                  : 'bg-white text-content-secondary border-app-border hover:border-app-borderStrong'
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="catActiveSlidePill"
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 rounded-lg bg-content-primary"
                />
              )}
              <Icon
                className={`relative z-10 w-3.5 h-3.5 ${
                  isSelected ? 'text-slate-300' : 'text-content-muted'
                }`}
              />
              <span className="relative z-10">
                {language === 'BN' ? c.nameBn : c.name}
              </span>
              <span
                aria-hidden="true"
                className={`relative z-10 ${
                  isSelected ? 'text-slate-400' : 'text-slate-300'
                }`}
              >
                ·
              </span>
              <span
                className={`relative z-10 tabular-nums text-[11px] ${
                  isSelected ? 'text-slate-300' : 'text-content-muted'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-0.5">
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
              className={`h-8 px-3 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 inline-flex items-center justify-center transition-colors ${
                sortBy === tab.id
                  ? 'bg-content-primary text-white font-semibold'
                  : 'bg-app-subtle text-content-secondary hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigateTo('spec_compare')}
          className="text-xs font-semibold text-content-primary hover:underline whitespace-nowrap shrink-0"
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

            {filtered.length > PAGE_SIZE && (
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
                      {filtered.length}
                    </strong>{' '}
                    items
                  </span>
                  <span className="tabular-nums text-content-muted">
                    {Math.round((slicedProducts.length / filtered.length) * 100)}%
                    loaded
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-app-border overflow-hidden">
                  <div
                    className="h-full bg-content-primary rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((slicedProducts.length / filtered.length) * 100)
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
                        Load More Items ({filtered.length - visibleLimit}{' '}
                        remaining)
                      </span>
                    </button>
                  )
                ) : (
                  <p className="text-center text-xs text-content-muted py-1">
                    All {filtered.length} items loaded
                  </p>
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
                resetSmartFilters();
              }}
              className="mt-3 h-9 px-4 rounded-lg bg-content-primary text-white text-xs font-medium"
            >
              Show All Products
            </button>
          </div>
        )}
      </div>

      {/* Viewport-Docked Filter Bottom Sheet (Fixed directly above BottomTabBar via #mobile-sheet-root) */}
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
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="relative z-10 w-full max-h-full overflow-y-auto bg-white rounded-t-2xl p-4 shadow-2xl space-y-4 border-t border-app-border"
                >
                  <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
                  <div className="flex items-center justify-between border-b border-app-border pb-3">
                    <h3 className="text-sm font-semibold text-content-primary">
                      Filter Catalog
                    </h3>
                    <button
                      type="button"
                      onClick={() => setFilterSheetOpen(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:bg-app-subtle"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Max Landed Price Range Slidebar (Up to 250,000 BDT) */}
                  <div className="p-3.5 rounded-xl bg-app-subtle border border-app-border space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-medium text-content-secondary">
                        Max Total Landed Price
                      </span>
                      <span className="tabular-nums text-sm font-bold text-content-primary">
                        {formatPrice(smartFilters.maxPriceBdt)}
                      </span>
                    </div>

                    {/* Tactile Range Slider Track */}
                    <div className="relative flex items-center h-7">
                      <div className="w-full h-2 rounded-full bg-app-border overflow-hidden">
                        <div
                          className="h-full bg-content-primary rounded-full transition-all duration-75"
                          style={{
                            width: `${Math.max(
                              2,
                              Math.min(
                                100,
                                ((smartFilters.maxPriceBdt - 1500) / (250000 - 1500)) * 100
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
                        className="pointer-events-none absolute w-5 h-5 rounded-full bg-white border-2 border-content-primary shadow-sm -translate-x-1/2 transition-all duration-75"
                        style={{
                          left: `${Math.max(
                            3,
                            Math.min(
                              97,
                              ((smartFilters.maxPriceBdt - 1500) / (250000 - 1500)) * 100
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
                            className={`h-8 rounded-lg tabular-nums text-[11px] font-semibold transition-colors ${
                              active
                                ? 'bg-content-primary text-white'
                                : 'bg-white border border-app-border text-content-secondary hover:border-app-borderStrong hover:text-content-primary'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-1 pt-1">
                    <label className="min-h-[44px] px-1 flex items-center justify-between text-xs font-medium text-content-primary cursor-pointer">
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
                        className="w-4 h-4 accent-slate-900 rounded"
                      />
                    </label>

                    <label className="min-h-[44px] px-1 flex items-center justify-between text-xs font-medium text-content-primary cursor-pointer">
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
                        className="w-4 h-4 accent-slate-900 rounded"
                      />
                    </label>

                    <label className="min-h-[44px] px-1 flex items-center justify-between text-xs font-medium text-content-primary cursor-pointer">
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
                        className="w-4 h-4 accent-slate-900 rounded"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={resetSmartFilters}
                      className="min-h-[44px] rounded-lg border border-app-border text-xs font-semibold text-content-primary hover:bg-slate-50 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterSheetOpen(false)}
                      className="min-h-[44px] rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-hover transition-colors"
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
