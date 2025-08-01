import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get token using the request cookies
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    console.log('Token data:', token);
    console.log('Token email:', token?.email);
    
    if (!token?.email) {
      console.log('No token or email found');
      return NextResponse.json({ 
        error: 'Unauthorized', 
        details: 'No valid session found. Please log in again.',
        debug: {
          hasToken: !!token,
          hasEmail: !!token?.email
        }
      }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
      console.log('Request body received:', body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          details: 'Failed to parse request data'
        },
        { status: 400 }
      );
    }
    
    const { bio, categories, games, languages, tags } = body;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user bio
    if (bio) {
      await prisma.user.update({
        where: { id: user.id },
        data: { bio }
      });
    }

    // Add games - create placeholder games with names
    if (games && games.length > 0) {
      console.log('Games data received:', games);
      
      for (const gameData of games) {
        try {
          // Check if game already exists
          let game = await prisma.game.findFirst({
            where: { 
              OR: [
                { igdbId: parseInt(gameData.gameId) },
                { id: gameData.gameId }
              ]
            }
          });

          // If game doesn't exist, create it with a placeholder name
          if (!game) {
            game = await prisma.game.create({
              data: {
                name: gameData.name || `Game ${gameData.gameId}`, // Use provided name or placeholder
                slug: `game-${gameData.gameId}`,
                igdbId: parseInt(gameData.gameId),
                platform: gameData.platform || null, // Save platform information
                isActive: true
              }
            });
          }

          // Create or update user game relationship
          await prisma.userGame.upsert({
            where: {
              userId_gameId: {
                userId: user.id,
                gameId: game.id
              }
            },
            update: {
              level: gameData.level
            },
            create: {
              userId: user.id,
              gameId: game.id,
              level: gameData.level
            }
          });
        } catch (gameError) {
          console.error('Error processing game:', gameData, gameError);
          // Continue with other games even if one fails
        }
      }
    }

    // Add languages
    if (languages && languages.length > 0) {
      for (const langData of languages) {
        if (langData.language && langData.level) {
          await prisma.userLanguage.upsert({
            where: {
              userId_language: {
                userId: user.id,
                language: langData.language
              }
            },
            update: {
              level: langData.level
            },
            create: {
              userId: user.id,
              language: langData.language,
              level: langData.level
            }
          });
        }
      }
    }

    // Add tags
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        if (tag) {
          await prisma.userTag.upsert({
            where: {
              userId_tag: {
                userId: user.id,
                tag: tag
              }
            },
            update: {},
            create: {
              userId: user.id,
              tag: tag
            }
          });
        }
      }
    }

    // Store categories as tags (since we don't have a separate categories table)
    if (categories && categories.length > 0) {
      for (const category of categories) {
        await prisma.userTag.upsert({
          where: {
            userId_tag: {
              userId: user.id,
              tag: `category:${category}`
            }
          },
          update: {},
          create: {
            userId: user.id,
            tag: `category:${category}`
          }
        });
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Onboarding completed successfully'
    });

  } catch (error) {
    console.error('Error saving onboarding data:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to save onboarding data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 