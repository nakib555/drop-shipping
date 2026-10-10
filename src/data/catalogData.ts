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
    question: 'What does "True Landed Price" mean?',
    answer:
      'True Landed Price is the complete price to receive the product in Bangladesh, calculated from the live API base price + international linehaul freight + Bangladesh NBR customs duty (10%) + VAT (15%).',
  },
  {
    question: 'Where does the product catalog come from?',
    answer:
      'All products, specifications, dimensions, SKUs, barcodes, stock counts, and buyer reviews are fetched live from public e-commerce APIs (DummyJSON, FakeStoreAPI, and Platzi API).',
  },
  {
    question: 'Can I pay with Cash on Delivery (COD) or bKash/Nagad?',
    answer:
      'Yes. Checkout supports Cash on Delivery across Bangladesh, bKash and Nagad mobile wallets, and tokenized 3DS cards.',
  },
];
