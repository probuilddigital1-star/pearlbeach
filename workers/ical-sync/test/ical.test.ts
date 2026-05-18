import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseIcal, rangeIsBooked } from '../../../src/lib/ical.ts';

const CRLF = '\r\n';

function ical(...events: string[]): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PBC Tests//EN',
    ...events,
    'END:VCALENDAR',
    '',
  ].join(CRLF);
}

describe('parseIcal', () => {
  it('parses a single all-day VEVENT with DTEND exclusive', () => {
    const text = ical(
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20260610',
      'DTEND;VALUE=DATE:20260615',
      'SUMMARY:Reserved',
      'END:VEVENT',
    );
    const { ranges } = parseIcal(text);
    assert.deepEqual(ranges, [{ start: '2026-06-10', end: '2026-06-15' }]);
  });

  it('drops CANCELLED events', () => {
    const text = ical(
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20260610',
      'DTEND;VALUE=DATE:20260615',
      'STATUS:CANCELLED',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20260701',
      'DTEND;VALUE=DATE:20260705',
      'END:VEVENT',
    );
    const { ranges } = parseIcal(text);
    assert.deepEqual(ranges, [{ start: '2026-07-01', end: '2026-07-05' }]);
  });

  it('unfolds RFC 5545 continuation lines', () => {
    // The SUMMARY here is split across two lines with a leading space; the
    // parser ignores SUMMARY content, but the unfolder must not eat the
    // DTSTART line that follows.
    const text = [
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'SUMMARY:This summary is intentionally',
      ' folded onto a second line per RFC 5545',
      'DTSTART;VALUE=DATE:20260801',
      'DTEND;VALUE=DATE:20260803',
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join(CRLF);
    const { ranges } = parseIcal(text);
    assert.deepEqual(ranges, [{ start: '2026-08-01', end: '2026-08-03' }]);
  });

  it('merges back-to-back bookings (turnaround day unbookable)', () => {
    const text = ical(
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20260610',
      'DTEND;VALUE=DATE:20260615',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20260615',
      'DTEND;VALUE=DATE:20260620',
      'END:VEVENT',
    );
    const { ranges } = parseIcal(text);
    assert.deepEqual(ranges, [{ start: '2026-06-10', end: '2026-06-20' }]);
  });

  it('keeps separate ranges when there is a gap', () => {
    const text = ical(
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20260610',
      'DTEND;VALUE=DATE:20260615',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20260617',
      'DTEND;VALUE=DATE:20260620',
      'END:VEVENT',
    );
    const { ranges } = parseIcal(text);
    assert.deepEqual(ranges, [
      { start: '2026-06-10', end: '2026-06-15' },
      { start: '2026-06-17', end: '2026-06-20' },
    ]);
  });

  it('merges overlapping ranges and absorbs nested ones', () => {
    const text = ical(
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20260610',
      'DTEND;VALUE=DATE:20260620',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20260612',
      'DTEND;VALUE=DATE:20260616',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20260618',
      'DTEND;VALUE=DATE:20260625',
      'END:VEVENT',
    );
    const { ranges } = parseIcal(text);
    assert.deepEqual(ranges, [{ start: '2026-06-10', end: '2026-06-25' }]);
  });

  it('drops events with inverted or zero-length dates', () => {
    const text = ical(
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20260610',
      'DTEND;VALUE=DATE:20260610',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20260615',
      'DTEND;VALUE=DATE:20260612',
      'END:VEVENT',
    );
    const { ranges } = parseIcal(text);
    assert.deepEqual(ranges, []);
  });

  it('accepts DTSTART without explicit VALUE=DATE parameter', () => {
    // VRBO often writes "DTSTART:20260610" (no params). Per RFC the default
    // value type is DATE-TIME, but VRBO uses date-only; our parser is forgiving.
    const text = ical(
      'BEGIN:VEVENT',
      'DTSTART:20260610',
      'DTEND:20260615',
      'END:VEVENT',
    );
    const { ranges } = parseIcal(text);
    assert.deepEqual(ranges, [{ start: '2026-06-10', end: '2026-06-15' }]);
  });
});

describe('rangeIsBooked', () => {
  const booked = [
    { start: '2026-06-10', end: '2026-06-15' },
    { start: '2026-07-01', end: '2026-07-05' },
  ];

  it('returns true when request overlaps a booked range', () => {
    assert.equal(rangeIsBooked('2026-06-12', '2026-06-14', booked), true);
    assert.equal(rangeIsBooked('2026-06-08', '2026-06-12', booked), true);
    assert.equal(rangeIsBooked('2026-06-14', '2026-06-18', booked), true);
  });

  it('returns false when request fits in a gap', () => {
    assert.equal(rangeIsBooked('2026-06-15', '2026-06-20', booked), false);
    assert.equal(rangeIsBooked('2026-06-20', '2026-06-30', booked), false);
  });

  it('treats DTEND as exclusive on the booked side (turnaround OK)', () => {
    // booked ends 2026-06-15 (exclusive) -> a request starting 2026-06-15 is fine.
    assert.equal(rangeIsBooked('2026-06-15', '2026-06-17', booked), false);
    // request that ENDS on 2026-06-10 (exclusive) -> checks out the morning of 06-10,
    // which is the first booked night start; fine.
    assert.equal(rangeIsBooked('2026-06-05', '2026-06-10', booked), false);
  });

  it('rejects invalid ranges', () => {
    assert.equal(rangeIsBooked('2026-06-15', '2026-06-15', []), true);
    assert.equal(rangeIsBooked('2026-06-15', '2026-06-10', []), true);
  });
});
