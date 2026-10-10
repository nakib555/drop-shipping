# DeshiMart — Production Architecture, Security & External Integrations Guide

## 1. Architecture Overview

DeshiMart is organized around a modular cross-border commerce architecture for Bangladesh:

- **Unified Landed Pricing & NBR Tariff Engine (`src/services/pricingAndOrderEngine.ts`, `src/utils/pricingEngine.ts`)**:
  - Centralizes all landed-cost calculations: `basePriceBdt + freightBdt + customsDutyBdt (10%) + vatBdt (15% on base + duty)`.
  - Produces versioned `PriceQuote` (`ProductLandedQuote` and `CartOrderQuote`) snapshots with deterministic `quoteId`, `ruleVersion` (`v2.4.0-BD-NBR`), FX reference metadata (`1 USD = 120 BDT`), and explicit `'estimated' | 'confirmed'` status.
  - Enforces strict voucher `minOrderBdt` and `maxDiscountBdt` constraints and 25% international air-freight consolidation savings when 2+ items are combined.
- **Live Multi-Endpoint API Catalog & Operational Hydration (`src/services/productApi.ts`)**:
  - Normalizes live product, specification, review, user address, cart/order, and guide post data from DummyJSON, FakeStoreAPI, and EscuelaJS with schema sanitization, AbortController timeouts, and session caching.
- **PCI-Safe Payment Tokenization & Idempotent Order Engine (`src/services/pricingAndOrderEngine.ts`)**:
  - Masks MFS wallet numbers (`bKash`, `Nagad`) and credit/debit card PANs (`•••• •••• •••• 8910`) via `createSafePaymentToken` and immediately purges CVV from memory upon tokenization.
  - Prevents duplicate order creation using `getOrRecordIdempotentOrder(idempotencyKey)` and revalidates stock and Bangladesh delivery address completeness via `revalidateCartBeforeOrder`.
- **Role-Guarded Admin Console & Immutable Audit Trail (`src/components/screens/AdminDashboardScreen.tsx`)**:
  - Enforces both UI-level and service-level (`assertAdminAuthorized`) role guards so customer sessions cannot access or execute admin mutations.
  - Logs all catalog, order status, voucher, and broadcast operations in an immutable `adminAuditLog`.

---

## 2. Production Credentials & External Integration Requirements

To connect DeshiMart to live production payment gateways, courier webhooks, and customs brokerage feeds in Bangladesh, configure the following server-side environment variables in your backend environment (never expose private keys in `VITE_*` browser variables):

### 2.1 Bangladesh Payment Gateways (bKash, Nagad, SSLCommerz)

- **bKash Tokenized Checkout API**:
  - `BKASH_APP_KEY` (Server-side only)
  - `BKASH_APP_SECRET` (Server-side only)
  - `BKASH_USERNAME` / `BKASH_PASSWORD`
  - `BKASH_BASE_URL` (`https://tokenized.pay.bka.sh/v1.2.0-beta`)
  - **Webhook / Callback Verification**: Verify payment execution signatures server-side before transitioning order payment state from `pending` to `paid`.
- **Nagad Merchant PGW**:
  - `NAGAD_MERCHANT_ID` (Server-side only)
  - `NAGAD_MERCHANT_PRIVATE_KEY` (Server-side only)
  - `NAGAD_PG_PUBLIC_KEY`
- **SSLCommerz 3DS Hosted Gateway (Cards)**:
  - `SSLCOMMERZ_STORE_ID` (Server-side only)
  - `SSLCOMMERZ_STORE_PASSWORD` (Server-side only)
  - `SSLCOMMERZ_IPN_URL` (Instant Payment Notification webhook endpoint)

### 2.2 Bangladesh Last-Mile Couriers & Customs Manifests

- **Pathao Courier / RedX / eCourier API**:
  - `PATHAO_CLIENT_ID`, `PATHAO_CLIENT_SECRET`
  - `REDX_ACCESS_TOKEN`
  - `ECOURIER_API_KEY`, `ECOURIER_API_SECRET`, `ECOURIER_USER_ID`
  - **Signed Tracking Webhooks**: Configure courier webhook listeners (`/api/webhooks/courier`) to verify HMAC signatures before appending verified shipment milestones.

### 2.3 Foreign Exchange & NBR Customs Tariff Feeds

- **FX Reference Feed**:
  - `FX_PROVIDER_API_KEY` (Bangladesh Bank / authorized dealer USD-to-BDT settlement rate feed).
- **Customs HS-Code Assessment**:
  - Update `HS_TAX_SCHEDULE` in `src/services/pricingAndOrderEngine.ts` or connect to your licensed customs broker tariff API when NBR updates chapter duty/VAT schedules.
