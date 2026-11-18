import { NextResponse } from 'next/server';
import {
  getCustomerFullProfile,
  getOrCreateCustomerAccount,
  updateCustomerProfile,
} from '../../../../db/queries.ts';
import { getAuthenticatedFirebaseUser } from '../../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const firebaseUser = await getAuthenticatedFirebaseUser(request);
  if (!firebaseUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  try {
    const data = await getCustomerFullProfile(firebaseUser.uid, firebaseUser.email || '');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customer profile.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const firebaseUser = await getAuthenticatedFirebaseUser(request);
  if (!firebaseUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  try {
    await getOrCreateCustomerAccount(firebaseUser.uid, firebaseUser.email || '');
    const body = await request.json().catch(() => ({}));
    const {
      fullName,
      phone,
      defaultDeliveryAddress,
      savedAddresses,
      preferredLanguage,
      preferredCurrency,
    } = body || {};

    const updated = await updateCustomerProfile(firebaseUser.uid, {
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

    return NextResponse.json({ profile: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
