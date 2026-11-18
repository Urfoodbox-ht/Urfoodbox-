export type Language = 'en' | 'fr' | 'ht';
export type Currency = 'USD' | 'HTG';
export type ThemeMode = 'light' | 'dark' | 'brand';
export type PaymentMethod = 'cash_on_delivery' | 'wire' | 'moncash' | 'natcash';
export type OrderStatus =
  | 'New'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Product {
  id: number;
  slug: string;
  nameEn: string;
  nameFr: string;
  nameHt: string;
  descriptionEn: string;
  descriptionFr: string;
  descriptionHt: string;
  priceUsd: string;
  priceHtg: string;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  primaryImageId: number | null;
  imageUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessSettings {
  id?: number;
  businessName: string;
  slogan: string;
  whatsappNumber: string;
  tiktokUrl: string;
  facebookUrl: string;
  contactEmail: string;
  contactAddress: string;
  promoTitleEn: string;
  promoTitleFr: string;
  promoTitleHt: string;
  promoSubtitleEn: string;
  promoSubtitleFr: string;
  promoSubtitleHt: string;
  promoBannerEn: string;
  promoBannerFr: string;
  promoBannerHt: string;
  exchangeRateHtgPerUsd: string;
  logoImageId: number | null;
  logoUrl: string;
  subscriptionsEnabled: boolean;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface OrderItemRecord {
  id: number;
  orderId: number;
  productId: number | null;
  productName: string;
  quantity: number;
  unitPriceUsd: string;
  unitPriceHtg: string;
  lineTotal: string;
}

export interface OrderRecord {
  id: number;
  orderReference: string;
  customerAccountId: number | null;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderInstructions: string;
  boxPeriod: string;
  householdSize: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  subtotalAmount: string;
  totalAmount: string;
  exchangeRateHtgPerUsd: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  items: OrderItemRecord[];
}

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

export interface CustomerProfile {
  id: number;
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  savedAddresses: SavedAddress[];
  defaultDeliveryAddress: string;
  preferredLanguage: Language;
  preferredCurrency: Currency;
}

export interface SubscriptionRecord {
  id: number;
  customerAccountId: number;
  productId: number | null;
  frequency: 'weekly' | 'monthly';
  preferredDeliveryDay: string;
  deliveryAddress: string;
  notes: string;
  status: 'waitlist' | 'paused' | 'cancelled';
  paymentProviderConfigured: boolean;
  createdAt: string;
}

export interface CustomerComment {
  id: number;
  authorName: string;
  rating: number;
  commentText: string;
  isVisible: boolean;
  createdAt: string;
}
