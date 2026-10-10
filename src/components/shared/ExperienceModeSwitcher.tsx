import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Globe, Sparkles } from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { ExperienceMode, ScreenId } from '../../types/deshimart';

const DISCOVERY_SCREENS: ScreenId[] = [
  'home',
  'categories',
  'category_products',
  'product_detail',
  'supplier_store',
  'price_tracker',
  'seller_compare',
  'spec_compare',
  'wishlist',
];

/**
 * Authentic Vector Nakshi Kantha Running-Stitch Divider & Section Accent
 * Renders only when Bangladesh Vibe 🇧🇩 mode is active.
 */
export const NakshiStitchDivider: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const { experienceMode } = useDeshiMart();
  if (experienceMode !== 'bangladesh') return null;

  return (
    <div
      aria-hidden="true"
      className={`w-full flex items-center gap-1.5 py-0.5 select-none pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 18 18"
        fill="none"
        className="w-3.5 h-3.5 shrink-0"
      >
        <path
          d="M9 1.5L11.2 6.8L16.5 9L11.2 11.2L9 16.5L6.8 11.2L1.5 9L6.8 6.8L9 1.5Z"
          stroke="#006A4E"
          strokeWidth="1.5"
          fill="#E6F2EE"
        />
        <circle cx="9" cy="9" r="2.2" fill="#F42A41" />
      </svg>
      <div className="flex-1 h-[2px] dm-nakshi-stitch-bottom opacity-85" />
      <svg
        viewBox="0 0 18 18"
        fill="none"
        className="w-3.5 h-3.5 shrink-0"
      >
        <path
          d="M9 1.5L11.2 6.8L16.5 9L11.2 11.2L9 16.5L6.8 11.2L1.5 9L6.8 6.8L9 1.5Z"
          stroke="#C88A2B"
          strokeWidth="1.5"
          fill="#FFF8EB"
        />
        <circle cx="9" cy="9" r="2" fill="#006A4E" />
      </svg>
    </div>
  );
};

/**
 * Compact Section Header Medallion (Alpona / Jamdani Diamond) for Bangladesh Vibe 🇧🇩
 */
export const CulturalSectionBadge: React.FC = () => {
  const { experienceMode } = useDeshiMart();
  if (experienceMode !== 'bangladesh') return null;

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center w-4 h-4 mr-1.5 align-middle shrink-0"
    >
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
        <rect
          x="8"
          y="1.2"
          width="9.6"
          height="9.6"
          rx="1.8"
          transform="rotate(45 8 1.2)"
          fill="#E6F2EE"
          stroke="#006A4E"
          strokeWidth="1.4"
        />
        <circle cx="8" cy="8" r="2.4" fill="#F42A41" />
      </svg>
    </span>
  );
};

/**
 * Subtle Corner Craft Flourish for Product Cards, Hero Banner & Category Tiles in Mode B
 */
export const RickshawCornerMotif: React.FC<{
  variant?: 'light' | 'emerald';
  position?: 'top-left' | 'bottom-right';
}> = ({ variant = 'emerald', position = 'top-left' }) => {
  const { experienceMode } = useDeshiMart();
  if (experienceMode !== 'bangladesh') return null;

  const strokePrimary = variant === 'light' ? '#FFFDF9' : '#006A4E';
  const strokeGold = variant === 'light' ? '#FDE68A' : '#C88A2B';
  const dotFill = '#F42A41';

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 36 36"
      fill="none"
      className={`pointer-events-none select-none w-7 h-7 absolute z-[5] ${
        position === 'top-left'
          ? 'top-1.5 left-1.5'
          : 'bottom-1.5 right-1.5 rotate-180'
      }`}
    >
      <path
        d="M3 19C3 10.1634 10.1634 3 19 3"
        stroke={strokePrimary}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2.5 2.5"
        opacity="0.75"
      />
      <path
        d="M3 11C3 6.58172 6.58172 3 11 3"
        stroke={strokeGold}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="6.5" cy="6.5" r="2.2" fill={dotFill} opacity="0.9" />
      <circle cx="13" cy="4.2" r="1.1" fill={strokeGold} opacity="0.9" />
      <circle cx="4.2" cy="13" r="1.1" fill={strokeGold} opacity="0.9" />
    </svg>
  );
};

/**
 * Bespoke Cultural Empty-State & Logistics Heritage Illustration for Mode B
 */
export const BangladeshHeritageBadge: React.FC<{ label?: string }> = ({
  label,
}) => {
  const { experienceMode, language } = useDeshiMart();
  if (experienceMode !== 'bangladesh') return null;
  const isBn = language === 'BN';

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F2EE] border border-[#B2D8CB] text-[#006A4E] text-[10px] font-semibold">
      <span className="w-2 h-2 rounded-full bg-[#F42A41]" />
      <span>
        {label ||
          (isBn
            ? 'বাংলাদেশ ভাইব · নকশী কারুশিল্প সংস্করণ'
            : 'Bangladesh Vibe · Heritage Craft Edition')}
      </span>
    </div>
  );
};

/**
 * Floating Discovery Quick-Switch Pill (Global vs. বাংলাদেশ 🇧🇩)
 * Anchored cleanly on all discovery screens above the bottom navigation bar.
 */
export const FloatingExperienceModePill: React.FC = () => {
  const {
    currentScreen,
    experienceMode,
    setExperienceMode,
    language,
    showToast,
  } = useDeshiMart();
  const prefersReducedMotion = useReducedMotion();

  if (!DISCOVERY_SCREENS.includes(currentScreen)) {
    return null;
  }

  const isBn = language === 'BN';
  const isBangladeshMode = experienceMode === 'bangladesh';

  // Elevate higher on Product Detail so it never overlaps the sticky Add-to-Cart action bar
  const bottomOffsetClass =
    currentScreen === 'product_detail'
      ? 'bottom-[82px] right-3'
      : 'bottom-[68px] right-3';

  const handleSelectMode = (mode: ExperienceMode) => {
    if (mode === experienceMode) return;
    setExperienceMode(mode);
    if (mode === 'bangladesh') {
      showToast(
        isBn
          ? 'বাংলাদেশ 🇧🇩 ভাইব চালু হয়েছে — নকশী কাঁথা ও দেশীয় আবহ'
          : 'Switched to বাংলাদেশ 🇧🇩 Vibe — Cultural craft & flag emerald theme',
        'success'
      );
    } else {
      showToast(
        isBn
          ? 'Global Premium মোড চালু হয়েছে'
          : 'Switched to Global Premium Mode',
        'info'
      );
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={
        isBn
          ? 'অভিজ্ঞতা মোড নির্বাচন করুন (Global অথবা বাংলাদেশ 🇧🇩)'
          : 'Experience Mode (Global or বাংলাদেশ 🇧🇩)'
      }
      className={`absolute ${bottomOffsetClass} z-40 pointer-events-auto select-none`}
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`flex items-center p-1 rounded-full shadow-lg backdrop-blur-md border transition-colors ${
          isBangladeshMode
            ? 'bg-[#FFFDF9]/95 border-[#C88A2B]/60 shadow-[0_10px_25px_-6px_rgba(0,106,78,0.28)]'
            : 'bg-white/95 border-slate-200/90 shadow-[0_10px_25px_-6px_rgba(15,23,42,0.18)]'
        }`}
      >
        <button
          type="button"
          role="radio"
          aria-checked={!isBangladeshMode}
          aria-label="Global Premium Mode"
          onClick={() => handleSelectMode('global')}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              e.preventDefault();
              handleSelectMode(isBangladeshMode ? 'global' : 'bangladesh');
            }
          }}
          className={`relative h-7 px-2.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            !isBangladeshMode
              ? 'bg-[#0F172A] text-white shadow-2xs'
              : 'text-content-secondary hover:text-content-primary'
          }`}
        >
          <Globe className="w-3 h-3 shrink-0" />
          <span>Global</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={isBangladeshMode}
          aria-label="Bangladesh Vibe Mode (বাংলাদেশ 🇧🇩)"
          onClick={() => handleSelectMode('bangladesh')}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              e.preventDefault();
              handleSelectMode(isBangladeshMode ? 'global' : 'bangladesh');
            }
          }}
          className={`relative h-7 px-2.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            isBangladeshMode
              ? 'bg-[#006A4E] text-white shadow-2xs'
              : 'text-content-secondary hover:text-content-primary'
          }`}
        >
          {/* Authentic Bangladesh Flag Sun-Disc Emblem */}
          <span
            aria-hidden="true"
            className="w-3.5 h-3.5 rounded-full bg-[#006A4E] border border-white/50 flex items-center justify-center shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-[#F42A41]" />
          </span>
          <span>বাংলাদেশ 🇧🇩</span>
        </button>
      </motion.div>
    </div>
  );
};

/**
 * Interactive Experience Mode Studio Card for Profile & Settings Screens
 * Features side-by-side live visual swatches, cultural craft explanation, and accessible radiogroup.
 */
export const ExperienceModeStudioCard: React.FC = () => {
  const {
    experienceMode,
    setExperienceMode,
    language,
    showToast,
  } = useDeshiMart();
  const isBn = language === 'BN';

  const handleModeChange = (mode: ExperienceMode) => {
    if (mode === experienceMode) return;
    setExperienceMode(mode);
    showToast(
      mode === 'bangladesh'
        ? isBn
          ? 'বাংলাদেশ 🇧🇩 ভাইব সক্রিয় করা হয়েছে'
          : 'Activated বাংলাদেশ 🇧🇩 Vibe across DeshiMart'
        : isBn
        ? 'Global Premium মোড সক্রিয় করা হয়েছে'
        : 'Activated Global Premium Mode across DeshiMart',
      mode === 'bangladesh' ? 'success' : 'info'
    );
  };

  return (
    <section
      aria-labelledby="experience-mode-studio-heading"
      className="bg-white rounded-2xl border border-app-border p-4 space-y-3 relative overflow-hidden"
    >
      <RickshawCornerMotif position="top-left" />

      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-primary shrink-0" />
            <h2
              id="experience-mode-studio-heading"
              className="text-sm font-bold text-content-primary"
            >
              {isBn
                ? 'অভিজ্ঞতা মোড (Experience Mode)'
                : 'Experience Mode'}
            </h2>
          </div>
          <p className="text-xs text-content-secondary mt-0.5 leading-relaxed">
            {isBn
              ? 'আন্তর্জাতিক মিনিমাল ডিজাইন অথবা বাংলাদেশের নকশী কাঁথা ও পতাকার রঙের দেশীয় আবহ বেছে নিন। ভাষা পরিবর্তন স্বতন্ত্র থাকবে।'
              : 'Switch between minimal international commerce or our signature Bangladeshi cultural craft identity. Language remains independent.'}
          </p>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-labelledby="experience-mode-studio-heading"
        className="grid grid-cols-2 gap-2.5 pt-1"
      >
        {/* Mode A: Global Premium Swatch Card */}
        <button
          type="button"
          role="radio"
          aria-checked={experienceMode === 'global'}
          onClick={() => handleModeChange('global')}
          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            experienceMode === 'global'
              ? 'border-[#0F172A] bg-slate-50/90 ring-1 ring-[#0F172A]/20'
              : 'border-app-border bg-white hover:border-app-borderStrong'
          }`}
        >
          {/* Mini UI Preview Swatch */}
          <div className="w-full h-14 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-2 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-8 h-2 rounded bg-[#0F172A]" />
              <span className="w-4 h-2 rounded-full bg-[#065F46]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-white border border-[#E2E8F0]" />
              <div className="space-y-1 flex-1">
                <span className="block w-3/4 h-1.5 rounded bg-[#475569]" />
                <span className="block w-1/2 h-1.5 rounded bg-[#065F46]" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-content-primary">
                Global
              </span>
              {experienceMode === 'global' && (
                <span className="w-4 h-4 rounded-full bg-[#0F172A] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-content-secondary mt-0.5 leading-snug">
              {isBn
                ? 'মিনিমাল ও আন্তর্জাতিক'
                : 'Minimal & International'}
            </p>
          </div>
        </button>

        {/* Mode B: Bangladesh Vibe 🇧🇩 Swatch Card */}
        <button
          type="button"
          role="radio"
          aria-checked={experienceMode === 'bangladesh'}
          onClick={() => handleModeChange('bangladesh')}
          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            experienceMode === 'bangladesh'
              ? 'border-[#006A4E] bg-[#E6F2EE]/60 ring-1 ring-[#006A4E]/30'
              : 'border-app-border bg-white hover:border-app-borderStrong'
          }`}
        >
          {/* Mini UI Preview Swatch with Flag Green, Crimson Sun & Warm Ivory */}
          <div className="w-full h-14 rounded-lg bg-[#FAF6F0] border border-[#E5DEC9] overflow-hidden flex flex-col justify-between">
            <div className="h-4 px-2 bg-[#006A4E] flex items-center justify-between">
              <span className="w-7 h-1.5 rounded bg-[#FFFDF9]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F42A41]" />
            </div>
            <div className="p-1.5 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-[#FFFDF9] border border-[#C88A2B]/60 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#F42A41]" />
              </span>
              <div className="space-y-1 flex-1">
                <span className="block w-3/4 h-1.5 rounded bg-[#1B2420]" />
                <span className="block w-1/2 h-1.5 rounded bg-[#006A4E]" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-content-primary">
                বাংলাদেশ 🇧🇩
              </span>
              {experienceMode === 'bangladesh' && (
                <span className="w-4 h-4 rounded-full bg-[#006A4E] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-content-secondary mt-0.5 leading-snug">
              {isBn
                ? 'নকশী কাঁথা ও দেশীয় ভাইব'
                : 'Nakshi Craft & Flag Vibe'}
            </p>
          </div>
        </button>
      </div>
    </section>
  );
};
