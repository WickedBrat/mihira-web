# Ask Query Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist every query a signed-in user submits through the Guidance tab (`ask.tsx`) into a new per-user Supabase table, entirely from the server side, so future changes to the logging logic ship via a server deploy and never require a new app store release.

**Architecture:** A new `user_ask_queries` table (one row per user, `queries` jsonb array, RLS scoped to the Supabase JWT) mirrors the existing `user_narad_context` pattern. The client attaches its Supabase access token as a bearer header on `/api/ask` calls — the only client-side change, a one-time addition, not ongoing logic. The server (`lib/server/routes/ask.ts`) verifies that token with a privileged Supabase client (reusing the existing `SUPABASE_SECRET_KEY` pattern already used in `dailyArthReflection.ts`), then fires a read-modify-write against `user_ask_queries` — kicked off after the AI response is generated but not awaited, so it adds zero latency to the Guidance response.

**Tech Stack:** Expo/React Native, TypeScript, Supabase (`@supabase/supabase-js`), Expo Server API routes, Jest + `@testing-library/react-native`.

## Global Constraints

- Table name: `user_ask_queries`, primary key `user_id` (text), matching `user_narad_context`.
- RLS: `using (user_id = (auth.jwt() ->> 'sub')) with check (user_id = (auth.jwt() ->> 'sub'))` — kept as defense-in-depth even though the server write uses a service-role client that bypasses it.
- The `queries` jsonb array is **unbounded** — no capping/pruning.
- Sync is a **read-modify-write** (select current array, append, upsert full array) — not an atomic SQL append.
- Entry shape: `{ question: string; topic: AskTopic; mode: AskResponseMode; timestamp: string }`.
- All Supabase/auth errors inside the logging path are caught and `console.error`'d — nothing in the logging path may ever throw or reject uncaught, and nothing in it may ever block or fail the `/api/ask` response.
- The log write is **fire-and-forget**: started after `generateScriptureGuide` succeeds, not awaited before `Response.json(response)` is returned.
- Server auth reuses the existing `SUPABASE_SECRET_KEY` env var (already used in `lib/server/routes/dailyArthReflection.ts`) — no new secret.
- **The migration SQL is written to the repo but is applied to the live database by the user manually — no task in this plan executes it against Supabase.** (Per the user: this migration has already been run.)

---

## File Structure

- **Create:** `supabase/migrations/20260713000000_create_user_ask_queries.sql` — the new table + RLS policy + shape check constraint.
- **Modify:** `mobile/features/ask/types.ts` — add the `AskQueryLogEntry` type.
- **Create:** `mobile/lib/server/askQueryLog.ts` — `logAskQuery(supabase, userId, entry)`, the read-modify-write.
- **Create:** `mobile/__tests__/lib/server/askQueryLog.test.ts`.
- **Create:** `mobile/lib/server/auth.ts` — `getAuthenticatedSupabaseClient(request)`, bearer-token verification against a privileged Supabase client.
- **Create:** `mobile/__tests__/lib/server/auth.test.ts`.
- **Modify:** `mobile/lib/server/routes/ask.ts` — wire both into `handleAskRequest`.
- **Create:** `mobile/__tests__/lib/server/ask.test.ts`.
- **Modify:** `mobile/features/ask/useAskState.ts` — attach the bearer token when calling `/api/ask`.
- **Create:** `mobile/__tests__/features/ask/useAskState.test.ts`.

---

### Task 1: Supabase migration file

**Files:**
- Create: `supabase/migrations/20260713000000_create_user_ask_queries.sql`

**Interfaces:**
- Produces: table `user_ask_queries(user_id text primary key, queries jsonb not null default '[]'::jsonb, updated_at timestamptz not null default now())`, consumed by Task 2's `logAskQuery`.

- [ ] **Step 1: Write the migration file**

```sql
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
```

- [ ] **Step 2: Verify the file against the existing convention**

Run: `diff <(head -20 supabase/migrations/20260412000000_add_user_narad_context.sql) <(head -20 supabase/migrations/20260713000000_create_user_ask_queries.sql)`

Expected: no crash from the diff command itself (the content will differ — this is just confirming both files exist and are readable). Visually confirm the new file follows the same `create table` / `enable row level security` / `create policy` structure as `user_narad_context`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260713000000_create_user_ask_queries.sql
git commit -m "Add user_ask_queries migration for Guidance tab query history"
```

**Note:** the user has already run this migration against the live database.

---

### Task 2: `logAskQuery` — the read-modify-write

**Files:**
- Modify: `mobile/features/ask/types.ts`
- Create: `mobile/lib/server/askQueryLog.ts`
- Test: `mobile/__tests__/lib/server/askQueryLog.test.ts`

**Interfaces:**
- Consumes: a `SupabaseClient` instance (from `@supabase/supabase-js`), passed in by the caller — this function never constructs its own client.
- Produces: `AskQueryLogEntry` type (`{ question: string; topic: AskTopic; mode: AskResponseMode; timestamp: string }`) from `@/features/ask/types`, and `logAskQuery(supabase: SupabaseClient, userId: string, entry: AskQueryLogEntry): Promise<void>` from `@/lib/server/askQueryLog`, consumed by Task 4.

- [ ] **Step 1: Add the `AskQueryLogEntry` type**

In `mobile/features/ask/types.ts`, add this directly below the existing `AskHistoryTurn` interface (after line 79):

```ts
export interface AskQueryLogEntry {
  question: string;
  topic: AskTopic;
  mode: AskResponseMode;
  timestamp: string;
}
```

- [ ] **Step 2: Write the failing tests**

Create `mobile/__tests__/lib/server/askQueryLog.test.ts`:

```ts
import { logAskQuery } from '@/lib/server/askQueryLog';
import type { AskQueryLogEntry } from '@/features/ask/types';

function buildSupabaseMock() {
  const mockMaybeSingle = jest.fn();
  const mockEq = jest.fn(() => ({ maybeSingle: mockMaybeSingle }));
  const mockSelect = jest.fn(() => ({ eq: mockEq }));
  const mockUpsert = jest.fn();
  const mockFrom = jest.fn(() => ({ select: mockSelect, upsert: mockUpsert }));
  const supabase = { from: mockFrom } as never;
  return { supabase, mockFrom, mockSelect, mockEq, mockMaybeSingle, mockUpsert };
}

describe('logAskQuery', () => {
  const entry: AskQueryLogEntry = {
    question: 'What is dharma?',
    topic: 'career_dharma',
    mode: 'quick',
    timestamp: '2026-07-13T10:00:00.000Z',
  };

  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('appends the new entry to an existing queries array and upserts it', async () => {
    const mock = buildSupabaseMock();
    mock.mockMaybeSingle.mockResolvedValueOnce({
      data: { queries: [{ question: 'Old question', topic: 'general', mode: 'quick', timestamp: '2026-07-01T00:00:00.000Z' }] },
      error: null,
    });
    mock.mockUpsert.mockResolvedValueOnce({ error: null });

    await logAskQuery(mock.supabase, 'user_123', entry);

    expect(mock.mockFrom).toHaveBeenCalledWith('user_ask_queries');
    expect(mock.mockSelect).toHaveBeenCalledWith('queries');
    expect(mock.mockEq).toHaveBeenCalledWith('user_id', 'user_123');
    expect(mock.mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user_123',
        queries: [
          { question: 'Old question', topic: 'general', mode: 'quick', timestamp: '2026-07-01T00:00:00.000Z' },
          entry,
        ],
      }),
      { onConflict: 'user_id' },
    );
  });

  it('starts a new array when the user has no existing row', async () => {
    const mock = buildSupabaseMock();
    mock.mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    mock.mockUpsert.mockResolvedValueOnce({ error: null });

    await logAskQuery(mock.supabase, 'user_123', entry);

    expect(mock.mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user_123', queries: [entry] }),
      { onConflict: 'user_id' },
    );
  });

  it('logs and does not throw when the select fails', async () => {
    const mock = buildSupabaseMock();
    mock.mockMaybeSingle.mockResolvedValueOnce({ data: null, error: { message: 'select failed' } });

    await expect(logAskQuery(mock.supabase, 'user_123', entry)).resolves.toBeUndefined();
    expect(mock.mockUpsert).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('logs and does not throw when the upsert fails', async () => {
    const mock = buildSupabaseMock();
    mock.mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    mock.mockUpsert.mockResolvedValueOnce({ error: { message: 'upsert failed' } });

    await expect(logAskQuery(mock.supabase, 'user_123', entry)).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `cd mobile && npx jest __tests__/lib/server/askQueryLog.test.ts`
Expected: FAIL — cannot find module `@/lib/server/askQueryLog`.

- [ ] **Step 4: Implement `logAskQuery`**

Create `mobile/lib/server/askQueryLog.ts`:

```ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AskQueryLogEntry } from '../../features/ask/types';

export async function logAskQuery(
  supabase: SupabaseClient,
  userId: string,
  entry: AskQueryLogEntry,
): Promise<void> {
  try {
    const { data, error: selectError } = await supabase
      .from('user_ask_queries')
      .select('queries')
      .eq('user_id', userId)
      .maybeSingle();

    if (selectError) {
      console.error('[askQueryLog] select error', selectError.message);
      return;
    }

    const existing = (data?.queries as AskQueryLogEntry[] | undefined) ?? [];
    const nextQueries = [...existing, entry];

    const { error: upsertError } = await supabase.from('user_ask_queries').upsert(
      {
        user_id: userId,
        queries: nextQueries,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

    if (upsertError) {
      console.error('[askQueryLog] upsert error', upsertError.message);
    }
  } catch (err) {
    console.error('[askQueryLog] error', err);
  }
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `cd mobile && npx jest __tests__/lib/server/askQueryLog.test.ts`
Expected: PASS — all 4 tests succeed.

- [ ] **Step 6: Commit**

```bash
git add mobile/features/ask/types.ts mobile/lib/server/askQueryLog.ts mobile/__tests__/lib/server/askQueryLog.test.ts
git commit -m "Add logAskQuery server-side read-modify-write for Guidance query history"
```

---

### Task 3: `getAuthenticatedSupabaseClient` — bearer token verification

**Files:**
- Create: `mobile/lib/server/auth.ts`
- Test: `mobile/__tests__/lib/server/auth.test.ts`

**Interfaces:**
- Consumes: `process.env.EXPO_PUBLIC_SUPABASE_URL`, `process.env.SUPABASE_SECRET_KEY` (both already used by `lib/server/routes/dailyArthReflection.ts`).
- Produces: `getAuthenticatedSupabaseClient(request: Request): Promise<{ userId: string; supabase: SupabaseClient } | null>` from `@/lib/server/auth`, consumed by Task 4.

- [ ] **Step 1: Write the failing tests**

Create `mobile/__tests__/lib/server/auth.test.ts`:

```ts
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedSupabaseClient } from '@/lib/server/auth';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

function requestWithAuth(header?: string) {
  return new Request('http://localhost/api/ask', {
    method: 'POST',
    headers: header ? { authorization: header } : {},
  });
}

describe('getAuthenticatedSupabaseClient', () => {
  const originalEnv = { ...process.env };
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'secret-key';
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    errorSpy.mockRestore();
  });

  it('returns null when there is no Authorization header', async () => {
    const result = await getAuthenticatedSupabaseClient(requestWithAuth());
    expect(result).toBeNull();
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it('returns null when the header is not a Bearer token', async () => {
    const result = await getAuthenticatedSupabaseClient(requestWithAuth('Basic abc123'));
    expect(result).toBeNull();
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it('returns null and logs when the Supabase secret key is missing', async () => {
    delete process.env.SUPABASE_SECRET_KEY;
    const result = await getAuthenticatedSupabaseClient(requestWithAuth('Bearer valid-token'));
    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('returns null when Supabase rejects the token', async () => {
    const mockGetUser = jest.fn().mockResolvedValue({ data: { user: null }, error: { message: 'invalid token' } });
    mockCreateClient.mockReturnValueOnce({ auth: { getUser: mockGetUser } } as never);

    const result = await getAuthenticatedSupabaseClient(requestWithAuth('Bearer bad-token'));

    expect(result).toBeNull();
    expect(mockGetUser).toHaveBeenCalledWith('bad-token');
  });

  it('returns the verified userId and client when the token is valid', async () => {
    const mockGetUser = jest.fn().mockResolvedValue({ data: { user: { id: 'user_123' } }, error: null });
    const mockClient = { auth: { getUser: mockGetUser } };
    mockCreateClient.mockReturnValueOnce(mockClient as never);

    const result = await getAuthenticatedSupabaseClient(requestWithAuth('Bearer good-token'));

    expect(result).toEqual({ userId: 'user_123', supabase: mockClient });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd mobile && npx jest __tests__/lib/server/auth.test.ts`
Expected: FAIL — cannot find module `@/lib/server/auth`.

- [ ] **Step 3: Implement `getAuthenticatedSupabaseClient`**

Create `mobile/lib/server/auth.ts`:

```ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function createServerSupabaseClient(): SupabaseClient {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase URL or secret key');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export interface AuthenticatedSupabase {
  userId: string;
  supabase: SupabaseClient;
}

export async function getAuthenticatedSupabaseClient(
  request: Request,
): Promise<AuthenticatedSupabase | null> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return null;

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;

    return { userId: data.user.id, supabase };
  } catch (err) {
    console.error('[server/auth] getAuthenticatedSupabaseClient error', err);
    return null;
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd mobile && npx jest __tests__/lib/server/auth.test.ts`
Expected: PASS — all 5 tests succeed.

- [ ] **Step 5: Commit**

```bash
git add mobile/lib/server/auth.ts mobile/__tests__/lib/server/auth.test.ts
git commit -m "Add server-side bearer token verification for Guidance query logging"
```

---

### Task 4: Wire logging into `handleAskRequest`

**Files:**
- Modify: `mobile/lib/server/routes/ask.ts`
- Test: `mobile/__tests__/lib/server/ask.test.ts` (new file)

**Interfaces:**
- Consumes: `getAuthenticatedSupabaseClient` from Task 3, `logAskQuery` from Task 2, `generateScriptureGuide` from `@/lib/ai/askService` (existing, returns `Promise<ScriptureGuideResponse>`).

- [ ] **Step 1: Write the failing tests**

Create `mobile/__tests__/lib/server/ask.test.ts`:

```ts
jest.mock('@/lib/ai/askService', () => ({
  generateScriptureGuide: jest.fn(),
}));

jest.mock('@/lib/server/auth', () => ({
  getAuthenticatedSupabaseClient: jest.fn(),
}));

jest.mock('@/lib/server/askQueryLog', () => ({
  logAskQuery: jest.fn(),
}));

import { generateScriptureGuide } from '@/lib/ai/askService';
import { getAuthenticatedSupabaseClient } from '@/lib/server/auth';
import { logAskQuery } from '@/lib/server/askQueryLog';
import { handleAskRequest } from '@/lib/server/routes/ask';
import type { ScriptureGuideResponse } from '@/features/ask/types';

const mockResponse: ScriptureGuideResponse = {
  mode: 'quick',
  topic: 'career_dharma',
  answer: { title: 'Test', summary: 'summary', practical_guidance: 'guidance' },
  sources: [],
  interpretation: { synthesis: 'synthesis' },
  action_steps: [],
  follow_up_prompts: [],
  safety: { has_boundary: false },
};

function requestFor(message: string, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify({ message, mode: 'quick' }),
  });
}

// Flush the microtask queue so fire-and-forget promises resolve before assertions.
// Promise-based (not setImmediate) so it works under both node and jsdom test environments.
async function flush() {
  for (let i = 0; i < 5; i += 1) {
    await Promise.resolve();
  }
}

describe('handleAskRequest query logging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (generateScriptureGuide as jest.Mock).mockResolvedValue(mockResponse);
  });

  it('logs the query when the caller is authenticated', async () => {
    const mockSupabase = {};
    (getAuthenticatedSupabaseClient as jest.Mock).mockResolvedValue({
      userId: 'user_123',
      supabase: mockSupabase,
    });
    (logAskQuery as jest.Mock).mockResolvedValue(undefined);

    const response = await handleAskRequest(requestFor('What is dharma?', { authorization: 'Bearer good-token' }));
    await flush();

    expect(response.status).toBe(200);
    expect(logAskQuery).toHaveBeenCalledWith(
      mockSupabase,
      'user_123',
      expect.objectContaining({ question: 'What is dharma?', topic: 'career_dharma', mode: 'quick' }),
    );
  });

  it('does not log when the caller is not authenticated', async () => {
    (getAuthenticatedSupabaseClient as jest.Mock).mockResolvedValue(null);

    const response = await handleAskRequest(requestFor('What is dharma?'));
    await flush();

    expect(response.status).toBe(200);
    expect(logAskQuery).not.toHaveBeenCalled();
  });

  it('still returns the AI response even if logging rejects', async () => {
    (getAuthenticatedSupabaseClient as jest.Mock).mockResolvedValue({
      userId: 'user_123',
      supabase: {},
    });
    (logAskQuery as jest.Mock).mockRejectedValue(new Error('boom'));

    const response = await handleAskRequest(requestFor('What is dharma?', { authorization: 'Bearer good-token' }));
    const payload = await response.json();
    await flush();

    expect(response.status).toBe(200);
    expect(payload).toEqual(mockResponse);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd mobile && npx jest __tests__/lib/server/ask.test.ts`
Expected: FAIL — `logAskQuery` is never called (the route doesn't call it yet).

- [ ] **Step 3: Wire the logging call into `handleAskRequest`**

Replace the full contents of `mobile/lib/server/routes/ask.ts` with:

```ts
import { generateScriptureGuide } from '../../ai/askService';
import { serverErrorResponse } from '../errorResponse';
import { getAuthenticatedSupabaseClient } from '../auth';
import { logAskQuery } from '../askQueryLog';
import type { AskHistoryTurn, AskResponseMode, AskContextV2 } from '../../../features/ask/types';

function isMode(value: unknown): value is AskResponseMode {
  return value === 'quick' || value === 'deep' || value === 'compare';
}

export async function handleAskRequest(request: Request): Promise<Response> {
  try {
    const body = await request.json() as {
      message?: string;
      mode?: AskResponseMode;
      userContext?: AskContextV2;
      history?: AskHistoryTurn[];
    };

    if (!body.message || typeof body.message !== 'string') {
      return Response.json({ error: 'message is required' }, { status: 400 });
    }

    if (body.message.length > 2000) {
      return Response.json({ error: 'message exceeds 2000 characters' }, { status: 400 });
    }

    if (!isMode(body.mode)) {
      return Response.json({ error: 'mode must be quick, deep, or compare' }, { status: 400 });
    }

    const response = await generateScriptureGuide({
      message: body.message,
      mode: body.mode,
      userContext: body.userContext,
      history: body.history,
    });

    getAuthenticatedSupabaseClient(request)
      .then((auth) => {
        if (!auth) return;
        return logAskQuery(auth.supabase, auth.userId, {
          question: body.message as string,
          topic: response.topic,
          mode: body.mode as AskResponseMode,
          timestamp: new Date().toISOString(),
        });
      })
      .catch(() => {});

    return Response.json(response);
  } catch (err) {
    return serverErrorResponse('ask', err);
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd mobile && npx jest __tests__/lib/server/ask.test.ts`
Expected: PASS — all 3 tests succeed.

- [ ] **Step 5: Commit**

```bash
git add mobile/lib/server/routes/ask.ts mobile/__tests__/lib/server/ask.test.ts
git commit -m "Fire-and-forget log the query on every successful /api/ask response"
```

---

### Task 5: Client — attach the bearer token

**Files:**
- Modify: `mobile/features/ask/useAskState.ts`
- Test: `mobile/__tests__/features/ask/useAskState.test.ts` (new file)

**Interfaces:**
- Consumes: `getSupabaseClient()` from `@/lib/supabase` (existing — returns a `SupabaseClient` whose `.auth.getSession()` resolves `{ data: { session: Session | null } }`).

- [ ] **Step 1: Write the failing hook test**

Create `mobile/__tests__/features/ask/useAskState.test.ts`:

```ts
import { renderHook, act, waitFor } from '@testing-library/react-native';
import type { ScriptureGuideResponse } from '@/features/ask/types';

jest.mock('@/lib/auth', () => ({
  useUser: jest.fn(),
}));

jest.mock('@/lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

jest.mock('@/lib/analytics', () => ({
  analytics: {
    askSubmitted: jest.fn(),
    askPassageSaved: jest.fn(),
    askFollowUpPromptTapped: jest.fn(),
  },
}));

jest.mock('@/lib/supabase', () => ({
  getSupabaseClient: jest.fn(),
}));

jest.mock('@/lib/askStorage', () => ({
  DEFAULT_ASK_CONTEXT: {
    userName: 'Seeker',
    interactionCount: 0,
    lastMode: 'quick',
    lastTopic: null,
    lastQuestion: null,
  },
  clearAskConversation: jest.fn(),
  loadAskContext: jest.fn(),
  loadAskHistory: jest.fn(),
  loadAskMessages: jest.fn(),
  loadSavedPassages: jest.fn(),
  saveAskContext: jest.fn(),
  saveAskHistory: jest.fn(),
  saveAskMessages: jest.fn(),
  saveSavedPassages: jest.fn(),
}));

import { useUser } from '@/lib/auth';
import { apiFetch } from '@/lib/apiFetch';
import { getSupabaseClient } from '@/lib/supabase';
import {
  loadAskContext,
  loadAskHistory,
  loadAskMessages,
  loadSavedPassages,
  saveAskHistory,
  saveAskMessages,
  DEFAULT_ASK_CONTEXT,
} from '@/lib/askStorage';
import { useAskState } from '@/features/ask/useAskState';

const mockResponse: ScriptureGuideResponse = {
  mode: 'quick',
  topic: 'career_dharma',
  answer: { title: 'Test', summary: 'summary', practical_guidance: 'guidance' },
  sources: [],
  interpretation: { synthesis: 'synthesis' },
  action_steps: [],
  follow_up_prompts: [],
  safety: { has_boundary: false },
};

describe('useAskState bearer token attachment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({ user: { id: 'user_123', firstName: null } });
    (loadAskContext as jest.Mock).mockResolvedValue({ ...DEFAULT_ASK_CONTEXT });
    (loadAskMessages as jest.Mock).mockResolvedValue([]);
    (loadSavedPassages as jest.Mock).mockResolvedValue([]);
    (loadAskHistory as jest.Mock).mockResolvedValue([]);
    (saveAskMessages as jest.Mock).mockResolvedValue(undefined);
    (saveAskHistory as jest.Mock).mockResolvedValue(undefined);
    (apiFetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
  });

  it('attaches the Supabase access token as a Bearer header when a session exists', async () => {
    (getSupabaseClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: { access_token: 'token-abc' } } }),
      },
    });

    const { result } = renderHook(() => useAskState());
    await waitFor(() => expect(result.current.isContextLoaded).toBe(true));

    await act(async () => {
      await result.current.sendMessage('What is dharma?');
    });

    expect(apiFetch).toHaveBeenCalledWith(
      '/api/ask',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-abc' }),
      }),
    );
  });

  it('omits the Authorization header when there is no session', async () => {
    (getSupabaseClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      },
    });

    const { result } = renderHook(() => useAskState());
    await waitFor(() => expect(result.current.isContextLoaded).toBe(true));

    await act(async () => {
      await result.current.sendMessage('What is dharma?');
    });

    const [, options] = (apiFetch as jest.Mock).mock.calls[0];
    expect(options.headers).not.toHaveProperty('Authorization');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd mobile && npx jest __tests__/features/ask/useAskState.test.ts`
Expected: FAIL — `apiFetch` is called without an `Authorization` header (the hook doesn't attach it yet).

- [ ] **Step 3: Attach the bearer token in `sendMessage`**

In `mobile/features/ask/useAskState.ts`, add this import alongside the existing ones (after the `apiFetch` import on line 12):

```ts
import { getSupabaseClient } from '@/lib/supabase';
```

Then, inside `sendMessage`, replace this block (currently lines 120-137):

```ts
    try {
      const history = await loadAskHistory();
      analytics.askSubmitted({
        mode,
        message_length: trimmed.length,
        conversation_length: nextAllMessages.length,
      });

      const response = await apiFetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          mode,
          history,
          userContext: askContextRef.current,
        }),
      });
```

with:

```ts
    try {
      const history = await loadAskHistory();
      analytics.askSubmitted({
        mode,
        message_length: trimmed.length,
        conversation_length: nextAllMessages.length,
      });

      const { data: { session } } = await getSupabaseClient().auth.getSession();

      const response = await apiFetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          message: trimmed,
          mode,
          history,
          userContext: askContextRef.current,
        }),
      });
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd mobile && npx jest __tests__/features/ask/useAskState.test.ts`
Expected: PASS — both tests succeed.

- [ ] **Step 5: Run the full mobile test suite to check for regressions**

Run: `cd mobile && npx jest`
Expected: PASS — no existing tests broken by the new imports/calls.

- [ ] **Step 6: Commit**

```bash
git add mobile/features/ask/useAskState.ts mobile/__tests__/features/ask/useAskState.test.ts
git commit -m "Attach Supabase bearer token to /api/ask requests"
```

---

## Self-Review Notes

- **Spec coverage:** table + RLS (Task 1), entry shape + read-modify-write (Task 2), server-side bearer token verification reusing `SUPABASE_SECRET_KEY` (Task 3), fire-and-forget wiring into the route (Task 4), one-time client header attachment (Task 5) — all spec sections have a corresponding task.
- **Manual migration:** Task 1 explicitly does not run the SQL against Supabase — the user has already applied it themselves.
- **Fire-and-forget correctness:** Task 4's tests explicitly cover the case where `logAskQuery` rejects, asserting the response is still returned successfully — this is the behavior that makes fire-and-forget safe from the caller's perspective.
- **Type consistency:** `AskQueryLogEntry` is defined once in Task 2 Step 1 and used identically (same field names: `question`, `topic`, `mode`, `timestamp`) across Task 2's implementation/tests and Task 4's route wiring — checked for drift.
- **No dead code:** the original client-side `syncAskQueryToSupabase` approach from the prior revision of this plan was never implemented, so there is nothing to remove.
