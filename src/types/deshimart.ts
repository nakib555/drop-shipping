export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'home'
  | 'categories'
  | 'category_products'
  | 'product_detail'
  | 'price_tracker'
  | 'seller_compare'
  | 'spec_compare'
  | 'cart'
  | 'checkout_shipping'
  | 'checkout_delivery'
  | 'checkout_payment'
  | 'checkout_review'
  | 'order_success'
  | 'orders'
  | 'order_tracking'
  | 'account'
  | 'addresses'
  | 'payment_methods'
  | 'supplier_store'
  | 'wishlist'
  | 'notifications'
  | 'support'
  | 'settings'
  | 'guides'
  | 'admin_dashboard';

export type UserRole = 'customer' | 'admin';

export interface PromoVoucher {
  code: string;
  discountType: 'percent' | 'flat';
  value: number;
  minOrderBdt: number;
  maxDiscountBdt?: number;
  description: string;
  active: boolean;
}

export type CurrencyCode = 'BDT' | 'USD';
export type LanguageCode = 'EN' | 'BN';
export type ExperienceMode = 'global' | 'bangladesh';

export type CategoryId =
  | 'all'
  | 'electronics'
  | 'fashion'
  | 'home_living'
  | 'beauty_health'
  | 'sports_outdoor'
  | 'toys_games'
  | 'automotive';

export interface CategoryItem {
  id: CategoryId;
  name: string;
  nameBn: string;
  subtitle?: string;
  productCount: number;
  deliveryRange: string;
  accentColor: string;
  featuredImage?: string;
}

export interface SellerRoute {
  id: string;
  name: string;
  badge: string;
  originCountry: string;
  basePriceBdt: number;
  shippingBdt: number;
  dutyBdt: number;
  vatBdt: number;
  totalLandedBdt: number;
  deliveryDays: string;
  rating: number;
  reliabilityScore: number; // out of 10
  verified: boolean;
  onTimeRate: string;
  returnRate: string;
  responseTime: string;
}

export interface PriceHistoryPoint {
  dateLabel: string;
  priceBdt: number;
}

export interface ProductReview {
  id: string;
  author: string;
  verified: boolean;
  rating: number;
  date: string;
  comment: string;
  variantChosen: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  subtitle: string;
  fullDescription?: string;
  sku?: string;
  barcode?: string;
  stockCount?: number;
  minimumOrderQuantity?: number;
  returnPolicy?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  dimensions?: string;
  category: CategoryId;
  image: string;
  gallery?: string[];
  hsCode?: string;
  corridorTag?: string;
  originLabel: string;
  verifiedSupplier: boolean;
  supplierName: string;
  supplierFollowers: string;
  supplierProductsCount: string;
  rating: number;
  reviewCount: number;
  dropScore: number; // e.g. 8.7 or 9.1
  dropScoreLabel: 'Great Choice' | 'Excellent' | 'Top Value';
  // Landed Cost Breakdown in BDT (USD calculated dynamically via rate 1 USD = 120 BDT)
  productPriceBdt: number;
  shippingBdt: number;
  importDutyBdt: number; // 10%
  vatBdt: number; // 15%
  totalLandedBdt: number;
  originalLandedBdt: number;
  discountPercent: number;
  lowest30dBdt: number;
  arrivesThisWeek: boolean;
  inStock: boolean;
  colors: { name: string; hex: string }[];
  sizes?: string[];
  highlights: string[];
  specs: {
    display?: string;
    battery?: string;
    waterproof?: string;
    heartRate?: string;
    gps?: string;
    weight?: string;
    warranty: string;
  };
  routes: SellerRoute[];
  priceHistory: {
    '7D': PriceHistoryPoint[];
    '30D': PriceHistoryPoint[];
    '90D': PriceHistoryPoint[];
    '1Y': PriceHistoryPoint[];
  };
  reviews: ProductReview[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
  selectedRouteId: string;
}

export type ShippingMethodId = 'standard' | 'express' | 'hub_pickup';
export type PaymentMethodId = 'cod' | 'bkash' | 'nagad' | 'card' | 'paypal';

export interface ShippingAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface OrderTrackingMilestone {
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  placedDate: string;
  estimatedDelivery: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: {
    productId: string;
    name: string;
    image: string;
    quantity: number;
    variant: string;
    landedUnitBdt: number;
  }[];
  subtotalBdt: number;
  shippingBdt: number;
  customsDutyBdt: number;
  totalBdt: number;
  quoteId?: string;
  ruleVersion?: string;
  pricingStatus?: 'estimated' | 'confirmed';
  paymentTokenId?: string;
  maskedPaymentAccount?: string;
  paymentMethod: PaymentMethodId;
  shippingMethod: ShippingMethodId;
  shippingAddress: ShippingAddress;
  courierName: string;
  trackingCode: string;
  milestones: OrderTrackingMilestone[];
}

export interface AppNotification {
  id: string;
  type: 'order' | 'price_drop' | 'arrival' | 'promo';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  targetScreen?: ScreenId;
  targetProductId?: string;
  targetOrderId?: string;
}

export interface GuideArticle {
  id: string;
  title: string;
  subtitle: string;
  category: 'Tips' | 'Trends' | 'Safety';
  date: string;
  readTime: string;
  summary: string;
  bulletPoints: string[];
}
