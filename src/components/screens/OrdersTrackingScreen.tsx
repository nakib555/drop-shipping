import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  FileText,
  MapPin,
  Package,
  RefreshCcw,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';

export const OrdersTrackingScreen: React.FC = () => {
  const {
    currentScreen,
    orders,
    selectedOrder,
    navigateTo,
    formatPrice,
    addToCart,
    showToast,
  } = useDeshiMart();

  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Processing' | 'Shipped' | 'Delivered'
  >('All');
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  // Screen Mode 1: My Orders List (Screen 16 in UI Kits 1 & 2)
  if (currentScreen === 'orders') {
    const visibleOrders = orders.filter((o) =>
      statusFilter === 'All' ? true : o.status === statusFilter
    );

    return (
      <div className="p-4 space-y-4 pb-6">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(['All', 'Processing', 'Shipped', 'Delivered'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-[#0EA75F] text-white'
                  : 'bg-white text-[#6B7280] border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {visibleOrders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => navigateTo('order_tracking', { orderId: ord.id })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigateTo('order_tracking', { orderId: ord.id });
                }
              }}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 hover:border-[#0EA75F] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono-num text-xs font-extrabold text-[#0B3D2E]">
                    #{ord.id}
                  </span>
                  <p className="text-[11px] text-[#6B7280]">
                    Placed on {ord.placedDate}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold ${
                    ord.status === 'Delivered'
                      ? 'text-[#0EA75F]'
                      : ord.status === 'Shipped'
                      ? 'text-blue-600'
                      : 'text-amber-600'
                  }`}
                >
                  {ord.status}
                </span>
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-2 overflow-x-auto">
                {ord.items.map((item, idx) => (
                  <img
                    key={idx}
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover bg-[#F8FAFC] border border-slate-100 shrink-0"
                  />
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">
                  {ord.items.reduce((s, i) => s + i.quantity, 0)} items ·{' '}
                  {ord.courierName}
                </span>
                <span className="font-mono-num font-extrabold text-[#0B3D2E]">
                  {formatPrice(ord.totalBdt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Screen Mode 2: Live Cross-Border Order Tracking (Screen 15/17/21 in UI Kits)
  const steps = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const activeStepIdx =
    selectedOrder.status === 'Delivered'
      ? 3
      : selectedOrder.status === 'Shipped'
      ? 2
      : 1;

  return (
    <div className="p-4 space-y-4 pb-6">
      {/* Order Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono-num text-sm font-extrabold text-[#0B3D2E]">
              #{selectedOrder.id}
            </span>
            <p className="text-xs font-bold text-[#0EA75F] mt-0.5">
              {selectedOrder.status === 'Delivered'
                ? 'Delivered to Doorstep'
                : 'Out for delivery'}
            </p>
            <p className="text-[11px] text-[#6B7280]">
              {selectedOrder.estimatedDelivery}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* 4-Step Progress Bar */}
        <div className="pt-2">
          <div className="grid grid-cols-4 gap-1 text-center">
            {steps.map((label, idx) => {
              const done = idx <= activeStepIdx;
              return (
                <div key={label} className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 ${
                      done
                        ? 'bg-[#0EA75F] text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      done ? 'text-[#0B3D2E]' : 'text-[#6B7280]'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Route Map SVG Visualization (Matching Screen 21 in Image 4) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="relative h-36 bg-[#ECFDF5] flex items-center justify-center p-4">
          <svg
            viewBox="0 0 340 110"
            className="w-full h-full select-none"
          >
            {/* Subtle Map Grid */}
            <path
              d="M 20 85 Q 110 20, 195 60 T 315 35"
              fill="none"
              stroke="#0EA75F"
              strokeWidth="3"
              strokeDasharray="5 5"
            />
            {/* Origin Hub Node */}
            <circle cx="25" cy="82" r="6" fill="#0B3D2E" />
            <text x="25" y="100" textAnchor="start" className="text-[9px] fill-[#0B3D2E] font-bold">
              Global Hub
            </text>

            {/* Customs Clearance Node */}
            <circle cx="175" cy="52" r="6" fill="#0EA75F" />
            <text x="175" y="70" textAnchor="middle" className="text-[9px] fill-[#0B3D2E] font-bold">
              BD Customs (Cleared)
            </text>

            {/* Destination Dhaka Node */}
            <circle cx="310" cy="35" r="8" fill="#00C853" stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="305" y="18" textAnchor="end" className="text-[10px] fill-[#0EA75F] font-extrabold">
              Dhaka Doorstep
            </text>
          </svg>
        </div>

        <div className="p-3.5 flex items-center justify-between bg-white border-t border-slate-100 text-xs">
          <div>
            <span className="text-[#6B7280] block text-[11px]">
              Courier: <strong className="text-[#0B3D2E]">{selectedOrder.courierName}</strong>
            </span>
            <span className="font-mono-num font-bold text-[#0B3D2E]">
              Tracking ID: {selectedOrder.trackingCode}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(selectedOrder.trackingCode);
              showToast(`Copied tracking ID ${selectedOrder.trackingCode}`);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-bold text-[#0EA75F] flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Vertical Logistics Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <h3 className="text-xs font-extrabold text-[#0B3D2E]">
          Cross-Border Logistics Timeline
        </h3>
        <div className="space-y-3.5 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {selectedOrder.milestones.map((ms, idx) => (
            <div key={idx} className="relative pl-7">
              <div
                className={`absolute left-1 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  ms.current
                    ? 'bg-[#00C853] ring-4 ring-[#0EA75F]/20'
                    : ms.completed
                    ? 'bg-[#0EA75F]'
                    : 'bg-slate-300'
                }`}
              />
              <p className="text-xs font-bold text-[#0B3D2E]">{ms.title}</p>
              <p className="text-[11px] text-[#6B7280] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#0EA75F] shrink-0" />
                <span>{ms.location}</span>
              </p>
              <p className="font-mono-num text-[10px] text-slate-400 mt-0.5">
                {ms.timestamp}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Post-Purchase Actions (Rate, Reorder, View Invoice — Screen 17 in Image 3) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => showToast('Thank you! Your 5-star rating was submitted.')}
          className="h-11 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0B3D2E] flex items-center justify-center gap-1.5 hover:border-[#0EA75F]"
        >
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Rate Item</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const firstItem = selectedOrder.items[0];
            if (firstItem) addToCart(firstItem.productId, 1);
            navigateTo('cart');
          }}
          className="h-11 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0B3D2E] flex items-center justify-center gap-1.5 hover:border-[#0EA75F]"
        >
          <RefreshCcw className="w-3.5 h-3.5 text-[#0EA75F]" />
          <span>Reorder</span>
        </button>

        <button
          type="button"
          onClick={() => setInvoiceOpen(true)}
          className="h-11 rounded-xl bg-[#0EA75F] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Invoice</span>
        </button>
      </div>

      {/* Landed Cost Receipt / Invoice Modal */}
      {invoiceOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
          <div
            onClick={() => setInvoiceOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="relative z-10 w-full bg-white rounded-t-3xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#0B3D2E]">
                  Customs-Cleared Tax Invoice
                </h3>
                <p className="font-mono-num text-[11px] text-[#6B7280]">
                  Order #{selectedOrder.id} · {selectedOrder.placedDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-[#0B3D2E] font-medium">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-mono-num font-bold text-[#0B3D2E]">
                    {formatPrice(item.landedUnitBdt * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-100 flex justify-between text-[#6B7280]">
                <span>Bangladesh Customs Duty & VAT</span>
                <span className="text-[#0EA75F] font-semibold">
                  Pre-Paid Included
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-[#0B3D2E]">
                <span>Total Landed Paid</span>
                <span className="font-mono-num text-[#0EA75F]">
                  {formatPrice(selectedOrder.totalBdt)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInvoiceOpen(false)}
              className="w-full h-11 rounded-xl bg-[#0B3D2E] text-white text-xs font-bold"
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
