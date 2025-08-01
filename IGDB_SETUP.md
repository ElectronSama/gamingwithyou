# IGDB Setup Guide

## Overview
This application uses the IGDB (Internet Game Database) API to provide access to over 428,000 games. The IGDB API is powered by Twitch and provides comprehensive game data including covers, ratings, genres, platforms, and more.

## Current Status
The application is currently running in **fallback mode** because IGDB credentials are not configured. This means you'll see sample data instead of the full 428,000 game database.

## Quick Setup

### 1. Get IGDB API Credentials
1. Go to [https://api.igdb.com/](https://api.igdb.com/)
2. Sign up for a free account
3. Create a new application
4. Note your **Client ID** and **Client Secret**

### 2. Configure Environment Variables
Create a `.env.local` file in your project root with the following content:

```env
# IGDB API Configuration
IGDB_CLIENT_ID=your_igdb_client_id_here
IGDB_CLIENT_SECRET=your_igdb_client_secret_here

# NextAuth Configuration (if using authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Database Configuration
DATABASE_URL="file:./dev.db"
```

### 3. Restart the Application
After adding the environment variables, restart your development server:

```bash
npm run dev
```

## Features Available

### With IGDB Configured (Full Access)
- ✅ Access to 428,000+ games
- ✅ Real-time search across all games
- ✅ Advanced filtering by genre and platform
- ✅ High-quality game covers
- ✅ Rating and review data
- ✅ Release date information
- ✅ Detailed game information

### In Fallback Mode (Current)
- ✅ Sample games for demonstration
- ✅ Basic search functionality
- ✅ Genre and platform filtering
- ✅ Rating and review data
- ✅ Release date information
- ⚠️ Limited to sample data only

## Troubleshooting

### Common Issues

1. **"IGDB credentials not configured"**
   - Solution: Add your IGDB_CLIENT_ID and IGDB_CLIENT_SECRET to `.env.local`

2. **"Authentication failed"**
   - Solution: Verify your credentials are correct and not expired

3. **"Rate limit exceeded"**
   - Solution: Wait a few minutes and try again (IGDB has rate limits)

4. **"Request timeout"**
   - Solution: Check your internet connection and try again

### API Limits
- IGDB has rate limits for free accounts
- Requests are cached for 5 minutes to reduce API calls
- Search results are limited to 50 games per request

## Development Notes

### Fallback System
The application includes a robust fallback system that:
- Provides sample data when IGDB is not configured
- Shows helpful error messages
- Maintains functionality even without IGDB
- Allows development and testing without API credentials

### Caching
- API responses are cached for 5 minutes
- Cache can be cleared programmatically
- Cache statistics are available for debugging

### Error Handling
- Graceful degradation when IGDB is unavailable
- Detailed error messages for debugging
- Automatic retry logic for transient failures

## Next Steps

1. **Get IGDB credentials** from [https://api.igdb.com/](https://api.igdb.com/)
2. **Add credentials** to `.env.local`
3. **Restart the application**
4. **Enjoy access** to the full 428,000 game database!

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your IGDB credentials are correct
3. Ensure your `.env.local` file is in the project root
4. Restart the development server after making changes

The application will work in fallback mode even without IGDB credentials, so you can continue development and testing while setting up the full integration. 