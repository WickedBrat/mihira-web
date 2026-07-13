# Ask Query Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist every query a signed-in user submits through the Guidance tab (`ask.tsx`) into a new per-user Supabase table, so a full query history exists server-side.

**Architecture:** A new `user_ask_queries` table (one row per user, `queries` jsonb array, RLS scoped to the Supabase JWT) mirrors the existing `user_narad_context` pattern. A new `syncAskQueryToSupabase` function in `lib/askStorage.ts` does a read-modify-write against that table. `useAskState.ts`'s `sendMessage` fires this un-awaited after every successful AI response, exactly like the existing `syncNaradContextToSupabase` call in `useNaradState.ts`.

**Tech Stack:** Expo/React Native, TypeScript, Supabase (`@supabase/supabase-js`), Jest + `@testing-library/react-native`.

## Global Constraints

- Table name: `user_ask_queries`, primary key `user_id` (text), matching `user_narad_context`.
- RLS: `using (user_id = (auth.jwt() ->> 'sub')) with check (user_id = (auth.jwt() ->> 'sub'))`.
- The `queries` jsonb array is **unbounded** — no capping/pruning.
- Sync is a **client read-modify-write** (select current array, append, upsert full array) — not an atomic SQL append.
- Entry shape: `{ question: string; topic: AskTopic; mode: AskResponseMode; timestamp: string }`.
- Sync call is **fire-and-forget** (`.catch(() => {})`, not awaited) and only fires on the success path of `sendMessage`, only when `user?.id` exists.
- All Supabase errors are caught and `console.error`'d — `syncAskQueryToSupabase` must never throw.
- **The migration SQL is written to the repo but is applied to the live database by the user manually — no task in this plan executes it against Supabase.**

---

## File Structure

- **Create:** `supabase/migrations/20260713000000_create_user_ask_queries.sql` — the new table + RLS policy + shape check constraint.
- **Modify:** `mobile/features/ask/types.ts` — add the `AskQueryLogEntry` type.
- **Modify:** `mobile/lib/askStorage.ts` — add `syncAskQueryToSupabase`.
- **Modify:** `mobile/__tests__/lib/askStorage.test.ts` — unit tests for `syncAskQueryToSupabase`.
- **Modify:** `mobile/features/ask/useAskState.ts` — call `syncAskQueryToSupabase` in `sendMessage`.
- **Create:** `mobile/__tests__/features/ask/useAskState.test.ts` — hook-level test that the sync fires (or doesn't) correctly.

---

### Task 1: Supabase migration file

**Files:**
- Create: `supabase/migrations/20260713000000_create_user_ask_queries.sql`

**Interfaces:**
- Produces: table `user_ask_queries(user_id text primary key, queries jsonb not null default '[]'::jsonb, updated_at timestamptz not null default now())`, consumed by Task 2's `syncAskQueryToSupabase`.

- [ ] **Step 1: Write the migration file**

```sql
-- Migration: user_ask_queries
-- Stores every Guidance-tab query per user in a single row, synced from the client.

create table if not exists user_ask_queries (
  user_id    text        primary key,
  queries    jsonb       not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- RLS: each user can only read and write their own row.
-- Supabase Auth stores the user ID in the 'sub' claim.
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

**Note for whoever runs this:** this migration is not applied automatically. The user will run it against the Supabase database themselves.

---

### Task 2: `syncAskQueryToSupabase` in `askStorage.ts`

**Files:**
- Modify: `mobile/features/ask/types.ts`
- Modify: `mobile/lib/askStorage.ts`
- Test: `mobile/__tests__/lib/askStorage.test.ts`

**Interfaces:**
- Consumes: `getSupabaseClient()` from `@/lib/supabase` (returns a `SupabaseClient`), `USER_DETAILS_USER_ID_COLUMN` (`= 'user_id'`) from `@/lib/userDetails`.
- Produces: `AskQueryLogEntry` type (`{ question: string; topic: AskTopic; mode: AskResponseMode; timestamp: string }`) from `@/features/ask/types`, and `syncAskQueryToSupabase(entry: AskQueryLogEntry, userId: string): Promise<void>` from `@/lib/askStorage`, consumed by Task 3.

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

Add to the top of `mobile/__tests__/lib/askStorage.test.ts`, alongside the existing `AsyncStorage` mock (the file's first lines, before the `AsyncStorage` import):

```ts
jest.mock('@/lib/supabase', () => ({
  getSupabaseClient: jest.fn(),
}));
```

Then add these imports near the existing ones (after the `askStorage` import block):

```ts
import { getSupabaseClient } from '@/lib/supabase';
import { syncAskQueryToSupabase } from '@/lib/askStorage';
import type { AskQueryLogEntry } from '@/features/ask/types';
```

Then add this new `describe` block at the end of the file, before the final closing of the outer `describe('askStorage', ...)` block (i.e. as a sibling `describe` at the bottom of the file):

```ts
describe('syncAskQueryToSupabase', () => {
  const mockMaybeSingle = jest.fn();
  const mockEq = jest.fn(() => ({ maybeSingle: mockMaybeSingle }));
  const mockSelect = jest.fn(() => ({ eq: mockEq }));
  const mockUpsert = jest.fn();
  const mockFrom = jest.fn(() => ({ select: mockSelect, upsert: mockUpsert }));
  const mockClient = { from: mockFrom };

  const entry: AskQueryLogEntry = {
    question: 'What is dharma?',
    topic: 'career_dharma',
    mode: 'quick',
    timestamp: '2026-07-13T10:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getSupabaseClient as jest.Mock).mockReturnValue(mockClient);
    mockUpsert.mockResolvedValue({ error: null });
  });

  it('appends the new entry to an existing queries array and upserts it', async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { queries: [{ question: 'Old question', topic: 'general', mode: 'quick', timestamp: '2026-07-01T00:00:00.000Z' }] },
      error: null,
    });

    await syncAskQueryToSupabase(entry, 'user_123');

    expect(mockFrom).toHaveBeenCalledWith('user_ask_queries');
    expect(mockSelect).toHaveBeenCalledWith('queries');
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user_123');
    expect(mockUpsert).toHaveBeenCalledWith(
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
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    await syncAskQueryToSupabase(entry, 'user_123');

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user_123', queries: [entry] }),
      { onConflict: 'user_id' },
    );
  });

  it('logs and does not throw when the select fails', async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: { message: 'select failed' } });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(syncAskQueryToSupabase(entry, 'user_123')).resolves.toBeUndefined();
    expect(mockUpsert).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('logs and does not throw when the upsert fails', async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    mockUpsert.mockResolvedValueOnce({ error: { message: 'upsert failed' } });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(syncAskQueryToSupabase(entry, 'user_123')).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `cd mobile && npx jest __tests__/lib/askStorage.test.ts`
Expected: FAIL — `syncAskQueryToSupabase` is not exported from `@/lib/askStorage`.

- [ ] **Step 4: Implement `syncAskQueryToSupabase`**

In `mobile/lib/askStorage.ts`, add these imports at the top of the file (after the existing `AsyncStorage` import):

```ts
import { getSupabaseClient } from '@/lib/supabase';
import { USER_DETAILS_USER_ID_COLUMN } from '@/lib/userDetails';
```

Update the type import block at the top to also pull in `AskQueryLogEntry`:

```ts
import type {
  AskChatItem,
  AskContextV2,
  AskHistoryTurn,
  AskQueryLogEntry,
  AskResponseMode,
  AskSavedPassage,
} from '@/features/ask/types';
```

Add this function at the end of the file:

```ts
export async function syncAskQueryToSupabase(
  entry: AskQueryLogEntry,
  userId: string,
): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { data, error: selectError } = await supabase
      .from('user_ask_queries')
      .select('queries')
      .eq(USER_DETAILS_USER_ID_COLUMN, userId)
      .maybeSingle();

    if (selectError) {
      console.error('[askStorage] syncAskQueryToSupabase select error', selectError.message);
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
      { onConflict: USER_DETAILS_USER_ID_COLUMN },
    );

    if (upsertError) {
      console.error('[askStorage] syncAskQueryToSupabase upsert error', upsertError.message);
    }
  } catch (err) {
    console.error('[askStorage] syncAskQueryToSupabase error', err);
  }
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `cd mobile && npx jest __tests__/lib/askStorage.test.ts`
Expected: PASS — all tests in the file, including the 4 new `syncAskQueryToSupabase` tests, succeed.

- [ ] **Step 6: Commit**

```bash
git add mobile/features/ask/types.ts mobile/lib/askStorage.ts mobile/__tests__/lib/askStorage.test.ts
git commit -m "Add syncAskQueryToSupabase for Guidance tab query history"
```

---

### Task 3: Wire the sync into `useAskState.sendMessage`

**Files:**
- Modify: `mobile/features/ask/useAskState.ts`
- Test: `mobile/__tests__/features/ask/useAskState.test.ts` (new file)

**Interfaces:**
- Consumes: `syncAskQueryToSupabase(entry: AskQueryLogEntry, userId: string): Promise<void>` from Task 2, `useUser()` from `@/lib/auth` (returns `{ user: { id: string; firstName: string | null } | null }`).

- [ ] **Step 1: Write the failing hook tests**

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
  syncAskQueryToSupabase: jest.fn(),
}));

import { useUser } from '@/lib/auth';
import { apiFetch } from '@/lib/apiFetch';
import {
  loadAskContext,
  loadAskHistory,
  loadAskMessages,
  loadSavedPassages,
  saveAskHistory,
  saveAskMessages,
  syncAskQueryToSupabase,
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

describe('useAskState query sync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadAskContext as jest.Mock).mockResolvedValue({ ...DEFAULT_ASK_CONTEXT });
    (loadAskMessages as jest.Mock).mockResolvedValue([]);
    (loadSavedPassages as jest.Mock).mockResolvedValue([]);
    (loadAskHistory as jest.Mock).mockResolvedValue([]);
    (saveAskMessages as jest.Mock).mockResolvedValue(undefined);
    (saveAskHistory as jest.Mock).mockResolvedValue(undefined);
    (syncAskQueryToSupabase as jest.Mock).mockResolvedValue(undefined);
    (apiFetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
  });

  it('syncs the query to Supabase after a successful response when signed in', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: { id: 'user_123', firstName: null } });

    const { result } = renderHook(() => useAskState());
    await waitFor(() => expect(result.current.isContextLoaded).toBe(true));

    await act(async () => {
      await result.current.sendMessage('What is dharma?');
    });

    expect(syncAskQueryToSupabase).toHaveBeenCalledWith(
      expect.objectContaining({
        question: 'What is dharma?',
        topic: 'career_dharma',
        mode: 'quick',
      }),
      'user_123',
    );
  });

  it('does not sync when no user is signed in', async () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });

    const { result } = renderHook(() => useAskState());
    await waitFor(() => expect(result.current.isContextLoaded).toBe(true));

    await act(async () => {
      await result.current.sendMessage('What is dharma?');
    });

    expect(syncAskQueryToSupabase).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd mobile && npx jest __tests__/features/ask/useAskState.test.ts`
Expected: FAIL — `syncAskQueryToSupabase` is not called (the hook doesn't call it yet).

- [ ] **Step 3: Wire the call into `sendMessage`**

In `mobile/features/ask/useAskState.ts`, update the import block (lines 14-25) to add `syncAskQueryToSupabase`:

```ts
import {
  DEFAULT_ASK_CONTEXT,
  clearAskConversation,
  loadAskContext,
  loadAskHistory,
  loadAskMessages,
  loadSavedPassages,
  saveAskContext,
  saveAskHistory,
  saveAskMessages,
  saveSavedPassages,
  syncAskQueryToSupabase,
} from '@/lib/askStorage';
```

Then, in `sendMessage`, right after the existing `await saveAskHistory(nextHistory);` call (currently line 181), add:

```ts
      if (user?.id) {
        syncAskQueryToSupabase(
          {
            question: trimmed,
            topic: parsed.topic,
            mode,
            timestamp: new Date().toISOString(),
          },
          user.id,
        ).catch(() => {});
      }
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd mobile && npx jest __tests__/features/ask/useAskState.test.ts`
Expected: PASS — both tests succeed.

- [ ] **Step 5: Run the full mobile test suite to check for regressions**

Run: `cd mobile && npx jest`
Expected: PASS — no existing tests broken by the new imports/calls.

- [ ] **Step 6: Commit**

```bash
git add mobile/features/ask/useAskState.ts mobile/__tests__/features/ask/useAskState.test.ts
git commit -m "Sync Guidance tab queries to Supabase after each successful response"
```

---

## Self-Review Notes

- **Spec coverage:** Table + RLS (Task 1), entry shape + read-modify-write sync function (Task 2), fire-and-forget hook wiring gated on `user?.id` (Task 3) — all spec sections have a corresponding task.
- **Manual migration:** Task 1 explicitly does not run the SQL against Supabase; the user does this themselves, per their instruction.
- **Type consistency:** `AskQueryLogEntry` is defined once in Task 2 Step 1 and used identically (same field names) in Task 2's tests, Task 2's implementation, and Task 3's `sendMessage` call — checked for drift.
