# Mihira Release QA Checklist

## Devices

- [ ] Test on at least one real iPhone
- [ ] Test on at least one real Android phone
- [ ] Confirm app installs cleanly from release builds

## Launch and Stability

- [ ] App launches successfully on first open
- [ ] App launches successfully after force close
- [ ] No immediate crash on startup
- [ ] Fonts, icon, splash, and theme load correctly

## Auth

- [ ] Sign in with all supported providers
- [ ] Sign out works cleanly
- [ ] Session persists across app relaunch
- [ ] Signed-out state behaves correctly

## Onboarding

- [ ] Full onboarding flow works end to end
- [ ] Birth date entry works
- [ ] Birth time entry works
- [ ] Unknown birth time path works
- [ ] Birth place search works
- [ ] Step transitions feel stable and smooth
- [ ] Onboarding completes into main app without broken state

## Daily Alignment

- [ ] Daily alignment loads with valid birth details
- [ ] Empty state behaves correctly without required birth details
- [ ] Cached data behaves correctly across reloads
- [ ] API errors fail gracefully

## Guidance

- [ ] Guidance intro state displays correctly
- [ ] Message send works
- [ ] Streaming response works
- [ ] Error state is user-readable
- [ ] Saved passages work
- [ ] Clear history works as expected

## Sacred Timing

- [ ] Sacred timing form validates correctly
- [ ] Date selection works on iPhone
- [ ] Date selection works on Android
- [ ] Query returns results for a normal test case
- [ ] Empty/error states are clear

## Sacred Days

- [ ] Sacred day cards render on the home screen when data exists
- [ ] Sacred day detail page opens correctly

## Profile and Account

- [ ] Profile screen loads correctly
- [ ] Editable profile fields save correctly
- [ ] Account screen opens correctly
- [ ] Delete-account flow works and is clearly explained

## Billing and Paywall

- [ ] Paywall warning state appears at the right threshold
- [ ] Paywall blocked state appears at the right threshold
- [ ] Upgrade CTA routes to the intended billing flow
- [ ] Entitlement refresh works after purchase
- [ ] Subscriber state is reflected in the UI

## Links and Routing

- [ ] Deep links open the app correctly
- [ ] Payment success flow returns to the app correctly
- [ ] Pricing flow opens the expected destination

## Analytics and Logging

- [ ] Key analytics events are visible in the analytics tool
- [ ] No sensitive data is unintentionally logged
- [ ] Production logs do not show obvious warnings on core flows

## Network and Failure Cases

- [ ] App handles weak network gracefully
- [ ] App handles offline launch without crashing
- [ ] API failures show a usable fallback message

## Final Signoff

- [ ] iOS release build approved
- [ ] Android release build approved
- [ ] Blocker list reviewed
- [ ] Store assets ready
- [ ] Legal URLs ready
- [ ] Billing flow approved
