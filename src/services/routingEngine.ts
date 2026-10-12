import { CategoryId, ScreenId } from '../types/deshimart';

export type NavigationDirection = 'forward' | 'backward' | 'tab';

export interface RouteOptions {
  productId?: string;
  categoryId?: CategoryId;
  orderId?: string;
  direction?: NavigationDirection;
  replace?: boolean;
}

export interface HierarchicalParentResolution {
  parentScreen: ScreenId;
  preservedOptions?: RouteOptions;
}

/**
 * Root tabs in the primary bottom navigation bar
 */
export const ROOT_TAB_SCREENS: readonly ScreenId[] = [
  'home',
  'categories',
  'orders',
  'cart',
  'account',
] as const;

export function isRootTabScreen(screen: ScreenId): boolean {
  return (ROOT_TAB_SCREENS as readonly string[]).includes(screen);
}

/**
 * Explicit hierarchical fallback parent for every screen in DeshiMart.
 * Used when the history stack is empty or has only 1 screen (e.g. direct deep link, fresh refresh),
 * ensuring the user always moves up to the natural parent container rather than failing or trapping.
 */
export const SCREEN_HIERARCHICAL_PARENT_MAP: Record<
  ScreenId,
  (context?: RouteOptions) => HierarchicalParentResolution
> = {
  // Discovery & Catalog Flow
  home: () => ({ parentScreen: 'home' }),
  categories: () => ({ parentScreen: 'home' }),
  category_products: (ctx) => ({
    parentScreen: 'categories',
    preservedOptions: { categoryId: ctx?.categoryId },
  }),
  product_detail: (ctx) => ({
    parentScreen: ctx?.categoryId && ctx.categoryId !== 'all' ? 'category_products' : 'home',
    preservedOptions: { categoryId: ctx?.categoryId, productId: ctx?.productId },
  }),
  price_tracker: (ctx) => ({
    parentScreen: ctx?.productId ? 'product_detail' : 'home',
    preservedOptions: { productId: ctx?.productId },
  }),
  seller_compare: (ctx) => ({
    parentScreen: ctx?.productId ? 'product_detail' : 'categories',
    preservedOptions: { productId: ctx?.productId },
  }),
  spec_compare: (ctx) => ({
    parentScreen: ctx?.productId ? 'seller_compare' : 'categories',
    preservedOptions: { productId: ctx?.productId },
  }),
  supplier_store: (ctx) => ({
    parentScreen: ctx?.productId ? 'product_detail' : 'home',
    preservedOptions: { productId: ctx?.productId },
  }),

  // Cart & Multi-Step Checkout Flow
  cart: () => ({ parentScreen: 'home' }),
  checkout_shipping: () => ({ parentScreen: 'cart' }),
  checkout_delivery: () => ({ parentScreen: 'checkout_shipping' }),
  checkout_payment: () => ({ parentScreen: 'checkout_delivery' }),
  checkout_review: () => ({ parentScreen: 'checkout_payment' }),
  order_success: () => ({ parentScreen: 'orders' }),

  // Orders & Post-Purchase Tracking Flow
  orders: () => ({ parentScreen: 'home' }),
  order_tracking: (ctx) => ({
    parentScreen: 'orders',
    preservedOptions: { orderId: ctx?.orderId },
  }),

  // Account, KYC & Profile Flow
  account: () => ({ parentScreen: 'home' }),
  nid_security: () => ({ parentScreen: 'account' }),
  addresses: () => ({ parentScreen: 'account' }),
  payment_methods: () => ({ parentScreen: 'account' }),
  wishlist: () => ({ parentScreen: 'account' }),
  notifications: () => ({ parentScreen: 'account' }),
  support: () => ({ parentScreen: 'account' }),
  settings: () => ({ parentScreen: 'account' }),
  guides: () => ({ parentScreen: 'account' }),

  // Internal Management
  admin_dashboard: () => ({ parentScreen: 'account' }),

  // Onboarding & Auth Flow
  splash: () => ({ parentScreen: 'splash' }),
  onboarding: () => ({ parentScreen: 'splash' }),
  auth: () => ({ parentScreen: 'onboarding' }),
  post_login_setup: () => ({ parentScreen: 'auth' }),
};

/**
 * Resolves the parent screen when navigating back from any given screen.
 */
export function getHierarchicalParent(
  currentScreen: ScreenId,
  context?: RouteOptions
): HierarchicalParentResolution {
  const resolver = SCREEN_HIERARCHICAL_PARENT_MAP[currentScreen];
  if (resolver) {
    return resolver(context);
  }
  return { parentScreen: 'home' };
}
