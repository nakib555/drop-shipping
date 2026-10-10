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

function formatCleanDeliveryWindow(raw?: string): string {
  if (!raw) return '7–12 days';
  const cleaned = raw
    .replace(/business\s+days?/gi, 'days')
    .replace(/^ships\s+in\s+/i, '')
    .replace(/^ships\s+/i, '')
    .trim();
  if (/overnight/i.test(cleaned)) return '2–4 days';
  if (/1\s*month/i.test(cleaned)) return '10–14 days';
  if (/1-2\s+business\s+days/i.test(raw) || /1-2\s+days/i.test(cleaned)) return '3–5 days';
  if (/3-5/i.test(cleaned)) return '3–5 days';
  if (/4-7/i.test(cleaned)) return '4–7 days';
  if (/1\s+week/i.test(cleaned)) return '5–7 days';
  if (/2\s+weeks/i.test(cleaned)) return '7–12 days';
  return cleaned.length > 14 ? '7–12 days' : cleaned;
}

function formatCleanRouteName(name: string): string {
  return name
    .replace(/\bDhaka Ready Hub\b/i, 'Dhaka Ready')
    .replace(/\bPriority Air Express\b/i, 'Priority Express')
    .trim();
}

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
      products.find((p) => p.id === compareProductIds[1]) ||
      products[1] ||
      products[0];

    if (!prodA || !prodB) {
      return (
        <div className="p-6 text-center text-xs text-content-secondary">
          Syncing live product specifications from API...
        </div>
      );
    }

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
        valA: formatCleanDeliveryWindow(prodA.routes[0]?.deliveryDays),
        valB: formatCleanDeliveryWindow(prodB.routes[0]?.deliveryDays),
      },
    ];

    return (
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        {/* Product Selectors */}
        <div className="grid grid-cols-2 gap-3">
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
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => addToCart(prodA.id, 1)}
            className="h-11 rounded-xl bg-white border border-app-borderStrong text-content-primary hover:bg-slate-50 text-xs leading-4 font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add {prodA.name.split(' ')[0]}</span>
          </button>
          <button
            type="button"
            onClick={() => addToCart(prodB.id, 1)}
            className="h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs leading-4 font-semibold flex items-center justify-center gap-2 transition-colors"
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
    <div className="p-4 space-y-3.5 pb-6 bg-app-bg">
      {/* Product Selector Header */}
      <div className="bg-white rounded-xl border border-app-border p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-lg object-contain bg-slate-50 p-1 border border-app-border shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-sm leading-5 font-semibold text-content-primary truncate">
              {selectedProduct.name}
            </h2>
            <p className="text-xs leading-4 text-content-secondary mt-0.5">
              Compare landed price & delivery speed
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('spec_compare')}
          className="h-8 px-3 rounded-lg bg-app-subtle border border-app-border text-xs leading-4 font-medium text-content-primary hover:bg-slate-200/70 shrink-0 transition-colors"
        >
          Compare 2 Items
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(
          [
            { id: 'all', label: 'All Routes' },
            { id: 'cheapest', label: 'Lowest Price' },
            { id: 'fastest', label: 'Fastest Delivery' },
            { id: 'rated', label: 'Top Rated' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setRouteFilter(tab.id)}
            className={`h-8 px-3 rounded-lg text-xs leading-4 font-medium whitespace-nowrap transition-colors border ${
              routeFilter === tab.id
                ? 'bg-brand-primary text-white border-brand-primary font-semibold'
                : 'bg-white text-content-secondary border-app-border hover:border-app-borderStrong'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Unified Full-Width Route Selection & Breakdown Cards (Zero duplicated small-width boxes) */}
      <div className="space-y-2.5">
        {sortedRoutes.map((rt) => {
          const isSelected = rt.id === activeRouteId;
          const cleanName = formatCleanRouteName(rt.name);
          const cleanWindow = formatCleanDeliveryWindow(rt.deliveryDays);

          return (
            <motion.div
              key={rt.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => selectRouteForProduct(selectedProduct.id, rt.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  selectRouteForProduct(selectedProduct.id, rt.id);
                }
              }}
              className={`rounded-xl p-3.5 border transition-all cursor-pointer bg-white ${
                isSelected
                  ? 'border-brand-primary bg-brand-subtle/20 ring-1 ring-brand-primary/15'
                  : 'border-app-border hover:border-app-borderStrong'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-brand-primary text-white'
                        : 'border border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs leading-4 font-semibold text-content-primary truncate">
                    {cleanName}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] leading-3.5 font-semibold uppercase tracking-wide shrink-0 ${
                      isSelected
                        ? 'bg-brand-subtle text-brand-primary'
                        : 'bg-app-subtle text-content-muted'
                    }`}
                  >
                    {rt.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] leading-4 tabular-nums shrink-0">
                  <span className="text-content-secondary font-medium">
                    {cleanWindow}
                  </span>
                  <span className="text-slate-300" aria-hidden="true">
                    ·
                  </span>
                  <span className="inline-flex items-center gap-0.5 font-semibold text-content-primary">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{rt.rating.toFixed(1)}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs leading-4 text-content-secondary bg-app-subtle border border-app-border p-2.5 rounded-lg">
                <div>
                  <span className="block text-[10px] leading-3.5 text-content-muted mb-0.5">
                    Item + Shipping
                  </span>
                  <span className="tabular-nums font-semibold text-content-primary">
                    {formatPrice(rt.basePriceBdt + rt.shippingBdt)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] leading-3.5 text-content-muted mb-0.5">
                    Duty + VAT
                  </span>
                  <span className="tabular-nums font-semibold text-content-primary">
                    {formatPrice(rt.dutyBdt + rt.vatBdt)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] leading-3.5 text-content-muted mb-0.5">
                    Landed Total
                  </span>
                  <span className="tabular-nums font-bold text-content-primary">
                    {formatPrice(rt.totalLandedBdt)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Guarantee Summary */}
      <div className="bg-white rounded-xl border border-app-border p-3.5 space-y-2">
        <h3 className="text-xs leading-4 font-semibold text-content-primary mb-1">
          Included with Every Route
        </h3>
        <div className="flex items-center gap-2 text-xs leading-4 text-content-secondary">
          <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />
          <span>All-inclusive landed price (no extra customs fee on delivery)</span>
        </div>
        <div className="flex items-center gap-2 text-xs leading-4 text-content-secondary">
          <Truck className="w-3.5 h-3.5 text-status-transit shrink-0" />
          <span>Real-time doorstep delivery tracking across Bangladesh</span>
        </div>
        <div className="flex items-center gap-2 text-xs leading-4 text-content-secondary">
          <ShieldCheck className="w-3.5 h-3.5 text-status-success shrink-0" />
          <span>Verified pre-shipment quality inspection</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigateTo('product_detail', { productId: selectedProduct.id })}
        className="w-full h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs leading-4 transition-colors"
      >
        Apply Selected Route
      </button>
    </div>
  );
};
