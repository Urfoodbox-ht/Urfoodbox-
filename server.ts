import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import express from 'express';
import multer from 'multer';
import { and, asc, desc, eq } from 'drizzle-orm';
import { db } from './src/db/index.ts';
import {
  administratorAccounts,
  businessSettings,
  customerComments,
  orderItems,
  orders,
  productImages,
  products,
  subscriptionRecords,
} from './src/db/schema.ts';
import {
  createCustomerComment,
  createOrderInDb,
  ensureSeeded,
  getAllCommentsForAdmin,
  getAllOrdersWithItems,
  getCustomerFullProfile,
  getImageById,
  getOrCreateCustomerAccount,
  getStorefrontData,
  updateCustomerProfile,
} from './src/db/queries.ts';
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  optionalFirebaseAuth,
  requireAdminAuth,
  requireFirebaseAuth,
  type AuthRequest,
} from './src/middleware/auth.ts';
import { adminAuth } from './src/lib/firebase-admin.ts';

const ALLOWED_ORDER_STATUSES = [
  'New',
  'Confirmed',
  'Preparing',
  'Out for delivery',
  'Delivered',
  'Cancelled',
] as const;

const ALLOWED_PAYMENT_METHODS = ['cash_on_delivery', 'wire', 'moncash', 'natcash'] as const;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP, or GIF images are allowed.'));
    }
  },
});

function setAdminSessionCookie(res: express.Response, token: string) {
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.K_SERVICE);
  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'box'}-${Date.now().toString(36)}`;
}

async function startServer() {
  const app = express();
  const port =
    process.env.NGINX_PORT || process.env.DEFAULT_APP_PORT
      ? Number(process.env.DEFAULT_APP_PORT) || 3000
      : Number(process.env.PORT) || 3000;

  app.set('trust proxy', 1);
  app.use(express.json({ limit: '2mb' }));

  // Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'urfoodbox' });
  });

  // Public Storefront Payload (Products + Business Settings)
  app.get('/api/storefront', async (_req, res) => {
    try {
      const data = await getStorefrontData();
      const logoUrl = data.settings?.logoImageId
        ? `/api/images/${data.settings.logoImageId}`
        : '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg';
      res.json({
        settings: {
          ...data.settings,
          logoUrl,
        },
        products: data.products,
        comments: data.comments,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load storefront data' });
    }
  });

  // Public Client Comments
  app.get('/api/comments', async (_req, res) => {
    try {
      const data = await getStorefrontData();
      res.json({ comments: data.comments });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load comments.' });
    }
  });

  app.post('/api/comments', async (req, res) => {
    try {
      const { authorName, rating = 5, commentText } = req.body || {};
      if (typeof authorName !== 'string' || authorName.trim().length < 2 || authorName.trim().length > 80) {
        return res.status(400).json({ error: 'Please enter your name (2–80 characters).' });
      }
      if (
        typeof commentText !== 'string' ||
        commentText.trim().length < 3 ||
        commentText.trim().length > 600
      ) {
        return res.status(400).json({ error: 'Please enter a comment (3–600 characters).' });
      }
      const parsedRating = Number(rating);
      if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
      }

      const created = await createCustomerComment({
        authorName,
        rating: parsedRating,
        commentText,
      });
      res.status(201).json({ comment: created });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to submit comment.' });
    }
  });

  // Public Image Serving (from Cloud SQL product_images)
  app.get('/api/images/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid image ID' });
    }
    try {
      const img = await getImageById(id);
      if (!img) {
        return res.status(404).json({ error: 'Image not found' });
      }
      const buffer = Buffer.from(img.dataBase64, 'base64');
      res.setHeader('Content-Type', img.mimeType);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(buffer);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to serve image' });
    }
  });

  // Public Guest / Customer Order Submission
  app.post('/api/orders', optionalFirebaseAuth, async (req: AuthRequest, res) => {
    try {
      const {
        customerName,
        customerPhone,
        deliveryAddress,
        orderInstructions = '',
        boxPeriod,
        householdSize,
        currency,
        paymentMethod,
        items,
      } = req.body || {};

      if (typeof customerName !== 'string' || customerName.trim().length < 2) {
        return res.status(400).json({ error: 'Full name is required.' });
      }
      if (typeof customerPhone !== 'string' || customerPhone.trim().length < 5) {
        return res.status(400).json({ error: 'Valid phone number is required.' });
      }
      if (typeof deliveryAddress !== 'string' || deliveryAddress.trim().length < 4) {
        return res.status(400).json({ error: 'Delivery address is required.' });
      }
      if (typeof boxPeriod !== 'string' || boxPeriod.trim().length < 2 || boxPeriod.trim().length > 80) {
        return res.status(400).json({ error: 'Please specify how long you need the food box for.' });
      }
      const parsedHouseholdSize = Number(householdSize);
      if (!Number.isInteger(parsedHouseholdSize) || parsedHouseholdSize < 1 || parsedHouseholdSize > 99) {
        return res.status(400).json({ error: 'Please specify how many persons the food box is for (1–99).' });
      }
      if (currency !== 'USD' && currency !== 'HTG') {
        return res.status(400).json({ error: 'Currency must be USD or HTG.' });
      }
      if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
        return res.status(400).json({ error: 'Invalid payment method selected.' });
      }
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'At least one product must be in your cart.' });
      }

      let customerAccountId: number | null = null;
      if (req.firebaseUser?.uid && req.firebaseUser?.email) {
        const customer = await getOrCreateCustomerAccount(
          req.firebaseUser.uid,
          req.firebaseUser.email,
          req.firebaseUser.name
        );
        customerAccountId = customer.id;
      }

      const created = await createOrderInDb({
        customerAccountId,
        customerName,
        customerPhone,
        deliveryAddress,
        orderInstructions: typeof orderInstructions === 'string' ? orderInstructions : '',
        boxPeriod: boxPeriod.trim(),
        householdSize: parsedHouseholdSize,
        currency,
        paymentMethod,
        items: items.map((i: any) => ({
          productId: Number(i.productId),
          quantity: Number(i.quantity),
        })),
      });

      res.status(201).json({
        orderReference: created.orderReference,
        status: created.status,
        currency: created.currency,
        paymentMethod: created.paymentMethod,
        boxPeriod: created.boxPeriod,
        householdSize: created.householdSize,
        subtotalAmount: created.subtotalAmount,
        totalAmount: created.totalAmount,
        createdAt: created.createdAt,
        items: created.items,
      });
    } catch (error: any) {
      const status = error.message?.includes('unavailable') || error.message?.includes('empty') ? 400 : 500;
      res.status(status).json({ error: error.message || 'Failed to submit order.' });
    }
  });

  // Public Order Status Lookup by Exact Reference (No PII exposed)
  app.get('/api/orders/track/:reference', async (req, res) => {
    const reference = (req.params.reference || '').trim().toUpperCase();
    if (!reference || reference.length < 8) {
      return res.status(400).json({ error: 'Invalid order reference.' });
    }
    try {
      const [order] = await db
        .select({
          id: orders.id,
          orderReference: orders.orderReference,
          boxPeriod: orders.boxPeriod,
          householdSize: orders.householdSize,
          currency: orders.currency,
          paymentMethod: orders.paymentMethod,
          totalAmount: orders.totalAmount,
          status: orders.status,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .where(eq(orders.orderReference, reference))
        .limit(1);

      if (!order) {
        return res.status(404).json({ error: 'Order reference not found.' });
      }

      const items = await db
        .select({
          productName: orderItems.productName,
          quantity: orderItems.quantity,
          lineTotal: orderItems.lineTotal,
        })
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      res.json({
        orderReference: order.orderReference,
        boxPeriod: order.boxPeriod,
        householdSize: order.householdSize,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        items,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to track order.' });
    }
  });

  // ===================== OPTIONAL CUSTOMER ACCOUNT ROUTES =====================

  app.get('/api/customer/me', requireFirebaseAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.firebaseUser!.uid;
      const email = req.firebaseUser!.email || '';
      const data = await getCustomerFullProfile(uid, email);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch customer profile.' });
    }
  });

  app.put('/api/customer/me', requireFirebaseAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.firebaseUser!.uid;
      const email = req.firebaseUser!.email || '';
      await getOrCreateCustomerAccount(uid, email);

      const {
        fullName,
        phone,
        defaultDeliveryAddress,
        savedAddresses,
        preferredLanguage,
        preferredCurrency,
      } = req.body || {};

      const updated = await updateCustomerProfile(uid, {
        ...(typeof fullName === 'string' ? { fullName: fullName.trim() } : {}),
        ...(typeof phone === 'string' ? { phone: phone.trim() } : {}),
        ...(typeof defaultDeliveryAddress === 'string'
          ? { defaultDeliveryAddress: defaultDeliveryAddress.trim() }
          : {}),
        ...(Array.isArray(savedAddresses) ? { savedAddresses } : {}),
        ...(preferredLanguage === 'en' || preferredLanguage === 'fr' || preferredLanguage === 'ht'
          ? { preferredLanguage }
          : {}),
        ...(preferredCurrency === 'USD' || preferredCurrency === 'HTG'
          ? { preferredCurrency }
          : {}),
      });

      res.json({ profile: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update profile.' });
    }
  });

  app.post('/api/customer/subscriptions', requireFirebaseAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.firebaseUser!.uid;
      const email = req.firebaseUser!.email || '';
      const customer = await getOrCreateCustomerAccount(uid, email);

      const { productId, frequency, preferredDeliveryDay, deliveryAddress, notes } = req.body || {};
      if (frequency !== 'weekly' && frequency !== 'monthly') {
        return res.status(400).json({ error: 'Frequency must be weekly or monthly.' });
      }

      const [created] = await db
        .insert(subscriptionRecords)
        .values({
          customerAccountId: customer.id,
          productId: productId ? Number(productId) : null,
          frequency,
          preferredDeliveryDay:
            typeof preferredDeliveryDay === 'string' && preferredDeliveryDay.trim()
              ? preferredDeliveryDay.trim()
              : 'Saturday',
          deliveryAddress:
            typeof deliveryAddress === 'string' ? deliveryAddress.trim() : customer.defaultDeliveryAddress,
          notes: typeof notes === 'string' ? notes.trim() : '',
          status: 'waitlist',
          paymentProviderConfigured: false,
        })
        .returning();

      res.status(201).json({ subscription: created });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to save subscription preference.' });
    }
  });

  app.patch('/api/customer/subscriptions/:id', requireFirebaseAuth, async (req: AuthRequest, res) => {
    try {
      const subId = Number(req.params.id);
      if (!Number.isInteger(subId) || subId <= 0) {
        return res.status(400).json({ error: 'Invalid subscription ID.' });
      }
      const uid = req.firebaseUser!.uid;
      const email = req.firebaseUser!.email || '';
      const customer = await getOrCreateCustomerAccount(uid, email);

      const { status } = req.body || {};
      if (status !== 'waitlist' && status !== 'paused' && status !== 'cancelled') {
        return res.status(400).json({ error: 'Invalid subscription status.' });
      }

      const [updated] = await db
        .update(subscriptionRecords)
        .set({ status, updatedAt: new Date() })
        .where(
          and(
            eq(subscriptionRecords.id, subId),
            eq(subscriptionRecords.customerAccountId, customer.id)
          )
        )
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Subscription preference not found.' });
      }
      res.json({ subscription: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update subscription preference.' });
    }
  });

  // ===================== PRIVATE OWNER ADMIN ROUTES =====================

  app.post('/api/admin/login', async (req, res) => {
    try {
      await ensureSeeded();
      const { email, password } = req.body || {};
      if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const [admin] = await db
        .select()
        .from(administratorAccounts)
        .where(eq(administratorAccounts.email, email.trim().toLowerCase()))
        .limit(1);

      if (!admin || !admin.isActive) {
        return res.status(401).json({ error: 'Invalid administrator credentials.' });
      }

      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid administrator credentials.' });
      }

      await db
        .update(administratorAccounts)
        .set({ lastLoginAt: new Date() })
        .where(eq(administratorAccounts.id, admin.id));

      const token = createAdminSessionToken({
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
      });
      setAdminSessionCookie(res, token);

      res.json({
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
        },
      });
    } catch (error: any) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'Failed to sign in.' });
    }
  });

  app.post('/api/admin/login-google', async (req, res) => {
    try {
      await ensureSeeded();
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing Google ID token.' });
      }
      const idToken = authHeader.slice('Bearer '.length).trim();
      const decoded = await adminAuth.verifyIdToken(idToken);
      if (!decoded.email || !decoded.email_verified) {
        return res.status(401).json({ error: 'Verified email required.' });
      }

      const [admin] = await db
        .select()
        .from(administratorAccounts)
        .where(eq(administratorAccounts.email, decoded.email.toLowerCase()))
        .limit(1);

      if (!admin || !admin.isActive) {
        return res.status(403).json({
          error: 'This Google account is not authorized as a store administrator.',
        });
      }

      await db
        .update(administratorAccounts)
        .set({ firebaseUid: decoded.uid, lastLoginAt: new Date() })
        .where(eq(administratorAccounts.id, admin.id));

      const token = createAdminSessionToken({
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
      });
      setAdminSessionCookie(res, token);

      res.json({
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
        },
      });
    } catch (error: any) {
      console.error('Admin Google login error:', error);
      res.status(401).json({ error: 'Google administrator sign-in failed.' });
    }
  });

  app.post('/api/admin/logout', (_req, res) => {
    res.clearCookie(ADMIN_COOKIE_NAME, { path: '/' });
    res.json({ ok: true });
  });

  app.get('/api/admin/session', requireAdminAuth, (req: AuthRequest, res) => {
    res.json({ admin: req.adminUser });
  });

  app.post('/api/admin/change-password', requireAdminAuth, async (req: AuthRequest, res) => {
    try {
      const { currentPassword, newPassword } = req.body || {};
      if (typeof newPassword !== 'string' || newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters.' });
      }

      const [admin] = await db
        .select()
        .from(administratorAccounts)
        .where(eq(administratorAccounts.id, req.adminUser!.id))
        .limit(1);

      if (!admin) {
        return res.status(404).json({ error: 'Administrator not found.' });
      }

      if (typeof currentPassword === 'string' && currentPassword.length > 0) {
        const matches = await bcrypt.compare(currentPassword, admin.passwordHash);
        if (!matches) {
          return res.status(400).json({ error: 'Current password is incorrect.' });
        }
      } else {
        return res.status(400).json({ error: 'Current password is required.' });
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await db
        .update(administratorAccounts)
        .set({ passwordHash: newHash })
        .where(eq(administratorAccounts.id, admin.id));

      res.json({ ok: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update password.' });
    }
  });

  app.get('/api/admin/overview', requireAdminAuth, async (_req, res) => {
    try {
      const data = await getStorefrontData();
      const allOrders = await getAllOrdersWithItems();
      const allComments = await getAllCommentsForAdmin();
      const subs = await db
        .select()
        .from(subscriptionRecords)
        .orderBy(desc(subscriptionRecords.createdAt));

      const logoUrl = data.settings?.logoImageId
        ? `/api/images/${data.settings.logoImageId}`
        : '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg';

      res.json({
        settings: {
          ...data.settings,
          logoUrl,
        },
        products: data.products,
        orders: allOrders,
        comments: allComments,
        subscriptions: subs,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load admin overview.' });
    }
  });

  // Admin Client Comments Moderation
  app.patch('/api/admin/comments/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid comment ID.' });
      }
      const { isVisible } = req.body || {};
      if (typeof isVisible !== 'boolean') {
        return res.status(400).json({ error: 'isVisible boolean is required.' });
      }
      const [updated] = await db
        .update(customerComments)
        .set({ isVisible })
        .where(eq(customerComments.id, id))
        .returning();
      if (!updated) {
        return res.status(404).json({ error: 'Comment not found.' });
      }
      res.json({ comment: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update comment.' });
    }
  });

  app.delete('/api/admin/comments/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid comment ID.' });
      }
      const deleted = await db
        .delete(customerComments)
        .where(eq(customerComments.id, id))
        .returning({ id: customerComments.id });
      if (deleted.length === 0) {
        return res.status(404).json({ error: 'Comment not found.' });
      }
      res.json({ ok: true, id });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete comment.' });
    }
  });

  // Admin Product CRUD
  app.post('/api/admin/products', requireAdminAuth, async (req, res) => {
    try {
      const {
        nameEn,
        nameFr = '',
        nameHt = '',
        descriptionEn = '',
        descriptionFr = '',
        descriptionHt = '',
        priceUsd = '0.00',
        priceHtg = '0.00',
        isAvailable = true,
        isFeatured = true,
        sortOrder = 10,
      } = req.body || {};

      if (typeof nameEn !== 'string' || !nameEn.trim()) {
        return res.status(400).json({ error: 'Product name is required.' });
      }

      const usdNum = Math.max(0, Number(priceUsd) || 0);
      const htgNum = Math.max(0, Number(priceHtg) || 0);

      const [created] = await db
        .insert(products)
        .values({
          slug: slugify(nameEn),
          nameEn: nameEn.trim(),
          nameFr: typeof nameFr === 'string' && nameFr.trim() ? nameFr.trim() : nameEn.trim(),
          nameHt: typeof nameHt === 'string' && nameHt.trim() ? nameHt.trim() : nameEn.trim(),
          descriptionEn: typeof descriptionEn === 'string' ? descriptionEn.trim() : '',
          descriptionFr: typeof descriptionFr === 'string' ? descriptionFr.trim() : '',
          descriptionHt: typeof descriptionHt === 'string' ? descriptionHt.trim() : '',
          priceUsd: usdNum.toFixed(2),
          priceHtg: htgNum.toFixed(2),
          isAvailable: Boolean(isAvailable),
          isFeatured: Boolean(isFeatured),
          sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 10,
        })
        .returning();

      res.status(201).json({
        product: {
          ...created,
          imageUrl: null,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create product.' });
    }
  });

  app.put('/api/admin/products/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid product ID.' });
      }

      const {
        nameEn,
        nameFr,
        nameHt,
        descriptionEn,
        descriptionFr,
        descriptionHt,
        priceUsd,
        priceHtg,
        isAvailable,
        isFeatured,
        sortOrder,
      } = req.body || {};

      const updateFields: Record<string, any> = { updatedAt: new Date() };
      if (typeof nameEn === 'string' && nameEn.trim()) updateFields.nameEn = nameEn.trim();
      if (typeof nameFr === 'string') updateFields.nameFr = nameFr.trim();
      if (typeof nameHt === 'string') updateFields.nameHt = nameHt.trim();
      if (typeof descriptionEn === 'string') updateFields.descriptionEn = descriptionEn;
      if (typeof descriptionFr === 'string') updateFields.descriptionFr = descriptionFr;
      if (typeof descriptionHt === 'string') updateFields.descriptionHt = descriptionHt;
      if (priceUsd !== undefined) updateFields.priceUsd = Math.max(0, Number(priceUsd) || 0).toFixed(2);
      if (priceHtg !== undefined) updateFields.priceHtg = Math.max(0, Number(priceHtg) || 0).toFixed(2);
      if (typeof isAvailable === 'boolean') updateFields.isAvailable = isAvailable;
      if (typeof isFeatured === 'boolean') updateFields.isFeatured = isFeatured;
      if (sortOrder !== undefined && Number.isFinite(Number(sortOrder))) {
        updateFields.sortOrder = Number(sortOrder);
      }

      const [updated] = await db
        .update(products)
        .set(updateFields)
        .where(eq(products.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      res.json({
        product: {
          ...updated,
          imageUrl: updated.primaryImageId ? `/api/images/${updated.primaryImageId}` : null,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update product.' });
    }
  });

  app.delete('/api/admin/products/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid product ID.' });
      }
      const deleted = await db.delete(products).where(eq(products.id, id)).returning({ id: products.id });
      if (deleted.length === 0) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      res.json({ ok: true, id });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete product.' });
    }
  });

  // Upload or replace product image
  app.post(
    '/api/admin/products/:id/image',
    requireAdminAuth,
    upload.single('image'),
    async (req, res) => {
      try {
        const productId = Number(req.params.id);
        if (!Number.isInteger(productId) || productId <= 0) {
          return res.status(400).json({ error: 'Invalid product ID.' });
        }
        if (!req.file) {
          return res.status(400).json({ error: 'Please select an image file to upload.' });
        }

        const [prod] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
        if (!prod) {
          return res.status(404).json({ error: 'Product not found.' });
        }

        const dataBase64 = req.file.buffer.toString('base64');

        const result = await db.transaction(async (tx) => {
          // Remove old primary images for this product to keep DB lean
          await tx
            .delete(productImages)
            .where(and(eq(productImages.productId, productId), eq(productImages.purpose, 'product')));

          const [img] = await tx
            .insert(productImages)
            .values({
              productId,
              purpose: 'product',
              fileName: req.file!.originalname || 'product.jpg',
              mimeType: req.file!.mimetype,
              dataBase64,
              sizeBytes: req.file!.size,
              isPrimary: true,
            })
            .returning();

          const [updatedProd] = await tx
            .update(products)
            .set({ primaryImageId: img.id, updatedAt: new Date() })
            .where(eq(products.id, productId))
            .returning();

          return { img, updatedProd };
        });

        res.json({
          imageUrl: `/api/images/${result.img.id}`,
          product: {
            ...result.updatedProd,
            imageUrl: `/api/images/${result.img.id}`,
          },
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to upload product image.' });
      }
    }
  );

  // Remove product image back to empty placeholder
  app.delete('/api/admin/products/:id/image', requireAdminAuth, async (req, res) => {
    try {
      const productId = Number(req.params.id);
      if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(400).json({ error: 'Invalid product ID.' });
      }
      await db.transaction(async (tx) => {
        await tx
          .delete(productImages)
          .where(and(eq(productImages.productId, productId), eq(productImages.purpose, 'product')));
        await tx
          .update(products)
          .set({ primaryImageId: null, updatedAt: new Date() })
          .where(eq(products.id, productId));
      });
      res.json({ ok: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to remove product image.' });
    }
  });

  // Upload or reset custom business logo
  app.post('/api/admin/logo', requireAdminAuth, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Please select a logo file to upload.' });
      }
      const dataBase64 = req.file.buffer.toString('base64');

      const [img] = await db.transaction(async (tx) => {
        await tx.delete(productImages).where(eq(productImages.purpose, 'logo'));
        const inserted = await tx
          .insert(productImages)
          .values({
            productId: null,
            purpose: 'logo',
            fileName: req.file!.originalname || 'logo.png',
            mimeType: req.file!.mimetype,
            dataBase64,
            sizeBytes: req.file!.size,
            isPrimary: true,
          })
          .returning();

        await tx
          .update(businessSettings)
          .set({ logoImageId: inserted[0].id, updatedAt: new Date() })
          .where(eq(businessSettings.singletonKey, 'default'));

        return inserted;
      });

      res.json({ logoImageId: img.id, logoUrl: `/api/images/${img.id}` });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to upload logo.' });
    }
  });

  app.delete('/api/admin/logo', requireAdminAuth, async (_req, res) => {
    try {
      await db.transaction(async (tx) => {
        await tx.delete(productImages).where(eq(productImages.purpose, 'logo'));
        await tx
          .update(businessSettings)
          .set({ logoImageId: null, updatedAt: new Date() })
          .where(eq(businessSettings.singletonKey, 'default'));
      });
      res.json({
        ok: true,
        logoUrl: '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to reset logo.' });
    }
  });

  // Admin Orders Management
  app.get('/api/admin/orders', requireAdminAuth, async (_req, res) => {
    try {
      const allOrders = await getAllOrdersWithItems();
      res.json({ orders: allOrders });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load orders.' });
    }
  });

  app.patch('/api/admin/orders/:id/status', requireAdminAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid order ID.' });
      }
      const { status } = req.body || {};
      if (!ALLOWED_ORDER_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'Invalid order status.' });
      }

      const [updated] = await db
        .update(orders)
        .set({ status, updatedAt: new Date() })
        .where(eq(orders.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Order not found.' });
      }
      res.json({ order: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update order status.' });
    }
  });

  // Admin Settings & Exchange Rate
  app.put('/api/admin/settings', requireAdminAuth, async (req, res) => {
    try {
      await ensureSeeded();
      const body = req.body || {};
      const updates: Record<string, any> = { updatedAt: new Date() };

      const stringFields = [
        'businessName',
        'slogan',
        'whatsappNumber',
        'tiktokUrl',
        'facebookUrl',
        'contactEmail',
        'contactAddress',
        'promoTitleEn',
        'promoTitleFr',
        'promoTitleHt',
        'promoSubtitleEn',
        'promoSubtitleFr',
        'promoSubtitleHt',
        'promoBannerEn',
        'promoBannerFr',
        'promoBannerHt',
      ] as const;

      for (const field of stringFields) {
        if (typeof body[field] === 'string') {
          updates[field] = body[field].trim();
        }
      }

      if (body.exchangeRateHtgPerUsd !== undefined) {
        const rate = Number(body.exchangeRateHtgPerUsd);
        if (!Number.isFinite(rate) || rate <= 0) {
          return res.status(400).json({ error: 'Exchange rate must be a positive number.' });
        }
        updates.exchangeRateHtgPerUsd = rate.toFixed(2);
      }

      if (typeof body.subscriptionsEnabled === 'boolean') {
        updates.subscriptionsEnabled = body.subscriptionsEnabled;
      }

      const [updated] = await db
        .update(businessSettings)
        .set(updates)
        .where(eq(businessSettings.singletonKey, 'default'))
        .returning();

      const logoUrl = updated.logoImageId
        ? `/api/images/${updated.logoImageId}`
        : '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg';

      res.json({
        settings: {
          ...updated,
          logoUrl,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to save business settings.' });
    }
  });

  // Multer & API error handler
  app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof multer.MulterError || err?.message?.includes('Only JPG')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  });

  // Frontend Serving: Vite dev middleware or static dist/
  const distPath = path.resolve(process.cwd(), 'dist');
  const distIndexPath = path.join(distPath, 'index.html');
  const isRunningUnderTsx = process.execArgv.some((arg) => arg.includes('tsx'));
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (!isRunningUnderTsx && process.env.NODE_ENV !== 'development' && fs.existsSync(distIndexPath));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(distIndexPath);
    });
  }

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`UrFoodBox server running on http://0.0.0.0:${port}`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE' && port !== 3000) {
      console.warn(`Port ${port} is in use, falling back to port 3000`);
      app.listen(3000, '0.0.0.0', () => {
        console.log('UrFoodBox server running on http://0.0.0.0:3000');
      });
    } else {
      throw err;
    }
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
