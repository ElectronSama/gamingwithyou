import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    console.log(`Searching for games with query: "${query}" (page ${page}, limit ${limit})`);

    // Get total count for pagination - only search in game names
    const totalCount = await prisma.game.count({
      where: {
        // Remove isActive filter for now
        // isActive: true,
        name: {
          contains: query,
          mode: 'insensitive'
        }
      }
    });

    const games = await prisma.game.findMany({
      where: {
        // Remove isActive filter for now
        // isActive: true,
        name: {
          contains: query,
          mode: 'insensitive'
        }
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

    console.log(`Found ${games.length} games matching query: "${query}" (page ${page})`);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({ 
      games,
      query,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext,
        hasPrev,
        nextPage: hasNext ? page + 1 : null,
        prevPage: hasPrev ? page - 1 : null
      },
      message: `Found ${games.length} games matching "${query}" (page ${page} of ${totalPages})`
    });
  } catch (error) {
    console.error('Error searching games:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search games',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 