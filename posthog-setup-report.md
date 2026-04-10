<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Aksha Expo app. The integration includes a PostHog client singleton (`lib/posthog.ts`), a `PostHogProvider` wrapping the root layout with autocapture enabled, manual screen tracking via Expo Router's `usePathname`, and 7 custom business events covering the full user lifecycle — from onboarding through guide selection, chat engagement, authentication, and churn.

## Files changed

| File | Change |
|------|--------|
| `app.config.js` | Created — replaces `app.json`, exposes `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` via `extra` |
| `.env` | Created — stores `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` |
| `lib/posthog.ts` | Created — PostHog client singleton using `expo-constants` extras |
| `app/_layout.tsx` | Added `PostHogProvider`, `ScreenTracker` component for manual screen tracking |
| `app/onboarding/index.tsx` | Added `onboarding_started` event |
| `app/onboarding/step-12.tsx` | Added `onboarding_completed` event with properties |
| `features/ask/GuideSelector.tsx` | Added `guide_selected` event with guide name and index |
| `features/chat/useChatState.ts` | Added `chat_message_sent` event with message length and conversation length |
| `features/auth/useSignIn.ts` | Added `user_signed_in` event with OAuth method (google/apple) |
| `app/(tabs)/profile.tsx` | Added `user_signed_out` event + `posthog.reset()`, and `guide_reset` event |

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `onboarding_started` | User taps "Begin My Alignment" on the first onboarding screen | `app/onboarding/index.tsx` |
| `onboarding_completed` | User completes onboarding via long-press "Hold to Enter" | `app/onboarding/step-12.tsx` |
| `guide_selected` | User commits to a spiritual guide via long-press in the carousel | `features/ask/GuideSelector.tsx` |
| `chat_message_sent` | User sends a message to their guide in the Ask tab | `features/chat/useChatState.ts` |
| `user_signed_in` | User successfully signs in with Google or Apple OAuth | `features/auth/useSignIn.ts` |
| `user_signed_out` | User signs out from the profile settings sheet | `app/(tabs)/profile.tsx` |
| `guide_reset` | User resets their guide selection from the profile screen | `app/(tabs)/profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/370251/dashboard/1433203
- **Onboarding Funnel** (onboarding_started → onboarding_completed): https://us.posthog.com/project/370251/insights/yNxmMAEc
- **Guide Selection Rate** (onboarding_completed → guide_selected): https://us.posthog.com/project/370251/insights/jF9N0135
- **Daily Active Chat Users** (chat_message_sent DAU over time): https://us.posthog.com/project/370251/insights/41z01257
- **Sign-in Method Breakdown** (user_signed_in by google/apple): https://us.posthog.com/project/370251/insights/32krsbJD
- **User Sign-out Trend** (user_signed_out DAU — churn signal): https://us.posthog.com/project/370251/insights/LU0GZ7kW

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
