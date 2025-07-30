# GamingWithYou

A modern gaming community platform built with **Next.js 15**, **Prisma**, and **TypeScript**. Connect with gamers, book sessions, and discover amazing gaming experiences.

## 🚀 Live Demo

[Coming Soon - Deploy to Vercel]

## ✨ Features

### 🎮 **Gaming Community**
- **User Profiles** - Create detailed gaming profiles with skills, languages, and preferences
- **Game Database** - Comprehensive game library with ratings and descriptions
- **Gamer Discovery** - Find players based on games, skills, and availability
- **Social Features** - Connect, chat, and build gaming friendships

### 📅 **Booking System**
- **Session Booking** - Book gaming sessions with skilled players
- **Availability Management** - Set your availability and pricing
- **Real-time Scheduling** - Instant booking confirmations
- **Payment Integration** - Secure Stripe payments

### 🛍️ **Service Marketplace**
- **Fixed Services** - Offer coaching, boosting, and custom services
- **Order Management** - Track service orders and progress
- **Review System** - Rate and review service providers
- **Escrow Protection** - Secure payment handling

### 🏆 **Events & Tournaments**
- **Gaming Events** - Join tournaments and community events
- **Tournament Management** - Create and manage competitive events
- **Prize Pools** - Win prizes and recognition
- **Live Streaming** - Stream and watch gaming content

### 🎯 **Admin Features**
- **Game Management** - Add and manage games in the database
- **User Management** - Admin panel for user oversight
- **Content Moderation** - Manage news, events, and content
- **Analytics Dashboard** - Platform insights and statistics

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### **Backend**
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Reliable database
- **NextAuth.js** - Authentication system
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing

### **Deployment**
- **Vercel** - Hosting and CI/CD
- **PostgreSQL** - Database hosting (Vercel Postgres)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gamingwithyou.git
   cd gamingwithyou
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/gamingwithyou"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # (Optional) Run migrations
   npm run db:migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following main entities:

### **Core Models**
- **User** - User profiles and authentication
- **Game** - Game database and metadata
- **Booking** - Session bookings between users
- **FixedService** - Service offerings
- **ServiceOrder** - Service order management
- **GameEvent** - Tournaments and events
- **GameNews** - Gaming news and content

### **Supporting Models**
- **UserLanguage** - User language skills
- **UserGame** - User game associations
- **UserTag** - User categorization tags
- **UserAvailability** - User availability slots
- **Discount** - Coupon and discount system

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Database Setup**
   - Use Vercel Postgres or external PostgreSQL
   - Update `DATABASE_URL` in environment variables
   - Run database migrations

### Environment Variables for Production

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 📁 Project Structure

```
gamingwithyou/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── games/             # Game pages
│   ├── gamers/            # User profile pages
│   ├── admin/             # Admin panel
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── ui/                # UI components
│   └── forms/             # Form components
├── lib/                   # Utilities and config
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # NextAuth config
│   └── utils.ts           # Utility functions
├── prisma/                # Database schema
│   └── schema.prisma      # Prisma schema
└── public/                # Static assets
```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Run database migrations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Prisma Team** - For the excellent database ORM
- **Vercel Team** - For seamless deployment
- **Radix UI Team** - For accessible components
- **Tailwind CSS Team** - For the utility-first CSS framework

## 📞 Support

- **Documentation**: [Coming Soon]
- **Issues**: [GitHub Issues](https://github.com/yourusername/gamingwithyou/issues)
- **Discord**: [Join our community](https://discord.gg/gamingwithyou)

---

**Made with ❤️ by the GamingWithYou Team**
