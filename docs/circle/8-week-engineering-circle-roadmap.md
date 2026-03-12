
# 8-Week Engineering Circle Roadmap

## MVP Alignment (Source of Truth)

- Lock scope to **Marketplace-lite**: auth, role onboarding, expert profile, service listing, favourites, and external booking link only.
- Lock delivery shape to **single seeded expert + seeded service first**, then optional expansion if capacity remains.
- Treat these docs as primary references:
  - [c:/dev/simplicity/README.md](c:/dev/simplicity/README.md)
  - [c:/dev/simplicity/docs/prd.md](c:/dev/simplicity/docs/prd.md)
  - [c:/dev/simplicity/docs/database/schema_v1.sql](c:/dev/simplicity/docs/database/schema_v1.sql)
- Defer/no-build: Stripe, on-platform payments, messaging, reviews, advanced search/filtering.

## Delivery Sequencing Rule (Team Default)

For all MVP work, sequence decisions and delivery in this order:

1. **User stories** (MVP journeys + acceptance criteria).
2. **Page map and states** (routes + loading/empty/error/auth states).
3. **Schema and RLS alignment** (field and policy validation against stories/pages).
4. **Ticketization** (small, single-concern issues with dependencies).
5. **Implementation** (PRs with test and accessibility evidence).

This rule is intentionally strict for Weeks 1-2 to prevent rework and schema/UI drift.

## Working Artifacts and Ownership

- **Product scope and behavior:** [c:/dev/simplicity/docs/prd.md](c:/dev/simplicity/docs/prd.md) (canonical source of truth).
- **Delivery planning and sequencing:** this roadmap file.
- **Implementation work items:** GitHub Issues and PRs linked back to PRD/roadmap sections.
- **Schema contract and security posture:** [c:/dev/simplicity/docs/database/schema_v1.sql](c:/dev/simplicity/docs/database/schema_v1.sql), to be validated against finalized user stories and page map in Week 1.


## Current State vs MVP (What Exists)

- App shell only (starter UI) in [c:/dev/simplicity/src/app/page.tsx](c:/dev/simplicity/src/app/page.tsx).
- Layout + metadata exists in [c:/dev/simplicity/src/app/layout.tsx](c:/dev/simplicity/src/app/layout.tsx).
- Supabase server client exists in [c:/dev/simplicity/src/lib/supabase/server.ts](c:/dev/simplicity/src/lib/supabase/server.ts).
- Health endpoint exists but is likely schema-misaligned (`healthcheck` table not in schema) in [c:/dev/simplicity/src/app/api/health/supabase/route.ts](c:/dev/simplicity/src/app/api/health/supabase/route.ts).
- DB model and RLS are being prepared in [c:/dev/simplicity/docs/database/schema_v1.sql](c:/dev/simplicity/docs/database/schema_v1.sql).

## Detailed 2-Week Plan (Immediate Focus)

### Week 1: Planning Artifacts + Unblockers

**Goal:** finish all planning artifacts needed for confident build execution and close setup blockers.

- **Day 1 (Story lock):**
  - Finalize 8-12 MVP user stories across auth/onboarding, discovery, expert profile, favourites, and expert self-management.
  - Add acceptance criteria and explicit out-of-scope checks per story.
- **Day 2 (Page map lock):**
  - Create route/page map for all MVP screens plus loading, empty, error, and unauthenticated states.
  - Confirm navigation expectations and redirects for both roles.
- **Day 3 (Schema alignment):**
  - Produce alignment matrix: story/page -> read/write action -> table/field -> RLS check -> gap.
  - Raise any schema/policy gaps as dedicated tickets.
- **Day 4 (Issue setup):**
  - Create and prioritize Week 1-2 issues with dependencies and acceptance criteria.
  - Ensure issue and PR templates include keyboard-path and accessibility checks.
- **Day 5 (Execution unblockers):**
  - Complete local setup/env contract issue.
  - Complete health endpoint/schema mismatch fix.
  - Confirm Week 1 milestone closure and Week 2 kickoff scope.

#### Week 1 Exit Criteria

- Story set approved.
- Page map approved.
- Schema alignment matrix completed with tracked gaps.
- Issue backlog for Week 2 ready.
- Setup/env and health endpoint blockers closed.

### Week 2: Foundation Implementation

**Goal:** deliver a stable auth and onboarding base aligned to agreed stories/pages.

- **Day 1-2 (Auth skeleton):**
  - Implement sign up, login, logout, and baseline protected route behavior.
  - Validate unauthenticated redirects against page map decisions.
- **Day 3 (Role onboarding baseline):**
  - Capture and persist role selection in profile data.
  - Enforce onboarding gate before protected app areas.
- **Day 4 (Navigation and states validation):**
  - Verify route behavior, state transitions, and error/empty fallbacks for changed flows.
  - Confirm no deviations from Week 1 story and page definitions.
- **Day 5 (Quality gate and review checkpoint):**
  - Add test evidence for changed behavior, including at least one keyboard-path check.
  - Conduct review checkpoint and update Weeks 3-4 scope based on blockers and capacity.

#### Week 2 Exit Criteria

- Auth skeleton merged.
- Onboarding baseline merged.
- Route guard behavior verified.
- Accessibility and keyboard evidence recorded in PRs.
- Weeks 3-4 draft scope adjusted using Week 2 outcomes.

## Issue Order (Prioritized Backlog)

1. **Issue 0: Scope lock + contribution workflow** (Week 1)
   - Add decision record: marketplace-lite + single-seeded scope + out-of-scope list.
   - Add issue/PR templates with acceptance criteria, a11y checks, and test evidence sections.
2. **Issue 1: Local setup + env contract** (Week 1)
   - Define required env vars and server/client key boundaries.
   - Update onboarding instructions for juniors/reviewers.
3. **Issue 2: Fix health endpoint/schema mismatch** (Week 1)
   - Replace `healthcheck` query with schema-valid check (e.g., `profiles` select limit 1).
   - Add clear error response shape for diagnostics.
4. **Issue 3: User stories baseline pack** (Week 1)
   - Publish final MVP stories with acceptance criteria and out-of-scope references.
5. **Issue 4: Page map + state map baseline pack** (Week 1)
   - Publish route map and state coverage (loading/empty/error/auth) for MVP pages.
6. **Issue 5: Schema and RLS alignment matrix** (Week 1)
   - Map stories/pages to tables/fields/policies and create gap tickets.
7. **Issue 6: Auth skeleton (Supabase Auth)** (Week 2)
   - Sign up, login, logout, and protected routes.
   - Acceptance criteria include unauthenticated redirect behavior.
8. **Issue 7: Role onboarding flow** (Week 2)
   - Capture role and write to `profiles.role`.
   - Gate app areas until onboarding is complete.
9. **Issue 8: Week 2 quality gate checks** (Week 2)
   - Add baseline behavior tests for changed flows and one keyboard-path test.
   - Ensure PR evidence includes accessibility and route guard checks.
10. **Issue 9: Seeded expert + seeded service rendering** (Week 3 target)
    - Implement feed page and service card from seeded data.
11. **Issue 10: Expert profile page** (Week 3-4 target)
    - Public expert page with profile + listed service(s).
12. **Issue 11: Favorites toggle + favorites page** (Week 4 target)
    - User can save/unsave seeded service and view saved list.
13. **Issue 12: Expert self-management (thin CRUD)** (Week 5 target)
    - Expert edit profile and create/delete own services (minimal UI).
14. **Issue 13: Accessibility hardening pass** (Week 7 target)
    - Keyboard path checks, visible focus states, semantic labels/landmarks, reduced motion support.
15. **Issue 14: Test baseline + CI checks** (Week 7 target)
    - CI: lint, type-check, build, tests as required status checks.
16. **Issue 15: Release prep + demo script** (Week 8 target)
    - Final smoke checklist, docs updates, and short demo flow.

## 8-Week Cadence (2 juniors, 2-3h/week each)

- **Week 1 (detailed):** planning artifacts + setup/env + health endpoint fix.
- **Week 2 (detailed):** auth skeleton + onboarding baseline + quality gate checkpoint.
- **Week 3 (provisional):** seeded discovery implementation and first integration checks.
- **Week 4 (provisional):** expert profile + favourites user journey completion.
- **Week 5:** expert thin CRUD.
- **Week 6:** stabilization or spillover from Week 5.
- **Week 7:** accessibility hardening + CI test gates.
- **Week 8:** release prep, demo, and docs finalization.

### Week 3-4 Update Checkpoint

At the end of Week 2, update this roadmap with:

- confirmed Week 3 scope,
- confirmed Week 4 scope,
- deferred items and reasons,
- dependency or reviewer bottlenecks discovered in Week 2.

## Team Operating Model

- **PR sizing:** 1 PR per junior per week, target 100-250 LOC net change, single concern per PR.
- **Review SLA:** seniors review within 5 days; juniors respond within 48h.
- **Rotation:** assign one on-call reviewer each week from the 4 seniors; others as backup.
- **Architecture challenge slot:** 15 minutes of each 30-minute senior block for one design question from juniors.
- **Definition of Done for every issue:** feature works, keyboard path tested, basic error/empty state, docs note updated.
- **Founder control mechanism:** maintain a locked weekly scope board (Now/Next/Later); no mid-week scope additions unless blocker.

## GitHub Project Structure

- Labels: `type:feature`, `type:bug`, `type:tech-debt`, `a11y`, `blocked`, `good-first-junior`, `needs-senior-decision`.
- Milestones: `Week-1` to `Week-8`.
- Issue template sections: Context, Scope, Acceptance Criteria, A11y checks, Test evidence, Dependencies.
- PR template sections: What/Why, Screenshots, Keyboard test notes, Risks, Reviewer prompts.

## Risk Controls

- Biggest risk is scope expansion; mitigate with strict out-of-scope and seeded-first approach.
- Biggest technical risk is auth/RLS misuse; mitigate with explicit key-usage rules and early review on auth-related PRs.
- Biggest collaboration risk is reviewer bottleneck; mitigate via reviewer rotation and one pre-scheduled fallback reviewer.
