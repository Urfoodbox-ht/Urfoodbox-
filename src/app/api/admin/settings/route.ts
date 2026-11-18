import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '../../../../db/index.ts';
import { ensureSeeded } from '../../../../db/queries.ts';
import { businessSettings } from '../../../../db/schema.ts';
import { getAuthenticatedAdmin } from '../../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  const adminUser = await getAuthenticatedAdmin(request);
  if (!adminUser) {
    return NextResponse.json(
      { error: 'Administrator authentication required.' },
      { status: 401 }
    );
  }

  try {
    await ensureSeeded();
    const body = await request.json().catch(() => ({}));
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
        return NextResponse.json(
          { error: 'Exchange rate must be a positive number.' },
          { status: 400 }
        );
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

    return NextResponse.json({
      settings: {
        ...updated,
        logoUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save business settings.' },
      { status: 500 }
    );
  }
}
