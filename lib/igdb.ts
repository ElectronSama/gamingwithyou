import axios from 'axios';

interface IGDBGame {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  storyline?: string;
  rating?: number;
  rating_count?: number;
  first_release_date?: number;
  cover?: {
    id: number;
    url: string;
  };
  genres?: Array<{
    id: number;
    name: string;
  }>;
  platforms?: Array<{
    id: number;
    name: string;
  }>;
  screenshots?: Array<{
    id: number;
    url: string;
  }>;
  videos?: Array<{
    id: number;
    video_id: string;
  }>;
  age_ratings?: Array<{
    category: number;
    rating: number;
  }>;
  game_modes?: Array<{
    id: number;
    name: string;
  }>;
  player_perspectives?: Array<{
    id: number;
    name: string;
  }>;
  websites?: Array<{
    category: number;
    url: string;
  }>;
  similar_games?: Array<{
    id: number;
    name: string;
    cover?: {
      id: number;
      url: string;
    };
  }>;
  dlcs?: Array<{
    id: number;
    name: string;
    cover?: {
      id: number;
      url: string;
    };
  }>;
  expansions?: Array<{
    id: number;
    name: string;
    cover?: {
      id: number;
      url: string;
    };
  }>;
  standalone_expansions?: Array<{
    id: number;
    name: string;
    cover?: {
      id: number;
      url: string;
    };
  }>;
}

interface IGDBTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class IGDBService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.clientId = process.env.IGDB_CLIENT_ID || '';
    this.clientSecret = process.env.IGDB_CLIENT_SECRET || '';
    
    if (!this.clientId || !this.clientSecret) {
      console.warn('IGDB_CLIENT_ID or IGDB_CLIENT_SECRET not configured. IGDB features will be disabled.');
    }
  }

  private async getAccessToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('IGDB credentials not configured. Please set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in your .env.local file.');
    }

    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post<IGDBTokenResponse>(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
          params: {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 minute buffer

      return this.accessToken;
    } catch (error) {
      console.error('Error getting IGDB access token:', error);
      throw new Error('Failed to authenticate with IGDB. Please check your credentials.');
    }
  }

  private getCacheKey(endpoint: string, query: string): string {
    return `${endpoint}:${query}`;
  }

  private getCachedData(cacheKey: string): any | null {
    const cached = this.requestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(cacheKey: string, data: any): void {
    this.requestCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  private async makeRequest(endpoint: string, query: string): Promise<any[]> {
    const cacheKey = this.getCacheKey(endpoint, query);
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const token = await this.getAccessToken();
    
    try {
      const response = await axios.post(
        `https://api.igdb.com/v4/${endpoint}`,
        query,
        {
          headers: {
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'text/plain'
          },
          timeout: 15000 // 15 second timeout
        }
      );

      const data = response.data;
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error('IGDB rate limit exceeded. Please try again later.');
      } else if (error.response?.status === 401) {
        // Clear token and retry once
        this.accessToken = null;
        this.tokenExpiry = 0;
        throw new Error('Authentication failed. Please check your IGDB credentials.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      } else {
        console.error(`Error making IGDB request to ${endpoint}:`, error);
        throw new Error(`Failed to fetch data from IGDB ${endpoint}. Please try again later.`);
      }
    }
  }

  // Public method to make custom requests
  async makeCustomRequest(endpoint: string, query: string): Promise<any[]> {
    return this.makeRequest(endpoint, query);
  }

  async searchGames(query: string, limit: number = 20): Promise<IGDBGame[]> {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    // Use name search instead of the search endpoint - only main games, no DLCs, expansions, or seasons
    const searchQuery = `
      fields name,slug,summary,storyline,rating,rating_count,first_release_date,cover.url,genres.name,platforms.name;
      where version_parent = null & category = 0 & name ~ *"${query}"*;
      limit ${Math.min(limit, 50)};
      sort rating desc;
    `;

    return this.makeRequest('games', searchQuery);
  }

  async getPopularGames(limit: number = 20): Promise<IGDBGame[]> {
    const query = `
      fields name,slug,summary,storyline,rating,rating_count,first_release_date,cover.url,genres.name,platforms.name,screenshots.url,videos.video_id,age_ratings.category,age_ratings.rating,game_modes.name,player_perspectives.name,websites.category,websites.url,similar_games.name,similar_games.cover.url,dlcs.name,dlcs.cover.url,expansions.name,expansions.cover.url,standalone_expansions.name,standalone_expansions.cover.url;
      where rating_count > 100 & version_parent = null & category = 0;
      sort rating desc;
      limit ${Math.min(limit, 50)};
    `;

    return this.makeRequest('games', query);
  }

  async getGameById(id: number): Promise<IGDBGame | null> {
    if (!id || id <= 0) {
      throw new Error('Invalid game ID');
    }

    const query = `
      fields name,slug,summary,storyline,rating,rating_count,first_release_date,cover.url,genres.name,platforms.name,screenshots.url,videos.video_id,age_ratings.category,age_ratings.rating,game_modes.name,player_perspectives.name,websites.category,websites.url,similar_games.name,similar_games.cover.url,dlcs.name,dlcs.cover.url,expansions.name,expansions.cover.url,standalone_expansions.name,standalone_expansions.cover.url;
      where id = ${id};
    `;

    const games = await this.makeRequest('games', query);
    return games.length > 0 ? games[0] : null;
  }

  async getGameBySlug(slug: string): Promise<IGDBGame | null> {
    if (!slug.trim()) {
      throw new Error('Game slug cannot be empty');
    }

    const query = `
      fields name,slug,summary,storyline,rating,rating_count,first_release_date,cover.url,genres.name,platforms.name,screenshots.url,videos.video_id,age_ratings.category,age_ratings.rating,game_modes.name,player_perspectives.name,websites.category,websites.url,similar_games.name,similar_games.cover.url,dlcs.name,dlcs.cover.url,expansions.name,expansions.cover.url,standalone_expansions.name,standalone_expansions.cover.url;
      where slug = "${slug}";
    `;

    const games = await this.makeRequest('games', query);
    return games.length > 0 ? games[0] : null;
  }

  async getGenres(): Promise<Array<{ id: number; name: string }>> {
    const query = `
      fields name;
      sort name asc;
      limit 50;
    `;

    return this.makeRequest('genres', query);
  }

  async getPlatforms(): Promise<Array<{ id: number; name: string }>> {
    const query = `
      fields name;
      sort name asc;
      limit 50;
    `;

    return this.makeRequest('platforms', query);
  }

  async getGamesByGenre(genreId: number, limit: number = 20): Promise<IGDBGame[]> {
    if (!genreId || genreId <= 0) {
      throw new Error('Invalid genre ID');
    }

    const query = `
      fields name,slug,summary,storyline,rating,rating_count,first_release_date,cover.url,genres.name,platforms.name,screenshots.url,videos.video_id,age_ratings.category,age_ratings.rating,game_modes.name,player_perspectives.name,websites.category,websites.url,similar_games.name,similar_games.cover.url,dlcs.name,dlcs.cover.url,expansions.name,expansions.cover.url,standalone_expansions.name,standalone_expansions.cover.url;
      where genres = ${genreId} & version_parent = null & category = 0;
      sort rating desc;
      limit ${Math.min(limit, 50)};
    `;

    return this.makeRequest('games', query);
  }

  async getGamesByPlatform(platformId: number, limit: number = 20): Promise<IGDBGame[]> {
    if (!platformId || platformId <= 0) {
      throw new Error('Invalid platform ID');
    }

    const query = `
      fields name,slug,summary,storyline,rating,rating_count,first_release_date,cover.url,genres.name,platforms.name,screenshots.url,videos.video_id,age_ratings.category,age_ratings.rating,game_modes.name,player_perspectives.name,websites.category,websites.url,similar_games.name,similar_games.cover.url,dlcs.name,dlcs.cover.url,expansions.name,expansions.cover.url,standalone_expansions.name,standalone_expansions.cover.url;
      where platforms = ${platformId} & version_parent = null & category = 0;
      sort rating desc;
      limit ${Math.min(limit, 50)};
    `;

    return this.makeRequest('games', query);
  }

  // Clear cache method for testing or manual cache management
  clearCache(): void {
    this.requestCache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.requestCache.size,
      keys: Array.from(this.requestCache.keys())
    };
  }

  // Check if IGDB is configured
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }
}

export const igdbService = new IGDBService();
export type { IGDBGame }; 