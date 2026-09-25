// Shape and pure helpers for the first-party analytics summary. No imports of
// server or browser code, so both sides can use it.

export const ANALYTICS_RANGES = [7, 30, 90] as const;
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];

export interface PeriodTotals {
  views: number;
  visits: number;
  single_page: number;
  avg_seconds: number;
}

const ZERO: PeriodTotals = { views: 0, visits: 0, single_page: 0, avg_seconds: 0 };

export interface AnalyticsSummary {
  totals: PeriodTotals;
  previous: PeriodTotals;
  daily: { day: string; views: number; visits: number }[];
  top_pages: { path: string; views: number }[];
  channels: { channel: string; views: number }[];
  referrers: { referrer_host: string; views: number }[];
  countries: { country: string; views: number }[];
  devices: { device: string; views: number }[];
  inquiries: number;
}

export const EMPTY_SUMMARY: AnalyticsSummary = {
  totals: ZERO,
  previous: ZERO,
  daily: [],
  top_pages: [],
  channels: [],
  referrers: [],
  countries: [],
  devices: [],
  inquiries: 0,
};

/** UTC day, `offsetDays` before today. The table stores UTC days. */
export function isoDay(offsetDays: number, now: Date = new Date()): string {
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

export function isAnalyticsRange(value: unknown): value is AnalyticsRange {
  return (ANALYTICS_RANGES as readonly unknown[]).includes(value);
}

/** Null means "no comparable previous period", which is not the same as 0%. */
export function percentChange(current: number, previous: number): number | null {
  if (!previous) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

/** Fills every day in the range so the chart never draws a broken series. */
export function buildSeries(
  daily: AnalyticsSummary["daily"],
  range: AnalyticsRange,
  now: Date = new Date(),
): { day: string; views: number; visits: number }[] {
  const byDay = new Map(daily.map((d) => [d.day, d]));
  const out: { day: string; views: number; visits: number }[] = [];
  for (let i = range - 1; i >= 0; i--) {
    const key = isoDay(i, now);
    const row = byDay.get(key);
    out.push({
      day: key,
      views: Number(row?.views ?? 0),
      visits: Number(row?.visits ?? 0),
    });
  }
  return out;
}

/** Engaged seconds as "1m 05s". */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  return m ? `${m}m ${String(s % 60).padStart(2, "0")}s` : `${s}s`;
}
