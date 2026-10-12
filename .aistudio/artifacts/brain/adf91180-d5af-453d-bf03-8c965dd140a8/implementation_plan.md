# Implementation Plan: Complete Directional App Routing & Hierarchical Navigation

## Objective
Upgrade the mobile application routing engine to provide seamless, intuitive navigation across all user journeys and directions (Discovery, Detail, Multi-Step Checkout, Post-Purchase Tracking, Account/KYC, and Price Comparison). When users navigate forward or backward, the app will respect a clean hierarchical stack with context-aware fallback parent destinations, eliminating dead ends and preventing invalid re-entry into completed checkout stages.

---

## Complexity Classification
- **Level 2 / 3**: State management, routing hierarchy, and screen transition flow across 31 screen routes.

---

## Verified Facts & Current System State
1. **ScreenId System**: 31 screen definitions exists in `src/types/deshimart.ts` spanning on-boarding, catalog, checkout, orders, account, admin, and comparison flows.
2. **Current Navigation Engine**: `DeshiMartContext.tsx` maintains a `routeStack` of `AppRouteHistoryEntry[]`. Currently, `goBack()` pops the top item, and defaults to `home` if the stack has 1 entry.
3. **Checkout Progression**:
   - `cart` -> `checkout_shipping` -> `checkout_delivery` -> `checkout_payment` -> `checkout_review` -> `order_success`.
   - On `order_success`, pressing back already routes to `home`.
4. **Bottom Tab Root Screens**: `home`, `categories`, `orders`, `cart`, `account`.

---

## Architecture Design: Directional Navigation Hierarchy

### 1. Hierarchical Parent Fallback Map (`SCREEN_PARENT_MAP`)
When the back button is pressed and the history stack is empty, contains only the current screen, or originated from a direct deep link or tab switch, the router resolves to the logical hierarchical parent rather than defaulting blindly to Home:

| Screen | Logical Hierarchical Parent | Context Preserved |
|---|---|---|
| `category_products` | `categories` | Category selection |
| `product_detail` | `category_products` (or `categories` / `home`) | Selected category & scroll |
| `price_tracker` | `product_detail` | Product ID |
| `seller_compare` | `product_detail` | Product ID |
| `spec_compare` | `seller_compare` | Product ID & route |
| `supplier_store` | `product_detail` | Product ID |
| `checkout_shipping` | `cart` | Cart items |
| `checkout_delivery` | `checkout_shipping` | Selected address |
| `checkout_payment` | `checkout_delivery` | Shipping method |
| `checkout_review` | `checkout_payment` | Payment draft |
| `order_success` | `orders` (or `home`) | Clears checkout flow |
| `order_tracking` | `orders` | Order ID |
| `nid_security` | `account` | Profile state |
| `addresses` | `account` | Saved addresses |
| `payment_methods` | `account` | Saved methods |
| `wishlist` | `account` (or previous screen) | Wishlist state |
| `notifications` | `account` | Notification list |
| `support` | `account` | Support chat |
| `settings` | `account` | App settings |
| `guides` | `account` | Knowledge base |
| `admin_dashboard` | `account` | Admin overview |
| `onboarding` | `splash` | Onboarding progress |
| `auth` | `onboarding` | Auth state |
| `post_login_setup` | `auth` | Auth session |

### 2. Directional Stack Transitions
- Track navigation direction (`'forward' | 'backward' | 'tab'`) in routing state.
- Forward pushes increment depth and slide from right (`+24px -> 0px`).
- Backward pops decrement depth and slide from left (`-24px -> 0px`).
- Root tab switches use subtle opacity crossfade without horizontal displacement.

### 3. Browser History & Hardware Back Synchronization
- Listen to `window.onpopstate` to ensure Android/browser hardware back buttons execute the exact same clean `goBack()` hierarchical resolution.
- Sync `window.history.pushState` on forward navigation so mobile webview back gesture works naturally.

---

## Implementation Breakdown

### Phase 1: Navigation Engine & Hierarchical Registry
- Define `SCREEN_PARENT_MAP` and parent resolution function in `src/services/routingEngine.ts`.
- Update `DeshiMartContext.tsx` to utilize `getHierarchicalParentScreen(currentScreen, currentRoute)`.
- Support replace navigation and stack truncation for completed flows (e.g., checkout completion).

### Phase 2: Flow Direction & Screen Transitions
- Expose `navigationDirection` (`'forward' | 'backward' | 'tab'`) from `DeshiMartContext`.
- Wrap top-level screen views in `MobileShell.tsx` / `App.tsx` with directional motion presets conforming to user reduced-motion preferences.

### Phase 3: Hardware & Webview Back Handling
- Attach PopState listener in `DeshiMartContext` to handle Android back gestures safely.
- Prevent infinite redirect loops on root tab screens.

### Phase 4: Validation & Quality Gates
- Test all major flows:
  1. Discovery: Home -> Categories -> Category Products -> Product Detail -> Back (reaches Category Products) -> Back (reaches Categories).
  2. Cart & Multi-Step Checkout: Cart -> Shipping -> Delivery -> Payment -> Review -> Order Success -> Back (reaches Orders list, never re-enters checkout).
  3. Tracking & Reorder: Orders -> Tracking -> Back (reaches Orders).
  4. Account Sub-Screens: Account -> NID Security / Addresses / Settings -> Back (returns to Account).
  5. Top App Bar & Tab Bar: Tapping root tabs clears transient sub-stacks to prevent deep navigation trap.
- Run `lint_applet` and `compile_applet`.

---

## Approval Gate
Ready to proceed with execution upon user confirmation.
