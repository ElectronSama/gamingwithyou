import { NextRequest, NextResponse } from 'next/server';
import { gameSyncService } from '@/lib/gameSync';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      syncType = 'popular', // 'popular', 'search', 'genre', 'platform'
      query = '', 
      limit = 50,
      genreId = null,
      platformId = null
    } = body;

    console.log(`Starting IGDB sync: ${syncType} with limit ${limit}`);

    let result;

    switch (syncType) {
      case 'popular':
        result = await gameSyncService.syncPopularGames(limit);
        break;
      
      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'Search query is required for search sync' },
            { status: 400 }
          );
        }
        result = await gameSyncService.searchAndSyncGames(query, limit);
        break;
      
      case 'genre':
        if (!genreId) {
          return NextResponse.json(
            { error: 'Genre ID is required for genre sync' },
            { status: 400 }
          );
        }
        result = await gameSyncService.syncGamesByGenre(genreId, limit);
        break;
      
      case 'platform':
        if (!platformId) {
          return NextResponse.json(
            { error: 'Platform ID is required for platform sync' },
            { status: 400 }
          );
        }
        result = await gameSyncService.syncGamesByPlatform(platformId, limit);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid sync type. Use: popular, search, genre, or platform' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `Successfully synced ${result.totalSynced} games from IGDB`,
      syncType,
      ...result
    });

  } catch (error) {
    console.error('Error syncing games from IGDB:', error);
    
    // Check if it's an IGDB configuration error
    if (error instanceof Error && error.message.includes('IGDB is not configured')) {
      return NextResponse.json(
        { 
          error: 'IGDB is not configured. Please set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in your .env.local file.',
          details: 'To use IGDB API, you need to: 1) Register at https://api.igdb.com/ 2) Get your Client ID and Client Secret 3) Add them to .env.local file'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to sync games from IGDB',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 