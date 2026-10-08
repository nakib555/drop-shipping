import React, { useCallback, useEffect, useRef, useState } from 'react';
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

  // Screen 1: Clean Single-Grid Category Directory with Live API Counts
  if (currentScreen === 'categories') {
    const visibleCategories = CATEGORIES.filter((c) =>
      c.name.toLowerCase().includes(catSearch.toLowerCase())
    );

    return (
      <div className="p-4 space-y-4 pb-6 bg-[#F8FAFC]">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder="Search departments..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs leading-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        {/* All Global Products Banner */}
        <button
          type="button"
          onClick={() => navigateTo('category_products', { categoryId: 'all' })}
          className="w-full p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between text-left hover:bg-slate-800 transition-colors"
        >
          <div>
            <span className="text-[11px] leading-4 text-emerald-400 font-medium block">
              Full Cross-Border Catalog
            </span>
            <h2 className="text-sm leading-5 font-semibold mt-0.5">
              {language === 'BN' ? 'সকল গ্লোবাল পণ্য দেখুন' : 'Browse All Global Products'}
            </h2>
            <p className="text-xs leading-4 text-slate-300 mt-0.5 font-mono-num">
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
                className="bg-white rounded-2xl p-4 border border-slate-200/80 flex flex-col items-start text-left hover:border-slate-300 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-[#059669] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs leading-4 font-semibold text-slate-900">
                  {language === 'BN' ? cat.nameBn : cat.name}
                </h3>
                <div className="mt-1 text-[11px] leading-4 text-slate-500 flex items-center gap-1">
                  <span className="font-mono-num">{liveCount} items</span>
                  <span aria-hidden="true">·</span>
                  <span>{cat.deliveryRange}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Screen 2: Category Product Listing + Animated Filter Sheet
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

  return (
    <div className="p-4 space-y-4 pb-6 bg-[#F8FAFC]">
      {/* Search + Filter Drawer Trigger */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder="Search in catalog..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs leading-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>
        <button
          type="button"
          onClick={() => setFilterSheetOpen(true)}
          className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs leading-4 font-medium text-slate-700 flex items-center gap-2 hover:border-slate-300"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#059669]" />
          <span>Filters</span>
        </button>
      </div>

      {/* Category Switcher Slidebar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => setSelectedCategoryId('all')}
          className={`relative h-10 px-3.5 rounded-xl text-xs leading-4 font-semibold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 justify-center transition-colors border ${
            selectedCategoryId === 'all'
              ? 'text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300'
          }`}
        >
          {selectedCategoryId === 'all' && (
            <motion.span
              layoutId="catActiveSlidePill"
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 rounded-xl bg-slate-900"
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
            className={`relative z-10 font-mono-num text-[11px] leading-4 ${
              selectedCategoryId === 'all' ? 'text-emerald-400' : 'text-slate-400'
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
              className={`relative h-10 px-3.5 rounded-xl text-xs leading-4 font-semibold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 justify-center transition-colors border ${
                isSelected
                  ? 'text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="catActiveSlidePill"
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 rounded-xl bg-slate-900"
                />
              )}
              <Icon
                className={`relative z-10 w-3.5 h-3.5 ${
                  isSelected ? 'text-emerald-400' : 'text-slate-400'
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
                className={`relative z-10 font-mono-num text-[11px] leading-4 ${
                  isSelected ? 'text-emerald-400' : 'text-slate-400'
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
              className={`h-8 px-3 rounded-lg text-[11px] leading-4 font-medium whitespace-nowrap shrink-0 inline-flex items-center justify-center transition-colors ${
                sortBy === tab.id
                  ? 'bg-[#059669] text-white'
                  : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigateTo('spec_compare')}
          className="text-xs leading-4 font-medium text-[#059669] hover:underline whitespace-nowrap shrink-0"
        >
          Compare Specs
        </button>
      </div>

      {/* Scoped Items Area (Uses 1:1 Ghost Card Elements for Lazy Loading; search & filter bars stay static) */}
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

              {/* 1:1 Ghost Elements appended when lazy-loading next batch */}
              {isLoadingMore &&
                Array.from({ length: 4 }).map((_, idx) => (
                  <ProductCardGhost key={`cat-more-ghost-${idx}`} />
                ))}
            </div>

            {/* Lazy-Load Sentinel & Item Count Progress Footer inside Items Area */}
            {filtered.length > PAGE_SIZE && (
              <div
                ref={loadMoreTriggerRef}
                role="status"
                aria-live="polite"
                className="pt-3 space-y-2.5"
              >
                <div className="flex items-center justify-between text-[11px] leading-4 text-slate-500 px-0.5">
                  <span>
                    Showing{' '}
                    <strong className="font-mono-num text-slate-900 font-semibold">
                      {slicedProducts.length}
                    </strong>{' '}
                    of{' '}
                    <strong className="font-mono-num text-slate-900 font-semibold">
                      {filtered.length}
                    </strong>{' '}
                    items
                  </span>
                  <span className="font-mono-num text-slate-400">
                    {Math.round((slicedProducts.length / filtered.length) * 100)}%
                    loaded
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    className="h-full bg-[#059669] rounded-full transition-all duration-300"
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
                      className="w-full h-10 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs leading-4 font-semibold text-slate-900 flex items-center justify-center gap-2 transition-colors shadow-2xs"
                    >
                      <span>
                        Load More Items ({filtered.length - visibleLimit}{' '}
                        remaining)
                      </span>
                    </button>
                  )
                ) : (
                  <p className="text-center text-[11px] leading-4 text-slate-400 py-1">
                    All {filtered.length} items loaded
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/80">
            <p className="text-xs leading-4 font-semibold text-slate-900">
              No products in this filter range
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryId('all');
                resetSmartFilters();
              }}
              className="mt-3 h-9 px-4 rounded-lg bg-slate-900 text-white text-xs leading-4 font-medium"
            >
              Show All Products
            </button>
          </div>
        )}
      </div>

      {/* Animated Slide-Up Filter Bottom Sheet */}
      <AnimatePresence>
        {filterSheetOpen && (
          <div className="absolute inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterSheetOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="relative z-10 w-full bg-white rounded-t-3xl p-4 shadow-2xl space-y-4"
            >
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm leading-5 font-semibold text-slate-900">
                  Filter Catalog
                </h3>
                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Max Landed Price Range Slidebar (Up to 250,000 BDT) */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs leading-4 font-medium text-slate-600">
                    Max Total Landed Price
                  </span>
                  <span className="font-mono-num text-sm leading-5 font-bold text-slate-900">
                    {formatPrice(smartFilters.maxPriceBdt)}
                  </span>
                </div>

                {/* Tactile Range Slider Track */}
                <div className="relative flex items-center h-7">
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-[#059669] rounded-full transition-all duration-75"
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
                    className="pointer-events-none absolute w-5 h-5 rounded-full bg-white border-2 border-[#059669] shadow-sm -translate-x-1/2 transition-all duration-75"
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
                        className={`h-8 rounded-lg font-mono-num text-[11px] leading-4 font-semibold transition-colors ${
                          active
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-200/80 text-slate-600 hover:border-slate-300 hover:text-slate-900'
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
                <label className="min-h-[44px] px-1 flex items-center justify-between text-xs leading-4 font-medium text-slate-700 cursor-pointer">
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
                    className="w-4 h-4 accent-[#059669] rounded"
                  />
                </label>

                <label className="min-h-[44px] px-1 flex items-center justify-between text-xs leading-4 font-medium text-slate-700 cursor-pointer">
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
                    className="w-4 h-4 accent-[#059669] rounded"
                  />
                </label>

                <label className="min-h-[44px] px-1 flex items-center justify-between text-xs leading-4 font-medium text-slate-700 cursor-pointer">
                  <span>Verified Suppliers Only (DropScore 8.5+)</span>
                  <input
                    type="checkbox"
                    checked={smartFilters.verifiedOnly}
                    onChange={(e) =>
                      setSmartFilters((prev) => ({
                        ...prev,
                        verifiedOnly: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-[#059669] rounded"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={resetSmartFilters}
                  className="min-h-[44px] rounded-xl border border-slate-200 text-xs leading-4 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(false)}
                  className="min-h-[44px] rounded-xl bg-[#059669] text-white text-xs leading-4 font-semibold hover:bg-[#047857] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
