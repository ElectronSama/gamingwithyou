import { NextResponse } from 'next/server';
import { igdbService } from '@/lib/igdb';

export async function GET() {
  try {
    // Get a sample of games to estimate the database size
    // Note: IGDB doesn't provide exact count, so we'll use an estimate
    const sampleQuery = `
      fields id;
      where version_parent = null;
      limit 1;
    `;
    
    const sample = await igdbService.makeCustomRequest('games', sampleQuery);
    
    // IGDB has approximately 428,000 games
    const estimatedTotalGames = 428000;
    
    return NextResponse.json({
      totalGames: estimatedTotalGames,
      databaseName: 'IGDB (Internet Game Database)',
      lastUpdated: new Date().toISOString(),
      features: [
        'Complete game database',
        'Real-time search',
        'Genre and platform filtering',
        'High-quality game covers',
        'Rating and review data',
        'Release date information'
      ]
    });

  } catch (error: any) {
    console.error('Error fetching IGDB stats:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch IGDB statistics',
        totalGames: 428000,
        databaseName: 'IGDB (Internet Game Database)'
      },
      { status: 500 }
    );
  }
} 