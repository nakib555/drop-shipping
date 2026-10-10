import { useCallback, useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_SESSION_KEY = 'deshimart_pwa_popup_dismissed';
const OPEN_POPUP_EVENT = 'deshimart:open-pwa-popup';
const APP_BUILD_VERSION = '2026.10.3';
const BUILD_VERSION_KEY = 'deshimart_build_version';
const CHUNK_RELOAD_GUARD_KEY = 'deshimart_chunk_reload_guard';

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
let swInitialized = false;
let isRefreshingForSwUpdate = false;

function detectStandaloneModeSync(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  } catch {
    return false;
  }
}

async function purgeStaleCachesIfNeeded() {
  if (typeof window === 'undefined') return;
  try {
    const storedVersion = localStorage.getItem(BUILD_VERSION_KEY);
    if (storedVersion !== APP_BUILD_VERSION) {
      // Remove only legacy unversioned or obsolete localStorage keys from older builds
      const obsoleteKeys = [
        'deshimart_user',
        'deshimart_user_v1',
        'deshimart_cart',
        'deshimart_wishlist',
        'deshimart_experience_mode',
        'deshimart_experience_mode_v1',
        'deshimart_cultural_vibe',
      ];
      obsoleteKeys.forEach((k) => localStorage.removeItem(k));

      // Clear only outdated runtime caches — NEVER delete active workbox-precache buckets
      // while the page is running, as Workbox cleanupOutdatedCaches handles precache rotation safely.
      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(
          cacheNames
            .filter(
              (name) =>
                !name.includes('fonts') &&
                !name.includes('workbox-precache')
            )
            .map((name) => window.caches.delete(name))
        );
      }

      // If running inside dev preview with a stale dev-dist SW registered, unregister it cleanly
      if ('serviceWorker' in navigator && import.meta.env.DEV) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          regs
            .filter((r) => r.active?.scriptURL.includes('dev-dist'))
            .map((r) => r.unregister())
        );
      }

      localStorage.setItem(BUILD_VERSION_KEY, APP_BUILD_VERSION);
    }
  } catch {
    // Ignore storage/cache access errors in restricted iframe contexts
  }
}

export function triggerPWAInstallPopup() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(DISMISS_SESSION_KEY);
    window.dispatchEvent(new CustomEvent(OPEN_POPUP_EVENT));
  }
}

export function usePWAInstall(onAutoUpdated?: () => void) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    globalDeferredPrompt
  );
  // Initialize synchronously so installed PWAs and mobile screens never flash a desktop frame on update
  const [isInstalled, setIsInstalled] = useState<boolean>(() => detectStandaloneModeSync());
  const [isIOS, setIsIOS] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  });
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(DISMISS_SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [forceShowPopup, setForceShowPopup] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Purge stale caches & register auto-updating Service Worker once
    if (!swInitialized) {
      swInitialized = true;
      void purgeStaleCachesIfNeeded();

      // Auto-recover if a new deployment invalidated a lazy-loaded JS/CSS asset
      window.addEventListener('vite:preloadError', (event) => {
        event.preventDefault();
        try {
          const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_GUARD_KEY) || '0');
          if (Date.now() - lastReload > 10000) {
            sessionStorage.setItem(CHUNK_RELOAD_GUARD_KEY, String(Date.now()));
            window.location.reload();
          }
        } catch {
          window.location.reload();
        }
      });

      // Listen for Service Worker controller swap and reload cleanly once when a new SW takes over
      if ('serviceWorker' in navigator) {
        let hadController = Boolean(navigator.serviceWorker.controller);
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!hadController) {
            hadController = true;
            return;
          }
          if (isRefreshingForSwUpdate) return;
          isRefreshingForSwUpdate = true;
          onAutoUpdated?.();
          window.location.reload();
        });
      }

      try {
        const updateSW = registerSW({
          immediate: true,
          onNeedRefresh() {
            onAutoUpdated?.();
            void updateSW(true);
          },
          onRegisteredSW(_swUrl, registration) {
            if (registration) {
              // Check for updates when the user returns to the PWA tab/window
              const checkUpdateOnVisible = () => {
                if (document.visibilityState === 'visible') {
                  void registration.update().catch(() => {});
                }
              };
              document.addEventListener('visibilitychange', checkUpdateOnVisible);
              window.addEventListener('online', checkUpdateOnVisible);

              // Periodically check for new builds so the PWA auto-updates seamlessly
              window.setInterval(() => {
                if (document.visibilityState === 'visible' && navigator.onLine) {
                  void registration.update().catch(() => {});
                }
              }, 60 * 1000);
            }
          },
        });
      } catch {
        // Ignore if virtual SW registration is unavailable in environment
      }
    }

    // 2. Detect standalone mode (already installed)
    const checkStandalone = () => {
      setIsInstalled(detectStandaloneModeSync());
    };
    checkStandalone();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => checkStandalone();
    mediaQuery.addEventListener?.('change', handleDisplayModeChange);

    // 3. Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      globalDeferredPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleAppInstalled = () => {
      globalDeferredPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
      setForceShowPopup(false);
    };

    const handleOpenPopup = () => {
      setIsDismissed(false);
      setForceShowPopup(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener(OPEN_POPUP_EVENT, handleOpenPopup);

    return () => {
      mediaQuery.removeEventListener?.('change', handleDisplayModeChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener(OPEN_POPUP_EVENT, handleOpenPopup);
    };
  }, [onAutoUpdated]);

  const install = useCallback(async () => {
    const promptToUse = deferredPrompt || globalDeferredPrompt;
    if (!promptToUse) {
      setForceShowPopup(true);
      return false;
    }
    await promptToUse.prompt();
    const { outcome } = await promptToUse.userChoice;
    if (outcome === 'accepted') {
      globalDeferredPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
      setForceShowPopup(false);
      return true;
    }
    return false;
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(DISMISS_SESSION_KEY, '1');
      } catch {
        // Ignore sessionStorage restrictions
      }
    }
    setIsDismissed(true);
    setForceShowPopup(false);
  }, []);

  return {
    isInstallable: Boolean(deferredPrompt || globalDeferredPrompt),
    isInstalled,
    isIOS,
    isDismissed,
    forceShowPopup,
    install,
    dismiss,
  };
}

