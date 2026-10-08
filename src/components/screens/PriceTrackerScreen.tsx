import React, { useState } from 'react';
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
    <div className="p-4 space-y-4 pb-6">
      {/* Product Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {products.map((prod) => (
          <button
            key={prod.id}
            type="button"
            onClick={() => {
              setActivePointIndex(null);
              navigateTo('price_tracker', { productId: prod.id });
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors ${
              prod.id === selectedProduct.id
                ? 'bg-[#0B3D2E] text-white border-[#0B3D2E]'
                : 'bg-white text-[#6B7280] border-slate-200'
            }`}
          >
            {prod.name}
          </button>
        ))}
      </div>

      {/* Product Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-xl object-cover bg-[#F8FAFC] border border-slate-100 shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-[#0B3D2E] truncate">
              {selectedProduct.name}
            </h2>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-mono-num text-base font-extrabold text-[#0EA75F]">
                {formatPrice(selectedProduct.totalLandedBdt)}
              </span>
              <span className="font-mono-num text-xs text-slate-400 line-through">
                {formatPrice(selectedProduct.originalLandedBdt)}
              </span>
            </div>
            <span className="text-[11px] text-[#0EA75F] font-semibold">
              -{selectedProduct.discountPercent}% vs 90-day average
            </span>
          </div>
        </div>

        <div className="px-2.5 py-1.5 rounded-xl bg-[#ECFDF5] text-[#0EA75F] text-xs font-bold shrink-0 text-center">
          <TrendingDown className="w-4 h-4 mx-auto mb-0.5" />
          <span>Best Price</span>
        </div>
      </div>

      {/* Interactive SVG Price History Card (Matching Screen 11 in Image 4) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-[#0B3D2E]">
              Landed Price History ({range})
            </h3>
            <p className="text-[11px] text-[#6B7280]">
              Tap any data point to inspect historical landed cost
            </p>
          </div>
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl">
            {(['7D', '30D', '90D', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  setRange(tf);
                  setActivePointIndex(null);
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono-num font-bold transition-colors ${
                  range === tf
                    ? 'bg-[#0EA75F] text-white shadow-2xs'
                    : 'text-[#6B7280] hover:text-[#0B3D2E]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Point Readout */}
        {inspectedPoint && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs">
            <span className="font-semibold text-[#6B7280]">
              Date: <strong className="text-[#0B3D2E]">{inspectedPoint.dateLabel}</strong>
            </span>
            <span className="font-mono-num font-extrabold text-[#0EA75F]">
              Landed: {formatPrice(inspectedPoint.priceBdt)}
            </span>
          </div>
        )}

        {/* SVG Chart */}
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-36 overflow-visible select-none"
          >
            <defs>
              <linearGradient id="priceAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0EA75F" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#0EA75F" stopOpacity="0.0" />
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

            {/* Price Line */}
            <polyline
              fill="none"
              stroke="#0EA75F"
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
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={12}
                    fill="transparent"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 5.5 : 3.5}
                    fill={isSelected ? '#0B3D2E' : '#FFFFFF'}
                    stroke="#0EA75F"
                    strokeWidth="2.5"
                  />
                  <text
                    x={pt.x}
                    y={svgHeight - 4}
                    textAnchor="middle"
                    className="fill-[#6B7280] text-[9px] font-mono-num"
                  >
                    {pt.dateLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 30-Day Low & High Summary */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
          <div className="p-2.5 rounded-xl bg-[#F8FAFC]">
            <span className="block text-[10px] text-[#6B7280]">
              Lowest Price in 30 Days
            </span>
            <span className="font-mono-num text-sm font-extrabold text-[#0B3D2E]">
              {formatPrice(selectedProduct.lowest30dBdt)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#ECFDF5]">
            <span className="block text-[10px] text-[#0EA75F] font-semibold">
              AI Price Verdict
            </span>
            <span className="text-xs font-extrabold text-[#0B3D2E] flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA75F]" />
              Good deal now!
            </span>
          </div>
        </div>
      </div>

      {/* Price Drop Alert Toggle Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#0B3D2E]">Price Drop Alert</h3>
            <p className="text-[11px] text-[#6B7280]">
              Notify me immediately when landed cost drops further
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isAlertEnabled}
          onClick={() => togglePriceAlert(selectedProduct.id)}
          className={`w-12 h-7 rounded-full p-1 transition-colors ${
            isAlertEnabled ? 'bg-[#0EA75F]' : 'bg-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
              isAlertEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Bottom Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => navigateTo('seller_compare')}
          className="h-12 rounded-xl border border-slate-300 bg-white text-xs font-bold text-[#0B3D2E] flex items-center justify-center gap-1.5 hover:border-[#0EA75F]"
        >
          <Scale className="w-4 h-4 text-[#0EA75F]" />
          <span>Compare 3 Routes</span>
        </button>
        <button
          type="button"
          onClick={() => {
            addToCart(selectedProduct.id, 1);
            navigateTo('cart');
          }}
          className="h-12 rounded-xl bg-[#0EA75F] hover:bg-[#0B8A4D] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Buy at Best Price</span>
        </button>
      </div>
    </div>
  );
};
