import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { asc, desc, eq, inArray } from 'drizzle-orm';
import { db, hasConfiguredDatabase, pool } from './index.ts';
import {
  administratorAccounts,
  businessSettings,
  customerAccounts,
  customerComments,
  orderItems,
  orders,
  productImages,
  products,
  subscriptionRecords,
  type SavedAddressItem,
} from './schema.ts';

let seedPromise: Promise<void> | null = null;

async function ensureSchemaExists(): Promise<void> {
  const check = await pool.query(`
    SELECT
      to_regclass('public.products') IS NOT NULL AS has_products,
      to_regclass('public.product_images') IS NOT NULL AS has_product_images,
      to_regclass('public.administrator_accounts') IS NOT NULL AS has_admins,
      to_regclass('public.customer_accounts') IS NOT NULL AS has_customers,
      to_regclass('public.orders') IS NOT NULL AS has_orders,
      to_regclass('public.order_items') IS NOT NULL AS has_order_items,
      to_regclass('public.business_settings') IS NOT NULL AS has_settings,
      to_regclass('public.subscription_records') IS NOT NULL AS has_subscriptions,
      to_regclass('public.customer_comments') IS NOT NULL AS has_comments,
      EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'box_period'
      ) AS has_box_period,
      EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'household_size'
      ) AS has_household_size
  `);

  const row = check.rows[0];
  const allTablesExist =
    row &&
    row.has_products &&
    row.has_product_images &&
    row.has_admins &&
    row.has_customers &&
    row.has_orders &&
    row.has_order_items &&
    row.has_settings &&
    row.has_subscriptions &&
    row.has_comments;

  if (allTablesExist && row.has_box_period && row.has_household_size) {
    return;
  }

  try {
    if (!allTablesExist) {
      await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name_en TEXT NOT NULL,
      name_fr TEXT NOT NULL DEFAULT '',
      name_ht TEXT NOT NULL DEFAULT '',
      description_en TEXT NOT NULL DEFAULT '',
      description_fr TEXT NOT NULL DEFAULT '',
      description_ht TEXT NOT NULL DEFAULT '',
      price_usd NUMERIC(10, 2) NOT NULL DEFAULT '0.00',
      price_htg NUMERIC(12, 2) NOT NULL DEFAULT '0.00',
      is_available BOOLEAN NOT NULL DEFAULT true,
      is_featured BOOLEAN NOT NULL DEFAULT true,
      sort_order INTEGER NOT NULL DEFAULT 0,
      primary_image_id INTEGER,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      purpose TEXT NOT NULL DEFAULT 'product',
      file_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      data_base64 TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      is_primary BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS administrator_accounts (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      firebase_uid TEXT UNIQUE,
      role TEXT NOT NULL DEFAULT 'owner',
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      last_login_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customer_accounts (
      id SERIAL PRIMARY KEY,
      uid TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      saved_addresses JSONB NOT NULL DEFAULT '[]'::jsonb,
      default_delivery_address TEXT NOT NULL DEFAULT '',
      preferred_language TEXT NOT NULL DEFAULT 'en',
      preferred_currency TEXT NOT NULL DEFAULT 'USD',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_reference TEXT NOT NULL UNIQUE,
      customer_account_id INTEGER REFERENCES customer_accounts(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      order_instructions TEXT NOT NULL DEFAULT '',
      box_period TEXT NOT NULL DEFAULT '',
      household_size INTEGER NOT NULL DEFAULT 1,
      currency TEXT NOT NULL DEFAULT 'USD',
      payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
      subtotal_amount NUMERIC(12, 2) NOT NULL,
      total_amount NUMERIC(12, 2) NOT NULL,
      exchange_rate_htg_per_usd NUMERIC(10, 2) NOT NULL DEFAULT '132.00',
      status TEXT NOT NULL DEFAULT 'New',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price_usd NUMERIC(10, 2) NOT NULL,
      unit_price_htg NUMERIC(12, 2) NOT NULL,
      line_total NUMERIC(12, 2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS business_settings (
      id SERIAL PRIMARY KEY,
      singleton_key TEXT NOT NULL UNIQUE DEFAULT 'default',
      business_name TEXT NOT NULL DEFAULT 'UrFoodBox',
      slogan TEXT NOT NULL DEFAULT 'Machew devan pot kay ou.',
      whatsapp_number TEXT NOT NULL DEFAULT '',
      tiktok_url TEXT NOT NULL DEFAULT '',
      facebook_url TEXT NOT NULL DEFAULT '',
      contact_email TEXT NOT NULL DEFAULT '',
      contact_address TEXT NOT NULL DEFAULT '',
      promo_title_en TEXT NOT NULL DEFAULT 'Your Grocery Market, Right at Your Door',
      promo_title_fr TEXT NOT NULL DEFAULT 'Votre marché, directement devant votre porte',
      promo_title_ht TEXT NOT NULL DEFAULT 'Machew devan pot kay ou.',
      promo_subtitle_en TEXT NOT NULL DEFAULT 'Order quality food boxes effortlessly in USD or HTG and let UrFoodBox handle careful preparation and doorstep delivery.',
      promo_subtitle_fr TEXT NOT NULL DEFAULT 'Commandez vos paniers alimentaires en USD ou HTG et laissez UrFoodBox préparer et livrer votre commande chez vous.',
      promo_subtitle_ht TEXT NOT NULL DEFAULT 'Kòmande bwat pwovizyon ou yo an USD oswa HTG epi kite UrFoodBox prepare ak pote yo tou dwat devan pòt kay ou.',
      promo_banner_en TEXT NOT NULL DEFAULT 'Machew devan pot kay ou.',
      promo_banner_fr TEXT NOT NULL DEFAULT 'Machew devan pot kay ou.',
      promo_banner_ht TEXT NOT NULL DEFAULT 'Machew devan pot kay ou.',
      exchange_rate_htg_per_usd NUMERIC(10, 2) NOT NULL DEFAULT '132.00',
      logo_image_id INTEGER,
      subscriptions_enabled BOOLEAN NOT NULL DEFAULT false,
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS subscription_records (
      id SERIAL PRIMARY KEY,
      customer_account_id INTEGER NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      frequency TEXT NOT NULL DEFAULT 'monthly',
      preferred_delivery_day TEXT NOT NULL DEFAULT 'Saturday',
      delivery_address TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'waitlist',
      payment_provider_configured BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS customer_comments (
      id SERIAL PRIMARY KEY,
      author_name TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      comment_text TEXT NOT NULL,
      is_visible BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
    }

    if (!row?.has_box_period) {
      await pool.query(
        `ALTER TABLE orders ADD COLUMN IF NOT EXISTS box_period TEXT NOT NULL DEFAULT '';`
      );
    }
    if (!row?.has_household_size) {
      await pool.query(
        `ALTER TABLE orders ADD COLUMN IF NOT EXISTS household_size INTEGER NOT NULL DEFAULT 1;`
      );
    }
  } catch (err: any) {
    // Handle concurrent cold-start CREATE TABLE race conditions gracefully (23505 / 42P07)
    if (err?.code === '23505' || err?.code === '42P07') {
      return;
    }
    throw err;
  }
}

export async function ensureSeeded(): Promise<void> {
  if (!hasConfiguredDatabase()) {
    throw new Error(
      'Database is not configured. Add a PostgreSQL connection string (postgresql://...) as DATABASE_URL or POSTGRES_URL in your Vercel Environment Variables and redeploy.'
    );
  }

  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        await ensureSchemaExists();

        // 1. Seed default business_settings singleton
        await db
          .insert(businessSettings)
          .values({
            singletonKey: 'default',
            businessName: 'UrFoodBox',
            slogan: 'Machew devan pot kay ou.',
            whatsappNumber: '',
            tiktokUrl: '',
            facebookUrl: '',
            contactEmail: '',
            contactAddress: '',
            exchangeRateHtgPerUsd: '132.00',
            subscriptionsEnabled: false,
          })
          .onConflictDoNothing({ target: businessSettings.singletonKey });

        // 2. Seed initial 3 products ONLY if products table is empty (so admin can delete/rename freely after)
        const existingProducts = await db.select({ id: products.id }).from(products).limit(1);
        if (existingProducts.length === 0) {
          await db
            .insert(products)
            .values([
              {
                slug: 'standard-food-box',
                nameEn: 'Standard Food Box',
                nameFr: 'Boîte Alimentaire Standard',
                nameHt: 'Bwat Pwovizyon Estanda',
                descriptionEn: '',
                descriptionFr: '',
                descriptionHt: '',
                priceUsd: '0.00',
                priceHtg: '0.00',
                isAvailable: true,
                isFeatured: true,
                sortOrder: 1,
                primaryImageId: null,
              },
              {
                slug: 'family-size-food-box',
                nameEn: 'Family Size Food Box',
                nameFr: 'Boîte Alimentaire Format Familial',
                nameHt: 'Bwat Pwovizyon Pou Fanmi',
                descriptionEn: '',
                descriptionFr: '',
                descriptionHt: '',
                priceUsd: '0.00',
                priceHtg: '0.00',
                isAvailable: true,
                isFeatured: true,
                sortOrder: 2,
                primaryImageId: null,
              },
              {
                slug: 'essential-box',
                nameEn: 'Essential Box',
                nameFr: 'Boîte Essentielle',
                nameHt: 'Bwat Esansyèl',
                descriptionEn: '',
                descriptionFr: '',
                descriptionHt: '',
                priceUsd: '0.00',
                priceHtg: '0.00',
                isAvailable: true,
                isFeatured: true,
                sortOrder: 3,
                primaryImageId: null,
              },
            ])
            .onConflictDoNothing({ target: products.slug });
        }

        // 3. Seed owner administrator account if no admin exists
        const existingAdmins = await db
          .select({ id: administratorAccounts.id })
          .from(administratorAccounts)
          .limit(1);

        if (existingAdmins.length === 0) {
          const adminEmail = (process.env.ADMIN_EMAIL || 'rosemyriam01@gmail.com').trim().toLowerCase();
          const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'UrFoodBox#2026';
          const passwordHash = await bcrypt.hash(initialPassword, 10);

          await db
            .insert(administratorAccounts)
            .values({
              email: adminEmail,
              fullName: 'UrFoodBox Owner',
              passwordHash,
              role: 'owner',
              isActive: true,
            })
            .onConflictDoNothing({ target: administratorAccounts.email });
        }
      } catch (error) {
        seedPromise = null;
        console.error('Database seed failed:', error);
        if (error instanceof Error) {
          if (error.message.includes('Database is not configured')) {
            throw error;
          }
          throw new Error(
            `Database connection failed: ${error.message}. Verify your PostgreSQL DATABASE_URL / POSTGRES_URL environment variable.`,
            { cause: error }
          );
        }
        throw new Error('Failed to initialize database records.', { cause: error });
      }
    })();
  }
  return seedPromise;
}

export async function getStorefrontData() {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await ensureSeeded();
      const [settings] = await db
        .select()
        .from(businessSettings)
        .where(eq(businessSettings.singletonKey, 'default'))
        .limit(1);

      const allProducts = await db
        .select()
        .from(products)
        .orderBy(asc(products.sortOrder), asc(products.id));

      const visibleComments = await db
        .select()
        .from(customerComments)
        .where(eq(customerComments.isVisible, true))
        .orderBy(desc(customerComments.createdAt))
        .limit(50);

      return {
        settings,
        products: allProducts.map((p) => ({
          ...p,
          imageUrl: p.primaryImageId ? `/api/images/${p.primaryImageId}` : null,
        })),
        comments: visibleComments,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Database is not configured')
      ) {
        console.error('Database query failed in getStorefrontData:', error);
        throw error;
      }

      if (attempt === 0) {
        seedPromise = null;
        await new Promise((resolve) => setTimeout(resolve, 150));
        continue;
      }

      console.error('Database query failed in getStorefrontData:', error);
      if (
        error instanceof Error &&
        error.message.includes('Database connection failed')
      ) {
        throw error;
      }
      throw new Error('Unable to load storefront catalog.', { cause: error });
    }
  }
  throw new Error('Unable to load storefront catalog.');
}

export async function getAllCommentsForAdmin() {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(customerComments)
      .orderBy(desc(customerComments.createdAt));
  } catch (error) {
    console.error('Database query failed in getAllCommentsForAdmin:', error);
    throw new Error('Unable to load customer comments.', { cause: error });
  }
}

export async function createCustomerComment(input: {
  authorName: string;
  rating: number;
  commentText: string;
}) {
  try {
    await ensureSeeded();
    const [created] = await db
      .insert(customerComments)
      .values({
        authorName: input.authorName.trim(),
        rating: Math.max(1, Math.min(5, Math.floor(input.rating))),
        commentText: input.commentText.trim(),
        isVisible: true,
      })
      .returning();
    return created;
  } catch (error) {
    console.error('Database query failed in createCustomerComment:', error);
    throw new Error('Unable to save comment.', { cause: error });
  }
}

export async function getImageById(imageId: number) {
  try {
    await ensureSeeded();
    const [img] = await db
      .select()
      .from(productImages)
      .where(eq(productImages.id, imageId))
      .limit(1);
    return img || null;
  } catch (error) {
    console.error('Database query failed in getImageById:', error);
    throw new Error('Unable to retrieve image.', { cause: error });
  }
}

export async function getOrCreateCustomerAccount(uid: string, email: string, fullName?: string) {
  try {
    await ensureSeeded();
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await db
      .select()
      .from(customerAccounts)
      .where(eq(customerAccounts.uid, uid))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(customerAccounts)
        .set({
          email: normalizedEmail,
          updatedAt: new Date(),
        })
        .where(eq(customerAccounts.uid, uid))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(customerAccounts)
      .values({
        uid,
        email: normalizedEmail,
        fullName: fullName || '',
        phone: '',
        savedAddresses: [],
        defaultDeliveryAddress: '',
        preferredLanguage: 'en',
        preferredCurrency: 'USD',
      })
      .onConflictDoUpdate({
        target: customerAccounts.uid,
        set: {
          email: normalizedEmail,
          updatedAt: new Date(),
        },
      })
      .returning();

    return created;
  } catch (error) {
    console.error('Database query failed in getOrCreateCustomerAccount:', error);
    throw new Error('Unable to synchronize customer account.', { cause: error });
  }
}

export interface CreateOrderInput {
  customerAccountId: number | null;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderInstructions: string;
  boxPeriod: string;
  householdSize: number;
  currency: 'USD' | 'HTG';
  paymentMethod: 'cash_on_delivery' | 'wire' | 'moncash' | 'natcash';
  items: { productId: number; quantity: number }[];
}

export async function createOrderInDb(input: CreateOrderInput) {
  try {
    await ensureSeeded();
    const productIds = [
      ...new Set(
        input.items
          .map((item) => Number(item.productId))
          .filter((id) => Number.isInteger(id) && id > 0)
      ),
    ];
    if (productIds.length === 0 || productIds.length !== new Set(input.items.map((i) => i.productId)).size) {
      throw new Error('Cart contains an invalid product reference.');
    }

    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    const [settings] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.singletonKey, 'default'))
      .limit(1);

    const exchangeRate = settings?.exchangeRateHtgPerUsd || '132.00';

    let subtotal = 0;
    const resolvedItems: {
      productId: number;
      productName: string;
      quantity: number;
      unitPriceUsd: string;
      unitPriceHtg: string;
      lineTotal: string;
    }[] = [];

    for (const reqItem of input.items) {
      const prod = productMap.get(reqItem.productId);
      if (!prod) {
        throw new Error(`Selected product #${reqItem.productId} no longer exists.`);
      }
      if (!prod.isAvailable) {
        throw new Error(`${prod.nameEn} is currently unavailable.`);
      }
      const qty = Math.max(1, Math.min(99, Math.floor(reqItem.quantity)));
      const unitUsd = Number(prod.priceUsd || 0);
      const unitHtg = Number(prod.priceHtg || 0);
      const activeUnit = input.currency === 'HTG' ? unitHtg : unitUsd;
      const lineTotal = activeUnit * qty;
      subtotal += lineTotal;

      resolvedItems.push({
        productId: prod.id,
        productName: prod.nameEn,
        quantity: qty,
        unitPriceUsd: unitUsd.toFixed(2),
        unitPriceHtg: unitHtg.toFixed(2),
        lineTotal: lineTotal.toFixed(2),
      });
    }

    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
    const orderReference = `UFB-${datePart}-${randomPart}`;

    const createdOrder = await db.transaction(async (tx) => {
      const [insertedOrder] = await tx
        .insert(orders)
        .values({
          orderReference,
          customerAccountId: input.customerAccountId,
          customerName: input.customerName.trim(),
          customerPhone: input.customerPhone.trim(),
          deliveryAddress: input.deliveryAddress.trim(),
          orderInstructions: input.orderInstructions.trim(),
          boxPeriod: input.boxPeriod.trim(),
          householdSize: Math.max(1, Math.min(99, Math.floor(input.householdSize))),
          currency: input.currency,
          paymentMethod: input.paymentMethod,
          subtotalAmount: subtotal.toFixed(2),
          totalAmount: subtotal.toFixed(2),
          exchangeRateHtgPerUsd: exchangeRate,
          status: 'New',
        })
        .returning();

      const insertedItems = await tx
        .insert(orderItems)
        .values(
          resolvedItems.map((item) => ({
            orderId: insertedOrder.id,
            ...item,
          }))
        )
        .returning();

      return {
        ...insertedOrder,
        items: insertedItems,
      };
    });

    return createdOrder;
  } catch (error) {
    console.error('Database query failed in createOrderInDb:', error);
    if (
      error instanceof Error &&
      (error.message.includes('unavailable') ||
        error.message.includes('empty') ||
        error.message.includes('exists') ||
        error.message.includes('invalid'))
    ) {
      throw error;
    }
    throw new Error('Unable to submit your order. Please try again.', { cause: error });
  }
}

export async function getAllOrdersWithItems() {
  try {
    await ensureSeeded();
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));

    if (allOrders.length === 0) return [];

    const allItems = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, allOrders.map((o) => o.id)));

    const itemsByOrder = new Map<number, typeof allItems>();
    for (const item of allItems) {
      const list = itemsByOrder.get(item.orderId) || [];
      list.push(item);
      itemsByOrder.set(item.orderId, list);
    }

    return allOrders.map((order) => ({
      ...order,
      items: itemsByOrder.get(order.id) || [],
    }));
  } catch (error) {
    console.error('Database query failed in getAllOrdersWithItems:', error);
    throw new Error('Unable to load orders.', { cause: error });
  }
}

export async function getCustomerFullProfile(uid: string, email: string) {
  try {
    await ensureSeeded();
    const customer = await getOrCreateCustomerAccount(uid, email);

    const customerOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.customerAccountId, customer.id))
      .orderBy(desc(orders.createdAt));

    const orderIds = customerOrders.map((o) => o.id);
    const items = orderIds.length
      ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
      : [];

    const itemsByOrder = new Map<number, typeof items>();
    for (const item of items) {
      const list = itemsByOrder.get(item.orderId) || [];
      list.push(item);
      itemsByOrder.set(item.orderId, list);
    }

    const subs = await db
      .select()
      .from(subscriptionRecords)
      .where(eq(subscriptionRecords.customerAccountId, customer.id))
      .orderBy(desc(subscriptionRecords.createdAt));

    return {
      profile: customer,
      orders: customerOrders.map((o) => ({
        ...o,
        items: itemsByOrder.get(o.id) || [],
      })),
      subscriptions: subs,
    };
  } catch (error) {
    console.error('Database query failed in getCustomerFullProfile:', error);
    throw new Error('Unable to load customer profile.', { cause: error });
  }
}

export async function updateCustomerProfile(
  uid: string,
  updates: {
    fullName?: string;
    phone?: string;
    defaultDeliveryAddress?: string;
    savedAddresses?: SavedAddressItem[];
    preferredLanguage?: string;
    preferredCurrency?: string;
  }
) {
  try {
    await ensureSeeded();
    const [updated] = await db
      .update(customerAccounts)
      .set({
        ...(updates.fullName !== undefined ? { fullName: updates.fullName } : {}),
        ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
        ...(updates.defaultDeliveryAddress !== undefined
          ? { defaultDeliveryAddress: updates.defaultDeliveryAddress }
          : {}),
        ...(updates.savedAddresses !== undefined ? { savedAddresses: updates.savedAddresses } : {}),
        ...(updates.preferredLanguage !== undefined
          ? { preferredLanguage: updates.preferredLanguage }
          : {}),
        ...(updates.preferredCurrency !== undefined
          ? { preferredCurrency: updates.preferredCurrency }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(customerAccounts.uid, uid))
      .returning();

    return updated;
  } catch (error) {
    console.error('Database query failed in updateCustomerProfile:', error);
    throw new Error('Unable to update customer profile.', { cause: error });
  }
}
