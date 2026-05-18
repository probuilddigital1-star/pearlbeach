// Dry-run helper: fetch a real iCal URL and print what the parser sees.
// Usage: npm run parse-url -- "https://www.vrbo.com/icalendar/<token>.ics"

import { parseIcal } from '../../../src/lib/ical.ts';

const url = process.argv[2];
if (!url) {
  console.error('Usage: npm run parse-url -- "<ical-url>"');
  process.exit(1);
}

const res = await fetch(url);
if (!res.ok) {
  console.error(`Fetch failed: HTTP ${res.status} ${res.statusText}`);
  process.exit(1);
}
const text = await res.text();
const { ranges } = parseIcal(text);

console.log(`source bytes:    ${text.length}`);
console.log(`booked ranges:   ${ranges.length}`);
console.log('');
for (const r of ranges) {
  const startDate = new Date(`${r.start}T00:00:00Z`);
  const endDate = new Date(`${r.end}T00:00:00Z`);
  const nights = Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000);
  console.log(`  ${r.start} -> ${r.end}  (${nights} night${nights === 1 ? '' : 's'})`);
}
