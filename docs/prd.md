# Product Requirements Document: Property Advice Platform MVP

## 1. Executive Summary

**Product Overview**
A two-sided marketplace connecting property experts with users (buyers, renters, landlords) seeking professional advice. The MVP focuses on discovery and connection, allowing experts to showcase their services and users to find and favourite relevant offers.

**Core Value Proposition**
- **For Users:** A centralized directory of vetted property experts with transparent service offerings.
- **For Experts:** A dedicated professional profile and service listing capability to attract qualified leads.

**Success Definition**
A functional platform where:
- Experts can register, build a profile, and list services.
- Users can register, create a profile, and "favourite" services.
- Users can click through to an expert's external booking link (e.g., Calendly).

---

## 2. Scope Definition

### In Scope
- **Roles:** User (Seeker) and Expert (Provider).
- **Authentication:** Registration and Login for both roles.
- **Expert Dashboard:**
    - Profile Management: Name, Photo, Expert Level, Area (Sales, Lettings).
    - Service Management: Create/Delete service cards (Description, Price, Calendly Link).
- **User Dashboard:**
    - Profile Management: Market Role (Renter, Buyer, Landlord), Needs/Bio.
    - Favourites List: View saved services.
- **Discovery:**
    - List of available services.
    - Expert profile pages (accessible via service cards).
- **Navigation:**
    - Services listing page.
    - Individual expert profiles.

### Out of Scope (MVP)
- **On-platform Payments:** No Stripe integration (future feature).
- **Booking Engine:** Booking happens externally via Calendly links.
- **Messaging/Video:** No in-app communication.
- **Reviews/Ratings:** Not in MVP.
- **Search/Filtering:** Basic listing only.

---

## 3. User Roles & Profiles

### 3.1 Expert
**Goal:** Market services and receive bookings via external links.
**Profile Fields:**
- Name
- Photo (Upload)
- Expert Level (e.g., Junior, Senior, Partner)
- Area of Expertise (Sales, Lettings, etc.)
- Bio

### 3.2 User
**Goal:** Find specific advice and organize potential experts.
**Profile Fields:**
- Name
- Market Role (Renter, Buyer, Landlord, Seller, etc.)
- Needs Description (Context for the expert)

---

## 4. Feature Specifications

### 4.1 Authentication & Onboarding
- **Register:** Choose role (User vs Expert).
- **Login:** Email/Password (or OAuth).
- **Redirect:** Users to Discovery/Dashboard; Experts to Expert Dashboard.

### 4.2 Expert Dashboard
- **Profile Editor:** Form to update personal details and photo.
- **Service Manager:**
    - "Add Service" button.
    - Inputs: Title, Description, Price (text/number), Booking URL (Calendly).
    - List of active services with "Delete" option.

### 4.3 User Dashboard
- **My Profile:** View/Edit Role and Needs.
- **Favourites:** Grid view of saved Service Cards.

### 4.4 Service Discovery (Feed)
- **View:** Grid of service cards from all experts.
- **Card Content:** Service Title, Price, Expert Name (Link to profile), Short Description.
- **Actions:**
    - "Favourite" (Toggle).
    - "Book" (Opens Calendly link in new tab).
    - Click Expert Name -> Navigate to Expert Profile.

### 4.5 Expert Profile Page
- **Header:** Expert Photo, Name, Level, Area.
- **Services:** List of services offered by this expert.

---

## 5. Technical Architecture

### 5.1 Stack (Aligned with User Rules)
- **Frontend/Framework:** Next.js (App Router).
- **Styling:** Tailwind CSS.
- **Database:** PostgreSQL (via Supabase).
- **ORM:** Prisma.
- **Auth:** Supabase Auth or NextAuth.
- **Storage:** Supabase Storage (for profile photos).

### 5.2 Data Model (Draft)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  role      Role     // USER, EXPERT
  profile   Profile? // Polymorphic or separate tables
  favorites Favorite[]
}

// Simplified for illustration
model ExpertProfile {
  id          String @id @default(uuid())
  userId      String @unique
  name        String
  photoUrl    String?
  level       String
  area        String
  services    Service[]
}

model UserProfile {
  id          String @id @default(uuid())
  userId      String @unique
  marketRole  String // Renter, Buyer, etc.
  needs       String?
}

model Service {
  id          String @id @default(uuid())
  expertId    String
  title       String
  description String
  price       String
  bookingUrl  String
  favorites   Favorite[]
}

model Favorite {
  id        String @id @default(uuid())
  userId    String
  serviceId String
}
```

---

## 6. Implementation Plan (MVP)

1.  **Project Setup:** Next.js repo, Tailwind, Prisma, Supabase.
2.  **Auth Implementation:** Sign up/Login with Role selection.
3.  **Database & API:** Define schema, create CRUD actions (Server Actions).
4.  **Expert Features:** Profile & Service management UI.
5.  **User Features:** Profile management & Favourites logic.
6.  **Public/Discovery UI:** Service feed and Expert public pages.
7.  **Polish:** Accessibility checks (WCAG), Responsive design.
