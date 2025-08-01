import { NextRequest, NextResponse } from 'next/server';
import { gameSyncService } from '@/lib/gameSync';

export async function GET(request: NextRequest) {
  try {
    const stats = await gameSyncService.getSyncStats();
    
    return NextResponse.json({ 
      stats,
      message: 'Sync statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting sync stats:', error);
    return NextResponse.json(
      { error: 'Failed to get sync statistics' },
      { status: 500 }
    );
  }
} 