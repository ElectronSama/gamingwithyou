import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (!token?.email) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        details: 'No valid session found'
      }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found',
        details: 'User not found in database'
      }, { status: 404 });
    }
    
    // Update user bio and avatar
    if (body.bio || body.profilePictureUrl) {
      const updateData: any = {};
      if (body.bio) updateData.bio = body.bio;
      if (body.profilePictureUrl) updateData.avatar = body.profilePictureUrl;
      
      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });
    }
    
    // Process games
    if (body.games && body.games.length > 0) {
      for (const gameData of body.games) {
        // Find or create game
        let game = await prisma.game.findFirst({
          where: { 
            OR: [
              { igdbId: parseInt(gameData.gameId) },
              { id: gameData.gameId }
            ]
          }
        });
        
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
        try {
          await prisma.userGame.create({
            data: {
              userId: user.id,
              gameId: game.id,
              level: gameData.level,
              platform: gameData.platform || null
            }
          });
        } catch (error: any) {
          // If already exists, update it
          if (error.code === 'P2002') {
            await prisma.userGame.updateMany({
              where: {
                userId: user.id,
                gameId: game.id,
                platform: gameData.platform || null,
                level: gameData.level
              },
              data: {
                level: gameData.level,
                platform: gameData.platform || null
              }
            });
          } else {
            throw error;
          }
        }
      }
    }
    
    // Process languages
    if (body.languages && body.languages.length > 0) {
      // Remove existing languages
      await prisma.userLanguage.deleteMany({
        where: { userId: user.id }
      });
      
      // Add new languages
      for (const langData of body.languages) {
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
    
    // Process tags
    if (body.tags && body.tags.length > 0) {
      // Remove existing non-category tags
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
      
      // Add new tags
      for (const tag of body.tags) {
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
    
    // Process categories
    if (body.categories && body.categories.length > 0) {
      // Remove existing category tags
      await prisma.userTag.deleteMany({
        where: { 
          userId: user.id,
          tag: {
            startsWith: 'category:'
          }
        }
      });
      
      // Add new categories
      for (const category of body.categories) {
        await prisma.userTag.create({
          data: {
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
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { 
        error: 'Onboarding failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 