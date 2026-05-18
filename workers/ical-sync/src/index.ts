import { parseIcal, type BookedRange } from '../../../src/lib/ical';

export interface Env {
  AVAILABILITY: KVNamespace;
  PEARL_BEACH_ICAL_URL: string;
  LAKEHURST_ICAL_URL: string;
  REFRESH_SECRET: string;
}

interface PropertyConfig {
  slug: string;
  envKey: 'PEARL_BEACH_ICAL_URL' | 'LAKEHURST_ICAL_URL';
}

const PROPERTIES: PropertyConfig[] = [
  { slug: 'pearl-beach-lakehouse', envKey: 'PEARL_BEACH_ICAL_URL' },
  { slug: 'lakehurst-bungalow', envKey: 'LAKEHURST_ICAL_URL' },
];

interface AvailabilityRecord {
  slug: string;
  updated_at: string;
  last_success_at: string;
  booked_ranges: BookedRange[];
}

interface SyncResult {
  slug: string;
  ok: boolean;
  count?: number;
  error?: string;
}

async function syncOne(slug: string, url: string, kv: KVNamespace): Promise<SyncResult> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'pbc-ical-sync/1.0 (+https://pearlbeachcottages.com)' },
    cf: { cacheTtl: 0, cacheEverything: false },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  if (!text.includes('BEGIN:VCALENDAR')) {
    throw new Error('Response does not look like an iCalendar feed');
  }
  const { ranges } = parseIcal(text);
  const now = new Date().toISOString();
  const record: AvailabilityRecord = {
    slug,
    updated_at: now,
    last_success_at: now,
    booked_ranges: ranges,
  };
  await kv.put(`availability:${slug}`, JSON.stringify(record));
  return { slug, ok: true, count: ranges.length };
}

async function syncAll(env: Env): Promise<SyncResult[]> {
  // Serial rather than Promise.all so a slow VRBO endpoint can't starve the
  // other in the Worker's CPU budget. Two fetches in series is plenty fast.
  const results: SyncResult[] = [];
  for (const p of PROPERTIES) {
    const url = env[p.envKey];
    if (!url) {
      results.push({ slug: p.slug, ok: false, error: `Missing ${p.envKey}` });
      continue;
    }
    try {
      results.push(await syncOne(p.slug, url, env.AVAILABILITY));
    } catch (err) {
      // Intentionally do NOT write to KV here — last-good state is preserved.
      const message = err instanceof Error ? err.message : String(err);
      results.push({ slug: p.slug, ok: false, error: message });
      console.error(`sync ${p.slug} failed:`, message);
    }
  }
  return results;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export default {
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      syncAll(env).then((results) => {
        const summary = results
          .map((r) => (r.ok ? `${r.slug}=${r.count}` : `${r.slug}=ERR(${r.error})`))
          .join(' ');
        console.log(`cron sync: ${summary}`);
      }),
    );
  },

  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === 'GET' && url.pathname === '/') {
      return new Response('pbc-ical-sync ok', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      });
    }

    if (url.pathname === '/refresh') {
      if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      const auth = req.headers.get('authorization') ?? '';
      const expected = `Bearer ${env.REFRESH_SECRET}`;
      if (!env.REFRESH_SECRET || !timingSafeEqual(auth, expected)) {
        return new Response('Unauthorized', { status: 401 });
      }
      const results = await syncAll(env);
      const allOk = results.every((r) => r.ok);
      return Response.json(
        { ok: allOk, results, ran_at: new Date().toISOString() },
        { status: allOk ? 200 : 502 },
      );
    }

    return new Response('Not found', { status: 404 });
  },
};
