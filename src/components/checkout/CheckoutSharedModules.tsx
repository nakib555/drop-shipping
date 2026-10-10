import React from 'react';
import {
  AlertCircle,
  Check,
  Loader2,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react';
import { ScreenId } from '../../types/deshimart';

export type CheckoutStepKey = 'address' | 'delivery' | 'payment' | 'review';

export interface CheckoutStepBarProps {
  activeStep: CheckoutStepKey;
  onNavigateStep?: (screen: ScreenId) => void;
}

const STEPS: { key: CheckoutStepKey; label: string; screen: ScreenId }[] = [
  { key: 'address', label: 'Address', screen: 'checkout_shipping' },
  { key: 'delivery', label: 'Delivery', screen: 'checkout_delivery' },
  { key: 'payment', label: 'Payment', screen: 'checkout_payment' },
  { key: 'review', label: 'Review', screen: 'checkout_review' },
];

/**
 * 1. COMPACT 4-STEP CHECKOUT PROGRESS INDICATOR
 * Clear step hierarchy with completed checkmarks, active emerald state, and backward navigation support.
 */
export const CheckoutProgressHeader: React.FC<CheckoutStepBarProps> = ({
  activeStep,
  onNavigateStep,
}) => {
  const activeIdx = STEPS.findIndex((s) => s.key === activeStep);

  return (
    <nav
      aria-label="Checkout progress"
      className="bg-white border-b border-app-border px-4 py-3 select-none"
    >
      <ol className="grid grid-cols-4 gap-1.5">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const isClickable = isCompleted && Boolean(onNavigateStep);

          return (
            <li key={step.key} className="min-w-0">
              <button
                type="button"
                disabled={!isClickable}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => {
                  if (isClickable && onNavigateStep) {
                    onNavigateStep(step.screen);
                  }
                }}
                className={`w-full h-9 px-2 rounded-lg border text-[11px] leading-4 font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                  isCurrent
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : isCompleted
                    ? 'bg-brand-subtle text-brand-primary border-brand-border hover:bg-emerald-100/70 cursor-pointer'
                    : 'bg-app-bg text-content-muted border-app-border cursor-default'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                ) : (
                  <span className="tabular-nums">{idx + 1}.</span>
                )}
                <span className="truncate">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

/**
 * 2. COMPLETE LANDED PRICE BREAKDOWN TABLE
 * Product-first, aligned tabular breakdown with confirmed vs pre-cleared customs items.
 */
export interface CheckoutPriceBreakdownProps {
  itemCount: number;
  baseItemsBdt: number;
  freightBdt: number;
  dutyAndVatBdt: number;
  consolidationSavingsBdt: number;
  promoCode?: string | null;
  promoDiscountBdt: number;
  shippingBdt: number;
  shippingLabel?: string;
  totalBdt: number;
  formatPrice: (bdt: number) => string;
  compact?: boolean;
  quoteId?: string;
  ruleVersion?: string;
  quoteStatus?: 'estimated' | 'confirmed';
}

export const CheckoutPriceBreakdown: React.FC<CheckoutPriceBreakdownProps> = ({
  itemCount,
  baseItemsBdt,
  freightBdt,
  dutyAndVatBdt,
  consolidationSavingsBdt,
  promoCode,
  promoDiscountBdt,
  shippingBdt,
  shippingLabel = 'Doorstep Delivery Speed',
  totalBdt,
  formatPrice,
  compact = false,
  quoteId,
  ruleVersion,
  quoteStatus = 'estimated',
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-app-border ${
        compact ? 'p-3.5 space-y-2.5' : 'p-4 space-y-3'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold text-content-primary">
            Landed Cost Summary
          </h3>
          {quoteId && (
            <span className="text-[10px] font-mono-num text-content-muted block mt-0.5">
              {quoteId} · {ruleVersion || 'NBR Tariff'}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium text-brand-primary inline-flex items-center gap-1 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>
            {quoteStatus === 'confirmed'
              ? 'Confirmed Total'
              : 'Estimated Landed'}
          </span>
        </span>
      </div>

      <div className="space-y-2 text-xs leading-4 pt-1 border-t border-app-border/80">
        <div className="flex justify-between text-content-secondary">
          <span>
            Items Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="tabular-nums font-medium text-content-primary">
            {formatPrice(baseItemsBdt)}
          </span>
        </div>

        <div className="flex justify-between text-content-secondary">
          <span>International Linehaul Freight</span>
          <span className="tabular-nums font-medium text-content-primary">
            {formatPrice(freightBdt)}
          </span>
        </div>

        <div className="flex justify-between text-content-secondary">
          <span>Pre-Cleared Customs Duty & BD VAT</span>
          <span className="tabular-nums font-medium text-content-primary">
            {formatPrice(dutyAndVatBdt)}
          </span>
        </div>

        {consolidationSavingsBdt > 0 && (
          <div className="flex justify-between text-brand-primary font-medium">
            <span>Combined Parcel Freight Savings (25%)</span>
            <span className="tabular-nums font-semibold">
              -{formatPrice(consolidationSavingsBdt)}
            </span>
          </div>
        )}

        {promoDiscountBdt > 0 && (
          <div className="flex justify-between text-brand-primary font-medium">
            <span>Promo Discount {promoCode ? `(${promoCode})` : ''}</span>
            <span className="tabular-nums font-semibold">
              -{formatPrice(promoDiscountBdt)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-content-secondary">
          <span>{shippingLabel}</span>
          <span
            className={`tabular-nums font-medium ${
              shippingBdt <= 0 ? 'text-brand-primary font-semibold' : 'text-content-primary'
            }`}
          >
            {shippingBdt === 0
              ? 'Free'
              : shippingBdt < 0
              ? `-${formatPrice(Math.abs(shippingBdt))}`
              : `+${formatPrice(shippingBdt)}`}
          </span>
        </div>

        <div className="pt-2.5 border-t border-app-border flex justify-between items-baseline">
          <div>
            <span className="text-sm font-semibold text-content-primary block">
              Total Payable
            </span>
            <span className="text-[11px] text-content-muted">
              Final landed total · No extra fees on delivery
            </span>
          </div>
          <span className="tabular-nums text-lg font-bold text-content-primary tracking-tight">
            {formatPrice(totalBdt)}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. STICKY BOTTOM CHECKOUT BAR WITH SAFE-AREA SUPPORT & INTERACTION STATES
 * Supports idle, loading, disabled, error, and retry states with 44px+ accessible touch targets.
 */
export interface CheckoutStickyFooterProps {
  totalLabel?: string;
  totalFormatted: string;
  subLabel?: string;
  primaryLabel: string;
  loadingLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  onPrimaryClick: () => void;
}

export const CheckoutStickyFooter: React.FC<CheckoutStickyFooterProps> = ({
  totalLabel = 'Total Payable',
  totalFormatted,
  subLabel = 'Duty & VAT included',
  primaryLabel,
  loadingLabel = 'Processing...',
  disabled = false,
  isLoading = false,
  errorMessage = null,
  onRetry,
  onPrimaryClick,
}) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-app-border px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] space-y-2">
      {errorMessage && (
        <div
          role="alert"
          className="p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between gap-2 text-xs text-red-800"
        >
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="truncate font-medium">{errorMessage}</span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="h-7 px-2.5 rounded-lg bg-white border border-red-200 text-red-700 font-semibold text-[11px] inline-flex items-center gap-1 shrink-0 hover:bg-red-100/50 transition-colors"
            >
              <RefreshCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="block text-[11px] font-medium text-content-secondary">
            {totalLabel}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="tabular-nums text-lg font-bold text-content-primary tracking-tight leading-tight">
              {totalFormatted}
            </span>
          </div>
          <span className="block text-[10px] text-brand-primary font-medium truncate">
            {subLabel}
          </span>
        </div>

        <button
          type="button"
          disabled={disabled || isLoading}
          onClick={onPrimaryClick}
          className="min-h-[46px] px-5 rounded-xl bg-brand-primary hover:bg-brand-hover active:scale-[0.99] disabled:bg-slate-300 disabled:text-slate-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shrink-0 min-w-[176px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{loadingLabel}</span>
            </>
          ) : (
            <span>{primaryLabel}</span>
          )}
        </button>
      </div>
    </div>
  );
};
