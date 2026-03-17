# MVP User Stories Pack (Detailed)

## Scope and Usage

- Scope for this pack: auth, onboarding, discovery, expert profile, favourites, external booking link.
- Use this as the source for issue creation and acceptance testing during Weeks 1-2.
- Out of scope remains: payments, in-app booking, messaging, reviews, advanced search/filtering.

## Story Template Legend

- Priority: P0 (must-have), P1 (important), P2 (nice-to-have)
- Dependencies: other stories or setup assumptions
- Data touchpoints: tables/fields required for the story
- RLS checks: policy expectations to verify while implementing

---

## US-01 - Account Registration

- Story: As a new visitor, I want to register with email/password so I can access the product.
- Priority: P0
- Dependencies: environment setup, Supabase auth configured
- Data touchpoints: `auth.users`, `profiles(id, role)`
- RLS checks: profile row creation should map to `auth.uid()`

### Acceptance criteria (US-01)

1. Valid email/password submission creates a new account.
2. Duplicate or invalid credentials show a user-safe error message.
3. Post-registration flow leads to authenticated state.
4. User is redirected to role onboarding when `profiles.role` is null.
5. Form can be completed using keyboard only with visible focus.

### Edge/error cases (US-01)

- Auth provider timeout returns retry guidance.
- Unexpected server error returns generic fallback without leaking internals.

### Test notes (US-01)

- Unit/integration: successful submit, invalid email, duplicate account.
- Keyboard path: tab through fields/buttons, submit via Enter, focus remains visible.

---

## US-02 - Login and Logout

- Story: As a returning user, I want to log in and log out so my account access is secure.
- Priority: P0
- Dependencies: US-01
- Data touchpoints: auth session, `profiles.role`
- RLS checks: protected routes deny unauthenticated access

### Acceptance criteria (US-02)

1. Valid credentials log user in and establish session.
2. Invalid credentials show clear non-technical error.
3. Logout clears session and routes user to public/auth entry.
4. Protected pages redirect to login when no valid session exists.
5. Login form and logout control are keyboard operable.

### Edge/error cases (US-02)

- Expired session on protected route triggers deterministic redirect.
- Multiple tab behavior does not leave stale auth-only pages accessible.

### Test notes (US-02)

- Integration: login success/failure; logout redirect.
- Route guard test: unauthenticated user cannot access protected route.

---

## US-03 - First-Time Role Selection

- Story: As a newly registered user, I want to choose USER or EXPERT so the app routes me to the right experience.
- Priority: P0
- Dependencies: US-01, US-02
- Data touchpoints: `profiles(role)`
- RLS checks: only owner can update own profile role

### Acceptance criteria (US-03)

1. First login with null role forces redirect to onboarding role page.
2. Role choice persists to `profiles.role`.
3. USER role redirects to user-facing discovery/favourites flow.
4. EXPERT role redirects to expert dashboard area.
5. Direct URL access cannot bypass onboarding requirement.

### Edge/error cases (US-03)

- Save failure on role selection leaves user on onboarding with recoverable error.
- Re-submitting same role is idempotent.

### Test notes (US-03)

- Integration: null role -> onboarding redirect.
- Role write test: profile updated for current `auth.uid()` only.

---

## US-04 - Public Service Discovery Feed (Seeded)

- Story: As a visitor or logged-in user, I want to browse available services so I can discover expert offers.
- Priority: P0
- Dependencies: seed data available
- Data touchpoints: `services`, `profiles`, `expert_profiles`
- RLS checks: public read only for published services

### Acceptance criteria (US-04)

1. Feed renders published services as cards.
2. Card includes title, price label, short description, expert name.
3. Loading, empty, and error states are explicitly handled.
4. Page is accessible without authentication.
5. Card actions are keyboard focusable in logical order.

### Edge/error cases (US-04)

- No published services shows meaningful empty state.
- Fetch failure shows retry/back navigation option.

### Test notes (US-04)

- Integration: populated list and empty list rendering.
- Accessibility: landmarks/headings and visible focus on card actions.

---

## US-05 - Public Expert Profile View

- Story: As a user, I want to open an expert profile from a service card so I can evaluate the provider.
- Priority: P0
- Dependencies: US-04
- Data touchpoints: `profiles`, `expert_profiles`, `services`
- RLS checks: public read for expert profile and published services only

### Acceptance criteria (US-05)

1. Expert name click from service card opens expert profile page.
2. Profile page displays expert metadata (name/photo/level/area/bio where available).
3. Profile page lists that expert's published services.
4. Not-found and fetch-error states are handled.
5. Heading hierarchy and link semantics are correct.

### Edge/error cases (US-05)

- Expert exists but has no published services shows empty services section.
- Invalid expert identifier renders not-found state.

### Test notes (US-05)

- Integration: card -> profile navigation.
- Rendering: profile with services, profile with empty services.

---

## US-06 - Favourite Toggle (Authenticated USER)

- Story: As a logged-in USER, I want to favourite/unfavourite services so I can shortlist them.
- Priority: P1
- Dependencies: US-02, US-03, US-04
- Data touchpoints: `favorites(user_id, service_id)`
- RLS checks: owner-only read/write on favorites

### Acceptance criteria (US-06)

1. USER role can toggle favourite state on a service card.
2. Toggle persists in database and reflects after refresh.
3. Unauthenticated users are prompted to log in before favorite action.
4. EXPERT role cannot use favorites action (hidden or disabled by product rule).
5. Toggle control has accessible name and state feedback.

### Edge/error cases (US-06)

- Duplicate favorite insert prevented by composite key and handled gracefully.
- Toggle write failure reverts optimistic UI safely.

### Test notes (US-06)

- Integration: create/delete favorite with authenticated USER.
- Access test: unauthorized favorite mutation blocked by RLS.

---

## US-07 - Favourites Page (Authenticated USER)

- Story: As a logged-in USER, I want to view my favourites page so I can revisit saved services.
- Priority: P1
- Dependencies: US-06
- Data touchpoints: `favorites` join `services`
- RLS checks: user sees only rows where `favorites.user_id = auth.uid()`

### Acceptance criteria (US-07)

1. Favourites page lists current user's saved services only.
2. Empty state appears when there are no favourites.
3. Removing a favourite updates page state predictably.
4. Unauthenticated access redirects to login.
5. Page supports keyboard navigation through saved cards/actions.

### Edge/error cases (US-07)

- Saved service removed by expert appears as cleaned-up list on reload.
- Data fetch failure shows error state with retry option.

### Test notes (US-07)

- Integration: favorites page with data and without data.
- Guard test: unauthenticated request redirected.

---

## US-08 - External Booking Link

- Story: As a user, I want to open an expert's external booking link so I can schedule a session.
- Priority: P1
- Dependencies: US-04
- Data touchpoints: `services.booking_url`
- RLS checks: relies on public service read; no write needed

### Acceptance criteria (US-08)

1. Book action opens `booking_url` in a new tab/window.
2. Missing or invalid URL shows disabled state or safe fallback message.
3. Link text clearly indicates external navigation.
4. Action is keyboard accessible and visible on focus.
5. No in-app booking state is persisted for MVP.

### Edge/error cases (US-08)

- Malformed URL does not break page rendering.
- Browser popup blockers do not cause silent failure messaging.

### Test notes (US-08)

- UI test: valid URL opens external target.
- UI test: invalid/missing URL behavior is graceful.

---

## Definition of Done for This Story Pack

1. Story has linked page/state coverage.
2. Data touchpoints and RLS checks are identified.
3. Acceptance criteria are testable and unambiguous.
4. At least one keyboard-path validation exists per implemented story.
5. Out-of-scope is explicitly referenced in issue and PR.
