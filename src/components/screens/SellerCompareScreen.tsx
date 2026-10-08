import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';

export const SellerCompareScreen: React.FC = () => {
  const {
    currentScreen,
    products,
    selectedProduct,
    selectedRouteByProduct,
    selectRouteForProduct,
    compareProductIds,
    setCompareProductIds,
    addToCart,
    navigateTo,
    formatPrice,
  } = useDeshiMart();

  const [routeFilter, setRouteFilter] = useState<'all' | 'cheapest' | 'fastest' | 'rated'>(
    'all'
  );

  // Screen Mode A: Compare 2 Products Side-by-Side (Screen 25 in UI Kit 2)
  if (currentScreen === 'spec_compare') {
    const prodA =
      products.find((p) => p.id === compareProductIds[0]) || products[0];
    const prodB =
      products.find((p) => p.id === compareProductIds[1]) || products[1];

    const specRows = [
      {
        label: 'Landed Price',
        valA: formatPrice(prodA.totalLandedBdt),
        valB: formatPrice(prodB.totalLandedBdt),
        highlight: true,
      },
      {
        label: 'DropScore™',
        valA: `${prodA.dropScore.toFixed(1)} / 10`,
        valB: `${prodB.dropScore.toFixed(1)} / 10`,
      },
      {
        label: 'Display / Build',
        valA: prodA.specs.display || 'Standard',
        valB: prodB.specs.display || 'Standard',
      },
      {
        label: 'Battery Life',
        valA: prodA.specs.battery || 'N/A',
        valB: prodB.specs.battery || 'N/A',
      },
      {
        label: 'Waterproof',
        valA: prodA.specs.waterproof || 'No',
        valB: prodB.specs.waterproof || 'No',
      },
      {
        label: 'Heart Rate',
        valA: prodA.specs.heartRate || 'No',
        valB: prodB.specs.heartRate || 'No',
      },
      {
        label: 'GPS / Connectivity',
        valA: prodA.specs.gps || 'Standard',
        valB: prodB.specs.gps || 'Standard',
      },
      {
        label: 'Delivery Estimate',
        valA: prodA.routes[0]?.deliveryDays || '7–12 days',
        valB: prodB.routes[0]?.deliveryDays || '7–12 days',
      },
    ];

    return (
      <div className="p-4 space-y-4 pb-6">
        {/* Product Selectors */}
        <div className="grid grid-cols-2 gap-2">
          {[prodA, prodB].map((prod, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col items-center text-center"
            >
              <select
                aria-label={`Select Product ${idx + 1}`}
                value={prod.id}
                onChange={(e) => {
                  const newId = e.target.value;
                  setCompareProductIds((prev) =>
                    idx === 0 ? [newId, prev[1]] : [prev[0], newId]
                  );
                }}
                className="w-full mb-2 text-[11px] font-bold text-[#0B3D2E] bg-[#F8FAFC] border border-slate-200 rounded-lg px-2 py-1.5"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <img
                src={prod.image}
                alt={prod.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-xl object-cover bg-[#F8FAFC] mb-2"
              />
              <h3 className="text-xs font-extrabold text-[#0B3D2E] line-clamp-1">
                {prod.name}
              </h3>
              <span className="font-mono-num text-sm font-extrabold text-[#0EA75F] mt-0.5">
                {formatPrice(prod.totalLandedBdt)}
              </span>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
          {specRows.map((row) => (
            <div key={row.label} className="p-3 text-xs">
              <span className="block text-[10px] font-bold text-[#6B7280] text-center mb-1">
                {row.label}
              </span>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div
                  className={`font-semibold ${
                    row.highlight
                      ? 'font-mono-num text-[#0EA75F] font-extrabold'
                      : 'text-[#0B3D2E]'
                  }`}
                >
                  {row.valA === 'No' ? (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  ) : (
                    row.valA
                  )}
                </div>
                <div
                  className={`font-semibold border-l border-slate-100 ${
                    row.highlight
                      ? 'font-mono-num text-[#0EA75F] font-extrabold'
                      : 'text-[#0B3D2E]'
                  }`}
                >
                  {row.valB === 'No' ? (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  ) : (
                    row.valB
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add to Cart Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => addToCart(prodA.id, 1)}
            className="h-11 rounded-xl bg-[#0EA75F] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add {prodA.name.split(' ')[0]}</span>
          </button>
          <button
            type="button"
            onClick={() => addToCart(prodB.id, 1)}
            className="h-11 rounded-xl bg-[#0B3D2E] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add {prodB.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    );
  }

  // Screen Mode B: Compare 3 Sellers / Routes (Screen 11 in Image 3 & Screen 12 in Image 4)
  const activeRouteId =
    selectedRouteByProduct[selectedProduct.id] || selectedProduct.routes[0]?.id;

  const sortedRoutes = [...selectedProduct.routes].sort((a, b) => {
    if (routeFilter === 'cheapest') return a.totalLandedBdt - b.totalLandedBdt;
    if (routeFilter === 'rated') return b.reliabilityScore - a.reliabilityScore;
    if (routeFilter === 'fastest') return a.deliveryDays.localeCompare(b.deliveryDays);
    return 0;
  });

  return (
    <div className="p-3.5 space-y-4 pb-6">
      {/* Product Selector Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-xl object-cover bg-[#F8FAFC] shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-xs font-extrabold text-[#0B3D2E] truncate">
              {selectedProduct.name}
            </h2>
            <p className="text-[11px] text-[#6B7280]">
              Select your preferred cross-border route
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('spec_compare')}
          className="px-2.5 py-1.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[11px] font-bold text-[#0EA75F] shrink-0"
        >
          Compare 2 Items
        </button>
      </div>

      {/* Filter Tabs (All / Cheapest / Fastest / Best Rated) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {(
          [
            { id: 'all', label: 'All Routes' },
            { id: 'cheapest', label: 'Cheapest Landed' },
            { id: 'fastest', label: 'Fastest Air' },
            { id: 'rated', label: 'Best Rated' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setRouteFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              routeFilter === tab.id
                ? 'bg-[#0EA75F] text-white'
                : 'bg-white text-[#6B7280] border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3-Column Visual Route Cards (Matching Image 4 Screen 12) */}
      <div className="grid grid-cols-3 gap-2">
        {sortedRoutes.map((rt) => {
          const isSelected = rt.id === activeRouteId;
          return (
            <button
              key={rt.id}
              type="button"
              onClick={() => selectRouteForProduct(selectedProduct.id, rt.id)}
              className={`rounded-2xl p-2.5 border text-center flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-[#ECFDF5] border-2 border-[#0EA75F] shadow-sm'
                  : 'bg-white border-slate-200 hover:border-[#0EA75F]/50'
              }`}
            >
              <div>
                <span className="inline-block text-[10px] font-bold text-[#0EA75F] mb-1">
                  {rt.badge}
                </span>
                <h3 className="text-xs font-extrabold text-[#0B3D2E] leading-tight">
                  {rt.name}
                </h3>
                <p className="text-[10px] text-[#6B7280] mt-0.5 truncate">
                  {rt.originCountry}
                </p>
              </div>

              <div className="my-3 py-2 border-y border-slate-200/70">
                <span className="block font-mono-num text-sm font-extrabold text-[#0EA75F]">
                  {formatPrice(rt.totalLandedBdt)}
                </span>
                <span className="block text-[10px] text-[#0B3D2E] font-medium mt-1">
                  {rt.deliveryDays}
                </span>
              </div>

              <div className="flex items-center justify-center gap-1 text-[11px] font-mono-num font-bold text-[#0B3D2E]">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{rt.rating.toFixed(1)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Route Breakdown List */}
      <div className="space-y-2.5">
        {sortedRoutes.map((rt) => {
          const isSelected = rt.id === activeRouteId;
          return (
            <div
              key={rt.id}
              onClick={() => selectRouteForProduct(selectedProduct.id, rt.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  selectRouteForProduct(selectedProduct.id, rt.id);
                }
              }}
              className={`rounded-2xl p-3.5 border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-white border-2 border-[#0EA75F]'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#0EA75F] text-white'
                        : 'border border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-extrabold text-[#0B3D2E]">
                    {rt.name}
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    · {rt.originCountry}
                  </span>
                </div>
                <span className="font-mono-num text-xs font-bold text-[#0EA75F]">
                  Score {rt.reliabilityScore.toFixed(1)}/10
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] text-[#6B7280] bg-[#F8FAFC] p-2.5 rounded-xl">
                <div>
                  <span className="block text-[10px]">Base + Ship</span>
                  <span className="font-mono-num font-bold text-[#0B3D2E]">
                    {formatPrice(rt.basePriceBdt + rt.shippingBdt)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px]">Duty + VAT</span>
                  <span className="font-mono-num font-bold text-[#0B3D2E]">
                    {formatPrice(rt.dutyBdt + rt.vatBdt)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px]">On-Time Rate</span>
                  <span className="font-mono-num font-bold text-[#0EA75F]">
                    {rt.onTimeRate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compare By Checklist Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2">
        <h3 className="text-xs font-extrabold text-[#0B3D2E] mb-1">
          Guaranteed on All 3 Routes
        </h3>
        <div className="flex items-center gap-2 text-xs text-[#0B3D2E]">
          <CheckCircle2 className="w-4 h-4 text-[#0EA75F]" />
          <span>Total Landed Cost (Zero extra customs charge on arrival)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#0B3D2E]">
          <Truck className="w-4 h-4 text-[#0EA75F]" />
          <span>Guaranteed Delivery Window with live milestone tracking</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#0B3D2E]">
          <ShieldCheck className="w-4 h-4 text-[#0EA75F]" />
          <span>Verified Supplier Quality Inspection before dispatch</span>
        </div>
      </div>

      {/* Confirm Best Option CTA */}
      <button
        type="button"
        onClick={() => navigateTo('product_detail', { productId: selectedProduct.id })}
        className="w-full h-12 rounded-xl bg-[#0EA75F] hover:bg-[#0B8A4D] text-white font-bold text-xs shadow-md transition-colors"
      >
        Choose Selected Route & Continue
      </button>
    </div>
  );
};
