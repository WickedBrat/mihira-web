-- Migration: user_ask_queries
-- Stores every Guidance-tab query per user in a single row, logged server-side from /api/ask.

create table if not exists user_ask_queries (
  user_id    text        primary key,
  queries    jsonb       not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- RLS: each user can only read and write their own row.
-- Supabase Auth stores the user ID in the 'sub' claim.
-- (The server writes with a service-role client that bypasses this, but it stays in
-- place as defense-in-depth for any future direct client access.)
alter table user_ask_queries enable row level security;

create policy "Users manage own ask queries"
  on user_ask_queries
  for all
  using  (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_ask_queries_shape_check'
  ) then
    alter table user_ask_queries
      add constraint user_ask_queries_shape_check
      check (jsonb_typeof(queries) = 'array');
  end if;
end $$;
