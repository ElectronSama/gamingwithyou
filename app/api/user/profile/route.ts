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

    const user = await prisma.user.findUnique({
      where: { email: token.email },
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
        userGames: user.userGames,
        userLanguages: user.userLanguages,
        userTags: user.userTags,
      }
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
    console.log('=== PROFILE UPDATE START ===');
    
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (!token?.email) {
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
      where: { email: token.email }
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
            game = await prisma.game.create({
              data: {
                name: gameData.name || `Game ${gameData.gameId}`,
                slug: `game-${gameData.gameId}`,
                igdbId: parseInt(gameData.gameId),
                platform: gameData.platform || null,
                isActive: true
              }
            });
          }
          
          // Create or update user game relationship
          // First, try to delete any existing record with the same game/platform/level
          await prisma.userGame.deleteMany({
            where: {
              userId: user.id,
              gameId: game.id,
              platform: gameData.platform || null,
              level: gameData.level
            }
          });
          
          // Then create the new record
          const userGame = await prisma.userGame.create({
            data: {
              userId: user.id,
              gameId: game.id,
              level: gameData.level,
              platform: gameData.platform || null
            }
          });
          console.log('UserGame created:', userGame);
        }
      }
    }

    // Update languages if provided
    if (languages && Array.isArray(languages)) {
      // First, remove all existing user languages
      await prisma.userLanguage.deleteMany({
        where: { userId: user.id }
      });

      // Then add the new languages
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

         // Update tags if provided (but preserve category tags)
     if (tags && Array.isArray(tags)) {
       // First, remove all existing non-category user tags
       await prisma.userTag.deleteMany({
         where: { 
           userId: user.id,
           tag: {
             not: {
               startsWith: 'category:'
             }
           }
         }
       });

       // Then add the new tags
       for (const tag of tags) {
         if (tag) {
           await prisma.userTag.create({
             data: {
               userId: user.id,
               tag: tag
             }
           });
         }
       }
     }

         // Update categories if provided
     if (categories && Array.isArray(categories)) {
       // First, remove all existing category tags
       await prisma.userTag.deleteMany({
         where: { 
           userId: user.id,
           tag: {
             startsWith: 'category:'
           }
         }
       });

       // Then add the new categories
       for (const category of categories) {
         if (category) {
           await prisma.userTag.create({
             data: {
               userId: user.id,
               tag: `category:${category}`
             }
           });
         }
       }
     }

    console.log('=== PROFILE UPDATE SUCCESS ===');
    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('=== PROFILE UPDATE ERROR ===');
    console.error('Error updating user profile:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Failed to update user profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 