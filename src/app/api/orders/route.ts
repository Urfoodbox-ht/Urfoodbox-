import { NextResponse } from 'next/server';
import { createOrderInDb, getOrCreateCustomerAccount } from '../../../db/queries.ts';
import { getAuthenticatedFirebaseUser } from '../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

const ALLOWED_PAYMENT_METHODS = ['cash_on_delivery', 'wire', 'moncash', 'natcash'] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
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
    } = body || {};

    if (typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }
    if (typeof customerPhone !== 'string' || customerPhone.trim().length < 5) {
      return NextResponse.json({ error: 'Valid phone number is required.' }, { status: 400 });
    }
    if (typeof deliveryAddress !== 'string' || deliveryAddress.trim().length < 4) {
      return NextResponse.json({ error: 'Delivery address is required.' }, { status: 400 });
    }
    if (typeof boxPeriod !== 'string' || boxPeriod.trim().length < 2 || boxPeriod.trim().length > 80) {
      return NextResponse.json(
        { error: 'Please specify how long you need the food box for.' },
        { status: 400 }
      );
    }
    const parsedHouseholdSize = Number(householdSize);
    if (!Number.isInteger(parsedHouseholdSize) || parsedHouseholdSize < 1 || parsedHouseholdSize > 99) {
      return NextResponse.json(
        { error: 'Please specify how many persons the food box is for (1–99).' },
        { status: 400 }
      );
    }
    if (currency !== 'USD' && currency !== 'HTG') {
      return NextResponse.json({ error: 'Currency must be USD or HTG.' }, { status: 400 });
    }
    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method selected.' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one product must be in your cart.' },
        { status: 400 }
      );
    }

    const normalizedItems: { productId: number; quantity: number }[] = [];
    for (const rawItem of items) {
      const productId = Number(rawItem?.productId);
      const quantity = Number(rawItem?.quantity);
      if (!Number.isInteger(productId) || productId <= 0) {
        return NextResponse.json({ error: 'Invalid product selected in cart.' }, { status: 400 });
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return NextResponse.json(
          { error: 'Product quantity must be between 1 and 99.' },
          { status: 400 }
        );
      }
      normalizedItems.push({ productId, quantity });
    }

    let customerAccountId: number | null = null;
    const firebaseUser = await getAuthenticatedFirebaseUser(request);
    if (firebaseUser?.uid && firebaseUser?.email) {
      const customer = await getOrCreateCustomerAccount(
        firebaseUser.uid,
        firebaseUser.email,
        firebaseUser.name
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
      items: normalizedItems,
    });

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error: any) {
    const status =
      error.message?.includes('unavailable') ||
      error.message?.includes('empty') ||
      error.message?.includes('exists') ||
      error.message?.includes('invalid')
        ? 400
        : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to submit order.' },
      { status }
    );
  }
}
