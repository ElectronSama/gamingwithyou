import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const game = searchParams.get('game') || '';
    const language = searchParams.get('language') || '';
    const tag = searchParams.get('tag') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Build where conditions for filtering
    const whereConditions: any = {
      // Exclude admin users from public gamers list
      isAdmin: false,
    };

    // Add search query conditions
    if (query) {
      whereConditions.OR = [
        { username: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
      ];
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

    // Helper function to calculate user rating
    const calculateUserRating = async (userId: string) => {
      const reviews = await prisma.review.findMany({
        where: { reviewedId: userId },
        select: { rating: true }
      });
      
      if (reviews.length === 0) return 0;
      const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
      return Math.round((totalRating / reviews.length) * 10) / 10;
    };

    // Transform users to gamer format and apply additional filters
    const gamers = await Promise.all(users.map(async user => {
      // Calculate average rating from reviews
      const rating = await calculateUserRating(user.id);
        
        // Calculate average hourly rate from availability
        const avgHourlyRate = user.userAvailability.length > 0 
          ? user.userAvailability.reduce((sum, avail) => sum + avail.price, 0) / user.userAvailability.length
          : 0;

        // Format availability
        const availability = user.userAvailability.length > 0 
          ? `${user.userAvailability.length} time slots available`
          : 'No availability set';

        return {
          id: user.id,
          username: user.username,
          avatar: user.avatar || '/avatars/default.jpg',
          bio: user.bio || 'No bio available',
          games: user.userGames.map(ug => ug.game.name),
          languages: user.userLanguages.map(ul => ul.language),
          rating: rating,
          hourlyRate: Math.round(avgHourlyRate),
          availability: availability,
          tags: user.userTags
            .filter(ut => !ut.tag.startsWith('category:'))
            .map(ut => ut.tag),
          createdAt: user.createdAt.toISOString()
        };
      }));

    // Apply additional filters
    const filteredGamers = gamers.filter(gamer => {
      if (game && game !== 'All' && !gamer.games.includes(game)) {
        return false;
      }
      if (language && language !== 'All' && !gamer.languages.includes(language)) {
        return false;
      }
      if (tag && tag !== 'All' && !gamer.tags.includes(tag)) {
        return false;
      }
      return true;
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      gamers: filteredGamers,
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