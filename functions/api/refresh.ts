// Pages Function: POST /api/refresh
// Owner-facing manual sync. Forwards to the standalone cron Worker's
// /refresh endpoint with the shared REFRESH_SECRET, so the bearer token
// stays server-side and never reaches the browser. Anyone with the URL
// can press the button — that's intentional. Worst case is the cron
// Worker fires a few extra times; no data exposure.

interface Env {
  REFRESH_SECRET: string;
  CRON_WORKER_REFRESH_URL?: string;
}

const DEFAULT_WORKER_REFRESH_URL =
  'https://pbc-ical-sync.probuilddigital1.workers.dev/refresh';
const TIMEOUT_MS = 15_000;

export const onRequestPost: PagesFunction<Env> = async ({ env }) => {
  if (!env.REFRESH_SECRET) {
    return Response.json(
      { ok: false, error: 'REFRESH_SECRET not configured on this environment' },
      { status: 500, headers: { 'cache-control': 'no-store' } },
    );
  }
  const url = env.CRON_WORKER_REFRESH_URL || DEFAULT_WORKER_REFRESH_URL;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.REFRESH_SECRET}` },
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return Response.json(data, {
      status: res.status,
      headers: { 'cache-control': 'no-store' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json(
      { ok: false, error: msg },
      { status: 502, headers: { 'cache-control': 'no-store' } },
    );
  } finally {
    clearTimeout(t);
  }
};

export const onRequest: PagesFunction<Env> = async ({ request }) => {
  return new Response(`Method ${request.method} not allowed`, {
    status: 405,
    headers: { allow: 'POST' },
  });
};
