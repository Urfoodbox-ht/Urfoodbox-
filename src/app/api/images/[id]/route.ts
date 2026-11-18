import { NextResponse } from 'next/server';
import { getImageById } from '../../../../db/queries.ts';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
  }
  try {
    const img = await getImageById(id);
    if (!img) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    const buffer = Buffer.from(img.dataBase64, 'base64');
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': img.mimeType,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to serve image' },
      { status: 500 }
    );
  }
}
