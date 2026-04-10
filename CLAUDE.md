## Project: Aksha

Premium React Native spiritual app (Expo SDK 54, expo-router). Features: Daily Alignment, Muhurat Finder, Ask Aksha (streaming AI chat), Gurukul. See `docs/claude.md` for full architecture reference.

## Commands

```bash
npx expo start          # Start dev server (Expo Go / dev build)
npx expo run:ios        # Native iOS build
npx expo run:android    # Native Android build
```

## Tech Stack

| Domain | Tech |
|--------|------|
| Framework | Expo SDK 54, expo-router (file-based) |
| Language | TypeScript + TSX |
| Styling | React Native StyleSheet + `lib/theme.ts` |
| Auth | Clerk v2 (`@clerk/clerk-expo`) |
| DB | Supabase (Clerk JWT-authenticated via `getSupabaseClient()`) |
| Storage | AsyncStorage (chat, profile, daily cache) |
| AI | Perplexity `sonar-pro` (structured) / `sonar` (SSE streaming) |
| Animations | `moti` + `react-native-reanimated` |
| Payments | Stripe (`@stripe/stripe-react-native`) |

## Required Env Vars

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
PERPLEXITY_API_KEY=   # server-side only (app/api/ routes)
```

## Architecture

```
app/(tabs)/         # Main screens: index, ask-krishna, muhurat, gurukul, profile
app/onboarding/     # 12 sequential locked onboarding screens
app/api/            # Expo Server API routes (SSE chat, daily alignment, muhurat)
features/           # ask, auth, billing, chat, daily, gurukul, horoscope, muhurat, onboarding, profile
components/ui/      # Design system: GlowCard, GlassCard, TabBar, BottomSheet, SacredButton
lib/                # ai/, vedic/, theme.ts, typography.ts, supabase.ts, usage.ts
```

## Key Gotchas

- **FONT_SCALE = 1.14**: All font sizes go through `scaleFont()` in `lib/typography.ts` — don't hardcode raw font sizes
- **Supabase auth**: Uses Clerk JWT, not Supabase auth — always use `getSupabaseClient()`, never the raw client
- **Onboarding palette**: Onboarding uses separate warm `OB` palette (saffron/gold), not the main dark theme
- **Date pickers**: Platform-split — Android uses `DateTimePickerAndroid.open`, iOS uses custom bottom-sheet
- **AI streaming**: `/api/chat` returns SSE; client parses chunks in `useChatState.ts`
- **`lib/usage.ts`**: Tracks per-feature usage for paywall enforcement (Muhurat, Ask)

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
