import { prisma } from './prisma';
import { igdbService, IGDBGame } from './igdb';

export class GameSyncService {
  async syncGameFromIGDB(igdbGame: IGDBGame) {
    try {
      // Validate required fields
      if (!igdbGame.name || !igdbGame.slug) {
        throw new Error(`Invalid game data: missing name or slug for game ID ${igdbGame.id}`);
      }

      // Enhanced description with more details
      let enhancedDescription = igdbGame.summary || igdbGame.storyline || '';
      
      // Add game modes if available
      if (igdbGame.game_modes && igdbGame.game_modes.length > 0) {
        enhancedDescription += `\n\nGame Modes: ${igdbGame.game_modes.map(mode => mode.name).join(', ')}`;
      }
      
      // Add player perspectives if available
      if (igdbGame.player_perspectives && igdbGame.player_perspectives.length > 0) {
        enhancedDescription += `\n\nPerspective: ${igdbGame.player_perspectives.map(p => p.name).join(', ')}`;
      }
      
      // Add age rating if available
      if (igdbGame.age_ratings && igdbGame.age_ratings.length > 0) {
        const ageRating = igdbGame.age_ratings[0];
        enhancedDescription += `\n\nAge Rating: ${ageRating.rating}`;
      }

      const gameData = {
        name: igdbGame.name,
        slug: igdbGame.slug,
        description: enhancedDescription.trim() || null,
        image: igdbGame.cover?.url ? `https:${igdbGame.cover.url.replace('t_thumb', 't_cover_big')}` : null,
        genre: igdbGame.genres?.[0]?.name || null,
        platform: igdbGame.platforms?.[0]?.name || null,
        releaseDate: igdbGame.first_release_date ? new Date(igdbGame.first_release_date * 1000) : null,
        rating: igdbGame.rating ? igdbGame.rating / 10 : null, // IGDB ratings are 0-100, we use 0-10
        igdbId: igdbGame.id,
        igdbSlug: igdbGame.slug,
        igdbRating: igdbGame.rating ? igdbGame.rating / 10 : null,
        igdbRatingCount: igdbGame.rating_count || null,
        igdbCoverUrl: igdbGame.cover?.url ? `https:${igdbGame.cover.url.replace('t_thumb', 't_cover_big')}` : null,
        igdbScreenshots: igdbGame.screenshots?.map(s => `https:${s.url.replace('t_thumb', 't_screenshot_big')}`) || [],
        igdbVideos: igdbGame.videos?.map(v => v.video_id) || [],
      };

      // Check if game already exists
      const existingGame = await prisma.game.findFirst({
        where: {
          OR: [
            { igdbId: igdbGame.id },
            { igdbSlug: igdbGame.slug },
            { slug: igdbGame.slug }
          ]
        }
      });

      if (existingGame) {
        // Update existing game
        const updatedGame = await prisma.game.update({
          where: { id: existingGame.id },
          data: gameData
        });
        console.log(`Updated game: ${igdbGame.name} (ID: ${existingGame.id})`);
        return updatedGame;
      } else {
        // Create new game
        const newGame = await prisma.game.create({
          data: gameData
        });
        console.log(`Created new game: ${igdbGame.name} (ID: ${newGame.id})`);
        return newGame;
      }
    } catch (error) {
      console.error(`Error syncing game ${igdbGame.name} (ID: ${igdbGame.id}):`, error);
      throw error;
    }
  }

  async searchAndSyncGames(query: string, limit: number = 10) {
    try {
      // Check if IGDB is configured
      if (!igdbService.isConfigured()) {
        throw new Error('IGDB is not configured. Please set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in your .env.local.local file.');
      }

      console.log(`Searching IGDB for: "${query}" (limit: ${limit})`);
      
      const igdbGames = await igdbService.searchGames(query, limit);
      console.log(`Found ${igdbGames.length} games in IGDB`);
      
      const syncedGames = [];
      const errors = [];

      for (const igdbGame of igdbGames) {
        try {
          const syncedGame = await this.syncGameFromIGDB(igdbGame);
          syncedGames.push(syncedGame);
        } catch (error) {
          console.error(`Error syncing game ${igdbGame.name}:`, error);
          errors.push({
            game: igdbGame.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      console.log(`Successfully synced ${syncedGames.length} games, ${errors.length} errors`);

      return {
        syncedGames,
        errors,
        totalFound: igdbGames.length,
        totalSynced: syncedGames.length,
        totalErrors: errors.length
      };
    } catch (error) {
      console.error('Error searching and syncing games:', error);
      throw error;
    }
  }

  async syncPopularGames(limit: number = 20) {
    try {
      // Check if IGDB is configured
      if (!igdbService.isConfigured()) {
        throw new Error('IGDB is not configured. Please set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in your .env.local.local file.');
      }

      console.log(`Syncing ${limit} popular games from IGDB`);
      
      const igdbGames = await igdbService.getPopularGames(limit);
      console.log(`Found ${igdbGames.length} popular games in IGDB`);
      
      const syncedGames = [];
      const errors = [];

      for (const igdbGame of igdbGames) {
        try {
          const syncedGame = await this.syncGameFromIGDB(igdbGame);
          syncedGames.push(syncedGame);
        } catch (error) {
          console.error(`Error syncing popular game ${igdbGame.name}:`, error);
          errors.push({
            game: igdbGame.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      console.log(`Successfully synced ${syncedGames.length} popular games, ${errors.length} errors`);

      return {
        syncedGames,
        errors,
        totalFound: igdbGames.length,
        totalSynced: syncedGames.length,
        totalErrors: errors.length
      };
    } catch (error) {
      console.error('Error syncing popular games:', error);
      throw error;
    }
  }

  async syncGameBySlug(slug: string) {
    try {
      // Check if IGDB is configured
      if (!igdbService.isConfigured()) {
        throw new Error('IGDB is not configured. Please set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in your .env.local.local file.');
      }

      console.log(`Syncing game by slug: ${slug}`);
      
      const igdbGame = await igdbService.getGameBySlug(slug);
      if (!igdbGame) {
        throw new Error(`Game with slug ${slug} not found in IGDB`);
      }

      const syncedGame = await this.syncGameFromIGDB(igdbGame);
      console.log(`Successfully synced game: ${igdbGame.name}`);
      
      return syncedGame;
    } catch (error) {
      console.error('Error syncing game by slug:', error);
      throw error;
    }
  }

  async syncGamesByGenre(genreId: number, limit: number = 20) {
    try {
      // Check if IGDB is configured
      if (!igdbService.isConfigured()) {
        throw new Error('IGDB is not configured. Please set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in your .env.local.local file.');
      }

      console.log(`Syncing ${limit} games for genre ID: ${genreId}`);
      
      const igdbGames = await igdbService.getGamesByGenre(genreId, limit);
      console.log(`Found ${igdbGames.length} games for genre ID ${genreId}`);
      
      const syncedGames = [];
      const errors = [];

      for (const igdbGame of igdbGames) {
        try {
          const syncedGame = await this.syncGameFromIGDB(igdbGame);
          syncedGames.push(syncedGame);
        } catch (error) {
          console.error(`Error syncing game ${igdbGame.name}:`, error);
          errors.push({
            game: igdbGame.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      console.log(`Successfully synced ${syncedGames.length} games for genre ID ${genreId}, ${errors.length} errors`);

      return {
        syncedGames,
        errors,
        totalFound: igdbGames.length,
        totalSynced: syncedGames.length,
        totalErrors: errors.length
      };
    } catch (error) {
      console.error('Error syncing games by genre:', error);
      throw error;
    }
  }

  async syncGamesByPlatform(platformId: number, limit: number = 20) {
    try {
      // Check if IGDB is configured
      if (!igdbService.isConfigured()) {
        throw new Error('IGDB is not configured. Please set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in your .env.local.local file.');
      }

      console.log(`Syncing ${limit} games for platform ID: ${platformId}`);
      
      const igdbGames = await igdbService.getGamesByPlatform(platformId, limit);
      console.log(`Found ${igdbGames.length} games for platform ID ${platformId}`);
      
      const syncedGames = [];
      const errors = [];

      for (const igdbGame of igdbGames) {
        try {
          const syncedGame = await this.syncGameFromIGDB(igdbGame);
          syncedGames.push(syncedGame);
        } catch (error) {
          console.error(`Error syncing game ${igdbGame.name}:`, error);
          errors.push({
            game: igdbGame.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      console.log(`Successfully synced ${syncedGames.length} games for platform ID ${platformId}, ${errors.length} errors`);

      return {
        syncedGames,
        errors,
        totalFound: igdbGames.length,
        totalSynced: syncedGames.length,
        totalErrors: errors.length
      };
    } catch (error) {
      console.error('Error syncing games by platform:', error);
      throw error;
    }
  }

  async getSyncStats() {
    try {
      const totalGames = await prisma.game.count();
      const gamesWithIGDB = await prisma.game.count({
        where: {
          igdbId: { not: null }
        }
      });

      return {
        totalGames,
        gamesWithIGDB,
        syncPercentage: totalGames > 0 ? Math.round((gamesWithIGDB / totalGames) * 100) : 0
      };
    } catch (error) {
      console.error('Error getting sync stats:', error);
      throw error;
    }
  }

  // Check if IGDB is configured
  isIGDBConfigured(): boolean {
    return igdbService.isConfigured();
  }
}

export const gameSyncService = new GameSyncService(); 