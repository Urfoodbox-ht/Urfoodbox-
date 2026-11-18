import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '../../../../../../db/index.ts';
import { orders } from '../../../../../../db/schema.ts';
import { getAuthenticatedAdmin } from '../../../../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

const ALLOWED_ORDER_STATUSES = [
  'New',
  'Confirmed',
  'Preparing',
  'Out for delivery',
  'Delivered',
  'Cancelled',
] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUser = await getAuthenticatedAdmin(request);
  if (!adminUser) {
    return NextResponse.json(
      { error: 'Administrator authentication required.' },
      { status: 401 }
    );
  }

  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'Invalid order ID.' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { status } = body || {};
    if (!ALLOWED_ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status.' }, { status: 400 });
    }

    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ order: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update order status.' },
      { status: 500 }
    );
  }
}
