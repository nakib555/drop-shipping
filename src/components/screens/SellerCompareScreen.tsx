import React, { useState } from 'react';
import { motion } from 'motion/react';
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

  // Screen Mode A: Compare 2 Products Side-by-Side
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
        label: 'DropScore',
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
        label: 'Durability',
        valA: prodA.specs.waterproof || 'Standard',
        valB: prodB.specs.waterproof || 'Standard',
      },
      {
        label: 'Connectivity',
        valA: prodA.specs.gps || 'Standard',
        valB: prodB.specs.gps || 'Standard',
      },
      {
        label: 'Delivery Window',
        valA: prodA.routes[0]?.deliveryDays || '7–12 days',
        valB: prodB.routes[0]?.deliveryDays || '7–12 days',
      },
    ];

    return (
      <div className="p-4 space-y-4 pb-6 bg-[#F8FAFC]">
        {/* Product Selectors */}
        <div className="grid grid-cols-2 gap-3">
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
                className="w-full mb-2 text-[11px] font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5"
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
                className="w-20 h-20 rounded-xl object-contain bg-white p-1.5 border border-slate-100 mb-2"
              />
              <h3 className="text-xs font-semibold text-slate-900 line-clamp-1">
                {prod.name}
              </h3>
              <span className="font-mono-num text-sm font-semibold text-[#059669] mt-0.5">
                {formatPrice(prod.totalLandedBdt)}
              </span>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
          {specRows.map((row) => (
            <div key={row.label} className="p-3 text-xs">
              <span className="block text-[10px] font-medium text-slate-400 text-center mb-1">
                {row.label}
              </span>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div
                  className={`font-medium ${
                    row.highlight
                      ? 'font-mono-num text-slate-900 font-semibold'
                      : 'text-slate-700'
                  }`}
                >
                  {row.valA === 'No' ? (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  ) : (
                    row.valA
                  )}
                </div>
                <div
                  className={`font-medium border-l border-slate-100 ${
                    row.highlight
                      ? 'font-mono-num text-slate-900 font-semibold'
                      : 'text-slate-700'
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

        {/* Add to Bag Row */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => addToCart(prodA.id, 1)}
            className="h-11 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add {prodA.name.split(' ')[0]}</span>
          </button>
          <button
            type="button"
            onClick={() => addToCart(prodB.id, 1)}
            className="h-11 rounded-xl bg-[#059669] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add {prodB.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    );
  }

  // Screen Mode B: Compare 3 Sellers / Routes
  const activeRouteId =
    selectedRouteByProduct[selectedProduct.id] || selectedProduct.routes[0]?.id;

  const sortedRoutes = [...selectedProduct.routes].sort((a, b) => {
    if (routeFilter === 'cheapest') return a.totalLandedBdt - b.totalLandedBdt;
    if (routeFilter === 'rated') return b.reliabilityScore - a.reliabilityScore;
    if (routeFilter === 'fastest') return a.deliveryDays.localeCompare(b.deliveryDays);
    return 0;
  });

  return (
    <div className="p-4 space-y-4 pb-6 bg-[#F8FAFC]">
      {/* Product Selector Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-100 shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-xs font-semibold text-slate-900 truncate">
              {selectedProduct.name}
            </h2>
            <p className="text-[11px] text-slate-500">
              Select your preferred cross-border route
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('spec_compare')}
          className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-700 hover:text-slate-900 shrink-0"
        >
          Compare 2 Items
        </button>
      </div>

      {/* Filter Tabs */}
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
            className={`h-8 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              routeFilter === tab.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3-Column Route Comparison Cards */}
      <div className="grid grid-cols-3 gap-2">
        {sortedRoutes.map((rt) => {
          const isSelected = rt.id === activeRouteId;
          return (
            <motion.button
              key={rt.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => selectRouteForProduct(selectedProduct.id, rt.id)}
              className={`rounded-2xl p-2.5 border text-center flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-white border-2 border-[#059669]'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                <span className="inline-block text-[10px] font-medium text-[#059669] mb-1">
                  {rt.badge}
                </span>
                <h3 className="text-xs font-semibold text-slate-900 leading-tight">
                  {rt.name}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                  {rt.originCountry}
                </p>
              </div>

              <div className="my-3 py-2 border-y border-slate-100">
                <span className="block font-mono-num text-sm font-semibold text-slate-900">
                  {formatPrice(rt.totalLandedBdt)}
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">
                  {rt.deliveryDays}
                </span>
              </div>

              <div className="flex items-center justify-center gap-1 text-[11px] font-mono-num font-medium text-slate-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{rt.rating.toFixed(1)}</span>
              </div>
            </motion.button>
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
              className={`rounded-2xl p-3.5 border transition-colors cursor-pointer bg-white ${
                isSelected
                  ? 'border-2 border-[#059669]'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#059669] text-white'
                        : 'border border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-semibold text-slate-900">
                    {rt.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    · {rt.originCountry}
                  </span>
                </div>
                <span className="font-mono-num text-xs font-medium text-[#059669]">
                  {rt.reliabilityScore.toFixed(1)}/10
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                <div>
                  <span className="block text-[10px]">Base + Ship</span>
                  <span className="font-mono-num font-semibold text-slate-900">
                    {formatPrice(rt.basePriceBdt + rt.shippingBdt)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px]">Duty + VAT</span>
                  <span className="font-mono-num font-semibold text-slate-900">
                    {formatPrice(rt.dutyBdt + rt.vatBdt)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px]">On-Time Rate</span>
                  <span className="font-mono-num font-semibold text-[#059669]">
                    {rt.onTimeRate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guarantee Summary */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2">
        <h3 className="text-xs font-semibold text-slate-900 mb-1">
          Included on All 3 Routes
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
          <span>True Landed Price (Zero extra customs charge on arrival)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Truck className="w-4 h-4 text-[#059669] shrink-0" />
          <span>Live milestone tracking from export hub to Dhaka</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
          <span>Pre-shipment physical quality inspection</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigateTo('product_detail', { productId: selectedProduct.id })}
        className="w-full h-11 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs transition-colors"
      >
        Confirm Selected Route
      </button>
    </div>
  );
};
