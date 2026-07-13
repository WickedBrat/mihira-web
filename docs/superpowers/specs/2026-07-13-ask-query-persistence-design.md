# Ask Query Persistence — Design

**Date:** 2026-07-13
**Status:** Approved (revised — moved to server-side sync)

**Revision note (2026-07-13):** The original design synced queries directly from the
client (mirroring `user_narad_context`). Revised to sync from the `/api/ask` server
route instead, so future changes to the logging logic ship via a server deploy and
don't require a new app store release. This requires the server to authenticate the
caller, which is a new capability — no existing server route in this codebase verifies
who's calling it today.

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

## Auth: how the server learns who's calling

The client already holds a Supabase session (`getSupabaseClient().auth.getSession()`).
Before calling `/api/ask`, `useAskState.ts` attaches the session's access token as a
bearer header:

```ts
const { data: { session } } = await getSupabaseClient().auth.getSession();
const response = await apiFetch('/api/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  },
  body: JSON.stringify({ message: trimmed, mode, history, userContext: askContextRef.current }),
});
```

This is the only client-side change this feature requires — a one-time addition of an
auth header, not ongoing logic that will need future app updates.

Server-side, this reuses the existing privileged-client pattern already in the codebase
(`createServerSupabaseClient()` in `lib/server/routes/dailyArthReflection.ts:10`, which
authenticates with `SUPABASE_SECRET_KEY` — no new secret to add). A new helper
`lib/server/auth.ts` verifies the token against that same client and returns the
verified user id:

```ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function createServerSupabaseClient(): SupabaseClient {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase URL or secret key');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export async function getAuthenticatedSupabaseClient(
  request: Request,
): Promise<{ userId: string; supabase: SupabaseClient } | null> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return null;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  return { userId: data.user.id, supabase };
}
```

`auth.getUser(token)` validates the token against Supabase's auth server regardless of
which key created the client, so a single secret-key client both verifies the caller and
performs the write. This write **bypasses RLS** (service-role key) — that's fine here
because the server itself verified the token and only ever writes to the row matching
the *verified* `data.user.id`, never a client-supplied id. The RLS policy on
`user_ask_queries` stays in place as defense-in-depth for any future direct client
access, but this route doesn't rely on it.

## Sync mechanism

**Read-modify-write**, not an atomic SQL append — performed server-side in
`handleAskRequest` (`lib/server/routes/ask.ts`), **fire-and-forget**: kicked off after
`generateScriptureGuide` succeeds but not awaited before the response is returned, so it
adds zero latency to the Guidance response:

1. Select the current `queries` array for the user's row (empty array if no row yet).
2. Append the new `AskQueryLogEntry`.
3. Upsert the full array back with `updated_at = now()`.

This accepts the same known race as the original design: two near-simultaneous requests
from the same user could overwrite each other and drop an entry. It also accepts a
second, deliberate trade-off: if `/api/ask` runs on a platform that tears down the
request process immediately after the response is sent, an in-flight un-awaited write
could occasionally be dropped. Chosen anyway to keep the Guidance response fast.

## Integration point

New function `logAskQuery(supabase: SupabaseClient, userId: string, entry: AskQueryLogEntry): Promise<void>`
in a new `lib/server/askQueryLog.ts`, wrapped in try/catch — errors are logged via
`console.error` and swallowed, never thrown, so a logging failure never fails the
`/api/ask` response itself.

In `handleAskRequest`, after `generateScriptureGuide` succeeds:

```ts
getAuthenticatedSupabaseClient(request)
  .then((auth) => {
    if (!auth) return;
    return logAskQuery(
      auth.supabase,
      auth.userId,
      { question: body.message, topic: response.topic, mode: body.mode, timestamp: new Date().toISOString() },
    );
  })
  .catch(() => {});

return Response.json(response);
```

If the `Authorization` header is missing or invalid, `auth` is `null` and nothing is
logged — the Guidance response itself is never blocked or degraded by an auth failure.

The error path of `handleAskRequest` (failed `generateScriptureGuide` call) does **not**
log — only questions that received a successful response are recorded.

## Out of scope

- No UI to view past queries (not requested).
- No backfill of previously-asked questions already sitting in AsyncStorage.
- No migration to a normalized one-row-per-query table — explicitly deferred; flagged
  as a future consideration if the unbounded array becomes a scale problem.
- No reuse of `getAuthenticatedSupabaseClient` by other routes yet — built narrowly for
  this feature; other routes can adopt it later if they need server-side auth too.
