# MVP Page and State Map (Detailed)

## Scope and Purpose

- Scope for this map: auth, onboarding, discovery feed, expert profile, favourites, external booking handoff, and expert self-management (thin CRUD).
- Purpose: define route behavior and required UI states before implementation to reduce schema/UI drift.
- Each page below includes: access rule, primary actions, required states, and data dependencies.

## Global Routing Rules

1. Unauthenticated users can access public pages only.
2. Authenticated users with null `profiles.role` are forced to `/onboarding/role`.
3. USER and EXPERT role gates apply on role-specific pages.
4. Unknown route parameters return not-found state.
5. Unverified accounts cannot access protected app routes until verification is complete.

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
- Primary actions: Submit login form, navigate to signup, request password reset
- Data dependencies: auth provider + profile role read

### Required states (`/auth/login`)

1. Idle form
2. Submitting
3. Validation/auth error
4. Unverified-email guidance with resend action
5. Rate-limit/lockout guidance state
6. Success redirect

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
- Data dependencies: auth provider, profile bootstrap trigger, consent timestamp persistence

### Required states (`/auth/signup`)

1. Idle form
2. Submitting
3. Validation/signup error
4. Bot challenge/rate-limit response
5. Success state with verify-email next-step guidance

### Notes (`/auth/signup`)

- Require Terms/Privacy consent before submit.
- Keep copy explicit about next step: verify email, then role onboarding at first authenticated login.

---

## Route: `/auth/forgot-password`

- Type: Public auth recovery page
- Access: Everyone
- Goal: Start password recovery safely
- Primary actions: Submit email for recovery link
- Data dependencies: auth provider password reset request

### Required states (`/auth/forgot-password`)

1. Idle form
2. Submitting
3. Validation error
4. Non-enumerating success response (same message for known/unknown email)
5. Rate-limit/backoff response

---

## Route: `/auth/reset-password`

- Type: Public recovery completion page
- Access: Recovery-token context
- Goal: Set a new password after recovery link
- Primary actions: Enter and submit new password
- Data dependencies: auth provider recovery token + password update

### Required states (`/auth/reset-password`)

1. Loading/validating recovery token
2. Invalid/expired/used token state with request-new-link path
3. Password form
4. Submitting
5. Success redirect to login

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
- Query and render only public-safe fields.
- Use deterministic ordering and defined pagination/load-more behavior.
- If user is authenticated USER, render favourite state.
- If unauthenticated, favourite action routes/prompts login.
- Booking action opens external URL in new tab only when URL passes safe validation (`https` and safe scheme checks).
- External booking action must indicate external destination clearly.

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
- Query and render only public-safe expert and service fields.
- Expert services list uses deterministic ordering and defined pagination/load-more behavior.
- Partial expert metadata and broken media render stable fallbacks.

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
7. Unavailable service fallback state

### Redirect rules (`/favourites`)

- Unauthenticated -> `/auth/login`
- Authenticated EXPERT -> `/expert/dashboard` (or explicit unauthorized page)

### Behavior rules (`/favourites`)

- Render from server-authoritative owner-scoped dataset only.
- List ordering and pagination/load-more behavior are deterministic.
- Unpublished/deleted services referenced by favorites use explicit fallback behavior.
- Cross-tab/service changes reconcile predictably on refresh/revalidate.

---

## Route: `/expert/dashboard`

- Type: Protected EXPERT page
- Access: Authenticated EXPERT role only
- Goal: Landing area for expert management flows
- Primary actions: navigate to profile editor and services manager
- Data dependencies: `profiles.role`, optional expert summary read

### Required states (`/expert/dashboard`)

1. Auth-required redirect
2. Role-gate redirect/deny for USER
3. Loading
4. Ready/placeholder content
5. Fetch error fallback

### Notes (`/expert/dashboard`)

- Keep dashboard thin, but it must route to profile and service management flows defined below.

---

## Route: `/expert/profile`

- Type: Protected EXPERT page
- Access: Authenticated EXPERT role only
- Goal: Create/update expert public profile
- Primary actions: edit fields, save
- Data dependencies: `profiles`, `expert_profiles`

### Required states (`/expert/profile`)

1. Auth-required redirect
2. Role-gate redirect/deny for USER
3. Loading existing profile
4. Editable form
5. Saving
6. Save success
7. Save error with preserved inputs/retry

### Behavior rules (`/expert/profile`)

- Server-side owner authorization is required for all writes.
- Public output is limited to safe profile fields only.
- Missing optional fields and invalid media resolve to graceful fallbacks.

---

## Route: `/expert/services`

- Type: Protected EXPERT page
- Access: Authenticated EXPERT role only
- Goal: Manage own service listings (create/edit/unpublish/delete)
- Primary actions: create service, edit service, unpublish service, delete service
- Data dependencies: `services`

### Required states (`/expert/services`)

1. Auth-required redirect
2. Role-gate redirect/deny for USER
3. Loading list
4. Empty state
5. Populated list
6. Create/edit form with validation
7. Saving mutation
8. Mutation success/error with deterministic UI reconciliation
9. Delete confirmation state

### Behavior rules (`/expert/services`)

- All writes are server-authorized and owner-bound; forged identity attempts are rejected.
- Booking URL input must pass safe validation before save.
- Publish state controls public discovery visibility.
- Duplicate submit and repeated actions are handled idempotently where feasible.

---

## Shared Component State Requirements

### Service Card

1. Default view with title/price/expert/description
2. Favourite default/favourited/loading/error states
3. Book enabled/disabled states based on URL validity
4. External booking trust cue and safe-link behavior

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
