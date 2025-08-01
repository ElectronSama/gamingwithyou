import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { gameSyncService } from '@/lib/gameSync';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting cleanup of old hardcoded games...');
    
    // Find games that don't have proper IGDB data (igdbId is null)
    const oldGames = await prisma.game.findMany({
      where: {
        OR: [
          { igdbId: null },
          { igdbSlug: null }
        ]
      }
    });

    console.log(`Found ${oldGames.length} old games to clean up`);

    // Delete old games
    const deleteResult = await prisma.game.deleteMany({
      where: {
        OR: [
          { igdbId: null },
          { igdbSlug: null }
        ]
      }
    });

    console.log(`Deleted ${deleteResult.count} old games`);

    // Sync popular games to get fresh data
    const syncResult = await gameSyncService.syncPopularGames(50);

    return NextResponse.json({
      message: `Cleanup completed: deleted ${deleteResult.count} old games, synced ${syncResult.totalSynced} new games`,
      deleted: deleteResult.count,
      synced: syncResult.totalSynced,
      errors: syncResult.totalErrors
    });

  } catch (error) {
    console.error('Error during cleanup:', error);
    return NextResponse.json(
      {
        error: 'Failed to cleanup games',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 