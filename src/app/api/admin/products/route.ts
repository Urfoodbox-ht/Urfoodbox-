import { NextResponse } from 'next/server';
import { db } from '../../../../db/index.ts';
import { products } from '../../../../db/schema.ts';
import { getAuthenticatedAdmin } from '../../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'box'}-${Date.now().toString(36)}`;
}

export async function POST(request: Request) {
  const adminUser = await getAuthenticatedAdmin(request);
  if (!adminUser) {
    return NextResponse.json(
      { error: 'Administrator authentication required.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
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
    } = body || {};

    if (typeof nameEn !== 'string' || !nameEn.trim()) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
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

    return NextResponse.json(
      {
        product: {
          ...created,
          imageUrl: null,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create product.' },
      { status: 500 }
    );
  }
}
