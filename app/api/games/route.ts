import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // First, let's check if there are any games at all
    const totalGames = await prisma.game.count();
    console.log(`Total games in database: ${totalGames}`);

    if (totalGames === 0) {
      console.log('No games found in database, returning empty array');
      return NextResponse.json({ 
        games: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: 'No games found in database. Try syncing some games from IGDB first.'
      });
    }

    // Get games with better error handling and pagination
    const games = await prisma.game.findMany({
      where: {
        // Remove isActive filter for now to see all games
        // isActive: true
      },
      orderBy: [
        { igdbRating: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        genre: true,
        platform: true,
        rating: true,
        releaseDate: true,
        isActive: true,
        igdbId: true,
        igdbSlug: true,
        igdbRating: true,
        igdbRatingCount: true,
        igdbCoverUrl: true,
        igdbScreenshots: true,
        igdbVideos: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log(`Retrieved ${games.length} games from database (page ${page}, limit ${limit})`);

    const totalPages = Math.ceil(totalGames / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({ 
      games,
      pagination: {
        page,
        limit,
        total: totalGames,
        totalPages,
        hasNext,
        hasPrev,
        nextPage: hasNext ? page + 1 : null,
        prevPage: hasPrev ? page - 1 : null
      },
      message: `Successfully retrieved ${games.length} games (page ${page} of ${totalPages})`
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch games',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 