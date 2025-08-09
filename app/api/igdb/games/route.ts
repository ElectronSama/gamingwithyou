import { NextRequest, NextResponse } from 'next/server';
import { igdbService } from '@/lib/igdb';

// This is the most important line. It prevents Next.js from caching the API response.
// This ensures that every request is processed fresh, reflecting the latest sorting options.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const genre = searchParams.get('genre');
    const platform = searchParams.get('platform');
    
    // This is the corrected logic. It reads the 'orderBy' parameter sent by the frontend.
    const orderByParam = searchParams.get('orderBy') || '-rating'; // Default to -rating (Trending)

    // Parse the orderBy parameter into a field and a direction (asc/desc)
    let sortField = orderByParam;
    let sortOrder = 'asc';
    if (orderByParam.startsWith('-')) {
      sortOrder = 'desc';
      sortField = orderByParam.substring(1);
    }

    const offset = (page - 1) * limit;

    // Build the WHERE clause for the IGDB query
    const nowInSeconds = Math.floor(Date.now() / 1000);
    // Corrected logic: Filter for main games that have a release date in the past.
    // This is a more reliable way to define "released" than using the status field, which can be inconsistent.
    // Also, only show games that have a rating.
    let whereClauses = ['version_parent = null', 'category = 0', `first_release_date <= ${nowInSeconds}`, 'rating != null'];
    if (query.trim()) {
      whereClauses.push(`name ~ *\"${query}\"*`);
    }
    if (genre && genre !== 'All') {
      whereClauses.push(`genres.name = \"${genre}\"`);
    }
    if (platform && platform !== 'All') {
      whereClauses.push(`platforms.name = \"${platform}\"`);
    }

    // Build the final IGDB query string
    const igdbQuery = `
      fields name,slug,summary,storyline,rating,rating_count,first_release_date,cover.url,genres.name,platforms.name,platforms.id;
      where ${whereClauses.join(' & ')};
      sort ${sortField} ${sortOrder};
      limit ${limit};
      offset ${offset};
    `;

    const games = await igdbService.makeCustomRequest('games', igdbQuery);

    // For pagination, we need a total count. This is tricky with IGDB's API without a separate count endpoint.
    // We will estimate the total count to provide a functional pagination experience.
    let totalCount = 0;
    if (games.length === limit) {
      totalCount = page * limit + 100; // Estimate more results exist
    } else {
      totalCount = (page - 1) * limit + games.length;
    }

    // Transform IGDB data to our application's format
    const transformedGames = games.map(game => ({
      id: game.id.toString(),
      name: game.name,
      slug: game.slug,
      description: game.summary || game.storyline,
      image: game.cover?.url ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/').pop()}` : null,
      genre: game.genres?.[0]?.name || null,
      platform: game.platforms?.[0]?.name || null,
      platforms: game.platforms || [],
      rating: game.rating || null,
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000) : null,
      igdbRating: game.rating || null,
      igdbRatingCount: game.rating_count || null,
      igdbCoverUrl: game.cover?.url ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/').pop()}` : null
    }));

    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages && games.length === limit;
    const hasPrev = page > 1;

    return NextResponse.json({
      games: transformedGames,
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

  } catch (error: any) {
    console.error('Error fetching games from IGDB:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch games from IGDB',
        games: [],
        pagination: { page: 1, limit: 12, total: 0, totalPages: 0, hasNext: false, hasPrev: false, nextPage: null, prevPage: null }
      },
      { status: 500 }
    );
  }
}