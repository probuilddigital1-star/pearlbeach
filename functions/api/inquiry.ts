// Pages Function: POST /api/inquiry
// Sanitize → Turnstile verify → re-check availability vs KV → log to
// INQUIRIES KV → forward to n8n (best-effort) → return inquiry_id.

import { rangeIsBooked } from '../../src/lib/ical';

interface Env {
  AVAILABILITY: KVNamespace;
  INQUIRIES: KVNamespace;
  TURNSTILE_SECRET_KEY: string;
  N8N_INQUIRY_WEBHOOK_URL?: string;
}

interface AvailabilityRecord {
  slug: string;
  updated_at: string | null;
  last_success_at: string | null;
  booked_ranges: Array<{ start: string; end: string }>;
}

interface InquiryPayload {
  property_slug: string;
  property_name: string;
  vrbo_id: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  turnstile_token: string;
}

const KNOWN_SLUGS = new Set(['pearl-beach-lakehouse', 'lakehurst-bungalow']);
const MAX_GUESTS: Record<string, number> = {
  'pearl-beach-lakehouse': 13,
  'lakehurst-bungalow': 10,
};
const DEFAULT_N8N_WEBHOOK = 'https://zax76.app.n8n.cloud/webhook/pbc-inquiry';
const N8N_TIMEOUT_MS = 10_000;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clamp(s: unknown, max: number): string {
  return typeof s === 'string' ? s.trim().slice(0, max) : '';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toMessageHtml(raw: string): string {
  // Entity-escape user text + preserve line breaks in Gmail's HTML rendering.
  // The Function is the trust boundary — by the time n8n's Gmail node
  // injects this into the email body, all `<`, `>`, `&`, quotes are safe.
  return escapeHtml(raw).replace(/\n/g, '<br>');
}

function jsonError(status: number, error: string, extra?: Record<string, unknown>): Response {
  return Response.json({ ok: false, error, ...extra }, { status });
}

async function verifyTurnstile(token: string, secret: string, remoteIp: string | null): Promise<boolean> {
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return false;
  }
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteIp) body.set('remoteip', remoteIp);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
  if (!data.success) {
    console.warn('Turnstile verification failed', data['error-codes']);
  }
  return data.success === true;
}

async function forwardToN8n(url: string, payload: object): Promise<{ ok: boolean; status: number; error?: string }> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, status: 0, error: msg };
  } finally {
    clearTimeout(t);
  }
}

function generateInquiryId(submittedAt: string): string {
  // Format matches the KV key shape we agreed: inquiry:<ISO>:<6-char>
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 6);
  return `inquiry:${submittedAt}:${suffix}`;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Partial<InquiryPayload>;
  try {
    body = (await request.json()) as Partial<InquiryPayload>;
  } catch {
    return jsonError(400, 'Invalid JSON');
  }

  // --- 1. Parse + sanitize -------------------------------------------------
  const property_slug = clamp(body.property_slug, 64);
  const property_name = clamp(body.property_name, 80);
  const vrbo_id = clamp(body.vrbo_id, 16);
  const check_in = clamp(body.check_in, 10);
  const check_out = clamp(body.check_out, 10);
  const guests = Number(body.guests ?? 0);
  const name = clamp(body.name, 100);
  const email = clamp(body.email, 320).toLowerCase();
  const phone = clamp(body.phone, 50);
  // Keep `message` raw (trim + length-cap only) — this is the source of
  // truth in the KV log and Sheets row. Escape happens only at the
  // presentation boundary (`message_html` for the HTML email body).
  const message = clamp(body.message, 2000);
  const message_html = toMessageHtml(message);
  const turnstile_token = clamp(body.turnstile_token, 2048);

  if (!KNOWN_SLUGS.has(property_slug)) return jsonError(400, 'Unknown property');
  if (!ISO_DATE.test(check_in) || !ISO_DATE.test(check_out)) return jsonError(400, 'Invalid date format');
  if (check_out <= check_in) return jsonError(400, 'Check-out must be after check-in');
  const max = MAX_GUESTS[property_slug];
  if (!Number.isFinite(guests) || guests < 1 || guests > max) {
    return jsonError(400, `Guest count must be 1–${max}`);
  }
  if (!name) return jsonError(400, 'Name is required');
  if (!EMAIL_RE.test(email)) return jsonError(400, 'Invalid email');
  if (!phone) return jsonError(400, 'Phone is required');
  if (!turnstile_token) return jsonError(400, 'Missing verification token');

  // --- 2. Verify Turnstile -------------------------------------------------
  const remoteIp = request.headers.get('CF-Connecting-IP');
  const tsOk = await verifyTurnstile(turnstile_token, env.TURNSTILE_SECRET_KEY, remoteIp);
  if (!tsOk) return jsonError(400, 'Verification failed — please try again');

  // --- 3. Re-check availability vs KV (race protection) -------------------
  const record = await env.AVAILABILITY.get<AvailabilityRecord>(
    `availability:${property_slug}`,
    'json',
  );
  // Compute nights server-side; ignore client-supplied value.
  const nights = Math.round(
    (Date.parse(`${check_out}T00:00:00Z`) - Date.parse(`${check_in}T00:00:00Z`)) / 86_400_000,
  );
  if (record && rangeIsBooked(check_in, check_out, record.booked_ranges ?? [])) {
    return jsonError(409, 'These dates were just booked. Please pick new dates.');
  }
  const datesVerified = !!record;

  // --- 4. Generate inquiry_id ---------------------------------------------
  const submittedAt = new Date().toISOString();
  const inquiry_id = generateInquiryId(submittedAt);

  // --- 5. Log to INQUIRIES KV ---------------------------------------------
  const kvPayload = {
    inquiry_id,
    property_slug,
    property_name,
    vrbo_id,
    check_in,
    check_out,
    nights,
    guests,
    name,
    email,
    phone,
    message,
    submitted_at: submittedAt,
    dates_verified_available: datesVerified,
    remote_ip: remoteIp,
    user_agent: request.headers.get('User-Agent')?.slice(0, 200) ?? null,
  };
  try {
    await env.INQUIRIES.put(inquiry_id, JSON.stringify(kvPayload));
  } catch (err) {
    // KV write failure is rare and shouldn't drop a real inquiry on the floor.
    // Dump the full payload so a catastrophic case (KV write fails AND n8n
    // forward fails) is still recoverable from the Workers tail/log stream.
    console.error('INQUIRIES KV put failed — payload follows for manual recovery:', { err, kvPayload });
  }

  // --- 6. Forward to n8n (best-effort) ------------------------------------
  const n8nUrl = env.N8N_INQUIRY_WEBHOOK_URL || DEFAULT_N8N_WEBHOOK;
  // Strip turnstile_token + ip + UA from the n8n payload — they're not useful
  // for the email body and shouldn't leak to a third party. Send BOTH raw
  // `message` (for the Sheets row) and `message_html` (for the Gmail body);
  // the workflow's Sheets node uses raw, the Gmail node uses escaped.
  const n8nPayload = {
    inquiry_id,
    property_slug,
    property_name,
    vrbo_id,
    check_in,
    check_out,
    nights,
    guests,
    name,
    email,
    phone,
    message,
    message_html,
    submitted_at: submittedAt,
    dates_verified_available: datesVerified,
  };
  const n8nResult = await forwardToN8n(n8nUrl, n8nPayload);
  if (!n8nResult.ok) {
    // Log for manual recovery; user still gets a success response because
    // the inquiry is durably captured in KV.
    console.error('n8n forward failed', { inquiry_id, ...n8nResult });
  }

  // --- 7. Return -----------------------------------------------------------
  return Response.json(
    { ok: true, inquiry_id },
    { headers: { 'cache-control': 'no-store' } },
  );
};

export const onRequest: PagesFunction<Env> = async ({ request }) => {
  return new Response(`Method ${request.method} not allowed`, {
    status: 405,
    headers: { allow: 'POST' },
  });
};
