import { NextRequest, NextResponse } from 'next/server';
import { gameSyncService } from '@/lib/gameSync';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { genreId, limit = 20 } = body;

    if (!genreId) {
      return NextResponse.json(
        { error: 'Genre ID is required' },
        { status: 400 }
      );
    }

    const result = await gameSyncService.syncGamesByGenre(genreId, limit);
    
    return NextResponse.json({ 
      message: `Successfully synced ${result.totalSynced} games for genre ID ${genreId}`,
      ...result
    });
  } catch (error) {
    console.error('Error syncing games by genre:', error);
    return NextResponse.json(
      { error: 'Failed to sync games by genre' },
      { status: 500 }
    );
  }
} 