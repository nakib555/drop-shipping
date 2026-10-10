import {
  AppNotification,
  CategoryId,
  GuideArticle,
  Order,
  Product,
  ShippingAddress,
} from '../types/deshimart';
import { calculateProductLandedQuote } from './pricingAndOrderEngine';

interface DummyJsonReview {
  rating?: number;
  comment?: string;
  date?: string;
  reviewerName?: string;
  reviewerEmail?: string;
}

interface DummyJsonDimensions {
  width?: number;
  height?: number;
  depth?: number;
}

interface DummyJsonMeta {
  createdAt?: string;
  updatedAt?: string;
  barcode?: string;
  qrCode?: string;
}

interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: DummyJsonDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: DummyJsonReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: DummyJsonMeta;
  thumbnail?: string;
  images?: string[];
}

interface DummyJsonCartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

interface DummyJsonCart {
  id: number;
  products: DummyJsonCartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

interface DummyJsonUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
}

interface DummyJsonPost {
  id: number;
  title: string;
  body: string;
  tags?: string[];
  reactions?: { likes?: number; dislikes?: number };
  views?: number;
}

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate?: number;
    count?: number;
  };
}

interface EscuelaProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  images?: string[];
  category?: {
    id?: number;
    name?: string;
  };
}

const SESSION_CACHE_KEY = 'deshimart_live_api_catalog_v6';

const CATEGORY_HS_CODES: Record<CategoryId, string> = {
  all: '8517.62.00',
  electronics: '8517.62.00',
  fashion: '6203.42.00',
  home_living: '8516.71.00',
  beauty_health: '3304.99.00',
  sports_outdoor: '9506.91.00',
  toys_games: '9503.00.00',
  automotive: '8525.89.00',
};

function sanitizeImageUrl(rawUrl?: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const cleaned = rawUrl
    .trim()
    .replace(/^\[?"?/, '')
    .replace(/"?\]?$/, '')
    .trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    return null;
  }
  if (
    cleaned.includes('placeimg.com') ||
    cleaned.includes('via.placeholder.com') ||
    cleaned.includes('example.com') ||
    cleaned.endsWith('.svg')
  ) {
    return null;
  }
  return cleaned;
}

function mapExternalCategory(rawCategory: string, title = ''): CategoryId {
  const cat = rawCategory.toLowerCase();
  const t = title.toLowerCase();

  if (
    cat.includes('smartphones') ||
    cat.includes('laptops') ||
    cat.includes('tablets') ||
    cat.includes('mobile-accessories') ||
    cat.includes('electronics') ||
    t.includes('headphone') ||
    t.includes('earbud') ||
    t.includes('keyboard') ||
    t.includes('mouse') ||
    t.includes('monitor')
  ) {
    return 'electronics';
  }

  if (
    cat.includes('shirts') ||
    cat.includes('dresses') ||
    cat.includes('shoes') ||
    cat.includes('watches') ||
    cat.includes('bags') ||
    cat.includes('jewellery') ||
    cat.includes('jewelry') ||
    cat.includes('sunglasses') ||
    cat.includes('tops') ||
    cat.includes('clothes') ||
    cat.includes('clothing') ||
    t.includes('hoodie') ||
    t.includes('jacket') ||
    t.includes('sneaker') ||
    t.includes('cap')
  ) {
    return 'fashion';
  }

  if (
    cat.includes('furniture') ||
    cat.includes('home-decoration') ||
    cat.includes('kitchen') ||
    t.includes('chair') ||
    t.includes('table') ||
    t.includes('sofa') ||
    t.includes('lamp')
  ) {
    return 'home_living';
  }

  if (
    cat.includes('beauty') ||
    cat.includes('fragrances') ||
    cat.includes('skin-care') ||
    t.includes('serum') ||
    t.includes('perfume')
  ) {
    return 'beauty_health';
  }

  if (
    cat.includes('sports') ||
    t.includes('gym') ||
    t.includes('fitness') ||
    t.includes('yoga') ||
    t.includes('cycling')
  ) {
    if (
      t.includes('ball') ||
      t.includes('cricket') ||
      t.includes('golf') ||
      t.includes('badminton') ||
      t.includes('tennis')
    ) {
      return 'toys_games';
    }
    return 'sports_outdoor';
  }

  if (
    cat.includes('motorcycle') ||
    cat.includes('vehicle') ||
    cat.includes('automotive') ||
    t.includes('car ') ||
    t.includes('helmet')
  ) {
    return 'automotive';
  }

  return 'toys_games';
}

const ORIGIN_HUBS = [
  {
    originLabel: 'China',
    corridorTag: 'China Direct',
    warehouse: 'China',
    supplier: 'Shenzhen Direct Co.',
  },
  {
    originLabel: 'South Korea',
    corridorTag: 'Korea Direct',
    warehouse: 'South Korea',
    supplier: 'Seoul Global Trade',
  },
  {
    originLabel: 'Singapore',
    corridorTag: 'Singapore Direct',
    warehouse: 'Singapore',
    supplier: 'SingaPort Direct',
  },
  {
    originLabel: 'Japan',
    corridorTag: 'Japan Direct',
    warehouse: 'Japan',
    supplier: 'Nihon Craft Exports',
  },
  {
    originLabel: 'Malaysia',
    corridorTag: 'Malaysia Direct',
    warehouse: 'Malaysia',
    supplier: 'Malay Global Hub',
  },
];

async function fetchJsonWithTimeout<T>(
  url: string,
  timeoutMs = 7500
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function buildNormalizedProduct(params: {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  usdPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  brand: string;
  sku?: string;
  barcode?: string;
  stockCount?: number;
  minimumOrderQuantity?: number;
  dimensions?: string;
  returnPolicy?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  weightGrams: number;
  warranty: string;
  tags: string[];
  rawReviews: {
    author: string;
    rating: number;
    comment: string;
    date: string;
    email?: string;
  }[];
  seedIndex: number;
}): Product {
  const {
    id,
    title,
    description,
    category,
    usdPrice,
    discountPercent,
    rating,
    reviewCount,
    image,
    gallery,
    brand,
    sku,
    barcode,
    stockCount = 25,
    minimumOrderQuantity = 1,
    dimensions,
    returnPolicy = '30-Day Return & Exchange Policy',
    shippingInformation = '7–12 days',
    availabilityStatus = 'In Stock',
    weightGrams,
    warranty,
    tags,
    rawReviews,
    seedIndex,
  } = params;

  const hub = ORIGIN_HUBS[seedIndex % ORIGIN_HUBS.length];

  const normalizedUsd =
    usdPrice > 1800
      ? 160 + (usdPrice % 360)
      : usdPrice < 5
      ? 7 + usdPrice
      : usdPrice;

  const baseBdt = Math.max(450, Math.round((normalizedUsd * 120) / 10) * 10);
  const rawFreightBdt =
    baseBdt < 1800 ? 180 : baseBdt < 6000 ? 340 : 620;

  // Use authoritative pricing engine for single source of truth
  const directQuote = calculateProductLandedQuote({
    productId: id,
    category,
    basePriceBdt: baseBdt,
    shippingBdt: rawFreightBdt,
    hsCode: CATEGORY_HS_CODES[category],
  });

  const productPriceBdt = directQuote.basePriceBdt;
  const shippingBdt = directQuote.freightBdt;
  const importDutyBdt = directQuote.customsDutyBdt;
  const vatBdt = directQuote.vatBdt;
  const totalLandedBdt = directQuote.totalLandedBdt;

  const cleanDiscount = Math.max(
    5,
    Math.min(40, Math.round(discountPercent || 12))
  );
  const originalLandedBdt =
    Math.round(totalLandedBdt / (1 - cleanDiscount / 100) / 10) * 10;
  const lowest30dBdt = Math.round(totalLandedBdt * 0.95);

  const dropScore = Number(
    Math.min(9.8, Math.max(8.4, rating * 1.85 + 0.3)).toFixed(1)
  );

  const dropScoreLabel: 'Excellent' | 'Great Choice' | 'Top Value' =
    dropScore >= 9.1
      ? 'Top Value'
      : dropScore >= 8.8
      ? 'Excellent'
      : 'Great Choice';

  const bdStockQuote = calculateProductLandedQuote({
    productId: `${id}-bd`,
    category,
    basePriceBdt: Math.round(productPriceBdt * 1.08),
    shippingBdt: 150,
    hsCode: CATEGORY_HS_CODES[category],
  });

  const expressQuote = calculateProductLandedQuote({
    productId: `${id}-air`,
    category,
    basePriceBdt: Math.round(productPriceBdt * 1.11),
    shippingBdt: shippingBdt + 400,
    hsCode: CATEGORY_HS_CODES[category],
  });

  // Build concise summary specs line for subtitle while keeping full API description
  const specSummaryParts = [
    brand && brand !== 'Global Direct' ? brand : null,
    dimensions || `${weightGrams}g`,
  ].filter(Boolean);

  const subtitle =
    specSummaryParts.length >= 2
      ? specSummaryParts.join(' · ')
      : description;

  const apiHighlights = [
    ...tags.map((t) => `Category Tag: ${t.charAt(0).toUpperCase() + t.slice(1)}`),
    shippingInformation ? `Fulfillment: ${shippingInformation}` : null,
    returnPolicy ? `Return Policy: ${returnPolicy}` : null,
    warranty ? `Warranty: ${warranty}` : null,
    dimensions ? `Dimensions: ${dimensions}` : null,
  ].filter((x): x is string => Boolean(x));

  return {
    id,
    name: title,
    nameBn: title,
    subtitle,
    fullDescription: description,
    sku,
    barcode,
    stockCount,
    minimumOrderQuantity,
    returnPolicy,
    shippingInformation,
    availabilityStatus,
    dimensions,
    category,
    image,
    gallery: gallery && gallery.length > 0 ? gallery : [image],
    hsCode: CATEGORY_HS_CODES[category] || '8517.62.00',
    corridorTag: hub.corridorTag,
    originLabel: hub.originLabel,
    verifiedSupplier: true,
    supplierName:
      brand && brand !== 'Global Direct' ? `${brand} Official Store` : hub.supplier,
    supplierFollowers: `${(3.8 + (seedIndex % 15) * 0.9).toFixed(1)}k`,
    supplierProductsCount: `${40 + (seedIndex % 9) * 25}`,
    rating: Number(rating.toFixed(1)),
    reviewCount: Math.max(rawReviews.length, reviewCount),
    dropScore,
    dropScoreLabel,
    productPriceBdt,
    shippingBdt,
    importDutyBdt,
    vatBdt,
    totalLandedBdt,
    originalLandedBdt,
    discountPercent: cleanDiscount,
    lowest30dBdt,
    arrivesThisWeek:
      shippingInformation.toLowerCase().includes('overnight') ||
      shippingInformation.toLowerCase().includes('days') ||
      seedIndex % 2 === 0,
    inStock: stockCount > 0 && availabilityStatus !== 'Out of Stock',
    colors: [
      { name: 'Standard Factory Finish', hex: '#0F172A' },
      { name: 'Silver / Pearl', hex: '#94A3B8' },
      { name: 'Emerald Edition', hex: '#059669' },
    ],
    sizes:
      category === 'fashion' || category === 'sports_outdoor'
        ? ['S / 39', 'M / 40', 'L / 41', 'XL / 42']
        : undefined,
    highlights:
      apiHighlights.length > 0
        ? apiHighlights.slice(0, 5)
        : [description],
    specs: {
      display: dimensions
        ? `${dimensions} (${brand || 'Export Grade'})`
        : `${brand || 'Authentic'} Standard Form Factor`,
      battery: sku ? `SKU: ${sku}${barcode ? ` · EAN ${barcode}` : ''}` : undefined,
      waterproof: shippingInformation || 'Export Protective Packaging',
      heartRate: availabilityStatus
        ? `${availabilityStatus} (${stockCount} units in warehouse)`
        : undefined,
      gps: returnPolicy || '30-Day Return Eligible',
      weight: `${weightGrams}g net weight`,
      warranty,
    },
    routes: [
      {
        id: `${id}-route-direct`,
        name: 'Global Direct',
        badge: 'Lowest Landed',
        originCountry: hub.warehouse,
        basePriceBdt: productPriceBdt,
        shippingBdt,
        dutyBdt: importDutyBdt,
        vatBdt,
        totalLandedBdt,
        deliveryDays: '7–12 days',
        rating: Number(rating.toFixed(1)),
        reliabilityScore: dropScore,
        verified: true,
        onTimeRate: '97.8%',
        returnRate: '1.4%',
        responseTime: '< 3h',
      },
      {
        id: `${id}-route-bd`,
        name: 'Dhaka Ready',
        badge: 'Fast Local',
        originCountry: 'Bangladesh',
        basePriceBdt: bdStockQuote.basePriceBdt,
        shippingBdt: bdStockQuote.freightBdt,
        dutyBdt: bdStockQuote.customsDutyBdt,
        vatBdt: bdStockQuote.vatBdt,
        totalLandedBdt: bdStockQuote.totalLandedBdt,
        deliveryDays: '3–5 days',
        rating: Number(Math.min(4.9, rating + 0.1).toFixed(1)),
        reliabilityScore: Number(Math.min(9.8, dropScore + 0.2).toFixed(1)),
        verified: true,
        onTimeRate: '99.1%',
        returnRate: '0.9%',
        responseTime: '< 1h',
      },
      {
        id: `${id}-route-air`,
        name: 'Priority Express',
        badge: 'Express Air',
        originCountry: 'Singapore',
        basePriceBdt: expressQuote.basePriceBdt,
        shippingBdt: expressQuote.freightBdt,
        dutyBdt: expressQuote.customsDutyBdt,
        vatBdt: expressQuote.vatBdt,
        totalLandedBdt: expressQuote.totalLandedBdt,
        deliveryDays: '4–7 days',
        rating: 4.9,
        reliabilityScore: 9.6,
        verified: true,
        onTimeRate: '99.4%',
        returnRate: '0.8%',
        responseTime: '< 1h',
      },
    ],
    priceHistory: {
      '7D': [
        { dateLabel: '7d ago', priceBdt: Math.round(totalLandedBdt * 1.05) },
        { dateLabel: '5d ago', priceBdt: Math.round(totalLandedBdt * 1.04) },
        { dateLabel: '3d ago', priceBdt: Math.round(totalLandedBdt * 1.02) },
        { dateLabel: 'Yesterday', priceBdt: Math.round(totalLandedBdt * 1.01) },
        { dateLabel: 'Today', priceBdt: totalLandedBdt },
      ],
      '30D': [
        { dateLabel: '30d ago', priceBdt: originalLandedBdt },
        { dateLabel: '20d ago', priceBdt: Math.round(totalLandedBdt * 1.08) },
        { dateLabel: '12d ago', priceBdt: lowest30dBdt },
        { dateLabel: '5d ago', priceBdt: Math.round(totalLandedBdt * 1.02) },
        { dateLabel: 'Today', priceBdt: totalLandedBdt },
      ],
      '90D': [
        { dateLabel: '90d ago', priceBdt: Math.round(originalLandedBdt * 1.04) },
        { dateLabel: '60d ago', priceBdt: originalLandedBdt },
        { dateLabel: '30d ago', priceBdt: lowest30dBdt },
        { dateLabel: 'Today', priceBdt: totalLandedBdt },
      ],
      '1Y': [
        { dateLabel: '12m ago', priceBdt: Math.round(originalLandedBdt * 1.09) },
        { dateLabel: '6m ago', priceBdt: originalLandedBdt },
        { dateLabel: '1m ago', priceBdt: lowest30dBdt },
        { dateLabel: 'Today', priceBdt: totalLandedBdt },
      ],
    },
    reviews: rawReviews.map((r, idx) => ({
      id: `${id}-rev-${idx}`,
      author: r.author,
      verified: true,
      rating: r.rating,
      date: r.date,
      comment: r.comment,
      variantChosen: sku ? `SKU ${sku} · Verified API Review` : 'Verified API Purchase',
    })),
  };
}

function normalizeDummyJsonItem(
  item: DummyJsonProduct,
  seedIndex: number
): Product | null {
  if (!item || !item.title) return null;
  if ((item.category || '').toLowerCase().includes('groceries')) {
    return null;
  }

  const primaryImage =
    sanitizeImageUrl(item.thumbnail) ||
    (Array.isArray(item.images)
      ? item.images.map(sanitizeImageUrl).find((u): u is string => Boolean(u)) ||
        null
      : null);

  if (!primaryImage) return null;

  const rawGallery = Array.isArray(item.images)
    ? Array.from(
        new Set(
          [primaryImage, ...item.images.map(sanitizeImageUrl)].filter(
            (u): u is string => Boolean(u)
          )
        )
      ).slice(0, 5)
    : [primaryImage];

  const category = mapExternalCategory(item.category || '', item.title || '');
  const reviews = Array.isArray(item.reviews)
    ? item.reviews.map((rv) => {
        const formattedDate = rv.date
          ? new Date(rv.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Verified API Review';
        return {
          author: rv.reviewerName || 'Verified Buyer',
          rating: Number(rv.rating) || 5,
          comment: rv.comment || '',
          date: formattedDate,
          email: rv.reviewerEmail,
        };
      })
    : [];

  const dims =
    item.dimensions &&
    item.dimensions.width &&
    item.dimensions.height &&
    item.dimensions.depth
      ? `${item.dimensions.width} × ${item.dimensions.height} × ${item.dimensions.depth} cm`
      : undefined;

  return buildNormalizedProduct({
    id: `api-dj-${item.id}`,
    title: item.title,
    description: item.description || '',
    category,
    usdPrice: Number(item.price) || 19.99,
    discountPercent: Number(item.discountPercentage) || 10,
    rating: Number(item.rating) || 4.6,
    reviewCount: reviews.length > 0 ? reviews.length * 14 : 42,
    image: primaryImage,
    gallery: rawGallery,
    brand: item.brand || 'Global Direct',
    sku: item.sku,
    barcode: item.meta?.barcode,
    stockCount: typeof item.stock === 'number' ? item.stock : 30,
    minimumOrderQuantity: item.minimumOrderQuantity || 1,
    dimensions: dims,
    returnPolicy: item.returnPolicy || '30 days return policy',
    shippingInformation: item.shippingInformation || 'Ships in 3–5 business days',
    availabilityStatus: item.availabilityStatus || 'In Stock',
    weightGrams: Math.max(100, Math.round((item.weight || 3) * 100)),
    warranty: item.warrantyInformation || '1 year official warranty',
    tags: Array.isArray(item.tags) ? item.tags : [item.category],
    rawReviews: reviews,
    seedIndex,
  });
}

function normalizeEscuelaItem(
  item: EscuelaProduct,
  seedIndex: number
): Product | null {
  if (!item || !item.title || item.title.length < 4) return null;
  const lowerTitle = item.title.toLowerCase();
  if (
    lowerTitle.includes('test') ||
    lowerTitle.includes('new product') ||
    lowerTitle.includes('string') ||
    lowerTitle.includes('untitled') ||
    lowerTitle.includes('sample') ||
    lowerTitle.includes('asdf')
  ) {
    return null;
  }

  const validImages = Array.isArray(item.images)
    ? item.images
        .map((img) => sanitizeImageUrl(img))
        .filter((u): u is string => Boolean(u))
    : [];

  if (validImages.length === 0) return null;

  const categoryName = item.category?.name || '';
  const category = mapExternalCategory(categoryName, item.title);

  return buildNormalizedProduct({
    id: `api-esc-${item.id}`,
    title: item.title.trim(),
    description: item.description || '',
    category,
    usdPrice: Number(item.price) || 29.0,
    discountPercent: 12 + (item.id % 15),
    rating: Number((4.5 + (item.id % 5) * 0.1).toFixed(1)),
    reviewCount: 18 + (item.id % 40),
    image: validImages[0],
    gallery: validImages.slice(0, 4),
    brand: categoryName ? `${categoryName} Official` : 'Global Direct',
    sku: `ESC-${item.id}`,
    stockCount: 24,
    weightGrams: 280 + ((item.id * 25) % 650),
    warranty: '1 year international warranty',
    tags: [categoryName || 'Export Direct'],
    rawReviews: [],
    seedIndex,
  });
}

/**
 * Fetches the full global product catalog from live public APIs:
 * 1. DummyJSON Products API (`https://dummyjson.com/products?limit=0`)
 * 2. FakeStoreAPI (`https://fakestoreapi.com/products`)
 * 3. Platzi Fake Store API (`https://api.escuelajs.co/api/v1/products`)
 */
export async function fetchGlobalCatalogFromApi(
  forceRefresh = false
): Promise<Product[]> {
  if (!forceRefresh) {
    try {
      const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
  }

  const [dummyData, fakeStoreData, escuelaData] = await Promise.all([
    fetchJsonWithTimeout<{ products?: DummyJsonProduct[] }>(
      'https://dummyjson.com/products?limit=0'
    ),
    fetchJsonWithTimeout<FakeStoreProduct[]>('https://fakestoreapi.com/products'),
    fetchJsonWithTimeout<EscuelaProduct[]>(
      'https://api.escuelajs.co/api/v1/products?offset=0&limit=36'
    ),
  ]);

  const combinedProducts: Product[] = [];

  if (dummyData?.products && Array.isArray(dummyData.products)) {
    dummyData.products.forEach((item, idx) => {
      const normalized = normalizeDummyJsonItem(item, idx);
      if (normalized) combinedProducts.push(normalized);
    });
  }

  if (Array.isArray(fakeStoreData)) {
    fakeStoreData.forEach((item, idx) => {
      const cleanImg = sanitizeImageUrl(item.image);
      if (!cleanImg || !item.title) return;
      const category = mapExternalCategory(item.category || '', item.title || '');
      combinedProducts.push(
        buildNormalizedProduct({
          id: `api-fs-${item.id}`,
          title: item.title,
          description: item.description || '',
          category,
          usdPrice: Number(item.price) || 24.99,
          discountPercent: 14,
          rating: Number(item.rating?.rate) || 4.6,
          reviewCount: Number(item.rating?.count) || 85,
          image: cleanImg,
          brand: 'FakeStore Global',
          sku: `FS-${item.id}`,
          stockCount: 40,
          weightGrams: 360,
          warranty: '1 year international warranty',
          tags: [item.category],
          rawReviews: [],
          seedIndex: 200 + idx,
        })
      );
    });
  }

  if (Array.isArray(escuelaData)) {
    escuelaData.forEach((item, idx) => {
      const normalized = normalizeEscuelaItem(item, 300 + idx);
      if (normalized) combinedProducts.push(normalized);
    });
  }

  if (combinedProducts.length > 0) {
    try {
      sessionStorage.setItem(
        SESSION_CACHE_KEY,
        JSON.stringify(combinedProducts)
      );
    } catch {
      // ignore storage quota
    }
  }

  return combinedProducts;
}

/**
 * Fetches live operational data (Orders from DummyJSON Carts API, Addresses from DummyJSON Users API,
 * Shopping Guides from DummyJSON Posts API, and Notifications derived from live API entities).
 */
export async function fetchLiveOperationalDataFromApis(
  catalogProducts: Product[]
): Promise<{
  addresses: ShippingAddress[];
  orders: Order[];
  notifications: AppNotification[];
  guides: GuideArticle[];
}> {
  const [cartsRes, usersRes, postsRes] = await Promise.all([
    fetchJsonWithTimeout<{ carts?: DummyJsonCart[] }>(
      'https://dummyjson.com/carts?limit=4'
    ),
    fetchJsonWithTimeout<{ users?: DummyJsonUser[] }>(
      'https://dummyjson.com/users?limit=4'
    ),
    fetchJsonWithTimeout<{ posts?: DummyJsonPost[] }>(
      'https://dummyjson.com/posts?limit=6'
    ),
  ]);

  const bdCities = ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi'];
  const addresses: ShippingAddress[] =
    usersRes?.users && usersRes.users.length > 0
      ? usersRes.users.slice(0, 3).map((u, idx) => ({
          id: `api-addr-${u.id}`,
          label: idx === 0 ? 'Home' : idx === 1 ? 'Office' : 'Other',
          fullName: `${u.firstName} ${u.lastName}`,
          phone: '+880 1712 345678',
          address: `${u.address?.address || 'Road 11, Banani'}, ${
            bdCities[idx % bdCities.length]
          }`,
          city: bdCities[idx % bdCities.length],
          postalCode: `121${idx + 2}`,
          isDefault: idx === 0,
        }))
      : [
          {
            id: 'api-addr-default',
            label: 'Home',
            fullName: 'Tanvir Ahmed',
            phone: '+880 1712 345678',
            address: 'Road 11, Banani, Dhaka',
            city: 'Dhaka',
            postalCode: '1213',
            isDefault: true,
          },
        ];

  const primaryAddress = addresses[0];
  const statuses: Order['status'][] = ['Shipped', 'Processing', 'Delivered'];
  const couriers = [
    'eCourier',
    'DHL Express',
    'RedX',
  ];

  const orders: Order[] =
    cartsRes?.carts && cartsRes.carts.length > 0
      ? cartsRes.carts.slice(0, 3).map((c, idx) => {
          const status = statuses[idx % statuses.length];
          const mappedItems = c.products.slice(0, 3).map((cp) => {
            const matchedCatalog = catalogProducts.find(
              (p) => p.id === `api-dj-${cp.id}`
            );
            const unitLandedBdt = matchedCatalog
              ? matchedCatalog.totalLandedBdt
              : Math.round(cp.price * 120 * 1.25);
            return {
              productId: matchedCatalog ? matchedCatalog.id : `api-dj-${cp.id}`,
              name: cp.title,
              image:
                sanitizeImageUrl(cp.thumbnail) ||
                matchedCatalog?.image ||
                catalogProducts[0]?.image ||
                '',
              quantity: cp.quantity || 1,
              variant: 'Standard · Global Direct',
              landedUnitBdt: unitLandedBdt,
            };
          });

          const subtotalBdt = mappedItems.reduce(
            (sum, item) => sum + item.landedUnitBdt * item.quantity,
            0
          );
          const customsDutyBdt = Math.round(subtotalBdt * 0.18);

          return {
            id: `DM${100000 + c.id * 1423}`,
            placedDate: idx === 0 ? 'Oct 8, 2026' : idx === 1 ? 'Oct 9, 2026' : 'Oct 2, 2026',
            estimatedDelivery:
              status === 'Delivered'
                ? 'Delivered'
                : status === 'Shipped'
                ? '2–4 days'
                : '5–9 days',
            status,
            items: mappedItems,
            subtotalBdt,
            shippingBdt: 0,
            customsDutyBdt,
            totalBdt: subtotalBdt,
            quoteId: `QT-API-${c.id}`,
            ruleVersion: 'v2.4.0-BD-NBR',
            pricingStatus: 'confirmed',
            paymentMethod: idx === 0 ? 'bkash' : idx === 1 ? 'cod' : 'card',
            shippingMethod: idx === 0 ? 'express' : 'standard',
            shippingAddress: addresses[idx % addresses.length] || primaryAddress,
            courierName: couriers[idx % couriers.length],
            trackingCode: `EC${840000 + c.id * 319}BD`,
            milestones: [
              {
                title:
                  status === 'Delivered'
                    ? 'Delivered'
                    : status === 'Shipped'
                    ? 'Out for Delivery'
                    : 'Order Confirmed',
                location: `${primaryAddress.city}, Bangladesh`,
                timestamp: status === 'Delivered' ? 'Oct 6, 2026' : 'Today',
                completed: true,
                current: true,
              },
              {
                title: 'Customs Cleared',
                location: 'Dhaka, Bangladesh',
                timestamp: status === 'Processing' ? 'Pending' : 'Completed',
                completed: status !== 'Processing',
              },
              {
                title: 'Dispatched from Origin',
                location: 'International Dispatch',
                timestamp: 'Completed',
                completed: true,
              },
            ],
          };
        })
      : [];

  const notifications: AppNotification[] = [];
  if (orders[0]) {
    notifications.push({
      id: `api-notif-ord-${orders[0].id}`,
      type: 'order',
      title: `Order #${orders[0].id} · ${orders[0].status}`,
      body: `${orders[0].items[0]?.name || 'Your order'} is on the way via ${
        orders[0].courierName
      } (${orders[0].trackingCode}).`,
      timestamp: '2h ago',
      read: false,
      targetScreen: 'order_tracking',
      targetOrderId: orders[0].id,
    });
  }

  if (catalogProducts[0]) {
    notifications.push({
      id: `api-notif-prod-${catalogProducts[0].id}`,
      type: 'price_drop',
      title: `Price Drop: ${catalogProducts[0].name}`,
      body: `Now ৳ ${catalogProducts[0].totalLandedBdt.toLocaleString('en-IN')} (${catalogProducts[0].discountPercent}% off) with customs & VAT included.`,
      timestamp: '5h ago',
      read: false,
      targetScreen: 'product_detail',
      targetProductId: catalogProducts[0].id,
    });
  }

  if (catalogProducts[1]) {
    notifications.push({
      id: `api-notif-tracker-${catalogProducts[1].id}`,
      type: 'price_drop',
      title: `30-Day Low: ${catalogProducts[1].name}`,
      body: `View 30-day price history and delivery route options.`,
      timestamp: 'Yesterday',
      read: true,
      targetScreen: 'price_tracker',
      targetProductId: catalogProducts[1].id,
    });
  }

  const curatedGuideTemplates: {
    title: string;
    category: GuideArticle['category'];
    date: string;
    readTime: string;
    summary: string;
    bulletPoints: string[];
  }[] = [
    {
      title: 'How All-Inclusive Pricing Works',
      category: 'Tips',
      date: 'Oct 2026',
      readTime: '2 min read',
      summary:
        'Every product price includes international shipping, customs clearance, and local delivery—so there are no surprise fees when your parcel arrives.',
      bulletPoints: [
        'Customs duty and import VAT are pre-calculated at checkout.',
        'Combine 2 or more items in one parcel to save 25% on shipping.',
        'Track every milestone from dispatch to doorstep delivery.',
      ],
    },
    {
      title: 'Choosing the Right Delivery Speed',
      category: 'Trends',
      date: 'Oct 2026',
      readTime: '2 min read',
      summary:
        'Compare Direct Air, Standard Doorstep, and Dhaka Ready options to balance delivery speed and total cost.',
      bulletPoints: [
        'Dhaka Ready items ship locally and arrive in 1–3 days.',
        'Priority Express delivers international orders in 3–7 days.',
        'Standard Doorstep covers all 64 districts in 7–12 days.',
      ],
    },
    {
      title: 'Safe Payments & Easy Returns',
      category: 'Safety',
      date: 'Oct 2026',
      readTime: '2 min read',
      summary:
        'Shop confidently with Cash on Delivery, bKash, Nagad, or card payments backed by our 7-day return policy.',
      bulletPoints: [
        'Pay in cash upon delivery or use bKash, Nagad, and cards.',
        'Every seller is verified before listing in the catalog.',
        'Request a return or replacement within 7 days of delivery.',
      ],
    },
  ];

  const guides: GuideArticle[] = curatedGuideTemplates.map((tpl, idx) => {
    const apiPostId = postsRes?.posts?.[idx]?.id ?? idx + 1;
    return {
      id: `api-guide-${apiPostId}`,
      title: tpl.title,
      subtitle: `${tpl.category} · ${tpl.readTime}`,
      category: tpl.category,
      date: tpl.date,
      readTime: tpl.readTime,
      summary: tpl.summary,
      bulletPoints: tpl.bulletPoints,
    };
  });

  return { addresses, orders, notifications, guides };
}

/**
 * Fetches incremental live batches from free APIs for infinite scroll pagination.
 */
export async function fetchContinuousProductBatch(
  batchCursor: number
): Promise<Product[]> {
  const dummySkip = (batchCursor * 24) % 160;
  const escuelaOffset = ((batchCursor + 1) * 20) % 120;

  const [dummyBatch, escuelaBatch] = await Promise.all([
    fetchJsonWithTimeout<{ products?: DummyJsonProduct[] }>(
      `https://dummyjson.com/products?limit=24&skip=${dummySkip}`
    ),
    fetchJsonWithTimeout<EscuelaProduct[]>(
      `https://api.escuelajs.co/api/v1/products?offset=${escuelaOffset}&limit=20`
    ),
  ]);

  const batchProducts: Product[] = [];

  if (dummyBatch?.products && Array.isArray(dummyBatch.products)) {
    dummyBatch.products.forEach((item, idx) => {
      const normalized = normalizeDummyJsonItem(item, dummySkip + idx);
      if (normalized) batchProducts.push(normalized);
    });
  }

  if (Array.isArray(escuelaBatch)) {
    escuelaBatch.forEach((item, idx) => {
      const normalized = normalizeEscuelaItem(item, 400 + escuelaOffset + idx);
      if (normalized) batchProducts.push(normalized);
    });
  }

  return batchProducts;
}

/**
 * Live search against free public product APIs when the user types a search query.
 */
export async function searchFreeProductApis(query: string): Promise<Product[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const encoded = encodeURIComponent(trimmed);
  const [dummySearch, escuelaSearch] = await Promise.all([
    fetchJsonWithTimeout<{ products?: DummyJsonProduct[] }>(
      `https://dummyjson.com/products/search?q=${encoded}&limit=24`
    ),
    fetchJsonWithTimeout<EscuelaProduct[]>(
      `https://api.escuelajs.co/api/v1/products/?title=${encoded}`
    ),
  ]);

  const results: Product[] = [];

  if (dummySearch?.products && Array.isArray(dummySearch.products)) {
    dummySearch.products.forEach((item, idx) => {
      const normalized = normalizeDummyJsonItem(item, 500 + idx);
      if (normalized) results.push(normalized);
    });
  }

  if (Array.isArray(escuelaSearch)) {
    escuelaSearch.slice(0, 16).forEach((item, idx) => {
      const normalized = normalizeEscuelaItem(item, 600 + idx);
      if (normalized) results.push(normalized);
    });
  }

  return results;
}

