import { useTranslation } from "react-i18next";

import { PERIOD_PRESETS, type PeriodPreset } from "@/lib/dashboard/period";
import { AdminTabButtons } from "@/components/admin/ui/AdminTabButtons";

/** Period selector for the metrics half. Presets only — no invented ranges. */
export function PeriodPicker({
  value,
  onChange,
}: {
  value: PeriodPreset;
  onChange: (next: PeriodPreset) => void;
}) {
  const { t } = useTranslation();
  return <AdminTabButtons
    label={t("admin.dashboard.metrics.period")}
    items={PERIOD_PRESETS.map((preset) => ({
      id: preset,
      label: t(`admin.dashboard.period.${preset}`),
    }))}
    value={value}
    onChange={onChange}
  />;
}
