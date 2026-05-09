-- Create one details row per auth user for profile, usage, subscription, and onboarding state.

create table if not exists public.user_details (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  birth_dt text,
  birth_place text,
  language text not null default 'English',
  region text not null default 'India',
  focus_area text,
  muhurat_count integer not null default 0,
  ask_count integer not null default 0,
  period_start timestamptz not null default now(),
  period_end timestamptz not null default (now() + interval '30 days'),
  subscription_plan text not null default 'free',
  subscription_status text not null default 'inactive',
  subscription_source text,
  subscription_updated_at timestamptz,
  onboarding_completed boolean not null default false,
  onboarding_step text,
  onboarding_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_details_subscription_plan_check
    check (subscription_plan in ('free', 'plus')),
  constraint user_details_subscription_status_check
    check (subscription_status in ('inactive', 'active'))
);

insert into public.user_details (
  user_id,
  name,
  onboarding_completed,
  updated_at
)
select
  id,
  coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name'),
  false,
  now()
from auth.users
on conflict (user_id) do nothing;

alter table public.user_details enable row level security;

drop policy if exists "Users manage own details" on public.user_details;
create policy "Users manage own details"
  on public.user_details
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create or replace function public.handle_new_user_details()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $handle_new_user_details$
begin
  insert into public.user_details (
    user_id,
    name,
    onboarding_completed,
    updated_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    false,
    now()
  )
  on conflict (user_id) do nothing;

  return new;
end;
$handle_new_user_details$;

drop trigger if exists on_auth_user_created_user_details on auth.users;
create trigger on_auth_user_created_user_details
  after insert on auth.users
  for each row execute function public.handle_new_user_details();

create or replace function public.delete_current_user()
returns void
language plpgsql
security definer
set search_path = public, auth
as $delete_current_user_user_details$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'not authenticated';
  end if;

  if to_regclass('public.user_narad_context') is not null then
    delete from public.user_narad_context where user_id = current_user_id::text;
  end if;

  delete from auth.users where id = current_user_id;
end;
$delete_current_user_user_details$;

revoke all on function public.delete_current_user() from public;
grant execute on function public.delete_current_user() to authenticated;

drop table if exists public.user_usage;
drop table if exists public.profiles;
