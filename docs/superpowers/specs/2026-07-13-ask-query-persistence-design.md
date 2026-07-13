# Ask Query Persistence — Design

**Date:** 2026-07-13
**Status:** Approved

## Problem

The Guidance tab (`ask.tsx` / `useAskState.ts`) currently persists chat messages and
conversation history only to `AsyncStorage` (`lib/askStorage.ts`). No query is ever
written to Supabase, so there is no server-side record of what users are asking Aksha.

## Goal

For each authenticated user, maintain one row in Supabase listing every query they've
submitted through the Guidance tab, so this data survives reinstalls/device changes and
is available for future analysis.

## Data model

New table `user_ask_queries`, mirroring the existing `user_narad_context` pattern
(single row per user, RLS scoped via the Supabase JWT `sub` claim):

```sql
create table if not exists user_ask_queries (
  user_id    text        primary key,
  queries    jsonb       not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table user_ask_queries enable row level security;

create policy "Users manage own ask queries"
  on user_ask_queries
  for all
  using  (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));
```

A shape check constraint (mirroring the `daily_reflection` pattern) ensures `queries`
stays a JSON array:

```sql
alter table user_ask_queries
  add constraint user_ask_queries_shape_check
  check (jsonb_typeof(queries) = 'array');
```

### Entry shape

Each element appended to the `queries` array:

```ts
interface AskQueryLogEntry {
  question: string;
  topic: AskTopic;         // from features/ask/types.ts
  mode: AskResponseMode;   // 'quick' | 'deep' | 'compare'
  timestamp: string;       // ISO 8601
}
```

The array is unbounded — every query a user has ever asked stays in the row
indefinitely. No pruning/capping (unlike the 80/8-item caps used for local
AsyncStorage caches).

## Sync mechanism

**Client read-modify-write**, not an atomic SQL append. On each successful `sendMessage`
call in `useAskState.ts`:

1. Select the current `queries` array for the user's row (empty array if no row yet).
2. Append the new `AskQueryLogEntry`.
3. Upsert the full array back with `updated_at = now()`.

This mirrors the simplicity of the existing `askStorage.ts` functions. It accepts a
known race: if the same user sends two messages at nearly the same instant from two
different devices/sessions, one write could overwrite the other and drop an entry. This
is acceptable for the current single-active-session usage pattern of the app.

## Integration point

New function `syncAskQueryToSupabase(entry: AskQueryLogEntry, userId: string): Promise<void>`
added to `lib/askStorage.ts`, following the exact conventions already in that file:
wrapped in try/catch, errors logged via `console.error` and swallowed — never throws,
never blocks the caller.

In `features/ask/useAskState.ts`, inside `sendMessage`'s success path — right after the
existing `saveAskHistory(nextHistory)` call — fire:

```ts
if (user?.id) {
  syncAskQueryToSupabase(
    { question: trimmed, topic: parsed.topic, mode, timestamp: new Date().toISOString() },
    user.id,
  ).catch(() => {});
}
```

Un-awaited, identical to how `useNaradState.ts` fires `syncNaradContextToSupabase(...)`.
This keeps the sync entirely off the critical path of message send — no added latency,
no new failure mode visible to the user. If `user` is not signed in, nothing is synced
(local AsyncStorage history still works as today).

The error path of `sendMessage` (failed `/api/ask` call) does **not** sync — only
questions that received a successful response are logged.

## Out of scope

- No UI to view past queries (not requested).
- No backfill of previously-asked questions already sitting in AsyncStorage.
- No migration to a normalized one-row-per-query table — explicitly deferred; flagged
  as a future consideration if the unbounded array becomes a scale problem.
- No changes to the `/api/ask` server route — the sync is entirely client-side, same as
  `user_narad_context`.
