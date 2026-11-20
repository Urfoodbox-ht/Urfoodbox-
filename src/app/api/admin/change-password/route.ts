import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '../../../../db/index.ts';
import { administratorAccounts } from '../../../../db/schema.ts';
import { getAuthenticatedAdmin } from '../../../../lib/auth.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    const { currentPassword, newPassword } = body || {};

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const [admin] = await db
      .select()
      .from(administratorAccounts)
      .where(eq(administratorAccounts.id, adminUser.id))
      .limit(1);

    if (!admin) {
      return NextResponse.json({ error: 'Administrator not found.' }, { status: 404 });
    }

    if (typeof currentPassword === 'string' && currentPassword.length > 0) {
      const matches = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!matches) {
        return NextResponse.json(
          { error: 'Current password is incorrect.' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Current password is required.' },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db
      .update(administratorAccounts)
      .set({ passwordHash: newHash })
      .where(eq(administratorAccounts.id, admin.id));

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update password.' },
      { status: 500 }
    );
  }
}
