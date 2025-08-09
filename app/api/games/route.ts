export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const ordering = searchParams.get('ordering') || 'trending';
    const searchQuery = searchParams.get('search');

    const offset = (page - 1) * limit;

    let orderBy: any[] = [];
    let where: any = {
      // We can add global filters here if needed in the future
      // For example: isActive: true
    };

    // Handle search query
    if (searchQuery) {
      where.name = {
        contains: searchQuery,
        mode: 'insensitive',
      };
    }

    // Handle ordering
    switch (ordering) {
      case 'news':
        orderBy.push({ releaseDate: 'desc' });
        break;
      case 'old':
        orderBy.push({ releaseDate: 'asc' });
        break;
      case 'a-z':
        orderBy.push({ name: 'asc' });
        break;
      case 'z-a':
        orderBy.push({ name: 'desc' });
        break;
      case 'trending':
        // Trending: most popular (by rating count) games from the last 2 years
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        where.releaseDate = {
          gte: twoYearsAgo.toISOString(),
        };
        orderBy.push({ igdbRatingCount: 'desc' });
        orderBy.push({ igdbRating: 'desc' });
        break;
      default:
        // Default sort (can be the same as trending or something else)
        orderBy.push({ igdbRating: 'desc' });
        orderBy.push({ igdbRatingCount: 'desc' });
        break;
    }

    const totalGames = await prisma.game.count({ where });

    if (totalGames === 0) {
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
        message: 'No games found matching your criteria.'
      });
    }

    const games = await prisma.game.findMany({
      where,
      orderBy,
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
      message: `Successfully retrieved ${games.length} games.`
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