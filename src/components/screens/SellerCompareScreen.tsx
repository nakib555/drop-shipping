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
        label: 'Customer Rating',
        valA: `${prodA.rating.toFixed(1)} ★ (${prodA.reviewCount})`,
        valB: `${prodB.rating.toFixed(1)} ★ (${prodB.reviewCount})`,
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
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        {/* Product Selectors */}
        <div className="grid grid-cols-2 gap-4">
          {[prodA, prodB].map((prod, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-app-border p-3 flex flex-col items-center text-center"
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
                className="w-full h-8 mb-2 text-[11px] leading-4 font-medium text-content-primary bg-app-subtle border border-app-border rounded-lg px-2 focus:outline-none focus:border-app-borderStrong"
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
                className="w-20 h-20 rounded-lg object-contain bg-slate-50 p-2 border border-app-border mb-2"
              />
              <h3 className="text-xs leading-4 font-medium text-content-primary line-clamp-1">
                {prod.name}
              </h3>
              <span className="tabular-nums text-sm leading-5 font-bold text-content-primary mt-1">
                {formatPrice(prod.totalLandedBdt)}
              </span>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl border border-app-border overflow-hidden divide-y divide-app-border">
          {specRows.map((row) => (
            <div key={row.label} className="p-3 text-xs leading-4">
              <span className="block text-[11px] leading-4 font-medium text-content-muted text-center mb-1">
                {row.label}
              </span>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div
                  className={`font-medium ${
                    row.highlight
                      ? 'tabular-nums text-content-primary font-bold'
                      : 'text-content-secondary'
                  }`}
                >
                  {row.valA === 'No' ? (
                    <X className="w-4 h-4 text-promo-accent mx-auto" />
                  ) : (
                    row.valA
                  )}
                </div>
                <div
                  className={`font-medium border-l border-app-border ${
                    row.highlight
                      ? 'tabular-nums text-content-primary font-bold'
                      : 'text-content-secondary'
                  }`}
                >
                  {row.valB === 'No' ? (
                    <X className="w-4 h-4 text-promo-accent mx-auto" />
                  ) : (
                    row.valB
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add to Bag Row */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => addToCart(prodA.id, 1)}
            className="h-12 rounded-lg bg-white border border-app-borderStrong text-content-primary hover:bg-slate-50 text-xs leading-4 font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add {prodA.name.split(' ')[0]}</span>
          </button>
          <button
            type="button"
            onClick={() => addToCart(prodB.id, 1)}
            className="h-12 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs leading-4 font-semibold flex items-center justify-center gap-2 transition-colors"
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
    <div className="p-4 space-y-4 pb-6 bg-app-bg">
      {/* Product Selector Header */}
      <div className="bg-white rounded-xl border border-app-border p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-lg object-contain bg-slate-50 p-1 border border-app-border shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-sm leading-5 font-medium text-content-primary truncate">
              {selectedProduct.name}
            </h2>
            <p className="text-xs leading-4 text-content-secondary mt-1">
              Select your preferred cross-border route
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('spec_compare')}
          className="h-8 px-3 rounded-lg bg-app-subtle border border-app-border text-xs leading-4 font-medium text-content-primary hover:bg-slate-200/70 shrink-0"
        >
          Compare 2 Items
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
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
            className={`h-10 px-3 rounded-lg text-xs leading-4 font-medium whitespace-nowrap transition-colors ${
              routeFilter === tab.id
                ? 'bg-content-primary text-white'
                : 'bg-white text-content-secondary border border-app-border hover:border-app-borderStrong'
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
              className={`rounded-xl p-3 border text-center flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-app-subtle border-2 border-content-primary'
                  : 'bg-white border-app-border hover:border-app-borderStrong'
              }`}
            >
              <div>
                <span className="inline-block text-[10px] leading-4 font-semibold uppercase tracking-wide text-content-secondary mb-1">
                  {rt.badge}
                </span>
                <h3 className="text-xs leading-4 font-semibold text-content-primary">
                  {rt.name}
                </h3>
                <p className="text-[11px] leading-4 text-content-secondary mt-1 truncate">
                  {rt.originCountry}
                </p>
              </div>

              <div className="my-2 py-2 border-y border-app-border">
                <span className="block tabular-nums text-sm leading-5 font-bold text-content-primary">
                  {formatPrice(rt.totalLandedBdt)}
                </span>
                <span className="block text-[11px] leading-4 text-content-secondary mt-1">
                  {rt.deliveryDays}
                </span>
              </div>

              <div className="flex items-center justify-center gap-1 text-[11px] leading-4 tabular-nums font-medium text-content-primary">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{rt.rating.toFixed(1)}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Detailed Route Breakdown List */}
      <div className="space-y-2">
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
              className={`rounded-xl p-4 border transition-colors cursor-pointer bg-white ${
                isSelected
                  ? 'border-2 border-content-primary'
                  : 'border-app-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-content-primary text-white'
                        : 'border border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs leading-4 font-semibold text-content-primary">
                    {rt.name}
                  </span>
                  <span className="text-xs leading-4 text-content-secondary">
                    · {rt.originCountry}
                  </span>
                </div>
                <span className="tabular-nums text-xs leading-4 font-semibold text-content-primary">
                  {rt.onTimeRate} On-Time
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs leading-4 text-content-secondary bg-app-subtle border border-app-border p-3 rounded-lg">
                <div>
                  <span className="block text-[10px] leading-4 text-content-muted">Base + Ship</span>
                  <span className="tabular-nums font-semibold text-content-primary">
                    {formatPrice(rt.basePriceBdt + rt.shippingBdt)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] leading-4 text-content-muted">Duty + VAT</span>
                  <span className="tabular-nums font-semibold text-content-primary">
                    {formatPrice(rt.dutyBdt + rt.vatBdt)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] leading-4 text-content-muted">Landed Total</span>
                  <span className="tabular-nums font-bold text-content-primary">
                    {formatPrice(rt.totalLandedBdt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guarantee Summary */}
      <div className="bg-white rounded-xl border border-app-border p-4 space-y-2">
        <h3 className="text-xs leading-4 font-semibold text-content-primary mb-1">
          Included on All 3 Routes
        </h3>
        <div className="flex items-center gap-2 text-xs leading-4 text-content-secondary">
          <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
          <span>True Landed Price (Zero extra customs charge on arrival)</span>
        </div>
        <div className="flex items-center gap-2 text-xs leading-4 text-content-secondary">
          <Truck className="w-4 h-4 text-status-transit shrink-0" />
          <span>Live milestone tracking from export hub to Dhaka</span>
        </div>
        <div className="flex items-center gap-2 text-xs leading-4 text-content-secondary">
          <ShieldCheck className="w-4 h-4 text-status-success shrink-0" />
          <span>Pre-shipment physical quality inspection</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigateTo('product_detail', { productId: selectedProduct.id })}
        className="w-full h-12 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm leading-5 transition-colors"
      >
        Confirm Selected Route
      </button>
    </div>
  );
};
