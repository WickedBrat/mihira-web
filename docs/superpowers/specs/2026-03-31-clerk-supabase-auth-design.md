# Clerk + Supabase Auth & Profile Design

**Date:** 2026-03-31
**Scope:** Add Clerk (Google + Apple OAuth) auth and Supabase profile persistence to the existing Aksha Expo app.

---

## 1. Goals

- Users can sign in with Google or Apple from within the settings drawer on the Profile tab.
- Signed-in users have their profile (name, birth date/time, birth place, language, region, focus area) persisted to Supabase.
- Signed-out users retain local-only editing (current behavior) with no disruption.
- Profile data is protected by Supabase Row-Level Security — users can only read/write their own row.

---

## 2. Tech Choices

| Concern | Choice |
|---|---|
| Auth provider | Clerk (`@clerk/clerk-expo`) |
| Auth methods | Google OAuth + Apple OAuth only |
| Session storage | `expo-secure-store` (Clerk token cache) |
| Database | Supabase (Postgres) |
| Auth bridge | Clerk JWT template → Supabase custom JWT validation |
| Supabase client | `@supabase/supabase-js` with custom fetch injecting Clerk JWT |

---

## 3. Environment Variables

`.env.local` (git-ignored):
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

`.env.example` (committed):
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 4. Supabase Setup (manual, one-time)

### 4.1 JWT Config
In Supabase dashboard → Settings → API → JWT Secret: note the secret.
In Clerk dashboard → JWT Templates → New template named `supabase`:
```json
{
  "sub": "{{user.id}}",
  "role": "authenticated"
}
```
Set the signing algorithm to HS256 and paste the Supabase JWT secret.

### 4.2 Database Schema
```sql
CREATE TABLE profiles (
  id           text PRIMARY KEY,       -- Clerk user ID
  name         text,
  birth_dt     text,                   -- "DD/MM/YYYY, HH:MM AM"
  birth_place  text,
  language     text NOT NULL DEFAULT 'English',
  region       text NOT NULL DEFAULT 'India',
  focus_area   text,
  updated_at   timestamptz NOT NULL DEFAULT now()
);
```

### 4.3 Row-Level Security
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.jwt() ->> 'sub' = id);

CREATE POLICY "Users can upsert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.jwt() ->> 'sub' = id);
```

---

## 5. New Files

### `lib/clerk.ts`
Exports `tokenCache` using `expo-secure-store` for Clerk session persistence. Re-exported from root layout.

### `lib/supabase.ts`
Creates the Supabase client. Exports a factory `getSupabaseClient(getToken)` that wraps `global.fetch` to inject `Authorization: Bearer <jwt>` using Clerk's `getToken({ template: 'supabase' })`. Called inside hooks (not at module level) so the token is always fresh.

### `features/profile/useProfile.ts`
React hook:
- Reads `isSignedIn`, `userId`, `getToken` from `useAuth()`.
- On mount (signed-in): `upsert` a blank profile row (safe no-op if row exists), then fetch and populate local state.
- Exposes `profile`, `updateField(key, value)`, `isSaving`.
- 800ms debounced `useEffect` auto-saves to Supabase when any field changes and user is signed in.

### `features/auth/OAuthButton.tsx`
Pressable row component: icon (Google/Apple SVG) + label + chevron. Calls `startOAuthFlow()` from `useOAuth({ strategy })`. On success, closes the auth sheet via callback.

### `features/auth/useSignIn.ts`
Thin hook wrapping `useOAuth` for Google and Apple strategies. Exposes `signInWithGoogle()`, `signInWithApple()`, `isLoading`.

---

## 6. Modified Files

### `app/_layout.tsx`
Wrap the root navigator with:
```tsx
<ClerkProvider publishableKey={...} tokenCache={tokenCache}>
  {/* existing content */}
</ClerkProvider>
```

### `app/(tabs)/profile.tsx`
- Replace `useState(INITIAL_PROFILE)` with `useProfile()`.
- Replace the hardcoded "Sign In" button in the settings drawer with auth-aware rendering:
  - Signed-out: "Sign In" button → opens an auth sheet (new `MotiView` bottom sheet with two `OAuthButton` rows).
  - Signed-in: User identity row (initials + name + email) + "Sign Out" pressable row at drawer bottom.
- Language `selectLanguage` and region → call `updateField('language', value)` / `updateField('region', value)` to sync with Supabase.
- User ID row shows Clerk `userId` (truncated to 8 chars) when signed in.

### `app/onboarding/index.tsx`
On "Let's Start" press: if `isSignedIn`, call `updateField('focus_area', selected)` before navigating.

---

## 7. Auth Flow (UI)

```
Settings drawer (signed-out)
  └── "Sign In" button
        └── Tapping opens auth sheet (MotiView, same pattern as existing date picker sheet)
              ├── [Google icon]  Continue with Google
              └── [Apple icon]   Continue with Apple
                    └── On success → sheet closes, drawer shows identity row

Settings drawer (signed-in)
  ├── Identity row: [initials avatar] Name · email
  ├── Content Language dropdown (synced to Supabase)
  ├── Region row (synced to Supabase)
  ├── User ID row (Clerk ID truncated)
  └── Sign Out row (calls Clerk signOut())
```

---

## 8. Error Handling

- Supabase save failures: silently log to console; `isSaving` resets to false. No disruptive UI — profile edits are low-stakes.
- OAuth failures: Clerk surfaces its own error modal. `useSignIn` catches and logs; no additional handling.
- Missing env vars: app throws at startup with a descriptive message (checked in `lib/clerk.ts` and `lib/supabase.ts`).

---

## 9. Out of Scope

- Push notifications or email from Clerk webhooks.
- Supabase Realtime / subscriptions.
- Profile photo upload.
- Password reset or email/password auth.
- Admin or multi-tenant access patterns.
