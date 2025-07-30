# GamingWithMe - Comprehensive Documentation

## Project Overview

GamingWithMe is a platform that connects gamers for bookings, services, and events. The application uses a clean architecture approach with domain-driven design principles, leveraging the CQRS pattern with MediatR for command and query separation.

## Architecture

The solution follows a layered architecture:

- **Domain Layer**: Core entities and business rules
- **Application Layer**: Application logic, DTOs, commands, queries, and handlers
- **Infrastructure Layer**: Data access, external services integration
- **API Layer**: Controllers and endpoints

## Key Entities

### User Management

- **User**: Core entity for user profiles with gaming preferences
- **UserLanguage**: User's spoken languages
- **UserGame**: Games associated with a user
- **UserTag**: Tags for categorizing users
- **UserAvailability**: User's schedule and availability slots

### Booking System

- **Booking**: Represents a scheduled session between users
- **FixedService**: Predefined services offered by users
- **ServiceOrder**: Orders for fixed services
- **Discount**: Discount coupons for services and bookings

### Game Content

- **Game**: Game information
- **GameNews**: News articles related to games
- **GameEvent**: Gaming events/tournaments
- **GameEasterEgg**: Hidden features or fun facts about games

## Controllers and Features

### AccountController

- **Register**: User registration
- **Logout**: User signout
- **ForgotPassword**: Password reset request
- **ResetPassword**: Complete password reset
- **ChangePassword**: Update user password
- **DeleteAccount**: Remove user account
- **GoogleLogin**: Authenticate with Google

### UserController

- **GetMe**: Get current user profile
- **GetProfile**: Get any user's public profile
- **GetProfiles**: Get multiple user profiles
- **UpdateBio**: Update user bio
- **UpdateUsername**: Change username
- **UpdateAvatar**: Upload profile picture
- **AddLanguage/DeleteLanguage**: Manage user languages
- **AddGame/DeleteGame**: Manage user games
- **SetDailyAvailability**: Set available time slots
- **GetDailyAvailability**: View availability
- **AddTag/RemoveTag**: Manage user tags
- **UpdateSocialMedia**: Manage social media links
- **GetBillingHistory**: View transaction history
- **GetUpcomingBookings**: View scheduled bookings

### GameEventsController

- **GetEvents**: Get events for a game
- **CreateEvent**: Create new game event (admin only)
- **DeleteEvent**: Remove game event (admin only)

### GameNewsController

- **GetNewsForGame**: Get news for a specific game
- **GetNewsById**: Get specific news article
- **CreateNews**: Create news article (admin only)
- **DeleteNews**: Remove news article (admin only)

### StripeController

- **Pay**: Process payment for booking/service
- **RefundBooking/RefundServiceOrder**: Process refunds
- **Webhook**: Handle Stripe events
- **CreateConnectedAccount**: Create Stripe Connect account
- **GetConnectedAccountLink**: Get onboarding/update links
- **IsOnboardingComplete**: Check Stripe onboarding status
- **CreateCoupon**: Create discount coupons
- **ValidateCouponByName**: Verify coupon validity
- **GetMyCoupons**: List user's coupons
## System Workflows

### Booking System

1. Users set their availability through the `/api/user/daily-availability` endpoint
2. Customers can book available slots through Stripe payments
3. Payments are processed through Stripe Connect for platform fees
4. Notifications are sent for booking confirmations and updates

### Service System

1. Users create fixed services with descriptions and prices
2. Customers can order services through Stripe payments
3. Service providers can update order status (pending, in progress, completed)
4. System tracks deadlines and completion dates

## Running the Application

### Prerequisites

- .NET 8 SDK
- SQL Server/LocalDB
- Stripe account for payments

## Key Flows

### Booking Flow

1. Provider sets availability slots with pricing
2. Customer selects a slot and proceeds to payment
3. Stripe processes payment with platform fee
4. Booking is created and confirmed
5. Provider and customer receive notifications

### Service Order Flow

1. Provider creates a fixed service with pricing
2. Customer orders the service and provides notes
3. Provider updates order status as work progresses
4. System tracks completion and manages payments

### Refund Flow

1. User requests refund for booking/service
2. System validates refund eligibility
3. Stripe processes the refund
4. Booking/order is cancelled