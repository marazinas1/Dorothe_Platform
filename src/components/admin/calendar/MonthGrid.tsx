import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { monthGrid, todayIso } from "@/lib/calendar/month";
import type { AppointmentRow } from "@/lib/calendar/types";
import { Button } from "@/components/ui/button";

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
    <div className="rounded-[var(--radius)] border border-border bg-card p-3">
      <div className="admin-label grid grid-cols-7 gap-1 pb-2 text-center text-muted-foreground">
        {WEEKDAY_KEYS.map((key) => (
          <span key={key}>{t(`admin.calendar.weekday.${key}`)}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const count = counts.get(cell.iso) ?? 0;
          return (
            <Button
              key={cell.iso}
              type="button"
              onClick={() => onSelect(cell.iso)}
              variant="ghost"
              className={cn(
                "flex h-16 min-w-0 flex-col items-center justify-center gap-1 border border-transparent p-1 text-sm transition-colors",
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
                    "rounded-[var(--radius)] px-1.5 text-[10px]",
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
            </Button>
          );
        })}
      </div>
    </div>
  );
}
