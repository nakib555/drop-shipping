import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  Compass,
  CreditCard,
  Home,
  Lock,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { useDeshiMart } from '../../context/DeshiMartContext';
import { PaymentMethodId } from '../../types/deshimart';
import {
  BANGLADESH_DIVISION_DISTRICTS,
  getPaymentCapability,
  isValidBangladeshPhone,
  normalizeBangladeshPhone,
} from '../../utils/addressAndPaymentValidator';

interface PresetLocation {
  id: string;
  title: string;
  area: string;
  city: string;
  postalCode: string;
  streetTemplate: string;
  lat: number;
  lng: number;
  xPercent: number;
  yPercent: number;
  hubTag: string;
}

const BANGLADESH_MAP_PRESETS: PresetLocation[] = [
  {
    id: 'banani',
    title: 'Banani Block E · Road 11',
    area: 'Banani',
    city: 'Dhaka',
    postalCode: '1213',
    streetTemplate: 'House 42, Road 11, Block E, Banani',
    lat: 23.7937,
    lng: 90.4066,
    xPercent: 52,
    yPercent: 44,
    hubTag: 'Dhaka North Express Hub',
  },
  {
    id: 'gulshan2',
    title: 'Gulshan 2 · Circle Avenue',
    area: 'Gulshan 2',
    city: 'Dhaka',
    postalCode: '1212',
    streetTemplate: 'Plot 18, Road 90, Gulshan 2 Circle',
    lat: 23.7948,
    lng: 90.4143,
    xPercent: 64,
    yPercent: 36,
    hubTag: 'Diplomatic Zone Priority',
  },
  {
    id: 'dhanmondi',
    title: 'Dhanmondi · Satmasjid Road 27',
    area: 'Dhanmondi',
    city: 'Dhaka',
    postalCode: '1209',
    streetTemplate: 'House 19/A, Road 27 (Old), Dhanmondi',
    lat: 23.7461,
    lng: 90.3742,
    xPercent: 34,
    yPercent: 66,
    hubTag: 'Dhaka South Same-Day Hub',
  },
  {
    id: 'uttara',
    title: 'Uttara Sector 7 · Lake Drive',
    area: 'Uttara',
    city: 'Dhaka',
    postalCode: '1230',
    streetTemplate: 'House 14, Road 18, Sector 7, Uttara',
    lat: 23.8728,
    lng: 90.3984,
    xPercent: 46,
    yPercent: 19,
    hubTag: 'HSIA Airport Air-Freight Hub',
  },
  {
    id: 'mirpur',
    title: 'Mirpur DOHS · Avenue 3',
    area: 'Mirpur DOHS',
    city: 'Dhaka',
    postalCode: '1216',
    streetTemplate: 'House 312, Road 5, Avenue 3, Mirpur DOHS',
    lat: 23.8365,
    lng: 90.3695,
    xPercent: 25,
    yPercent: 31,
    hubTag: 'Dhaka West Metro Hub',
  },
  {
    id: 'chattogram',
    title: 'Agrabad C/A · Sheikh Mujib Rd',
    area: 'Agrabad',
    city: 'Chattogram',
    postalCode: '4100',
    streetTemplate: 'Tower 7, Agrabad Commercial Area',
    lat: 22.3264,
    lng: 91.8153,
    xPercent: 78,
    yPercent: 74,
    hubTag: 'Chattogram Port Corridor',
  },
  {
    id: 'sylhet',
    title: 'Zindabazar · Amberkhana Point',
    area: 'Zindabazar',
    city: 'Sylhet',
    postalCode: '3100',
    streetTemplate: 'House 8, VIP Road, Zindabazar',
    lat: 24.8949,
    lng: 91.8687,
    xPercent: 76,
    yPercent: 24,
    hubTag: 'Sylhet Express Air Link',
  },
];

function formatCardDisplay(raw: string): string {
  if (raw.includes('•')) return raw;
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : digits;
}

const ONBOARDING_DRAFT_SESSION_KEY = 'deshimart_onboarding_draft_v1';

interface OnboardingSessionDraft {
  wizardStep?: 1 | 2 | 3;
  entryMode?: 'map_and_write' | 'write_only';
  addrLabel?: 'Home' | 'Office' | 'Hub';
  recipientName?: string;
  recipientPhone?: string;
  streetAddress?: string;
  city?: string;
  postalCode?: string;
  deliveryNote?: string;
  selectedPayMethod?: PaymentMethodId;
  bkashNum?: string;
  nagadNum?: string;
  rocketNum?: string;
  upayNum?: string;
  cardHolder?: string;
}

function readOnboardingSessionDraft(): OnboardingSessionDraft {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return {};
    const raw = window.sessionStorage.getItem(ONBOARDING_DRAFT_SESSION_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as OnboardingSessionDraft;
  } catch {
    return {};
  }
}

export const PostLoginSetupScreen: React.FC = () => {
  const {
    user,
    addresses,
    selectedAddressId,
    addAddress,
    updateAddress,
    paymentMethod,
    setPaymentMethod,
    checkoutDraft,
    setCheckoutDraft,
    completeOnboardingSetup,
    navigateTo,
    showToast,
  } = useDeshiMart();

  const existingDefaultAddr =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const savedSessionDraft = useMemo(() => readOnboardingSessionDraft(), []);

  // Wizard Step: 1 = Address Setup, 2 = Payment Setup, 3 = Celebratory Completion
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(
    savedSessionDraft.wizardStep || 1
  );
  const [direction, setDirection] = useState<1 | -1>(1);

  // Step 1: Address Entry Mode ('map_and_write' | 'write_only')
  const [entryMode, setEntryMode] = useState<'map_and_write' | 'write_only'>(
    savedSessionDraft.entryMode || 'map_and_write'
  );
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string>('banani');
  const [pinCoords, setPinCoords] = useState<{
    lat: number;
    lng: number;
    xPercent: number;
    yPercent: number;
    hubTag: string;
  }>({
    lat: 23.7937,
    lng: 90.4066,
    xPercent: 52,
    yPercent: 44,
    hubTag: 'Dhaka North Express Hub',
  });
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [pinBounceKey, setPinBounceKey] = useState(0);
  const mapCanvasRef = useRef<HTMLDivElement | null>(null);

  // Address Form Fields
  const [addrLabel, setAddrLabel] = useState<'Home' | 'Office' | 'Hub'>(
    savedSessionDraft.addrLabel || 'Home'
  );
  const [recipientName, setRecipientName] = useState(
    savedSessionDraft.recipientName ||
      user.fullName ||
      existingDefaultAddr?.fullName ||
      'Tanvir Ahmed'
  );
  const [recipientPhone, setRecipientPhone] = useState(
    savedSessionDraft.recipientPhone ||
      user.phone ||
      existingDefaultAddr?.phone ||
      '+880 1712 345678'
  );
  const [streetAddress, setStreetAddress] = useState(
    savedSessionDraft.streetAddress ||
      existingDefaultAddr?.address ||
      'House 42, Road 11, Block E, Banani'
  );
  const [city, setCity] = useState(
    savedSessionDraft.city || existingDefaultAddr?.city || 'Dhaka'
  );
  const [postalCode, setPostalCode] = useState(
    savedSessionDraft.postalCode || existingDefaultAddr?.postalCode || '1213'
  );
  const [deliveryNote, setDeliveryNote] = useState(
    savedSessionDraft.deliveryNote ||
      checkoutDraft.deliveryNote ||
      'Call upon arrival at gate'
  );
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Step 2: Payment Setup State
  const [selectedPayMethod, setSelectedPayMethod] = useState<PaymentMethodId>(
    savedSessionDraft.selectedPayMethod ||
      (paymentMethod === 'paypal' ? 'bkash' : paymentMethod || 'bkash')
  );
  const [bkashNum, setBkashNum] = useState(
    savedSessionDraft.bkashNum || checkoutDraft.bkashPhone || '01712345678'
  );
  const [nagadNum, setNagadNum] = useState(
    savedSessionDraft.nagadNum || checkoutDraft.nagadPhone || '01819345678'
  );
  const [rocketNum, setRocketNum] = useState(
    savedSessionDraft.rocketNum || checkoutDraft.rocketPhone || '01911345678'
  );
  const [upayNum, setUpayNum] = useState(
    savedSessionDraft.upayNum || checkoutDraft.upayPhone || '01615345678'
  );
  const [cardHolder, setCardHolder] = useState(
    savedSessionDraft.cardHolder ||
      checkoutDraft.cardHolder ||
      user.fullName ||
      'Tanvir Ahmed'
  );
  const [cardNumber, setCardNumber] = useState(
    checkoutDraft.cardNumber || '•••• •••• •••• 8910'
  );
  const [cardExpiry, setCardExpiry] = useState(
    checkoutDraft.cardExpiry || '12/28'
  );
  const [cardCvv, setCardCvv] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Persist non-sensitive onboarding draft in sessionStorage (never stores card PAN or CVV)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const draftPayload: OnboardingSessionDraft = {
          wizardStep,
          entryMode,
          addrLabel,
          recipientName,
          recipientPhone,
          streetAddress,
          city,
          postalCode,
          deliveryNote,
          selectedPayMethod,
          bkashNum,
          nagadNum,
          rocketNum,
          upayNum,
          cardHolder,
        };
        window.sessionStorage.setItem(
          ONBOARDING_DRAFT_SESSION_KEY,
          JSON.stringify(draftPayload)
        );
      }
    } catch {
      // Ignore storage access errors
    }
  }, [
    wizardStep,
    entryMode,
    addrLabel,
    recipientName,
    recipientPhone,
    streetAddress,
    city,
    postalCode,
    deliveryNote,
    selectedPayMethod,
    bkashNum,
    nagadNum,
    rocketNum,
    upayNum,
    cardHolder,
  ]);

  const filteredPresets = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return BANGLADESH_MAP_PRESETS;
    return BANGLADESH_MAP_PRESETS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.postalCode.includes(q)
    );
  }, [searchText]);

  const applyPresetLocation = (preset: PresetLocation) => {
    setActivePresetId(preset.id);
    setPinCoords({
      lat: preset.lat,
      lng: preset.lng,
      xPercent: preset.xPercent,
      yPercent: preset.yPercent,
      hubTag: preset.hubTag,
    });
    setStreetAddress(preset.streetTemplate);
    setCity(preset.city);
    setPostalCode(preset.postalCode);
    setSearchText(preset.title);
    setShowSuggestions(false);
    setPinBounceKey((prev) => prev + 1);
    setAddressErrors({});
  };

  const handleMapCanvasTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(12, Math.min(88, rawX));
    const clampedY = Math.max(16, Math.min(84, rawY));

    // Find closest landmark in our coordinate grid
    let closest = BANGLADESH_MAP_PRESETS[0];
    let minDistance = Infinity;
    for (const preset of BANGLADESH_MAP_PRESETS) {
      const dist = Math.hypot(
        preset.xPercent - clampedX,
        preset.yPercent - clampedY
      );
      if (dist < minDistance) {
        minDistance = dist;
        closest = preset;
      }
    }

    const latOffset = ((50 - clampedY) * 0.0024);
    const lngOffset = ((clampedX - 50) * 0.0028);
    const newLat = Number((23.7937 + latOffset).toFixed(4));
    const newLng = Number((90.4066 + lngOffset).toFixed(4));

    setActivePresetId(closest.id);
    setPinCoords({
      lat: newLat,
      lng: newLng,
      xPercent: clampedX,
      yPercent: clampedY,
      hubTag: closest.hubTag,
    });
    setCity(closest.city);
    setPostalCode(closest.postalCode);
    setStreetAddress(
      `Pinned near ${closest.area} (${newLat}° N, ${newLng}° E)`
    );
    setPinBounceKey((prev) => prev + 1);
    setAddressErrors({});
  };

  const handleLocateMeGps = () => {
    if (isLocatingGps) return;
    setIsLocatingGps(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocatingGps(false);
          const lat = Number(pos.coords.latitude.toFixed(4));
          const lng = Number(pos.coords.longitude.toFixed(4));
          setPinCoords({
            lat,
            lng,
            xPercent: 52,
            yPercent: 44,
            hubTag: 'Live GPS Coordinates Locked',
          });
          setStreetAddress(`GPS Pin (${lat}° N, ${lng}° E), Banani Road 11`);
          setCity('Dhaka');
          setPostalCode('1213');
          setPinBounceKey((prev) => prev + 1);
          showToast('GPS location locked on map!');
        },
        () => {
          setIsLocatingGps(false);
          const gulshan = BANGLADESH_MAP_PRESETS[1];
          applyPresetLocation(gulshan);
          showToast('Locked to nearest Dhaka Express Hub');
        },
        { timeout: 3500 }
      );
    } else {
      setTimeout(() => {
        setIsLocatingGps(false);
        applyPresetLocation(BANGLADESH_MAP_PRESETS[0]);
        showToast('Locked to Banani Express Hub');
      }, 500);
    }
  };

  const handleSaveAddressAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (recipientName.trim().length < 2) {
      errs.name = 'Enter recipient full name.';
    }
    if (!isValidBangladeshPhone(recipientPhone)) {
      errs.phone = 'Enter a valid 11-digit BD mobile number (e.g., 01712345678).';
    }
    if (streetAddress.trim().length < 5) {
      errs.street = 'Enter house, road, or landmark details.';
    }
    if (!/^\d{4}$/.test(postalCode.trim())) {
      errs.postal = 'Enter a 4-digit BD postal code (e.g., 1213).';
    }

    if (Object.keys(errs).length > 0) {
      setAddressErrors(errs);
      return;
    }

    const payload = {
      label: addrLabel,
      fullName: recipientName.trim(),
      phone: normalizeBangladeshPhone(recipientPhone),
      address: streetAddress.trim(),
      city,
      postalCode: postalCode.trim(),
      lat: pinCoords.lat,
      lng: pinCoords.lng,
      isDefault: true,
    };

    if (existingDefaultAddr) {
      updateAddress(existingDefaultAddr.id, payload);
    } else {
      addAddress(payload);
    }

    setCheckoutDraft((prev) => ({
      ...prev,
      deliveryNote: deliveryNote.trim() || 'Call upon arrival',
    }));

    setAddressErrors({});
    setDirection(1);
    setWizardStep(2);
  };

  const handleCompletePaymentSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (selectedPayMethod === 'bkash') {
      if (!isValidBangladeshPhone(bkashNum)) {
        setPaymentError('Enter a valid 11-digit bKash wallet number (e.g., 01712345678).');
        return;
      }
    } else if (selectedPayMethod === 'nagad') {
      if (!isValidBangladeshPhone(nagadNum)) {
        setPaymentError('Enter a valid 11-digit Nagad wallet number (e.g., 01819345678).');
        return;
      }
    } else if (selectedPayMethod === 'rocket') {
      if (!isValidBangladeshPhone(rocketNum)) {
        setPaymentError('Enter a valid 11-digit Rocket account number (e.g., 01911345678).');
        return;
      }
    } else if (selectedPayMethod === 'upay') {
      if (!isValidBangladeshPhone(upayNum)) {
        setPaymentError('Enter a valid 11-digit Upay wallet number (e.g., 01615345678).');
        return;
      }
    } else if (selectedPayMethod === 'card') {
      const digits = cardNumber.replace(/\D/g, '');
      const isAlreadyMasked = cardNumber.includes('•') && digits.length >= 4;
      if (!isAlreadyMasked && (digits.length < 13 || digits.length > 19)) {
        setPaymentError('Enter a valid 16-digit Visa, Mastercard, or Amex number.');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) {
        setPaymentError('Enter expiry date in MM/YY format (e.g., 12/28).');
        return;
      }
      if (!isAlreadyMasked && cardCvv.trim().length > 0 && !/^\d{3,4}$/.test(cardCvv.trim())) {
        setPaymentError('Enter a valid 3 or 4 digit security CVV.');
        return;
      }
    }

    setPaymentMethod(selectedPayMethod);
    const last4 = cardNumber.replace(/\D/g, '').slice(-4) || '8910';
    setCheckoutDraft((prev) => ({
      ...prev,
      bkashPhone: normalizeBangladeshPhone(bkashNum),
      nagadPhone: normalizeBangladeshPhone(nagadNum),
      rocketPhone: normalizeBangladeshPhone(rocketNum),
      upayPhone: normalizeBangladeshPhone(upayNum),
      cardHolder: cardHolder.trim() || user.fullName,
      cardNumber: `•••• •••• •••• ${last4}`,
      cardExpiry: cardExpiry.trim(),
      cardCvv: '',
    }));

    completeOnboardingSetup();
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(ONBOARDING_DRAFT_SESSION_KEY);
      }
    } catch {
      // Ignore storage access errors
    }

    setDirection(1);
    setWizardStep(3);
  };

  const paymentMethodBadges: {
    id: PaymentMethodId;
    title: string;
    subtitle: string;
    accentBg: string;
    accentBorder: string;
    accentText: string;
    tag: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: 'bkash',
      title: 'bKash',
      subtitle: 'Instant MFS Escrow',
      accentBg: 'from-[#D12053] to-[#9E143B]',
      accentBorder: 'border-[#D12053]',
      accentText: 'text-[#D12053]',
      tag: 'Most Popular',
      icon: Smartphone,
    },
    {
      id: 'nagad',
      title: 'Nagad',
      subtitle: 'Fast BD Mobile Banking',
      accentBg: 'from-[#F7941D] to-[#C94A18]',
      accentBorder: 'border-[#EA580C]',
      accentText: 'text-[#EA580C]',
      tag: 'Low Fee',
      icon: Wallet,
    },
    {
      id: 'card',
      title: 'Visa / Mastercard / Amex',
      subtitle: '3D Secure Tokenized Card',
      accentBg: 'from-[#065F46] via-[#047857] to-[#0F172A]',
      accentBorder: 'border-[#059669]',
      accentText: 'text-[#059669]',
      tag: 'Global 3DS',
      icon: CreditCard,
    },
    {
      id: 'rocket',
      title: 'DBBL Rocket',
      subtitle: 'Dutch-Bangla MFS Wallet',
      accentBg: 'from-[#7E22CE] to-[#4C1D95]',
      accentBorder: 'border-[#7E22CE]',
      accentText: 'text-[#7E22CE]',
      tag: 'Instant',
      icon: Smartphone,
    },
    {
      id: 'upay',
      title: 'UCB Upay',
      subtitle: 'Digital MFS Wallet',
      accentBg: 'from-[#0284C7] to-[#1E3A8A]',
      accentBorder: 'border-[#0284C7]',
      accentText: 'text-[#0284C7]',
      tag: 'Zero Charge',
      icon: Wallet,
    },
    {
      id: 'cod',
      title: 'Cash on Delivery',
      subtitle: 'Pay BDT Cash at Doorstep',
      accentBg: 'from-[#0F1D17] to-[#1E3A2F]',
      accentBorder: 'border-[#0F1D17]',
      accentText: 'text-[#0F1D17]',
      tag: '0% Advance',
      icon: Banknote,
    },
  ];

  const activePaymentMeta =
    paymentMethodBadges.find((p) => p.id === selectedPayMethod) ||
    paymentMethodBadges[0];

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between bg-[#F7FAF8] text-[#0F1D17] overflow-hidden select-none">
      {/* ===================== STICKY PROGRESS HEADER (<12% VIEWPORT HEIGHT) ===================== */}
      <header className="shrink-0 bg-white/95 backdrop-blur-md border-b border-[#DCE7E0] px-4 pt-3 pb-2.5 z-20">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {wizardStep === 2 ? (
              <button
                type="button"
                aria-label="Back to Address Setup"
                onClick={() => {
                  setDirection(-1);
                  setWizardStep(1);
                }}
                className="w-10 h-10 -ml-1.5 rounded-full grid place-items-center text-[#0F1D17] hover:bg-[#EFF5F2] active:scale-95 transition-all shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669]">
                  {wizardStep === 1
                    ? 'Step 1 of 2'
                    : wizardStep === 2
                    ? 'Step 2 of 2'
                    : 'Setup Complete'}
                </span>
                <span className="text-xs text-[#94A3B8]">·</span>
                <span className="text-[11px] font-medium text-[#4A5E55] truncate">
                  {wizardStep === 1
                    ? 'Delivery Location'
                    : wizardStep === 2
                    ? 'Payment Preference'
                    : 'Ready to Shop'}
                </span>
              </div>
              <h1 className="text-[15px] font-bold text-[#0F1D17] truncate">
                {wizardStep === 1
                  ? 'Set Up Delivery Address'
                  : wizardStep === 2
                  ? 'Set Up Payment Method'
                  : 'Profile Ready for Checkout'}
              </h1>
            </div>
          </div>

          {wizardStep < 3 && (
            <button
              type="button"
              onClick={() => {
                completeOnboardingSetup();
                try {
                  if (typeof window !== 'undefined' && window.sessionStorage) {
                    window.sessionStorage.removeItem(ONBOARDING_DRAFT_SESSION_KEY);
                  }
                } catch {
                  // Ignore storage access errors
                }
                showToast('Setup skipped — you can update anytime in Profile', 'info');
                navigateTo('home');
              }}
              className="min-h-[40px] px-3 rounded-xl text-xs font-semibold text-[#4A5E55] hover:text-[#0F1D17] hover:bg-[#EFF5F2] transition-colors whitespace-nowrap shrink-0"
            >
              Skip for now →
            </button>
          )}
        </div>

        {/* Animated Segmented Progress Bar */}
        <div className="grid grid-cols-2 gap-2 mt-2.5">
          <div className="h-1.5 rounded-full bg-[#E2ECE7] overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="h-full bg-[#059669] rounded-full"
            />
          </div>
          <div className="h-1.5 rounded-full bg-[#E2ECE7] overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: wizardStep >= 2 ? '100%' : '0%' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="h-full bg-[#059669] rounded-full"
            />
          </div>
        </div>
      </header>

      {/* ===================== ANIMATED STEP BODY ===================== */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-3.5 select-text">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          {/* ===================================================================
              STEP 1: INTERACTIVE MAP PIN-DROP + MANUAL ADDRESS FORM
             =================================================================== */}
          {wizardStep === 1 && (
            <motion.div
              key="setup-step-address"
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3.5 pb-4"
            >
              {/* Mode Switcher: Interactive Map + Form vs Write Manually */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#E6F0EB] border border-[#DCE7E0]">
                <button
                  type="button"
                  onClick={() => setEntryMode('map_and_write')}
                  className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                    entryMode === 'map_and_write'
                      ? 'bg-white text-[#059669] shadow-xs'
                      : 'text-[#4A5E55] hover:text-[#0F1D17]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Pin on Map + Write</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEntryMode('write_only')}
                  className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                    entryMode === 'write_only'
                      ? 'bg-white text-[#059669] shadow-xs'
                      : 'text-[#4A5E55] hover:text-[#0F1D17]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Write Manually Only</span>
                </button>
              </div>

              {/* INTERACTIVE CARTOGRAPHIC MAP CANVAS (WHEN MAP MODE ACTIVE) */}
              <AnimatePresence initial={false}>
                {entryMode === 'map_and_write' && (
                  <motion.div
                    key="interactive-map-panel"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border border-[#DCE7E0] overflow-hidden shadow-xs"
                  >
                    {/* Search Bar + GPS Locate Button */}
                    <div className="p-2.5 border-b border-[#E6F0EB] relative z-20">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Search className="w-3.5 h-3.5 text-[#5E7168] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={searchText}
                            onFocus={() => setShowSuggestions(true)}
                            onChange={(e) => {
                              setSearchText(e.target.value);
                              setShowSuggestions(true);
                            }}
                            placeholder="Search Banani, Dhanmondi, Gulshan, Uttara..."
                            className="w-full h-9 pl-8 pr-7 rounded-xl bg-[#F4F8F6] border border-[#DCE7E0] text-xs text-[#0F1D17] placeholder:text-[#7A8E84] focus:outline-none focus:border-[#059669] focus:bg-white transition-all"
                          />
                          {searchText && (
                            <button
                              type="button"
                              aria-label="Clear search"
                              onClick={() => {
                                setSearchText('');
                                setShowSuggestions(false);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7A8E84] hover:text-[#0F1D17]"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleLocateMeGps}
                          disabled={isLocatingGps}
                          className="h-9 px-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-[11px] font-semibold inline-flex items-center gap-1 hover:bg-[#D1FAE5] active:scale-95 transition-all shrink-0 whitespace-nowrap"
                        >
                          <Navigation
                            className={`w-3.5 h-3.5 ${
                              isLocatingGps ? 'animate-spin' : ''
                            }`}
                          />
                          <span>{isLocatingGps ? 'Locating...' : 'GPS Pin'}</span>
                        </button>
                      </div>

                      {/* Autocomplete Dropdown Suggestions */}
                      {showSuggestions && filteredPresets.length > 0 && (
                        <div className="absolute left-2.5 right-2.5 top-[48px] bg-white rounded-xl border border-[#DCE7E0] shadow-lg max-h-44 overflow-y-auto z-30 divide-y divide-[#EFF5F2]">
                          {filteredPresets.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => applyPresetLocation(preset)}
                              className="w-full px-3 py-2 text-left hover:bg-[#F4F8F6] flex items-center justify-between gap-2 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <MapPin className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#0F1D17] truncate">
                                    {preset.title}
                                  </p>
                                  <p className="text-[10.5px] text-[#5E7168] truncate">
                                    {preset.streetTemplate} · {preset.city} {preset.postalCode}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold text-[#059669] shrink-0">
                                Select
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Interactive Cartographic Map Surface (Tap anywhere to drop pin) */}
                    <div
                      ref={mapCanvasRef}
                      onClick={handleMapCanvasTap}
                      role="application"
                      aria-label="Interactive Bangladesh delivery map — tap anywhere to drop your delivery pin"
                      className="relative h-[188px] w-full bg-[#E8F1EC] cursor-crosshair overflow-hidden select-none"
                    >
                      {/* Stylized Vector Street & River Topology SVG */}
                      <svg
                        viewBox="0 0 400 200"
                        className="w-full h-full object-cover"
                        aria-hidden="true"
                      >
                        <defs>
                          <pattern
                            id="dm-map-grid"
                            width="28"
                            height="28"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 28 0 L 0 0 0 28"
                              fill="none"
                              stroke="#D5E3DC"
                              strokeWidth="0.8"
                            />
                          </pattern>
                        </defs>
                        <rect width="400" height="200" fill="url(#dm-map-grid)" />

                        {/* Green Urban Park Zones */}
                        <path
                          d="M40 35 Q85 20 120 55 Q95 85 50 70 Z"
                          fill="#D1E7DA"
                          opacity="0.7"
                        />
                        <path
                          d="M250 110 Q310 95 345 140 Q300 175 245 150 Z"
                          fill="#D1E7DA"
                          opacity="0.7"
                        />

                        {/* Buriganga & Turag River Waterways */}
                        <path
                          d="M-10 145 C 80 125, 160 175, 260 155 C 320 140, 370 165, 410 150"
                          fill="none"
                          stroke="#99C5DF"
                          strokeWidth="12"
                          strokeLinecap="round"
                        />
                        <path
                          d="M195 -10 C 205 55, 235 95, 260 155"
                          fill="none"
                          stroke="#A8D0E6"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />

                        {/* Major Arterial Highways & Express Corridors */}
                        <path
                          d="M20 170 L 185 90 L 370 35"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M65 15 L 185 90 L 295 185"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M15 85 Q 185 90 385 95"
                          fill="none"
                          stroke="#F6C453"
                          strokeWidth="3"
                          strokeDasharray="6 4"
                        />

                        {/* Landmark Zone Labels */}
                        <g fill="#486156" fontSize="8.5" fontWeight="600" opacity="0.78">
                          <text x="152" y="34">UTTARA AIR HUB</text>
                          <text x="72" y="64">MIRPUR DOHS</text>
                          <text x="208" y="68">GULSHAN 2</text>
                          <text x="165" y="102">BANANI</text>
                          <text x="95" y="132">DHANMONDI</text>
                          <text x="275" y="146">CHATTOGRAM CORRIDOR</text>
                        </g>
                      </svg>

                      {/* Interactive Preset Node Dots on Map */}
                      {BANGLADESH_MAP_PRESETS.map((p) => {
                        const isCurrent = p.id === activePresetId;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              applyPresetLocation(p);
                            }}
                            style={{
                              left: `${p.xPercent}%`,
                              top: `${p.yPercent}%`,
                            }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                            aria-label={`Pin ${p.area}`}
                          >
                            <span
                              className={`block rounded-full transition-all ${
                                isCurrent
                                  ? 'w-3 h-3 bg-[#059669] ring-4 ring-[#059669]/25'
                                  : 'w-2.5 h-2.5 bg-white border-2 border-[#059669] hover:scale-125'
                              }`}
                            />
                          </button>
                        );
                      })}

                      {/* Animated Dropping Pin Marker */}
                      <motion.div
                        key={pinBounceKey}
                        initial={{ y: -24, scale: 0.85, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 22,
                        }}
                        style={{
                          left: `${pinCoords.xPercent}%`,
                          top: `${pinCoords.yPercent}%`,
                        }}
                        className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-10 flex flex-col items-center"
                      >
                        <div className="px-2 py-0.5 rounded-full bg-[#0F1D17] text-white text-[10px] font-semibold shadow-md whitespace-nowrap mb-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          <span>{city} · {postalCode}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#059669] text-white flex items-center justify-center shadow-lg border-2 border-white">
                          <MapPin className="w-4 h-4 fill-white/20" />
                        </div>
                        <div className="w-3 h-1 rounded-full bg-black/25 mt-0.5" />
                      </motion.div>

                      {/* Bottom Floating Coordinate & Hub Status Pill */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-white/92 backdrop-blur-xs border border-[#DCE7E0] text-[11px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Compass className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                          <span className="font-semibold text-[#0F1D17] truncate">
                            {pinCoords.hubTag}
                          </span>
                        </div>
                        <span className="font-mono-num text-[10.5px] text-[#4A5E55] shrink-0">
                          {pinCoords.lat.toFixed(4)}°N, {pinCoords.lng.toFixed(4)}°E
                        </span>
                      </div>
                    </div>

                    {/* Quick Area Chips Strip */}
                    <div className="px-2.5 py-2 bg-[#F8FBF9] border-t border-[#E6F0EB] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      <span className="text-[10.5px] font-semibold text-[#5E7168] shrink-0 pr-1">
                        Quick Pin:
                      </span>
                      {BANGLADESH_MAP_PRESETS.map((preset) => {
                        const active = preset.id === activePresetId;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => applyPresetLocation(preset)}
                            className={`h-7 px-2.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                              active
                                ? 'bg-[#059669] text-white'
                                : 'bg-white border border-[#DCE7E0] text-[#33433A] hover:border-[#059669]'
                            }`}
                          >
                            {preset.area}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MANUAL ADDRESS FORM (SYNCHRONIZED WITH MAP SELECTION) */}
              <form
                id="post-login-address-form"
                onSubmit={handleSaveAddressAndContinue}
                noValidate
                className="bg-white rounded-2xl border border-[#DCE7E0] p-3.5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F1D17]">
                    Delivery Address Details
                  </span>
                  <div className="flex items-center gap-1">
                    {(['Home', 'Office', 'Hub'] as const).map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setAddrLabel(lbl)}
                        className={`h-7 px-2.5 rounded-lg text-[11px] font-semibold transition-colors ${
                          addrLabel === lbl
                            ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                            : 'bg-[#F4F8F6] text-[#5E7168] hover:text-[#0F1D17]'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label
                      htmlFor="setup-recipient-name"
                      className="block text-[11.5px] font-semibold text-[#33433A] mb-1"
                    >
                      Recipient Full Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[#7A8E84] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="setup-recipient-name"
                        type="text"
                        value={recipientName}
                        onChange={(e) => {
                          setRecipientName(e.target.value);
                          if (addressErrors.name) {
                            setAddressErrors((prev) => ({ ...prev, name: '' }));
                          }
                        }}
                        placeholder="Tanvir Ahmed"
                        className="w-full h-10 pl-8 pr-3 rounded-xl bg-[#F8FBF9] border border-[#DCE7E0] text-xs font-medium text-[#0F1D17] focus:outline-none focus:border-[#059669] focus:bg-white"
                      />
                    </div>
                    {addressErrors.name && (
                      <p className="mt-1 text-[11px] text-[#B42318] font-medium">
                        {addressErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="setup-recipient-phone"
                      className="block text-[11.5px] font-semibold text-[#33433A] mb-1"
                    >
                      BD Mobile Number
                    </label>
                    <div className="relative">
                      <Smartphone className="w-3.5 h-3.5 text-[#7A8E84] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="setup-recipient-phone"
                        type="tel"
                        value={recipientPhone}
                        onChange={(e) => {
                          setRecipientPhone(e.target.value);
                          if (addressErrors.phone) {
                            setAddressErrors((prev) => ({ ...prev, phone: '' }));
                          }
                        }}
                        placeholder="+880 1712 345678"
                        className="w-full h-10 pl-8 pr-3 rounded-xl bg-[#F8FBF9] border border-[#DCE7E0] text-xs font-medium font-mono-num text-[#0F1D17] focus:outline-none focus:border-[#059669] focus:bg-white"
                      />
                    </div>
                    {addressErrors.phone && (
                      <p className="mt-1 text-[11px] text-[#B42318] font-medium">
                        {addressErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Street / House / Road */}
                <div>
                  <label
                    htmlFor="setup-street-address"
                    className="block text-[11.5px] font-semibold text-[#33433A] mb-1"
                  >
                    House, Road, Block & Area
                  </label>
                  <div className="relative">
                    <Home className="w-3.5 h-3.5 text-[#7A8E84] absolute left-3 top-3" />
                    <input
                      id="setup-street-address"
                      type="text"
                      value={streetAddress}
                      onChange={(e) => {
                        setStreetAddress(e.target.value);
                        if (addressErrors.street) {
                          setAddressErrors((prev) => ({ ...prev, street: '' }));
                        }
                      }}
                      placeholder="House 42, Road 11, Block E, Banani"
                      className="w-full h-10 pl-8 pr-3 rounded-xl bg-[#F8FBF9] border border-[#DCE7E0] text-xs font-medium text-[#0F1D17] focus:outline-none focus:border-[#059669] focus:bg-white"
                    />
                  </div>
                  {addressErrors.street && (
                    <p className="mt-1 text-[11px] text-[#B42318] font-medium">
                      {addressErrors.street}
                    </p>
                  )}
                </div>

                {/* District & Postal Code */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label
                      htmlFor="setup-district"
                      className="block text-[11.5px] font-semibold text-[#33433A] mb-1"
                    >
                      District / City
                    </label>
                    <select
                      id="setup-district"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#F8FBF9] border border-[#DCE7E0] text-xs font-medium text-[#0F1D17] focus:outline-none focus:border-[#059669] focus:bg-white"
                    >
                      {BANGLADESH_DIVISION_DISTRICTS.map((group) => (
                        <optgroup key={group.division} label={group.division}>
                          {group.districts.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="setup-postal"
                      className="block text-[11.5px] font-semibold text-[#33433A] mb-1"
                    >
                      Postal Code (BD)
                    </label>
                    <input
                      id="setup-postal"
                      type="text"
                      maxLength={4}
                      value={postalCode}
                      onChange={(e) => {
                        setPostalCode(e.target.value);
                        if (addressErrors.postal) {
                          setAddressErrors((prev) => ({ ...prev, postal: '' }));
                        }
                      }}
                      placeholder="1213"
                      className="w-full h-10 px-3 rounded-xl bg-[#F8FBF9] border border-[#DCE7E0] text-xs font-medium font-mono-num text-[#0F1D17] focus:outline-none focus:border-[#059669] focus:bg-white"
                    />
                    {addressErrors.postal && (
                      <p className="mt-1 text-[11px] text-[#B42318] font-medium">
                        {addressErrors.postal}
                      </p>
                    )}
                  </div>
                </div>

                {/* Courier Note */}
                <div>
                  <label
                    htmlFor="setup-courier-note"
                    className="block text-[11.5px] font-semibold text-[#33433A] mb-1"
                  >
                    Delivery Landmark / Gate Instruction (Optional)
                  </label>
                  <input
                    id="setup-courier-note"
                    type="text"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="Call upon arrival at gate"
                    className="w-full h-9 px-3 rounded-xl bg-[#F8FBF9] border border-[#DCE7E0] text-xs text-[#0F1D17] focus:outline-none focus:border-[#059669] focus:bg-white"
                  />
                </div>
              </form>
            </motion.div>
          )}

          {/* ===================================================================
              STEP 2: ANIMATED PAYMENT METHOD SETUP
             =================================================================== */}
          {wizardStep === 2 && (
            <motion.div
              key="setup-step-payment"
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3.5 pb-4"
            >
              {/* Animated 3D-Styled Live Wallet / Card Preview */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPayMethod}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative rounded-2xl p-4 text-white bg-gradient-to-br ${activePaymentMeta.accentBg} shadow-md overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 block">
                        DeshiMart Verified Escrow
                      </span>
                      <h2 className="text-base font-bold mt-0.5">
                        {activePaymentMeta.title}
                      </h2>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-white/18 backdrop-blur-xs text-[10.5px] font-semibold">
                      {activePaymentMeta.tag}
                    </span>
                  </div>

                  {/* Dynamic Card / Wallet Number Readout */}
                  <div className="mt-4 mb-3">
                    {selectedPayMethod === 'card' ? (
                      <p className="font-mono-num text-base font-bold tracking-widest">
                        {formatCardDisplay(cardNumber) || '4532 •••• •••• 8910'}
                      </p>
                    ) : selectedPayMethod === 'cod' ? (
                      <p className="text-sm font-semibold text-white/95">
                        Pay BDT Cash Upon Doorstep Parcel Inspection
                      </p>
                    ) : (
                      <p className="font-mono-num text-base font-bold tracking-wider">
                        {selectedPayMethod === 'bkash' && (bkashNum || '017XXXXXXXX')}
                        {selectedPayMethod === 'nagad' && (nagadNum || '018XXXXXXXX')}
                        {selectedPayMethod === 'rocket' && (rocketNum || '019XXXXXXXX')}
                        {selectedPayMethod === 'upay' && (upayNum || '016XXXXXXXX')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-white/85 pt-2 border-t border-white/15">
                    <span className="truncate">
                      {selectedPayMethod === 'card'
                        ? cardHolder || user.fullName
                        : `Delivering to ${city} (${postalCode})`}
                    </span>
                    <span className="font-mono-num font-semibold shrink-0">
                      {selectedPayMethod === 'card'
                        ? `EXP ${cardExpiry || '12/28'}`
                        : '100% Duty & VAT Locked'}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* 6-Option Payment Method Grid */}
              <div>
                <label className="block text-xs font-bold text-[#0F1D17] mb-2">
                  Choose Your Default Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethodBadges.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedPayMethod === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedPayMethod(item.id);
                          setPaymentError(null);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-[#ECFDF5]/70 border-[#059669] ring-2 ring-[#059669]/15'
                            : 'bg-white border-[#DCE7E0] hover:border-[#A7C4B5]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#059669] text-white'
                                : 'bg-[#F4F8F6] text-[#4A5E55]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-[#5E7168]">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0F1D17] truncate">
                            {item.title}
                          </p>
                          <p className="text-[10.5px] text-[#5E7168] truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Method Configuration Form */}
              <form
                id="post-login-payment-form"
                onSubmit={handleCompletePaymentSetup}
                noValidate
                className="bg-white rounded-2xl border border-[#DCE7E0] p-3.5 space-y-3 shadow-xs"
              >
                {(selectedPayMethod === 'bkash' ||
                  selectedPayMethod === 'nagad' ||
                  selectedPayMethod === 'rocket' ||
                  selectedPayMethod === 'upay') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="setup-wallet-phone"
                        className="text-xs font-bold text-[#0F1D17]"
                      >
                        {activePaymentMeta.title} Account Number (BD)
                      </label>
                      <span className="text-[11px] font-semibold text-[#059669] inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Tokenized MFS</span>
                      </span>
                    </div>
                    <input
                      id="setup-wallet-phone"
                      type="tel"
                      value={
                        selectedPayMethod === 'bkash'
                          ? bkashNum
                          : selectedPayMethod === 'nagad'
                          ? nagadNum
                          : selectedPayMethod === 'rocket'
                          ? rocketNum
                          : upayNum
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedPayMethod === 'bkash') setBkashNum(val);
                        else if (selectedPayMethod === 'nagad') setNagadNum(val);
                        else if (selectedPayMethod === 'rocket') setRocketNum(val);
                        else setUpayNum(val);
                        setPaymentError(null);
                      }}
                      placeholder="01712345678"
                      className="w-full h-10 px-3.5 rounded-xl bg-[#F8FBF9] border border-[#DCE7E0] font-mono-num text-xs font-semibold text-[#0F1D17] focus:outline-none focus:border-[#059669] focus:bg-white"
                    />
                    <p className="text-[11px] text-[#5E7168] leading-relaxed">
                      {getPaymentCapability(selectedPayMethod).verificationNotice}
                    </p>
                  </div>
                )}

                {selectedPayMethod === 'card' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F1D17]">
                        Card Details (Visa / Mastercard / Amex)
                      </span>
                      <span className="text-[11px] font-semibold text-[#059669] inline-flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>PCI-DSS 3DS</span>
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#33433A] mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => {
                          setCardHolder(e.target.value);
                          setPaymentError(null);
                        }}
                        placeholder="Tanvir Ahmed"
                        className="w-full h-10 px-3 rounded-xl bg-[#F8FBF9] border border-[#DCE7E0] text-xs font-medium text-[#0F1D17] focus:outline-none focus:border-[#059669] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#33433A] mb-1">
                        16-Digit Card Number
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        value={formatCardDisplay(cardNumber)}
                        onChange={(e) => {
                          setCardNumber(e.target.value);
                          setPaymentError(null);
                        }}
                        placeholder="4532 7812 3490 8910"
                        className="w-full h-10 px-3 rounded-xl bg-[#F8FBF9] border border-[#DCE7E0] font-mono-num text-xs font-semibold text-[#0F1D17] focus:outline-none focus:border-[#059669] focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#33433A] mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => {
                            setCardExpiry(e.target.value);
                            setPaymentError(null);
                          }}
                          placeholder="12/28"
                          className="w-full h-10 px-3 rounded-xl bg-[#F8FBF9] border border-[#DCE7E0] font-mono-num text-xs font-medium text-[#0F1D17] focus:outline-none focus:border-[#059669] focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#33433A] mb-1">
                          Security CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => {
                            setCardCvv(e.target.value);
                            setPaymentError(null);
                          }}
                          placeholder="•••"
                          className="w-full h-10 px-3 rounded-xl bg-[#F8FBF9] border border-[#DCE7E0] font-mono-num text-xs font-medium text-[#0F1D17] focus:outline-none focus:border-[#059669] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPayMethod === 'cod' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0F1D17]">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      <span>Doorstep Cash on Delivery Enabled</span>
                    </div>
                    <p className="text-[11.5px] text-[#4A5E55] leading-relaxed">
                      Inspect your cross-border parcel at your doorstep in{' '}
                      <strong className="text-[#0F1D17] font-semibold">{city}</strong>{' '}
                      and pay the courier in BDT cash. Customs duty and VAT remain 100% pre-cleared.
                    </p>
                  </div>
                )}

                {paymentError && (
                  <div
                    role="alert"
                    className="p-2.5 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] flex items-center gap-2 text-xs font-medium text-[#B42318]"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}
              </form>
            </motion.div>
          )}

          {/* ===================================================================
              STEP 3: CELEBRATORY ANIMATED COMPLETION SCREEN
             =================================================================== */}
          {wizardStep === 3 && (
            <motion.div
              key="setup-step-complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="py-6 flex flex-col items-center text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 360,
                  damping: 20,
                  delay: 0.05,
                }}
                className="w-16 h-16 rounded-3xl bg-[#ECFDF5] border-2 border-[#A7F3D0] text-[#059669] flex items-center justify-center shadow-md"
              >
                <CheckCircle2 className="w-9 h-9" />
              </motion.div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#059669]">
                  Account Setup Complete
                </span>
                <h2 className="text-xl font-bold text-[#0F1D17]">
                  You&apos;re All Set, {recipientName.split(' ')[0]}!
                </h2>
                <p className="text-xs text-[#4A5E55] max-w-xs mx-auto leading-relaxed">
                  Your delivery coordinates and preferred payment method are saved for instant 1-tap landed checkout.
                </p>
              </div>

              {/* Saved Summary Cards */}
              <div className="w-full bg-white rounded-2xl border border-[#DCE7E0] p-3.5 text-left space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#EFF5F2]">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0F1D17]">
                          {addrLabel} · {city} {postalCode}
                        </span>
                        <span className="text-[10px] font-semibold text-[#059669]">
                          ✓ Verified Pin
                        </span>
                      </div>
                      <p className="text-xs text-[#4A5E55] truncate mt-0.5">
                        {streetAddress}
                      </p>
                      <p className="font-mono-num text-[10.5px] text-[#7A8E84] mt-0.5">
                        {pinCoords.lat.toFixed(4)}°N, {pinCoords.lng.toFixed(4)}°E · {recipientPhone}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="text-[11px] font-semibold text-[#059669] hover:underline shrink-0"
                  >
                    Edit
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F1D17] truncate">
                        {activePaymentMeta.title}
                      </p>
                      <p className="text-[11px] text-[#4A5E55] truncate">
                        {activePaymentMeta.subtitle} · Default Active
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="text-[11px] font-semibold text-[#059669] hover:underline shrink-0"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===================== STICKY BOTTOM CTA BAR ===================== */}
      <footer className="shrink-0 bg-white border-t border-[#DCE7E0] px-3.5 pt-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))] z-20">
        {wizardStep === 1 && (
          <button
            type="submit"
            form="post-login-address-form"
            className="w-full h-12 rounded-xl bg-[#059669] hover:bg-[#047857] active:scale-[0.99] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Save Address & Continue to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {wizardStep === 2 && (
          <button
            type="submit"
            form="post-login-payment-form"
            className="w-full h-12 rounded-xl bg-[#059669] hover:bg-[#047857] active:scale-[0.99] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Save Payment & Complete Setup</span>
            <Check className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        {wizardStep === 3 && (
          <button
            type="button"
            onClick={() => {
              showToast('Address & payment ready for 1-tap checkout!');
              navigateTo('home');
            }}
            className="w-full h-12 rounded-xl bg-[#059669] hover:bg-[#047857] active:scale-[0.99] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Start Exploring DeshiMart</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
};

