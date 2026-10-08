import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
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

  // 1. ANIMATED SPLASH SCREEN (Screen 1 in UI Kits 1–4)
  if (currentScreen === 'splash') {
    return (
      <div className="flex-1 bg-gradient-to-b from-[#0EA75F] via-[#0A7544] to-[#0B3D2E] text-white p-6 flex flex-col justify-between items-center text-center select-none overflow-hidden relative">
        {/* Subtle Animated Background Radial Rings */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-300/20 blur-2xl pointer-events-none"
        />

        {/* Top Bar: Language Toggle + Skip to Store */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full flex items-center justify-between relative z-10"
        >
          <button
            type="button"
            onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
            className="text-xs font-bold text-white px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs transition-colors"
          >
            {language === 'EN' ? 'বাংলা' : 'English'}
          </button>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-xs font-semibold text-emerald-100 hover:text-white px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            {language === 'BN' ? 'স্টোরে যান →' : 'Skip to Store →'}
          </button>
        </motion.div>

        {/* Center Animated Brand Lockup & 3D-Style Global Logistics Scene */}
        <div className="my-auto flex flex-col items-center relative z-10">
          {/* Spring-Animated DeshiMart Shopping Bag Logo */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="relative mb-4"
          >
            <div className="w-20 h-20 rounded-3xl bg-white text-[#0EA75F] flex items-center justify-center shadow-2xl relative">
              <ShoppingBag className="w-11 h-11 stroke-[2.3]" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#00C853] text-white flex items-center justify-center border-2 border-[#0B3D2E] shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </motion.span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-3xl font-extrabold tracking-tight"
          >
            DeshiMart™
          </motion.h1>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-xs font-semibold text-emerald-100 mt-1"
          >
            {language === 'BN'
              ? 'গ্লোবাল পণ্য → আপনার দরজায়'
              : 'Global Products → Your Door'}
          </motion.p>

          {/* Animated Orbiting Globe, Cargo Plane & Customs Shield Scene */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 relative w-56 h-56 flex items-center justify-center"
          >
            {/* Outer Rotating Dashed Orbit Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-200/35"
            />

            {/* Middle Pulsing Glow Sphere */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-44 h-44 rounded-full bg-gradient-to-b from-white/20 to-emerald-950/50 backdrop-blur-xs border border-white/25 flex flex-col items-center justify-center p-4 shadow-2xl relative"
            >
              <Globe className="w-20 h-20 text-emerald-100 stroke-[1.4] mb-1.5" />
              <div className="flex items-center gap-1.5 text-[11px] font-bold bg-[#0B3D2E]/90 px-3 py-1 rounded-xl border border-emerald-400/30 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#00C853]" />
                <span>
                  {language === 'BN'
                    ? 'ল্যান্ডেড প্রাইস অন্তর্ভুক্ত'
                    : 'Landed Cost Included'}
                </span>
              </div>
            </motion.div>

            {/* Floating Air Freight Plane Badge (Top Right) */}
            <motion.div
              animate={{ x: [-4, 6, -4], y: [-6, 4, -6] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-1 right-2 w-11 h-11 rounded-2xl bg-white text-[#0EA75F] shadow-xl flex items-center justify-center border border-emerald-100"
            >
              <Plane className="w-5 h-5" />
            </motion.div>

            {/* Floating Verified Parcel Box (Bottom Left) */}
            <motion.div
              animate={{ x: [4, -5, 4], y: [4, -6, 4] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-2 left-1 w-11 h-11 rounded-2xl bg-[#00C853] text-white shadow-xl flex items-center justify-center border-2 border-white"
            >
              <Package className="w-5 h-5" />
            </motion.div>

            {/* Floating Shield Trust Badge (Bottom Right) */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-3 right-1 px-2.5 py-1 rounded-xl bg-white text-[#0B3D2E] shadow-lg text-[10px] font-extrabold flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0EA75F]" />
              <span>DropScore 9.1</span>
            </motion.div>
          </motion.div>

          {/* Staggered Tagline */}
          <motion.div
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="mt-5 space-y-1"
          >
            <p className="text-base font-extrabold text-white tracking-tight">
              {language === 'BN'
                ? 'স্মার্ট শপিং। আসল দাম। পূর্ণ আস্থা।'
                : 'Smarter Shopping. Real Confidence.'}
            </p>
            <p className="text-xs text-emerald-100/90 max-w-[260px] mx-auto">
              {language === 'BN'
                ? 'কাস্টমস ডিউটি ও ভ্যাটসহ প্রকৃত মূল্য দেখুন এবং নিশ্চিন্তে অর্ডার করুন।'
                : 'See the real landed cost · Know the supplier · Track every step.'}
            </p>
          </motion.div>
        </div>

        {/* Bottom Animated Action Zone */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="w-full space-y-2.5 relative z-10"
        >
          <button
            type="button"
            onClick={() => {
              setSlideIndex(0);
              setDirection(1);
              navigateTo('onboarding');
            }}
            className="w-full h-12 rounded-xl bg-[#00C853] hover:bg-[#0EA75F] text-white font-extrabold text-sm shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/20"
          >
            <span>{language === 'BN' ? 'শুরু করুন (Get Started)' : 'Get Started'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              navigateTo('auth');
            }}
            className="w-full py-1.5 text-xs font-medium text-emerald-100 hover:text-white"
          >
            {language === 'BN' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? ' : 'Already have an account? '}
            <span className="font-bold underline text-white">
              {language === 'BN' ? 'লগইন করুন' : 'Login'}
            </span>
          </button>
        </motion.div>
      </div>
    );
  }

  // 2. ANIMATED 3-SLIDE ONBOARDING FLOW (Screens 2, 3, 4 in UI Kits)
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
            : 'From top global brands to unique factory finds, we bring the world to Bangladesh.',
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
      <div className="flex-1 bg-white p-6 flex flex-col justify-between overflow-hidden">
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
            className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-[#0B3D2E] hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="text-xs font-bold text-[#0EA75F] px-2.5 py-1 rounded-lg bg-[#ECFDF5]"
            >
              {language === 'EN' ? 'বাংলা' : 'EN'}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-xs font-bold text-[#6B7280] hover:text-[#0B3D2E]"
            >
              {language === 'BN' ? 'স্কিপ' : 'Skip'}
            </button>
          </div>
        </div>

        {/* Animated Slide Content with AnimatePresence */}
        <div className="my-auto flex-1 flex flex-col items-center justify-center overflow-hidden py-2">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeSlide.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 70 : -70 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -70 : 70 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full flex flex-col items-center text-center"
            >
              {/* Slide-Specific Animated Vector Illustration Scene */}
              <div className="relative w-44 h-44 rounded-full bg-gradient-to-br from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0]/50 flex items-center justify-center mb-5 border border-[#0EA75F]/20 shadow-inner">
                {slideIndex === 0 && (
                  <>
                    <motion.div
                      animate={{ y: [-4, 4, -4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-24 h-24 rounded-3xl bg-[#0EA75F] text-white flex items-center justify-center shadow-lg"
                    >
                      <Globe className="w-12 h-12" />
                    </motion.div>
                    <motion.div
                      animate={{ x: [-6, 6, -6], y: [-4, 4, -4] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute top-3 right-3 w-10 h-10 rounded-2xl bg-white text-[#0EA75F] shadow-md flex items-center justify-center border border-emerald-100"
                    >
                      <Plane className="w-5 h-5" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      className="absolute bottom-3 left-3 w-10 h-10 rounded-2xl bg-[#0B3D2E] text-white shadow-md flex items-center justify-center"
                    >
                      <Package className="w-5 h-5 text-[#00C853]" />
                    </motion.div>
                  </>
                )}

                {slideIndex === 1 && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-24 h-24 rounded-3xl bg-[#0EA75F] text-white flex items-center justify-center shadow-lg"
                    >
                      <ShieldCheck className="w-12 h-12" />
                    </motion.div>
                    <motion.div
                      animate={{ y: [-4, 4, -4] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-white text-[#0B3D2E] shadow-md text-[10px] font-extrabold border border-emerald-100"
                    >
                      ৳ Landed
                    </motion.div>
                    <motion.div
                      animate={{ y: [4, -4, 4] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute bottom-3 right-2 px-2.5 py-1 rounded-xl bg-[#0B3D2E] text-white shadow-md text-[10px] font-extrabold"
                    >
                      9.1/10 Trust
                    </motion.div>
                  </>
                )}

                {slideIndex === 2 && (
                  <>
                    <motion.div
                      animate={{ x: [-4, 5, -4] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-24 h-24 rounded-3xl bg-[#0EA75F] text-white flex items-center justify-center shadow-lg"
                    >
                      <Truck className="w-12 h-12" />
                    </motion.div>
                    <motion.div
                      animate={{ y: [-5, 3, -5] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="absolute top-2 right-4 w-10 h-10 rounded-2xl bg-white text-[#0EA75F] shadow-md flex items-center justify-center border border-emerald-100"
                    >
                      <MapPin className="w-5 h-5" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.07, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute bottom-2 left-3 px-2.5 py-1 rounded-xl bg-[#0B3D2E] text-[#00C853] shadow-md text-[10px] font-mono-num font-bold"
                    >
                      7–12 Days
                    </motion.div>
                  </>
                )}
              </div>

              <h2 className="text-xl font-extrabold text-[#0B3D2E] max-w-[290px] leading-snug">
                {activeSlide.title}
              </h2>
              <p className="text-xs text-[#6B7280] mt-2 max-w-[300px] leading-relaxed">
                {activeSlide.subtitle}
              </p>

              {/* Feature Cards Stack */}
              <div className="mt-5 w-full space-y-2 text-left">
                {activeSlide.highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#0B3D2E]">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#6B7280] truncate">
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
        <div className="space-y-4 shrink-0">
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === slideIndex ? 'w-7 bg-[#0EA75F]' : 'w-2 bg-slate-200'
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
                  navigateTo('auth');
                }
              }}
              className="w-full h-12 rounded-xl bg-[#0EA75F] hover:bg-[#0B8A4D] text-white font-bold text-sm shadow-md active:scale-[0.99] transition-all"
            >
              {slideIndex < slides.length - 1
                ? language === 'BN'
                  ? 'পরবর্তী (Next)'
                  : 'Next'
                : language === 'BN'
                ? 'শুরু করুন (Get Started)'
                : 'Get Started'}
            </button>

            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="w-full py-1 text-xs font-semibold text-[#6B7280] hover:text-[#0B3D2E]"
            >
              {language === 'BN'
                ? 'সরাসরি স্টোর ব্রাউজ করুন'
                : 'Skip & Explore Store Directly'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. LOGIN / REGISTER SCREEN (Screens 5 & 6 in UI Kits)
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(emailOrPhone, authMode === 'register' ? fullName : undefined);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex-1 bg-white p-6 flex flex-col justify-between overflow-y-auto"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigateTo('onboarding')}
            className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-[#0B3D2E] hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-xs font-bold text-[#0EA75F]"
          >
            {language === 'BN' ? 'গেস্ট হিসেবে প্রবেশ করুন' : 'Continue as Guest'}
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#0EA75F] flex items-center justify-center mb-3 border border-[#0EA75F]/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-[#0B3D2E]">
            {authMode === 'login'
              ? language === 'BN'
                ? 'স্বাগতম (Welcome Back)'
                : 'Welcome Back'
              : language === 'BN'
              ? 'নতুন অ্যাকাউন্ট খুলুন'
              : 'Create Your Account'}
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            {authMode === 'login'
              ? 'Login to your DeshiMart account'
              : 'Join DeshiMart and start shopping globally'}
          </p>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-3">
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#0B3D2E] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-11 px-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#0B3D2E] focus:outline-none focus:border-[#0EA75F]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0B3D2E] mb-1">
              {authMode === 'login' ? 'Email or Phone' : 'Email Address'}
            </label>
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-11 px-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#0B3D2E] focus:outline-none focus:border-[#0EA75F]"
            />
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#0B3D2E] mb-1">
                Phone Number (Bangladesh)
              </label>
              <input
                type="tel"
                required
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+880 1712 345678"
                className="w-full h-11 px-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono-num text-[#0B3D2E] focus:outline-none focus:border-[#0EA75F]"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#0B3D2E]">Password</label>
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={() => loginUser(emailOrPhone)}
                  className="text-[11px] font-semibold text-[#0EA75F]"
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
                className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#0B3D2E] focus:outline-none focus:border-[#0EA75F]"
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#0EA75F] hover:bg-[#0B8A4D] text-white font-bold text-sm shadow-md transition-colors mt-2"
          >
            {authMode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[11px] text-[#6B7280]">or</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => loginUser('john@example.com', 'John Doe')}
            className="w-full h-11 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2.5 text-xs font-semibold text-[#0B3D2E] transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0EA75F] font-bold flex items-center justify-center text-xs">
              G
            </span>
            <span>Continue with Google</span>
          </button>
          <button
            type="button"
            onClick={() => loginUser('john@example.com', 'John Doe')}
            className="w-full h-11 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2.5 text-xs font-semibold text-[#0B3D2E] transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              f
            </span>
            <span>Continue with Facebook</span>
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-[#6B7280] mt-5">
        {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          className="font-bold text-[#0EA75F] underline"
        >
          {authMode === 'login' ? 'Register' : 'Login'}
        </button>
      </p>
    </motion.div>
  );
};
