import { NextRequest, NextResponse } from 'next/server';
import { gameSyncService } from '@/lib/gameSync';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { limit = 20 } = body;

    const result = await gameSyncService.syncPopularGames(limit);
    
    return NextResponse.json({ 
      message: `Successfully synced ${result.totalSynced} popular games`,
      ...result
    });
  } catch (error) {
    console.error('Error syncing popular games:', error);
    return NextResponse.json(
      { error: 'Failed to sync popular games' },
      { status: 500 }
    );
  }
} 