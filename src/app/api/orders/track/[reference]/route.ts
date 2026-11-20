import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '../../../../../db/index.ts';
import { ensureSeeded } from '../../../../../db/queries.ts';
import { orderItems, orders } from '../../../../../db/schema.ts';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { reference: rawRef } = await params;
  const reference = (rawRef || '').trim().toUpperCase();
  if (!reference || reference.length < 8) {
    return NextResponse.json({ error: 'Invalid order reference.' }, { status: 400 });
  }
  try {
    await ensureSeeded();
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
      return NextResponse.json({ error: 'Order reference not found.' }, { status: 404 });
    }

    const items = await db
      .select({
        productName: orderItems.productName,
        quantity: orderItems.quantity,
        lineTotal: orderItems.lineTotal,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    return NextResponse.json({
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
    return NextResponse.json(
      { error: error.message || 'Failed to track order.' },
      { status: 500 }
    );
  }
}
