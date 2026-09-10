import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export type DayHours = { from: string; to: string };
export type OpeningHours = Record<string, DayHours>;

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

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

  const day = (d: string): DayHours | null => {
    const raw = value?.[d];
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    return {
      from: typeof r.from === "string" ? r.from : "09:00",
      to: typeof r.to === "string" ? r.to : "17:00",
    };
  };

  function setDay(d: string, next: DayHours | null) {
    const hours: OpeningHours = {};
    for (const key of DAYS) {
      const cur = key === d ? next : day(key);
      if (cur) hours[key] = cur;
    }
    onChange(hours);
  }

  return (
    <div className="space-y-1.5">
      <Label>{t("admin.settings.hours.title")}</Label>
      <div className="divide-y divide-border rounded-[var(--radius)] border border-border">
        {DAYS.map((d) => {
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
      <p className="text-xs text-muted-foreground">{t("admin.settings.hours.help")}</p>
    </div>
  );
}
