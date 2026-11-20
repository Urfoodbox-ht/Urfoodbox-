import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '../../../../db/index.ts';
import {
  getAllCommentsForAdmin,
  getAllOrdersWithItems,
  getStorefrontData,
} from '../../../../db/queries.ts';
import { subscriptionRecords } from '../../../../db/schema.ts';
import { getAuthenticatedAdmin } from '../../../../lib/auth.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const adminUser = await getAuthenticatedAdmin(request);
  if (!adminUser) {
    return NextResponse.json(
      { error: 'Administrator authentication required.' },
      { status: 401 }
    );
  }

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

    return NextResponse.json({
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
    return NextResponse.json(
      { error: error.message || 'Failed to load admin overview.' },
      { status: 500 }
    );
  }
}
