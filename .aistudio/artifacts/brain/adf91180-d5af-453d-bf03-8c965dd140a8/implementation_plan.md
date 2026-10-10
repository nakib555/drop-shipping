# DeshiMart — Cloudflare Deployment Sync & Legacy Cultural Vibe Removal Plan

Eliminating the legacy `"New: বাংলাদেশ 🇧🇩 Cultural Vibe"` switcher pill from Cloudflare deployments by removing orphaned `deshimart_experience_mode` browser storage state, adding cache-control headers (`public/_headers`) so Cloudflare Pages/Workers never serve a stale `index.html` bundle, and rebuilding the clean `dist/` production bundle with the refined Login UI.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Why You Still Saw the Cultural Vibe Pill on Cloudflare & Confirmed Fix**:
> - **Root Cause 1 (Stale Cloudflare Build Artifact / Edge HTML Cache)**: When deploying to Cloudflare (`wrangler deploy` / Cloudflare Pages), if the deployment uploaded a previously built `dist/` folder or Cloudflare cached the old `index.html` pointing to an older JS bundle hash, the browser continues rendering the old `ExperienceModeSwitcher` (`"New: বাংলাদেশ 🇧🇩 Cultural Vibe"`).
> - **Root Cause 2 (Deleted Component & Orphaned Storage Cleanup)**: `src/components/shared/ExperienceModeSwitcher.tsx` has now been deleted from the repository. We will also add an automatic one-time cleanup of any legacy `deshimart_experience_mode` / `cultural_vibe` keys in `localStorage` on app boot and add `public/_headers` with `Cache-Control: no-cache, no-store, must-revalidate` on `/index.html` so Cloudflare always serves the latest build immediately upon deployment.

---

## 1. Overview & Core Concept

- **What It Does**: Guarantees that every local preview and Cloudflare deployment (`npm run cf:deploy` or `vite build`) serves the latest DeshiMart codebase—complete with the refined **Welcome Back** Login screen and zero trace of the legacy `"New: বাংলাদেশ 🇧🇩 Cultural Vibe"` switch pill.
- **Target Audience / Persona**: Developers and end users accessing DeshiMart via Cloudflare Workers/Pages (`deshimart-global-dropshipping`) on mobile and desktop browsers.
- **Key Value**: Prevents Cloudflare edge or browser HTML caching from serving outdated JavaScript bundles after a new deployment, and purges any lingering legacy mode state from returning users' browsers.

---

## 2. User Experience & Visual Design

- **Clean Viewport Canvas**:
  - Zero floating mode-switcher pills, banners, or `"New: বাংলাদেশ 🇧🇩 Cultural Vibe"` overlays anywhere in the Splash, Onboarding, Login, or Storefront screens.
  - The refined **Welcome Back** Login screen (`Plus Jakarta Sans` typography scale, `#065F46` primary emerald CTA, `#DCE7E0` crisp borders, `#F5F8F6` input surface, and `24px` brand-header-to-form separation) renders cleanly without visual interference.
- **Language & Currency Controls**:
  - Clean `EN / বাংলা` and `BDT / USD` switching remains in its proper place inside the storefront `TopAppBar` and `Settings` screen.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Enforce `no-cache` on `/index.html` via `public/_headers` for Cloudflare**
  - *Chosen Approach*: Add a Cloudflare-native `public/_headers` file that sets `Cache-Control: public, max-age=0, must-revalidate` for `/` and `/index.html`, while keeping immutable caching (`max-age=31536000, immutable`) for hashed `/assets/*` files.
  - *Why*: Vite hashes JS/CSS filenames in `/assets/*`, so caching `/index.html` at the browser or Cloudflare edge causes returning visitors to see old UI (such as the deleted Cultural Vibe pill) even after a new deployment.
- **Decision 2: Automatic Legacy Storage Sanitization on App Initialization**
  - *Chosen Approach*: Remove any residual `deshimart_experience_mode` or `deshimart_cultural_vibe` keys from `localStorage` when `DeshiMartProvider` mounts, and run a clean production `vite build` so `./dist` is 100% up to date.
  - *Why*: Ensures returning browsers on the Cloudflare domain start with a clean state.

---

## 4. Technical Architecture & Data Strategy

```
┌───────────────────────────────────────────────────────────────────────────┐
│                 Cloudflare Deployment & Cache Architecture                │
├───────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Source Code Verification                                         │  │
│  │    ├─ ExperienceModeSwitcher.tsx deleted                            │  │
│  │    ├─ SplashOnboarding.tsx (Refined Welcome Back Login Screen)      │  │
│  │    └─ DeshiMartContext.tsx (Purges legacy experience_mode keys)     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                     │                                     │
│                                     ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 2. Vite Production Build (`npm run build` -> `./dist`)              │  │
│  │    ├─ Hashed JS/CSS bundles in `dist/assets/*`                      │  │
│  │    ├─ Fresh `dist/index.html` referencing new bundle hash           │  │
│  │    └─ `dist/_headers` enforcing zero stale HTML cache on Cloudflare │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                     │                                     │
│                                     ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 3. Cloudflare Workers / Pages (`wrangler.json` -> `./dist`)         │  │
│  │    ├─ Serves fresh `/index.html` (`max-age=0, must-revalidate`)     │  │
│  │    └─ Serves hashed `/assets/*` (`max-age=31536000, immutable`)     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

### Interactive State & Verification Mapping
- **Legacy Key Sanitization**: On mount in `DeshiMartProvider`, safely remove any legacy `deshimart_experience_mode` keys from `window.localStorage`.
- **Cloudflare Asset Headers (`public/_headers`)**: Ensure Vite copies `_headers` into `dist/_headers` during `npm run build` so Cloudflare Pages/Workers immediately invalidate cached HTML upon deployment.
- **Clean Build Verification**: Run `compile_applet` / `vite build` to regenerate `./dist` and verify zero occurrences of `"Cultural Vibe"` in both `src/` and `dist/`.
