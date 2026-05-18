// Emit the exact KV record that the cron Worker would write, for verification.
// Usage: npm run --silent parse-url-json -- "<slug>" "<ical-url>"
import { parseIcal } from '../../../src/lib/ical.ts';

const [slug, url] = process.argv.slice(2);
if (!slug || !url) {
  console.error('Usage: tsx scripts/dump-json.ts <slug> <ical-url>');
  process.exit(1);
}

const res = await fetch(url);
if (!res.ok) {
  console.error(`Fetch failed: HTTP ${res.status}`);
  process.exit(1);
}
const { ranges } = parseIcal(await res.text());
const now = new Date().toISOString();
const record = {
  slug,
  updated_at: now,
  last_success_at: now,
  booked_ranges: ranges,
};
console.log(JSON.stringify(record, null, 2));
