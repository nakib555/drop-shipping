# DeshiMart Design System & Frontend UI Specification

## 1. System Identity & Core Philosophy

DeshiMart is a tier-1 cross-border e-commerce web application for Bangladesh (importing from China, Malaysia, Singapore, and Japan with pre-cleared customs and door-to-door delivery in BDT).

The design language balances **institutional trust** (customs authority, freight reliability) with **clean modern commerce** (minimalist, scannable, mobile-first).

---

## 2. Hard Anti-AI / Negative Constraints ("Do NOT Do")

1. **NO Monochromatic "Green Overload":**
   - NEVER use the brand primary green for tags, sale badges, toggles, borders, icons, and buttons simultaneously.
   - Brand Green (`#065F46`) is reserved STRICTLY for: Primary Action CTAs, Confirmed/Delivered status, and the Active Tab indicator.

2. **NO Jargon & Buzzword Bloat:**
   - ELIMINATE pseudo-metrics like "DropScore 8.4/10" or gratuitous chips ("Verified CIF", "NBR Customs HS-Code").
   - Group technical customs data into clean, secondary disclosure accordions—do NOT place them on primary viewports.

3. **NO "Card-in-Card" Nesting:**
   - Do NOT wrap every single text block inside a rounded, bordered card.
   - Use clean 16px/24px whitespace and 1px subtle divider lines (`border-slate-200`) instead of continuous rounded boxes.

4. **NO Sticky Currency Symbols:**
   - NEVER glue the Taka symbol directly to the digits (e.g., `৳6,218`). Always format with a non-breaking space and tabular numbers: `৳ 6,218`.

5. **NO Redundant Pill Badges:**
   - Limit badges on any product image or card to a MAXIMUM of one (1) pill chip.

---

## 3. Color Tokens

- `app.bg`: `#F8FAFC` (Slate-50: Main app canvas)
- `app.surface`: `#FFFFFF` (White: Cards, bottom sheets, modals)
- `app.subtle`: `#F1F5F9` (Slate-100: Input fills, secondary chips)
- `app.border`: `#E2E8F0` (Slate-200: Crisp 1px structural borders)
- `app.borderStrong`: `#CBD5E1` (Slate-300: Hover/active inputs)
- `content.primary`: `#0F172A` (Slate-900: Titles, prices, bold numbers)
- `content.secondary`: `#475569` (Slate-600: Descriptions, specs, standard body)
- `content.muted`: `#94A3B8` (Slate-400: Placeholders, strike-through prices)
- `content.inverted`: `#FFFFFF` (White)
- `brand.primary`: `#065F46` (Emerald-800: Authoritative trust green)
- `brand.hover`: `#047857` (Emerald-700)
- `brand.subtle`: `#ECFDF5` (Emerald-50: Trust background tint)
- `brand.border`: `#A7F3D0` (Emerald-200)
- `promo.accent`: `#DC2626` (Red-600: Discounts, price drops, flash sales)
- `promo.subtle`: `#FEF2F2` (Red-50)
- `promo.border`: `#FECACA` (Red-200)
- `status.transit`: `#2563EB` (Blue-600: International Air Cargo / In Transit)
- `status.warning`: `#D97706` (Amber-600: Pending action / low stock)
- `status.success`: `#059669` (Green-600: Delivered / Verified)

---

## 4. 8pt Spatial & Typographic Grid System

### Spatial Grid Scale (Strict 8pt Multiples + 4px Sub-Grid)
- **Sub-Grid (`4px`)**: `p-1`, `py-1`, `gap-1`, `mt-1` — strictly for micro-badge vertical padding, segmented control track insets, and tight label-to-value stacking.
- **1× Grid (`8px`)**: `p-2`, `px-2`, `py-2`, `gap-2`, `space-y-2`, `mt-2` — standard inline icon-to-text gap, chip horizontal padding, and compact list row spacing.
- **1.5× Grid (`12px`)**: `p-3`, `px-3` — permitted strictly for compact 2-column mobile product cards and filter chip horizontal padding.
- **2× Grid (`16px`)**: `p-4`, `px-4`, `py-4`, `gap-4`, `space-y-4` — **Default Screen & Card Unit** (screen edge padding, card padding, 2-column grid gap, standard card stack).
- **3× Grid (`24px`)**: `p-6`, `py-6`, `gap-6`, `space-y-6` — major section separation, modal/empty-state container padding.
- **4× Grid (`32px`)**: `w-8 h-8`, `h-8` — compact stepper buttons, filter pills, and avatar badges.
- **5× Grid (`40px`)**: `w-10 h-10`, `h-10` — secondary buttons, form inputs, and icon containers.
- **6× Grid (`48px`)**: `w-12 h-12`, `h-12` — **Primary Interactive Target** (search bar, primary CTAs, navigation touch targets, product thumbnails).
- **7× Grid (`56px`)**: `h-14` — Sticky `TopAppBar` height.
- **8× Grid (`64px`)**: `h-16`, `w-16 h-16` — Fixed `BottomTabBar` height and cart item thumbnails.

---

## 5. Currency Formatter Utility Function

```typescript
export function formatLandedPrice(amount: number): string {
  // Uses non-breaking space after Bengali Taka symbol
  return `৳\u00A0${Math.round(amount).toLocaleString('en-IN')}`;
}
```
