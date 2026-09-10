/** The window the dashboard agenda covers, and how it labels a day. */

/** Days ahead the agenda group looks. */
export const AGENDA_DAYS = 7;

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today through a week ahead, as plain calendar dates. */
export function agendaWindow(now: Date = new Date()): { from: string; to: string } {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + AGENDA_DAYS);
  return { from: iso(start), to: iso(end) };
}

/** "Mon 14 Sep" in the reader's own locale — short, because the row is narrow. */
export function agendaDayLabel(day: string, locale: string): string {
  const parts = day.split("-").map(Number);
  const date = new Date(parts[0] ?? 1970, (parts[1] ?? 1) - 1, parts[2] ?? 1);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}
