import { CalendarOff, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { HoursException } from "@/lib/config/opening-hours";

export function OpeningHoursExceptions({
  value,
  onChange,
}: {
  value: HoursException[];
  onChange: (next: HoursException[]) => void;
}) {
  const { t } = useTranslation();

  function add() {
    onChange([...value, { id: crypto.randomUUID(), date: "", note: "" }]);
  }

  function update(id: string, patch: Partial<HoursException>) {
    onChange(value.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <CalendarOff className="h-4 w-4 text-muted-foreground" />
            {t("admin.settings.hours.exceptions.title")}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("admin.settings.hours.exceptions.help")}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-4 w-4" />
          {t("admin.settings.hours.exceptions.add")}
        </Button>
      </div>
      {value.map((row) => (
        <div key={row.id} className="grid gap-2 rounded-[var(--radius)] border border-border p-3 sm:grid-cols-[10rem_7rem_7rem_1fr_auto]">
          <Input type="date" value={row.date} aria-label={t("admin.settings.hours.exceptions.date")} onChange={(e) => update(row.id, { date: e.target.value })} />
          <Input type="time" value={row.from ?? ""} aria-label={t("admin.settings.hours.exceptions.from")} onChange={(e) => update(row.id, { from: e.target.value })} />
          <Input type="time" value={row.to ?? ""} aria-label={t("admin.settings.hours.exceptions.to")} onChange={(e) => update(row.id, { to: e.target.value })} />
          <Input value={row.note ?? ""} placeholder={t("admin.settings.hours.exceptions.note")} onChange={(e) => update(row.id, { note: e.target.value })} />
          <Button type="button" variant="ghost" size="icon" aria-label={t("admin.settings.hours.exceptions.remove")} onClick={() => onChange(value.filter((item) => item.id !== row.id))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}