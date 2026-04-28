-- Stores one generated Daily Arth reflection per quote.
-- Shape:
-- {
--   "summary": text,
--   "explanation": text,
--   "dailyPractice": text[],
--   "reflectionPrompts": text[],
--   "mantra": text
-- }

alter table if exists public.spiritual_quotes
  add column if not exists daily_reflection jsonb;

comment on column public.spiritual_quotes.daily_reflection is
  'Cached Daily Arth LLM reflection JSON: summary, explanation, dailyPractice[], reflectionPrompts[], mantra.';

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'spiritual_quotes'
  ) and not exists (
    select 1
    from pg_constraint
    where conname = 'spiritual_quotes_daily_reflection_shape_check'
  ) then
    alter table public.spiritual_quotes
      add constraint spiritual_quotes_daily_reflection_shape_check
      check (
        daily_reflection is null
        or (
          jsonb_typeof(daily_reflection) = 'object'
          and jsonb_typeof(daily_reflection -> 'summary') = 'string'
          and jsonb_typeof(daily_reflection -> 'explanation') = 'string'
          and jsonb_typeof(daily_reflection -> 'dailyPractice') = 'array'
          and jsonb_typeof(daily_reflection -> 'reflectionPrompts') = 'array'
          and jsonb_typeof(daily_reflection -> 'mantra') = 'string'
        )
      );
  end if;
end $$;
