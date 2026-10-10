import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronDown,
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
import {
  BangladeshHeritageBadge,
  NakshiStitchDivider,
  RickshawCornerMotif,
} from '../shared/ExperienceModeSwitcher';

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
  const [customsCertOpen, setCustomsCertOpen] = useState(false);

  // Screen Mode 1: My Orders List
  if (currentScreen === 'orders') {
    const visibleOrders = orders.filter((o) =>
      statusFilter === 'All' ? true : o.status === statusFilter
    );

    return (
      <div className="p-4 space-y-4 pb-6 bg-app-bg">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['All', 'Processing', 'Shipped', 'Delivered'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`h-9 px-3.5 rounded-lg text-xs font-medium transition-colors border ${
                statusFilter === st
                  ? 'bg-brand-primary text-white border-brand-primary font-semibold'
                  : 'bg-white text-content-secondary border-app-border hover:border-app-borderStrong'
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
              className="bg-white rounded-xl border border-app-border p-4 space-y-3 hover:border-app-borderStrong transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="tabular-nums text-xs font-semibold text-content-primary">
                    #{ord.id}
                  </span>
                  <p className="text-xs text-content-secondary">
                    Placed on {ord.placedDate}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                    ord.status === 'Delivered'
                      ? 'bg-brand-subtle text-brand-primary'
                      : ord.status === 'Shipped'
                      ? 'bg-blue-50 text-status-transit'
                      : 'bg-amber-50 text-status-warning'
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
                    className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-app-border shrink-0"
                  />
                ))}
              </div>

              <div className="pt-2.5 border-t border-app-border flex items-center justify-between text-xs">
                <span className="text-content-secondary">
                  {ord.items.reduce((s, i) => s + i.quantity, 0)} items ·{' '}
                  {ord.courierName}
                </span>
                <span className="tabular-nums font-bold text-content-primary">
                  {formatPrice(ord.totalBdt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Screen Mode 2: Live Cross-Border Order Tracking (DESIGN_SYSTEM_SPEC.md Section 5.4)
  const routeSteps = [
    { key: 'export', label: 'Export Hub', sub: 'Factory QC' },
    { key: 'air', label: 'Air Freight', sub: 'Linehaul' },
    { key: 'customs', label: 'BD Customs', sub: 'Pre-Cleared' },
    { key: 'doorstep', label: 'Dhaka Doorstep', sub: 'eCourier' },
  ];

  const activeRouteIdx =
    selectedOrder.status === 'Delivered'
      ? 3
      : selectedOrder.status === 'Shipped'
      ? 2
      : 1;

  const isDelivered = selectedOrder.status === 'Delivered';

  return (
    <div className="p-4 space-y-4 pb-6 bg-app-bg">
      {/* 1. Clean Order Status & 4-Step Horizontal Micro-Progress Bar */}
      <div className="relative overflow-hidden bg-white rounded-xl border border-app-border p-4 space-y-4">
        <RickshawCornerMotif position="top-left" variant="emerald" />
        <BangladeshHeritageBadge label="Dhaka Customs Hub · Pre-Cleared" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="tabular-nums text-sm font-bold text-content-primary">
                Order #{selectedOrder.id}
              </span>
              <span
                className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  isDelivered
                    ? 'bg-brand-subtle text-brand-primary'
                    : 'bg-blue-50 text-status-transit'
                }`}
              >
                {isDelivered ? 'Delivered' : 'In Transit'}
              </span>
            </div>
            <p className="text-xs text-content-secondary mt-1">
              Estimated arrival:{' '}
              <strong className="text-content-primary font-medium">
                {selectedOrder.estimatedDelivery}
              </strong>
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isDelivered
                ? 'bg-brand-subtle text-brand-primary'
                : 'bg-blue-50 text-status-transit'
            }`}
          >
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* Clean 4-Step Horizontal Micro-Progress Bar (Export Hub -> Air Freight -> BD Customs -> Dhaka Doorstep) */}
        <div className="pt-2 border-t border-app-border">
          <div className="relative flex items-center justify-between">
            {/* Progress Track Line */}
            <div className="absolute left-4 right-4 top-3 h-0.5 bg-app-border" />
            <div
              className={`absolute left-4 top-3 h-0.5 transition-all duration-300 ${
                isDelivered ? 'bg-brand-primary' : 'bg-status-transit'
              }`}
              style={{
                width: `${(activeRouteIdx / (routeSteps.length - 1)) * 88}%`,
              }}
            />

            {routeSteps.map((step, idx) => {
              const completed = idx <= activeRouteIdx;
              const isCurrent = idx === activeRouteIdx;
              return (
                <div
                  key={step.key}
                  className="relative z-10 flex flex-col items-center text-center w-1/4"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors border-2 ${
                      completed
                        ? isDelivered
                          ? 'bg-brand-primary border-brand-primary text-white'
                          : isCurrent
                          ? 'bg-brand-primary border-brand-primary text-white ring-4 ring-emerald-100'
                          : 'bg-brand-primary border-brand-primary text-white'
                        : 'bg-white border-app-borderStrong text-content-muted'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 leading-tight ${
                      completed
                        ? 'font-semibold text-content-primary'
                        : 'text-content-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-content-muted mt-0.5">
                    {step.sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Courier & Tracking ID Bar */}
        <div className="pt-3 border-t border-app-border flex items-center justify-between text-xs">
          <div>
            <span className="text-content-secondary block text-[11px]">
              Courier:{' '}
              <strong className="text-content-primary font-semibold">
                {selectedOrder.courierName}
              </strong>
            </span>
            <span className="tabular-nums font-semibold text-content-primary">
              Tracking ID: {selectedOrder.trackingCode}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(selectedOrder.trackingCode);
              showToast(`Copied tracking ID ${selectedOrder.trackingCode}`);
            }}
            className="min-h-[36px] px-3 py-1.5 rounded-lg bg-app-subtle border border-app-border text-xs font-medium text-content-primary hover:bg-slate-200/70 flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-content-secondary" />
            <span>Copy</span>
          </button>
        </div>
      </div>

      <NakshiStitchDivider />

      {/* 2. Vertical Logistics Timeline (Active node in Blue-600 status-transit) */}
      <div className="bg-white rounded-xl border border-app-border p-4 space-y-3">
        <h3 className="text-sm font-semibold text-content-primary">
          Shipment Updates
        </h3>
        <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-app-border">
          {selectedOrder.milestones.map((ms, idx) => (
            <div key={idx} className="relative pl-7">
              <div
                className={`absolute left-1 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  ms.current
                    ? isDelivered
                      ? 'bg-brand-primary ring-4 ring-emerald-100'
                      : 'bg-status-transit ring-4 ring-blue-100'
                    : ms.completed
                    ? 'bg-content-primary'
                    : 'bg-slate-300'
                }`}
              />
              <p className="text-xs font-semibold text-content-primary">
                {ms.title}
              </p>
              <p className="text-xs text-content-secondary flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-content-muted shrink-0" />
                <span>{ms.location}</span>
              </p>
              <p className="tabular-nums text-[11px] text-content-muted mt-0.5">
                {ms.timestamp}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Secondary Disclosure Accordion for Customs & Warehouse QC Details */}
      <div className="bg-white rounded-xl border border-app-border overflow-hidden">
        <button
          type="button"
          onClick={() => setCustomsCertOpen(!customsCertOpen)}
          aria-expanded={customsCertOpen}
          className="w-full min-h-[48px] px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-status-success shrink-0" />
            <span className="text-xs font-semibold text-content-primary">
              Customs Clearance & Warehouse QC Certificate
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-content-secondary transition-transform ${
              customsCertOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {customsCertOpen && (
          <div className="px-4 pb-4 pt-2 border-t border-app-border space-y-2 text-xs text-content-secondary">
            <div className="flex justify-between py-1 border-b border-app-border">
              <span>Inspection Status</span>
              <span className="font-semibold text-status-success">
                Passed X-Ray & Seal Verification
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-app-border">
              <span>Net Parcel Weight</span>
              <span className="tabular-nums font-medium text-content-primary">
                0.84 kg
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>NBR Customs Reference</span>
              <span className="tabular-nums font-medium text-content-primary">
                BOE-{selectedOrder.id.slice(-4)} (Pre-Paid)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Post-Purchase Actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() =>
            showToast('Thank you! Your 5-star rating was submitted.')
          }
          className="min-h-[44px] rounded-lg bg-white border border-app-border text-xs font-semibold text-content-primary flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
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
          className="min-h-[44px] rounded-lg bg-white border border-app-border text-xs font-semibold text-content-primary flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5 text-content-secondary" />
          <span>Reorder</span>
        </button>

        <button
          type="button"
          onClick={() => setInvoiceOpen(true)}
          className="min-h-[44px] rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Invoice</span>
        </button>
      </div>

      {/* Viewport-Docked Landed Cost Receipt / Invoice Bottom Sheet (Docked above BottomTabBar via #mobile-sheet-root) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {invoiceOpen && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Customs-Cleared Tax Invoice"
                className="pointer-events-auto absolute inset-0 z-50 flex items-end justify-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setInvoiceOpen(false)}
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="relative z-10 w-full max-h-[85%] bg-white rounded-t-2xl shadow-2xl border-t border-app-border flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0px)]"
                >
                  <div className="pt-2.5 pb-1 shrink-0">
                    <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
                  </div>
                  <div className="px-4 py-2.5 border-b border-app-border flex items-center justify-between gap-2 shrink-0">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-content-primary truncate">
                        Customs-Cleared Tax Invoice
                      </h3>
                      <p className="tabular-nums text-xs text-content-secondary truncate">
                        Order #{selectedOrder.id} · {selectedOrder.placedDate}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Close invoice"
                      onClick={() => setInvoiceOpen(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:bg-app-subtle shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-2.5 text-xs">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-start justify-between gap-3">
                        <span className="text-content-secondary min-w-0 break-words">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="tabular-nums font-semibold text-content-primary shrink-0">
                          {formatPrice(item.landedUnitBdt * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2.5 border-t border-app-border flex justify-between gap-2 text-content-secondary">
                      <span>Bangladesh Customs Duty & VAT</span>
                      <span className="text-content-primary font-medium shrink-0">
                        Pre-Paid Included
                      </span>
                    </div>
                    <div className="pt-2.5 border-t border-app-border flex justify-between items-baseline gap-2">
                      <span className="text-sm font-semibold text-content-primary">
                        Total Landed Paid
                      </span>
                      <span className="tabular-nums text-lg font-bold text-content-primary shrink-0">
                        {formatPrice(selectedOrder.totalBdt)}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-app-border bg-white shrink-0">
                    <button
                      type="button"
                      onClick={() => setInvoiceOpen(false)}
                      className="w-full min-h-[44px] rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
                    >
                      Close Invoice
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.getElementById('mobile-sheet-root') || document.body
        )}
    </div>
  );
};

