# Supabase CLI Setup

This project now includes a repo-managed Supabase workflow:

- `supabase/migrations/` for schema migrations
- `supabase/seed.sql` for seed data
- npm scripts for linking, pushing migrations, and seeding

## Find your project ref

Use either of these:

1. **Supabase Dashboard URL**  
   Open your project. The URL looks like:  
   `https://supabase.com/dashboard/project/<project-ref>/...`

2. **Project settings**  
   `Project Settings -> General -> Reference ID`

It is also part of your API URL in `.env.local`:  
`https://<project-ref>.supabase.co`

## One-time setup

1. Login:

   `npx supabase login`

2. Link this repo to your remote project:

   `npm run supabase:link -- --project-ref <project-ref>`

## Apply schema to linked remote DB

Push all migrations:

`npm run db:push`

## Seed data

1. Ensure these Auth users exist (create only if missing):
   - `expert.alex@simplicity.local`
   - `expert.maya@simplicity.local`
   - `user.sophia@simplicity.local`

   Notes:
   - In the shared DEV project, these users already exist, so contributors usually do not need to create them again.
   - In a fresh/new project, create them first in Supabase Auth before running seed.

2. Run seed against the linked project:

   `npm run db:seed:linked`

## Local development DB (optional)

Use this when you want to test migrations/seed locally without touching the shared remote project.

Prerequisite: Docker Desktop must be running.

Start local stack:

`npm run supabase:start`

Reset local DB to migrations + seed:

`npm run db:reset`

This recreates the local DB, reapplies migrations, and reruns seed.
It is destructive for local data only (does not affect linked remote project).

When to add local Auth users:

1. Run `npm run db:reset` first.
2. Open local Supabase Studio (URL shown by `supabase:start`, usually `http://127.0.0.1:54323`).
3. Go to `Authentication -> Users` and create:
   - `expert.alex@simplicity.local`
   - `expert.maya@simplicity.local`
   - `user.sophia@simplicity.local`
4. Run `npm run db:seed:local` again.

Why this order:

- `db:reset` recreates the local database and clears local auth data.
- Creating users before `db:reset` would be wiped.

Stop local stack:

`npm run supabase:stop`
