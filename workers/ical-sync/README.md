# pbc-ical-sync

Cron Worker that pulls VRBO iCal feeds for both cottages every 30 minutes
and writes the parsed booked ranges to Cloudflare KV. Pages Functions
(`/api/availability`, `/api/inquiry`) read the same KV namespace.

## One-time setup

1. **Install + log in to Cloudflare**

   ```sh
   cd workers/ical-sync
   npm install
   npx wrangler login
   ```

2. **Create the shared KV namespace**

   ```sh
   npx wrangler kv namespace create AVAILABILITY
   ```

   Paste the returned `id` into `wrangler.toml` (`[[kv_namespaces]]` block).
   Keep this id — the Pages project will bind to the same namespace later.

3. **Set production secrets** (each will prompt for the value)

   ```sh
   npx wrangler secret put PEARL_BEACH_ICAL_URL
   npx wrangler secret put LAKEHURST_ICAL_URL
   npx wrangler secret put REFRESH_SECRET
   ```

   For `REFRESH_SECRET`, generate a long random string:
   ```sh
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Local dev values** — copy `.dev.vars.example` to `.dev.vars` and fill in.
   `.dev.vars` is gitignored.

## Verify before deploying

Run the unit tests:

```sh
npm test
```

Dry-run the parser against your real VRBO feed without touching KV:

```sh
npm run parse-url -- "https://www.vrbo.com/icalendar/<your-token>.ics"
```

Expected output is a list of booked ranges with night counts. Cross-check
against the VRBO owner calendar; the ranges should match (DTEND is exclusive,
so a 5-night booking starting June 10 appears as `2026-06-10 -> 2026-06-15`).

## Deploy

```sh
npx wrangler deploy
```

This activates the cron trigger (`*/30 * * * *`). First run happens within
30 minutes; force it immediately with the manual refresh below.

## Manual refresh (after blocking dates on VRBO directly)

```sh
curl -X POST https://pbc-ical-sync.<your-subdomain>.workers.dev/refresh \
  -H "Authorization: Bearer $REFRESH_SECRET"
```

Returns `{ ok, results, ran_at }`. Bookmark this on your phone as a single-tap
shortcut after manually editing the VRBO calendar.

## Watch the cron

```sh
npx wrangler tail
```

Each run logs `cron sync: pearl-beach-lakehouse=N lakehurst-bungalow=N`
where N is the number of merged booked ranges in KV.

## KV record shape

```json
// key: availability:pearl-beach-lakehouse
{
  "slug": "pearl-beach-lakehouse",
  "updated_at": "2026-05-17T12:00:00Z",
  "last_success_at": "2026-05-17T12:00:00Z",
  "booked_ranges": [
    { "start": "2026-06-10", "end": "2026-06-15" }
  ]
}
```

`start` inclusive, `end` exclusive — same convention as iCal DTEND.

## Failure behavior

- VRBO returns a non-2xx: the slug's KV record is **not** overwritten;
  `last_success_at` from the previous successful run is preserved.
- Response doesn't look like iCalendar: same — KV preserved.
- One feed fails, the other succeeds: only the failing one is skipped.
