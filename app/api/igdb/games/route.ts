import { NextRequest, NextResponse } from 'next/server';
import { igdbService } from '@/lib/igdb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const genre = searchParams.get('genre');
    const platform = searchParams.get('platform');
    const sortBy = searchParams.get('sort') || 'rating';
    const order = searchParams.get('order') || 'desc';

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    let games = [];
    let totalCount = 0;

    if (query.trim()) {
      // Search games using IGDB search - only main games, no DLCs, expansions, or seasons
      let searchQuery = `
        fields name,slug,summary,storyline,rating,rating_count,first_release_date,cover.url,genres.name,platforms.name,platforms.id;
        where version_parent = null & category = 0 & name ~ *"${query}"*;
        limit ${limit};
        offset ${offset};
      `;
      
      // Add genre filter to search
      if (genre && genre !== 'All') {
        searchQuery = searchQuery.replace('name ~ *"${query}"*;', `name ~ *"${query}"* & genres.name = "${genre}";`);
      }
      
      // Add platform filter to search
      if (platform && platform !== 'All') {
        searchQuery = searchQuery.replace('name ~ *"${query}"*;', `name ~ *"${query}"* & platforms.name = "${platform}";`);
      }
      
      games = await igdbService.makeCustomRequest('games', searchQuery);
      
      // For search, estimate total count based on results
      if (games.length === limit) {
        totalCount = page * limit + 50; // Estimate more results
      } else {
        totalCount = (page - 1) * limit + games.length;
      }
    } else {
      // Get games with filters - only main games, no DLCs, expansions, or seasons
      let igdbQuery = `
        fields name,slug,summary,storyline,rating,rating_count,first_release_date,cover.url,genres.name,platforms.name,platforms.id;
        where version_parent = null & category = 0;
        limit ${limit};
        offset ${offset};
      `;

      // Add genre filter
      if (genre && genre !== 'All') {
        igdbQuery = igdbQuery.replace('where version_parent = null & category = 0;', `where version_parent = null & category = 0 & genres.name = "${genre}";`);
      }

      // Add platform filter
      if (platform && platform !== 'All') {
        igdbQuery = igdbQuery.replace('where version_parent = null & category = 0;', `where version_parent = null & category = 0 & platforms.name = "${platform}";`);
      }

      // Add sorting
      if (sortBy === 'rating') {
        igdbQuery = igdbQuery.replace('offset', `sort rating ${order};\n        offset`);
      } else if (sortBy === 'name') {
        igdbQuery = igdbQuery.replace('offset', `sort name ${order};\n        offset`);
      } else if (sortBy === 'release_date') {
        igdbQuery = igdbQuery.replace('offset', `sort first_release_date ${order};\n        offset`);
      }

      // Make the request
      games = await igdbService.makeCustomRequest('games', igdbQuery);
      
      // For filtered results, estimate total count based on current results
      if (games.length === limit) {
        totalCount = page * limit + 100; // Estimate more results
      } else {
        totalCount = (page - 1) * limit + games.length;
      }
    }

    // Transform IGDB data to our format
    const transformedGames = games.map(game => ({
      id: game.id.toString(),
      name: game.name,
      slug: game.slug,
      description: game.summary || game.storyline,
      image: game.cover?.url ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/').pop()}` : null,
      genre: game.genres?.[0]?.name || null,
      platform: game.platforms?.[0]?.name || null,
      platforms: game.platforms || [], // Include all platforms
      rating: game.rating || null,
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000) : null,
      igdbRating: game.rating || null,
      igdbRatingCount: game.rating_count || null,
      igdbCoverUrl: game.cover?.url ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.url.split('/').pop()}` : null
    }));

    // Calculate pagination with estimated total count
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages && games.length === limit;
    const hasPrev = page > 1;

    // Ensure we have at least 1 page if we have games
    const finalTotalPages = Math.max(1, totalPages);
    const finalHasNext = hasNext || (games.length === limit && page < finalTotalPages);

    // Add debug information
    console.log(`Pagination Debug: page=${page}, limit=${limit}, total=${totalCount}, totalPages=${finalTotalPages}, hasNext=${finalHasNext}, hasPrev=${hasPrev}, gamesCount=${games.length}`);

    return NextResponse.json({
      games: transformedGames,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: finalTotalPages,
        hasNext: finalHasNext,
        hasPrev,
        nextPage: finalHasNext ? page + 1 : null,
        prevPage: hasPrev ? page - 1 : null
      }
    });

  } catch (error: any) {
    console.error('Error fetching games from IGDB:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch games from IGDB',
        games: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
          nextPage: null,
          prevPage: null
        }
      },
      { status: 500 }
    );
  }
} 