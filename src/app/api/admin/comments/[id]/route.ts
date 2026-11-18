import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '../../../../../db/index.ts';
import { customerComments } from '../../../../../db/schema.ts';
import { getAuthenticatedAdmin } from '../../../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

export async function PATCH(
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
      return NextResponse.json({ error: 'Invalid comment ID.' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { isVisible } = body || {};
    if (typeof isVisible !== 'boolean') {
      return NextResponse.json(
        { error: 'isVisible boolean is required.' },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(customerComments)
      .set({ isVisible })
      .where(eq(customerComments.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
    }
    return NextResponse.json({ comment: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update comment.' },
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
      return NextResponse.json({ error: 'Invalid comment ID.' }, { status: 400 });
    }

    const deleted = await db
      .delete(customerComments)
      .where(eq(customerComments.id, id))
      .returning({ id: customerComments.id });

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete comment.' },
      { status: 500 }
    );
  }
}
