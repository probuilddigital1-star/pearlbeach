/**
 * Site Configuration Constants
 * Centralized configuration for Pearl Beach Cottages
 * Update these values to change site-wide settings
 */

// Site URLs and Domain
export const SITE_CONFIG = {
  name: 'Pearl Beach Cottages',
  domain: 'pearlbeachcottages.com',
  tagline: 'Lake Erie Vacation Rentals',
  description: 'Premium lakefront vacation rentals on Lake Erie in Saybrook Township, Ashtabula County, Ohio. Experience lakeside relaxation with stunning water views, modern amenities, and access to Ohio\'s wine country.',
} as const;

// Helper to generate full URLs
export const getSiteUrl = (path: string = ''): string => {
  const base = `https://${SITE_CONFIG.domain}`;
  return path ? `${base}${path.startsWith('/') ? path : `/${path}`}` : base;
};

// Business Information
export const BUSINESS_INFO = {
  name: SITE_CONFIG.name,
  legalName: 'Pearl Beach Cottages LLC',
  email: 'info@pearlbeachcottages.com',
  phone: '(440) 555-0123', // Update with actual phone number
  priceRange: '$$-$$$',
  checkIn: '4:00 PM',
  checkOut: '10:00 AM',
  checkInTime24: '16:00',
  checkOutTime24: '10:00',
  numberOfProperties: 2,
} as const;

// Location Information
export const LOCATION = {
  streetAddress: 'Lake Erie Waterfront',
  city: 'Saybrook Township',
  state: 'OH',
  stateFullName: 'Ohio',
  postalCode: '44004',
  country: 'US',
  countryFullName: 'United States',
  region: 'Lake Erie',
  latitude: 41.9,
  longitude: -80.8,
} as const;

// VRBO Listings
export const VRBO_CONFIG = {
  baseUrl: 'https://www.vrbo.com',
  properties: {
    'pearl-beach-lakehouse': {
      id: '122526',
      name: 'Pearl Beach Lakehouse',
    },
    'lakehurst-bungalow': {
      id: '238763',
      name: 'Lakehurst Bungalow',
    },
  },
} as const;

// Helper to get VRBO URL for a property
export const getVrboUrl = (propertySlug: string): string => {
  const property = VRBO_CONFIG.properties[propertySlug as keyof typeof VRBO_CONFIG.properties];
  if (property) {
    return `${VRBO_CONFIG.baseUrl}/${property.id}`;
  }
  return VRBO_CONFIG.baseUrl;
};

// All VRBO URLs as an array (for sameAs in schema)
export const getAllVrboUrls = (): string[] => {
  return Object.values(VRBO_CONFIG.properties).map(
    (property) => `${VRBO_CONFIG.baseUrl}/${property.id}`
  );
};

// Images
export const IMAGES = {
  logo: '/images/logo.svg',
  logoWidth: 600,
  logoHeight: 200,
  heroDefault: '/images/hero/lake-erie-sunset.jpg',
  heroAlt: '/images/hero/cottages-hero.jpg',
  ogImage: '/images/hero/lake-erie-sunset.jpg',
} as const;

// Ratings (aggregate)
export const RATINGS = {
  overall: 9.6,
  reviewCount: 87,
  bestRating: 10,
  worstRating: 1,
} as const;

// Amenities (for schema and display)
export const AMENITIES = {
  featured: [
    'Beach Access',
    'WiFi',
    'Parking',
    'Kitchen',
    'Air Conditioning',
    'Pet Friendly',
  ],
  all: [
    'Private Beach Access',
    'High-Speed WiFi',
    'Free Parking',
    'Full Kitchen',
    'Central Air Conditioning',
    'Pet Friendly',
    'Smart TV',
    'Washer/Dryer',
    'Outdoor Grill',
    'Fire Pit',
    'Lake Views',
    'Deck/Patio',
  ],
} as const;

// Navigation Links
export const NAV_LINKS = [
  { label: 'Home', href: '/', order: 1 },
  { label: 'Our Cottages', href: '/cottages', order: 2 },
  { label: 'Amenities', href: '/amenities', order: 3 },
  { label: 'Location', href: '/location', order: 4 },
  { label: 'Reviews', href: '/reviews', order: 5 },
  { label: 'Contact', href: '/contact', order: 6 },
] as const;

// Footer Links
export const FOOTER_LINKS = {
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'Our Cottages', href: '/cottages' },
    { label: 'Amenities', href: '/amenities' },
    { label: 'Location', href: '/location' },
  ],
  cottages: [
    { label: 'Pearl Beach Lakehouse', href: '/cottages/pearl-beach-lakehouse' },
    { label: 'Lakehurst Bungalow', href: '/cottages/lakehurst-bungalow' },
    { label: 'Guest Reviews', href: '/reviews' },
    { label: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Security', href: '/security' },
  ],
} as const;

// Social Links (when available)
export const SOCIAL_LINKS = {
  vrbo: getAllVrboUrls(),
  // Add more as needed:
  // facebook: '',
  // instagram: '',
} as const;

// Schema.org IDs
export const SCHEMA_IDS = {
  organization: `${getSiteUrl()}/#organization`,
  localBusiness: `${getSiteUrl()}/#localbusiness`,
  website: `${getSiteUrl()}/#website`,
} as const;

// Export a default config object for convenience
export default {
  site: SITE_CONFIG,
  business: BUSINESS_INFO,
  location: LOCATION,
  vrbo: VRBO_CONFIG,
  images: IMAGES,
  ratings: RATINGS,
  amenities: AMENITIES,
  navigation: NAV_LINKS,
  footer: FOOTER_LINKS,
  social: SOCIAL_LINKS,
  schemaIds: SCHEMA_IDS,
  getSiteUrl,
  getVrboUrl,
  getAllVrboUrls,
};
