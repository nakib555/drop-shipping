import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  CheckCircle2,
  Scale,
  ShoppingCart,
  TrendingDown,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';

export const PriceTrackerScreen: React.FC = () => {
  const {
    products,
    selectedProduct,
    navigateTo,
    formatPrice,
    priceAlerts,
    togglePriceAlert,
    addToCart,
  } = useDeshiMart();

  const [range, setRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const historyPoints =
    selectedProduct.priceHistory[range] || selectedProduct.priceHistory['30D'];
  const prices = historyPoints.map((p) => p.priceBdt);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceSpan = Math.max(1, maxPrice - minPrice);

  // Build SVG polyline coordinates (320 x 140 viewBox)
  const svgWidth = 320;
  const svgHeight = 140;
  const padX = 20;
  const padY = 20;

  const coords = historyPoints.map((pt, idx) => {
    const x =
      padX +
      (idx / Math.max(1, historyPoints.length - 1)) * (svgWidth - padX * 2);
    const normalizedY = (pt.priceBdt - minPrice) / priceSpan;
    const y = svgHeight - padY - normalizedY * (svgHeight - padY * 2);
    return { x, y, ...pt };
  });

  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const areaPoints = `${coords[0]?.x || 0},${svgHeight - padY} ${polylinePoints} ${
    coords[coords.length - 1]?.x || svgWidth
  },${svgHeight - padY}`;

  const isAlertEnabled = Boolean(priceAlerts[selectedProduct.id]);
  const inspectedPoint =
    activePointIndex !== null ? coords[activePointIndex] : coords[coords.length - 1];

  return (
    <div className="p-4 space-y-4 pb-6 bg-app-bg">
      {/* Product Switcher Bar (8pt grid h-10 = 40px, gap-2 = 8px) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {products.slice(0, 16).map((prod) => (
          <button
            key={prod.id}
            type="button"
            onClick={() => {
              setActivePointIndex(null);
              navigateTo('price_tracker', { productId: prod.id });
            }}
            className={`h-9 px-3 rounded-lg text-xs leading-4 font-medium whitespace-nowrap border transition-colors ${
              prod.id === selectedProduct.id
                ? 'bg-brand-primary text-white border-brand-primary font-semibold'
                : 'bg-white text-content-secondary border-app-border hover:border-app-borderStrong'
            }`}
          >
            {prod.name}
          </button>
        ))}
      </div>

      {/* Product Summary Card */}
      <div className="bg-white rounded-xl border border-app-border p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-lg object-contain bg-slate-50 p-1 border border-app-border shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-sm leading-5 font-medium text-content-primary truncate">
              {selectedProduct.name}
            </h2>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="tabular-nums text-lg leading-6 font-bold text-content-primary">
                {formatPrice(selectedProduct.totalLandedBdt)}
              </span>
              <span className="tabular-nums text-xs leading-4 text-content-muted line-through">
                {formatPrice(selectedProduct.originalLandedBdt)}
              </span>
            </div>
            <span className="text-[11px] leading-4 text-brand-primary font-medium">
              {selectedProduct.discountPercent}% below 90-day average
            </span>
          </div>
        </div>

        <div className="px-3 py-2 rounded-xl bg-brand-subtle border border-brand-border text-brand-primary text-[11px] leading-4 font-semibold shrink-0 text-center">
          <TrendingDown className="w-4 h-4 mx-auto mb-0.5" />
          <span>Low Price</span>
        </div>
      </div>

      {/* Interactive SVG Price History Card */}
      <div className="bg-white rounded-xl border border-app-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm leading-5 font-semibold text-content-primary">
              Landed Price History ({range})
            </h3>
            <p className="text-xs leading-4 text-content-secondary mt-1">
              Tap any data point to inspect historical landed cost
            </p>
          </div>
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-app-subtle border border-app-border p-1 rounded-lg">
            {(['7D', '30D', '90D', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  setRange(tf);
                  setActivePointIndex(null);
                }}
                className={`px-2 py-1 rounded-md text-[11px] leading-4 tabular-nums font-semibold transition-colors ${
                  range === tf
                    ? 'bg-white text-content-primary shadow-2xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Point Readout */}
        {inspectedPoint && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-app-subtle border border-app-border text-xs leading-4">
            <span className="text-content-secondary">
              Date: <strong className="text-content-primary font-semibold">{inspectedPoint.dateLabel}</strong>
            </span>
            <span className="tabular-nums font-bold text-content-primary">
              Landed: {formatPrice(inspectedPoint.priceBdt)}
            </span>
          </div>
        )}

        {/* Animated SVG Chart */}
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-36 overflow-visible select-none"
          >
            <defs>
              <linearGradient id="priceAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#065F46" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#065F46" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Reference Grid Lines */}
            {[0.2, 0.5, 0.8].map((ratio, idx) => (
              <line
                key={idx}
                x1={padX}
                x2={svgWidth - padX}
                y1={svgHeight * ratio}
                y2={svgHeight * ratio}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
            ))}

            {/* Shaded Area */}
            <polygon points={areaPoints} fill="url(#priceAreaGrad)" />

            {/* Animated Price Line */}
            <motion.polyline
              key={`${selectedProduct.id}-${range}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              fill="none"
              stroke="#065F46"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />

            {/* Interactive Data Nodes */}
            {coords.map((pt, index) => {
              const isSelected =
                activePointIndex === index ||
                (activePointIndex === null && index === coords.length - 1);
              return (
                <g
                  key={pt.dateLabel}
                  onClick={() => setActivePointIndex(index)}
                  className="cursor-pointer"
                >
                  <circle cx={pt.x} cy={pt.y} r={12} fill="transparent" />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 5 : 3.5}
                    fill={isSelected ? '#065F46' : '#FFFFFF'}
                    stroke="#065F46"
                    strokeWidth="2.5"
                  />
                  <text
                    x={pt.x}
                    y={svgHeight - 4}
                    textAnchor="middle"
                    className="fill-slate-400 text-[9px] tabular-nums"
                  >
                    {pt.dateLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 30-Day Low & Verdict Summary */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-app-border">
          <div className="p-3 rounded-lg bg-app-subtle border border-app-border">
            <span className="block text-[11px] leading-4 text-content-secondary">
              Lowest Price in 30 Days
            </span>
            <span className="tabular-nums text-sm leading-5 font-bold text-content-primary mt-1 block">
              {formatPrice(selectedProduct.lowest30dBdt)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-app-subtle border border-app-border">
            <span className="block text-[11px] leading-4 text-content-secondary">
              Price Assessment
            </span>
            <span className="text-xs leading-4 font-semibold text-status-success flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4 text-status-success" />
              Good time to buy
            </span>
          </div>
        </div>
      </div>

      {/* Price Drop Alert Toggle Card */}
      <div className="bg-white rounded-xl border border-app-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-app-subtle text-content-primary flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm leading-5 font-medium text-content-primary">Price Drop Alert</h3>
            <p className="text-xs leading-4 text-content-secondary mt-1">
              Notify me when landed cost drops further
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isAlertEnabled}
          aria-label="Toggle Price Drop Alert"
          onClick={() => togglePriceAlert(selectedProduct.id)}
          className={`w-11 h-6 rounded-full p-1 transition-colors ${
            isAlertEnabled ? 'bg-brand-primary' : 'bg-slate-300'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
              isAlertEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Bottom Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => navigateTo('seller_compare')}
          className="h-12 rounded-lg border border-app-border bg-white text-xs leading-4 font-semibold text-content-primary flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <Scale className="w-4 h-4 text-content-secondary" />
          <span>Compare Routes</span>
        </button>
        <button
          type="button"
          onClick={() => {
            addToCart(selectedProduct.id, 1);
            navigateTo('cart');
          }}
          className="h-12 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs leading-4 font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
};
