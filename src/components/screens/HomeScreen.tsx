import React from 'react';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Cpu,
  Flame,
  HeartHandshake,
  Home as HomeIcon,
  Scale,
  Search,
  ShieldCheck,
  Shirt,
  Sparkles,
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

  const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
    electronics: Cpu,
    fashion: Shirt,
    home_living: HomeIcon,
    beauty_health: HeartHandshake,
  };

  const heroProduct = products[0];
  const trendingProducts = products.slice(0, 4);

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

  // 8pt Grid: p-4 (16px), space-y-4 (16px), pb-6 (24px)
  return (
    <div className="p-4 space-y-4 pb-6">
      {/* Search Bar + Integrated Scan Trigger (h-10 = 40px = 5*8, gap-2 = 8px = 1*8) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#0EA75F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'BN'
                ? 'পণ্য, ব্র্যান্ড বা ক্যাটাগরি খুঁজুন...'
                : 'Search products, brands, or paste link...'
            }
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200/90 text-xs leading-4 text-[#0B3D2E] placeholder:text-[#6B7280] focus:outline-none focus:border-[#0EA75F] shadow-[0_2px_8px_-3px_rgba(11,61,46,0.06)]"
          />
        </div>
        <button
          type="button"
          aria-label="Visual Search or Upload Photo"
          onClick={() => navigateTo('visual_scan')}
          className="h-10 px-3 rounded-xl bg-[#0B3D2E] text-white flex items-center gap-2 text-xs leading-4 font-bold shrink-0 hover:bg-[#0EA75F] transition-colors shadow-xs"
        >
          <Camera className="w-4 h-4 text-[#00C853]" />
          <span>{language === 'BN' ? 'স্ক্যান' : 'Scan'}</span>
        </button>
      </div>

      {/* Hero Campaign Banner (p-4 = 16px, rounded-2xl = 16px, gap-3 = 12px) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0EA75F] via-[#0B7A47] to-[#0B3D2E] text-white p-4 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="inline-flex items-center gap-1 text-[10px] leading-4 font-bold text-emerald-200 bg-black/20 px-2 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C853]" />
              <span>
                {language === 'BN'
                  ? 'কাস্টমস ডিউটি ও ভ্যাট অন্তর্ভুক্ত'
                  : 'Best Prices · Landed Cost Included'}
              </span>
            </div>

            <h2 className="text-lg leading-6 font-extrabold tracking-tight">
              {language === 'BN'
                ? 'গ্লোবাল পণ্য আপনার দরজায়'
                : 'Global Products To Your Door'}
            </h2>

            <p className="text-[11px] leading-4 text-emerald-100/95">
              {language === 'BN'
                ? 'ভেরিফাইড ফ্যাক্টরি থেকে সরাসরি বাংলাদেশে ডেলিভারি।'
                : 'Trusted global suppliers · Zero surprise tax at delivery.'}
            </p>

            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateTo('category_products', { categoryId: 'all' })}
                className="h-8 px-3 rounded-xl bg-white text-[#0B3D2E] font-extrabold text-xs leading-4 shadow-sm hover:bg-emerald-50 transition-colors whitespace-nowrap"
              >
                {language === 'BN' ? 'শপ নাউ' : 'Shop Now'}
              </button>
              <button
                type="button"
                onClick={() => navigateTo('seller_compare')}
                className="h-8 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs leading-4 transition-colors whitespace-nowrap"
              >
                {language === 'BN' ? '৩ রুট তুলনা' : '3 Routes'}
              </button>
            </div>
          </div>

          {/* Right Product Image Showcase Card (w-28 = 112px = 14*8, p-2 = 8px) */}
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
              className="w-28 shrink-0 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-2 text-center cursor-pointer hover:bg-white/20 transition-all shadow-lg"
            >
              <div className="w-full aspect-square rounded-xl bg-white overflow-hidden mb-1">
                <img
                  src={heroProduct.image}
                  alt={heroProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="block text-[10px] leading-3 text-emerald-200 font-bold">
                DropScore {heroProduct.dropScore.toFixed(1)}
              </span>
              <span className="block font-mono-num text-xs leading-4 font-extrabold text-white mt-0.5">
                {formatPrice(heroProduct.totalLandedBdt)}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 4 Signature Intelligence Quick Tools (p-3 = 12px, gap-2 = 8px, w-10 h-10 = 40px) */}
      <section
        aria-label="Smart Shopping Tools"
        className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-[0_2px_8px_-4px_rgba(11,61,46,0.05)]"
      >
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => navigateTo('order_tracking', { orderId: 'DM123456' })}
            className="flex flex-col items-center justify-center text-center gap-1 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] group-hover:bg-[#0EA75F] text-[#0EA75F] group-hover:text-white flex items-center justify-center transition-colors border border-[#0EA75F]/15">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-4 font-bold text-[#0B3D2E] whitespace-nowrap">
              {language === 'BN' ? 'ট্র্যাক অর্ডার' : 'Track Order'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('price_tracker')}
            className="flex flex-col items-center justify-center text-center gap-1 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] group-hover:bg-[#0EA75F] text-[#0EA75F] group-hover:text-white flex items-center justify-center transition-colors border border-[#0EA75F]/15">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-4 font-bold text-[#0B3D2E] whitespace-nowrap">
              {language === 'BN' ? 'প্রাইস ট্র্যাকার' : 'Price Tracker'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('seller_compare')}
            className="flex flex-col items-center justify-center text-center gap-1 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] group-hover:bg-[#0EA75F] text-[#0EA75F] group-hover:text-white flex items-center justify-center transition-colors border border-[#0EA75F]/15">
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-4 font-bold text-[#0B3D2E] whitespace-nowrap">
              {language === 'BN' ? 'রুট তুলনা' : 'Compare'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('visual_scan')}
            className="flex flex-col items-center justify-center text-center gap-1 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] group-hover:bg-[#0EA75F] text-[#0EA75F] group-hover:text-white flex items-center justify-center transition-colors border border-[#0EA75F]/15">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-4 font-bold text-[#0B3D2E] whitespace-nowrap">
              {language === 'BN' ? 'ছবি স্ক্যান' : 'Scan'}
            </span>
          </button>
        </div>
      </section>

      {/* Top Categories Section (mb-2 = 8px, gap-2 = 8px, p-2 = 8px, w-10 h-10 = 40px) */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm leading-5 font-extrabold text-[#0B3D2E]">
            {language === 'BN' ? 'শীর্ষ ক্যাটাগরি' : 'Top Categories'}
          </h2>
          <button
            type="button"
            onClick={() => navigateTo('categories')}
            className="text-xs leading-4 font-bold text-[#0EA75F] flex items-center gap-1 hover:underline"
          >
            <span>{language === 'BN' ? 'সব দেখুন' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.slice(0, 4).map((cat) => {
            const Icon = categoryIcons[cat.id] || Sparkles;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  navigateTo('category_products', { categoryId: cat.id as CategoryId })
                }
                className="bg-white rounded-2xl p-2 border border-slate-200/80 flex flex-col items-center text-center gap-1 hover:border-[#0EA75F] transition-colors shadow-[0_2px_8px_-4px_rgba(11,61,46,0.05)]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] leading-4 font-bold text-[#0B3D2E] truncate w-full">
                  {language === 'BN' ? cat.nameBn : cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Trending For You Horizontal Strip (gap-2 = 8px, w-36 = 144px = 18*8, p-3 = 12px) */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-[#0EA75F]" />
            <h2 className="text-sm leading-5 font-extrabold text-[#0B3D2E]">
              {language === 'BN' ? 'আপনার জন্য ট্রেন্ডিং' : 'Trending For You'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('price_tracker')}
            className="text-xs leading-4 font-bold text-[#0EA75F] hover:underline"
          >
            {language === 'BN' ? 'প্রাইস ড্রপস →' : '30-Day Drops →'}
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {trendingProducts.map((tp) => (
            <div
              key={tp.id}
              onClick={() => navigateTo('product_detail', { productId: tp.id })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigateTo('product_detail', { productId: tp.id });
                }
              }}
              className="w-36 shrink-0 bg-white rounded-2xl border border-slate-200/80 p-3 cursor-pointer hover:border-[#0EA75F] transition-colors"
            >
              <div className="w-full h-24 rounded-xl bg-[#F8FAFC] overflow-hidden mb-2">
                <img
                  src={tp.image}
                  alt={tp.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs leading-4 font-extrabold text-[#0B3D2E] truncate">
                {language === 'BN' ? tp.nameBn : tp.name}
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-mono-num text-xs leading-4 font-extrabold text-[#0EA75F]">
                  {formatPrice(tp.totalLandedBdt)}
                </span>
                <span className="font-mono-num text-[10px] leading-4 font-bold text-rose-500">
                  -{tp.discountPercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Discovery Interactive Filter Controls + 2-Column Product Feed (gap-2 = 8px) */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm leading-5 font-extrabold text-[#0B3D2E]">
            {language === 'BN' ? 'জনপ্রিয় গ্লোবাল পণ্য' : 'Popular Global Products'}
          </h2>
          <span className="text-[11px] leading-4 text-[#6B7280] font-mono-num">
            {displayedProducts.length} items
          </span>
        </div>

        {/* Interactive Filter Buttons (h-8 = 32px = 4*8, gap-2 = 8px) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            type="button"
            onClick={() =>
              setSmartFilters((prev) => ({
                ...prev,
                under2000Bdt: !prev.under2000Bdt,
              }))
            }
            className={`h-8 px-3 rounded-xl text-xs leading-4 font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors border ${
              smartFilters.under2000Bdt
                ? 'bg-[#0EA75F] text-white border-[#0EA75F]'
                : 'bg-white text-[#0B3D2E] border-slate-200 hover:border-[#0EA75F]'
            }`}
          >
            <span>Under {formatPrice(2000)}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setSmartFilters((prev) => ({
                ...prev,
                arrivesThisWeek: !prev.arrivesThisWeek,
              }))
            }
            className={`h-8 px-3 rounded-xl text-xs leading-4 font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors border ${
              smartFilters.arrivesThisWeek
                ? 'bg-[#0EA75F] text-white border-[#0EA75F]'
                : 'bg-white text-[#0B3D2E] border-slate-200 hover:border-[#0EA75F]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Arrives this week</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setSmartFilters((prev) => ({
                ...prev,
                lowestLandedCost: !prev.lowestLandedCost,
              }))
            }
            className={`h-8 px-3 rounded-xl text-xs leading-4 font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors border ${
              smartFilters.lowestLandedCost
                ? 'bg-[#0EA75F] text-white border-[#0EA75F]'
                : 'bg-white text-[#0B3D2E] border-slate-200 hover:border-[#0EA75F]'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Lowest landed cost</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setSmartFilters((prev) => ({
                ...prev,
                verifiedOnly: !prev.verifiedOnly,
              }))
            }
            className={`h-8 px-3 rounded-xl text-xs leading-4 font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors border ${
              smartFilters.verifiedOnly
                ? 'bg-[#0EA75F] text-white border-[#0EA75F]'
                : 'bg-white text-[#0B3D2E] border-slate-200 hover:border-[#0EA75F]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified</span>
          </button>
        </div>

        {/* 2-Column Mobile Product Grid (gap-2 = 8px) */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/80 mt-2">
            <p className="text-xs leading-4 font-bold text-[#0B3D2E]">
              No matching global products found
            </p>
            <p className="text-[11px] leading-4 text-[#6B7280] mt-1">
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
              className="mt-3 h-10 px-4 rounded-xl bg-[#0EA75F] text-white text-xs leading-4 font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
