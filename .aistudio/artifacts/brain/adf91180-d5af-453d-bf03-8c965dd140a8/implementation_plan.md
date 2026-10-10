# DeshiMart — Professional Noise Cleaning in Support & Preferences Options

Refining the **Support & Preferences** section on the Account screen and all four screens inside it (**Notifications**, **Help & Support**, **Shopping Guides**, and **App Settings**) to remove internal API/developer telemetry (`Live API Sync`, `DummyJSON`, `Plus Jakarta Sans`, `Noto Sans Bengali`, `Live API Article`), redundant descriptions, and technical clutter.

## User Review & Critical Decisions

> [!IMPORTANT]
> **What is being cleaned across Support & Preferences and its inner screens**:
> 1. **Account — Support & Preferences Menu (`AccountSupportScreen.tsx`)**:
>    - Clean option titles and concise subtitles:
>      - **Notifications** (`Unread updates` / `All caught up`)
>      - **Help & Support** (`Live chat & FAQs`)
>      - **Shopping Guides** (`Import & delivery tips` — replacing `Import & Customs Guide`)
>      - **App Settings** (`{currency} · {English | বাংলা}`)
> 2. **Notifications (`AccountSupportScreen.tsx` + `productApi.ts`)**:
>    - Replace developer telemetry in live notifications (`Live API Sync`, `Verified Landed Quote`, `Inspect live API rating`) with clean shopper updates (`Order #DM...`, `Price Drop`, `Price History`) and natural relative timestamps (`2h ago`, `Yesterday`).
>    - Clean category labels and action links (`Order Update` → `Track Order`, `Price Alert` → `View Details`, `Offer` → `View Offer`).
> 3. **Help & Support (`AccountSupportScreen.tsx` + `catalogData.ts`)**:
>    - Replace developer-facing FAQs (`Where does the product catalog come from? DummyJSON, FakeStoreAPI, and Platzi API`, `international linehaul freight + Bangladesh NBR customs duty`, `tokenized 3DS cards`) with real customer support FAQs covering **All-Inclusive Pricing**, **Delivery Timeframes**, **Payment Methods**, and **Returns & Refunds**.
>    - Clean the Live Support drawer header (`DeshiMart Support` · `Online` instead of `DeshiMart Live Support (Dhaka Hub)` · `Customs & Order Specialist`) and chat input placeholder (`Write a message...`).
> 4. **Shopping Guides (`AccountSupportScreen.tsx` + `productApi.ts`)**:
>    - Clean the header banner (`Shopping Guides` — `Tips for international orders, sizing, and delivery in Bangladesh`).
>    - Replace raw DummyJSON post metadata (`Live API Article`) with clean dates (`Oct 2026`) and concise cross-border shopping guide articles.
> 5. **App Settings (`AccountSupportScreen.tsx`)**:
>    - Clean section titles (`Currency`, `Language`, `Display`).
>    - Remove internal font-family telemetry (`Plus Jakarta Sans`, `Noto Sans Bengali`) from the Language selector rows (`English` → `Default`, `বাংলা (Bengali)` → `বাংলা`).
>    - Simplify Currency right-side labels (`Default` and `$1 = ৳ 120`) and rename `High-Contrast Outdoor Legibility` to `High-Contrast Mode`.

---

## 1. Overview & Core Concept

- **What It Does**: Cleans all four screens inside **Support & Preferences** (**Notifications**, **Help & Support**, **Shopping Guides**, and **App Settings**) so every label, FAQ, notification card, guide article, and setting toggle reads like a polished consumer commerce app.
- **Key Value**: Eliminates leaked developer/API terms (`DummyJSON`, `Live API Sync`, `Plus Jakarta Sans`, `Noto Sans Bengali`, `NBR linehaul`) and visual clutter across the entire Support & Preferences experience.

---

## 2. Technical Architecture & Data Strategy

```
┌───────────────────────────────────────────────────────────────────────────┐
│            Support & Preferences Noise Cleaning Architecture              │
├───────────────────────────────────────────────────────────────────────────┤
│  1. Account Menu — Support & Preferences (`AccountSupportScreen.tsx`)     │
│     ├─ Notifications · Help & Support · Shopping Guides · App Settings    │
│     └─ Concise 2–3 word subtitles with zero internal jargon               │
│                                                                           │
│  2. Notifications Screen (`AccountSupportScreen.tsx` & `productApi.ts`)   │
│     ├─ Replaces 'Live API Sync' timestamps with '2h ago' / 'Yesterday'    │
│     ├─ Cleans notification titles & bodies (no 'Inspect live API rating') │
│     └─ Streamlines card kickers ('Order Update', 'Price Alert')           │
│                                                                           │
│  3. Help & Support Screen (`AccountSupportScreen.tsx` & `catalogData.ts`) │
│     ├─ Replaces DummyJSON/FakeStore FAQ with real shopper FAQs            │
│     ├─ Cleans 24/7 Live Chat & Call Support action cards                  │
│     └─ Simplifies Live Support bottom sheet header & input placeholder    │
│                                                                           │
│  4. Shopping Guides Screen (`AccountSupportScreen.tsx` & `productApi.ts`) │
│     ├─ Clean header card & concise shopper-focused guide articles         │
│     └─ Replaces 'Live API Article' with clean date & read-time metadata   │
│                                                                           │
│  5. App Settings Screen (`AccountSupportScreen.tsx`)                      │
│     ├─ Currency: 'BDT (৳) — Bangladeshi Taka' & 'USD ($) — US Dollar'     │
│     ├─ Language: Removes 'Plus Jakarta Sans' & 'Noto Sans Bengali' labels │
│     └─ Display: Clean 'High-Contrast Mode' toggle                         │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Proposed File Changes

1. **`src/components/screens/AccountSupportScreen.tsx`**:
   - Clean the **Support & Preferences** menu items and all 4 destination screens (**Notifications**, **Help & Support**, **Shopping Guides**, and **App Settings**).
   - Also clean the Saved Payment Methods screen subtitles (`Cash on Delivery`, `bKash`, `Nagad`, `Visa •••• 8910`, `PayPal`) for full consistency with Checkout.
2. **`src/services/productApi.ts`**:
   - Clean the generated notifications (`Order #...`, `Price Drop`, `Price History` with `2h ago` / `Yesterday` timestamps instead of `Live API Sync`) and format clean Shopping Guides without `Live API Article` labels.
3. **`src/data/catalogData.ts`**:
   - Replace developer/API FAQs in `SUPPORT_FAQS` with 4 clear, helpful customer FAQs (`Are customs duties and taxes included?`, `How long does delivery take?`, `What payment methods are accepted?`, `What is the return policy?`).
