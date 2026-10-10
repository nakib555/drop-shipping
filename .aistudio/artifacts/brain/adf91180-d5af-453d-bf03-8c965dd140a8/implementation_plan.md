# DeshiMart — Admin Console Professional Noise Cleaning & Visual Refinement Plan

A production-grade engineering specification for decluttering the DeshiMart Admin Console (`AdminDashboardScreen.tsx`), eliminating internal telemetry and audit-log noise, enforcing strict KPI card density limits (maximum 3 data points per card: label, primary metric, and 1 concise sub-label), and compacting Order and Catalog rows for high-signal mobile and desktop operations.

## User Review & Confirmed Decisions

> [!IMPORTANT]
> Your interactive preferences have been incorporated into this specification. Please review the plan below and click **Proceed** (or reply **Proceed**) to authorize implementation.

- **Confirmed Decision 1 (Decluttering Scope)**:
  1. Remove internal audit logs (`Admin Operations Audit Trail`) and pricing engine rule version telemetry (`Rule: v2.4.0-BD-NBR`) from the UI.
  2. Streamline the 2×2 KPI summary cards so each cell displays strictly 1 label, 1 primary tabular metric, and 1 concise sub-label.
  3. Compact Order and Catalog list rows with cleaner, unified action controls and reduced vertical visual noise.
- **Confirmed Decision 2 (Audit Trail Handling)**:
  - Completely remove the `Admin Operations Audit Trail` section from the Admin Console UI (and remove audit-trail jargon from the product delete confirmation dialog).

---

## Complexity Classification

- **Classification**: **Level 2 — Focused Screen & Component Architecture Refinement**
- **Rationale**: The changes are cleanly scoped to `src/components/screens/AdminDashboardScreen.tsx`, preserving all underlying context state actions (`adminAddProduct`, `adminUpdateProduct`, `adminDeleteProduct`, `adminAdvanceOrderStatus`, `createPromoVoucher`, `togglePromoVoucher`, `adminBroadcastNotification`) while transforming the visual hierarchy and information density.

---

## Verified Facts, Assumptions, Missing Information & Clarification Questions

### Verified Facts (Confirmed from Repository Evidence)
1. **Audit Log & Telemetry Noise (`AdminDashboardScreen.tsx`)**:
   - Lines 473–503 render an "Admin Operations Audit Trail" box showing raw action codes (`INIT_PRICING_RULES`, `ASSUME_ADMIN_SANDBOX_ROLE`, `ADD_PRODUCT`, actor roles, and event counts).
   - Lines 1168–1172 inside the Add/Edit Product bottom sheet expose internal rule telemetry (`Rule: ${previewQuote.ruleVersion}`).
   - Lines 1223–1229 inside the Delete Product confirmation sheet reference "This action will be recorded in the admin audit trail."
2. **KPI Card Sub-Label Crowding (`AdminDashboardScreen.tsx`, lines 350–401)**:
   - The 2×2 KPI grid packs compound multi-part sub-labels into narrow mobile columns (e.g., `Settled: ৳ X · COD Due: ৳ Y` and `X shipped · Y delivered`), causing line-wrapping and visual clutter on 360px–390px viewports.
3. **Order & Catalog Row Density (`AdminDashboardScreen.tsx`, lines 508–790)**:
   - In the **Orders** tab (lines 531–642), every order card expands all line-item thumbnails and titles plus a separate multi-button footer bar, creating tall, repetitive cards.
   - In the **Catalog** tab (lines 712–788), each product row uses a 2-tier layout with separate `Edit Price`, `Pause Stock`/`Restock`, and `Delete` button strips below the product info, increasing scroll fatigue.

### Assumptions
- Underlying context functions in `DeshiMartContext.tsx` remain untouched so existing state interfaces remain 100% compatible across the app.

### Missing Information
- None. All component code and design tokens have been verified directly.

### Clarification Questions
- All clarification questions were answered in Turn 1 (`ask_question` responses).

---

## 1. Overview & Core Concept (Objective)

- **Purpose & Problem**: Eliminate developer-facing telemetry, audit logs, and multi-line card clutter from the Admin Console so store operators can scan KPIs, fulfill orders, and manage catalog items with zero visual friction.
- **Business Value**: Accelerates daily store administration (order dispatch, stock toggling, price updates, and voucher management) by surfacing only actionable commercial data.
- **Technical Value**: Enforces the design system's anti-bloat and card-density rules (max 3 data points per card, zero system logs/telemetry in UI, tabular numerals, and compact single-row action toolbars).
- **Success & Acceptance Criteria**:
  1. Zero audit log panels, raw action strings (`INIT_PRICING_RULES`), or pricing rule version strings (`v2.4.0-BD-NBR`) appear anywhere in `AdminDashboardScreen.tsx`.
  2. Each cell in the 2×2 Overview KPI grid contains strictly 1 title label, 1 primary tabular figure, and 1 single-line sub-label (`truncate`).
  3. Order cards in the **Orders** tab display a clean header, a compact item summary (showing the primary item + `+N more` badge when applicable), and a streamlined single-row action bar.
  4. Product rows in the **Catalog** tab consolidate thumbnail, title, supplier/origin, landed price, stock status toggle, edit trigger, and delete trigger into a balanced, low-noise row layout.
- **Non-Goals**: Modifying customer-facing screens or altering NBR customs calculation formulas.
- **Constraints**: Maintain $\ge 44\text{px}$ touch target ergonomics, full dark-mode token compatibility (`.dark-theme`), and zero TypeScript/lint errors.

---

## 2. Existing System Analysis

- **Architecture & State**: `AdminDashboardScreen.tsx` consumes `useDeshiMart()` from `src/context/DeshiMartContext.tsx` and `calculateProductLandedQuote()` from `src/services/pricingAndOrderEngine.ts`.
- **Navigation & Layout**: Rendered inside `MobileShell.tsx` when `currentScreen === 'admin_dashboard'`. Uses a 4-tab segmented bar (`Overview`, `Orders`, `Catalog`, `Vouchers`) and portals bottom sheets into `#mobile-sheet-root`.
- **Technical Debt Addressed**:
  - Unused/noisy `adminAuditLog` consumption in `AdminDashboardScreen.tsx`.
  - Exposed `previewQuote.ruleVersion` in the product pricing preview card.
  - Verbose multi-tier Catalog and Order list items.

---

## 3. Architecture Design & Component Hierarchy

```
AdminDashboardScreen (src/components/screens/AdminDashboardScreen.tsx)
├── Executive Header Bar (Admin Identity + Customer View Switcher + 4-Tab Segmented Nav)
├── Tab 1: Overview
│   ├── 2×2 Hairline KPI Grid (Label + 1 Primary Metric + 1 Concise Sub-label per cell)
│   ├── Quick Action Strip (Add Product + Sync Catalog)
│   └── Compact Recent Orders Card (Top 3 orders + View All link)
├── Tab 2: Orders
│   ├── Status Segmented Filter (All / Processing / Shipped / Delivered)
│   └── Compact Order Fulfillment Cards (Header + Concise Item Summary + Inline Track/Advance CTA)
├── Tab 3: Catalog
│   ├── Sticky-Style Search & Category Filter Header
│   └── Streamlined Single-Card Product Rows (Thumbnail + Info/Landed Price + Compact Action Pill Strip)
├── Tab 4: Vouchers
│   ├── Promo Vouchers Card (Collapsible Create Form + Active/Paused Toggle Rows)
│   └── Customer Announcements Card (Collapsible Broadcast Form)
└── Portaled Bottom Sheets (#mobile-sheet-root)
    ├── Add / Edit Product Sheet (Clean Duty + VAT breakdown without ruleVersion telemetry)
    └── Delete Product Confirmation Sheet (Clean confirmation copy without audit-trail jargon)
```

---

## 4. Implementation Breakdown

### Phase 1: Remove Audit Trail & Telemetry Noise
- **Purpose**: Strip `adminAuditLog` from `AdminDashboardScreen.tsx`, remove the "Admin Operations Audit Trail" card from the Overview tab, remove `· Rule: ${previewQuote.ruleVersion}` from the Add/Edit Product modal, and clean up the Delete Product confirmation message.
- **Files Affected**: `src/components/screens/AdminDashboardScreen.tsx`.
- **Validation & Exit Criteria**: Zero references to `adminAuditLog` or `ruleVersion` remain in `AdminDashboardScreen.tsx`.

### Phase 2: Streamline Overview KPI Grid & Quick Actions
- **Purpose**: Refactor the 2×2 KPI grid so each metric cell has 1 clear label, 1 primary `font-mono-num` value, and 1 concise single-line sub-label:
  - *Gross Volume*: Primary `formatPrice(metrics.totalRevenueBdt)` | Sub-label `Settled: ${formatPrice(metrics.settledRevenueBdt)}`
  - *Fulfillment*: Primary `${metrics.processingCount} Pending` | Sub-label `${metrics.shippedCount} in transit`
  - *Inventory*: Primary `${metrics.inStockCount} In Stock` | Sub-label `${products.length} total SKUs`
  - *Promotions*: Primary `${metrics.activeVouchersCount} Active` | Sub-label `${promoVouchers.length} total codes`
- **Files Affected**: `src/components/screens/AdminDashboardScreen.tsx`.
- **Validation & Exit Criteria**: All 4 KPI cells maintain identical heights with zero text wrapping on 360px mobile screens.

### Phase 3: Compact Order & Catalog Row Layouts
- **Purpose**:
  - **Orders Tab**: Consolidate order items into a compact summary strip (first item thumbnail + title + quantity, with a `+N more` badge if multiple items exist) and a clean footer row with `Track` and `Mark Shipped` / `Mark Delivered` actions, plus an empty-state view when a status filter has 0 matches.
  - **Catalog Tab**: Refine each product row so the thumbnail, title, supplier, stock badge, and landed price sit cleanly alongside a compact action bar (`Stock Toggle`, `Edit`, `Delete`), plus an empty-state view when a search query has 0 matches.
- **Files Affected**: `src/components/screens/AdminDashboardScreen.tsx`.
- **Validation & Exit Criteria**: Order and Catalog lists render with balanced whitespace, clear typographic hierarchy, and accessible touch targets.

---

## 5. Cross-Device & UX Experience Specifications

- **Desktop Experience**: Framed within the 440px preview container (or full-bleed in standalone mode) with crisp 1px structural hairlines (`divide-app-border`), `tabular-nums` alignment, and keyboard-accessible controls.
- **Tablet & Mobile Experience**: Full-bleed responsive container, horizontal momentum scrolling on category filter pills (`.no-scrollbar`), safe-area bottom padding on portaled sheets (`pb-[max(0.875rem,env(safe-area-inset-bottom))]`), and zero horizontal overflow.
- **Accessibility & Dark Mode**: Uses semantic tokens (`bg-white`, `bg-app-bg`, `bg-app-subtle`, `border-app-border`, `text-content-primary`, `text-content-secondary`) that automatically adapt to `.dark-theme`, with explicit `aria-label` attributes on icon buttons.
- **Performance & Security**: Memoized metrics (`useMemo`) and filtered lists prevent unnecessary re-renders; role-based access guard (`user.role !== 'admin'`) remains enforced at the top of the screen.

---

## 6. Risks, Testing & Deployment Strategy

- **Risk**: Removing `adminAuditLog` from `AdminDashboardScreen` could leave unused variable warnings if not removed from the `useDeshiMart()` destructuring.
  - *Mitigation*: Remove `adminAuditLog` from the destructured hook call in `AdminDashboardScreen.tsx` while keeping it intact in `DeshiMartContext.tsx`.
- **Testing & Verification**: Run `lint_applet` (`tsc --noEmit`) and `compile_applet` (`npm run build`) after editing to verify zero TypeScript or build errors.

---

## 7. Execution Checklist

1. [ ] Remove `adminAuditLog` destructuring and delete the "Admin Operations Audit Trail" section from `AdminDashboardScreen.tsx`.
2. [ ] Streamline the 2×2 Overview KPI cards in `AdminDashboardScreen.tsx` to 1 label, 1 primary metric, and 1 concise sub-label per card.
3. [ ] Compact the Order Fulfillment cards in the `Orders` tab with a concise item summary and clean empty-state handling.
4. [ ] Compact the Product rows in the `Catalog` tab with unified metadata and action controls, plus clean empty-state handling.
5. [ ] Remove `Rule: ${previewQuote.ruleVersion}` telemetry from the Add/Edit Product sheet and remove audit-trail jargon from the Delete Product sheet.
6. [ ] Run `lint_applet` and `compile_applet` to verify a clean build.
