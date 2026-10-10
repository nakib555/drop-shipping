# DeshiMart — Cloudflare & Stale File Overlap Stabilization Plan

Resolving overlapping legacy files, stale service worker / Cloudflare edge caches, and unversioned browser storage that cause instability across builds.

---

## 1. Remove Overlapping Build & Legacy Artifacts
- **Clean `dev-dist/` & Build Scripts**:
  - Remove generated `dev-dist/` (`dev-dist/sw.js`, `dev-dist/workbox-*.js`) from the workspace and add `dev-dist/` and `.wrangler/` to `.gitignore` and `package.json`'s `clean` script (`rm -rf dist dev-dist .wrangler server.js`).
  - Disable `devOptions.enabled` in `vite.config.ts` when `DISABLE_HMR === 'true'` so dev-mode service worker files in `dev-dist/` never intercept or cache-lock live Vite module edits during preview, while keeping full production PWA service worker generation on `vite build`.
- **Remove Unused Legacy Stubs & Tests**:
  - Remove `NakshiStitchDivider` and `RickshawCornerMotif` stub usages from `src/components/screens/CategoriesScreen.tsx` and delete the legacy `src/components/shared/ExperienceModeSwitcher.tsx` stub file and unused `src/services/domainVerificationSuite.ts`.

---

## 2. Cloudflare Pages / Workers Cache & Routing Configuration
- **Update `public/_headers` for Cloudflare Edge & Browser Cache Safety**:
  - Ensure `index.html`, `/sw.js`, `/registerSW.js`, `/manifest.webmanifest`, and `/workbox-*.js` use strict `Cache-Control: public, max-age=0, must-revalidate` so Cloudflare and browsers never serve a stale service worker or outdated HTML shell pointing to old chunk hashes.
  - Keep `/assets/*` as `Cache-Control: public, max-age=31536000, immutable` for content-hashed Vite bundles.
- **Update `public/_routes.json` & `wrangler.json`**:
  - Exclude static PWA & icon assets (`/assets/*`, `/sw.js`, `/workbox-*.js`, `/manifest.webmanifest`, `/icon.svg`, `/*.png`) from SPA fallback interception in `public/_routes.json` so Cloudflare serves PWA and static files directly with proper MIME types.
  - Set a valid, current `compatibility_date` (`"2025-02-01"`) in `wrangler.json`.

---

## 3. Versioned Storage & Automatic Stale-Cache Purge
- **Automatic Cache & Storage Migration (`src/hooks/usePWAInstall.ts` & `src/context/DeshiMartContext.tsx`)**:
  - Introduce an explicit `APP_BUILD_VERSION = '2026.10.2'` key check on startup: if the browser holds older cached storage or legacy service workers from previous iterations, automatically purge outdated CacheStorage entries and cleanly migrate `localStorage` keys so old data shapes never overlap with current components.
