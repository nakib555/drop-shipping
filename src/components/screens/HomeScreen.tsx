import React from 'react';
import {
  ArrowRight,
  Camera,
  Scale,
  Search,
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
    searchQuery,
    setSearchQuery,
    smartFilters,
    setSmartFilters,
    language,
    formatPrice,
  } = useDeshiMart();

  const heroProduct = products[0];

  const filteredProducts = products.filter((p) => {
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

  // 8pt Grid: p-4 (16px), space-y-6 (24px), pb-6 (24px)
  return (
    <div className="p-4 space-y-6 pb-6 bg-[#F8FAFC]">
      {/* 1. Search Bar + Visual Scanner Trigger (h-10 = 40px, gap-2 = 8px) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'BN'
                ? 'পণ্য, ব্র্যান্ড বা লিংক খুঁজুন...'
                : 'Search global products or paste URL...'
            }
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs leading-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
          />
        </div>
        <button
          type="button"
          aria-label="Visual Search or Paste Link"
          onClick={() => navigateTo('visual_scan')}
          className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 flex items-center gap-1.5 text-xs leading-4 font-medium shrink-0 transition-colors"
        >
          <Camera className="w-4 h-4 text-[#059669]" />
          <span>{language === 'BN' ? 'স্ক্যান' : 'Scan'}</span>
        </button>
      </div>

      {/* 2. Single Focal Anchor: Editorial Cross-Border Campaign Card */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-[11px] leading-4 text-emerald-400 font-medium">
              {language === 'BN'
                ? 'কাস্টমস ডিউটি ও ভ্যাট অন্তর্ভুক্ত'
                : 'Customs Duty & 15% VAT Included'}
            </p>

            <h2 className="text-lg leading-6 font-semibold tracking-tight text-white">
              {language === 'BN'
                ? 'গ্লোবাল ফ্যাক্টরি থেকে সরাসরি আপনার দরজায়'
                : 'Direct Factory Finds, Delivered to Dhaka'}
            </h2>

            <p className="text-xs leading-4 text-slate-300">
              {language === 'BN'
                ? 'ডেলিভারির সময় কোনো অতিরিক্ত কাস্টমস চার্জ নেই।'
                : 'Compare 3 shipping routes with zero surprise fees on arrival.'}
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateTo('category_products', { categoryId: 'all' })}
                className="h-8 px-3.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs leading-4 transition-colors whitespace-nowrap"
              >
                {language === 'BN' ? 'ক্যাটালগ দেখুন' : 'Explore Catalog'}
              </button>
              <button
                type="button"
                onClick={() => navigateTo('seller_compare')}
                className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 font-medium text-xs leading-4 transition-colors whitespace-nowrap"
              >
                {language === 'BN' ? '৩ রুট তুলনা' : 'Compare Routes'}
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
              className="w-24 shrink-0 bg-white/10 border border-white/15 rounded-xl p-2 text-center cursor-pointer hover:bg-white/15 transition-colors"
            >
              <div className="w-full aspect-square rounded-lg bg-white overflow-hidden mb-1.5">
                <img
                  src={heroProduct.image}
                  alt={heroProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="block font-mono-num text-xs leading-4 font-semibold text-white">
                {formatPrice(heroProduct.totalLandedBdt)}
              </span>
              <span className="block text-[10px] leading-3 text-slate-300 mt-0.5">
                Landed
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 3. Cross-Border Intelligence Bar (Clean 3-Item Utility Strip) */}
      <section aria-label="Cross-Border Tools" className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => navigateTo('price_tracker')}
          className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-left transition-colors"
        >
          <TrendingDown className="w-4 h-4 text-[#059669] mb-1.5" />
          <span className="block text-xs leading-4 font-semibold text-slate-900">
            {language === 'BN' ? 'প্রাইস ট্র্যাকার' : 'Price History'}
          </span>
          <span className="block text-[10px] leading-3 text-slate-500 mt-0.5">
            30-day landed lows
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('seller_compare')}
          className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-left transition-colors"
        >
          <Scale className="w-4 h-4 text-[#059669] mb-1.5" />
          <span className="block text-xs leading-4 font-semibold text-slate-900">
            {language === 'BN' ? '৩ রুট তুলনা' : '3-Route Compare'}
          </span>
          <span className="block text-[10px] leading-3 text-slate-500 mt-0.5">
            CN vs. BD vs. Air
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('order_tracking', { orderId: 'DM123456' })}
          className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-left transition-colors"
        >
          <Truck className="w-4 h-4 text-[#059669] mb-1.5" />
          <span className="block text-xs leading-4 font-semibold text-slate-900">
            {language === 'BN' ? 'লাইভ ট্র্যাকিং' : 'Live Tracking'}
          </span>
          <span className="block text-[10px] leading-3 text-slate-500 mt-0.5">
            Customs & courier
          </span>
        </button>
      </section>

      {/* 4. Curated Department Navigation + Smart Filter Feed */}
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
            className="text-xs leading-4 font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <span>{language === 'BN' ? 'ক্যাটাগরি' : 'Departments'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean Department Links */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() =>
                navigateTo('category_products', { categoryId: cat.id as CategoryId })
              }
              className="h-8 px-3 rounded-lg bg-white border border-slate-200/80 hover:border-slate-300 text-xs leading-4 font-medium text-slate-700 whitespace-nowrap shrink-0 transition-colors"
            >
              {language === 'BN' ? cat.nameBn : cat.name}
            </button>
          ))}
        </div>

        {/* Segmented Filter Control Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            type="button"
            onClick={() =>
              setSmartFilters((prev) => ({
                ...prev,
                under2000Bdt: !prev.under2000Bdt,
              }))
            }
            className={`h-7 px-2.5 rounded-lg text-[11px] leading-4 font-medium whitespace-nowrap shrink-0 transition-colors ${
              smartFilters.under2000Bdt
                ? 'bg-slate-900 text-white'
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
            className={`h-7 px-2.5 rounded-lg text-[11px] leading-4 font-medium whitespace-nowrap shrink-0 transition-colors ${
              smartFilters.arrivesThisWeek
                ? 'bg-slate-900 text-white'
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
            className={`h-7 px-2.5 rounded-lg text-[11px] leading-4 font-medium whitespace-nowrap shrink-0 transition-colors ${
              smartFilters.lowestLandedCost
                ? 'bg-slate-900 text-white'
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
            className={`h-7 px-2.5 rounded-lg text-[11px] leading-4 font-medium whitespace-nowrap shrink-0 transition-colors ${
              smartFilters.verifiedOnly
                ? 'bg-slate-900 text-white'
                : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Verified only
          </button>
        </div>

        {/* 2-Column Mobile Product Grid (gap-3 = 12px) */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pt-1">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
