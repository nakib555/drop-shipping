import {
  CurrencyCode,
  Product,
  SellerRoute,
} from '../types/deshimart';

/**
 * Canonical DeshiMart Landed Pricing & Filter Evaluation Engine
 *
 * Ensures that HomeScreen, ProductCard, ProductDetailScreen, CategoriesScreen,
 * CartScreen, and CheckoutFlowScreen use identical, non-conflicting calculations
 * for estimated landed price, active shipping route, discount validation,
 * and smart filter matching.
 */

export const EXCHANGE_RATE_SNAPSHOT = {
  bdtPerUsd: 120,
  sourceLabel: 'BB Indicative Cross-Border Rate',
  asOfDate: 'Oct 2026',
  isIndicative: true,
} as const;

export interface CanonicalLandedBreakdown {
  activeRoute: SellerRoute | undefined;
  productPriceBdt: number;
  shippingBdt: number;
  importDutyBdt: number;
  vatBdt: number;
  dutyAndVatBdt: number;
  estimatedLandedBdt: number;
  originalLandedBdt: number;
  hasValidDiscount: boolean;
  discountPercent: number;
  savingsBdt: number;
  deliveryDaysLabel: string;
  maxDeliveryDays: number;
  isEstimatedCustomsPreCleared: boolean;
}

/**
 * Parses a delivery window string like "5–9 days" or "3–6 days" and returns
 * the upper bound in days (e.g. 9 or 6) for destination-aware filter checks.
 */
export function parseMaxDeliveryDays(deliveryWindow?: string): number {
  if (!deliveryWindow) return 14;
  const matches = deliveryWindow.match(/\d+/g);
  if (!matches || matches.length === 0) return 14;
  const nums = matches.map((n) => parseInt(n, 10)).filter((n) => !Number.isNaN(n));
  if (nums.length === 0) return 14;
  return Math.max(...nums);
}

/**
 * Resolves the active route and canonical landed cost breakdown for a product.
 * Avoids double-counting any component already included in the route's total.
 */
export function getCanonicalLandedPricing(
  product: Product,
  selectedRouteByProduct?: Record<string, string>
): CanonicalLandedBreakdown {
  const chosenRouteId = selectedRouteByProduct?.[product.id];
  const activeRoute =
    product.routes?.find((r) => r.id === chosenRouteId) || product.routes?.[0];

  const productPriceBdt = Math.max(
    0,
    Math.round(activeRoute ? activeRoute.basePriceBdt : product.productPriceBdt)
  );
  const shippingBdt = Math.max(
    0,
    Math.round(activeRoute ? activeRoute.shippingBdt : product.shippingBdt)
  );
  const importDutyBdt = Math.max(
    0,
    Math.round(activeRoute ? activeRoute.dutyBdt : product.importDutyBdt)
  );
  const vatBdt = Math.max(
    0,
    Math.round(activeRoute ? activeRoute.vatBdt : product.vatBdt)
  );
  const dutyAndVatBdt = importDutyBdt + vatBdt;

  // Canonical sum of explicit components to prevent discrepancy or double-counting
  const componentSumBdt = productPriceBdt + shippingBdt + dutyAndVatBdt;
  const rawRouteTotal = activeRoute
    ? activeRoute.totalLandedBdt
    : product.totalLandedBdt;
  const estimatedLandedBdt =
    rawRouteTotal > 0 ? Math.round(rawRouteTotal) : componentSumBdt;

  const rawOriginalBdt = Math.round(product.originalLandedBdt || 0);
  const hasValidDiscount = rawOriginalBdt > estimatedLandedBdt;
  const savingsBdt = hasValidDiscount ? rawOriginalBdt - estimatedLandedBdt : 0;
  const computedDiscountPct = hasValidDiscount
    ? Math.round(((rawOriginalBdt - estimatedLandedBdt) / rawOriginalBdt) * 100)
    : 0;
  const discountPercent =
    hasValidDiscount && computedDiscountPct > 0 ? computedDiscountPct : 0;

  const deliveryDaysLabel = activeRoute?.deliveryDays || '7–12 days';
  const maxDeliveryDays = parseMaxDeliveryDays(deliveryDaysLabel);

  return {
    activeRoute,
    productPriceBdt,
    shippingBdt,
    importDutyBdt,
    vatBdt,
    dutyAndVatBdt,
    estimatedLandedBdt,
    originalLandedBdt: hasValidDiscount ? rawOriginalBdt : estimatedLandedBdt,
    hasValidDiscount,
    discountPercent,
    savingsBdt,
    deliveryDaysLabel,
    maxDeliveryDays,
    isEstimatedCustomsPreCleared: dutyAndVatBdt > 0 && Boolean(activeRoute?.verified ?? product.verifiedSupplier),
  };
}

/**
 * Formats an authoritative BDT amount into either BDT (৳) or indicative USD ($)
 * with non-breaking spaces and en-IN grouping for BDT.
 */
export function formatCanonicalPrice(
  bdtAmount: number,
  currency: CurrencyCode = 'BDT'
): string {
  const safeAmount = Number.isFinite(bdtAmount) ? Math.max(0, bdtAmount) : 0;
  if (currency === 'USD') {
    const usd = safeAmount / EXCHANGE_RATE_SNAPSHOT.bdtPerUsd;
    return `$\u00A0${usd.toFixed(2)}`;
  }
  return `৳\u00A0${Math.round(safeAmount).toLocaleString('en-IN')}`;
}

/**
 * Evaluates whether a product qualifies for "Arrives this week" (<= 7 days on active or fastest route)
 */
export function doesProductArriveThisWeek(
  product: Product,
  selectedRouteByProduct?: Record<string, string>
): boolean {
  const pricing = getCanonicalLandedPricing(product, selectedRouteByProduct);
  if (pricing.maxDeliveryDays <= 7) return true;
  return Boolean(product.arrivesThisWeek);
}

/**
 * Evaluates whether a product's supplier meets the verified supplier + quality threshold
 */
export function isVerifiedQualitySupplier(product: Product): boolean {
  return Boolean(product.verifiedSupplier && product.dropScore >= 8.5);
}
