import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('=== PROFILE DATA GET REQUEST ===');
    
    const session = await getServerSession(authOptions);
    
    console.log('Session:', session ? 'exists' : 'missing');
    console.log('Session user:', session?.user);
    
    if (!session?.user?.email) {
      console.log('No session user email, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Looking for user with email:', session.user.email);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        userGames: {
          include: {
            game: true
          }
        },
        userLanguages: true,
        userTags: true,
      }
    });

    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      console.log('User not found, returning 404');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profileData = {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt.toISOString(),
      userGames: user.userGames,
      userLanguages: user.userLanguages,
      userTags: user.userTags,
    };

    console.log('Returning profile data:', {
      hasBio: !!profileData.bio,
      hasAvatar: !!profileData.avatar,
      gamesCount: profileData.userGames?.length || 0,
      languagesCount: profileData.userLanguages?.length || 0,
      tagsCount: profileData.userTags?.length || 0
    });

    return NextResponse.json({ 
      profile: profileData
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('=== PROFILE DATA UPDATE START ===');
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bio, categories, games, languages, tags } = body;
    
    console.log('Received data:', {
      hasBio: !!bio,
      hasCategories: !!categories,
      hasGames: !!games,
      gamesCount: games?.length || 0,
      hasLanguages: !!languages,
      hasTags: !!tags
    });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update bio if provided
    if (bio !== undefined) {
      await prisma.user.update({
        where: { id: user.id },
        data: { bio }
      });
    }

    // Update games if provided
    if (games && Array.isArray(games)) {
      console.log('Processing games:', games);
      
      // Get current game combinations from the request
      const currentGameCombinations = games.map(g => ({
        gameId: g.gameId,
        platform: g.platform || null,
        level: g.level
      })).filter(g => g.gameId && g.level);
      console.log('Current game combinations:', currentGameCombinations);
      
      // Remove all existing user games for this user
      await prisma.userGame.deleteMany({
        where: { userId: user.id }
      });

      // Process each game (create or update)
      for (const gameData of games) {
        if (gameData.gameId && gameData.level) {
          // Check if game exists
          let game = await prisma.game.findFirst({
            where: { 
              OR: [
                { igdbId: parseInt(gameData.gameId) },
                { id: gameData.gameId }
              ]
            }
          });
          
          // Create game if doesn't exist
          if (!game) {
            console.log('Creating new game:', gameData.name);
            game = await prisma.game.create({
              data: {
                name: gameData.name || `Game ${gameData.gameId}`,
                igdbId: parseInt(gameData.gameId),
                slug: gameData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `game-${gameData.gameId}`
              }
            });
          }

          // Create user game entry
          await prisma.userGame.create({
            data: {
              userId: user.id,
              gameId: game.id,
              level: gameData.level,
              platform: gameData.platform || null
            }
          });
        }
      }
    }

    // Update languages if provided
    if (languages && Array.isArray(languages)) {
      console.log('Processing languages:', languages);
      
      // Remove all existing user languages for this user
      await prisma.userLanguage.deleteMany({
        where: { userId: user.id }
      });

      // Add new languages
      for (const langData of languages) {
        if (langData.language && langData.level) {
          await prisma.userLanguage.create({
            data: {
              userId: user.id,
              language: langData.language,
              level: langData.level
            }
          });
        }
      }
    }

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      console.log('Processing tags:', tags);
      
      // Remove all existing user tags for this user
      await prisma.userTag.deleteMany({
        where: { userId: user.id }
      });

      // Add category tags
      if (categories && Array.isArray(categories)) {
        for (const category of categories) {
          await prisma.userTag.create({
            data: {
              userId: user.id,
              tag: `category:${category}`
            }
          });
        }
      }

      // Add regular tags
      for (const tag of tags) {
        if (tag && typeof tag === 'string') {
          await prisma.userTag.create({
            data: {
              userId: user.id,
              tag: tag
            }
          });
        }
      }
    }

    console.log('Profile updated successfully');
    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully' 
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 