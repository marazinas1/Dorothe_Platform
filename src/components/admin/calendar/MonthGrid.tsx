import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { monthGrid, todayIso } from "@/lib/calendar/month";
import type { AppointmentRow } from "@/lib/calendar/types";

const WEEKDAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

interface Props {
  year: number;
  month: number;
  selected: string;
  rows: AppointmentRow[];
  onSelect: (iso: string) => void;
}

/** Month overview: each day shows how many entries it holds. */
export function MonthGrid({ year, month, selected, rows, onSelect }: Props) {
  const { t } = useTranslation();
  const cells = monthGrid(year, month);
  const today = todayIso();

  const counts = new Map<string, number>();
  for (const row of rows) {
    if (row.status === "cancelled") continue;
    counts.set(row.day, (counts.get(row.day) ?? 0) + 1);
  }

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="grid grid-cols-7 gap-1 pb-2 text-center text-[11px] uppercase tracking-wide text-muted-foreground">
        {WEEKDAY_KEYS.map((key) => (
          <span key={key}>{t(`admin.calendar.weekday.${key}`)}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const count = counts.get(cell.iso) ?? 0;
          return (
            <button
              key={cell.iso}
              type="button"
              onClick={() => onSelect(cell.iso)}
              className={cn(
                "flex h-16 flex-col items-center justify-center gap-1 rounded-md border border-transparent text-sm transition-colors",
                cell.inMonth ? "text-foreground" : "text-muted-foreground/50",
                cell.iso === today && "border-border font-semibold",
                cell.iso === selected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <span>{cell.dayOfMonth}</span>
              {count > 0 ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px]",
                    cell.iso === selected
                      ? "bg-primary-foreground/20"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              ) : (
                <span className="h-[14px]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
