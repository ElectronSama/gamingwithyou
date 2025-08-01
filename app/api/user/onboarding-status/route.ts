import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has any profile data (bio, games, languages, tags)
    const user = await prisma.user.findUnique({
      where: { email: token.email },
      include: {
        userGames: true,
        userLanguages: true,
        userTags: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Consider onboarding completed if user has bio or any games/languages/tags
    const hasProfileData = user.bio || 
                          user.userGames.length > 0 || 
                          user.userLanguages.length > 0 || 
                          user.userTags.length > 0;

    return NextResponse.json({ 
      completed: hasProfileData,
      hasBio: !!user.bio,
      hasGames: user.userGames.length > 0,
      hasLanguages: user.userLanguages.length > 0,
      hasTags: user.userTags.length > 0
    });

  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to check onboarding status' },
      { status: 500 }
    );
  }
} 