import { NextRequest, NextResponse } from 'next/server';
import { igdbService } from '@/lib/igdb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ games: [] });
    }

    if (!igdbService.isConfigured()) {
      return NextResponse.json(
        { error: 'IGDB service not configured' },
        { status: 500 }
      );
    }

    const games = await igdbService.searchGames(query, limit);
    
    return NextResponse.json({ games });

  } catch (error: any) {
    console.error('Error searching games:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search games' },
      { status: 500 }
    );
  }
} 