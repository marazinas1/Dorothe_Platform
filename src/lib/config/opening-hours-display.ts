import { readDayHours, readHoursExceptions, WEEKDAYS } from "./opening-hours";

type Translate = (key: string, options?: Record<string, unknown>) => string;
export type DisplayHours = { day: string; time: string };

export function openingHoursRows(
  value: Record<string, unknown>,
  locale: string,
  t: Translate,
): { weekly: DisplayHours[]; exceptions: DisplayHours[] } {
  const weekly = WEEKDAYS.map((day) => {
    const hours = readDayHours(value, day);
    return {
      day: t(`admin.settings.hours.days.${day}`),
      time: hours ? `${hours.from}–${hours.to}` : t("admin.settings.hours.closed"),
    };
  });

  const exceptions = readHoursExceptions(value)
    .filter((row) => row.date)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((row) => ({
      day: new Date(`${row.date}T12:00:00Z`).toLocaleDateString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      }),
      time: [row.from && row.to ? `${row.from}–${row.to}` : t("admin.settings.hours.closed"), row.note]
        .filter(Boolean)
        .join(" · "),
    }));

  return { weekly, exceptions };
}