import assert from 'node:assert/strict';
import { Product } from '../types/deshimart';
import {
  doesProductArriveThisWeek,
  EXCHANGE_RATE_SNAPSHOT,
  formatCanonicalPrice,
  getCanonicalLandedPricing,
  isVerifiedQualitySupplier,
  parseMaxDeliveryDays,
} from './pricingEngine';

const smartwatchFixture: Product = {
  id: 'prod-smartwatch-pro',
  name: 'Smart Watch Pro',
  nameBn: 'স্মার্ট ওয়াচ প্রো',
  subtitle: '1.7" AMOLED · GPS · 14-Day Battery · IP68 Waterproof',
  category: 'electronics',
  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  originLabel: 'From China · Verified Supplier',
  verifiedSupplier: true,
  supplierName: 'GlobalTech Store',
  supplierFollowers: '12.4k',
  supplierProductsCount: '5.2k',
  rating: 4.7,
  reviewCount: 1240,
  dropScore: 8.7,
  dropScoreLabel: 'Great Choice',
  productPriceBdt: 4520,
  shippingBdt: 450,
  importDutyBdt: 520,
  vatBdt: 720,
  totalLandedBdt: 6210,
  originalLandedBdt: 7400,
  discountPercent: 16,
  lowest30dBdt: 5980,
  arrivesThisWeek: true,
  inStock: true,
  colors: [{ name: 'Obsidian Black', hex: '#111827' }],
  highlights: ['Waterproof IP68'],
  specs: { warranty: '1 year local warranty' },
  routes: [
    {
      id: 'route-global-direct',
      name: 'Global Direct',
      badge: 'Lowest Cost',
      originCountry: 'Shenzhen Warehouse',
      basePriceBdt: 4520,
      shippingBdt: 450,
      dutyBdt: 520,
      vatBdt: 720,
      totalLandedBdt: 6210,
      deliveryDays: '12–18 days',
      rating: 4.5,
      reliabilityScore: 8.7,
      verified: true,
      onTimeRate: '96%',
      returnRate: '2.4%',
      responseTime: '< 6h',
    },
    {
      id: 'route-bd-stock',
      name: 'Bangladesh Stock',
      badge: 'Best Balance',
      originCountry: 'Dhaka Hub Ready',
      basePriceBdt: 5400,
      shippingBdt: 250,
      dutyBdt: 520,
      vatBdt: 710,
      totalLandedBdt: 6880,
      deliveryDays: '7–12 days',
      rating: 4.6,
      reliabilityScore: 9.1,
      verified: true,
      onTimeRate: '98%',
      returnRate: '1.8%',
      responseTime: '< 3h',
    },
    {
      id: 'route-premium',
      name: 'Premium Supplier',
      badge: 'Fastest Air',
      originCountry: 'Singapore Express Hub',
      basePriceBdt: 5600,
      shippingBdt: 620,
      dutyBdt: 520,
      vatBdt: 710,
      totalLandedBdt: 7450,
      deliveryDays: '5–6 days',
      rating: 4.8,
      reliabilityScore: 9.5,
      verified: true,
      onTimeRate: '99.2%',
      returnRate: '1.1%',
      responseTime: '< 1h',
    },
  ],
  priceHistory: {
    '7D': [],
    '30D': [],
    '90D': [],
    '1Y': [],
  },
  reviews: [],
};

// 1. Canonical Landed Pricing Calculation Tests
const defaultPricing = getCanonicalLandedPricing(smartwatchFixture);
assert.equal(defaultPricing.productPriceBdt, 4520);
assert.equal(defaultPricing.shippingBdt, 450);
assert.equal(defaultPricing.importDutyBdt, 520);
assert.equal(defaultPricing.vatBdt, 720);
assert.equal(defaultPricing.dutyAndVatBdt, 1240);
assert.equal(defaultPricing.estimatedLandedBdt, 6210);
assert.equal(defaultPricing.hasValidDiscount, true);
assert.equal(defaultPricing.savingsBdt, 7400 - 6210);
assert.equal(defaultPricing.discountPercent, 16);

// 2. Route-Aware Landed Pricing Tests
const bdStockPricing = getCanonicalLandedPricing(smartwatchFixture, {
  [smartwatchFixture.id]: 'route-bd-stock',
});
assert.equal(bdStockPricing.estimatedLandedBdt, 6880);
assert.equal(bdStockPricing.deliveryDaysLabel, '7–12 days');

// 3. Invalid Discount Protection (original <= current)
const nonDiscountedProduct: Product = {
  ...smartwatchFixture,
  originalLandedBdt: 6000, // Lower than 6210 landed price
  discountPercent: 25,
};
const safeDiscountPricing = getCanonicalLandedPricing(nonDiscountedProduct);
assert.equal(safeDiscountPricing.hasValidDiscount, false);
assert.equal(safeDiscountPricing.discountPercent, 0);
assert.equal(safeDiscountPricing.savingsBdt, 0);

// 4. Currency Formatting Tests
assert.equal(formatCanonicalPrice(6210, 'BDT'), '৳\u00A06,210');
assert.equal(
  formatCanonicalPrice(1200, 'USD'),
  `$\u00A0${(1200 / EXCHANGE_RATE_SNAPSHOT.bdtPerUsd).toFixed(2)}`
);

// 5. Smart Filter Evaluation Tests
assert.equal(parseMaxDeliveryDays('3–6 days'), 6);
assert.equal(parseMaxDeliveryDays('7–12 days'), 12);
assert.equal(
  doesProductArriveThisWeek(smartwatchFixture, {
    [smartwatchFixture.id]: 'route-premium',
  }),
  true
);
assert.equal(isVerifiedQualitySupplier(smartwatchFixture), true);

const unverifiedSupplierProduct: Product = {
  ...smartwatchFixture,
  verifiedSupplier: false,
};
assert.equal(isVerifiedQualitySupplier(unverifiedSupplierProduct), false);

console.log('All canonical pricing, currency formatting, and filter unit tests passed.');
