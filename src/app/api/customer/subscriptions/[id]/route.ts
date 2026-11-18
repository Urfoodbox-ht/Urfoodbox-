import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '../../../../../db/index.ts';
import { getOrCreateCustomerAccount } from '../../../../../db/queries.ts';
import { subscriptionRecords } from '../../../../../db/schema.ts';
import { getAuthenticatedFirebaseUser } from '../../../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const firebaseUser = await getAuthenticatedFirebaseUser(request);
  if (!firebaseUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  try {
    const { id: rawId } = await params;
    const subId = Number(rawId);
    if (!Number.isInteger(subId) || subId <= 0) {
      return NextResponse.json({ error: 'Invalid subscription ID.' }, { status: 400 });
    }
    const customer = await getOrCreateCustomerAccount(firebaseUser.uid, firebaseUser.email || '');
    const body = await request.json().catch(() => ({}));
    const { status } = body || {};

    if (status !== 'waitlist' && status !== 'paused' && status !== 'cancelled') {
      return NextResponse.json({ error: 'Invalid subscription status.' }, { status: 400 });
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
      return NextResponse.json(
        { error: 'Subscription preference not found.' },
        { status: 404 }
      );
    }
    return NextResponse.json({ subscription: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update subscription preference.' },
      { status: 500 }
    );
  }
}
