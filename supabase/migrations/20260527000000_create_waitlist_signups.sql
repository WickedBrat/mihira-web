-- Stores web waitlist signups submitted from the Mihira landing page.

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  platform text not null default 'both',
  source text not null default 'landing_page',
  intent text,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint waitlist_signups_email_format_check
    check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  constraint waitlist_signups_platform_check
    check (platform in ('ios', 'android', 'both'))
);

create unique index if not exists waitlist_signups_email_key
  on public.waitlist_signups (email);

alter table public.waitlist_signups enable row level security;

comment on table public.waitlist_signups is
  'Landing-page waitlist signups for Mihira private beta and launch access.';
