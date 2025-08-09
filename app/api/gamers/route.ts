import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const game = searchParams.get('game') || '';
    const language = searchParams.get('language') || '';
    const tag = searchParams.get('tag') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Build where conditions for filtering
    const whereConditions: any = {
      // Exclude admin users from public gamers list
      isAdmin: false,
    };

    // Add status filter
    if (status && status !== 'All') {
      if (status === 'active') {
        whereConditions.isActive = true;
      } else if (status === 'inactive') {
        whereConditions.isActive = false;
      }
    }

    // Add search query conditions
    if (query) {
      whereConditions.OR = [
        { username: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (game && game !== 'All') {
      whereConditions.userGames = {
        some: {
          game: {
            name: game,
          },
        },
      };
    }

    if (language && language !== 'All') {
      whereConditions.userLanguages = {
        some: {
          language: language,
        },
      };
    }

    if (tag && tag !== 'All') {
      whereConditions.userTags = {
        some: {
          tag: tag,
        },
      };
    }

    // Get users with their related data
    const users = await prisma.user.findMany({
      where: whereConditions,
      include: {
        userGames: {
          include: {
            game: true
          }
        },
        userLanguages: true,
        userTags: true,
        userAvailability: {
          where: {
            isActive: true
          }
        }
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get total count for pagination
    const totalCount = await prisma.user.count({
      where: whereConditions
    });

    // Get all ratings and calculate averages
    const averageRatings = await prisma.review.groupBy({
      by: ['reviewedId'],
      _avg: {
        rating: true,
      },
      where: {
        reviewedId: {
          in: users.map(u => u.id),
        },
      },
    });

    const ratingsMap = new Map<string, number>();
    averageRatings.forEach(r => {
      if (r._avg.rating !== null) {
        ratingsMap.set(r.reviewedId, Math.round(r._avg.rating * 10) / 10);
      }
    });

    // Transform users to gamer format
    const gamers = users.map(user => {
      const rating = ratingsMap.get(user.id) || 0;
      
      const avgHourlyRate = user.userAvailability.length > 0
        ? user.userAvailability.reduce((sum, avail) => sum + avail.price, 0) / user.userAvailability.length
        : 0;

      const availability = user.userAvailability.length > 0
        ? `${user.userAvailability.length} time slots available`
        : 'No availability set';

      return {
        id: user.id,
        username: user.username,
        avatar: user.avatar || null,
        bio: user.bio || 'No bio available',
        games: user.userGames.map(ug => ug.game.name),
        languages: user.userLanguages.map(ul => ul.language),
        rating: rating,
        hourlyRate: Math.round(avgHourlyRate),
        availability: availability,
        tags: user.userTags
          .filter(ut => !ut.tag.startsWith('category:'))
          .map(ut => ut.tag),
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString()
      };
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      gamers: gamers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext,
        hasPrev,
        nextPage: hasNext ? page + 1 : null,
        prevPage: hasPrev ? page - 1 : null
      }
    });

  } catch (error) {
    console.error('Error fetching gamers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gamers' },
      { status: 500 }
    );
  }
}
