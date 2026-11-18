import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '../../../../db/index.ts';
import { businessSettings, productImages } from '../../../../db/schema.ts';
import { getAuthenticatedAdmin } from '../../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_BYTES = Math.floor(4.5 * 1024 * 1024);

export async function POST(request: Request) {
  const adminUser = await getAuthenticatedAdmin(request);
  if (!adminUser) {
    return NextResponse.json(
      { error: 'Administrator authentication required.' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image');
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Please select a logo file to upload.' },
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

    const arrayBuffer = await file.arrayBuffer();
    const dataBase64 = Buffer.from(arrayBuffer).toString('base64');

    const [img] = await db.transaction(async (tx) => {
      await tx.delete(productImages).where(eq(productImages.purpose, 'logo'));
      const inserted = await tx
        .insert(productImages)
        .values({
          productId: null,
          purpose: 'logo',
          fileName: file.name || 'logo.png',
          mimeType: file.type,
          dataBase64,
          sizeBytes: file.size,
          isPrimary: true,
        })
        .returning();

      await tx
        .update(businessSettings)
        .set({ logoImageId: inserted[0].id, updatedAt: new Date() })
        .where(eq(businessSettings.singletonKey, 'default'));

      return inserted;
    });

    return NextResponse.json({
      logoImageId: img.id,
      logoUrl: `/api/images/${img.id}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to upload logo.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const adminUser = await getAuthenticatedAdmin(request);
  if (!adminUser) {
    return NextResponse.json(
      { error: 'Administrator authentication required.' },
      { status: 401 }
    );
  }

  try {
    await db.transaction(async (tx) => {
      await tx.delete(productImages).where(eq(productImages.purpose, 'logo'));
      await tx
        .update(businessSettings)
        .set({ logoImageId: null, updatedAt: new Date() })
        .where(eq(businessSettings.singletonKey, 'default'));
    });

    return NextResponse.json({
      ok: true,
      logoUrl: '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to reset logo.' },
      { status: 500 }
    );
  }
}
