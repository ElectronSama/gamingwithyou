import { NextRequest, NextResponse } from 'next/server';
import { gameSyncService } from '@/lib/gameSync';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platformId, limit = 20 } = body;

    if (!platformId) {
      return NextResponse.json(
        { error: 'Platform ID is required' },
        { status: 400 }
      );
    }

    const result = await gameSyncService.syncGamesByPlatform(platformId, limit);
    
    return NextResponse.json({ 
      message: `Successfully synced ${result.totalSynced} games for platform ID ${platformId}`,
      ...result
    });
  } catch (error) {
    console.error('Error syncing games by platform:', error);
    return NextResponse.json(
      { error: 'Failed to sync games by platform' },
      { status: 500 }
    );
  }
} 