import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        userGames: {
          include: {
            game: true
          }
        },
        userLanguages: true,
        userTags: true,
        userAvailability: {
          where: {
            isActive: true
          }
        },
        fixedServices: {
          where: {
            isActive: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Don't expose sensitive information like email for public profiles
    const publicProfile = {
      id: user.id,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      userGames: user.userGames,
      userLanguages: user.userLanguages,
      userTags: user.userTags,
      userAvailability: user.userAvailability,
      fixedServices: user.fixedServices
    };

    return NextResponse.json({ profile: publicProfile });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
} 