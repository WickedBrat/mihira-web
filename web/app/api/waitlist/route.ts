import { getSupabaseAdminClient } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLATFORM_VALUES = new Set(['ios', 'android', 'both']);

type WaitlistSignup = {
  email: string;
  full_name: string | null;
  platform: string;
  source: string;
  intent: string | null;
  referrer: string | null;
  user_agent: string | null;
  updated_at: string;
};

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

async function forwardToWebhook(signup: WaitlistSignup) {
  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;
  if (!webhookUrl) return true;

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signup),
  });

  return response.ok;
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return Response.json({ error: 'Request body must be an object.' }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const honeypot = readString(payload.website);

  if (honeypot) {
    return Response.json({
      ok: true,
      message: 'You are on the waitlist. We will email you when your invite is ready.',
    });
  }

  const email = readString(payload.email).toLowerCase();
  const fullName = readString(payload.fullName);
  const requestedPlatform = readString(payload.platform).toLowerCase();
  const platform = PLATFORM_VALUES.has(requestedPlatform) ? requestedPlatform : 'both';
  const source = readString(payload.source) || 'landing_page';
  const intent = readString(payload.intent);

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  if (fullName.length > 120) {
    return Response.json({ error: 'Name must be 120 characters or fewer.' }, { status: 400 });
  }

  const signup: WaitlistSignup = {
    email,
    full_name: fullName || null,
    platform,
    source: source.slice(0, 80),
    intent: intent ? intent.slice(0, 240) : null,
    referrer: request.headers.get('referer'),
    user_agent: request.headers.get('user-agent'),
    updated_at: new Date().toISOString(),
  };

  const client = getSupabaseAdminClient();
  const hasWebhook = Boolean(process.env.WAITLIST_WEBHOOK_URL);

  if (!client && !hasWebhook) {
    return Response.json(
      { error: 'The waitlist is not configured yet. Please email founders@getmihira.com.' },
      { status: 503 },
    );
  }

  let saved = false;

  if (client) {
    const { error } = await client
      .from('waitlist_signups')
      .upsert(signup, { onConflict: 'email' });

    if (error) {
      console.error('[waitlist] Supabase insert failed', error);
      return Response.json({ error: 'The waitlist could not save your email. Please try again.' }, { status: 500 });
    }

    saved = true;
  }

  if (hasWebhook) {
    try {
      const forwarded = await forwardToWebhook(signup);

      if (!forwarded && !saved) {
        return Response.json({ error: 'The waitlist could not save your email. Please try again.' }, { status: 502 });
      }
    } catch (error) {
      console.error('[waitlist] Webhook forward failed', error);

      if (!saved) {
        return Response.json({ error: 'The waitlist could not save your email. Please try again.' }, { status: 502 });
      }
    }
  }

  return Response.json({
    ok: true,
    message: 'You are on the waitlist. We will email you when your invite is ready.',
  });
}
