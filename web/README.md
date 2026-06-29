# Mihira Web

Next.js site for `getmihira.com`.

## Includes

- Landing page at `/`
- Join waitlist form at `/` backed by `POST /api/waitlist`
- Privacy policy at `/privacy`
- Terms and conditions at `/terms`
- Shared backend routes exposed under `/v1/api/*`

## API routes

- `POST /api/waitlist`
- `POST /v1/api/ask`
- `POST /v1/api/chat`
- `POST /v1/api/narad`
- `POST /v1/api/wisdom/daily`
- `POST /v1/api/wisdom/muhurat`
- `POST /v1/api/wisdom/daily-arth-reflection`

`POST /api/wisdom/daily-arth-reflection` is also exposed as a compatibility
route for native builds that are configured with a web API base URL.

These routes reuse the shared handlers in `/lib/server/routes`, so the Expo app and the Next app stay aligned.

## Local development

1. Copy `.env.example` to `.env.local`
2. Set `PERPLEXITY_API_KEY`
3. Set `EXPO_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY` for Daily Arth reflection writes and waitlist storage, or set `WAITLIST_WEBHOOK_URL` to forward waitlist signups elsewhere
4. Run `npm install`
5. Run `npm run dev`

## Production notes

- Point `getmihira.com` at this app
- Set `PERPLEXITY_API_KEY` in the deployment environment
- Apply the latest Supabase migrations so `public.spiritual_quotes.daily_reflection` and `public.waitlist_signups` exist, then set `EXPO_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY` for Daily Arth reflection writes and waitlist submissions
- If you later move the shared server logic, keep the `/v1/api/*` contract stable
