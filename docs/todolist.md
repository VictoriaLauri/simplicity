# Technical Onboarding & MVP Task Tracker

This document serves as both a technical onboarding guide and a master task list. It has been updated to reflect **Next.js App Router** best practices and provides detailed context for each implementation step.

---

## Part 1: Technical Overview & Modern Standards

### 1. System Architecture

- **Pattern:** Full-Stack Next.js Application.
- **Frontend:** React Server Components (RSC) + Client Components.
- **Backend:** Server Actions + Route Handlers.
- **Styling:** Tailwind CSS.
- **Database:** Supabase (PostgreSQL) + Prisma ORM.

### 2. Technology Stack (Verified for 2026)

- **Framework:** Next.js 15 (App Router).
- **Language:** TypeScript.
- **Styling:** Tailwind CSS v3.4.
- **Database:** Prisma ORM connecting to Supabase.
- **Validation:** Zod.

### 3. Repository Scaffolding

```text
simplicity/
├── src/
│   ├── app/                # App Router (Pages & Layouts)
│   ├── components/         # Reusable UI (Button, Input, Card)
│   ├── lib/                # Utilities (prisma, utils)
│   ├── actions/            # Server Actions (auth, services)
│   └── types/              # Global TypeScript definitions
├── prisma/                 # Database Schema
├── public/                 # Static Assets
└── [Config Files]          # next.config.ts, tailwind.config.ts
```

---

## Part 2: Master Task List & Implementation Context

### Phase 1: Infrastructure & Scaffolding

**Goal:** Solid foundation ensuring security and developer experience.

- [x] **Repo Setup**
  - [x] **Initialize Next.js Project**
    - _Context:_ Clean install with `create-next-app` (TypeScript, Tailwind, App Router).
  - [x] **Configure Tailwind**
    - _Context:_ Ensure `tailwind.config.ts` scans `src/`.
- [ ] **Database Setup**
  - [ ] **Supabase & Prisma**
    - _Context:_ Create Supabase project. Get connection string.
    - _Considerations:_ Use Transaction Mode (6543) if using Serverless, but Session Mode (5432) is fine for standard dev.
  - [ ] **Schema Definition**
    - _Context:_ Define `User`, `ProviderProfile`, `UserProfile`, `Service`, `Favorite` in `schema.prisma`.
    - _Considerations:_ Use UUIDs. Map `price` as string or int (pence).

### Phase 2: Core Authentication (Next.js)

**Goal:** Secure user management using Server Actions.

- [ ] **Auth Implementation**
  - [ ] **Sign Up / Login UI**
    - _Context:_ Create simple forms for Email/Password.
  - [ ] **Server Actions (Auth)**
    - _Context:_ `signup(formData)` and `login(formData)`.
    - _Considerations:_ Use `bcrypt` (or `argon2`) to hash passwords. Set an HTTP-only cookie for the session (or use a library like `jose` for manual JWT handling).
  - [ ] **Middleware Protection**
    - _Context:_ `middleware.ts` to check for session cookie on protected routes (`/dashboard`, `/profile`).

### Phase 3: Expert & User Dashboards

**Goal:** Profile and Service Management.

- [ ] **Expert Features**
  - [ ] **Profile Management**
    - _Context:_ Form to update Bio, Area, Level.
    - _Action:_ `updateExpertProfile(data)`.
  - [ ] **Service Management**
    - _Context:_ CRUD for Services. Inputs: Title, Description, Price, Calendly Link.
    - _Action:_ `createService(data)`, `deleteService(id)`.
- [ ] **User Features**
  - [ ] **Profile Management**
    - _Context:_ Update Role (Buyer/Renter) and Needs.
    - _Action:_ `updateUserProfile(data)`.
  - [ ] **Favourites Logic**
    - _Context:_ Toggle "Heart" on services.
    - _Action:_ `toggleFavorite(serviceId)`.

### Phase 4: Public Discovery & Navigation

**Goal:** Users can find and view experts.

- [ ] **Service Feed**
  - [ ] **Listing Page (`/`)**
    - _Context:_ Server Component fetching `prisma.service.findMany()`.
    - _UI:_ Grid of Service Cards.
- [ ] **Expert Profile Page**
  - [ ] **Dynamic Route (`/expert/[id]`)**
    - _Context:_ Fetch expert details and their services.
- [ ] **Navigation**
  - [ ] **Navbar**
    - _Context:_ Dynamic links based on Auth state (Login vs Dashboard).

### Phase 5: Polish & Deployment

**Goal:** Production readiness.

- [ ] **Validation**
  - [ ] **Zod Integration**
    - _Context:_ Validate all Server Action inputs with Zod schemas.
- [ ] **UI Polish**
  - [ ] **Loading States**
    - _Context:_ Use `loading.tsx` and `<Suspense>` boundaries.
  - [ ] **Accessibility**
    - _Context:_ Ensure semantic HTML and keyboard navigation.
- [ ] **Deployment**
  - [ ] **Vercel/Netlify**
    - _Context:_ Deploy and configure Environment Variables.
