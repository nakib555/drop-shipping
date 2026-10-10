# DeshiMart — Progressive Web App (PWA) Implementation Plan

Adding a complete, installable Progressive Web App (PWA) experience to DeshiMart with a **browser-style top pop-up install notification** and **automatic background updates** when a new version is available.

---

## 1. Web App Manifest & Compliant Brand Icons
- **Configure `vite-plugin-pwa` in `vite.config.ts`**:
  - Set `registerType: 'autoUpdate'` with `workbox.skipWaiting: true` and `workbox.clientsClaim: true` so the PWA automatically downloads, activates, and updates whenever a new version is available.
  - Enable `devOptions: { enabled: true, type: 'module' }` so the service worker and manifest work seamlessly in preview and production.
  - Configure the full Web App Manifest (`id: '/'`, `name: 'DeshiMart — Global Products, Delivered to You'`, `short_name: 'DeshiMart'`, `display: 'standalone'`, `start_url: '/'`, `scope: '/'`, `theme_color: '#047857'`, `background_color: '#F8FAFC'`).
- **App Icons & iOS Safari Compliance**:
  - Generate crisp DeshiMart brand icons in `public/`:
    - `public/icon.svg` (scalable vector brand mark)
    - `public/pwa-192x192.png` (`192x192`, `purpose: 'any'`)
    - `public/pwa-512x512.png` (`512x512`, `purpose: 'any'`)
    - `public/pwa-maskable-512x512.png` (`512x512`, `purpose: 'maskable'` with safe-zone padding)
    - `public/apple-touch-icon.png` (`180x180` PNG for iOS home screen installation)
  - Update `index.html` `<head>` with `<meta name="theme-color" content="#047857" />`, `<meta name="apple-mobile-web-app-capable" content="yes" />`, `<meta name="apple-mobile-web-app-title" content="DeshiMart" />`, and `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`.

---

## 2. Browser-Style Pop-Up Install Notification (`PWAInstallPopup.tsx`)
- **Hook (`src/hooks/usePWAInstall.ts`)**:
  - Captures the `beforeinstallprompt` event on Chromium/Android/Desktop browsers, detects standalone mode (`display-mode: standalone` / `navigator.standalone`), detects iOS Safari, and registers the auto-updating service worker (`virtual:pwa-register`) with periodic update checks.
- **Browser Pop-Up Notification UI (`src/components/shared/PWAInstallPopup.tsx`)**:
  - Appears automatically at the top of the viewport as a sleek, floating browser-style pop-up notification card (with DeshiMart app icon, title **"Install DeshiMart App"**, subtitle **"Fast access, offline browsing & instant updates"**, **"Install"** primary CTA button, and **"Not now"** / close button).
  - Clicking **Install** triggers the native browser `beforeinstallprompt.prompt()` dialog immediately (or shows a clean 2-step "Share → Add to Home Screen" pop-up on iOS Safari).
  - Automatically hides once installed (`standalone` mode) or dismissed for the session, and remains accessible on demand from **App Settings** (`Install DeshiMart App` row) if the user wants to trigger the install pop-up later.

---

## 3. Automatic Update & Offline Caching
- **Seamless Auto-Update (`registerSW`)**:
  - Uses `virtual:pwa-register` in `autoUpdate` mode so new builds activate automatically without manual intervention, accompanied by a subtle toast notification when an update is applied.
- **Workbox Runtime Caching**:
  - Caches app shell assets (`js`, `css`, `html`, `svg`, `png`) and Google Fonts (`Plus Jakarta Sans`, `Noto Sans Bengali`, `JetBrains Mono`) for instant startup and resilient browsing.
