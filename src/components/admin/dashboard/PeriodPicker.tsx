import { useTranslation } from "react-i18next";

import { PERIOD_PRESETS, type PeriodPreset } from "@/lib/dashboard/period";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Period selector for the metrics half. Presets only — no invented ranges. */
export function PeriodPicker({
  value,
  onChange,
}: {
  value: PeriodPreset;
  onChange: (next: PeriodPreset) => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      className="inline-flex gap-1 border-b border-border"
      role="group"
      aria-label={t("admin.dashboard.metrics.period")}
    >
      {PERIOD_PRESETS.map((preset) => (
        <Button
          key={preset}
          type="button"
          onClick={() => onChange(preset)}
          aria-pressed={preset === value}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none border-b-2 px-3 text-xs transition-colors",
            preset === value
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {t(`admin.dashboard.period.${preset}`)}
        </Button>
      ))}
    </div>
  );
}
