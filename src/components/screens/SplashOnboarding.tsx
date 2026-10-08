import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Headphones,
  MapPin,
  Package,
  Plane,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';

export const SplashOnboarding: React.FC = () => {
  const { currentScreen, navigateTo, loginUser, language, setLanguage } = useDeshiMart();
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('John Doe');
  const [emailOrPhone, setEmailOrPhone] = useState('john@example.com');
  const [phoneInput, setPhoneInput] = useState('+880 1712 345678');
  const [password, setPassword] = useState('••••••••••••');
  const [showPass, setShowPass] = useState(false);

  // 1. RESPONSIVE MOBILE SPLASH SCREEN (Fits all mobile viewports cleanly without clipping)
  if (currentScreen === 'splash') {
    return (
      <div className="flex-1 min-h-full bg-slate-900 text-white px-5 py-4 flex flex-col justify-between items-center text-center select-none overflow-y-auto overflow-x-hidden relative">
        {/* Subtle Animated Background Radial Glow */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#059669]/25 blur-3xl pointer-events-none"
        />

        {/* Top Bar: Language Toggle + Skip to Store */}
        <motion.div
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="w-full flex items-center justify-between relative z-10 shrink-0"
        >
          <button
            type="button"
            onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
            className="h-8 px-3 rounded-xl text-xs leading-4 font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-colors inline-flex items-center justify-center"
          >
            {language === 'EN' ? 'বাংলা' : 'English'}
          </button>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="h-8 px-3 rounded-xl text-xs leading-4 font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors inline-flex items-center gap-1"
          >
            <span>{language === 'BN' ? 'স্টোরে যান' : 'Skip to Store'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* Center Brand Lockup & Compact Cross-Border Logistics Scene */}
        <div className="my-auto py-3 flex flex-col items-center relative z-10 w-full">
          {/* Spring-Animated DeshiMart Shopping Bag Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="relative mb-3"
          >
            <div className="w-16 h-16 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-2xl relative">
              <ShoppingBag className="w-8 h-8 stroke-[2]" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center border-2 border-slate-900 shadow-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              </motion.span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.35 }}
            className="text-2xl leading-7 font-bold tracking-tight"
          >
            DeshiMart
          </motion.h1>

          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.35 }}
            className="text-xs leading-4 font-medium text-emerald-400 mt-1"
          >
            {language === 'BN'
              ? 'গ্লোবাল পণ্য · ল্যান্ডেড প্রাইস অন্তর্ভুক্ত'
              : 'Global Products · Landed Cost Included'}
          </motion.p>

          {/* Compact Animated Orbiting Globe, Cargo Plane & Customs Shield Scene */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.45 }}
            className="mt-4 relative w-44 h-44 flex items-center justify-center shrink-0"
          >
            {/* Outer Rotating Dashed Orbit Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-slate-700/90"
            />

            {/* Middle Pulsing Glow Sphere */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-34 h-34 rounded-full bg-slate-800/90 border border-slate-700 flex flex-col items-center justify-center p-3 shadow-2xl relative"
            >
              <Globe className="w-14 h-14 text-emerald-400 stroke-[1.5] mb-1.5" />
              <div className="flex items-center gap-1 text-[10px] leading-3.5 font-semibold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 whitespace-nowrap">
                <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>
                  {language === 'BN' ? 'কোনো লুকানো চার্জ নেই' : 'Zero Hidden Tax'}
                </span>
              </div>
            </motion.div>

            {/* Floating Air Freight Plane Badge (Top Right) */}
            <motion.div
              animate={{ x: [-3, 5, -3], y: [-5, 3, -5] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 right-1 w-9 h-9 rounded-xl bg-white text-slate-900 shadow-xl flex items-center justify-center"
            >
              <Plane className="w-4 h-4" />
            </motion.div>

            {/* Floating Verified Parcel Box (Bottom Left) */}
            <motion.div
              animate={{ x: [3, -4, 3], y: [3, -5, 3] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-1 left-1 w-9 h-9 rounded-xl bg-[#059669] text-white shadow-xl flex items-center justify-center border-2 border-slate-900"
            >
              <Package className="w-4 h-4" />
            </motion.div>

            {/* Floating Shield Trust Badge (Bottom Right) */}
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-2 right-0 px-2 py-1 rounded-lg bg-white text-slate-900 shadow-lg text-[10px] leading-3.5 font-bold flex items-center gap-1 whitespace-nowrap"
            >
              <ShieldCheck className="w-3 h-3 text-[#059669] shrink-0" />
              <span>DropScore 9.1</span>
            </motion.div>
          </motion.div>

          {/* 3-Pillar Trust Strip */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.35 }}
            className="mt-4 grid grid-cols-3 gap-2 w-full max-w-[330px]"
          >
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-2 text-center">
              <p className="text-[11px] leading-4 font-bold text-white font-mono-num">
                100% Landed
              </p>
              <p className="text-[10px] leading-3.5 text-slate-400 mt-0.5">
                Duty & VAT in price
              </p>
            </div>
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-2 text-center">
              <p className="text-[11px] leading-4 font-bold text-emerald-400 font-mono-num">
                3 Routes
              </p>
              <p className="text-[10px] leading-3.5 text-slate-400 mt-0.5">
                Direct · Express · BD
              </p>
            </div>
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-2 text-center">
              <p className="text-[11px] leading-4 font-bold text-white font-mono-num">
                bKash & COD
              </p>
              <p className="text-[10px] leading-3.5 text-slate-400 mt-0.5">
                Safe local payment
              </p>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.35 }}
            className="mt-3.5 space-y-1"
          >
            <p className="text-sm leading-5 font-bold text-white tracking-tight">
              {language === 'BN'
                ? 'স্মার্ট শপিং। আসল দাম। পূর্ণ আস্থা।'
                : 'Smarter Cross-Border Shopping for Bangladesh'}
            </p>
            <p className="text-[11px] leading-4 text-slate-400 max-w-[280px] mx-auto">
              {language === 'BN'
                ? 'কাস্টমস ডিউটি ও ভ্যাটসহ প্রকৃত মূল্য দেখুন এবং নিশ্চিন্তে অর্ডার করুন।'
                : 'See the exact landed cost · Verify the supplier · Track every step.'}
            </p>
          </motion.div>
        </div>

        {/* Bottom Action Zone */}
        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.48, duration: 0.35 }}
          className="w-full space-y-2 relative z-10 shrink-0 pt-1"
        >
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="w-full h-11 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs leading-4 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#059669]/20"
          >
            <span>
              {language === 'BN'
                ? 'স্টোর ব্রাউজ করুন (Start Shopping)'
                : 'Start Shopping Now'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => {
                setSlideIndex(0);
                setDirection(1);
                navigateTo('onboarding');
              }}
              className="flex-1 h-9 rounded-xl bg-white/10 hover:bg-white/15 text-xs leading-4 font-medium text-slate-200 transition-colors"
            >
              {language === 'BN' ? 'কিভাবে কাজ করে' : 'How It Works (3 Steps)'}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                navigateTo('auth');
              }}
              className="flex-1 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs leading-4 font-medium text-white transition-colors"
            >
              {language === 'BN' ? 'লগইন / রেজিস্টার' : 'Sign In / Register'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. ANIMATED 3-SLIDE ONBOARDING FLOW (Supports touch swipe + buttons)
  if (currentScreen === 'onboarding') {
    const slides = [
      {
        id: 'slide-1',
        title:
          language === 'BN'
            ? 'বিশ্বসেরা পণ্য আপনার দরজায়'
            : 'Global Products Delivered to Your Door',
        subtitle:
          language === 'BN'
            ? 'টপ গ্লোবাল ব্র্যান্ড থেকে শুরু করে ভেরিফাইড ফ্যাক্টরির পণ্য সরাসরি বাংলাদেশে।'
            : 'From top global brands to verified factory finds, we bring the world to Bangladesh.',
        highlights: [
          {
            icon: CheckCircle2,
            title: language === 'BN' ? 'প্রকৃত ল্যান্ডেড প্রাইস' : 'True Landed Price',
            desc: 'Product + Shipping + 10% Duty + 15% VAT upfront',
          },
          {
            icon: Globe,
            title: language === 'BN' ? '৩টি রুট তুলনা করুন' : 'Compare 3 Routes',
            desc: 'Global Direct vs. Bangladesh Stock vs. Express Air',
          },
        ],
      },
      {
        id: 'slide-2',
        title:
          language === 'BN'
            ? 'নিরাপদ ও বিশ্বস্ত শপিং'
            : 'Shop Smarter with Confidence',
        subtitle:
          language === 'BN'
            ? 'ভেরিফাইড সাপ্লায়ার, নিরাপদ পেমেন্ট (ক্যাশ অন ডেলিভারি ও বিকাশ) এবং ক্রেতা সুরক্ষা।'
            : 'Verified suppliers, transparent DropScore™ ratings, and local buyer protection.',
        highlights: [
          {
            icon: ShieldCheck,
            title: language === 'BN' ? 'ভেরিফাইড সাপ্লায়ার' : 'Verified Suppliers',
            desc: 'Inspected factories with < 2% return rates',
          },
          {
            icon: Headphones,
            title: language === 'BN' ? '২৪/৭ লোকাল সাপোর্ট' : '24/7 Dhaka Support',
            desc: 'Up to 30 days return & 1-year local warranty',
          },
        ],
      },
      {
        id: 'slide-3',
        title:
          language === 'BN'
            ? 'প্রতিটি ধাপ লাইভ ট্র্যাক করুন'
            : 'Track Every Step in Real Time',
        subtitle:
          language === 'BN'
            ? 'সাপ্লায়ার ওয়্যারহাউস থেকে বাংলাদেশ কাস্টমস হয়ে আপনার বাসায় পৌঁছানো পর্যন্ত লাইভ ট্র্যাকিং।'
            : 'Real-time tracking from supplier warehouse through customs straight to your doorstep.',
        highlights: [
          {
            icon: Truck,
            title: language === 'BN' ? 'দ্রুত ডোরস্টেপ ডেলিভারি' : 'Fast Local Courier',
            desc: 'Delivered safely via eCourier, Pathao & RedX',
          },
          {
            icon: Box,
            title: language === 'BN' ? 'কাস্টমস প্রি-ক্লিয়ার্ড' : 'Customs Pre-Cleared',
            desc: 'Zero surprise tax or courier paperwork on arrival',
          },
        ],
      },
    ];

    const activeSlide = slides[slideIndex] || slides[0];

    const goToSlide = (nextIdx: number) => {
      setDirection(nextIdx > slideIndex ? 1 : -1);
      setSlideIndex(nextIdx);
    };

    return (
      <div className="flex-1 min-h-full bg-white px-5 py-4 flex flex-col justify-between overflow-y-auto overflow-x-hidden">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between shrink-0">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => {
              if (slideIndex > 0) {
                goToSlide(slideIndex - 1);
              } else {
                navigateTo('splash');
              }
            }}
            className="w-9 h-9 -ml-1.5 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="h-7 px-2.5 rounded-lg text-xs leading-4 font-semibold text-slate-700 bg-slate-100 inline-flex items-center justify-center"
            >
              {language === 'EN' ? 'বাংলা' : 'EN'}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-xs leading-4 font-medium text-slate-500 hover:text-slate-900"
            >
              {language === 'BN' ? 'স্কিপ' : 'Skip'}
            </button>
          </div>
        </div>

        {/* Animated Slide Content with Swipe Support */}
        <div className="my-auto flex-1 flex flex-col items-center justify-center overflow-hidden py-2">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeSlide.id}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -45 && slideIndex < slides.length - 1) {
                  goToSlide(slideIndex + 1);
                } else if (info.offset.x > 45 && slideIndex > 0) {
                  goToSlide(slideIndex - 1);
                }
              }}
              initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="w-full flex flex-col items-center text-center cursor-grab active:cursor-grabbing"
            >
              {/* Slide-Specific Animated Vector Illustration Scene */}
              <div className="relative w-36 h-36 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-200/80 shrink-0">
                {slideIndex === 0 && (
                  <>
                    <motion.div
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg"
                    >
                      <Globe className="w-10 h-10" />
                    </motion.div>
                    <motion.div
                      animate={{ x: [-5, 5, -5], y: [-3, 3, -3] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute top-2 right-2 w-9 h-9 rounded-xl bg-white text-[#059669] shadow-md flex items-center justify-center border border-slate-200"
                    >
                      <Plane className="w-4 h-4" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.07, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      className="absolute bottom-2 left-2 w-9 h-9 rounded-xl bg-[#059669] text-white shadow-md flex items-center justify-center"
                    >
                      <Package className="w-4 h-4" />
                    </motion.div>
                  </>
                )}

                {slideIndex === 1 && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg"
                    >
                      <ShieldCheck className="w-10 h-10" />
                    </motion.div>
                    <motion.div
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-white text-slate-900 shadow-md text-[10px] leading-3.5 font-bold border border-slate-200"
                    >
                      ৳ Landed
                    </motion.div>
                    <motion.div
                      animate={{ y: [3, -3, 3] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute bottom-2 right-1 px-2 py-1 rounded-lg bg-[#059669] text-white shadow-md text-[10px] leading-3.5 font-bold"
                    >
                      9.1/10 Trust
                    </motion.div>
                  </>
                )}

                {slideIndex === 2 && (
                  <>
                    <motion.div
                      animate={{ x: [-3, 4, -3] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg"
                    >
                      <Truck className="w-10 h-10" />
                    </motion.div>
                    <motion.div
                      animate={{ y: [-4, 3, -4] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="absolute top-1.5 right-3 w-9 h-9 rounded-xl bg-white text-[#059669] shadow-md flex items-center justify-center border border-slate-200"
                    >
                      <MapPin className="w-4 h-4" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute bottom-1.5 left-2 px-2 py-1 rounded-lg bg-[#059669] text-white shadow-md text-[10px] leading-3.5 font-mono-num font-semibold"
                    >
                      7–12 Days
                    </motion.div>
                  </>
                )}
              </div>

              <h2 className="text-lg leading-6 font-bold text-slate-900 max-w-[280px]">
                {activeSlide.title}
              </h2>
              <p className="text-xs leading-4 text-slate-500 mt-1.5 max-w-[290px]">
                {activeSlide.subtitle}
              </p>

              {/* Feature Cards Stack */}
              <div className="mt-4 w-full space-y-2 text-left">
                {activeSlide.highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 text-[#059669] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs leading-4 font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-[11px] leading-4 text-slate-500 truncate">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Pagination Dots & Primary Action Button */}
        <div className="space-y-3 shrink-0 pt-1">
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === slideIndex ? 'w-7 bg-slate-900' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                if (slideIndex < slides.length - 1) {
                  goToSlide(slideIndex + 1);
                } else {
                  navigateTo('home');
                }
              }}
              className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs leading-4 active:scale-[0.99] transition-all"
            >
              {slideIndex < slides.length - 1
                ? language === 'BN'
                  ? 'পরবর্তী (Next)'
                  : 'Next'
                : language === 'BN'
                ? 'শপিং শুরু করুন (Start Shopping)'
                : 'Start Shopping'}
            </button>

            <button
              type="button"
              onClick={() => navigateTo('auth')}
              className="w-full py-1 text-xs leading-4 font-medium text-slate-500 hover:text-slate-900"
            >
              {language === 'BN'
                ? 'অ্যাকাউন্টে লগইন বা রেজিস্টার করুন'
                : 'Sign In or Create an Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. LOGIN / REGISTER SCREEN
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(emailOrPhone, authMode === 'register' ? fullName : undefined);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex-1 min-h-full bg-white px-5 py-4 flex flex-col justify-between overflow-y-auto"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigateTo('splash')}
            className="w-9 h-9 -ml-1.5 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-xs leading-4 font-semibold text-[#059669]"
          >
            {language === 'BN' ? 'গেস্ট হিসেবে প্রবেশ করুন' : 'Continue as Guest'}
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-2.5">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h1 className="text-lg leading-6 font-bold text-slate-900">
            {authMode === 'login'
              ? language === 'BN'
                ? 'স্বাগতম (Welcome Back)'
                : 'Welcome Back'
              : language === 'BN'
              ? 'নতুন অ্যাকাউন্ট খুলুন'
              : 'Create Your Account'}
          </h1>
          <p className="text-xs leading-4 text-slate-500 mt-0.5">
            {authMode === 'login'
              ? 'Sign in to your DeshiMart account'
              : 'Join DeshiMart and start shopping globally'}
          </p>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-3">
          {authMode === 'register' && (
            <div>
              <label className="block text-xs leading-4 font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-4 text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs leading-4 font-medium text-slate-700 mb-1">
              {authMode === 'login' ? 'Email or Phone' : 'Email Address'}
            </label>
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-4 text-slate-900 focus:outline-none focus:border-slate-400"
            />
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-xs leading-4 font-medium text-slate-700 mb-1">
                Phone Number (Bangladesh)
              </label>
              <input
                type="tel"
                required
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+880 1712 345678"
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-4 font-mono-num text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs leading-4 font-medium text-slate-700">
                Password
              </label>
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={() => loginUser(emailOrPhone)}
                  className="text-[11px] leading-4 font-medium text-[#059669]"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full h-10 pl-3.5 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-4 text-slate-900 focus:outline-none focus:border-slate-400"
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400"
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs leading-4 transition-colors mt-1"
          >
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="my-3.5 flex items-center gap-3">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[11px] leading-4 text-slate-400">or</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => loginUser('john@example.com', 'John Doe')}
            className="w-full h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2.5 text-xs leading-4 font-medium text-slate-700 transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-900 font-bold flex items-center justify-center text-xs">
              G
            </span>
            <span>Continue with Google</span>
          </button>
          <button
            type="button"
            onClick={() => loginUser('john@example.com', 'John Doe')}
            className="w-full h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2.5 text-xs leading-4 font-medium text-slate-700 transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
              f
            </span>
            <span>Continue with Facebook</span>
          </button>
        </div>
      </div>

      <p className="text-center text-xs leading-4 text-slate-500 mt-4">
        {authMode === 'login'
          ? "Don't have an account? "
          : 'Already have an account? '}
        <button
          type="button"
          onClick={() =>
            setAuthMode(authMode === 'login' ? 'register' : 'login')
          }
          className="font-semibold text-[#059669] underline"
        >
          {authMode === 'login' ? 'Register' : 'Sign In'}
        </button>
      </p>
    </motion.div>
  );
};
