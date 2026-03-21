# MVP User Stories Pack (Detailed)

## Scope and Usage

- Scope for this pack: auth, onboarding, discovery, expert profile, favourites, external booking link, and expert self-management (thin CRUD).
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
- Data touchpoints: `auth.users`, `profiles(id, role, terms_accepted_at, privacy_accepted_at)`
- RLS checks: profile row creation should map to `auth.uid()`

### Acceptance criteria (US-01)

1. Valid email/password submission creates a new account.
2. Duplicate or invalid credentials show a user-safe error message.
3. Registration requires email verification before protected app routes are accessible.
4. Password must meet policy requirements (minimum length/complexity and common-password rejection).
5. Signup endpoint is protected against abuse (rate limiting and bot challenge/CAPTCHA).
6. User must accept Terms and Privacy Policy; acceptance timestamps are stored.
7. Verified user is redirected to role onboarding when `profiles.role` is null.
8. Form can be completed using keyboard only with visible focus.

### Edge/error cases (US-01)

- Auth provider timeout returns retry guidance.
- Unexpected server error returns generic fallback without leaking internals.
- Unverified email attempting login/access is shown clear verify/resend guidance.
- Rate-limit or bot challenge failure returns safe, actionable retry messaging.

### Test notes (US-01)

- Unit/integration: successful submit, invalid email, duplicate account, weak password rejection.
- Integration: unverified user blocked from protected routes until email verification completes.
- Integration: consent required and acceptance timestamps persisted.
- Integration: rate-limit/CAPTCHA failure paths show non-technical recovery messaging.
- Keyboard path: tab through fields/buttons, submit via Enter, focus remains visible.

---

## US-02 - Login and Logout

- Story: As a returning user, I want to log in and log out so my account access is secure.
- Priority: P0
- Dependencies: US-01
- Data touchpoints: auth session, password reset flow, `profiles.role`
- RLS checks: protected routes deny unauthenticated access

### Acceptance criteria (US-02)

1. Valid credentials log user in and establish session.
2. Invalid credentials show clear non-technical error.
3. Unverified email login attempt is blocked with clear verify/resend guidance.
4. Login endpoint applies abuse protections (rate limiting and temporary lockout/backoff after repeated failures).
5. "Forgot password" entry point is visible and keyboard accessible from login.
6. Password reset request sends a recovery email and returns non-enumerating response messaging.
7. Recovery link allows setting a new valid password and invalidates prior reset token/session as applicable.
8. Logout clears session and routes user to public/auth entry.
9. Protected pages redirect to login when no valid session exists.
10. Login form, forgot-password flow, and logout control are keyboard operable.

### Edge/error cases (US-02)

- Expired session on protected route triggers deterministic redirect.
- Multiple tab behavior does not leave stale auth-only pages accessible.
- Repeated failed login attempts trigger rate-limit/lockout messaging without leaking account existence.
- Password reset request for unknown email returns same safe response as known email.
- Expired or already-used recovery link shows recoverable error and allows requesting a new link.

### Test notes (US-02)

- Integration: login success/failure; unverified email blocked with verify guidance.
- Integration: repeated failed logins trigger configured rate-limit/lockout behavior.
- Integration: forgot-password request returns non-enumerating response for known/unknown emails.
- Integration: reset via valid recovery link updates password and invalidates old token/session.
- Integration: logout redirect.
- Route guard test: unauthenticated user cannot access protected route.

---

## US-03 - First-Time Role Selection

- Story: As a newly registered and authenticated user on first login, I want to choose USER or EXPERT so the app routes me to the right experience.
- Priority: P0
- Dependencies: US-01, US-02
- Data touchpoints: `profiles(role)`
- RLS checks: only owner can update own profile role

### Product reasoning (US-03)

- Role selection is intentionally post-registration to keep signup low-friction and completion rates higher.
- Registration verifies account ownership; role selection controls in-app authorization and can evolve with additional checks.
- This separation supports future expert/payment verification gates without blocking basic account creation.

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
5. Feed uses deterministic ordering with defined pagination/load-more behavior.
6. Only public-safe fields are queried/rendered (no private profile or internal-only data exposure).
7. Price labels use consistent currency formatting with safe fallback when data is missing/invalid.
8. Card actions are keyboard focusable in logical order with clear accessible names.

### Edge/error cases (US-04)

- No published services shows meaningful empty state.
- Fetch failure shows retry/back navigation option.
- Service unpublished/deleted between render and interaction resolves to safe unavailable/not-found behavior.
- Missing/broken service or expert media falls back gracefully without layout breakage.

### Test notes (US-04)

- Integration: populated list and empty list rendering.
- Integration: default ordering and pagination behavior are stable/predictable.
- Integration: only published services and public-safe fields are returned/rendered.
- Integration: unavailable service interaction path shows graceful fallback.
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
4. Only public-safe expert fields and published services are queried/rendered.
5. Expert services list uses deterministic ordering with defined pagination/load-more behavior.
6. Not-found and fetch-error states are handled.
7. Heading hierarchy, image alt behavior, and link semantics are correct.

### Edge/error cases (US-05)

- Expert exists but has no published services shows empty services section.
- Invalid expert identifier renders not-found state.
- Expert has partial metadata (missing bio/area/level/photo) renders stable fallbacks without layout breakage.
- Expert service becomes unavailable between render and interaction resolves to safe unavailable/not-found behavior.
- Broken expert/service media falls back gracefully.

### Test notes (US-05)

- Integration: card -> profile navigation.
- Rendering: profile with services, profile with empty services.
- Integration: only public-safe expert fields and published services are returned/rendered.
- Integration: expert services ordering and pagination behavior are stable/predictable.
- Rendering: profile with partial metadata and media fallback behavior.

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
4. EXPERT role cannot use favorites action and server-side authorization rejects direct mutation attempts.
5. Favorites mutations are owner-bound (`favorites.user_id = auth.uid()`) and cannot target other users.
6. Favorite target must be a valid published service; invalid/unpublished targets fail safely.
7. Toggle behavior is idempotent under rapid repeat actions and concurrent tabs/devices.
8. Toggle control has accessible name and state feedback.

### Edge/error cases (US-06)

- Duplicate favorite insert prevented by composite key and handled gracefully.
- Toggle write failure reverts optimistic UI safely.
- Repeated rapid toggles trigger rate-limit/backoff handling with safe retry messaging.
- Mutation attempts with mismatched `user_id` are blocked by RLS without data leakage.
- Unknown/unpublished service target returns generic safe error state.

### Test notes (US-06)

- Integration: create/delete favorite with authenticated USER.
- Access test: unauthorized favorite mutation blocked by RLS.
- Access test: authenticated EXPERT mutation attempts are rejected server-side.
- Integration: toggling unknown/unpublished service fails safely.
- Integration: rapid repeated toggles remain idempotent and UI reconciles to server truth.

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
5. List is rendered from server-authoritative owner-scoped data (not client-side filtering only).
6. Favourites list uses deterministic ordering with defined pagination/load-more behavior.
7. Unavailable/unpublished services referenced by favorites are handled with explicit fallback behavior.
8. Page supports keyboard navigation through saved cards/actions with clear accessible action names.

### Edge/error cases (US-07)

- Saved service removed by expert appears as cleaned-up list on reload.
- Data fetch failure shows error state with retry option.
- Favorite removed in another tab/device reconciles predictably on revalidate/refresh.
- Fetch/mutation failures return generic safe messaging without exposing internals.

### Test notes (US-07)

- Integration: favorites page with data and without data.
- Guard test: unauthenticated request redirected.
- Access test: page never renders another user's favorites data.
- Integration: unavailable/unpublished favorited services follow defined fallback behavior.
- Integration: ordering and pagination behavior are stable/predictable.
- Accessibility: keyboard remove action and accessible naming/state are validated.

---

## US-08 - External Booking Link

- Story: As a user, I want to open an expert's external booking link so I can schedule a session.
- Priority: P1
- Dependencies: US-04
- Data touchpoints: `services.booking_url`
- RLS checks: relies on public service read; no write needed

### Acceptance criteria (US-08)

1. Book action opens `booking_url` in a new tab/window.
2. Booking URL must pass safe validation (`https` only; unsafe schemes are blocked).
3. External link uses safe navigation attributes (`noopener`, `noreferrer`) and clearly indicates external navigation.
4. Destination trust cue is shown (e.g., destination domain label or equivalent clear copy).
5. Missing, invalid, or blocked URL shows disabled state or safe fallback message.
6. Action is keyboard accessible and visible on focus.
7. No in-app booking/payment state is persisted for MVP.

### Edge/error cases (US-08)

- Malformed URL does not break page rendering.
- Browser popup blockers do not cause silent failure messaging.
- Unsafe URL schemes (`javascript:`, `data:`, malformed protocol) are rejected safely.
- Destination becomes unreachable after click is handled outside app scope, but in-app copy remains explicit about external handoff.

### Test notes (US-08)

- UI test: valid URL opens external target.
- UI test: invalid/missing URL behavior is graceful.
- Security test: unsafe schemes and malformed URLs are blocked and never executed.
- UI test: external link includes safe navigation attributes and external indicator copy.
- Accessibility test: book action and disabled fallback are keyboard operable with clear accessible names.

---

## US-09 - Expert Profile Completion and Edit

- Story: As an EXPERT, I want to complete and update my public profile so users can evaluate my services.
- Priority: P1
- Dependencies: US-02, US-03
- Data touchpoints: `profiles`, `expert_profiles`
- RLS checks: only owner EXPERT can create/update own expert profile; public read limited to safe fields

### Acceptance criteria (US-09)

1. EXPERT can create or update own profile fields (display name, bio, area, level, photo).
2. Owner-only server-side authorization is enforced for all profile writes.
3. Public profile output includes only safe fields intended for discovery.
4. Missing optional fields render graceful defaults without broken layout.
5. Save actions provide clear success/error feedback and preserve entered data on recoverable failures.
6. Form is keyboard operable with visible focus, clear labels, and actionable validation messages.

### Edge/error cases (US-09)

- USER role or unauthenticated actor cannot access expert profile edit route.
- Write attempts targeting another expert profile are blocked by RLS.
- Invalid image URL or unsupported media fails safely with fallback.
- Concurrent edits reconcile deterministically (last-write policy or explicit conflict handling).

### Test notes (US-09)

- Integration: EXPERT can create/update own profile and see persisted result.
- Access test: USER/unauthenticated/other-user write attempts are rejected server-side.
- Rendering: partial profile data shows stable fallback content.
- Accessibility: keyboard path and validation messaging for profile form.

---

## US-10 - Expert Service Creation

- Story: As an EXPERT, I want to create a service listing so users can discover and book me externally.
- Priority: P1
- Dependencies: US-09
- Data touchpoints: `services(expert_id, title, description, price, currency, booking_url, is_published)`
- RLS checks: only owner EXPERT can create service rows bound to own identity

### Acceptance criteria (US-10)

1. EXPERT can create a service with required fields (title, description, price, currency, booking URL).
2. Service write is server-authorized and bound to owner identity (no client-controlled expert impersonation).
3. Booking URL passes safe validation (`https` only; unsafe schemes rejected).
4. Service defaults to explicit publish state per product rule and appears in discovery only when published.
5. Form shows clear field-level validation, preserves inputs on recoverable failures, and is keyboard operable.

### Edge/error cases (US-10)

- Invalid price/currency/URL fails with non-technical corrective feedback.
- Attempt to create service with forged `expert_id` is blocked by RLS/server checks.
- Duplicate submit (double-click/retry) is handled idempotently without duplicate rows.

### Test notes (US-10)

- Integration: EXPERT creates valid service and sees persisted record.
- Access test: non-EXPERT and forged-identity attempts are rejected.
- Security test: unsafe booking URL schemes are blocked.
- Accessibility: keyboard-only create flow with visible focus and clear errors.

---

## US-11 - Expert Service Update, Unpublish, and Delete

- Story: As an EXPERT, I want to edit, unpublish, or delete my own services so my listings stay accurate and safe.
- Priority: P1
- Dependencies: US-10
- Data touchpoints: `services`
- RLS checks: only owner EXPERT can update/delete own services; public read limited to published rows

### Acceptance criteria (US-11)

1. EXPERT can update editable fields of own service and persist changes.
2. EXPERT can unpublish own service so it is removed from public discovery.
3. EXPERT can delete own service with explicit confirmation UX.
4. All update/delete actions are owner-authorized server-side and reject cross-tenant attempts.
5. Post-mutation UI state is deterministic and accessible (success/error feedback, focus management).

### Edge/error cases (US-11)

- Attempt to update/delete another expert's service is blocked by RLS.
- Service already unpublished/deleted results in idempotent safe outcome.
- In-flight conflict or network failure preserves user context and provides retry guidance.

### Test notes (US-11)

- Integration: edit, unpublish, and delete own service paths succeed.
- Access test: cross-owner mutations are rejected server-side.
- Integration: unpublished service no longer appears in discovery/profile public listings.
- Accessibility: confirmation and post-action focus behavior are keyboard validated.

---

## Definition of Done for This Story Pack

1. Story has linked page/state coverage.
2. Data touchpoints and RLS checks are identified.
3. Acceptance criteria are testable and unambiguous.
4. At least one keyboard-path validation exists per implemented story.
5. Out-of-scope is explicitly referenced in issue and PR.
