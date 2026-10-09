import { CategoryId, Product } from '../types/deshimart';

interface DummyJsonReview {
  rating?: number;
  comment?: string;
  date?: string;
  reviewerName?: string;
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
  brand?: string;
  weight?: number;
  warrantyInformation?: string;
  shippingInformation?: string;
  thumbnail?: string;
  images?: string[];
  reviews?: DummyJsonReview[];
  tags?: string[];
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

const SESSION_CACHE_KEY = 'deshimart_api_catalog_v4';

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
    originLabel: 'China · Verified Factory',
    corridorTag: 'Shenzhen Air',
    warehouse: 'Shenzhen Export Hub',
    supplier: 'Shenzhen Direct Co.',
  },
  {
    originLabel: 'South Korea · Official Hub',
    corridorTag: 'Seoul Direct',
    warehouse: 'Incheon Air Hub',
    supplier: 'Seoul Global Trade',
  },
  {
    originLabel: 'Singapore · Regional Hub',
    corridorTag: 'Singapore Hub',
    warehouse: 'Changi Logistics Hub',
    supplier: 'SingaPort Direct',
  },
  {
    originLabel: 'Japan · Inspected Exporter',
    corridorTag: 'Tokyo Air',
    warehouse: 'Tokyo Narita Hub',
    supplier: 'Nihon Craft Exports',
  },
  {
    originLabel: 'Malaysia · Direct Hub',
    corridorTag: 'KL Express',
    warehouse: 'Kuala Lumpur Air Hub',
    supplier: 'Malay Global Hub',
  },
];

async function fetchJsonWithTimeout<T>(url: string, timeoutMs = 6500): Promise<T | null> {
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
  weightGrams: number;
  warranty: string;
  tags: string[];
  rawReviews: { author: string; rating: number; comment: string; date: string }[];
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
    weightGrams,
    warranty,
    tags,
    rawReviews,
    seedIndex,
  } = params;

  const hub = ORIGIN_HUBS[seedIndex % ORIGIN_HUBS.length];

  const normalizedUsd =
    usdPrice > 1500
      ? 140 + (usdPrice % 320)
      : usdPrice < 6
      ? 8 + usdPrice
      : usdPrice;

  const productPriceBdt = Math.max(450, Math.round((normalizedUsd * 115) / 10) * 10);
  const shippingBdt =
    productPriceBdt < 1800 ? 180 : productPriceBdt < 6000 ? 340 : 620;
  const importDutyBdt = Math.round(productPriceBdt * 0.1);
  const vatBdt = Math.round((productPriceBdt + importDutyBdt) * 0.15);
  const totalLandedBdt = productPriceBdt + shippingBdt + importDutyBdt + vatBdt;

  const cleanDiscount = Math.max(8, Math.min(35, Math.round(discountPercent || 14)));
  const originalLandedBdt = Math.round(totalLandedBdt / (1 - cleanDiscount / 100) / 10) * 10;
  const lowest30dBdt = Math.round(totalLandedBdt * 0.95);

  const dropScore = Number(
    Math.min(9.7, Math.max(8.4, rating * 1.85 + 0.3)).toFixed(1)
  );

  const dropScoreLabel: 'Excellent' | 'Great Choice' | 'Top Value' =
    dropScore >= 9.1 ? 'Top Value' : dropScore >= 8.8 ? 'Excellent' : 'Great Choice';

  const bdStockBase = Math.round(productPriceBdt * 1.09);
  const bdStockTotal = bdStockBase + 160 + importDutyBdt + vatBdt;

  const expressBase = Math.round(productPriceBdt * 1.12);
  const expressTotal = expressBase + shippingBdt + 420 + importDutyBdt + vatBdt;

  const shortDesc =
    description.length > 68 ? `${description.slice(0, 65).trim()}...` : description;

  return {
    id,
    name: title,
    nameBn: title,
    subtitle: `${brand} · ${shortDesc}`,
    category,
    image,
    gallery: gallery && gallery.length > 0 ? gallery : [image],
    hsCode: CATEGORY_HS_CODES[category] || '8517.62.00',
    corridorTag: hub.corridorTag,
    originLabel: hub.originLabel,
    verifiedSupplier: true,
    supplierName: brand && brand !== 'Global Direct' ? `${brand} Official Hub` : hub.supplier,
    supplierFollowers: `${(4.2 + (seedIndex % 15) * 1.1).toFixed(1)}k`,
    supplierProductsCount: `${180 + (seedIndex % 9) * 65}`,
    rating: Number(rating.toFixed(1)),
    reviewCount,
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
    arrivesThisWeek: seedIndex % 2 === 0,
    inStock: true,
    colors: [
      { name: 'Standard Edition', hex: '#0F172A' },
      { name: 'Silver / Pearl', hex: '#94A3B8' },
      { name: 'Emerald Tint', hex: '#059669' },
    ],
    sizes: category === 'fashion' ? ['39', '40', '41', '42', '43'] : undefined,
    highlights:
      tags.length >= 2
        ? tags.slice(0, 4).map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        : ['Customs Pre-Cleared', 'Verified Supplier', '30-Day Dhaka Return'],
    specs: {
      display: `${brand} Authentic Export Grade`,
      battery: category === 'electronics' ? 'High-Capacity Rechargeable' : undefined,
      waterproof: 'Export Protective Packaging',
      heartRate: category === 'beauty_health' ? 'Dermatologist Tested' : undefined,
      gps: 'Real-Time Air Tracking Included',
      weight: `${weightGrams}g parcel weight`,
      warranty,
    },
    routes: [
      {
        id: `${id}-route-direct`,
        name: 'Global Direct',
        badge: 'Lowest Cost',
        originCountry: hub.warehouse,
        basePriceBdt: productPriceBdt,
        shippingBdt,
        dutyBdt: importDutyBdt,
        vatBdt,
        totalLandedBdt,
        deliveryDays: '9–14 days',
        rating: Number(rating.toFixed(1)),
        reliabilityScore: dropScore,
        verified: true,
        onTimeRate: '97.4%',
        returnRate: '1.8%',
        responseTime: '< 4h',
      },
      {
        id: `${id}-route-bd`,
        name: 'Bangladesh Stock',
        badge: 'Fast Local',
        originCountry: 'Dhaka Ready Hub',
        basePriceBdt: bdStockBase,
        shippingBdt: 160,
        dutyBdt: importDutyBdt,
        vatBdt,
        totalLandedBdt: bdStockTotal,
        deliveryDays: '3–6 days',
        rating: Number(Math.min(4.9, rating + 0.1).toFixed(1)),
        reliabilityScore: Number(Math.min(9.8, dropScore + 0.2).toFixed(1)),
        verified: true,
        onTimeRate: '98.9%',
        returnRate: '1.2%',
        responseTime: '< 2h',
      },
      {
        id: `${id}-route-air`,
        name: 'Priority Air Express',
        badge: 'Express Charter',
        originCountry: 'Singapore Air Hub',
        basePriceBdt: expressBase,
        shippingBdt: shippingBdt + 420,
        dutyBdt: importDutyBdt,
        vatBdt,
        totalLandedBdt: expressTotal,
        deliveryDays: '4–7 days',
        rating: 4.9,
        reliabilityScore: 9.6,
        verified: true,
        onTimeRate: '99.4%',
        returnRate: '0.9%',
        responseTime: '< 1h',
      },
    ],
    priceHistory: {
      '7D': [
        { dateLabel: 'Oct 2', priceBdt: Math.round(totalLandedBdt * 1.06) },
        { dateLabel: 'Oct 3', priceBdt: Math.round(totalLandedBdt * 1.05) },
        { dateLabel: 'Oct 4', priceBdt: Math.round(totalLandedBdt * 1.03) },
        { dateLabel: 'Oct 5', priceBdt: Math.round(totalLandedBdt * 1.02) },
        { dateLabel: 'Oct 6', priceBdt: Math.round(totalLandedBdt * 1.01) },
        { dateLabel: 'Oct 7', priceBdt: totalLandedBdt },
        { dateLabel: 'Today', priceBdt: totalLandedBdt },
      ],
      '30D': [
        { dateLabel: 'Sep 10', priceBdt: originalLandedBdt },
        { dateLabel: 'Sep 15', priceBdt: Math.round(totalLandedBdt * 1.11) },
        { dateLabel: 'Sep 20', priceBdt: Math.round(totalLandedBdt * 1.07) },
        { dateLabel: 'Sep 25', priceBdt: lowest30dBdt },
        { dateLabel: 'Sep 30', priceBdt: Math.round(totalLandedBdt * 1.03) },
        { dateLabel: 'Oct 4', priceBdt: Math.round(totalLandedBdt * 1.01) },
        { dateLabel: 'Today', priceBdt: totalLandedBdt },
      ],
      '90D': [
        { dateLabel: 'Jul', priceBdt: Math.round(originalLandedBdt * 1.05) },
        { dateLabel: 'Aug 1', priceBdt: originalLandedBdt },
        { dateLabel: 'Aug 15', priceBdt: Math.round(totalLandedBdt * 1.09) },
        { dateLabel: 'Sep 1', priceBdt: Math.round(totalLandedBdt * 1.06) },
        { dateLabel: 'Sep 15', priceBdt: lowest30dBdt },
        { dateLabel: 'Oct 1', priceBdt: Math.round(totalLandedBdt * 1.02) },
        { dateLabel: 'Today', priceBdt: totalLandedBdt },
      ],
      '1Y': [
        { dateLabel: 'Jan', priceBdt: Math.round(originalLandedBdt * 1.12) },
        { dateLabel: 'Mar', priceBdt: Math.round(originalLandedBdt * 1.08) },
        { dateLabel: 'May', priceBdt: originalLandedBdt },
        { dateLabel: 'Jul', priceBdt: Math.round(totalLandedBdt * 1.07) },
        { dateLabel: 'Aug', priceBdt: Math.round(totalLandedBdt * 1.04) },
        { dateLabel: 'Sep', priceBdt: lowest30dBdt },
        { dateLabel: 'Today', priceBdt: totalLandedBdt },
      ],
    },
    reviews:
      rawReviews.length > 0
        ? rawReviews.map((r, idx) => ({
            id: `${id}-rev-${idx}`,
            author: r.author,
            verified: true,
            rating: r.rating,
            date: r.date,
            comment: r.comment,
            variantChosen: 'Global Direct · Customs Pre-Cleared',
          }))
        : [
            {
              id: `${id}-rev-default`,
              author: 'Tanvir R.',
              verified: true,
              rating: 5,
              date: '3 days ago',
              comment:
                'Delivered to Dhaka in 8 days with zero extra customs fee. Authentic quality.',
              variantChosen: 'Standard Edition',
            },
          ],
  };
}

function normalizeDummyJsonItem(item: DummyJsonProduct, seedIndex: number): Product | null {
  if (!item || !item.title) return null;
  if ((item.category || '').toLowerCase().includes('groceries')) {
    return null;
  }
  const primaryImage =
    sanitizeImageUrl(item.thumbnail) ||
    (Array.isArray(item.images)
      ? item.images.map(sanitizeImageUrl).find((u): u is string => Boolean(u)) || null
      : null);

  if (!primaryImage) return null;

  const rawGallery = Array.isArray(item.images)
    ? Array.from(
        new Set(
          [primaryImage, ...item.images.map(sanitizeImageUrl)].filter(
            (u): u is string => Boolean(u)
          )
        )
      ).slice(0, 4)
    : [primaryImage];

  const category = mapExternalCategory(item.category || '', item.title || '');
  const reviews = Array.isArray(item.reviews)
    ? item.reviews.slice(0, 3).map((rv) => ({
        author: rv.reviewerName || 'Verified Buyer',
        rating: rv.rating || 5,
        comment:
          rv.comment ||
          'Fast delivery to Bangladesh with exact landed cost as shown.',
        date: 'Verified Purchase',
      }))
    : [];

  return buildNormalizedProduct({
    id: `api-dj-${item.id}`,
    title: item.title,
    description: item.description || 'Verified cross-border export product.',
    category,
    usdPrice: Number(item.price) || 19.99,
    discountPercent: Number(item.discountPercentage) || 12,
    rating: Number(item.rating) || 4.6,
    reviewCount: 45 + ((item.id * 17) % 420),
    image: primaryImage,
    gallery: rawGallery,
    brand: item.brand || 'Global Direct',
    weightGrams: Math.max(120, Math.round((item.weight || 4) * 110)),
    warranty:
      item.warrantyInformation ||
      'Up to 30 days return · 1 year local warranty',
    tags: Array.isArray(item.tags) ? item.tags : [item.category],
    rawReviews: reviews,
    seedIndex,
  });
}

function normalizeEscuelaItem(item: EscuelaProduct, seedIndex: number): Product | null {
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
    description:
      item.description && item.description.length > 12
        ? item.description
        : 'Verified cross-border factory export with customs pre-clearance.',
    category,
    usdPrice: Number(item.price) || 29.0,
    discountPercent: 10 + (item.id % 18),
    rating: Number((4.4 + ((item.id % 6) * 0.1)).toFixed(1)),
    reviewCount: 32 + ((item.id * 13) % 240),
    image: validImages[0],
    gallery: validImages.slice(0, 4),
    brand: categoryName ? `${categoryName} Direct` : 'Global Direct',
    weightGrams: 280 + ((item.id * 25) % 650),
    warranty: 'Up to 30 days return · 1 year local warranty',
    tags: [categoryName || 'Export Direct', 'Customs Pre-Cleared'],
    rawReviews: [],
    seedIndex,
  });
}

export async function fetchGlobalCatalogFromApi(forceRefresh = false): Promise<Product[]> {
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

  // Fetch concurrently from 3 free public no-key product APIs:
  // 1. DummyJSON (all 194 products)
  // 2. FakeStoreAPI (20 products)
  // 3. Platzi Fake Store API (first 36 products)
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
          description: item.description || 'Verified global export item.',
          category,
          usdPrice: Number(item.price) || 24.99,
          discountPercent: 15,
          rating: Number(item.rating?.rate) || 4.6,
          reviewCount: Number(item.rating?.count) || 120,
          image: cleanImg,
          brand: 'Global Direct',
          weightGrams: 380,
          warranty: 'Up to 30 days return · 1 year local warranty',
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
      sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(combinedProducts));
    } catch {
      // ignore storage quota
    }
  }

  return combinedProducts;
}

/**
 * Fetches incremental live batches from free APIs for continuous background polling
 * and infinite scroll pagination.
 */
export async function fetchContinuousProductBatch(batchCursor: number): Promise<Product[]> {
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
