import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  readDayHours,
  readHoursExceptions,
  WEEKDAYS,
  type DayHours,
  type OpeningHours,
  type Weekday,
} from "@/lib/config/opening-hours";
import { AdminSection } from "@/components/admin/ui/AdminSection";
import { OpeningHoursExceptions } from "./OpeningHoursExceptions";

type Props = {
  value: Record<string, unknown>;
  onChange: (next: OpeningHours) => void;
};

/**
 * One row per weekday: open/closed plus from/to times. Stored as a plain
 * record ({ mon: { from, to } }) — closed days are simply absent, so the JSON
 * in site_settings stays small and readable.
 */
export function OpeningHoursField({ value, onChange }: Props) {
  const { t } = useTranslation();

  const day = (d: (typeof WEEKDAYS)[number]) => readDayHours(value, d);

  function setDay(d: Weekday, next: DayHours | null) {
    const hours: OpeningHours = { exceptions: readHoursExceptions(value) };
    for (const key of WEEKDAYS) {
      const cur = key === d ? next : day(key);
      if (cur) hours[key] = cur;
    }
    onChange(hours);
  }

  return (
    <AdminSection title={t("admin.settings.hours.title")} description={t("admin.settings.hours.help")}>
      <div className="divide-y divide-border rounded-[var(--radius)] border border-border">
        {WEEKDAYS.map((d) => {
          const cur = day(d);
          const open = cur != null;
          return (
            <div key={d} className="flex items-center gap-3 px-3 py-2">
              <span className="w-24 text-sm font-medium">
                {t(`admin.settings.hours.days.${d}`)}
              </span>
              <Switch
                checked={open}
                onCheckedChange={(on) =>
                  setDay(d, on ? { from: "09:00", to: "17:00" } : null)
                }
                aria-label={t(`admin.settings.hours.days.${d}`)}
              />
              {open ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    className="w-28"
                    value={cur.from}
                    onChange={(e) => setDay(d, { ...cur, from: e.target.value })}
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="time"
                    className="w-28"
                    value={cur.to}
                    onChange={(e) => setDay(d, { ...cur, to: e.target.value })}
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t("admin.settings.hours.closed")}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <OpeningHoursExceptions
        value={readHoursExceptions(value)}
        onChange={(exceptions) => {
          const next: OpeningHours = { exceptions };
          for (const key of WEEKDAYS) {
            const hours = day(key);
            if (hours) next[key] = hours;
          }
          onChange(next);
        }}
      />
    </AdminSection>
  );
}
