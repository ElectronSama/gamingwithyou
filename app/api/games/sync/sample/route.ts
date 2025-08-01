import { NextRequest, NextResponse } from 'next/server';
import { gameSyncService } from '@/lib/gameSync';

export async function POST(request: NextRequest) {
  try {
    console.log('Syncing sample games for testing...');
    
    // Sync some popular games for testing
    const popularResult = await gameSyncService.syncPopularGames(10);
    
    // Also sync some specific games
    const searchResult = await gameSyncService.searchAndSyncGames('cyberpunk', 5);
    
    const totalSynced = popularResult.totalSynced + searchResult.totalSynced;
    const totalErrors = popularResult.totalErrors + searchResult.totalErrors;
    
    console.log(`Sample sync completed: ${totalSynced} games synced, ${totalErrors} errors`);
    
    return NextResponse.json({ 
      message: `Successfully synced ${totalSynced} sample games`,
      popular: popularResult,
      search: searchResult,
      totalSynced,
      totalErrors
    });
  } catch (error) {
    console.error('Error syncing sample games:', error);
    return NextResponse.json(
      { error: 'Failed to sync sample games' },
      { status: 500 }
    );
  }
} 