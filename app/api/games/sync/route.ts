import { NextRequest, NextResponse } from 'next/server';
import { gameSyncService } from '@/lib/gameSync';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 10 } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const result = await gameSyncService.searchAndSyncGames(query, limit);
    
    return NextResponse.json({ 
      message: `Successfully synced ${result.totalSynced} games`,
      ...result
    });
  } catch (error) {
    console.error('Error syncing games:', error);
    return NextResponse.json(
      { error: 'Failed to sync games' },
      { status: 500 }
    );
  }
} 