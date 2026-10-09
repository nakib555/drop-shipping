import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  CATALOG_PRODUCTS,
  INITIAL_ADDRESSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
} from '../data/catalogData';
import { fetchGlobalCatalogFromApi } from '../services/productApi';
import {
  AppNotification,
  CartItem,
  CategoryId,
  CurrencyCode,
  LanguageCode,
  Order,
  PaymentMethodId,
  Product,
  ScreenId,
  ShippingAddress,
  ShippingMethodId,
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

  // User & Auth
  user: { fullName: string; email: string; phone: string; isLoggedIn: boolean };
  loginUser: (emailOrPhone: string, fullName?: string) => void;
  updateUserProfile: (data: { fullName: string; email: string; phone: string }) => void;
  logoutUser: () => void;

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
  deleteAddress: (id: string) => void;
  shippingMethod: ShippingMethodId;
  setShippingMethod: (m: ShippingMethodId) => void;
  paymentMethod: PaymentMethodId;
  setPaymentMethod: (p: PaymentMethodId) => void;
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

export const DeshiMartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>(['splash']);

  const [user, setUser] = useState(() => ({
    fullName: 'Tanvir Ahmed',
    email: 'tanvir.ahmed@deshimart.bd',
    phone: '+880 1712 345678',
    isLoggedIn: true,
  }));

  const [currency, setCurrency] = useState<CurrencyCode>('BDT');
  const [language, setLanguage] = useState<LanguageCode>('EN');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [catalogProducts, setCatalogProducts] = useState<Product[]>(CATALOG_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [selectedProductId, setSelectedProductId] = useState<string>(CATALOG_PRODUCTS[0].id);
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [smartFilters, setSmartFilters] = useState<SmartFiltersState>(DEFAULT_FILTERS);

  const loadApiCatalog = useCallback(async (notify = false) => {
    setIsLoadingProducts(true);
    try {
      const apiItems = await fetchGlobalCatalogFromApi(notify);
      if (apiItems.length > 0) {
        setCatalogProducts((prev) => {
          const existingIds = new Set(CATALOG_PRODUCTS.map((p) => p.id));
          const merged = [
            ...CATALOG_PRODUCTS,
            ...apiItems.filter((item) => !existingIds.has(item.id)),
          ];
          return merged;
        });
        if (notify) {
          showToast(`Synced ${apiItems.length} global products from API`);
        }
      }
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadApiCatalog(false);
  }, [loadApiCatalog]);

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
    if (
      normalized === 'DESHI10' ||
      normalized === 'FIRST500' ||
      normalized === 'BKASHCB'
    ) {
      setPromoCode(normalized);
      showToast(`Promo code ${normalized} applied!`);
      return true;
    }
    showToast('Invalid code. Try DESHI10, FIRST500, or BKASHCB', 'info');
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
    if (promoCode === 'DESHI10') {
      promoDiscountBdt = Math.min(1500, Math.round(afterConsolidationBdt * 0.1));
    } else if (promoCode === 'FIRST500') {
      promoDiscountBdt = afterConsolidationBdt >= 2500 ? 500 : 250;
    } else if (promoCode === 'BKASHCB') {
      promoDiscountBdt = Math.min(1000, Math.round(afterConsolidationBdt * 0.05));
    }

    const subtotalBdt = Math.max(0, afterConsolidationBdt - promoDiscountBdt);
    const shippingBdt =
      cart.length === 0 ? 0 : shippingMethod === 'express' ? 800 : 0;

    return {
      baseItemsBdt,
      freightBdt,
      dutyAndVatBdt,
      consolidationSavingsBdt,
      promoDiscountBdt,
      subtotalBdt,
      shippingBdt,
      totalBdt: subtotalBdt + shippingBdt,
    };
  }, [cart, catalogProducts, consolidateParcel, promoCode, shippingMethod]);

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
      estimatedDelivery: shippingMethod === 'express' ? '3 – 7 days' : '7 – 14 days',
      status: 'Processing',
      items: orderItems,
      subtotalBdt: cartTotals.subtotalBdt,
      shippingBdt: cartTotals.shippingBdt,
      customsDutyBdt: 0,
      totalBdt: cartTotals.totalBdt,
      paymentMethod,
      shippingMethod,
      shippingAddress: chosenAddress,
      courierName: 'eCourier Bangladesh',
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

  const loginUser = (emailOrPhone: string, fullName?: string) => {
    setUser({
      fullName: fullName || 'Tanvir Ahmed',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'tanvir.ahmed@deshimart.bd',
      phone: emailOrPhone.includes('@') ? '+880 1712 345678' : emailOrPhone,
      isLoggedIn: true,
    });
    showToast(`Welcome, ${fullName || 'Tanvir Ahmed'}!`);
    navigateTo('home');
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
        updateUserProfile,
        logoutUser,
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
        deleteAddress,
        shippingMethod,
        setShippingMethod,
        paymentMethod,
        setPaymentMethod,
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
