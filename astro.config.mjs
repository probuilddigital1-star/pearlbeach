import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseIcal, rangeIsBooked } from './src/lib/ical.ts';

// Dev-only middleware: stands in for Cloudflare Pages Functions so `astro dev`
// works end-to-end without wrangler + KV. Production uses the real Pages
// Functions in functions/api/. Both /api/availability and /api/inquiry mocks
// live here and share a single in-memory cache for the parsed iCal feeds.
function devApiMockPlugin() {
  const slugToEnvKey = {
    'pearl-beach-lakehouse': 'PEARL_BEACH_ICAL_URL',
    'lakehurst-bungalow': 'LAKEHURST_ICAL_URL',
  };
  const MAX_GUESTS = {
    'pearl-beach-lakehouse': 13,
    'lakehurst-bungalow': 10,
  };

  function loadDevVars() {
    try {
      const path = fileURLToPath(new URL('./workers/ical-sync/.dev.vars', import.meta.url));
      const text = readFileSync(path, 'utf8');
      const out = {};
      for (const line of text.split(/\r?\n/)) {
        const m = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?(.*?)"?\s*$/.exec(line);
        if (m) out[m[1]] = m[2];
      }
      return out;
    } catch {
      return {};
    }
  }

  // 5-min TTL matches the production /api/availability Cache-Control.
  const availabilityCache = new Map();
  const TTL_MS = 5 * 60 * 1000;

  async function getAvailability(slug) {
    const envKey = slugToEnvKey[slug];
    if (!envKey) return { error: 'unknown-slug' };
    const cached = availabilityCache.get(slug);
    if (cached && Date.now() - cached.at < TTL_MS) return cached.data;

    const vars = loadDevVars();
    const url = vars[envKey] || process.env[envKey];
    if (!url) {
      const empty = {
        slug, updated_at: null, last_success_at: null, booked_ranges: [],
        warning: `Missing ${envKey} in workers/ical-sync/.dev.vars — dev mock fell back to empty.`,
      };
      return empty;
    }
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const text = await r.text();
      const { ranges } = parseIcal(text);
      const now = new Date().toISOString();
      const data = { slug, updated_at: now, last_success_at: now, booked_ranges: ranges };
      availabilityCache.set(slug, { at: Date.now(), data });
      return data;
    } catch (err) {
      return { error: String(err) };
    }
  }

  function sendJson(res, status, body) {
    res.statusCode = status;
    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    res.end(JSON.stringify(body));
  }

  async function readJsonBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => {
        try {
          const text = Buffer.concat(chunks).toString('utf8');
          resolve(text ? JSON.parse(text) : {});
        } catch (e) { reject(e); }
      });
      req.on('error', reject);
    });
  }

  return {
    name: 'pbc-dev-api-mock',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // GET /api/availability/{slug}
        const availMatch = req.url?.match(/^\/api\/availability\/([a-z0-9-]+)(?:\?|$)/);
        if (availMatch && req.method === 'GET') {
          const slug = availMatch[1];
          const data = await getAvailability(slug);
          if (data?.error === 'unknown-slug') return sendJson(res, 404, { error: 'Unknown property' });
          if (data?.error) return sendJson(res, 502, { error: data.error });
          return sendJson(res, 200, data);
        }

        // POST /api/inquiry — mirror the real Pages Function's behavior
        // closely: validate, simulate Turnstile, race-check against the same
        // parsed feed, return the same status codes.
        if (req.url?.startsWith('/api/inquiry') && req.method === 'POST') {
          let body;
          try { body = await readJsonBody(req); } catch {
            return sendJson(res, 400, { ok: false, error: 'Invalid JSON' });
          }

          const slug = String(body.property_slug ?? '');
          if (!slugToEnvKey[slug]) return sendJson(res, 400, { ok: false, error: 'Unknown property' });

          const checkIn = String(body.check_in ?? '');
          const checkOut = String(body.check_out ?? '');
          if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) {
            return sendJson(res, 400, { ok: false, error: 'Invalid date format' });
          }
          if (checkOut <= checkIn) return sendJson(res, 400, { ok: false, error: 'Check-out must be after check-in' });

          const guests = Number(body.guests ?? 0);
          const max = MAX_GUESTS[slug];
          if (!guests || guests < 1 || guests > max) {
            return sendJson(res, 400, { ok: false, error: `Guest count must be 1–${max}` });
          }
          const name = typeof body.name === 'string' ? body.name.trim() : '';
          const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
          const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
          // Keep validation aligned with functions/api/inquiry.ts so dev and
          // prod behave identically on the 400 branches the client tests against.
          if (!name) return sendJson(res, 400, { ok: false, error: 'Name is required' });
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return sendJson(res, 400, { ok: false, error: 'Invalid email' });
          }
          if (!phone) return sendJson(res, 400, { ok: false, error: 'Phone is required' });
          if (!body.turnstile_token) {
            return sendJson(res, 400, { ok: false, error: 'Missing verification token' });
          }
          // Dev mock does NOT call Cloudflare's siteverify endpoint — we trust
          // the test widget. Any non-empty token passes. If you want to test
          // the 400 branch, submit with the token field stripped via DevTools.

          // Re-check availability using the SAME cache the calendar uses.
          const avail = await getAvailability(slug);
          if (avail?.booked_ranges && rangeIsBooked(checkIn, checkOut, avail.booked_ranges)) {
            return sendJson(res, 409, { ok: false, error: 'Dates just booked' });
          }

          // Keep escape logic mirrored with functions/api/inquiry.ts so the
          // payload shape we'd forward to n8n is identical in dev and prod.
          const escapeHtml = (s) => s
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
          const toMessageHtml = (s) => escapeHtml(s).replace(/\n/g, '<br>');
          const message = typeof body.message === 'string' ? body.message.trim().slice(0, 2000) : '';
          const message_html = toMessageHtml(message);

          const submittedAt = new Date().toISOString();
          const inquiry_id = `inquiry:${submittedAt}:${Math.random().toString(36).slice(2, 8)}`;
          const nights = Math.round(
            (Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86_400_000,
          );
          const datesVerified = !!avail?.booked_ranges;
          const n8nPayload = {
            inquiry_id,
            property_slug: slug,
            property_name: typeof body.property_name === 'string' ? body.property_name : '',
            vrbo_id: typeof body.vrbo_id === 'string' ? body.vrbo_id : '',
            check_in: checkIn,
            check_out: checkOut,
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
          // eslint-disable-next-line no-console
          console.log('[dev /api/inquiry] would forward to n8n:', JSON.stringify(n8nPayload, null, 2));
          return sendJson(res, 200, { ok: true, inquiry_id });
        }

        return next();
      });
    },
  };
}

export default defineConfig({
  site: 'https://pearlbeachcottages.com',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/concierge/'),
    }),
    icon()
  ],
  output: 'static',
  server: {
    host: '0.0.0.0',
    port: 4321
  },
  vite: {
    plugins: [devApiMockPlugin()],
    build: {
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  }
});
