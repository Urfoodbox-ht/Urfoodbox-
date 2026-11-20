import { NextResponse } from 'next/server';
import { hasConfiguredDatabase } from '../../../db/index.ts';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: 'urfoodbox',
      databaseConfigured: hasConfiguredDatabase(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
