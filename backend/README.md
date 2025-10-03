# Hotel Management Backend - Setup Instructions

## Overview
This is a comprehensive Hotel Management System backend built with NestJS, GraphQL, TypeORM, and PostgreSQL, featuring Cashfree Payment Gateway integration.

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Cashfree Payment Gateway sandbox account

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
Copy the example environment file and configure your settings:
```bash
cp .env.example .env
```

Update the `.env` file with your actual configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=hotel_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

# Cashfree Payment Gateway (Sandbox)
CASHFREE_APP_ID=your-cashfree-app-id
CASHFREE_SECRET_KEY=your-cashfree-secret-key
CASHFREE_BASE_URL=https://sandbox.cashfree.com/pg

# Server Configuration
PORT=3000
```

### 3. Database Setup
Create a PostgreSQL database named `hotel_management` or use the name you specified in your .env file.

### 4. Run Database Migrations
```bash
npm run migration:run
```

### 5. Start the Application

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

## GraphQL API Endpoints

The GraphQL playground will be available at: `http://localhost:3000/graphql`

### Core Features

#### Authentication
- `register(registerUserInput)` - User registration
- `login(loginUserInput)` - User login

#### Hotel Management
- `createHotel(createHotelInput)` - Create a new hotel
- `getHotels()` - Get all hotels
- `getHotel(id)` - Get hotel by ID
- `updateHotel(id, updateHotelInput)` - Update hotel
- `deleteHotel(id)` - Delete hotel
- `searchHotels(query)` - Search hotels by name/city

#### Room Management
- `addRoom(createRoomInput)` - Add room to hotel
- `getRooms(hotelId?)` - Get rooms (optionally filter by hotel)
- `getRoom(id)` - Get room by ID
- `getAvailableRooms(hotelId, checkInDate, checkOutDate)` - Get available rooms
- `updateRoom(id, updateRoomInput)` - Update room
- `deleteRoom(id)` - Delete room

#### Booking Management
- `createBooking(createBookingInput)` - Create new booking
- `getBookings(userId?)` - Get bookings (optionally filter by user)
- `getBooking(id)` - Get booking by ID
- `cancelBooking(id, cancelBookingInput)` - Cancel booking

#### Payment Integration
- `initiatePayment(bookingId)` - Initiate payment with Cashfree
- `verifyPayment(orderId)` - Verify payment status

## Database Schema

### Entities
- **User**: User accounts with roles (user, admin, hotel_manager)
- **Hotel**: Hotel information and details
- **Room**: Rooms belonging to hotels
- **Booking**: Booking records linking users and rooms
- **Payment**: Payment records with Cashfree integration

### Relationships
- User → Bookings (One-to-Many)
- Hotel → Rooms (One-to-Many)
- Room → Bookings (One-to-Many)
- Booking → Payment (One-to-One)

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and descriptive error messages.

## Cashfree Integration

The payment integration uses Cashfree's sandbox environment. To go live:
1. Update `CASHFREE_BASE_URL` to the production URL
2. Replace sandbox credentials with production credentials
3. Update webhook URLs to production endpoints

## Development Commands

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Run tests
npm run test

# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── config/                 # Configuration files
│   └── database.config.ts   # Database configuration
├── modules/                # Feature modules
│   ├── auth/              # Authentication module
│   ├── users/             # User management
│   ├── hotels/            # Hotel management
│   ├── rooms/             # Room management
│   ├── bookings/          # Booking management
│   └── payments/          # Payment integration
├── common/                # Shared utilities
│   ├── decorators/        # Custom decorators
│   ├── filters/           # Exception filters
│   └── guards/            # Auth guards
├── app.module.ts          # Main app module
└── main.ts               # Application entry point
```

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| NODE_ENV | Environment | No | development |
| PORT | Server port | No | 3000 |
| DB_HOST | Database host | Yes | localhost |
| DB_PORT | Database port | Yes | 5432 |
| DB_USERNAME | Database username | Yes | - |
| DB_PASSWORD | Database password | Yes | - |
| DB_DATABASE | Database name | Yes | - |
| JWT_SECRET | JWT secret key | Yes | - |
| JWT_EXPIRATION | JWT expiration | No | 7d |
| CASHFREE_APP_ID | Cashfree App ID | Yes | - |
| CASHFREE_SECRET_KEY | Cashfree Secret | Yes | - |
| CASHFREE_BASE_URL | Cashfree API URL | Yes | - |

## Support

For issues and questions, please refer to the documentation or create an issue in the project repository.