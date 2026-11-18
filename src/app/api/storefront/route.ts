import { NextResponse } from 'next/server';
import { getStorefrontData } from '../../../db/queries.ts';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getStorefrontData();
    const logoUrl = data.settings?.logoImageId
      ? `/api/images/${data.settings.logoImageId}`
      : '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg';

    return NextResponse.json({
      settings: {
        ...data.settings,
        logoUrl,
      },
      products: data.products,
      comments: data.comments,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to load storefront data' },
      { status: 500 }
    );
  }
}
