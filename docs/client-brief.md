# Client Brief — Property Advice Marketplace MVP

## Project Overview

Build a minimal, full-stack MVP for a property advice marketplace that allows users to book and pay for a fixed-price property advice service.

In the future this app will grow into a platform, which will allow users who are less confident in the UK property processes to consult AI to simplify terms and explain processes in more unsophisticated way, to receive/send, categorise and systematise communication with agents on a variety of properties and listings. The platform will also be used by auxiliary services such as mortgage advisors, furniture pack suppliers, relocation agents and all other possible property/move service providers - a one stop shop enhanced by AI and supported by live property experts.

The purpose of this MVP is not scale, but to demonstrate:

- end-to-end full-stack capability
- clean architecture
- secure third-party payment integration
- relational data modelling
- deliberate product scoping

This MVP serves as a foundation layer for a future inclusion-first property services marketplace.

## Mission & Product Principles

- Make property advice and representation accessible and affordable
- Break traditional, high-cost services into small, fixed-scope units
- Prioritise simplicity, trust, and clarity
- Avoid overbuilding; focus on the transaction engine

## MVP Scope (Strict Boundary)

### In scope

- One service
- One provider (seeded)
- Client booking + payment
- Provider booking visibility
- Secure payment handling via third party
- Persistent data storage

### Explicitly out of scope

- Provider payouts
- Multiple providers
- Scheduling / availability
- Messaging
- Reviews
- Cancellations / refunds
- Expert verification (future work only)
- Admin tools

These are intentionally excluded and should be documented as future work.

## Core User Roles

### Client

- Can sign up and log in
- Can view the service
- Can create a booking
- Can pay for the booking
- Can see booking confirmation

### Provider

- Can log in
- Can see a list of paid bookings
- No accept/decline logic in V1 (payment = confirmed)

## Service Definition (MVP)

A single fixed service, e.g.:

- “15-minute property advice call”
- Fixed price (e.g. £30–£40)
- Fixed duration
- Assigned to one provider
- Remote only
- No categories, bundles, or tiers.

## Payment Model

### Payment handling

- Use Stripe Checkout (hosted)
- No card data ever touches the app
- Payments are initiated server-side
- Booking is confirmed via Stripe webhook

### Platform fee

- 12% platform fee
- Stripe processing fees are absorbed by the platform
- Providers see a predictable net amount

### Payouts

- Provider payouts are manual / simulated
- Automated payouts via Stripe Connect are explicitly future work

## Tech Stack (Locked)

### Frontend Tech

- React
- Tailwind CSS
- Role-based dashboard views

### Backend Tech

- Node.js
- Express
- JWT authentication
- REST API

### Database

- PostgreSQL (Supabase)
- Prisma ORM
- Migrations via Prisma

### Payments Tech

- Stripe Checkout
- Stripe webhooks with signature verification

### Deployment

- Frontend: Netlify or Vercel
- Backend: Render or Fly.io
- Database: Supabase

## Data Model (Minimum)

### User Entity

- id
- email
- password_hash
- role (CLIENT | PROVIDER)

### ProviderProfile Entity

- user_id (FK)
- bio

### Service Entity

- id
- provider_id (FK)
- price_gbp
- description

### Booking Entity

- id
- client_id (FK)
- service_id (FK)
- status (PENDING_PAYMENT | PAID)
- stripe_payment_intent_id
- created_at

## Core Backend Endpoints

### Auth Endpoints

- POST /auth/signup
- POST /auth/login

### Services Endpoints

- GET /services

### Bookings Endpoints

- POST /bookings → creates booking with PENDING_PAYMENT
- GET /bookings/me → client bookings
- GET /provider/bookings → provider bookings

### Payments Endpoints

- POST /payments/create-checkout-session
  - validates booking ownership
  - reads price from database
  - creates Stripe Checkout session
- POST /webhooks/stripe
  - verifies Stripe signature
  - confirms payment
  - updates booking status to PAID

## Frontend Pages (Minimum)

- /signup
- /login
- /service
- /checkout-success
- /dashboard (role-aware)

## Security & Best Practices

- No sensitive payment data stored
- Stripe webhook signature verification
- Server-side price validation
- Environment variables for secrets
- Auth middleware on protected routes
- Role-based access control

## Future Enhancements (Not Built Now)

- Expert identity & credential verification (progressive model)
- Multiple providers and services
- Automated payouts (Stripe Connect)
- Scheduling
- Reviews and trust signals
- Moderation tools

## Deliverables

- Monorepo with /client and /server
- Working deployed MVP
- Clear README documenting:
  - architecture
  - data model
  - security decisions
  - scope trade-offs
  - future roadmap
