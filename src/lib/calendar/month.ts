/** Pure month-grid helpers for the admin calendar. */

export interface MonthCell {
  /** ISO date, YYYY-MM-DD. */
  iso: string;
  dayOfMonth: number;
  inMonth: boolean;
}

export function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayIso(): string {
  return isoDate(new Date());
}

export function monthLabel(year: number, month: number, locale: string): string {
  return new Date(year, month, 1).toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
}

export function dayLabel(iso: string, locale: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d!).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** Monday-first 6x7 grid covering the given month. */
export function monthGrid(year: number, month: number): MonthCell[] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);
  const cells: MonthCell[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    cells.push({
      iso: isoDate(date),
      dayOfMonth: date.getDate(),
      inMonth: date.getMonth() === month,
    });
  }
  return cells;
}

export function monthRange(year: number, month: number): { from: string; to: string } {
  const cells = monthGrid(year, month);
  return { from: cells[0]!.iso, to: cells[cells.length - 1]!.iso };
}

export function shiftMonth(year: number, month: number, delta: number) {
  const date = new Date(year, month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}
