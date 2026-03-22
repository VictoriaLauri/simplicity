/*
  SimpliCity MVP schema v1.1
  - Auth-backed profiles
  - Expert & User profiles
  - Services
  - Favorites
  Created: 2026-02-09
*/

-- 0) Extensions (usually already enabled)
create extension if not exists "uuid-ossp";

-- 1) Enums
do $$ begin
  create type public.user_role as enum ('USER', 'EXPERT');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.market_role as enum ('BUYER', 'RENTER', 'LANDLORD', 'SELLER', 'OTHER');
exception
  when duplicate_object then null;
end $$;

-- 2) Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role,
  display_name text,
  photo_url text,
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Expert profiles
create table if not exists public.expert_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  level text,
  area text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4) User profiles
create table if not exists public.user_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  market_role public.market_role,
  needs text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5) Services
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  expert_user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(10,2),
  currency text,
  price_label text,
  booking_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_currency_format_chk
    check (currency is null or currency ~ '^[A-Z]{3}$'),
  constraint services_booking_url_https_chk
    check (booking_url is null or booking_url ~* '^https://')
);

create index if not exists idx_services_expert_user_id on public.services(expert_user_id);
create index if not exists idx_services_published_created_at
  on public.services(is_published, created_at desc);

-- 6) Favorites (user -> service)
create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, service_id)
);

create index if not exists idx_favorites_service_id on public.favorites(service_id);
create index if not exists idx_favorites_user_created_at
  on public.favorites(user_id, created_at desc);

-- 7) updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_expert_profiles_updated_at on public.expert_profiles;
create trigger trg_expert_profiles_updated_at before update on public.expert_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at before update on public.services
for each row execute function public.set_updated_at();

-- 8) Create profile row automatically on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, null) -- role chosen during onboarding
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- 9) RLS
alter table public.profiles enable row level security;
alter table public.expert_profiles enable row level security;
alter table public.user_profiles enable row level security;
alter table public.services enable row level security;
alter table public.favorites enable row level security;

-- PROFILES POLICIES
-- Public can read profiles (needed for expert pages). If you want to hide user profiles later, we can tighten this.
drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
on public.profiles for select
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- EXPERT PROFILES POLICIES
drop policy if exists "expert_profiles_select_public" on public.expert_profiles;
create policy "expert_profiles_select_public"
on public.expert_profiles for select
using (true);

drop policy if exists "expert_profiles_upsert_own" on public.expert_profiles;
create policy "expert_profiles_upsert_own"
on public.expert_profiles for all
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'EXPERT'
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'EXPERT'
  )
);

-- USER PROFILES POLICIES (private by default: only owner can read/write)
drop policy if exists "user_profiles_owner_only" on public.user_profiles;
create policy "user_profiles_owner_only"
on public.user_profiles for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- SERVICES POLICIES
-- Everyone can read published services (public feed)
drop policy if exists "services_select_public" on public.services;
create policy "services_select_public"
on public.services for select
using (is_published = true);

-- Experts can also read their own services (including unpublished)
drop policy if exists "services_select_own" on public.services;
create policy "services_select_own"
on public.services for select
using (
  auth.uid() = expert_user_id
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'EXPERT'
  )
);

-- Experts can create/update/delete their own services
drop policy if exists "services_modify_own" on public.services;
create policy "services_modify_own"
on public.services for all
using (
  auth.uid() = expert_user_id
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'EXPERT'
  )
)
with check (
  auth.uid() = expert_user_id
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'EXPERT'
  )
);

-- FAVORITES POLICIES (owner USER only; target must be published)
drop policy if exists "favorites_owner_only" on public.favorites;
create policy "favorites_owner_only"
on public.favorites for all
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'USER'
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'USER'
  )
  and exists (
    select 1
    from public.services s
    where s.id = service_id
      and s.is_published = true
  )
);
