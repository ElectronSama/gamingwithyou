import { NextRequest, NextResponse } from 'next/server';
import { igdbService } from '@/lib/igdb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const games = await igdbService.getPopularGames(limit);
    
    return NextResponse.json({ games });
  } catch (error) {
    console.error('Error fetching popular games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular games' },
      { status: 500 }
    );
  }
} 