import {
  AppNotification,
  CategoryItem,
  GuideArticle,
  Order,
  Product,
  ShippingAddress,
} from '../types/deshimart';

/**
 * Category taxonomy metadata.
 * All products, orders, addresses, notifications, and guides are fetched dynamically
 * from live APIs in `src/services/productApi.ts`.
 */
export const CATEGORIES: CategoryItem[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    nameBn: 'ইলেকট্রনিক্স',
    subtitle: 'Smartphones, Laptops, Tablets & Audio',
    productCount: 0,
    deliveryRange: '5–12 days',
    accentColor: '#059669',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    nameBn: 'ফ্যাশন',
    subtitle: 'Apparel, Watches, Bags & Footwear',
    productCount: 0,
    deliveryRange: '7–14 days',
    accentColor: '#0F1D17',
  },
  {
    id: 'home_living',
    name: 'Home & Living',
    nameBn: 'হোম ও লিভিং',
    subtitle: 'Furniture, Kitchen & Home Decor',
    productCount: 0,
    deliveryRange: '7–15 days',
    accentColor: '#059669',
  },
  {
    id: 'beauty_health',
    name: 'Beauty & Health',
    nameBn: 'বিউটি ও হেলথ',
    subtitle: 'Skincare, Fragrances & Personal Care',
    productCount: 0,
    deliveryRange: '6–12 days',
    accentColor: '#0F1D17',
  },
  {
    id: 'sports_outdoor',
    name: 'Sports & Outdoor',
    nameBn: 'স্পোর্টস ও আউটডোর',
    subtitle: 'Athletic Gear & Fitness Accessories',
    productCount: 0,
    deliveryRange: '7–14 days',
    accentColor: '#059669',
  },
  {
    id: 'toys_games',
    name: 'Toys & Games',
    nameBn: 'খেলনা ও গেমস',
    subtitle: 'Recreational & Hobby Gear',
    productCount: 0,
    deliveryRange: '8–16 days',
    accentColor: '#0F1D17',
  },
  {
    id: 'automotive',
    name: 'Automotive',
    nameBn: 'অটোমোটিভ',
    subtitle: 'Vehicle Accessories & Motorcycle Gear',
    productCount: 0,
    deliveryRange: '9–16 days',
    accentColor: '#059669',
  },
];

// Empty initial arrays — all data is populated from live APIs (`fetchGlobalCatalogFromApi` & `fetchLiveOperationalDataFromApis`)
export const CATALOG_PRODUCTS: Product[] = [];
export const INITIAL_ADDRESSES: ShippingAddress[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
export const SHOPPING_GUIDES: GuideArticle[] = [];

export const SUPPORT_FAQS = [
  {
    question: 'Are customs duties and taxes included in the price?',
    answer:
      'Yes. Every price shown includes international shipping, customs duty, and VAT—with no extra charges on delivery.',
  },
  {
    question: 'How long does delivery take across Bangladesh?',
    answer:
      'Standard delivery takes 7–12 days, Priority Express takes 3–7 days, and Dhaka Ready items arrive in 1–3 days.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept Cash on Delivery (COD), bKash, Nagad, and Visa, Mastercard, or AMEX cards.',
  },
  {
    question: 'What is the return and refund policy?',
    answer:
      'Eligible items can be returned within 7 days of delivery for a full refund or replacement.',
  },
];

