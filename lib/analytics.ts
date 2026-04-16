import { posthog } from './posthog';

export const analytics = {
  // Onboarding
  onboardingStarted: () =>
    posthog.capture('onboarding_started'),

  onboardingCompleted: (props: { has_birth_place: boolean; commitment_tier: string | null; is_signed_in: boolean }) =>
    posthog.capture('onboarding_completed', props),

  // Auth / Identity
  userSignedIn: (props: { method: 'google' | 'apple' }) =>
    posthog.capture('user_signed_in', props),

  userSignedOut: () =>
    posthog.capture('user_signed_out'),

  userIdentified: (userId: string, traits?: { email?: string; name?: string | null }) =>
    posthog.identify(userId, traits ?? {}),

  // Guide
  guideSelected: (props: { guide_name: string; guide_index: number }) =>
    posthog.capture('guide_selected', props),

  guideReset: () =>
    posthog.capture('guide_reset'),

  // Chat
  chatMessageSent: (props: { guide: string | null; message_length: number; conversation_length: number }) =>
    posthog.capture('chat_message_sent', props),

  // Muhurat
  muhuratQueried: (props: { event_description_length: number; date_range_days: number }) =>
    posthog.capture('muhurat_queried', props),

  // Paywall
  paywallShown: (props: { feature: 'ask' | 'muhurat'; mode: 'warning' | 'blocked' }) =>
    posthog.capture('paywall_shown', props),

  paywallDismissed: (props: { feature: 'ask' | 'muhurat'; mode: 'warning' | 'blocked' }) =>
    posthog.capture('paywall_dismissed', props),

  paywallUpgradeTapped: (props: { feature: 'ask' | 'muhurat' }) =>
    posthog.capture('paywall_upgrade_tapped', props),

  paywallProceedTapped: (props: { feature: 'ask' | 'muhurat' }) =>
    posthog.capture('paywall_proceed_tapped', props),

  // Revenue
  subscriptionUpgraded: (props: { plan: string; simulated?: boolean }) =>
    posthog.capture('subscription_upgraded', props),
};
