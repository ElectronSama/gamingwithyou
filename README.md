# GamingWithYou

A modern gaming platform that connects gamers and service providers.

## Features

- **User Authentication**: Secure login and registration system
- **Game Database**: Comprehensive game database with IGDB integration
- **Booking System**: Real-time booking and scheduling
- **Service Management**: Fixed services and custom orders
- **Admin Panel**: Complete admin interface for content management
- **Multi-language Support**: Internationalization with i18next
- **Responsive Design**: Modern UI with Tailwind CSS

## IGDB Integration

This project includes a comprehensive IGDB (Internet Game Database) integration that provides:

### 🎮 Game Data Management
- **Real-time Search**: Search games directly from IGDB
- **Popular Games**: Sync trending and popular games
- **Genre & Platform Filtering**: Filter games by genre and platform
- **Rich Metadata**: Cover images, screenshots, videos, ratings

### ⚡ Performance Features
- **Smart Caching**: 5-minute cache for API responses
- **Rate Limit Handling**: Automatic rate limit detection and handling
- **Error Recovery**: Graceful error handling and retry logic
- **Batch Processing**: Efficient syncing of multiple games

### 🔧 Technical Features
- **API Endpoints**: Complete REST API for game management
- **Database Sync**: Automatic sync between IGDB and local database
- **Statistics**: Comprehensive sync statistics and progress tracking
- **Admin Interface**: Built-in admin panel for sync management

### 📊 Available Endpoints
```
GET  /api/igdb/search?q={query}&limit={limit}
GET  /api/igdb/popular?limit={limit}
GET  /api/igdb/game/{slug}
GET  /api/igdb/genres
GET  /api/igdb/platforms
GET  /api/igdb/cache
DELETE /api/igdb/cache

POST /api/games/sync
POST /api/games/sync/popular
POST /api/games/sync/genre
POST /api/games/sync/platform
GET  /api/games/sync/stats
```

For detailed setup instructions, see [IGDB_SETUP.md](./IGDB_SETUP.md).

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gamingwithyou
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Test IGDB integration**
   ```bash
   npm run test:igdb
   ```

## Environment Variables

```env
# Database
POSTGRES_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# IGDB Integration
IGDB_CLIENT_ID="your-twitch-client-id"
IGDB_CLIENT_SECRET="your-twitch-client-secret"

# Email (optional)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@example.com"

# Stripe (optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts and profiles
- **Game**: Game database with IGDB integration
- **Booking**: Service bookings and scheduling
- **FixedService**: Pre-defined services
- **ServiceOrder**: Custom service orders

## API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Games
- `GET /api/games` - List all games
- `GET /api/games/search?q={query}` - Search games
- `POST /api/games/sync` - Sync games from IGDB

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List bookings
- `PUT /api/bookings/{id}` - Update booking

### Services
- `POST /api/services` - Create service
- `GET /api/services` - List services
- `PUT /api/services/{id}` - Update service

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test:igdb    # Test IGDB integration

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
```

### Testing

The project includes comprehensive testing for the IGDB integration:

```bash
# Run IGDB integration tests
npm run test:igdb
```

This will test:
- IGDB API connectivity
- Game search and sync functionality
- Error handling and validation
- Cache management
- Database operations

### Code Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── games/         # Game management
│   │   └── igdb/          # IGDB integration
│   ├── admin/             # Admin pages
│   └── (pages)/           # Public pages
├── components/             # React components
│   ├── ui/                # UI components
│   └── (feature)/         # Feature components
├── lib/                   # Utility libraries
│   ├── igdb.ts           # IGDB service
│   ├── gameSync.ts       # Game sync service
│   └── prisma.ts         # Database client
├── prisma/               # Database schema
└── scripts/              # Utility scripts
    └── test-igdb.js      # IGDB test script
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker

```bash
# Build the image
docker build -t gamingwithyou .

# Run the container
docker run -p 3000:3000 gamingwithyou
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the [IGDB_SETUP.md](./IGDB_SETUP.md) for IGDB integration help
- Review the [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) for auth setup
- Open an issue on GitHub for bugs or feature requests
