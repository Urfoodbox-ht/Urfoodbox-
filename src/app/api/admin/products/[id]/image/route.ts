import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '../../../../../../db/index.ts';
import { productImages, products } from '../../../../../../db/schema.ts';
import { getAuthenticatedAdmin } from '../../../../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_BYTES = Math.floor(4.5 * 1024 * 1024);

export async function POST(
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
    const productId = Number(rawId);
    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('image');
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Please select an image file to upload.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_MIME.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, WEBP, or GIF images are allowed.' },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: 'Image size must be under 4.5 MB.' },
        { status: 400 }
      );
    }

    const [prod] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!prod) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const dataBase64 = Buffer.from(arrayBuffer).toString('base64');

    const result = await db.transaction(async (tx) => {
      await tx
        .delete(productImages)
        .where(
          and(eq(productImages.productId, productId), eq(productImages.purpose, 'product'))
        );

      const [img] = await tx
        .insert(productImages)
        .values({
          productId,
          purpose: 'product',
          fileName: file.name || 'product.jpg',
          mimeType: file.type,
          dataBase64,
          sizeBytes: file.size,
          isPrimary: true,
        })
        .returning();

      const [updatedProd] = await tx
        .update(products)
        .set({ primaryImageId: img.id, updatedAt: new Date() })
        .where(eq(products.id, productId))
        .returning();

      return { img, updatedProd };
    });

    return NextResponse.json({
      imageUrl: `/api/images/${result.img.id}`,
      product: {
        ...result.updatedProd,
        imageUrl: `/api/images/${result.img.id}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to upload product image.' },
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
    const productId = Number(rawId);
    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(productImages)
        .where(
          and(eq(productImages.productId, productId), eq(productImages.purpose, 'product'))
        );
      await tx
        .update(products)
        .set({ primaryImageId: null, updatedAt: new Date() })
        .where(eq(products.id, productId));
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to remove product image.' },
      { status: 500 }
    );
  }
}
