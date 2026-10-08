import React, { useState } from 'react';
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
import { CategoryId } from '../../types/deshimart';
import { ProductCard } from '../shared/ProductCard';

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Cpu,
  Shirt,
  Home,
  HeartHandshake,
  Dumbbell,
  Gamepad2,
  Car,
};

export const CategoriesScreen: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    selectedCategoryId,
    setSelectedCategoryId,
    products,
    categoryFilters,
    setCategoryFilters,
    resetCategoryFilters,
    language,
    formatPrice,
  } = useDeshiMart();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  // Mode 1: All Categories Directory
  if (currentScreen === 'categories') {
    return (
      <div className="px-4 sm:px-6 py-6 space-y-6 bg-[#F8FAFC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {language === 'BN' ? 'সকল পণ্যের বিভাগ' : 'Browse Global Departments'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'BN'
                ? `${products.length}টি ভেরিফাইড গ্লোবাল পণ্য কাস্টমস ও ভ্যাটসহ`
                : `${products.length} verified global products with pre-cleared Bangladesh customs & VAT`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryId('all');
              navigateTo('category_products', { categoryId: 'all' });
            }}
            className="h-9 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold self-start sm:self-auto"
          >
            {language === 'BN' ? `সব পণ্য দেখুন (${products.length})` : `View All Products (${products.length})`}
          </button>
        </div>

        {/* Responsive Department Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.iconName] || Cpu;
            const deptProducts = products.filter((p) => p.category === cat.id);
            const liveCount = deptProducts.length;
            const previewImages = deptProducts.slice(0, 3).map((p) => p.image);

            return (
              <motion.button
                key={cat.id}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setSelectedCategoryId(cat.id as CategoryId);
                  navigateTo('category_products', { categoryId: cat.id as CategoryId });
                }}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between text-left gap-4"
              >
                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {language === 'BN' ? cat.nameBn : cat.name}
                      </h3>
                      <span className="font-mono-num text-xs font-medium text-[#059669]">
                        {liveCount} {language === 'BN' ? 'টি পণ্য' : 'Verified Items'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                </div>

                {/* Live Product Thumbnails Strip */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 w-full">
                    {previewImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-lg bg-slate-50 p-1.5 border border-slate-100 flex items-center justify-center overflow-hidden"
                      >
                        <img
                          src={imgUrl}
                          alt=""
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Mode 2: Category Product Listing + Filter Sheet
  const filtered = products
    .filter((p) =>
      selectedCategoryId === 'all' ? true : p.category === selectedCategoryId
    )
    .filter((p) =>
      localSearch.trim()
        ? p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(localSearch.toLowerCase())
        : true
    )
    .filter((p) => p.totalLandedBdt <= categoryFilters.maxPriceBdt)
    .filter((p) => p.rating >= categoryFilters.minRating)
    .filter((p) => (categoryFilters.inStockOnly ? p.inStock : true))
    .filter((p) => (categoryFilters.verifiedOnly ? p.verifiedSupplier : true))
    .filter((p) =>
      categoryFilters.fastDeliveryOnly ? p.arrivesThisWeek : true
    );

  const sorted = [...filtered].sort((a, b) => {
    if (categoryFilters.sortBy === 'price_asc') {
      return a.totalLandedBdt - b.totalLandedBdt;
    }
    if (categoryFilters.sortBy === 'rating_desc') {
      return b.rating - a.rating;
    }
    return b.dropScore - a.dropScore;
  });

  return (
    <div className="px-4 sm:px-6 py-5 space-y-5 bg-[#F8FAFC] relative">
      {/* Top Search + Sort + Filter Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={
                language === 'BN'
                  ? 'এই বিভাগে খুঁজুন...'
                  : 'Filter products in this department...'
              }
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
            />
          </div>
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(true)}
            className="h-10 px-3.5 rounded-xl bg-slate-900 text-white flex items-center gap-1.5 text-xs font-semibold shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{language === 'BN' ? 'ফিল্টার' : 'Filters'}</span>
          </button>
        </div>

        {/* Sort Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'best_match', label: 'Best Match' },
            { id: 'price_asc', label: 'Lowest Landed Price' },
            { id: 'rating_desc', label: 'Top Rated' },
          ].map((tab) => {
            const active = categoryFilters.sortBy === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setCategoryFilters((prev) => ({
                    ...prev,
                    sortBy: tab.id as typeof prev.sortBy,
                  }))
                }
                className={`h-8 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', name: 'All Products', nameBn: 'সব পণ্য' },
          ...CATEGORIES,
        ].map((cat) => {
          const active = selectedCategoryId === cat.id;
          const count =
            cat.id === 'all'
              ? products.length
              : products.filter((p) => p.category === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryId(cat.id as CategoryId)}
              className={`h-8 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                active
                  ? 'bg-[#059669] text-white font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <span>{language === 'BN' ? cat.nameBn : cat.name}</span>
              <span
                className={`font-mono-num text-[10px] ${
                  active ? 'text-emerald-100' : 'text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Grid */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 max-w-md mx-auto my-6">
          <p className="text-sm font-semibold text-slate-900">
            No products match your filter criteria
          </p>
          <button
            type="button"
            onClick={() => {
              resetCategoryFilters();
              setLocalSearch('');
            }}
            className="mt-3 h-9 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {sorted.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

      {/* Filter Modal */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Filter Catalog
                </h3>
                <button
                  type="button"
                  aria-label="Close filter drawer"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Max Landed Price Range Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">
                    Max Landed Price
                  </span>
                  <span className="font-mono-num font-semibold text-[#059669]">
                    Up to {formatPrice(categoryFilters.maxPriceBdt)}
                  </span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={250000}
                  step={1000}
                  value={categoryFilters.maxPriceBdt}
                  onChange={(e) =>
                    setCategoryFilters((prev) => ({
                      ...prev,
                      maxPriceBdt: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#059669]"
                />
              </div>

              {/* Customer Rating */}
              <div>
                <span className="block text-xs font-medium text-slate-700 mb-1.5">
                  Minimum Rating
                </span>
                <div className="flex gap-2">
                  {[0, 4.0, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() =>
                        setCategoryFilters((prev) => ({ ...prev, minRating: r }))
                      }
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                        categoryFilters.minRating === r
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {r === 0 ? 'All' : `${r}★+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
                  <span>Verified Factory Suppliers Only</span>
                  <input
                    type="checkbox"
                    checked={categoryFilters.verifiedOnly}
                    onChange={(e) =>
                      setCategoryFilters((prev) => ({
                        ...prev,
                        verifiedOnly: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-[#059669]"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
                  <span>Arrives This Week (3–7 Days)</span>
                  <input
                    type="checkbox"
                    checked={categoryFilters.fastDeliveryOnly}
                    onChange={(e) =>
                      setCategoryFilters((prev) => ({
                        ...prev,
                        fastDeliveryOnly: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-[#059669]"
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={resetCategoryFilters}
                  className="flex-1 h-11 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex-2 h-11 px-6 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                >
                  Show {sorted.length} Items
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
