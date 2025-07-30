# Authentication Setup Guide

This guide explains how to set up the email/password authentication system for GamingWithYou.

## Prerequisites

1. **Database Setup**: Make sure you have a PostgreSQL database running
2. **Environment Variables**: Create a `.env.local` file in the root directory

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gamingwithyou"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Important Notes:
- Replace `username:password@localhost:5432/gamingwithyou` with your actual database credentials
- Generate a secure secret key for `NEXTAUTH_SECRET` (you can use `openssl rand -base64 32` to generate one)
- Update `NEXTAUTH_URL` to your production URL when deploying

## Database Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

3. **Push database schema**:
   ```bash
   npm run db:push
   ```

## Running the Application

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   - Open http://localhost:3000
   - Navigate to `/registration` to create an account
   - Navigate to `/login` to sign in

## Features Implemented

### Registration (`/registration`)
- ✅ Username validation (3-20 characters)
- ✅ Email validation
- ✅ Password validation (minimum 8 characters)
- ✅ Password confirmation
- ✅ Terms and conditions agreement
- ✅ Error handling and user feedback
- ✅ Redirect to login after successful registration

### Login (`/login`)
- ✅ Email/password authentication
- ✅ Error handling for invalid credentials
- ✅ Success message display
- ✅ Redirect to home page after successful login

### Navigation
- ✅ Dynamic navigation based on authentication status
- ✅ Welcome message with username
- ✅ Profile link for authenticated users
- ✅ Sign out functionality
- ✅ Mobile-responsive design

### Profile Page (`/profile`)
- ✅ Protected route (redirects to login if not authenticated)
- ✅ Display user information
- ✅ Loading states
- ✅ Responsive design

### Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT-based sessions
- ✅ Protected routes
- ✅ Input validation with Zod
- ✅ SQL injection prevention with Prisma

## API Endpoints

### POST `/api/auth/register`
- **Purpose**: Register a new user
- **Body**: `{ username, email, password }`
- **Response**: User data or error message

### POST `/api/auth/[...nextauth]`
- **Purpose**: NextAuth.js authentication endpoints
- **Handles**: Login, logout, session management

## Database Schema

The authentication system uses the following Prisma schema:

```prisma
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  username          String   @unique
  password          String?
  bio               String?
  avatar            String?
  isAdmin           Boolean  @default(false)
  isVerified        Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  // ... other relations
}
```

## Testing the Authentication

1. **Create an account**:
   - Go to `/registration`
   - Fill in username, email, and password
   - Accept terms and conditions
   - Submit the form

2. **Sign in**:
   - Go to `/login`
   - Enter your email and password
   - Submit the form

3. **Verify authentication**:
   - Check that the navigation shows your username
   - Click "Profile" to view your profile page
   - Try accessing `/profile` directly to test protected routes

4. **Sign out**:
   - Click "Sign Out" in the navigation
   - Verify you're redirected to the home page
   - Check that the navigation shows login/signup buttons

## Troubleshooting

### Common Issues:

1. **Database connection error**:
   - Verify your `DATABASE_URL` is correct
   - Ensure PostgreSQL is running
   - Run `npm run db:push` to sync schema

2. **NextAuth secret error**:
   - Make sure `NEXTAUTH_SECRET` is set in `.env.local`
   - Generate a new secret if needed

3. **Registration fails**:
   - Check browser console for errors
   - Verify all required fields are filled
   - Ensure password meets minimum requirements

4. **Login fails**:
   - Verify email and password are correct
   - Check that the user exists in the database
   - Ensure NextAuth is properly configured

## Next Steps

To enhance the authentication system, consider adding:

1. **Email verification**
2. **Password reset functionality**
3. **Social login providers (Google, Facebook, etc.)**
4. **Two-factor authentication**
5. **Account deletion**
6. **Profile editing**
7. **Avatar upload**

## Security Considerations

- ✅ Passwords are hashed with bcrypt
- ✅ Input validation prevents injection attacks
- ✅ JWT tokens are used for session management
- ✅ Protected routes prevent unauthorized access
- ⚠️ Consider adding rate limiting for login attempts
- ⚠️ Consider adding CSRF protection
- ⚠️ Consider adding email verification 