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

const SESSION_CACHE_KEY = 'deshimart_api_catalog_v3';

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

function mapExternalCategory(rawCategory: string, title = ''): CategoryId {
  const cat = rawCategory.toLowerCase();
  const t = title.toLowerCase();

  if (
    cat.includes('smartphones') ||
    cat.includes('laptops') ||
    cat.includes('tablets') ||
    cat.includes('mobile-accessories') ||
    cat.includes('electronics')
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
    cat.includes('clothing')
  ) {
    return 'fashion';
  }

  if (
    cat.includes('furniture') ||
    cat.includes('home-decoration') ||
    cat.includes('kitchen')
  ) {
    return 'home_living';
  }

  if (
    cat.includes('beauty') ||
    cat.includes('fragrances') ||
    cat.includes('skin-care')
  ) {
    return 'beauty_health';
  }

  if (cat.includes('sports')) {
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

  if (cat.includes('motorcycle') || cat.includes('vehicle') || cat.includes('automotive')) {
    return 'automotive';
  }

  return 'toys_games';
}

const ORIGIN_HUBS = [
  { originLabel: 'China · Verified Factory', corridorTag: 'Shenzhen Air', warehouse: 'Shenzhen Export Hub', supplier: 'Shenzhen Direct Co.' },
  { originLabel: 'South Korea · Official Hub', corridorTag: 'Seoul Direct', warehouse: 'Incheon Air Hub', supplier: 'Seoul Global Trade' },
  { originLabel: 'Singapore · Regional Hub', corridorTag: 'Singapore Hub', warehouse: 'Changi Logistics Hub', supplier: 'SingaPort Direct' },
  { originLabel: 'Japan · Inspected Exporter', corridorTag: 'Tokyo Air', warehouse: 'Tokyo Narita Hub', supplier: 'Nihon Craft Exports' },
  { originLabel: 'Malaysia · Direct Hub', corridorTag: 'KL Express', warehouse: 'Kuala Lumpur Air Hub', supplier: 'Malay Global Hub' },
];

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

  // Fetch all 194 products from DummyJSON + 20 products from FakeStoreAPI concurrently
  const [dummyResult, fakeStoreResult] = await Promise.allSettled([
    fetch('https://dummyjson.com/products?limit=0').then((r) =>
      r.ok ? (r.json() as Promise<{ products?: DummyJsonProduct[] }>) : null
    ),
    fetch('https://fakestoreapi.com/products').then((r) =>
      r.ok ? (r.json() as Promise<FakeStoreProduct[]>) : null
    ),
  ]);

  const combinedProducts: Product[] = [];

  if (dummyResult.status === 'fulfilled' && dummyResult.value?.products) {
    dummyResult.value.products.forEach((item, idx) => {
      if ((item.category || '').toLowerCase().includes('groceries')) {
        return;
      }
      const category = mapExternalCategory(item.category || '', item.title || '');
      const primaryImage =
        item.thumbnail || (Array.isArray(item.images) && item.images[0]) || '';
      const rawGallery = Array.isArray(item.images)
        ? Array.from(new Set([primaryImage, ...item.images].filter(Boolean))).slice(0, 4)
        : [primaryImage];

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

      combinedProducts.push(
        buildNormalizedProduct({
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
          seedIndex: idx,
        })
      );
    });
  }

  if (fakeStoreResult.status === 'fulfilled' && Array.isArray(fakeStoreResult.value)) {
    fakeStoreResult.value.forEach((item, idx) => {
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
          image: item.image,
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

  if (combinedProducts.length > 0) {
    try {
      sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(combinedProducts));
    } catch {
      // ignore storage quota
    }
  }

  return combinedProducts;
}
