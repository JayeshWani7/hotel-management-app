# 🏨 Hotel Booking Marketplace – Full-Stack Project

## 📋 Overview

A complete hotel booking platform that connects travelers with hotel owners, featuring integrated payments, commission-based revenue model, and multi-role architecture.

---

## 🎭 System Actors

### 1. **Customer (Traveler)**
- Register and manage account
- Search and filter hotels
- Book rooms with online payment
- Manage bookings and write reviews

### 2. **Hotel Owner (Seller)**
- Register as a seller on the platform
- List hotels and manage property details
- Add and configure room inventory
- Track bookings and earnings

### 3. **Admin (Platform Owner)**
- Oversee entire platform operations
- Approve/reject hotel listings
- Monitor all transactions
- Handle disputes and refunds

---

## 💰 Business Model

```
Customer Payment → Platform Account (Cashfree)
                     ↓
         Platform deducts commission (e.g., 10%)
                     ↓
         Remaining amount → Hotel Owner's Bank Account
```

**Key Points:**
- Full payment collected upfront via Cashfree
- Platform commission deducted automatically
- Transparent payout system to hotel owners
- Admin has complete transaction visibility

---

## ✨ Core Features

### 👤 Customer Side
- **Authentication:** JWT-based auth with OAuth social login support
- **Search & Discovery:** Filter by city, price range, ratings, amenities
- **Hotel Details:** View images, room types, reviews, and ratings
- **Booking Management:** 
  - Real-time availability checking
  - Date-based room booking
  - Modify or cancel reservations
- **Payment:** Secure online payment via Cashfree
- **Reviews:** Rate and review hotels post-stay

### 🏢 Hotel Owner Side
- **Seller Registration:** Dedicated seller onboarding
- **Hotel Management:**
  - Create and edit hotel profiles
  - Add location, amenities, descriptions, images
- **Room Management:**
  - Define room types (single, double, suite, etc.)
  - Set pricing and capacity
  - Manage availability calendars
- **Booking Dashboard:** View incoming bookings in real-time
- **Financial Dashboard:** Track earnings and payout history
- **Cancellation Handling:** Manage customer cancellations and refunds

### 👨‍💼 Admin Side
- **Analytics Dashboard:**
  - Total users, hotels, bookings
  - Revenue metrics and trends
- **Approval System:** Review and approve hotel listings
- **Dispute Resolution:** Handle customer complaints and refunds
- **Commission Control:** Set global or per-hotel commission rates
- **Reporting:** Generate detailed reports on platform performance

---

## 🏗️ System Architecture

### Microservices Design

We're building this with a **microservices architecture** for scalability and maintainability.

#### 1. **Auth Service**
- User, Seller, and Admin authentication
- JWT token generation and validation
- Role-based access control (RBAC)

#### 2. **User Service**
- Customer profile management
- Preferences and settings
- Booking history

#### 3. **Hotel Service**
- Hotel CRUD operations (by sellers)
- Room CRUD operations
- Availability management system

#### 4. **Booking Service**
- Create bookings (status: pending → confirmed)
- Handle cancellations and modifications
- Integrates with Payment Service

#### 5. **Payment Service** 💳
- **Cashfree Integration:**
  - Payment initiation (customer → platform)
  - Webhook listeners (payment success/failure)
  - Commission calculation and deduction
  - Payout API (platform → hotel owner)

#### 6. **Review Service**
- Ratings and reviews for hotels
- Average rating calculations
- Review moderation

#### 7. **Notification Service** 📧
- Email and SMS notifications
- Booking confirmations
- Cancellation alerts
- Payout notifications
- Async processing via Kafka/RabbitMQ

---

## 🛠️ Tech Stack

### Frontend
- **Web:** Next.js (customer portal + admin dashboard)
- **Mobile:** React Native (customer app)

### Backend
- **Framework:** Spring Boot (Java) or NestJS (Node.js)
- **API:** REST or GraphQL

### Database
- **Relational:** PostgreSQL/MySQL (transactional data)
- **NoSQL:** MongoDB (reviews, logs)

### Caching
- **Redis:** Session management, search result caching

### Message Queue
- **Kafka/RabbitMQ:** Async notifications and event processing

### DevOps
- **Containerization:** Docker + Docker Compose (local dev)
- **Orchestration:** Kubernetes + CI/CD pipelines (production)
- **Payment Gateway:** Cashfree

---

## 🗄️ Database Schema

### Users
```
id | name | email | password | role | created_at
```
**Roles:** customer, seller, admin

### Hotels
```
id | seller_id | name | city | description | rating | status | created_at
```
**Status:** approved, pending, rejected

### Rooms
```
id | hotel_id | type | price | capacity | is_available | created_at
```

### Bookings
```
id | user_id | room_id | check_in | check_out | status | created_at
```
**Status:** pending, confirmed, cancelled

### Payments
```
id | booking_id | amount | transaction_id | status | commission | payout_status | created_at
```

### Reviews
```
id | user_id | hotel_id | rating | comment | created_at
```

---

## 🔄 Payment Flow (Cashfree Integration)

```
1. Customer selects room and dates
         ↓
2. Booking created with status: PENDING
         ↓
3. Backend calls Cashfree API → generates payment order
         ↓
4. Customer completes payment on Cashfree gateway
         ↓
5. Cashfree sends webhook notification
         ↓
6. Payment Service processes webhook:
   - Updates booking status: CONFIRMED
   - Records payment: SUCCESS
   - Calculates and deducts commission
         ↓
7. Payout triggered via Cashfree Payout API
         ↓
8. Money transferred to hotel owner's account
         ↓
9. Notification Service sends confirmation emails/SMS
```

---

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────┐
│         Frontend Layer                  │
│  (Next.js Web + React Native Mobile)   │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────▼─────────┐
         │   API Gateway     │
         │  (Load Balancer)  │
         └─────────┬─────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼───┐   ┌─────▼─────┐   ┌───▼────┐
│ Auth  │   │   User    │   │ Hotel  │
│Service│   │  Service  │   │Service │
└───────┘   └───────────┘   └────────┘
                   │
         ┌─────────▼──────────┐
         │  Booking Service   │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │  Payment Service   │ ←→ Cashfree API
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │ Notification Svc   │ ←→ Email/SMS APIs
         └────────────────────┘

Database Layer: PostgreSQL, MongoDB, Redis
Message Queue: Kafka/RabbitMQ
```

---

## 🚀 Why This is a Significant Project

### Complexity Factors
1. **Multi-role architecture** with different user journeys
2. **Real business logic** including commission models and payouts
3. **Financial transactions** with payment gateway integration
4. **Scalable microservices** architecture
5. **Production-ready** design patterns and best practices

### Learning Outcomes
- Microservices architecture and inter-service communication
- Payment gateway integration (Cashfree)
- Real-world database design for complex relationships
- Async processing with message queues
- Role-based access control and authentication
- Deployment and containerization with Docker/Kubernetes

### Market Viability
This is not just a learning project—it's a **real business model** that can be deployed and monetized. Similar to platforms like Booking.com, Airbnb, or OYO, but with your own twist.

---

## 🎯 Next Steps

1. **Phase 1:** Set up basic authentication and user management
2. **Phase 2:** Build hotel and room management for sellers
3. **Phase 3:** Implement search and booking flow
4. **Phase 4:** Integrate Cashfree payment gateway
5. **Phase 5:** Add admin dashboard and analytics
6. **Phase 6:** Deploy to cloud with CI/CD pipeline

---

## 📝 Notes

- This project can be built iteratively—start with a monolith and refactor to microservices
- Focus on getting core booking flow working before adding advanced features
- Use feature flags to deploy incrementally
- Consider adding features like loyalty programs, discount codes, and dynamic pricing in future iterations

**Good luck with your build! 🚀**