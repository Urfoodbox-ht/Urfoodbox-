import { NextResponse } from 'next/server';
import { getStorefrontData } from '../../../db/queries.ts';

export const dynamic = 'force-dynamic';

export async function GET() {
  const noStoreHeaders = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  };
  try {
    const data = await getStorefrontData();
    const logoUrl = data.settings?.logoImageId
      ? `/api/images/${data.settings.logoImageId}`
      : '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg';

    return NextResponse.json(
      {
        settings: data.settings
          ? {
              ...data.settings,
              logoUrl,
            }
          : null,
        products: data.products || [],
        comments: data.comments || [],
      },
      { headers: noStoreHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to load storefront data' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
