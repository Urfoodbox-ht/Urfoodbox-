import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '../../../../../db/index.ts';
import { products } from '../../../../../db/schema.ts';
import { getAuthenticatedAdmin } from '../../../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

export async function PUT(
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
      return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      nameEn,
      nameFr,
      nameHt,
      descriptionEn,
      descriptionFr,
      descriptionHt,
      priceUsd,
      priceHtg,
      isAvailable,
      isFeatured,
      sortOrder,
    } = body || {};

    const updateFields: Record<string, any> = { updatedAt: new Date() };
    if (typeof nameEn === 'string' && nameEn.trim()) updateFields.nameEn = nameEn.trim();
    if (typeof nameFr === 'string') updateFields.nameFr = nameFr.trim();
    if (typeof nameHt === 'string') updateFields.nameHt = nameHt.trim();
    if (typeof descriptionEn === 'string') updateFields.descriptionEn = descriptionEn;
    if (typeof descriptionFr === 'string') updateFields.descriptionFr = descriptionFr;
    if (typeof descriptionHt === 'string') updateFields.descriptionHt = descriptionHt;
    if (priceUsd !== undefined) {
      const usdNum = Number(priceUsd);
      if (!Number.isFinite(usdNum) || usdNum < 0) {
        return NextResponse.json({ error: 'USD price must be 0 or higher.' }, { status: 400 });
      }
      updateFields.priceUsd = usdNum.toFixed(2);
    }
    if (priceHtg !== undefined) {
      const htgNum = Number(priceHtg);
      if (!Number.isFinite(htgNum) || htgNum < 0) {
        return NextResponse.json({ error: 'HTG price must be 0 or higher.' }, { status: 400 });
      }
      updateFields.priceHtg = htgNum.toFixed(2);
    }
    if (typeof isAvailable === 'boolean') updateFields.isAvailable = isAvailable;
    if (typeof isFeatured === 'boolean') updateFields.isFeatured = isFeatured;
    if (sortOrder !== undefined && Number.isFinite(Number(sortOrder))) {
      updateFields.sortOrder = Math.trunc(Number(sortOrder));
    }

    const [updated] = await db
      .update(products)
      .set(updateFields)
      .where(eq(products.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({
      product: {
        ...updated,
        imageUrl: updated.primaryImageId ? `/api/images/${updated.primaryImageId}` : null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update product.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
      return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
    }

    const deleted = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete product.' },
      { status: 500 }
    );
  }
}
