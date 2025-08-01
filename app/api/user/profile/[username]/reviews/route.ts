import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch reviews for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Get the user being reviewed
    const reviewedUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });

    if (!reviewedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all reviews for this user
    const reviews = await prisma.review.findMany({
      where: { reviewedId: reviewedUser.id },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return NextResponse.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const username = params.username;
    const { rating, comment } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Get the user being reviewed
    const reviewedUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true }
    });

    if (!reviewedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent self-review
    if (session.user.id === reviewedUser.id) {
      return NextResponse.json({ error: 'Cannot review yourself' }, { status: 400 });
    }

    // Check if user already reviewed this person
    const existingReview = await prisma.review.findUnique({
      where: {
        reviewerId_reviewedId: {
          reviewerId: session.user.id,
          reviewedId: reviewedUser.id
        }
      }
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this user' }, { status: 400 });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        reviewerId: session.user.id,
        reviewedId: reviewedUser.id,
        rating,
        comment: comment?.trim() || null
      },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    return NextResponse.json({ 
      review,
      message: 'Review submitted successfully' 
    });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
} 