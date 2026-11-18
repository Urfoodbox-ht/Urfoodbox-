import { NextResponse } from 'next/server';
import { getAllOrdersWithItems } from '../../../../db/queries.ts';
import { getAuthenticatedAdmin } from '../../../../lib/auth.ts';

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
    const allOrders = await getAllOrdersWithItems();
    return NextResponse.json({ orders: allOrders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to load orders.' },
      { status: 500 }
    );
  }
}
