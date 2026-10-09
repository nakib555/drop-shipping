import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  CATALOG_PRODUCTS,
  INITIAL_ADDRESSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
} from '../data/catalogData';
import {
  fetchContinuousProductBatch,
  fetchGlobalCatalogFromApi,
  searchFreeProductApis,
} from '../services/productApi';
import {
  AppNotification,
  CartItem,
  CategoryId,
  CurrencyCode,
  LanguageCode,
  Order,
  PaymentMethodId,
  Product,
  PromoVoucher,
  ScreenId,
  ShippingAddress,
  ShippingMethodId,
  UserRole,
} from '../types/deshimart';

export interface SmartFiltersState {
  under2000Bdt: boolean;
  arrivesThisWeek: boolean;
  lowestLandedCost: boolean;
  verifiedOnly: boolean;
  inStockOnly: boolean;
  dealsOnly: boolean;
  maxPriceBdt: number;
  selectedBrand: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info';
}

interface DeshiMartContextValue {
  // Navigation
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId, options?: { productId?: string; categoryId?: CategoryId; orderId?: string }) => void;
  goBack: () => void;

  // User & Auth (Multi-Role RBAC: customer | admin)
  user: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    memberTier: string;
    memberSince: string;
    isLoggedIn: boolean;
  };
  loginUser: (emailOrPhone: string, fullName?: string, role?: UserRole) => void;
  switchUserRole: (role: UserRole) => void;
  updateUserProfile: (data: { fullName: string; email: string; phone: string }) => void;
  logoutUser: () => void;

  // Admin Operations & Merchandising
  promoVouchers: PromoVoucher[];
  createPromoVoucher: (voucher: PromoVoucher) => void;
  togglePromoVoucher: (code: string) => void;
  adminAddProduct: (input: {
    name: string;
    nameBn?: string;
    subtitle: string;
    category: CategoryId;
    image: string;
    originLabel: string;
    supplierName: string;
    hsCode: string;
    productPriceBdt: number;
    shippingBdt: number;
    discountPercent?: number;
    inStock: boolean;
  }) => void;
  adminUpdateProduct: (
    productId: string,
    updates: Partial<
      Pick<
        Product,
        | 'name'
        | 'productPriceBdt'
        | 'shippingBdt'
        | 'importDutyBdt'
        | 'vatBdt'
        | 'totalLandedBdt'
        | 'inStock'
        | 'verifiedSupplier'
        | 'arrivesThisWeek'
      >
    >
  ) => void;
  adminDeleteProduct: (productId: string) => void;
  adminAdvanceOrderStatus: (orderId: string) => void;
  adminBroadcastNotification: (
    title: string,
    body: string,
    type: AppNotification['type']
  ) => void;

  // Preferences
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
  formatPrice: (bdtAmount: number) => string;

  // Catalog & Discovery
  products: Product[];
  isLoadingProducts: boolean;
  refreshCatalogFromApi: () => Promise<void>;
  fetchMoreFromApi: () => Promise<number>;
  selectedProductId: string;
  selectedProduct: Product;
  addProductReview: (productId: string, rating: number, comment: string) => void;
  selectedCategoryId: CategoryId;
  setSelectedCategoryId: (cat: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  smartFilters: SmartFiltersState;
  setSmartFilters: React.Dispatch<React.SetStateAction<SmartFiltersState>>;
  resetSmartFilters: () => void;

  // Product Intelligence (Route & Price Alerts)
  selectedRouteByProduct: Record<string, string>;
  selectRouteForProduct: (productId: string, routeId: string) => void;
  priceAlerts: Record<string, boolean>;
  togglePriceAlert: (productId: string) => void;
  compareProductIds: [string, string];
  setCompareProductIds: React.Dispatch<React.SetStateAction<[string, string]>>;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number, color?: string, size?: string, routeId?: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  consolidateParcel: boolean;
  setConsolidateParcel: (v: boolean) => void;
  promoCode: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  recentlyViewedIds: string[];
  cartTotals: {
    baseItemsBdt: number;
    freightBdt: number;
    dutyAndVatBdt: number;
    consolidationSavingsBdt: number;
    promoDiscountBdt: number;
    subtotalBdt: number;
    shippingBdt: number;
    totalBdt: number;
  };
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Checkout & Orders
  addresses: ShippingAddress[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  addAddress: (addr: Omit<ShippingAddress, 'id'>) => void;
  updateAddress: (id: string, addr: Partial<Omit<ShippingAddress, 'id'>>) => void;
  deleteAddress: (id: string) => void;
  shippingMethod: ShippingMethodId;
  setShippingMethod: (m: ShippingMethodId) => void;
  paymentMethod: PaymentMethodId;
  setPaymentMethod: (p: PaymentMethodId) => void;
  checkoutDraft: {
    deliveryNote: string;
    bkashPhone: string;
    nagadPhone: string;
    cardHolder: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvv: string;
  };
  setCheckoutDraft: React.Dispatch<
    React.SetStateAction<{
      deliveryNote: string;
      bkashPhone: string;
      nagadPhone: string;
      cardHolder: string;
      cardNumber: string;
      cardExpiry: string;
      cardCvv: string;
    }>
  >;
  orders: Order[];
  selectedOrderId: string;
  selectedOrder: Order;
  placeOrder: () => Order;

  // Notifications & Toasts
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearReadNotifications: () => void;
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info') => void;
}

const DEFAULT_FILTERS: SmartFiltersState = {
  under2000Bdt: false,
  arrivesThisWeek: false,
  lowestLandedCost: false,
  verifiedOnly: false,
  inStockOnly: true,
  dealsOnly: false,
  maxPriceBdt: 250000,
  selectedBrand: 'All',
};

const DeshiMartContext = createContext<DeshiMartContextValue | undefined>(undefined);

const BDT_PER_USD = 120;

export function formatLandedPrice(amount: number): string {
  // Uses non-breaking space after Bengali Taka symbol and en-IN grouping
  return `৳\u00A0${Math.round(amount).toLocaleString('en-IN')}`;
}

const INITIAL_PROMO_VOUCHERS: PromoVoucher[] = [
  {
    code: 'DESHI10',
    discountType: 'percent',
    value: 10,
    minOrderBdt: 1000,
    maxDiscountBdt: 1500,
    description: '10% off total landed cost (up to ৳ 1,500)',
    active: true,
  },
  {
    code: 'FIRST500',
    discountType: 'flat',
    value: 500,
    minOrderBdt: 2500,
    description: 'Flat ৳ 500 off cross-border orders above ৳ 2,500',
    active: true,
  },
  {
    code: 'BKASHCB',
    discountType: 'percent',
    value: 5,
    minOrderBdt: 1500,
    maxDiscountBdt: 1000,
    description: '5% instant bKash escrow cashback (up to ৳ 1,000)',
    active: true,
  },
];

export const DeshiMartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>(['splash']);

  const [user, setUser] = useState<{
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    memberTier: string;
    memberSince: string;
    isLoggedIn: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('deshimart_user_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      fullName: 'Tanvir Ahmed',
      email: 'tanvir.ahmed@deshimart.bd',
      phone: '+880 1712 345678',
      role: 'customer',
      memberTier: 'Gold Global Importer',
      memberSince: 'March 2025',
      isLoggedIn: true,
    };
  });

  const [promoVouchers, setPromoVouchers] = useState<PromoVoucher[]>(() => {
    try {
      const saved = localStorage.getItem('deshimart_vouchers_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PROMO_VOUCHERS;
  });

  const [currency, setCurrency] = useState<CurrencyCode>('BDT');
  const [language, setLanguage] = useState<LanguageCode>('EN');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [catalogProducts, setCatalogProducts] = useState<Product[]>(CATALOG_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [selectedProductId, setSelectedProductId] = useState<string>(CATALOG_PRODUCTS[0].id);
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [smartFilters, setSmartFilters] = useState<SmartFiltersState>(DEFAULT_FILTERS);
  const batchCursorRef = useRef<number>(1);
  const isFetchingBatchRef = useRef<boolean>(false);

  const mergeProductsIntoCatalog = useCallback((incoming: Product[]) => {
    if (!incoming || incoming.length === 0) return;
    setCatalogProducts((prev) => {
      const map = new Map<string, Product>();
      prev.forEach((p) => map.set(p.id, p));
      incoming.forEach((item) => {
        if (!map.has(item.id)) {
          map.set(item.id, item);
        }
      });
      return Array.from(map.values());
    });
  }, []);

  const loadApiCatalog = useCallback(
    async (notify = false) => {
      setIsLoadingProducts(true);
      try {
        const apiItems = await fetchGlobalCatalogFromApi(notify);
        if (apiItems.length > 0) {
          mergeProductsIntoCatalog(apiItems);
          if (notify) {
            showToast(`Synced ${apiItems.length} global products from free APIs`);
          }
        }
      } finally {
        setIsLoadingProducts(false);
      }
    },
    [mergeProductsIntoCatalog]
  );

  const fetchMoreFromApi = useCallback(async (): Promise<number> => {
    if (isFetchingBatchRef.current) return 0;
    isFetchingBatchRef.current = true;
    try {
      const nextCursor = batchCursorRef.current;
      batchCursorRef.current += 1;
      const batch = await fetchContinuousProductBatch(nextCursor);
      if (batch.length > 0) {
        mergeProductsIntoCatalog(batch);
      }
      return batch.length;
    } finally {
      isFetchingBatchRef.current = false;
    }
  }, [mergeProductsIntoCatalog]);

  // Initial multi-source free API fetch on mount
  useEffect(() => {
    loadApiCatalog(false);
  }, [loadApiCatalog]);

  // Continuous background polling from free APIs every 45 seconds while tab is visible
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
        return;
      }
      void fetchMoreFromApi();
    }, 45000);

    return () => window.clearInterval(intervalId);
  }, [fetchMoreFromApi]);

  // Live remote search supplementation when user types a search query
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) return;

    const timer = window.setTimeout(async () => {
      const remoteMatches = await searchFreeProductApis(q);
      if (remoteMatches.length > 0) {
        mergeProductsIntoCatalog(remoteMatches);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchQuery, mergeProductsIntoCatalog]);

  const [selectedRouteByProduct, setSelectedRouteByProduct] = useState<Record<string, string>>({
    'prod-smartwatch-pro': 'route-global-direct',
    'prod-wireless-earbuds': 'route-earbuds-direct',
    'prod-hp-victus-laptop': 'route-laptop-direct',
    'prod-running-shoes-pro': 'route-shoes-direct',
    'prod-urban-backpack': 'route-bag-direct',
    'prod-phone-stand': 'route-stand-direct',
    'prod-bluetooth-speaker': 'route-speaker-direct',
    'prod-wireless-headphones': 'route-hp-direct',
  });

  const [priceAlerts, setPriceAlerts] = useState<Record<string, boolean>>({
    'prod-smartwatch-pro': true,
    'prod-hp-victus-laptop': true,
  });

  const [compareProductIds, setCompareProductIds] = useState<[string, string]>([
    'prod-smartwatch-pro',
    'prod-wireless-earbuds',
  ]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('deshimart_cart_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return [
      {
        productId: 'prod-smartwatch-pro',
        quantity: 1,
        selectedColor: 'Obsidian Black',
        selectedRouteId: 'route-global-direct',
      },
      {
        productId: 'prod-wireless-earbuds',
        quantity: 1,
        selectedColor: 'Pearl White',
        selectedRouteId: 'route-earbuds-direct',
      },
      {
        productId: 'prod-urban-backpack',
        quantity: 1,
        selectedColor: 'Charcoal Grey',
        selectedRouteId: 'route-bag-direct',
      },
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deshimart_wishlist_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['prod-wireless-earbuds', 'prod-smartwatch-pro', 'prod-urban-backpack', 'prod-phone-stand'];
  });

  const [addresses, setAddresses] = useState<ShippingAddress[]>(INITIAL_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(INITIAL_ADDRESSES[0].id);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cod');
  const [checkoutDraft, setCheckoutDraft] = useState<{
    deliveryNote: string;
    bkashPhone: string;
    nagadPhone: string;
    cardHolder: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvv: string;
  }>({
    deliveryNote: 'Call upon arrival at gate',
    bkashPhone: '01712345678',
    nagadPhone: '01819345678',
    cardHolder: 'Tanvir Ahmed',
    cardNumber: '4532 8910 2345 8910',
    cardExpiry: '12/28',
    cardCvv: '428',
  });

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(INITIAL_ORDERS[0].id);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [consolidateParcel, setConsolidateParcel] = useState<boolean>(true);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([
    'prod-wireless-earbuds',
    'prod-smartwatch-pro',
    'prod-urban-backpack',
  ]);

  useEffect(() => {
    try {
      localStorage.setItem('deshimart_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('deshimart_wishlist_v1', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('deshimart_user_v2', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('deshimart_vouchers_v1', JSON.stringify(promoVouchers));
    } catch {
      // ignore
    }
  }, [promoVouchers]);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-2), { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  };

  const currentScreen = screenHistory[screenHistory.length - 1] || 'home';

  const navigateTo = (
    screen: ScreenId,
    options?: { productId?: string; categoryId?: CategoryId; orderId?: string }
  ) => {
    if (options?.productId) {
      const pid = options.productId;
      setSelectedProductId(pid);
      setRecentlyViewedIds((prev) => [
        pid,
        ...prev.filter((id) => id !== pid),
      ].slice(0, 10));
    }
    if (options?.categoryId) setSelectedCategoryId(options.categoryId);
    if (options?.orderId) setSelectedOrderId(options.orderId);
    setScreenHistory((prev) => {
      if (prev[prev.length - 1] === screen) return prev;
      return [...prev, screen];
    });
  };

  const goBack = () => {
    setScreenHistory((prev) => {
      if (prev.length <= 1) return ['home'];
      return prev.slice(0, -1);
    });
  };

  const formatPrice = (bdtAmount: number): string => {
    if (currency === 'USD') {
      const usd = bdtAmount / BDT_PER_USD;
      return `$\u00A0${usd.toFixed(2)}`;
    }
    return formatLandedPrice(bdtAmount);
  };

  const selectedProduct = useMemo(
    () => catalogProducts.find((p) => p.id === selectedProductId) || catalogProducts[0],
    [catalogProducts, selectedProductId]
  );

  const addProductReview = (productId: string, rating: number, comment: string) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      author: user.fullName || 'Verified Buyer',
      verified: true,
      rating,
      date: 'Just now',
      comment,
      variantChosen: 'Verified Landed Order',
    };
    setCatalogProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              reviewCount: p.reviewCount + 1,
              reviews: [newRev, ...p.reviews],
            }
          : p
      )
    );
    showToast('Review submitted! Thank you for helping shoppers.');
  };

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || orders[0],
    [orders, selectedOrderId]
  );

  const selectRouteForProduct = (productId: string, routeId: string) => {
    setSelectedRouteByProduct((prev) => ({ ...prev, [productId]: routeId }));
    showToast('Updated shipping route & landed price');
  };

  const togglePriceAlert = (productId: string) => {
    const prod = catalogProducts.find((p) => p.id === productId);
    setPriceAlerts((prev) => {
      const next = !prev[productId];
      showToast(next ? '30-Day Price Drop Alert activated!' : 'Price Drop Alert paused', 'info');
      if (next && prod) {
        const alertNotif: AppNotification = {
          id: `notif-alert-${Date.now()}`,
          type: 'price_drop',
          title: `Price Radar Active: ${prod.name}`,
          body: `Tracking 30-day landed cost (${formatPrice(prod.totalLandedBdt)}). You will be alerted immediately on any supplier or duty drop.`,
          timestamp: 'Just now',
          read: false,
          targetScreen: 'price_tracker',
          targetProductId: prod.id,
        };
        setNotifications((nPrev) => [alertNotif, ...nPrev]);
      }
      return { ...prev, [productId]: next };
    });
  };

  const addToCart = (
    productId: string,
    quantity = 1,
    color?: string,
    size?: string,
    routeId?: string
  ) => {
    const product = catalogProducts.find((p) => p.id === productId);
    if (!product) return;
    const chosenColor = color || product.colors[0]?.name || 'Standard';
    const chosenRoute =
      routeId || selectedRouteByProduct[productId] || product.routes[0]?.id || 'default';

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === productId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          selectedColor: chosenColor,
          selectedSize: size || updated[existingIndex].selectedSize,
          selectedRouteId: chosenRoute,
        };
        return updated;
      }
      return [
        ...prev,
        {
          productId,
          quantity,
          selectedColor: chosenColor,
          selectedSize: size,
          selectedRouteId: chosenRoute,
        },
      ];
    });
    showToast(`${product.name} added to cart`);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const applyPromoCode = (rawCode: string): boolean => {
    const normalized = rawCode.trim().toUpperCase();
    if (!normalized) return false;
    const matched = promoVouchers.find(
      (v) => v.code.toUpperCase() === normalized && v.active
    );
    if (matched) {
      setPromoCode(matched.code);
      showToast(`Promo code ${matched.code} applied!`);
      return true;
    }
    const activeCodes = promoVouchers
      .filter((v) => v.active)
      .map((v) => v.code)
      .join(', ');
    showToast(`Invalid or inactive code. Try: ${activeCodes || 'DESHI10'}`, 'info');
    return false;
  };

  const removePromoCode = () => {
    setPromoCode(null);
    showToast('Promo code removed', 'info');
  };

  const cartTotals = useMemo(() => {
    let baseItemsBdt = 0;
    let freightBdt = 0;
    let dutyAndVatBdt = 0;
    let rawLandedBdt = 0;

    for (const item of cart) {
      const prod = catalogProducts.find((p) => p.id === item.productId);
      if (!prod) continue;
      const route =
        prod.routes.find((r) => r.id === item.selectedRouteId) || prod.routes[0];
      const unitBase = route ? route.basePriceBdt : prod.productPriceBdt;
      const unitFreight = route ? route.shippingBdt : prod.shippingBdt;
      const unitDutyVat = route
        ? route.dutyBdt + route.vatBdt
        : prod.importDutyBdt + prod.vatBdt;
      const unitLanded = route ? route.totalLandedBdt : prod.totalLandedBdt;

      baseItemsBdt += unitBase * item.quantity;
      freightBdt += unitFreight * item.quantity;
      dutyAndVatBdt += unitDutyVat * item.quantity;
      rawLandedBdt += unitLanded * item.quantity;
    }

    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
    const consolidationSavingsBdt =
      consolidateParcel && totalQty >= 2 ? Math.round(freightBdt * 0.25) : 0;

    const afterConsolidationBdt = Math.max(
      0,
      rawLandedBdt - consolidationSavingsBdt
    );

    let promoDiscountBdt = 0;
    if (promoCode) {
      const matchedVoucher = promoVouchers.find(
        (v) => v.code.toUpperCase() === promoCode.toUpperCase() && v.active
      );
      if (matchedVoucher) {
        if (matchedVoucher.discountType === 'percent') {
          const rawDiscount = Math.round(
            afterConsolidationBdt * (matchedVoucher.value / 100)
          );
          promoDiscountBdt = matchedVoucher.maxDiscountBdt
            ? Math.min(matchedVoucher.maxDiscountBdt, rawDiscount)
            : rawDiscount;
        } else {
          promoDiscountBdt =
            afterConsolidationBdt >= matchedVoucher.minOrderBdt
              ? matchedVoucher.value
              : Math.round(matchedVoucher.value * 0.5);
        }
      }
    }

    const subtotalBdt = Math.max(0, afterConsolidationBdt - promoDiscountBdt);
    const shippingBdt =
      cart.length === 0
        ? 0
        : shippingMethod === 'express'
        ? 800
        : shippingMethod === 'hub_pickup'
        ? -150
        : 0;

    return {
      baseItemsBdt,
      freightBdt,
      dutyAndVatBdt,
      consolidationSavingsBdt,
      promoDiscountBdt,
      subtotalBdt,
      shippingBdt,
      totalBdt: Math.max(0, subtotalBdt + shippingBdt),
    };
  }, [cart, catalogProducts, consolidateParcel, promoCode, promoVouchers, shippingMethod]);

  const toggleWishlist = (productId: string) => {
    const prod = catalogProducts.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      showToast(
        exists
          ? `Removed ${prod?.name || 'item'} from Wishlist`
          : `Saved ${prod?.name || 'item'} to Wishlist`
      );
      return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  };

  const addAddress = (addr: Omit<ShippingAddress, 'id'>) => {
    const newId = `addr-${Date.now()}`;
    const created: ShippingAddress = { ...addr, id: newId };
    setAddresses((prev) => [...prev, created]);
    setSelectedAddressId(newId);
    showToast('Delivery address saved');
  };

  const updateAddress = (
    id: string,
    addrUpdates: Partial<Omit<ShippingAddress, 'id'>>
  ) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...addrUpdates } : a))
    );
    showToast('Delivery address updated');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      if (prev.length <= 1) {
        showToast('At least one address is required', 'info');
        return prev;
      }
      const next = prev.filter((a) => a.id !== id);
      if (selectedAddressId === id && next[0]) {
        setSelectedAddressId(next[0].id);
      }
      showToast('Address removed', 'info');
      return next;
    });
  };

  const updateUserProfile = (data: { fullName: string; email: string; phone: string }) => {
    setUser((prev) => ({ ...prev, ...data }));
    showToast('Profile updated successfully!');
  };

  const placeOrder = (): Order => {
    const chosenAddress =
      addresses.find((a) => a.id === selectedAddressId) || addresses[0];
    const newOrderId = `DM${Math.floor(123457 + Math.random() * 800000)}`;
    const orderItems = cart.map((item) => {
      const prod = catalogProducts.find((p) => p.id === item.productId) || catalogProducts[0];
      const route = prod.routes.find((r) => r.id === item.selectedRouteId) || prod.routes[0];
      return {
        productId: prod.id,
        name: prod.name,
        image: prod.image,
        quantity: item.quantity,
        variant: `${item.selectedColor}${item.selectedSize ? ` · Size ${item.selectedSize}` : ''} · ${route?.name || 'Global Direct'}`,
        landedUnitBdt: route ? route.totalLandedBdt : prod.totalLandedBdt,
      };
    });

    const newOrder: Order = {
      id: newOrderId,
      placedDate: 'Oct 10, 2026',
      estimatedDelivery:
        shippingMethod === 'express'
          ? '3 – 7 days'
          : shippingMethod === 'hub_pickup'
          ? '5 – 9 days (Dhaka Hub)'
          : '7 – 14 days',
      status: 'Processing',
      items: orderItems,
      subtotalBdt: cartTotals.subtotalBdt,
      shippingBdt: Math.max(0, cartTotals.shippingBdt),
      customsDutyBdt: cartTotals.dutyAndVatBdt,
      totalBdt: cartTotals.totalBdt,
      paymentMethod,
      shippingMethod,
      shippingAddress: chosenAddress,
      courierName:
        shippingMethod === 'hub_pickup'
          ? 'DeshiMart Banani Hub Pickup'
          : shippingMethod === 'express'
          ? 'DHL / Pathao Priority Air'
          : 'eCourier Bangladesh',
      trackingCode: `EC${Math.floor(1000000 + Math.random() * 8999999)}BD`,
      milestones: [
        {
          title: 'Order Confirmed & Customs Pre-Cleared',
          location: 'DeshiMart Global Hub',
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          title: 'Supplier Quality Check & Dispatch',
          location: 'Verified Supplier Warehouse',
          timestamp: 'Estimated within 12 hours',
          completed: false,
        },
        {
          title: 'International Air Freight & BD Customs',
          location: 'Hazrat Shahjalal Int. Airport, Dhaka',
          timestamp: 'In 3–5 days',
          completed: false,
        },
        {
          title: 'Doorstep Delivery via eCourier',
          location: chosenAddress.address,
          timestamp: shippingMethod === 'express' ? 'In 3–7 days' : 'In 7–14 days',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    setCart([]);
    const newOrderNotif: AppNotification = {
      id: `notif-order-${Date.now()}`,
      type: 'order',
      title: `Order #${newOrder.id} Confirmed`,
      body: `Customs pre-clearance initiated for ${orderItems.length} item(s). Delivering to ${chosenAddress.city} in ${newOrder.estimatedDelivery}.`,
      timestamp: 'Just now',
      read: false,
      targetScreen: 'order_tracking',
      targetOrderId: newOrder.id,
    };
    setNotifications((prev) => [newOrderNotif, ...prev]);
    showToast(`Order #${newOrder.id} placed successfully!`);
    return newOrder;
  };

  const loginUser = (
    emailOrPhone: string,
    fullName?: string,
    role?: UserRole
  ) => {
    const normalized = emailOrPhone.trim().toLowerCase();
    const detectedRole: UserRole =
      role ||
      (normalized.includes('admin') || normalized.includes('ops@')
        ? 'admin'
        : 'customer');
    const resolvedName =
      fullName ||
      (detectedRole === 'admin'
        ? 'Nakib Prince (Operations Admin)'
        : 'Tanvir Ahmed');
    const resolvedEmail = emailOrPhone.includes('@')
      ? emailOrPhone.trim()
      : detectedRole === 'admin'
      ? 'admin@deshimart.bd'
      : 'tanvir.ahmed@deshimart.bd';

    setUser({
      fullName: resolvedName,
      email: resolvedEmail,
      phone: emailOrPhone.includes('@')
        ? detectedRole === 'admin'
          ? '+880 1819 001122'
          : '+880 1712 345678'
        : emailOrPhone.trim(),
      role: detectedRole,
      memberTier:
        detectedRole === 'admin'
          ? 'Staff Operations Director'
          : 'Gold Global Importer',
      memberSince: detectedRole === 'admin' ? 'Jan 2024' : 'March 2025',
      isLoggedIn: true,
    });
    showToast(
      detectedRole === 'admin'
        ? `Signed in as Admin (${resolvedName})`
        : `Welcome back, ${resolvedName}!`
    );
    navigateTo(detectedRole === 'admin' ? 'admin_dashboard' : 'home');
  };

  const switchUserRole = (nextRole: UserRole) => {
    if (nextRole === 'admin') {
      setUser({
        fullName: 'Nakib Prince',
        email: 'admin@deshimart.bd',
        phone: '+880 1819 001122',
        role: 'admin',
        memberTier: 'Staff Operations Director',
        memberSince: 'Jan 2024',
        isLoggedIn: true,
      });
      showToast('Switched to Admin Operations Console');
      navigateTo('admin_dashboard');
    } else {
      setUser({
        fullName: 'Tanvir Ahmed',
        email: 'tanvir.ahmed@deshimart.bd',
        phone: '+880 1712 345678',
        role: 'customer',
        memberTier: 'Gold Global Importer',
        memberSince: 'March 2025',
        isLoggedIn: true,
      });
      showToast('Switched to Customer Shopping Account');
      navigateTo('account');
    }
  };

  const createPromoVoucher = (voucher: PromoVoucher) => {
    const code = voucher.code.trim().toUpperCase();
    if (!code) return;
    setPromoVouchers((prev) => [
      { ...voucher, code },
      ...prev.filter((v) => v.code.toUpperCase() !== code),
    ]);
    showToast(`Promo voucher ${code} published!`);
  };

  const togglePromoVoucher = (code: string) => {
    setPromoVouchers((prev) =>
      prev.map((v) =>
        v.code.toUpperCase() === code.toUpperCase()
          ? { ...v, active: !v.active }
          : v
      )
    );
    showToast(`Updated status for voucher ${code}`);
  };

  const adminAddProduct = (input: {
    name: string;
    nameBn?: string;
    subtitle: string;
    category: CategoryId;
    image: string;
    originLabel: string;
    supplierName: string;
    hsCode: string;
    productPriceBdt: number;
    shippingBdt: number;
    discountPercent?: number;
    inStock: boolean;
  }) => {
    const base = Math.max(100, Math.round(input.productPriceBdt));
    const ship = Math.max(0, Math.round(input.shippingBdt));
    const duty = Math.round(base * 0.1);
    const vat = Math.round((base + duty) * 0.15);
    const totalLanded = base + ship + duty + vat;
    const discountPct = input.discountPercent ?? 15;
    const origLanded = Math.round(totalLanded / (1 - discountPct / 100));
    const newId = `prod-custom-${Date.now()}`;

    const newProduct: Product = {
      id: newId,
      name: input.name.trim(),
      nameBn: input.nameBn?.trim() || input.name.trim(),
      subtitle: input.subtitle.trim() || 'Direct Factory Import · Duty & VAT Paid',
      category: input.category,
      image:
        input.image.trim() ||
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      hsCode: input.hsCode.trim() || '8517.62.00',
      corridorTag: `${input.originLabel} → Dhaka Air Hub`,
      originLabel: input.originLabel.trim() || 'Shenzhen, CN',
      verifiedSupplier: true,
      supplierName: input.supplierName.trim() || 'DeshiMart Global Direct',
      supplierFollowers: '14.2K',
      supplierProductsCount: '120+',
      rating: 4.9,
      reviewCount: 18,
      dropScore: 9.2,
      dropScoreLabel: 'Excellent',
      productPriceBdt: base,
      shippingBdt: ship,
      importDutyBdt: duty,
      vatBdt: vat,
      totalLandedBdt: totalLanded,
      originalLandedBdt: origLanded,
      discountPercent: discountPct,
      lowest30dBdt: Math.round(totalLanded * 0.96),
      arrivesThisWeek: true,
      inStock: input.inStock,
      colors: [
        { name: 'Obsidian Black', hex: '#0F172A' },
        { name: 'Titanium Silver', hex: '#94A3B8' },
      ],
      highlights: [
        '100% Customs Duty & 15% BD VAT Pre-Cleared',
        `Direct Air Freight from ${input.originLabel || 'Global Hub'}`,
        '1-Year Official DeshiMart Escrow Warranty',
      ],
      specs: {
        warranty: '1 Year Official BD Warranty',
        weight: '380g Packaged',
      },
      routes: [
        {
          id: `${newId}-direct`,
          name: 'Direct Air Express',
          badge: 'Best Landed Value',
          originCountry: input.originLabel || 'Shenzhen, CN',
          basePriceBdt: base,
          shippingBdt: ship,
          dutyBdt: duty,
          vatBdt: vat,
          totalLandedBdt: totalLanded,
          deliveryDays: '5–8 Days',
          rating: 4.9,
          reliabilityScore: 9.6,
          verified: true,
          onTimeRate: '99.1%',
          returnRate: '0.7%',
          responseTime: '< 1 hr',
        },
        {
          id: `${newId}-consolidated`,
          name: 'Consolidated Cargo Saver',
          badge: 'Lowest Freight',
          originCountry: input.originLabel || 'Shenzhen, CN',
          basePriceBdt: base,
          shippingBdt: Math.max(120, Math.round(ship * 0.65)),
          dutyBdt: duty,
          vatBdt: vat,
          totalLandedBdt:
            base + Math.max(120, Math.round(ship * 0.65)) + duty + vat,
          deliveryDays: '9–13 Days',
          rating: 4.8,
          reliabilityScore: 9.3,
          verified: true,
          onTimeRate: '97.8%',
          returnRate: '1.1%',
          responseTime: '< 2 hrs',
        },
      ],
      priceHistory: {
        '7D': [
          { dateLabel: '7d ago', priceBdt: origLanded },
          { dateLabel: '4d ago', priceBdt: Math.round((origLanded + totalLanded) / 2) },
          { dateLabel: 'Today', priceBdt: totalLanded },
        ],
        '30D': [
          { dateLabel: '30d ago', priceBdt: origLanded },
          { dateLabel: '15d ago', priceBdt: Math.round((origLanded + totalLanded) / 2) },
          { dateLabel: 'Today', priceBdt: totalLanded },
        ],
        '90D': [
          { dateLabel: '90d ago', priceBdt: origLanded },
          { dateLabel: '45d ago', priceBdt: Math.round((origLanded + totalLanded) / 2) },
          { dateLabel: 'Today', priceBdt: totalLanded },
        ],
        '1Y': [
          { dateLabel: '1y ago', priceBdt: origLanded },
          { dateLabel: '6m ago', priceBdt: Math.round((origLanded + totalLanded) / 2) },
          { dateLabel: 'Today', priceBdt: totalLanded },
        ],
      },
      reviews: [
        {
          id: `rev-init-${Date.now()}`,
          author: 'Verified Dhaka Importer',
          verified: true,
          rating: 5,
          date: 'Today',
          comment: 'Cleared Dhaka customs with zero extra charges. Authentic factory unit.',
          variantChosen: 'Direct Air Express',
        },
      ],
    };

    setCatalogProducts((prev) => [newProduct, ...prev]);
    setSelectedProductId(newProduct.id);
    showToast(`Added "${newProduct.name}" to Global Catalog!`);
  };

  const adminUpdateProduct = (
    productId: string,
    updates: Partial<
      Pick<
        Product,
        | 'name'
        | 'productPriceBdt'
        | 'shippingBdt'
        | 'importDutyBdt'
        | 'vatBdt'
        | 'totalLandedBdt'
        | 'inStock'
        | 'verifiedSupplier'
        | 'arrivesThisWeek'
      >
    >
  ) => {
    setCatalogProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const base =
          updates.productPriceBdt !== undefined
            ? Math.max(50, Math.round(updates.productPriceBdt))
            : p.productPriceBdt;
        const ship =
          updates.shippingBdt !== undefined
            ? Math.max(0, Math.round(updates.shippingBdt))
            : p.shippingBdt;
        const duty =
          updates.importDutyBdt !== undefined
            ? Math.round(updates.importDutyBdt)
            : Math.round(base * 0.1);
        const vat =
          updates.vatBdt !== undefined
            ? Math.round(updates.vatBdt)
            : Math.round((base + duty) * 0.15);
        const landed =
          updates.totalLandedBdt !== undefined
            ? Math.round(updates.totalLandedBdt)
            : base + ship + duty + vat;

        return {
          ...p,
          ...updates,
          productPriceBdt: base,
          shippingBdt: ship,
          importDutyBdt: duty,
          vatBdt: vat,
          totalLandedBdt: landed,
          routes: p.routes.map((r, idx) =>
            idx === 0
              ? {
                  ...r,
                  basePriceBdt: base,
                  shippingBdt: ship,
                  dutyBdt: duty,
                  vatBdt: vat,
                  totalLandedBdt: landed,
                }
              : r
          ),
        };
      })
    );
    showToast('Product pricing & inventory updated');
  };

  const adminDeleteProduct = (productId: string) => {
    setCatalogProducts((prev) => {
      if (prev.length <= 2) {
        showToast('Cannot delete last catalog items', 'info');
        return prev;
      }
      const target = prev.find((p) => p.id === productId);
      const next = prev.filter((p) => p.id !== productId);
      if (selectedProductId === productId && next[0]) {
        setSelectedProductId(next[0].id);
      }
      showToast(`Removed ${target?.name || 'product'} from catalog`, 'info');
      return next;
    });
  };

  const adminAdvanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const nextStatus: Order['status'] =
          ord.status === 'Processing'
            ? 'Shipped'
            : ord.status === 'Shipped'
            ? 'Delivered'
            : 'Delivered';

        const updatedMilestones = ord.milestones.map((m, idx) => {
          if (nextStatus === 'Shipped') {
            return {
              ...m,
              completed: idx <= 2,
              current: idx === 2,
              timestamp: idx === 2 ? 'Cleared Just Now · Dhaka Hub' : m.timestamp,
            };
          }
          return {
            ...m,
            completed: true,
            current: idx === ord.milestones.length - 1,
            timestamp:
              idx === ord.milestones.length - 1
                ? 'Delivered Just Now'
                : m.timestamp,
          };
        });

        const statusNotif: AppNotification = {
          id: `notif-admin-ord-${Date.now()}`,
          type: 'order',
          title: `Order #${ord.id} ${
            nextStatus === 'Shipped'
              ? 'Cleared Customs & Shipped'
              : 'Delivered to Doorstep'
          }`,
          body:
            nextStatus === 'Shipped'
              ? `Parcel #${ord.trackingCode} cleared Dhaka HS-Code customs and is in transit with ${ord.courierName}.`
              : `Parcel #${ord.trackingCode} was delivered to ${ord.shippingAddress.city}. Tax invoice is ready.`,
          timestamp: 'Just now',
          read: false,
          targetScreen: 'order_tracking',
          targetOrderId: ord.id,
        };
        setNotifications((nPrev) => [statusNotif, ...nPrev]);
        showToast(`Order #${ord.id} advanced to ${nextStatus}`);

        return {
          ...ord,
          status: nextStatus,
          milestones: updatedMilestones,
        };
      })
    );
  };

  const adminBroadcastNotification = (
    title: string,
    body: string,
    type: AppNotification['type']
  ) => {
    if (!title.trim() || !body.trim()) return;
    const newNotif: AppNotification = {
      id: `notif-broadcast-${Date.now()}`,
      type,
      title: title.trim(),
      body: body.trim(),
      timestamp: 'Just now',
      read: false,
      targetScreen: type === 'promo' ? 'cart' : 'home',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('Live alert broadcasted to all customers!');
  };

  const logoutUser = () => {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
    showToast('Signed out safely', 'info');
    navigateTo('auth');
  };

  const resetSmartFilters = () => {
    setSmartFilters(DEFAULT_FILTERS);
    showToast('Filters reset', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast('Notification removed', 'info');
  };

  const clearReadNotifications = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
    showToast('Cleared read notifications', 'info');
  };

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return (
    <DeshiMartContext.Provider
      value={{
        currentScreen,
        navigateTo,
        goBack,
        user,
        loginUser,
        switchUserRole,
        updateUserProfile,
        logoutUser,
        promoVouchers,
        createPromoVoucher,
        togglePromoVoucher,
        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        adminAdvanceOrderStatus,
        adminBroadcastNotification,
        currency,
        setCurrency,
        language,
        setLanguage,
        darkMode,
        setDarkMode,
        formatPrice,
        products: catalogProducts,
        isLoadingProducts,
        refreshCatalogFromApi: () => loadApiCatalog(true),
        fetchMoreFromApi,
        selectedProductId,
        selectedProduct,
        addProductReview,
        selectedCategoryId,
        setSelectedCategoryId,
        searchQuery,
        setSearchQuery,
        smartFilters,
        setSmartFilters,
        resetSmartFilters,
        selectedRouteByProduct,
        selectRouteForProduct,
        priceAlerts,
        togglePriceAlert,
        compareProductIds,
        setCompareProductIds,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        consolidateParcel,
        setConsolidateParcel,
        promoCode,
        applyPromoCode,
        removePromoCode,
        recentlyViewedIds,
        cartTotals,
        wishlist,
        toggleWishlist,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        shippingMethod,
        setShippingMethod,
        paymentMethod,
        setPaymentMethod,
        checkoutDraft,
        setCheckoutDraft,
        orders,
        selectedOrderId,
        selectedOrder,
        placeOrder,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearReadNotifications,
        toasts,
        showToast,
      }}
    >
      {children}
    </DeshiMartContext.Provider>
  );
};

export const useDeshiMart = (): DeshiMartContextValue => {
  const ctx = useContext(DeshiMartContext);
  if (!ctx) {
    throw new Error('useDeshiMart must be used within a DeshiMartProvider');
  }
  return ctx;
};
