import { NextResponse } from 'next/server';
import { db } from '../../../../db/index.ts';
import { getOrCreateCustomerAccount } from '../../../../db/queries.ts';
import { subscriptionRecords } from '../../../../db/schema.ts';
import { getAuthenticatedFirebaseUser } from '../../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const firebaseUser = await getAuthenticatedFirebaseUser(request);
  if (!firebaseUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  try {
    const customer = await getOrCreateCustomerAccount(firebaseUser.uid, firebaseUser.email || '');
    const body = await request.json().catch(() => ({}));
    const { productId, frequency, preferredDeliveryDay, deliveryAddress, notes } = body || {};

    if (frequency !== 'weekly' && frequency !== 'monthly') {
      return NextResponse.json(
        { error: 'Frequency must be weekly or monthly.' },
        { status: 400 }
      );
    }

    let parsedProductId: number | null = null;
    if (productId !== undefined && productId !== null && productId !== '') {
      const n = Number(productId);
      if (!Number.isInteger(n) || n <= 0) {
        return NextResponse.json({ error: 'Invalid food box selection.' }, { status: 400 });
      }
      parsedProductId = n;
    }

    const [created] = await db
      .insert(subscriptionRecords)
      .values({
        customerAccountId: customer.id,
        productId: parsedProductId,
        frequency,
        preferredDeliveryDay:
          typeof preferredDeliveryDay === 'string' && preferredDeliveryDay.trim()
            ? preferredDeliveryDay.trim()
            : 'Saturday',
        deliveryAddress:
          typeof deliveryAddress === 'string'
            ? deliveryAddress.trim()
            : customer.defaultDeliveryAddress,
        notes: typeof notes === 'string' ? notes.trim() : '',
        status: 'waitlist',
        paymentProviderConfigured: false,
      })
      .returning();

    return NextResponse.json({ subscription: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save subscription preference.' },
      { status: 500 }
    );
  }
}
