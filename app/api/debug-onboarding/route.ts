import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEBUG ONBOARDING START ===');
    
    // 1. Test session - use getToken for JWT strategy
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    console.log('1. Session test:', {
      hasToken: !!token,
      hasEmail: !!token?.email,
      email: token?.email,
      tokenKeys: token ? Object.keys(token) : []
    });
    
    if (!token?.email) {
      console.log('1. No valid session found');
      return NextResponse.json({ 
        error: 'No session found',
        step: 'session_check',
        details: 'Token missing or invalid'
      }, { status: 401 });
    }
    
    // 2. Test request body parsing
    let body;
    try {
      body = await request.json();
      console.log('2. Request body parsed successfully:', {
        hasBio: !!body.bio,
        hasCategories: !!body.categories,
        hasGames: !!body.games,
        hasLanguages: !!body.languages,
        hasTags: !!body.tags
      });
    } catch (parseError) {
      console.log('2. Request body parsing failed:', parseError);
      return NextResponse.json({ 
        error: 'Failed to parse request body',
        step: 'body_parsing'
      }, { status: 400 });
    }
    
    // 3. Test user lookup
    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });
    console.log('3. User lookup:', {
      found: !!user,
      userId: user?.id,
      username: user?.username
    });
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found',
        step: 'user_lookup'
      }, { status: 404 });
    }
    
    // 4. Test bio update
    if (body.bio) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { bio: body.bio }
        });
        console.log('4. Bio updated successfully');
      } catch (bioError) {
        console.log('4. Bio update failed:', bioError);
        return NextResponse.json({ 
          error: 'Failed to update bio',
          step: 'bio_update',
          details: bioError instanceof Error ? bioError.message : 'Unknown error'
        }, { status: 500 });
      }
    }
    
    // 5. Test games processing
    if (body.games && body.games.length > 0) {
      console.log('5. Processing games:', body.games.length);
      console.log('5. Games data:', body.games);
      for (const gameData of body.games) {
        try {
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
            console.log('5. Created game:', game.name);
          } else {
            // Update existing game with platform if provided
            if (gameData.platform && gameData.platform !== game.platform) {
              await prisma.game.update({
                where: { id: game.id },
                data: { platform: gameData.platform }
              });
              console.log('5. Updated game platform:', gameData.platform);
            }
          }
          
                     // Create user game relationship - simplified approach
           try {
             await prisma.userGame.create({
               data: {
                 userId: user.id,
                 gameId: game.id,
                 level: gameData.level,
                 platform: gameData.platform || null
               }
             });
             console.log('5. User game relationship created successfully');
           } catch (createError: any) {
             // If unique constraint violation, try to update instead
             if (createError.code === 'P2002') {
               console.log('5. User game already exists, updating...');
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
               console.log('5. User game relationship updated successfully');
             } else {
               throw createError;
             }
           }
        } catch (gameError) {
          console.log('5. Game processing failed:', gameError);
          return NextResponse.json({ 
            error: 'Failed to process games',
            step: 'games_processing',
            details: gameError instanceof Error ? gameError.message : 'Unknown error'
          }, { status: 500 });
        }
      }
    }
    
         // 6. Test languages processing
     if (body.languages && body.languages.length > 0) {
       console.log('6. Processing languages:', body.languages.length);
       
       // First, remove all existing user languages
       await prisma.userLanguage.deleteMany({
         where: { userId: user.id }
       });
       
       // Then add the new languages
       for (const langData of body.languages) {
         if (langData.language && langData.level) {
           try {
             await prisma.userLanguage.create({
               data: {
                 userId: user.id,
                 language: langData.language,
                 level: langData.level
               }
             });
             console.log('6. Language processed:', langData.language);
           } catch (langError) {
             console.log('6. Language processing failed:', langError);
             return NextResponse.json({ 
               error: 'Failed to process languages',
               step: 'languages_processing',
               details: langError instanceof Error ? langError.message : 'Unknown error'
             }, { status: 500 });
           }
         }
       }
     }
    
         // 7. Test tags processing
     if (body.tags && body.tags.length > 0) {
       console.log('7. Processing tags:', body.tags.length);
       
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
       for (const tag of body.tags) {
         if (tag) {
           try {
             await prisma.userTag.create({
               data: {
                 userId: user.id,
                 tag: tag
               }
             });
             console.log('7. Tag processed:', tag);
           } catch (tagError) {
             console.log('7. Tag processing failed:', tagError);
             return NextResponse.json({ 
               error: 'Failed to process tags',
               step: 'tags_processing',
               details: tagError instanceof Error ? tagError.message : 'Unknown error'
             }, { status: 500 });
           }
         }
       }
     }
     
     // 8. Test categories processing
     if (body.categories && body.categories.length > 0) {
       console.log('8. Processing categories:', body.categories.length);
       
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
       for (const category of body.categories) {
         try {
           await prisma.userTag.create({
             data: {
               userId: user.id,
               tag: `category:${category}`
             }
           });
           console.log('8. Category processed:', category);
         } catch (catError) {
           console.log('8. Category processing failed:', catError);
           return NextResponse.json({ 
             error: 'Failed to process categories',
             step: 'categories_processing',
             details: catError instanceof Error ? catError.message : 'Unknown error'
           }, { status: 500 });
         }
       }
     }
    
    console.log('=== DEBUG ONBOARDING SUCCESS ===');
    
    return NextResponse.json({ 
      success: true,
      message: 'Onboarding completed successfully',
      debug: {
        userId: user.id,
        bioUpdated: !!body.bio,
        gamesProcessed: body.games?.length || 0,
        languagesProcessed: body.languages?.length || 0,
        tagsProcessed: body.tags?.length || 0,
        categoriesProcessed: body.categories?.length || 0
      }
    });
    
  } catch (error) {
    console.log('=== DEBUG ONBOARDING ERROR ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Debug onboarding failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        step: 'general_error'
      },
      { status: 500 }
    );
  }
} 