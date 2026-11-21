import { getSupabaseAdminClient } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OFFERS = new Set(['diwali_puja', 'gita_18']);

type DemandRequest = {
  offer: string;
  option: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  slot: string | null;
  answers: Record<string, unknown> | null;
  source: string;
  utm: Record<string, unknown> | null;
  referrer: string | null;
  user_agent: string | null;
};

function str(value: unknown, max = 240) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function obj(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

async function forwardToWebhook(row: DemandRequest) {
  const webhookUrl = process.env.DEMAND_WEBHOOK_URL ?? process.env.WAITLIST_WEBHOOK_URL;
  if (!webhookUrl) return false;
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'demand_request', ...row }),
  });
  return res.ok;
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }
  const p = obj(body);
  if (!p) return Response.json({ error: 'Request body must be an object.' }, { status: 400 });

  // Honeypot: bots fill the hidden field; pretend success.
  if (str(p.website)) return Response.json({ ok: true, id: null });

  const offer = str(p.offer, 40);
  const email = str(p.email, 254).toLowerCase();
  if (!OFFERS.has(offer)) return Response.json({ error: 'Unknown offer.' }, { status: 400 });
  if (!EMAIL_PATTERN.test(email)) return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });

  const row: DemandRequest = {
    offer,
    option: str(p.option, 40) || null,
    email,
    full_name: str(p.fullName, 120) || null,
    phone: str(p.phone, 40) || null,
    city: str(p.city, 120) || null,
    slot: str(p.slot, 80) || null,
    answers: obj(p.answers),
    source: str(p.source, 80) || 'web',
    utm: obj(p.utm),
    referrer: request.headers.get('referer'),
    user_agent: request.headers.get('user-agent'),
  };

  const client = getSupabaseAdminClient();
  const hasWebhook = Boolean(process.env.DEMAND_WEBHOOK_URL ?? process.env.WAITLIST_WEBHOOK_URL);
  if (!client && !hasWebhook) {
    return Response.json({ error: 'Requests are not configured yet. Please email help@getmihira.com.' }, { status: 503 });
  }

  let id: string | null = null;
  let saved = false;
  if (client) {
    const { data, error } = await client.from('demand_requests').insert(row).select('id').single();
    if (error) console.error('[demand-request] insert failed', error);
    else {
      saved = true;
      id = (data as { id: string } | null)?.id ?? null;
    }
  }
  if (hasWebhook) {
    try {
      const ok = await forwardToWebhook(row);
      saved = saved || ok;
    } catch (err) {
      console.error('[demand-request] webhook failed', err);
    }
  }
  if (!saved) return Response.json({ error: 'We could not save your request. Please try again or email help@getmihira.com.' }, { status: 502 });

  return Response.json({ ok: true, id });
}
