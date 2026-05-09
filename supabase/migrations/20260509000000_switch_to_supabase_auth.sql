-- Switch client-owned rows from the old third-party JWT bridge to Supabase Auth.

do $switch_to_supabase_auth$
begin
  if to_regclass('public.profiles') is not null then
    execute 'alter table public.profiles enable row level security';
    execute 'drop policy if exists "Users manage own profile" on public.profiles';
    execute 'create policy "Users manage own profile" on public.profiles for all using (id = auth.uid()::text) with check (id = auth.uid()::text)';
  end if;

  if to_regclass('public.user_usage') is not null then
    execute 'alter table public.user_usage enable row level security';
    execute 'drop policy if exists "Users manage own usage" on public.user_usage';
    execute 'create policy "Users manage own usage" on public.user_usage for all using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text)';
  end if;

  if to_regclass('public.user_narad_context') is not null then
    execute 'alter table public.user_narad_context enable row level security';
    execute 'drop policy if exists "Users manage own narad context" on public.user_narad_context';
    execute 'create policy "Users manage own narad context" on public.user_narad_context for all using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text)';
  end if;
end $switch_to_supabase_auth$;

create or replace function public.delete_current_user()
returns void
language plpgsql
security definer
set search_path = public, auth
as $delete_current_user_supabase_auth$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'not authenticated';
  end if;

  if to_regclass('public.user_narad_context') is not null then
    delete from public.user_narad_context where user_id = current_user_id::text;
  end if;

  if to_regclass('public.user_usage') is not null then
    delete from public.user_usage where user_id = current_user_id::text;
  end if;

  if to_regclass('public.profiles') is not null then
    delete from public.profiles where id = current_user_id::text;
  end if;

  delete from auth.users where id = current_user_id;
end;
$delete_current_user_supabase_auth$;

revoke all on function public.delete_current_user() from public;
grant execute on function public.delete_current_user() to authenticated;
