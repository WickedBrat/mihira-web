-- Demand-test requests from getmihira.com (Oct–Dec 2026):
--   /lakshmi-puja  → offer = 'diwali_puja'  (pandit at home in NJ/NYC, or guided on video)
--   /gita          → offer = 'gita_18'      (18-day Gita course pre-order / free day 1)
-- One row per request. Payment itself happens on Stripe Payment Links; this table records intent
-- and the intake answers so the two can be matched by email afterwards.

create table if not exists public.demand_requests (
  id uuid primary key default gen_random_uuid(),
  offer text not null,
  option text,                     -- e.g. 'home' | 'video' | 'preorder' | 'free_day1'
  email text not null,
  full_name text,
  phone text,
  city text,
  slot text,                       -- puja: requested time slot
  answers jsonb,                   -- gita: intake answers; puja: language, notes
  source text not null default 'web',
  utm jsonb,                       -- utm_source/medium/campaign/term/content captured client-side
  referrer text,
  user_agent text,
  created_at timestamptz not null default now(),
  constraint demand_requests_offer_check check (offer in ('diwali_puja', 'gita_18')),
  constraint demand_requests_email_format_check
    check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

create index if not exists demand_requests_offer_created_idx
  on public.demand_requests (offer, created_at desc);

alter table public.demand_requests enable row level security;

comment on table public.demand_requests is
  'Landing-page demand-test requests (Diwali pandit booking, 18-day Gita course) from getmihira.com, Oct–Dec 2026.';
