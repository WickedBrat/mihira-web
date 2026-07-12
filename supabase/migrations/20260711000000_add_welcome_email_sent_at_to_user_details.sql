-- Tracks whether the onboarding-completion welcome email (sent via Resend) has
-- already gone out for a user, so the Database Webhook -> Edge Function pipeline
-- can no-op on retries or later unrelated updates to the row instead of
-- re-sending the email.

alter table public.user_details
  add column if not exists welcome_email_sent_at timestamptz;

comment on column public.user_details.welcome_email_sent_at is
  'Set once the onboarding-completion welcome email has been sent via Resend. Null means not yet sent.';
