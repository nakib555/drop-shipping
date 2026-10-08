import React, { useState } from 'react';
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

export const CategoriesScreen: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    products,
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

  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    electronics: Cpu,
    fashion: Shirt,
    home_living: Home,
    beauty_health: HeartHandshake,
    sports_outdoor: Dumbbell,
    toys_games: Gamepad2,
    automotive: Car,
  };

  // Screen 1: Full Categories Directory (Grid + Detailed List)
  if (currentScreen === 'categories') {
    const visibleCategories = CATEGORIES.filter((c) =>
      c.name.toLowerCase().includes(catSearch.toLowerCase())
    );

    return (
      <div className="p-4 space-y-4 pb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs leading-4 text-[#0B3D2E] focus:outline-none focus:border-[#0EA75F]"
          />
        </div>

        {/* Visual 2-Column Grid */}
        <div className="grid grid-cols-2 gap-2">
          {visibleCategories.map((cat) => {
            const Icon = iconMap[cat.id] || Cpu;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  navigateTo('category_products', { categoryId: cat.id })
                }
                className="bg-white rounded-2xl p-3.5 border border-slate-200/80 flex flex-col items-start text-left hover:border-[#0EA75F] transition-colors group"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center mb-2.5 group-hover:bg-[#0EA75F] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-extrabold text-[#0B3D2E]">
                  {language === 'BN' ? cat.nameBn : cat.name}
                </h3>
                <div className="mt-1 text-[11px] text-[#6B7280] flex items-center gap-1">
                  <span className="font-mono-num">{cat.productCount} items</span>
                  <span>·</span>
                  <span className="text-[#0EA75F] font-medium">{cat.deliveryRange}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Full List View (Matching Screen 24/26 in UI Kit) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
          {visibleCategories.map((cat) => {
            const Icon = iconMap[cat.id] || Cpu;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  navigateTo('category_products', { categoryId: cat.id })
                }
                className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] text-[#0EA75F] flex items-center justify-center border border-slate-100">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0B3D2E]">
                      {language === 'BN' ? cat.nameBn : cat.name}
                    </p>
                    <p className="text-[11px] text-[#6B7280] font-mono-num">
                      {cat.productCount.toLocaleString()} products · {cat.deliveryRange}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Screen 2: Category Product Listing + Filter Sheet
  const filtered = products
    .filter((p) => {
      if (selectedCategoryId !== 'all' && p.category !== selectedCategoryId) {
        return false;
      }
      if (
        catSearch.trim() &&
        !p.name.toLowerCase().includes(catSearch.toLowerCase())
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

  return (
    <div className="p-3.5 space-y-3.5 pb-6">
      {/* Search + Filter Drawer Trigger */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder="Search in category..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs text-[#0B3D2E] focus:outline-none focus:border-[#0EA75F]"
          />
        </div>
        <button
          type="button"
          onClick={() => setFilterSheetOpen(true)}
          className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0B3D2E] flex items-center gap-1.5 hover:border-[#0EA75F]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#0EA75F]" />
          <span>Filters</span>
        </button>
      </div>

      {/* Category Pill Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategoryId('all')}
          className={`h-8 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategoryId === 'all'
              ? 'bg-[#0EA75F] text-white'
              : 'bg-white text-[#6B7280] border border-slate-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategoryId(c.id)}
            className={`h-8 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategoryId === c.id
                ? 'bg-[#0EA75F] text-white'
                : 'bg-white text-[#6B7280] border border-slate-200'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Sort Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
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
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                sortBy === tab.id
                  ? 'bg-[#0B3D2E] text-white'
                  : 'bg-white text-[#6B7280] border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigateTo('spec_compare')}
          className="text-[11px] font-bold text-[#0EA75F] hover:underline"
        >
          Compare Specs
        </button>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
          <p className="text-xs font-bold text-[#0B3D2E]">
            No products in this filter range
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryId('all');
              resetSmartFilters();
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-[#0EA75F] text-white text-xs font-bold"
          >
            Show All Products
          </button>
        </div>
      )}

      {/* Slide-Up Filter Bottom Sheet (Screen 23 / 25 in UI Kit) */}
      {filterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            onClick={() => setFilterSheetOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="relative z-10 w-full max-w-[412px] bg-white rounded-t-3xl p-5 shadow-2xl space-y-4">
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-2" />
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-[#0B3D2E]">
                Smart Filters
              </h3>
              <button
                type="button"
                onClick={() => setFilterSheetOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Max Landed Price Range */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#0B3D2E] mb-2">
                <span>Max Total Landed Price</span>
                <span className="font-mono-num text-[#0EA75F] font-bold">
                  {formatPrice(smartFilters.maxPriceBdt)}
                </span>
              </div>
              <input
                type="range"
                min={1500}
                max={90000}
                step={500}
                value={smartFilters.maxPriceBdt}
                onChange={(e) =>
                  setSmartFilters((prev) => ({
                    ...prev,
                    maxPriceBdt: Number(e.target.value),
                  }))
                }
                className="w-full accent-[#0EA75F]"
              />
              <div className="flex justify-between text-[10px] font-mono-num text-[#6B7280] mt-1">
                <span>{formatPrice(1500)}</span>
                <span>{formatPrice(90000)}</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2.5 pt-1">
              <label className="flex items-center justify-between text-xs font-semibold text-[#0B3D2E] cursor-pointer">
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
                  className="w-4 h-4 accent-[#0EA75F] rounded"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-[#0B3D2E] cursor-pointer">
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
                  className="w-4 h-4 accent-[#0EA75F] rounded"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-[#0B3D2E] cursor-pointer">
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
                  className="w-4 h-4 accent-[#0EA75F] rounded"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-3">
              <button
                type="button"
                onClick={resetSmartFilters}
                className="h-11 rounded-xl border border-slate-200 text-xs font-bold text-[#0B3D2E] hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setFilterSheetOpen(false)}
                className="h-11 rounded-xl bg-[#0EA75F] text-white text-xs font-bold shadow-md hover:bg-[#0B8A4D]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
