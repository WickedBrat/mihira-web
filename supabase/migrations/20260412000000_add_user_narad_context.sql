-- Migration: user_narad_context
-- Stores per-user Narad companion state, synced from client AsyncStorage.

create table if not exists user_narad_context (
  user_id           text        primary key,
  last_deity        text        check (last_deity in ('Krishna', 'Shiva', 'Lakshmi', 'Ram')),
  last_theme        text,
  interaction_count integer     not null default 0,
  updated_at        timestamptz not null default now()
);

-- RLS: each user can only read and write their own row.
-- Clerk JWT stores the user ID in the 'sub' claim.
alter table user_narad_context enable row level security;

create policy "Users manage own narad context"
  on user_narad_context
  for all
  using  (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));
