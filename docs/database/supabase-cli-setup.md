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

1. In Supabase Dashboard, create these users in Auth first:
   - `expert.alex@simplicity.local`
   - `expert.maya@simplicity.local`
   - `user.sophia@simplicity.local`

2. Run seed against the linked project:

   `npm run db:seed:linked`

## Local development DB (optional)

Start local stack:

`npm run supabase:start`

Reset local DB to migrations + seed:

`npm run db:reset`

Stop local stack:

`npm run supabase:stop`
