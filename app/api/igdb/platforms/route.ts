import { NextRequest, NextResponse } from 'next/server';
import { igdbService } from '@/lib/igdb';

export async function GET(request: NextRequest) {
  try {
    if (!igdbService.isConfigured()) {
      return NextResponse.json(
        { error: 'IGDB service not configured' },
        { status: 500 }
      );
    }

    const platforms = await igdbService.getPlatforms();
    
    return NextResponse.json({ platforms });

  } catch (error: any) {
    console.error('Error fetching platforms:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch platforms' },
      { status: 500 }
    );
  }
} 