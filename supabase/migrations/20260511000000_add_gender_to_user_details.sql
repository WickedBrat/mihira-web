-- Store onboarding gender preference for daily horoscope imagery.

alter table public.user_details
  add column if not exists gender text;

update public.user_details details
set gender = coalesce(
  details.gender,
  nullif(users.raw_user_meta_data ->> 'gender', ''),
  nullif(users.raw_user_meta_data ->> 'sex', '')
)
from auth.users users
where details.user_id = users.id
  and details.gender is null;

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
    gender,
    onboarding_completed,
    updated_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'gender', new.raw_user_meta_data ->> 'sex'),
    false,
    now()
  )
  on conflict (user_id) do nothing;

  return new;
end;
$handle_new_user_details$;
