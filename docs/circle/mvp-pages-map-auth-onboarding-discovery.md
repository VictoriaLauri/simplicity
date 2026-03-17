# MVP Page and State Map (Detailed)

## Scope and Purpose

- Scope for this map: auth, onboarding, discovery feed, expert profile, favourites, and expert dashboard placeholder.
- Purpose: define route behavior and required UI states before implementation to reduce schema/UI drift.
- Each page below includes: access rule, primary actions, required states, and data dependencies.

## Global Routing Rules

1. Unauthenticated users can access public pages only.
2. Authenticated users with null `profiles.role` are forced to `/onboarding/role`.
3. USER and EXPERT role gates apply on role-specific pages.
4. Unknown route parameters return not-found state.

## Cross-Page Accessibility Baseline

- Use semantic landmarks (`header`, `main`, `footer`) and one `h1` per page.
- All interactive controls must be keyboard reachable with visible focus.
- Error and empty states must be announced clearly in text, not color alone.
- External links must be clearly labeled and safe (`rel`/target behavior).

---

## Route: `/`

- Type: Public entry page
- Access: Everyone
- Goal: Route user toward login/signup or discovery
- Primary actions: Go to login, signup, or services feed
- Data dependencies: none required

### Required states (`/`)

1. Default content
2. Authenticated redirect decision (optional direct redirect)
3. Error fallback (if session check fails)

### Notes (`/`)

- Keep this page minimal; avoid adding business logic that belongs in auth routes.

---

## Route: `/auth/login`

- Type: Public auth page
- Access: Unauthenticated preferred
- Goal: Authenticate existing user
- Primary actions: Submit login form, navigate to signup
- Data dependencies: auth provider + profile role read

### Required states (`/auth/login`)

1. Idle form
2. Submitting
3. Validation/auth error
4. Success redirect

### Redirect rules (`/auth/login`)

- Success + null role -> `/onboarding/role`
- Success + USER -> `/services` (or user home)
- Success + EXPERT -> `/expert/dashboard`

---

## Route: `/auth/signup`

- Type: Public auth page
- Access: Unauthenticated preferred
- Goal: Create new account
- Primary actions: Submit registration form
- Data dependencies: auth provider, profile bootstrap trigger

### Required states (`/auth/signup`)

1. Idle form
2. Submitting
3. Validation/signup error
4. Success redirect to onboarding

### Notes (`/auth/signup`)

- Keep copy explicit about next step: role onboarding after signup.

---

## Route: `/onboarding/role`

- Type: Protected onboarding page
- Access: Authenticated users with null role
- Goal: Persist role choice to `profiles.role`
- Primary actions: Select USER or EXPERT, save
- Data dependencies: `profiles(role)`

### Required states (`/onboarding/role`)

1. Loading current profile
2. Role selection form (null role)
3. Saving
4. Save error with retry
5. Completion redirect

### Redirect rules (`/onboarding/role`)

- If unauthenticated -> `/auth/login`
- If role already set -> role destination page
- Save USER -> `/services`
- Save EXPERT -> `/expert/dashboard`

---

## Route: `/services`

- Type: Public discovery feed
- Access: Everyone
- Goal: Discover services and navigate to experts
- Primary actions: open expert profile, favourite toggle (auth USER), external book link
- Data dependencies: `services`, `profiles`, `expert_profiles`, optional `favorites`

### Required states (`/services`)

1. Loading skeleton/list
2. Populated feed
3. Empty feed
4. Fetch error

### Behavior rules (`/services`)

- Show only published services.
- If user is authenticated USER, render favourite state.
- If unauthenticated, favourite action routes/prompts login.
- Booking action opens external URL in new tab when valid.

---

## Route: `/experts/[id]`

- Type: Public dynamic page
- Access: Everyone
- Goal: Evaluate a specific expert and services
- Primary actions: view services, open booking links
- Data dependencies: `profiles`, `expert_profiles`, `services`

### Required states (`/experts/[id]`)

1. Loading
2. Populated profile + services
3. Profile with empty services
4. Not found
5. Fetch error

### Behavior rules (`/experts/[id]`)

- Invalid or missing expert record -> not-found state.
- Services list only includes published services.

---

## Route: `/favourites`

- Type: Protected USER page
- Access: Authenticated USER role only
- Goal: Review and manage saved services
- Primary actions: view saved cards, unfavourite
- Data dependencies: `favorites` joined with `services`

### Required states (`/favourites`)

1. Auth-required redirect
2. Role-gate redirect/deny for EXPERT
3. Loading list
4. Populated list
5. Empty list
6. Fetch error

### Redirect rules (`/favourites`)

- Unauthenticated -> `/auth/login`
- Authenticated EXPERT -> `/expert/dashboard` (or explicit unauthorized page)

---

## Route: `/expert/dashboard`

- Type: Protected EXPERT page
- Access: Authenticated EXPERT role only
- Goal: Landing area for expert management flows
- Primary actions: navigate to profile editor/service manager (future pages)
- Data dependencies: `profiles.role`, optional expert summary read

### Required states (`/expert/dashboard`)

1. Auth-required redirect
2. Role-gate redirect/deny for USER
3. Loading
4. Ready/placeholder content
5. Fetch error fallback

### Notes (`/expert/dashboard`)

- Keep Week 1-2 dashboard intentionally thin to preserve scope.

---

## Shared Component State Requirements

### Service Card

1. Default view with title/price/expert/description
2. Favourite default/favourited/loading/error states
3. Book enabled/disabled states based on URL validity

### Auth Guard Wrapper

1. Checking session state
2. Redirecting
3. Unauthorized role fallback

### Data Fetch Boundary

1. Loading
2. Error with retry action
3. Empty where applicable

---

## Page Map Validation Checklist

1. Every story maps to at least one route and one explicit state model.
2. Every protected route has both auth and role gate behavior defined.
3. Empty/error/loading states exist for each data-dependent page.
4. Keyboard path and visible focus requirements are documented for interactive routes.
5. Route redirects do not create loops for any auth/role combination.
