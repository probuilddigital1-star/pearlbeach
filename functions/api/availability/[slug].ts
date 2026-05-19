// Pages Function: GET /api/availability/{slug}
// Returns the cron-synced availability record for one cottage. KV is written
// by the standalone Worker at workers/ical-sync/; we only read here.

interface Env {
  AVAILABILITY: KVNamespace;
}

interface BookedRange {
  start: string;
  end: string;
}

interface AvailabilityRecord {
  slug: string;
  updated_at: string;
  last_success_at: string;
  booked_ranges: BookedRange[];
}

// Hardcoded slug allowlist. Keep in sync with PROPERTIES in
// workers/ical-sync/src/index.ts and src/config/constants.ts.
const KNOWN_SLUGS = new Set(['pearl-beach-lakehouse', 'lakehurst-bungalow']);

export const onRequestGet: PagesFunction<Env, 'slug'> = async ({ params, env }) => {
  const slug = String(params.slug ?? '');
  if (!KNOWN_SLUGS.has(slug)) {
    return Response.json({ error: 'Unknown property' }, { status: 404 });
  }

  const record = await env.AVAILABILITY.get<AvailabilityRecord>(
    `availability:${slug}`,
    'json',
  );

  if (!record) {
    // Cold KV (first cron run hasn't completed). Return an empty,
    // well-formed payload so the frontend can render "no bookings known yet"
    // instead of erroring. 503 hints to clients (and our monitoring) that
    // this is transient.
    return Response.json(
      {
        slug,
        updated_at: null,
        last_success_at: null,
        booked_ranges: [],
        warning: 'No availability data yet — cron sync has not completed.',
      },
      {
        status: 503,
        headers: { 'cache-control': 'no-store' },
      },
    );
  }

  return Response.json(record, {
    headers: {
      // 5-minute edge + client cache. Aligned with the 30-min cron — worst
      // case staleness is ~35 min, which is well inside VRBO's own ~30-min
      // outbound iCal refresh window.
      'cache-control': 'public, max-age=300, s-maxage=300',
    },
  });
};

// HEAD: return the same headers GET would, with no body. Standard HTTP
// semantics, AND it sidesteps a real-world bug: some mobile carrier
// proxies probe new URLs with HEAD before forwarding a GET, and treat a
// 405 response as "this URL is unfetchable" — blacklisting the GET that
// would have followed. The cottage page calendar was hitting the
// fallback only on mobile because of this. POST endpoints were
// unaffected because the carrier proxy only HEAD-probes GET-ish targets.
export const onRequestHead: PagesFunction<Env, 'slug'> = async (ctx) => {
  const r = await onRequestGet(ctx);
  return new Response(null, { status: r.status, headers: r.headers });
};

// All other methods → 405. Allow now lists GET + HEAD so a polite proxy
// reading the header knows both are acceptable.
export const onRequest: PagesFunction<Env> = async ({ request }) => {
  return new Response(`Method ${request.method} not allowed`, {
    status: 405,
    headers: { allow: 'GET, HEAD' },
  });
};
