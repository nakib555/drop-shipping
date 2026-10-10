import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchContinuousProductBatch,
  fetchGlobalCatalogFromApi,
  fetchLiveOperationalDataFromApis,
  searchFreeProductApis,
} from '../services/productApi';
import {
  AdminAuditEntry,
  calculateAuthoritativeCartQuote,
  calculateProductLandedQuote,
  CartOrderQuote,
  createSafePaymentToken,
  DEMO_FX_RATE_BDT_PER_USD,
  getOrRecordIdempotentOrder,
  PRICING_ENGINE_VERSION,
  readVersionedStorage,
  revalidateCartBeforeOrder,
  writeVersionedStorage,
} from '../services/pricingAndOrderEngine';
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

// Clean production DeshiMartContext — zero ExperienceMode state
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
  adminAuditLog: AdminAuditEntry[];
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
  isSearchingRemote: boolean;
  catalogSyncError: string | null;
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
  cartTotals: CartOrderQuote;
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
  placeOrder: (idempotencyKey?: string) => Order;

  // Notifications, Guides & Toasts
  notifications: AppNotification[];
  shoppingGuides: import('../types/deshimart').GuideArticle[];
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

const BDT_PER_USD = DEMO_FX_RATE_BDT_PER_USD;

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

export interface AppRouteHistoryEntry {
  screen: ScreenId;
  productId?: string;
  categoryId?: CategoryId;
  orderId?: string;
}

export const DeshiMartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routeStack, setRouteStack] = useState<AppRouteHistoryEntry[]>([
    { screen: 'splash' },
  ]);
  const screenHistory = useMemo(
    () => routeStack.map((entry) => entry.screen),
    [routeStack]
  );

  const [user, setUser] = useState<{
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    memberTier: string;
    memberSince: string;
    isLoggedIn: boolean;
  }>(() =>
    readVersionedStorage('deshimart_user_v2', {
      fullName: 'Tanvir Ahmed',
      email: 'tanvir.ahmed@deshimart.bd',
      phone: '+880 1712 345678',
      role: 'customer' as UserRole,
      memberTier: 'Gold Global Importer',
      memberSince: 'March 2025',
      isLoggedIn: true,
    })
  );

  const [promoVouchers, setPromoVouchers] = useState<PromoVoucher[]>(() =>
    readVersionedStorage('deshimart_vouchers_v1', INITIAL_PROMO_VOUCHERS)
  );

  const [adminAuditLog, setAdminAuditLog] = useState<AdminAuditEntry[]>([
    {
      id: 'audit-init-1',
      actorName: 'System Pricing Engine',
      actorRole: 'system',
      action: 'INIT_PRICING_RULES',
      targetId: PRICING_ENGINE_VERSION,
      summary: 'Loaded Bangladesh NBR HS-code tariff schedule & FX reference rate ($1 = ৳ 120)',
      timestamp: 'Today, 09:00 AM',
    },
  ]);

  const [currency, setCurrency] = useState<CurrencyCode>('BDT');
  const [language, setLanguage] = useState<LanguageCode>('EN');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [isSearchingRemote, setIsSearchingRemote] = useState<boolean>(false);
  const [catalogSyncError, setCatalogSyncError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [smartFilters, setSmartFilters] = useState<SmartFiltersState>(DEFAULT_FILTERS);
  const batchCursorRef = useRef<number>(1);
  const isFetchingBatchRef = useRef<boolean>(false);

  const [selectedRouteByProduct, setSelectedRouteByProduct] = useState<Record<string, string>>({});
  const [priceAlerts, setPriceAlerts] = useState<Record<string, boolean>>({});
  const [compareProductIds, setCompareProductIds] = useState<[string, string]>(['', '']);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = readVersionedStorage<CartItem[]>('deshimart_cart_v1', []);
    // Strip any legacy non-API product IDs
    return saved.filter((item) => item.productId.startsWith('api-') || item.productId.startsWith('prod-custom-'));
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = readVersionedStorage<string[]>('deshimart_wishlist_v1', []);
    return saved.filter((id) => id.startsWith('api-') || id.startsWith('prod-custom-'));
  });

  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cod');
  // PCI-Safe Checkout Draft: Never pre-populates or persists raw card PAN or CVV
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
    cardNumber: '•••• •••• •••• 8910',
    cardExpiry: '12/28',
    cardCvv: '',
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [shoppingGuides, setShoppingGuides] = useState<import('../types/deshimart').GuideArticle[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [consolidateParcel, setConsolidateParcel] = useState<boolean>(true);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

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
      setCatalogSyncError(null);
      try {
        const apiItems = await fetchGlobalCatalogFromApi(notify);
        if (apiItems.length > 0) {
          mergeProductsIntoCatalog(apiItems);
          setSelectedProductId((prev) =>
            prev && apiItems.some((p) => p.id === prev) ? prev : apiItems[0].id
          );
          setCompareProductIds((prev) => [
            prev[0] && apiItems.some((p) => p.id === prev[0])
              ? prev[0]
              : apiItems[0].id,
            prev[1] && apiItems.some((p) => p.id === prev[1])
              ? prev[1]
              : apiItems[1]?.id || apiItems[0].id,
          ]);
          setRecentlyViewedIds((prev) => {
            const valid = prev.filter((id) => apiItems.some((p) => p.id === id));
            return valid.length > 0
              ? valid
              : apiItems.slice(0, 4).map((p) => p.id);
          });

          // Fetch live operational data (Orders, Addresses, Notifications, Guides) from public APIs
          const liveOps = await fetchLiveOperationalDataFromApis(apiItems);
          setAddresses((prev) => (prev.length > 0 ? prev : liveOps.addresses));
          setSelectedAddressId((prev) =>
            prev || liveOps.addresses[0]?.id || ''
          );
          setOrders((prev) => (prev.length > 0 ? prev : liveOps.orders));
          setSelectedOrderId((prev) =>
            prev || liveOps.orders[0]?.id || ''
          );
          setNotifications((prev) =>
            prev.length > 0 ? prev : liveOps.notifications
          );
          setShoppingGuides(liveOps.guides);

          if (notify) {
            showToast(`Synced ${apiItems.length} live products & details from APIs`);
          }
        } else {
          setCatalogSyncError('Unable to reach live product APIs. Showing cached items.');
        }
      } catch {
        setCatalogSyncError('Network error while syncing live catalog.');
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

  // Initial multi-source free API fetch on mount + purge any legacy mode keys
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('deshimart_experience_mode');
        window.localStorage.removeItem('deshimart_experience_mode_v1');
        window.localStorage.removeItem('deshimart_cultural_vibe');
      }
    } catch {
      // Ignore storage access errors in restricted webviews
    }
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
    if (q.length < 2) {
      setIsSearchingRemote(false);
      return;
    }

    setIsSearchingRemote(true);
    const timer = window.setTimeout(async () => {
      try {
        const remoteMatches = await searchFreeProductApis(q);
        if (remoteMatches.length > 0) {
          mergeProductsIntoCatalog(remoteMatches);
        }
      } finally {
        setIsSearchingRemote(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchQuery, mergeProductsIntoCatalog]);

  useEffect(() => {
    writeVersionedStorage('deshimart_cart_v1', cart);
  }, [cart]);

  useEffect(() => {
    writeVersionedStorage('deshimart_wishlist_v1', wishlist);
  }, [wishlist]);

  useEffect(() => {
    // Persist user identity without trusting client-only privilege escalation on sensitive routes
    writeVersionedStorage('deshimart_user_v2', user);
  }, [user]);

  useEffect(() => {
    writeVersionedStorage('deshimart_vouchers_v1', promoVouchers);
  }, [promoVouchers]);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-2), { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  };

  const currentRoute = routeStack[routeStack.length - 1] || { screen: 'home' as ScreenId };
  const currentScreen = currentRoute.screen;

  const navigateTo = (
    screen: ScreenId,
    options?: { productId?: string; categoryId?: CategoryId; orderId?: string }
  ) => {
    // Route Guard 1: Protect Admin Console from unauthorized customer navigation
    if (screen === 'admin_dashboard' && user.role !== 'admin') {
      showToast('Admin authorization required to access Admin Console', 'info');
      return;
    }

    let nextProductId = selectedProductId;
    let nextCategoryId = selectedCategoryId;
    let nextOrderId = selectedOrderId;

    // Route Guard 2: Validate deep-linked productId against catalog
    if (options?.productId) {
      const pid = options.productId;
      const exists = catalogProducts.some((p) => p.id === pid);
      if (exists) {
        nextProductId = pid;
        setSelectedProductId(pid);
        setRecentlyViewedIds((prev) =>
          [pid, ...prev.filter((id) => id !== pid)].slice(0, 10)
        );
      } else {
        showToast('Requested product is no longer available', 'info');
      }
    }

    if (options?.categoryId) {
      nextCategoryId = options.categoryId;
      setSelectedCategoryId(options.categoryId);
    }

    // Route Guard 3: Validate deep-linked orderId against user's accessible orders
    if (options?.orderId) {
      const ordExists = orders.some((o) => o.id === options.orderId);
      if (ordExists) {
        nextOrderId = options.orderId;
        setSelectedOrderId(options.orderId);
      } else if (orders[0]) {
        nextOrderId = orders[0].id;
        setSelectedOrderId(orders[0].id);
      }
    }

    setRouteStack((prev) => {
      const top = prev[prev.length - 1];
      if (
        top &&
        top.screen === screen &&
        (top.productId || '') === (nextProductId || '') &&
        (top.categoryId || 'all') === (nextCategoryId || 'all') &&
        (top.orderId || '') === (nextOrderId || '')
      ) {
        return prev;
      }
      const nextEntry: AppRouteHistoryEntry = {
        screen,
        productId: nextProductId,
        categoryId: nextCategoryId,
        orderId: nextOrderId,
      };
      // Cap history stack depth to 32 entries to prevent unbounded memory growth
      const next = [...prev, nextEntry];
      return next.length > 32 ? next.slice(next.length - 32) : next;
    });
  };

  const goBack = () => {
    // Safety Guard: Pressing Back on Order Confirmation returns to Home rather than re-entering a completed checkout step
    if (currentScreen === 'order_success') {
      setRouteStack([{ screen: 'home', productId: selectedProductId, categoryId: selectedCategoryId, orderId: selectedOrderId }]);
      return;
    }

    setRouteStack((prev) => {
      if (prev.length <= 1) {
        return [{ screen: 'home', productId: selectedProductId, categoryId: selectedCategoryId, orderId: selectedOrderId }];
      }
      const nextStack = prev.slice(0, -1);
      const target = nextStack[nextStack.length - 1];
      if (target) {
        if (target.productId) setSelectedProductId(target.productId);
        if (target.categoryId) setSelectedCategoryId(target.categoryId);
        if (target.orderId) setSelectedOrderId(target.orderId);
      }
      return nextStack;
    });
  };

  const formatPrice = (bdtAmount: number): string => {
    if (currency === 'USD') {
      const usd = bdtAmount / BDT_PER_USD;
      return `$\u00A0${usd.toFixed(2)}`;
    }
    return formatLandedPrice(bdtAmount);
  };

  const selectedProduct = useMemo<Product>(() => {
    const found =
      catalogProducts.find((p) => p.id === selectedProductId) ||
      catalogProducts[0];
    if (found) return found;
    // Transient loading skeleton placeholder while initial API request is in-flight
    return {
      id: 'api-loading',
      name: 'Loading from Live API...',
      nameBn: 'লোড হচ্ছে...',
      subtitle: 'Fetching product details from API...',
      category: 'electronics',
      image: '',
      hsCode: '8517.62.00',
      corridorTag: 'Global → Dhaka Air Hub',
      originLabel: 'Global API',
      verifiedSupplier: true,
      supplierName: 'Syncing API...',
      supplierFollowers: '—',
      supplierProductsCount: '—',
      rating: 4.8,
      reviewCount: 0,
      dropScore: 9.0,
      dropScoreLabel: 'Excellent',
      productPriceBdt: 0,
      shippingBdt: 0,
      importDutyBdt: 0,
      vatBdt: 0,
      totalLandedBdt: 0,
      originalLandedBdt: 0,
      discountPercent: 0,
      lowest30dBdt: 0,
      arrivesThisWeek: true,
      inStock: true,
      colors: [{ name: 'Standard', hex: '#0F172A' }],
      highlights: [],
      specs: { warranty: '1 Year Official Warranty' },
      routes: [],
      priceHistory: {
        '7D': [{ dateLabel: 'Today', priceBdt: 0 }],
        '30D': [{ dateLabel: 'Today', priceBdt: 0 }],
        '90D': [{ dateLabel: 'Today', priceBdt: 0 }],
        '1Y': [{ dateLabel: 'Today', priceBdt: 0 }],
      },
      reviews: [],
    };
  }, [catalogProducts, selectedProductId]);

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

  const selectedOrder = useMemo<Order>(() => {
    const found = orders.find((o) => o.id === selectedOrderId) || orders[0];
    if (found) return found;
    return {
      id: 'API-SYNC',
      placedDate: 'Syncing from API...',
      estimatedDelivery: 'Syncing...',
      status: 'Processing',
      items: [],
      subtotalBdt: 0,
      shippingBdt: 0,
      customsDutyBdt: 0,
      totalBdt: 0,
      paymentMethod: 'cod',
      shippingMethod: 'standard',
      shippingAddress: addresses[0] || {
        id: 'addr-sync',
        label: 'Home',
        fullName: user.fullName,
        phone: user.phone,
        address: 'Dhaka, Bangladesh',
        city: 'Dhaka',
        postalCode: '1213',
        isDefault: true,
      },
      courierName: 'eCourier Bangladesh',
      trackingCode: 'SYNCING',
      milestones: [],
    };
  }, [orders, selectedOrderId, addresses, user.fullName, user.phone]);

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
    if (!product.inStock) {
      showToast(`${product.name} is currently out of stock`, 'info');
      return;
    }
    const chosenColor = color || product.colors[0]?.name || 'Standard';
    const chosenSize = size || product.sizes?.[0];
    const chosenRoute =
      routeId || selectedRouteByProduct[productId] || product.routes[0]?.id || 'default';

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === productId &&
          item.selectedColor === chosenColor &&
          (item.selectedSize || '') === (chosenSize || '') &&
          item.selectedRouteId === chosenRoute
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + Math.max(1, quantity),
        };
        return updated;
      }
      return [
        ...prev,
        {
          productId,
          quantity: Math.max(1, quantity),
          selectedColor: chosenColor,
          selectedSize: chosenSize,
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

  const cartTotals = useMemo(
    () =>
      calculateAuthoritativeCartQuote({
        cart,
        products: catalogProducts,
        consolidateParcel,
        promoCode,
        promoVouchers,
        shippingMethod,
        isCheckoutConfirmedStage:
          currentScreen === 'checkout_review' ||
          currentScreen === 'order_success',
      }),
    [
      cart,
      catalogProducts,
      consolidateParcel,
      promoCode,
      promoVouchers,
      shippingMethod,
      currentScreen,
    ]
  );

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

  const placeOrder = (idempotencyKey?: string): Order => {
    const chosenAddress =
      addresses.find((a) => a.id === selectedAddressId) || addresses[0];

    // Revalidate inventory & address before accepting order
    const revalidation = revalidateCartBeforeOrder({
      cart,
      products: catalogProducts,
      address: chosenAddress,
    });
    if (!revalidation.valid && orders[0]) {
      showToast(revalidation.error || 'Order validation failed', 'info');
      return orders[0];
    }

    // Recompute authoritative quote snapshot at order commit time
    const finalQuote = calculateAuthoritativeCartQuote({
      cart,
      products: catalogProducts,
      consolidateParcel,
      promoCode,
      promoVouchers,
      shippingMethod,
      isCheckoutConfirmedStage: true,
    });

    // Generate PCI-safe payment token (never persists raw card numbers or CVV)
    const paymentToken = createSafePaymentToken({
      method: paymentMethod,
      amountBdt: finalQuote.totalBdt,
      bkashPhone: checkoutDraft.bkashPhone,
      nagadPhone: checkoutDraft.nagadPhone,
      cardLast4: checkoutDraft.cardNumber.replace(/\D/g, '').slice(-4),
    });

    const effectiveKey =
      idempotencyKey || `${finalQuote.quoteId}-${selectedAddressId}-${paymentMethod}`;

    const { order: committedOrder, wasDuplicate } = getOrRecordIdempotentOrder(
      effectiveKey,
      () => {
        const newOrderId = `DM${Math.floor(123457 + Math.random() * 800000)}`;
        const orderItems = cart.map((item) => {
          const prod =
            catalogProducts.find((p) => p.id === item.productId) ||
            catalogProducts[0];
          const route =
            prod.routes.find((r) => r.id === item.selectedRouteId) ||
            prod.routes[0];
          return {
            productId: prod.id,
            name: prod.name,
            image: prod.image,
            quantity: item.quantity,
            variant: `${item.selectedColor}${
              item.selectedSize ? ` · Size ${item.selectedSize}` : ''
            } · ${route?.name || 'Global Direct'}`,
            landedUnitBdt: route ? route.totalLandedBdt : prod.totalLandedBdt,
          };
        });

        return {
          id: newOrderId,
          placedDate: 'Oct 10, 2026',
          estimatedDelivery:
            shippingMethod === 'express'
              ? 'Est. 3 – 7 days'
              : shippingMethod === 'hub_pickup'
              ? 'Est. 5 – 9 days (Dhaka Hub)'
              : 'Est. 7 – 14 days',
          status: 'Processing',
          items: orderItems,
          subtotalBdt: finalQuote.subtotalBdt,
          shippingBdt: Math.max(0, finalQuote.shippingBdt),
          customsDutyBdt: finalQuote.dutyAndVatBdt,
          totalBdt: finalQuote.totalBdt,
          quoteId: finalQuote.quoteId,
          ruleVersion: finalQuote.ruleVersion,
          pricingStatus: 'confirmed',
          paymentTokenId: paymentToken.tokenId,
          maskedPaymentAccount: paymentToken.maskedAccount,
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
              title: 'Order Confirmed & Quote Locked',
              location: `Quote ${finalQuote.quoteId} · ${paymentToken.providerLabel}`,
              timestamp: 'Just now',
              completed: true,
              current: true,
            },
            {
              title: 'Supplier Quality Check & Dispatch (Estimated)',
              location: 'Verified Supplier Warehouse',
              timestamp: 'Est. within 12–24 hours',
              completed: false,
            },
            {
              title: 'International Air Freight & BD Customs Assessment',
              location: 'Hazrat Shahjalal Int. Airport, Dhaka',
              timestamp: 'Est. 3–5 days',
              completed: false,
            },
            {
              title: 'Doorstep Delivery via Assigned Courier',
              location: chosenAddress.address,
              timestamp:
                shippingMethod === 'express'
                  ? 'Est. 3–7 days'
                  : 'Est. 7–14 days',
              completed: false,
            },
          ],
        };
      }
    );

    if (wasDuplicate) {
      showToast(`Order #${committedOrder.id} already confirmed (Idempotent Guard)`, 'info');
      return committedOrder;
    }

    // Clear sensitive CVV from memory immediately after tokenization
    setCheckoutDraft((prev) => ({
      ...prev,
      cardCvv: '',
      cardNumber: `•••• •••• •••• ${
        prev.cardNumber.replace(/\D/g, '').slice(-4) || '8910'
      }`,
    }));

    setOrders((prev) => [committedOrder, ...prev]);
    setSelectedOrderId(committedOrder.id);
    setCart([]);
    const newOrderNotif: AppNotification = {
      id: `notif-order-${Date.now()}`,
      type: 'order',
      title: `Order #${committedOrder.id} Confirmed`,
      body: `Quote ${finalQuote.quoteId} locked (${paymentToken.maskedAccount}). Delivering to ${chosenAddress.city} in ${committedOrder.estimatedDelivery}.`,
      timestamp: 'Just now',
      read: false,
      targetScreen: 'order_tracking',
      targetOrderId: committedOrder.id,
    };
    setNotifications((prev) => [newOrderNotif, ...prev]);
    showToast(`Order #${committedOrder.id} placed successfully!`);
    return committedOrder;
  };

  const loginUser = (
    emailOrPhone: string,
    fullName?: string,
    role?: UserRole
  ) => {
    const detectedRole: UserRole = role === 'admin' ? 'admin' : 'customer';
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
    const targetScreen: ScreenId =
      detectedRole === 'admin' ? 'admin_dashboard' : 'home';
    setRouteStack((prev) => [
      ...prev.slice(-31),
      {
        screen: targetScreen,
        productId: selectedProductId,
        categoryId: selectedCategoryId,
        orderId: selectedOrderId,
      },
    ]);
  };

  const recordAudit = (action: string, targetId: string, summary: string) => {
    setAdminAuditLog((prev) => [
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        actorName: user.fullName,
        actorRole: user.role,
        action,
        targetId,
        summary,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      ...prev.slice(0, 49),
    ]);
  };

  const requireAdminAuthorization = (operationName: string): boolean => {
    if (user.role !== 'admin') {
      showToast(
        `Unauthorized: ${operationName} requires Staff Admin role`,
        'info'
      );
      return false;
    }
    return true;
  };

  const switchUserRole = (nextRole: UserRole) => {
    if (nextRole === 'admin') {
      const nextAdminUser = {
        fullName: 'Nakib Prince',
        email: 'admin@deshimart.bd',
        phone: '+880 1819 001122',
        role: 'admin' as UserRole,
        memberTier: 'Staff Operations Director (Demo Sandbox)',
        memberSince: 'Jan 2024',
        isLoggedIn: true,
      };
      setUser(nextAdminUser);
      setAdminAuditLog((prev) => [
        {
          id: `audit-role-${Date.now()}`,
          actorName: nextAdminUser.fullName,
          actorRole: 'admin',
          action: 'ASSUME_ADMIN_SANDBOX_ROLE',
          targetId: nextAdminUser.email,
          summary: 'Entered Staff Operations Sandbox Mode',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
        ...prev,
      ]);
      showToast('Entered Staff Admin Sandbox Console');
      setRouteStack((prev) => [
        ...prev.slice(-31),
        {
          screen: 'admin_dashboard',
          productId: selectedProductId,
          categoryId: selectedCategoryId,
          orderId: selectedOrderId,
        },
      ]);
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
      setRouteStack((prev) => [
        ...prev.slice(-31),
        {
          screen: 'account',
          productId: selectedProductId,
          categoryId: selectedCategoryId,
          orderId: selectedOrderId,
        },
      ]);
    }
  };

  const createPromoVoucher = (voucher: PromoVoucher) => {
    if (!requireAdminAuthorization('Create Promo Voucher')) return;
    const code = voucher.code.trim().toUpperCase();
    if (!code) return;
    setPromoVouchers((prev) => [
      { ...voucher, code },
      ...prev.filter((v) => v.code.toUpperCase() !== code),
    ]);
    recordAudit(
      'CREATE_VOUCHER',
      code,
      `Created ${voucher.discountType} voucher (${voucher.value}) min ৳${voucher.minOrderBdt}`
    );
    showToast(`Promo voucher ${code} published!`);
  };

  const togglePromoVoucher = (code: string) => {
    if (!requireAdminAuthorization('Toggle Promo Voucher')) return;
    setPromoVouchers((prev) =>
      prev.map((v) =>
        v.code.toUpperCase() === code.toUpperCase()
          ? { ...v, active: !v.active }
          : v
      )
    );
    recordAudit('TOGGLE_VOUCHER', code, `Toggled active status for voucher ${code}`);
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
    if (!requireAdminAuthorization('Add Product')) return;
    const newId = `prod-custom-${Date.now()}`;
    const quote = calculateProductLandedQuote({
      productId: newId,
      category: input.category,
      basePriceBdt: input.productPriceBdt,
      shippingBdt: input.shippingBdt,
      hsCode: input.hsCode,
    });
    const base = quote.basePriceBdt;
    const ship = quote.freightBdt;
    const duty = quote.customsDutyBdt;
    const vat = quote.vatBdt;
    const totalLanded = quote.totalLandedBdt;
    const discountPct = input.discountPercent ?? 15;
    const origLanded = Math.round(totalLanded / (1 - discountPct / 100));

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
    recordAudit(
      'ADD_PRODUCT',
      newProduct.id,
      `Added "${newProduct.name}" (HS ${newProduct.hsCode}) Landed ৳${totalLanded}`
    );
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
    if (!requireAdminAuthorization('Update Product')) return;
    setCatalogProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const quote = calculateProductLandedQuote({
          productId: p.id,
          category: p.category,
          basePriceBdt:
            updates.productPriceBdt !== undefined
              ? updates.productPriceBdt
              : p.productPriceBdt,
          shippingBdt:
            updates.shippingBdt !== undefined
              ? updates.shippingBdt
              : p.shippingBdt,
          hsCode: p.hsCode,
        });
        const base = quote.basePriceBdt;
        const ship = quote.freightBdt;
        const duty =
          updates.importDutyBdt !== undefined
            ? Math.round(updates.importDutyBdt)
            : quote.customsDutyBdt;
        const vat =
          updates.vatBdt !== undefined
            ? Math.round(updates.vatBdt)
            : quote.vatBdt;
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
    recordAudit(
      'UPDATE_PRODUCT',
      productId,
      `Updated pricing/stock for ${productId}`
    );
    showToast('Product pricing & inventory updated');
  };

  const adminDeleteProduct = (productId: string) => {
    if (!requireAdminAuthorization('Delete Product')) return;
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
      recordAudit(
        'DELETE_PRODUCT',
        productId,
        `Removed "${target?.name || productId}" from catalog`
      );
      showToast(`Removed ${target?.name || 'product'} from catalog`, 'info');
      return next;
    });
  };

  const adminAdvanceOrderStatus = (orderId: string) => {
    if (!requireAdminAuthorization('Advance Order Status')) return;
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
        recordAudit(
          'ADVANCE_ORDER_STATUS',
          ord.id,
          `Transitioned order #${ord.id} from ${ord.status} → ${nextStatus}`
        );
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
    if (!requireAdminAuthorization('Broadcast Notification')) return;
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
    recordAudit(
      'BROADCAST_NOTIFICATION',
      type.toUpperCase(),
      `Broadcasted "${title.trim()}" to customer notification feed`
    );
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
        adminAuditLog,
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
        isSearchingRemote,
        catalogSyncError,
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
        shoppingGuides,
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
