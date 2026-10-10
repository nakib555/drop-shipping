# DeshiMart — PWA Mobile Screen Sizing & Standalone Viewport Fix Plan

Fixing the Progressive Web App (PWA) mobile screen sizing, safe-area clipping, black border bleed, and install popup positioning issues.

---

## Identified Root Causes
1. **Constrained `max-w-[430px]` & Dark Outer Frame on Mobile / Standalone PWA**:
   - `MobileShell.tsx` wraps the app in `bg-slate-900` with `max-w-[430px] sm:h-[92dvh] sm:rounded-3xl`.
   - On larger phones (e.g., iPhone Pro Max / Plus at 430–448px width, Android phones at 432–480px width, or landscape/foldable devices) and in installed standalone PWA mode (`display-mode: standalone`), this leaves dark/black outer margins around the app instead of filling 100% of the mobile screen edge-to-edge.
2. **Missing `viewport-fit=cover` & Top Safe-Area Inset**:
   - `index.html` is missing `viewport-fit=cover` in `<meta name="viewport">`, and `TopAppBar.tsx` has a fixed `h-14` without `pt-[env(safe-area-inset-top,0px)]`, causing the header to collide with the mobile status bar / notch when launched as an installed PWA.
   - `index.html` `<body>` has `bg-[#0F1D17]` (dark green/black), which causes dark rubber-band overscroll flashes on mobile browsers and PWAs instead of matching `#F8FAFC`.
3. **PWA Install Pop-Up Overlapping the Top App Bar**:
   - `PWAInstallPopup.tsx` is positioned at `top-2.5` (`10px`), which sits directly on top of the `56px` (`h-14`) `TopAppBar` and blocks the brand logo, back button, and notification icon.
4. **Offline / Runtime Image Caching in Service Worker**:
   - `vite.config.ts` Workbox config only caches Google Fonts at runtime, meaning product images and API responses aren't cached when switching screens in the installed PWA.

---

## Implementation Plan
1. **True Full-Screen Mobile & Standalone PWA Layout (`MobileShell.tsx` & `index.css`)**:
   - Make `MobileShell` fill `100%` width and `100dvh` height edge-to-edge on all mobile/tablet touch viewports and whenever running in `standalone` PWA mode (`w-full h-dvh`), only applying the centered card frame on desktop (`md:max-w-[440px]`) when not in standalone mode.
   - Lock `html, body, #root` to `width: 100%; height: 100dvh; overflow: hidden; background-color: #F8FAFC; overscroll-behavior: none;` in `index.css` and `index.html` so there is zero horizontal overflow, rubber-band bounce, or dark background bleed.
2. **Mobile Safe-Area Insets (`index.html`, `TopAppBar.tsx`, `BottomTabBar.tsx`)**:
   - Update `<meta name="viewport">` in `index.html` to `width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover`.
   - Update `TopAppBar.tsx` to include top safe-area padding (`pt-[env(safe-area-inset-top,0px)] min-h-14`) and `BottomTabBar.tsx` to respect bottom safe-area insets cleanly.
3. **Non-Overlapping PWA Install Pop-Up (`PWAInstallPopup.tsx`)**:
   - Position `PWAInstallPopup` cleanly below the `TopAppBar` (`top-[calc(3.75rem+env(safe-area-inset-top,0px))]`) so it never covers the navigation bar, back button, or notification bell, and make it responsive across narrow (`320px`) to wide mobile screens.
4. **Enhanced PWA Runtime Caching (`vite.config.ts`)**:
   - Add Workbox runtime caching (`StaleWhileRevalidate` / `CacheFirst`) for product catalog API requests and remote product images so installed PWAs load images and catalog data smoothly.
