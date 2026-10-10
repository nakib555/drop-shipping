# DeshiMart — Fix Cloudflare `vite build` (`[UNRESOLVED_IMPORT]`) & Sync All Clean Screen Modules

Resolving the 7 `[UNRESOLVED_IMPORT] Could not resolve '../shared/ExperienceModeSwitcher'` errors in your Cloudflare build so `npm run build` completes cleanly and deploys the updated application without any Cultural Vibe banners, pills, or Experience Mode switchers.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Root Cause from Your Cloudflare Build Log**:
> - **Why the Build Failed**: Your GitHub repository still had older versions of `MobileShell.tsx`, `CartScreen.tsx`, `OrdersTrackingScreen.tsx`, `HomeScreen.tsx`, and `AccountSupportScreen.tsx` that contained `import { ... } from "../shared/ExperienceModeSwitcher"`, while `src/components/shared/ExperienceModeSwitcher.tsx` was deleted. Because AI Studio's GitHub sync only commits files modified in the latest turn, those screen files in GitHub were not overwritten when `ExperienceModeSwitcher.tsx` was deleted.
> - **Why Cloudflare Still Showed the Old UI**: Because `npm run build` failed at `transforming...`, Cloudflare continued serving the last successful build.
> - **Complete Fix**:
>   1. **Restore `src/components/shared/ExperienceModeSwitcher.tsx` as a Null-Rendering Compatibility Module**: Export no-op (`() => null`) components for `FloatingExperienceModePill`, `BangladeshHeritageBadge`, `NakshiStitchDivider`, `RickshawCornerMotif`, `CulturalSectionBadge`, `ExperienceModeStudioCard`, `ExperienceModeHeaderPill`, `ExperienceModeBanner`, and `ExperienceModeSwitcher`. This guarantees `vite build` (Rolldown) never fails with `[UNRESOLVED_IMPORT]` and renders zero UI.
>   2. **Touch & Force-Sync All Screen/Layout Files**: Update `MobileShell.tsx`, `TopAppBar.tsx`, `HomeScreen.tsx`, `AccountSupportScreen.tsx`, `CartScreen.tsx`, `OrdersTrackingScreen.tsx`, `CheckoutFlowScreen.tsx`, `ProductDetailScreen.tsx`, `SplashOnboarding.tsx`, and `ProductCard.tsx` in this turn so GitHub Sync commits and pushes the clean versions of all of them to your repository.
>   3. **Fix Vite 8.3.4 Config Warning**: Replace `__dirname` with `import.meta.dirname` in `vite.config.ts`.

---

## 1. Overview & Core Concept

- **What It Does**: Eliminates all 7 `[UNRESOLVED_IMPORT]` errors in Cloudflare's `npm run build` step and forces a full GitHub sync of all clean screen and layout components.
- **Key Value**: Produces a zero-error, zero-warning production build on Cloudflare with all Cultural Vibe UI removed and the refined **Welcome Back** Login screen live.

---

## 2. Technical Architecture & Data Strategy

```
┌───────────────────────────────────────────────────────────────────────────┐
│                GitHub Sync & Cloudflare Build Resolution                  │
├───────────────────────────────────────────────────────────────────────────┤
│  1. src/components/shared/ExperienceModeSwitcher.tsx                      │
│     ├─ Exports safe `() => null` stubs for all legacy symbols             │
│     └─ Prevents [UNRESOLVED_IMPORT] in Vite 8.3.4 / Rolldown              │
│                                                                           │
│  2. Force-Synced Clean Screen & Layout Modules (0 Cultural Vibe UI)       │
│     ├─ src/components/layout/MobileShell.tsx                              │
│     ├─ src/components/layout/TopAppBar.tsx                                │
│     ├─ src/components/screens/HomeScreen.tsx                              │
│     ├─ src/components/screens/AccountSupportScreen.tsx                    │
│     ├─ src/components/screens/CartScreen.tsx                              │
│     ├─ src/components/screens/OrdersTrackingScreen.tsx                    │
│     ├─ src/components/screens/CheckoutFlowScreen.tsx                      │
│     ├─ src/components/screens/ProductDetailScreen.tsx                     │
│     ├─ src/components/screens/SplashOnboarding.tsx                        │
│     └─ src/components/shared/ProductCard.tsx                              │
│                                                                           │
│  3. vite.config.ts                                                        │
│     └─ Uses `import.meta.dirname` for native Vite 8.3.4 compatibility     │
└───────────────────────────────────────────────────────────────────────────┘
```
