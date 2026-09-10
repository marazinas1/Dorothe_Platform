export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Weekday = (typeof WEEKDAYS)[number];
export type DayHours = { from: string; to: string };
export type HoursException = { id: string; date: string; from?: string; to?: string; note?: string };

export type OpeningHours = Partial<Record<Weekday, DayHours>> & {
  exceptions?: HoursException[];
};

export function readDayHours(value: Record<string, unknown>, day: Weekday): DayHours | null {
  const raw = value[day];
  if (!raw || typeof raw !== "object") return null;
  const entry = raw as Record<string, unknown>;
  return {
    from: typeof entry.from === "string" ? entry.from : "09:00",
    to: typeof entry.to === "string" ? entry.to : "17:00",
  };
}

export function readHoursExceptions(value: Record<string, unknown>): HoursException[] {
  if (!Array.isArray(value.exceptions)) return [];
  return value.exceptions.filter((entry): entry is HoursException => {
    if (!entry || typeof entry !== "object") return false;
    const row = entry as Record<string, unknown>;
    return typeof row.id === "string" && typeof row.date === "string";
  });
}