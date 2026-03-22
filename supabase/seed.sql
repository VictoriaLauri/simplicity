-- SimpliCity MVP seed
-- IMPORTANT:
-- 1) Create these users first in Supabase Auth (Dashboard > Authentication > Users):
--    - expert.alex@simplicity.local
--    - expert.maya@simplicity.local
--    - user.sophia@simplicity.local
-- 2) Then run this file. It is idempotent.

-- 1) Ensure public profile rows + roles exist for known auth users.
insert into public.profiles (id, role, display_name)
select
  u.id,
  case
    when u.email like 'expert.%' then 'EXPERT'::public.user_role
    else 'USER'::public.user_role
  end as role,
  case
    when u.email = 'expert.alex@simplicity.local' then 'Alex Carter'
    when u.email = 'expert.maya@simplicity.local' then 'Maya Rose'
    when u.email = 'user.sophia@simplicity.local' then 'Sophia Brown'
    else split_part(u.email, '@', 1)
  end as display_name
from auth.users u
where u.email in (
  'expert.alex@simplicity.local',
  'expert.maya@simplicity.local',
  'user.sophia@simplicity.local'
)
on conflict (id) do update
set
  role = excluded.role,
  display_name = excluded.display_name;

-- 2) Expert profile metadata.
insert into public.expert_profiles (user_id, level, area, bio)
select
  u.id,
  case
    when u.email = 'expert.alex@simplicity.local' then 'Senior'
    when u.email = 'expert.maya@simplicity.local' then 'Associate'
  end as level,
  case
    when u.email = 'expert.alex@simplicity.local' then 'London'
    when u.email = 'expert.maya@simplicity.local' then 'Manchester'
  end as area,
  case
    when u.email = 'expert.alex@simplicity.local' then 'Sales agent focused on first-time buyers.'
    when u.email = 'expert.maya@simplicity.local' then 'Helps renters transition into ownership.'
  end as bio
from auth.users u
where u.email in ('expert.alex@simplicity.local', 'expert.maya@simplicity.local')
on conflict (user_id) do update
set
  level = excluded.level,
  area = excluded.area,
  bio = excluded.bio;

-- 3) Services for seeded experts.
insert into public.services (
  expert_user_id,
  title,
  description,
  price,
  currency,
  price_label,
  booking_url,
  is_published
)
select
  u.id as expert_user_id,
  s.title,
  s.description,
  s.price,
  s.currency,
  s.price_label,
  s.booking_url,
  true as is_published
from auth.users u
join (
  values
    (
      'expert.alex@simplicity.local'::text,
      'First-time Buyer Call'::text,
      '30-minute strategy call.'::text,
      75.00::numeric(10,2),
      'GBP'::text,
      'GBP 75'::text,
      'https://calendly.com/example/alex-30'::text
    ),
    (
      'expert.maya@simplicity.local'::text,
      'Rent vs Buy Review'::text,
      'Personalized affordability check.'::text,
      49.00::numeric(10,2),
      'GBP'::text,
      'GBP 49'::text,
      'https://calendly.com/example/maya-review'::text
    )
) as s(email, title, description, price, currency, price_label, booking_url)
  on s.email = u.email
where not exists (
  select 1
  from public.services existing
  where existing.expert_user_id = u.id
    and existing.title = s.title
);
