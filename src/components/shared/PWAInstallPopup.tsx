import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Download, Share, Smartphone, X } from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallPopup: React.FC = () => {
  const { currentScreen, language, showToast } = useDeshiMart();
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isDismissed,
    forceShowPopup,
    install,
    dismiss,
  } = usePWAInstall(() => {
    showToast(
      language === 'BN'
        ? 'নতুন আপডেট স্বয়ংক্রিয়ভাবে যুক্ত হয়েছে'
        : 'App updated to the latest version',
      'info'
    );
  });

  const [showGuideSteps, setShowGuideSteps] = useState(false);
  const [readyToShow, setReadyToShow] = useState(false);

  const isOnboardingScreen =
    currentScreen === 'splash' ||
    currentScreen === 'onboarding' ||
    currentScreen === 'auth' ||
    currentScreen === 'post_login_setup';

  useEffect(() => {
    if (isOnboardingScreen) {
      setReadyToShow(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setReadyToShow(true);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [isOnboardingScreen]);

  if (isInstalled) {
    return null;
  }

  const shouldDisplay =
    forceShowPopup || (!isDismissed && !isOnboardingScreen && readyToShow);

  const isBn = language === 'BN';

  const handlePrimaryInstall = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        showToast(
          isBn ? 'DeshiMart অ্যাপ ইনস্টল সম্পন্ন হয়েছে' : 'DeshiMart installed',
          'success'
        );
      }
      return;
    }
    setShowGuideSteps((prev) => !prev);
  };

  return (
    <AnimatePresence>
      {shouldDisplay && (
        <motion.div
          role="dialog"
          aria-label={isBn ? 'DeshiMart অ্যাপ ইনস্টল পপআপ' : 'Install DeshiMart App'}
          initial={{ opacity: 0, y: -20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-2.5 left-3 right-3 z-50 pointer-events-auto"
        >
          <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-app-borderStrong shadow-xl p-3.5 text-left">
            <div className="flex items-start gap-3">
              {/* App Icon */}
              <img
                src="/pwa-192x192.png"
                alt="DeshiMart"
                width={42}
                height={42}
                className="w-10.5 h-10.5 rounded-xl shrink-0 shadow-xs border border-emerald-700/15"
              />

              {/* Notification Copy */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-content-primary truncate">
                      {isBn ? 'DeshiMart অ্যাপ ইনস্টল করুন' : 'Install DeshiMart App'}
                    </h3>
                    <p className="text-[11px] text-content-secondary mt-0.5 leading-snug">
                      {isBn
                        ? 'হোম স্ক্রিন থেকে দ্রুত অ্যাক্সেস ও অটো-আপডেট পান'
                        : 'Add to home screen for instant access & auto-updates'}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={isBn ? 'পপআপ বন্ধ করুন' : 'Dismiss install notification'}
                    onClick={() => {
                      setShowGuideSteps(false);
                      dismiss();
                    }}
                    className="w-6 h-6 rounded-lg text-content-muted hover:text-content-primary hover:bg-app-subtle flex items-center justify-center shrink-0 -mr-1 -mt-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="mt-2.5 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGuideSteps(false);
                      dismiss();
                    }}
                    className="h-8 px-3 rounded-lg text-[11px] font-semibold text-content-secondary hover:bg-app-subtle transition-colors"
                  >
                    {isBn ? 'এখন নয়' : 'Not now'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handlePrimaryInstall()}
                    className="h-8 px-3.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-[11px] font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isBn ? 'ইনস্টল করুন' : 'Install'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Browser / iOS Quick Install Instructions when direct prompt is gated by browser */}
            <AnimatePresence initial={false}>
              {showGuideSteps && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-2.5 border-t border-app-border text-[11px] text-content-secondary space-y-1.5">
                    {isIOS ? (
                      <>
                        <div className="flex items-center gap-2 text-content-primary font-medium">
                          <Share className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                          <span>
                            {isBn
                              ? '১. সাফারি বারের Share বাটনে ট্যাপ করুন'
                              : '1. Tap the Share button in your browser bar'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-content-primary font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                          <span>
                            {isBn
                              ? '২. "Add to Home Screen" নির্বাচন করুন'
                              : '2. Select "Add to Home Screen"'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start gap-2 text-content-primary font-medium">
                        <Smartphone className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                        <span>
                          {isBn
                            ? 'ব্রাউজার অ্যাড্রেস বারের ইনস্টল আইকনে অথবা মেনু থেকে "Install App / Add to Home screen" এ ক্লিক করুন।'
                            : 'Click the Install icon in your browser address bar or choose "Install App" from the browser menu.'}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
