// Minimal RFC 5545 iCal parser scoped to what VRBO's outbound feed emits:
// all-day VEVENT blocks with DTSTART / DTEND (exclusive). Anything we don't
// need (TZID, RRULE, VTODO, alarms, etc.) is intentionally ignored.
//
// Single source of truth for both:
//   - workers/ical-sync/    (cron Worker that writes KV)
//   - functions/api/        (Pages Functions that race-check against KV)
// Pure TS, no runtime deps, no DOM or Cloudflare globals.

export interface BookedRange {
  /** Inclusive YYYY-MM-DD (first night booked). */
  start: string;
  /** Exclusive YYYY-MM-DD (per iCal DTEND; the first night NOT booked). */
  end: string;
}

export interface ParsedCalendar {
  ranges: BookedRange[];
}

const CRLF = /\r?\n/;

function unfold(text: string): string[] {
  // RFC 5545 §3.1: continuation lines start with a single LWSP char and
  // belong to the previous logical line.
  const raw = text.split(CRLF);
  const out: string[] = [];
  for (const line of raw) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && out.length > 0) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

function toIsoDate(value: string): string | null {
  // Accept YYYYMMDD (all-day) or YYYYMMDDTHHMMSS[Z] — collapse to the date.
  // VRBO emits all-day; the timestamp branch is defensive.
  const m = /^(\d{4})(\d{2})(\d{2})(?:T\d{6}Z?)?$/.exec(value);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function valueOf(line: string): string {
  // Strip property parameters: "DTSTART;VALUE=DATE:20260610" -> "20260610".
  const colon = line.indexOf(':');
  return colon === -1 ? '' : line.slice(colon + 1).trim();
}

export function parseIcal(text: string): ParsedCalendar {
  const lines = unfold(text);
  const ranges: BookedRange[] = [];

  let inEvent = false;
  let start: string | undefined;
  let end: string | undefined;
  let status: string | undefined;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      start = end = status = undefined;
      continue;
    }
    if (line === 'END:VEVENT') {
      // Drop cancelled events and anything with malformed dates.
      // Defensive: also drop end<=start (zero-length / inverted).
      if (start && end && status !== 'CANCELLED' && end > start) {
        ranges.push({ start, end });
      }
      inEvent = false;
      continue;
    }
    if (!inEvent) continue;

    // Property keys may carry parameters separated by ';', so test by prefix.
    if (line.startsWith('DTSTART')) {
      const iso = toIsoDate(valueOf(line));
      if (iso) start = iso;
    } else if (line.startsWith('DTEND')) {
      const iso = toIsoDate(valueOf(line));
      if (iso) end = iso;
    } else if (line.startsWith('STATUS:')) {
      status = valueOf(line);
    }
  }

  // Sort, then merge overlapping or back-to-back ranges. Back-to-back
  // (next.start === prev.end) is merged because a turnaround day is unbookable
  // for a fresh inquiry — conservative is the right default here.
  ranges.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
  const merged: BookedRange[] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r.start <= last.end) {
      if (r.end > last.end) last.end = r.end;
    } else {
      merged.push({ start: r.start, end: r.end });
    }
  }
  return { ranges: merged };
}

/**
 * True when [checkIn, checkOut) overlaps any booked range. Inputs and ranges
 * are both half-open (end exclusive), matching iCal DTEND semantics.
 */
export function rangeIsBooked(
  checkIn: string,
  checkOut: string,
  booked: BookedRange[],
): boolean {
  if (checkOut <= checkIn) return true; // invalid; reject defensively
  for (const r of booked) {
    if (checkIn < r.end && checkOut > r.start) return true;
  }
  return false;
}
