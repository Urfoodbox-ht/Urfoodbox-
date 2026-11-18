import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export interface SavedAddressItem {
  id: string;
  label: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nameEn: text('name_en').notNull(),
  nameFr: text('name_fr').notNull().default(''),
  nameHt: text('name_ht').notNull().default(''),
  descriptionEn: text('description_en').notNull().default(''),
  descriptionFr: text('description_fr').notNull().default(''),
  descriptionHt: text('description_ht').notNull().default(''),
  priceUsd: numeric('price_usd', { precision: 10, scale: 2 }).notNull().default('0.00'),
  priceHtg: numeric('price_htg', { precision: 12, scale: 2 }).notNull().default('0.00'),
  isAvailable: boolean('is_available').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  primaryImageId: integer('primary_image_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }),
  purpose: text('purpose').notNull().default('product'), // 'product' | 'logo'
  fileName: text('file_name').notNull(),
  mimeType: text('mime_type').notNull(),
  dataBase64: text('data_base64').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  isPrimary: boolean('is_primary').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const administratorAccounts = pgTable('administrator_accounts', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name').notNull(),
  passwordHash: text('password_hash').notNull(),
  firebaseUid: text('firebase_uid').unique(),
  role: text('role').notNull().default('owner'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
});

export const customerAccounts = pgTable('customer_accounts', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull().unique(),
  fullName: text('full_name').notNull().default(''),
  phone: text('phone').notNull().default(''),
  savedAddresses: jsonb('saved_addresses').$type<SavedAddressItem[]>().notNull().default([]),
  defaultDeliveryAddress: text('default_delivery_address').notNull().default(''),
  preferredLanguage: text('preferred_language').notNull().default('en'),
  preferredCurrency: text('preferred_currency').notNull().default('USD'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderReference: text('order_reference').notNull().unique(),
  customerAccountId: integer('customer_account_id').references(() => customerAccounts.id, {
    onDelete: 'set null',
  }),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  orderInstructions: text('order_instructions').notNull().default(''),
  boxPeriod: text('box_period').notNull().default(''),
  householdSize: integer('household_size').notNull().default(1),
  currency: text('currency').notNull().default('USD'), // 'USD' | 'HTG'
  paymentMethod: text('payment_method').notNull().default('cash_on_delivery'), // 'cash_on_delivery' | 'wire' | 'moncash' | 'natcash'
  subtotalAmount: numeric('subtotal_amount', { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  exchangeRateHtgPerUsd: numeric('exchange_rate_htg_per_usd', { precision: 10, scale: 2 })
    .notNull()
    .default('132.00'),
  status: text('status').notNull().default('New'), // 'New' | 'Confirmed' | 'Preparing' | 'Out for delivery' | 'Delivered' | 'Cancelled'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  unitPriceUsd: numeric('unit_price_usd', { precision: 10, scale: 2 }).notNull(),
  unitPriceHtg: numeric('unit_price_htg', { precision: 12, scale: 2 }).notNull(),
  lineTotal: numeric('line_total', { precision: 12, scale: 2 }).notNull(),
});

export const businessSettings = pgTable('business_settings', {
  id: serial('id').primaryKey(),
  singletonKey: text('singleton_key').notNull().unique().default('default'),
  businessName: text('business_name').notNull().default('UrFoodBox'),
  slogan: text('slogan').notNull().default('Machew devan pot kay ou.'),
  whatsappNumber: text('whatsapp_number').notNull().default(''),
  tiktokUrl: text('tiktok_url').notNull().default(''),
  facebookUrl: text('facebook_url').notNull().default(''),
  contactEmail: text('contact_email').notNull().default(''),
  contactAddress: text('contact_address').notNull().default(''),
  promoTitleEn: text('promo_title_en').notNull().default('Your Grocery Market, Right at Your Door'),
  promoTitleFr: text('promo_title_fr').notNull().default('Votre marché, directement devant votre porte'),
  promoTitleHt: text('promo_title_ht').notNull().default('Machew devan pot kay ou.'),
  promoSubtitleEn: text('promo_subtitle_en')
    .notNull()
    .default('Order quality food boxes effortlessly in USD or HTG and let UrFoodBox handle careful preparation and doorstep delivery.'),
  promoSubtitleFr: text('promo_subtitle_fr')
    .notNull()
    .default('Commandez vos paniers alimentaires en USD ou HTG et laissez UrFoodBox préparer et livrer votre commande chez vous.'),
  promoSubtitleHt: text('promo_subtitle_ht')
    .notNull()
    .default('Kòmande bwat pwovizyon ou yo an USD oswa HTG epi kite UrFoodBox prepare ak pote yo tou dwat devan pòt kay ou.'),
  promoBannerEn: text('promo_banner_en').notNull().default('Machew devan pot kay ou.'),
  promoBannerFr: text('promo_banner_fr').notNull().default('Machew devan pot kay ou.'),
  promoBannerHt: text('promo_banner_ht').notNull().default('Machew devan pot kay ou.'),
  exchangeRateHtgPerUsd: numeric('exchange_rate_htg_per_usd', { precision: 10, scale: 2 })
    .notNull()
    .default('132.00'),
  logoImageId: integer('logo_image_id'),
  subscriptionsEnabled: boolean('subscriptions_enabled').notNull().default(false),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const subscriptionRecords = pgTable('subscription_records', {
  id: serial('id').primaryKey(),
  customerAccountId: integer('customer_account_id')
    .notNull()
    .references(() => customerAccounts.id, { onDelete: 'cascade' }),
  productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
  frequency: text('frequency').notNull().default('monthly'), // 'weekly' | 'monthly'
  preferredDeliveryDay: text('preferred_delivery_day').notNull().default('Saturday'),
  deliveryAddress: text('delivery_address').notNull().default(''),
  notes: text('notes').notNull().default(''),
  status: text('status').notNull().default('waitlist'), // 'waitlist' | 'paused' | 'cancelled'
  paymentProviderConfigured: boolean('payment_provider_configured').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const customerComments = pgTable('customer_comments', {
  id: serial('id').primaryKey(),
  authorName: text('author_name').notNull(),
  rating: integer('rating').notNull().default(5),
  commentText: text('comment_text').notNull(),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  images: many(productImages),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const customerAccountsRelations = relations(customerAccounts, ({ many }) => ({
  orders: many(orders),
  subscriptions: many(subscriptionRecords),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customerAccounts, {
    fields: [orders.customerAccountId],
    references: [customerAccounts.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const subscriptionRecordsRelations = relations(subscriptionRecords, ({ one }) => ({
  customer: one(customerAccounts, {
    fields: [subscriptionRecords.customerAccountId],
    references: [customerAccounts.id],
  }),
  product: one(products, {
    fields: [subscriptionRecords.productId],
    references: [products.id],
  }),
}));
