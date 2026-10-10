import { PaymentMethodId, ShippingAddress } from '../types/deshimart';

/**
 * ============================================================================
 * DESHIMART — BANGLADESH ADDRESS, GEOGRAPHY & PAYMENT VALIDATION ENGINE
 * ============================================================================
 * Provides:
 * 1. Complete 64-district Bangladesh dataset organized by administrative division.
 * 2. Phone number validation and normalization for all BD mobile operators (013-019).
 * 3. Postal code validation (4-digit Bangladesh Post Office standard).
 * 4. Curated hub/locality search presets with truthful fallback metadata.
 * 5. Centralized, honest payment-method capability definitions and PCI-safe
 *    preference sanitization (never stores raw card PAN or CVV).
 */

export interface BangladeshDivisionGroup {
  division: string;
  divisionBn: string;
  districts: string[];
}

export const BANGLADESH_DIVISION_DISTRICTS: BangladeshDivisionGroup[] = [
  {
    division: 'Dhaka Division',
    divisionBn: 'ঢাকা বিভাগ',
    districts: [
      'Dhaka',
      'Gazipur',
      'Narayanganj',
      'Narsingdi',
      'Manikganj',
      'Munshiganj',
      'Tangail',
      'Kishoreganj',
      'Faridpur',
      'Gopalganj',
      'Madaripur',
      'Rajbari',
      'Shariatpur',
    ],
  },
  {
    division: 'Chattogram Division',
    divisionBn: 'চট্টগ্রাম বিভাগ',
    districts: [
      'Chattogram',
      'Cumilla',
      "Cox's Bazar",
      'Feni',
      'Brahmanbaria',
      'Chandpur',
      'Lakshmipur',
      'Noakhali',
      'Khagrachhari',
      'Rangamati',
      'Bandarban',
    ],
  },
  {
    division: 'Sylhet Division',
    divisionBn: 'সিলেট বিভাগ',
    districts: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  },
  {
    division: 'Rajshahi Division',
    divisionBn: 'রাজশাহী বিভাগ',
    districts: [
      'Rajshahi',
      'Bogura',
      'Pabna',
      'Sirajganj',
      'Natore',
      'Naogaon',
      'Chapainawabganj',
      'Joypurhat',
    ],
  },
  {
    division: 'Khulna Division',
    divisionBn: 'খুলনা বিভাগ',
    districts: [
      'Khulna',
      'Jashore',
      'Kushtia',
      'Satkhira',
      'Bagerhat',
      'Chuadanga',
      'Jhenaidah',
      'Magura',
      'Meherpur',
      'Narail',
    ],
  },
  {
    division: 'Barishal Division',
    divisionBn: 'বরিশাল বিভাগ',
    districts: [
      'Barishal',
      'Patuakhali',
      'Bhola',
      'Pirojpur',
      'Barguna',
      'Jhalokati',
    ],
  },
  {
    division: 'Rangpur Division',
    divisionBn: 'রংপুর বিভাগ',
    districts: [
      'Rangpur',
      'Dinajpur',
      'Kurigram',
      'Gaibandha',
      'Nilphamari',
      'Panchagarh',
      'Thakurgaon',
      'Lalmonirhat',
    ],
  },
  {
    division: 'Mymensingh Division',
    divisionBn: 'ময়মনসিংহ বিভাগ',
    districts: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
  },
];

export const ALL_BANGLADESH_DISTRICTS: string[] =
  BANGLADESH_DIVISION_DISTRICTS.flatMap((group) => group.districts);

export interface LocalitySearchPreset {
  id: string;
  area: string;
  district: string;
  postalCode: string;
  suggestedRoad: string;
  suggestedSectorOrBlock: string;
  corridorLabel: string;
}

export const BANGLADESH_LOCALITY_PRESETS: LocalitySearchPreset[] = [
  {
    id: 'dhaka-banani',
    area: 'Banani',
    district: 'Dhaka',
    postalCode: '1213',
    suggestedRoad: 'Road 11',
    suggestedSectorOrBlock: 'Block E',
    corridorLabel: 'Dhaka North Metro Zone',
  },
  {
    id: 'dhaka-gulshan2',
    area: 'Gulshan 2',
    district: 'Dhaka',
    postalCode: '1212',
    suggestedRoad: 'Road 90',
    suggestedSectorOrBlock: 'Gulshan Circle 2',
    corridorLabel: 'Dhaka Diplomatic Zone',
  },
  {
    id: 'dhaka-dhanmondi',
    area: 'Dhanmondi',
    district: 'Dhaka',
    postalCode: '1209',
    suggestedRoad: 'Road 27 (Old)',
    suggestedSectorOrBlock: 'Satmasjid Road',
    corridorLabel: 'Dhaka South Metro Zone',
  },
  {
    id: 'dhaka-uttara',
    area: 'Uttara',
    district: 'Dhaka',
    postalCode: '1230',
    suggestedRoad: 'Road 18',
    suggestedSectorOrBlock: 'Sector 7',
    corridorLabel: 'HSIA Airport Corridor',
  },
  {
    id: 'dhaka-mirpur-dohs',
    area: 'Mirpur DOHS',
    district: 'Dhaka',
    postalCode: '1216',
    suggestedRoad: 'Road 5',
    suggestedSectorOrBlock: 'Avenue 3',
    corridorLabel: 'Dhaka West Metro Zone',
  },
  {
    id: 'dhaka-motijheel',
    area: 'Motijheel C/A',
    district: 'Dhaka',
    postalCode: '1000',
    suggestedRoad: 'Dilkusha Commercial Road',
    suggestedSectorOrBlock: 'Block A',
    corridorLabel: 'Dhaka Central Commercial Hub',
  },
  {
    id: 'ctg-agrabad',
    area: 'Agrabad C/A',
    district: 'Chattogram',
    postalCode: '4100',
    suggestedRoad: 'Sheikh Mujib Road',
    suggestedSectorOrBlock: 'Commercial Area',
    corridorLabel: 'Chattogram Port Corridor',
  },
  {
    id: 'sylhet-zindabazar',
    area: 'Zindabazar',
    district: 'Sylhet',
    postalCode: '3100',
    suggestedRoad: 'VIP Road',
    suggestedSectorOrBlock: 'Amberkhana Point',
    corridorLabel: 'Sylhet Sadar Zone',
  },
  {
    id: 'rajshahi-boalia',
    area: 'Shaheb Bazar',
    district: 'Rajshahi',
    postalCode: '6100',
    suggestedRoad: 'Station Road',
    suggestedSectorOrBlock: 'Boalia',
    corridorLabel: 'Rajshahi Sadar Zone',
  },
  {
    id: 'khulna-sonadanga',
    area: 'Sonadanga R/A',
    district: 'Khulna',
    postalCode: '9100',
    suggestedRoad: 'KDA Avenue',
    suggestedSectorOrBlock: 'Phase 2',
    corridorLabel: 'Khulna Metro Zone',
  },
];

/**
 * Validates Bangladesh mobile phone numbers (supports 01[3-9]XXXXXXXX and +8801[3-9]XXXXXXXX).
 */
export function isValidBangladeshPhone(raw: string): boolean {
  if (!raw) return false;
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('8801') && digits.length === 13) {
    return /^8801[3-9]\d{8}$/.test(digits);
  }
  if (digits.startsWith('01') && digits.length === 11) {
    return /^01[3-9]\d{8}$/.test(digits);
  }
  return false;
}

/**
 * Normalizes a valid Bangladesh phone number to the local 11-digit 01XXXXXXXXX format
 * or preserves international +880 formatting cleanly for display.
 */
export function normalizeBangladeshPhone(raw: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('8801') && digits.length === 13) {
    return `+880 ${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.startsWith('01') && digits.length === 11) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return trimmed;
}

/**
 * Masks a phone number for secondary summary display while keeping it recognizable to the owner.
 */
export function maskBangladeshPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length >= 11) {
    const local11 = digits.slice(-11);
    return `${local11.slice(0, 4)} •••• ${local11.slice(-3)}`;
  }
  return raw;
}

/**
 * Validates optional or required 4-digit Bangladesh postal code.
 */
export function isValidBangladeshPostalCode(
  raw: string,
  allowEmpty = false
): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return allowEmpty;
  return /^\d{4}$/.test(trimmed);
}

export interface StructuredAddressInput {
  label: 'Home' | 'Office' | 'Other';
  fullName: string;
  phone: string;
  houseOrBuilding?: string;
  roadOrStreet?: string;
  blockOrSector?: string;
  areaOrLocality: string;
  district: string;
  postalCode?: string;
  landmarkNote?: string;
}

export interface AddressValidationErrors {
  fullName?: string;
  phone?: string;
  areaOrLocality?: string;
  district?: string;
  postalCode?: string;
}

export function validateStructuredAddress(
  input: StructuredAddressInput
): AddressValidationErrors {
  const errors: AddressValidationErrors = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName =
      'Enter the recipient’s full name (at least 2 characters, Bangla or English).';
  }

  if (!isValidBangladeshPhone(input.phone)) {
    errors.phone =
      'Enter an 11-digit Bangladesh mobile number starting with 013–019 (e.g., 01712345678).';
  }

  if (!input.areaOrLocality || input.areaOrLocality.trim().length < 3) {
    errors.areaOrLocality =
      'Enter your house/road or area/locality details (at least 3 characters).';
  }

  if (
    !input.district ||
    !ALL_BANGLADESH_DISTRICTS.includes(input.district.trim())
  ) {
    errors.district = 'Select a valid delivery district in Bangladesh.';
  }

  if (
    input.postalCode &&
    input.postalCode.trim().length > 0 &&
    !isValidBangladeshPostalCode(input.postalCode, true)
  ) {
    errors.postalCode =
      'Postal code must be a 4-digit Bangladesh post code (e.g., 1213) or left blank.';
  }

  return errors;
}

export function composeStreetAddressLine(input: {
  houseOrBuilding?: string;
  roadOrStreet?: string;
  blockOrSector?: string;
  areaOrLocality: string;
}): string {
  const parts = [
    input.houseOrBuilding?.trim(),
    input.roadOrStreet?.trim(),
    input.blockOrSector?.trim(),
    input.areaOrLocality.trim(),
  ].filter((part): part is string => Boolean(part && part.length > 0));

  // Deduplicate adjacent identical segments
  const deduped: string[] = [];
  for (const part of parts) {
    if (!deduped.some((existing) => existing.toLowerCase() === part.toLowerCase())) {
      deduped.push(part);
    }
  }
  return deduped.join(', ');
}

/**
 * Centralized, truthful payment capability definitions.
 * Distinguishes saved checkout preference from live gateway authorization.
 */
export interface PaymentMethodCapability {
  id: PaymentMethodId;
  name: string;
  shortName: string;
  category: 'mfs' | 'card' | 'cod' | 'international';
  description: string;
  verificationNotice: string;
  requiresPhoneInput: boolean;
  requiresCardPreference: boolean;
  supportedInOnboarding: boolean;
}

export const PAYMENT_METHOD_CAPABILITIES: PaymentMethodCapability[] = [
  {
    id: 'bkash',
    name: 'bKash Mobile Wallet',
    shortName: 'bKash',
    category: 'mfs',
    description: 'Save your preferred bKash number for checkout.',
    verificationNotice:
      'Preference only — PIN/OTP authorization happens on the bKash gateway when you place an order.',
    requiresPhoneInput: true,
    requiresCardPreference: false,
    supportedInOnboarding: true,
  },
  {
    id: 'nagad',
    name: 'Nagad Mobile Banking',
    shortName: 'Nagad',
    category: 'mfs',
    description: 'Save your preferred Nagad wallet number for checkout.',
    verificationNotice:
      'Preference only — OTP and PIN authorization occur at order checkout.',
    requiresPhoneInput: true,
    requiresCardPreference: false,
    supportedInOnboarding: true,
  },
  {
    id: 'card',
    name: 'Debit / Credit Card (Visa, Mastercard, Amex)',
    shortName: 'Card',
    category: 'card',
    description:
      'Select card checkout as your default preference. Card numbers and CVV are entered only on the encrypted gateway during order payment.',
    verificationNotice:
      'No card numbers or CVVs are stored during account setup. 3D Secure verification runs at order checkout.',
    requiresPhoneInput: false,
    requiresCardPreference: true,
    supportedInOnboarding: true,
  },
  {
    id: 'rocket',
    name: 'DBBL Rocket Wallet',
    shortName: 'Rocket',
    category: 'mfs',
    description: 'Save your Dutch-Bangla Bank Rocket mobile number for checkout.',
    verificationNotice:
      'Preference only — wallet authorization occurs when confirming an order.',
    requiresPhoneInput: true,
    requiresCardPreference: false,
    supportedInOnboarding: true,
  },
  {
    id: 'upay',
    name: 'UCB Upay Wallet',
    shortName: 'Upay',
    category: 'mfs',
    description: 'Save your UCB Upay mobile wallet number for checkout.',
    verificationNotice:
      'Preference only — wallet authorization occurs when confirming an order.',
    requiresPhoneInput: true,
    requiresCardPreference: false,
    supportedInOnboarding: true,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (BDT)',
    shortName: 'Cash on Delivery',
    category: 'cod',
    description:
      'Pay in Bangladeshi Taka to the courier upon receiving eligible orders.',
    verificationNotice:
      'Available for eligible items and delivery zones. High-value custom imports may require advance confirmation at checkout.',
    requiresPhoneInput: false,
    requiresCardPreference: false,
    supportedInOnboarding: true,
  },
];

export function getPaymentCapability(
  methodId: PaymentMethodId
): PaymentMethodCapability {
  return (
    PAYMENT_METHOD_CAPABILITIES.find((m) => m.id === methodId) ||
    PAYMENT_METHOD_CAPABILITIES[0]
  );
}

/**
 * Sanitizes any checkout draft before saving to state or storage so full card PAN
 * or CVV can never leak into localStorage or React context.
 */
export function sanitizeCheckoutDraftForPersistence<
  T extends {
    cardNumber?: string;
    cardCvv?: string;
  }
>(draft: T): T {
  const rawCard = draft.cardNumber || '';
  const digits = rawCard.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  const safeMaskedCard = last4 ? `•••• •••• •••• ${last4}` : '';

  return {
    ...draft,
    cardNumber: safeMaskedCard,
    cardCvv: '',
  };
}

export function isMatchingSavedAddress(
  a: Pick<ShippingAddress, 'address' | 'city' | 'phone'>,
  b: Pick<ShippingAddress, 'address' | 'city' | 'phone'>
): boolean {
  return (
    a.address.trim().toLowerCase() === b.address.trim().toLowerCase() &&
    a.city.trim().toLowerCase() === b.city.trim().toLowerCase() &&
    a.phone.replace(/\D/g, '').slice(-11) ===
      b.phone.replace(/\D/g, '').slice(-11)
  );
}
