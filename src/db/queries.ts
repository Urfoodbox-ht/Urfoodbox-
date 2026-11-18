import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { asc, desc, eq, inArray } from 'drizzle-orm';
import { db } from './index.ts';
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

export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      try {
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
        throw new Error('Failed to initialize database records.', { cause: error });
      }
    })();
  }
  return seedPromise;
}

export async function getStorefrontData() {
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
    console.error('Database query failed in getStorefrontData:', error);
    throw new Error('Unable to load storefront catalog.', { cause: error });
  }
}

export async function getAllCommentsForAdmin() {
  try {
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
    const productIds = [...new Set(input.items.map((item) => item.productId))];
    if (productIds.length === 0) {
      throw new Error('Cart is empty.');
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
    if (error instanceof Error && (error.message.includes('unavailable') || error.message.includes('empty') || error.message.includes('exists'))) {
      throw error;
    }
    throw new Error('Unable to submit your order. Please try again.', { cause: error });
  }
}

export async function getAllOrdersWithItems() {
  try {
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
