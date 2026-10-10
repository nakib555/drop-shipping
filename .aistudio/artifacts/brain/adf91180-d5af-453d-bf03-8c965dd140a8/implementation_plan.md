# DeshiMart — App-Wide Size, Proportion & Navbar Balance Plan

Audited all navigation bars, screens, cards, and interactive controls across the app to ensure balanced proportions, uniform touch targets, and consistent 8pt spacing on all mobile screen widths (`320px` to `440px+`).

---

## 1. Top App Bar (`TopAppBar.tsx`) — Balanced Height & Icon Proportions
- **Consistent Safe-Area Inner Row**:
  - Separate the outer `<header>` safe-area top padding (`pt-[env(safe-area-inset-top,0px)]`) from a dedicated inner `h-14` (`56px`) flex row so the header content is always vertically centered regardless of device notch size.
- **Uniform `36px × 36px` (`w-9 h-9`) Action Buttons & Badges**:
  - Standardize every right-side icon button (Search, Wishlist, Share, Cart, Notifications, Settings) to `w-9 h-9 rounded-xl` with uniform `w-[18px] h-[18px]` icons and identical `h-4 min-w-4 px-1 text-[10px]` count badges (fixing the mismatched `w-10 h-10` vs `w-9 h-9` buttons and `15px` vs `16px` badges).
  - Balance the left Brand mark (`w-8 h-8 rounded-xl`), title (`text-[15px] font-bold`), and location chip (`h-7 px-2.5 rounded-lg text-xs`) so they align on the same horizontal centerline as the right-side currency/language pill (`h-8 px-2.5 rounded-lg`) and notification bell.

---

## 2. Bottom Navigation Bar (`BottomTabBar.tsx`) — Balanced 6-Tab Ergonomics
- **Dedicated `58px` Inner Tab Grid + Safe-Area Footer**:
  - Separate the safe-area bottom inset from the `h-[58px]` 6-column navigation row (`px-1.5`) so tabs never stretch unevenly on phones with home indicator bars.
- **Harmonized Icon & Label Proportions**:
  - Use consistent `w-[19px] h-[19px]` icons, `text-[10px] leading-3.5` labels, and a centered `w-5 h-[2.5px]` top active indicator bar so all 6 tabs (`Home`, `Categories`, `Wishlist`, `Orders`, `Cart`, `Profile`) fit comfortably down to `320px` screens without crowding or truncation.

---

## 3. Product Detail Screen (`HybridBentoPdpModules.tsx`) — Clean Header & Balanced Controls
- **Remove Demo Switcher Noise from Breadcrumb**:
  - Remove the internal `Electronics | Fashion` demo switcher buttons (`onSwitchDemoProduct`) from the top of `PdpCoreInfoBlock` so the category breadcrumb (`Category · Origin`) has clean breathing room and never wraps awkwardly on mobile.
- **Streamline Rating & Stock Metadata Row**:
  - Remove the noisy `(30 units)` warehouse count and `SKU: ...` string from the rating line beneath the product title (keeping `★ 4.8 (124) · In Stock` on the left and `Price History →` on the right, since SKU is already inside the Technical Specifications accordion).
- **Balanced Variant & Quantity Card**:
  - Standardize color and size/configuration chips to a uniform `h-9 px-3 rounded-lg text-xs` height so variant rows look balanced and compact rather than oversized.

---

## 4. Home Screen & Tool Screens (`HomeScreen.tsx`, `PriceTrackerScreen.tsx`, `SellerCompareScreen.tsx`)
- **Home Screen 3-Tool Shortcut Strip (`HomeScreen.tsx`)**:
  - Align the 3 shortcut cards (`Price History`, `Route Compare`, `Order Tracking` — renaming `Order Radar` to `Order Tracking` for consistency) with centered horizontal icon + label or balanced vertical padding (`p-3 rounded-xl`) so all 3 cards have identical height and visual weight.
- **Button Height Consistency (`h-11` / `44px`)**:
  - Standardize primary/secondary action buttons in `PriceTrackerScreen.tsx` (`Compare Routes` / `Add to Cart`) from `h-12 rounded-lg` to `h-11 rounded-xl` (`gap-2.5`) to match `CheckoutFlowScreen`, `SellerCompareScreen`, and `AccountSupportScreen`.
