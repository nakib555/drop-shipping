import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  Copy,
  FileText,
  MapPin,
  RefreshCcw,
  ShieldCheck,
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

  // Screen Mode 1: My Orders List
  if (currentScreen === 'orders') {
    const visibleOrders = orders.filter((o) =>
      statusFilter === 'All' ? true : o.status === statusFilter
    );

    return (
      <div className="p-4 space-y-4 pb-6 bg-[#F8FAFC]">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['All', 'Processing', 'Shipped', 'Delivered'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200/80'
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
              className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono-num text-xs font-semibold text-slate-900">
                    #{ord.id}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Placed on {ord.placedDate}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    ord.status === 'Delivered'
                      ? 'text-[#059669]'
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
                    className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                  />
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {ord.items.reduce((s, i) => s + i.quantity, 0)} items ·{' '}
                  {ord.courierName}
                </span>
                <span className="font-mono-num font-semibold text-slate-900">
                  {formatPrice(ord.totalBdt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Screen Mode 2: Live Cross-Border Order Tracking
  const steps = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const activeStepIdx =
    selectedOrder.status === 'Delivered'
      ? 3
      : selectedOrder.status === 'Shipped'
      ? 2
      : 1;

  return (
    <div className="p-4 space-y-4 pb-6 bg-[#F8FAFC]">
      {/* Order Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono-num text-sm font-semibold text-slate-900">
              #{selectedOrder.id}
            </span>
            <p className="text-xs font-medium text-[#059669] mt-0.5">
              {selectedOrder.status === 'Delivered'
                ? 'Delivered to Doorstep'
                : 'In Transit · Customs Pre-Cleared'}
            </p>
            <p className="text-[11px] text-slate-500">
              Estimated: {selectedOrder.estimatedDelivery}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Truck className="w-5 h-5" />
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
                        ? 'bg-[#059669] text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-[10px] font-medium ${
                      done ? 'text-slate-900 font-semibold' : 'text-slate-400'
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

      {/* Live Route Map SVG Visualization */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="relative h-36 bg-slate-900 flex items-center justify-center p-4">
          <svg viewBox="0 0 340 110" className="w-full h-full select-none">
            {/* Animated Flowing Route Path */}
            <path
              d="M 20 85 Q 110 20, 195 60 T 315 35"
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="animate-route-dash"
            />
            {/* Origin Hub Node */}
            <circle cx="25" cy="82" r="5" fill="#94A3B8" />
            <text
              x="25"
              y="100"
              textAnchor="start"
              className="text-[9px] fill-slate-300 font-medium"
            >
              Export Hub
            </text>

            {/* Customs Clearance Node */}
            <circle cx="175" cy="52" r="5" fill="#059669" />
            <text
              x="175"
              y="70"
              textAnchor="middle"
              className="text-[9px] fill-slate-300 font-medium"
            >
              BD Customs (Cleared)
            </text>

            {/* Destination Dhaka Node with Pulsing Beacon */}
            <circle
              cx="310"
              cy="35"
              r="14"
              fill="#059669"
              opacity="0.3"
              className="animate-ping"
            />
            <circle
              cx="310"
              cy="35"
              r="7"
              fill="#059669"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text
              x="305"
              y="18"
              textAnchor="end"
              className="text-[10px] fill-emerald-400 font-semibold"
            >
              Dhaka Doorstep
            </text>
          </svg>
        </div>

        <div className="p-3.5 flex items-center justify-between bg-white border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">
              Courier: <strong className="text-slate-900 font-semibold">{selectedOrder.courierName}</strong>
            </span>
            <span className="font-mono-num font-semibold text-slate-900">
              Tracking ID: {selectedOrder.trackingCode}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(selectedOrder.trackingCode);
              showToast(`Copied tracking ID ${selectedOrder.trackingCode}`);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Vertical Logistics Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <h3 className="text-xs font-semibold text-slate-900">
          Cross-Border Logistics Timeline
        </h3>
        <div className="space-y-3.5 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {selectedOrder.milestones.map((ms, idx) => (
            <div key={idx} className="relative pl-7">
              <div
                className={`absolute left-1 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  ms.current
                    ? 'bg-[#059669] ring-4 ring-[#059669]/20'
                    : ms.completed
                    ? 'bg-slate-900'
                    : 'bg-slate-300'
                }`}
              />
              <p className="text-xs font-semibold text-slate-900">{ms.title}</p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{ms.location}</span>
              </p>
              <p className="font-mono-num text-[10px] text-slate-400 mt-0.5">
                {ms.timestamp}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-Shipment Warehouse QC Inspection & NBR Customs Pass */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <h3 className="text-xs font-semibold text-slate-900">
              Warehouse QC & Customs Certificate
            </h3>
          </div>
          <span className="text-[10px] font-mono-num font-semibold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-md">
            QC PASSED
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Net Weight</span>
            <span className="font-mono-num font-semibold text-slate-900">
              0.84 kg
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Seal & X-Ray</span>
            <span className="font-semibold text-[#059669]">Verified</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">NBR Bill ID</span>
            <span className="font-mono-num font-semibold text-slate-900">
              BOE-{selectedOrder.id.slice(-4)}
            </span>
          </div>
        </div>
      </div>

      {/* Post-Purchase Actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => showToast('Thank you! Your 5-star rating was submitted.')}
          className="h-10 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50"
        >
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Rate</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const firstItem = selectedOrder.items[0];
            if (firstItem) addToCart(firstItem.productId, 1);
            navigateTo('cart');
          }}
          className="h-10 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50"
        >
          <RefreshCcw className="w-3.5 h-3.5 text-slate-600" />
          <span>Reorder</span>
        </button>

        <button
          type="button"
          onClick={() => setInvoiceOpen(true)}
          className="h-10 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Invoice</span>
        </button>
      </div>

      {/* Animated Landed Cost Receipt / Invoice Modal */}
      <AnimatePresence>
        {invoiceOpen && (
          <div className="absolute inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInvoiceOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="relative z-10 w-full bg-white rounded-t-3xl p-4 shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Customs-Cleared Tax Invoice
                  </h3>
                  <p className="font-mono-num text-[11px] text-slate-500">
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
                    <span className="text-slate-700">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-mono-num font-semibold text-slate-900">
                      {formatPrice(item.landedUnitBdt * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-500">
                  <span>Bangladesh Customs Duty & VAT</span>
                  <span className="text-[#059669] font-medium">
                    Pre-Paid Included
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-semibold text-slate-900">
                  <span>Total Landed Paid</span>
                  <span className="font-mono-num text-[#059669]">
                    {formatPrice(selectedOrder.totalBdt)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInvoiceOpen(false)}
                className="w-full h-10 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Close Invoice
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
