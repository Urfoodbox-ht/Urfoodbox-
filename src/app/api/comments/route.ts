import { NextResponse } from 'next/server';
import { createCustomerComment, getStorefrontData } from '../../../db/queries.ts';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getStorefrontData();
    return NextResponse.json({ comments: data.comments });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to load comments.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { authorName, rating = 5, commentText } = body || {};

    if (
      typeof authorName !== 'string' ||
      authorName.trim().length < 2 ||
      authorName.trim().length > 80
    ) {
      return NextResponse.json(
        { error: 'Please enter your name (2–80 characters).' },
        { status: 400 }
      );
    }
    if (
      typeof commentText !== 'string' ||
      commentText.trim().length < 3 ||
      commentText.trim().length > 600
    ) {
      return NextResponse.json(
        { error: 'Please enter a comment (3–600 characters).' },
        { status: 400 }
      );
    }
    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5.' },
        { status: 400 }
      );
    }

    const created = await createCustomerComment({
      authorName,
      rating: parsedRating,
      commentText,
    });
    return NextResponse.json({ comment: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit comment.' },
      { status: 500 }
    );
  }
}
