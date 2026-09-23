import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import {
  siteSettingsQueryOptions,
  updateSiteSettings,
} from "@/lib/config/site-settings.functions";

/**
 * Small enough to stay visible at the bottom of Business & appearance: a title,
 * one sentence, the switch on the same line, and its own save.
 */
export function MaintenanceCard() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(siteSettingsQueryOptions);
  const [enabled, setEnabled] = useState(Boolean(data.maintenance_mode));

  useEffect(() => {
    setEnabled(Boolean(data.maintenance_mode));
  }, [data.maintenance_mode]);

  return (
    <section className="rounded-[var(--radius)] border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-medium">{t("admin.settings.maintenance.title")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("admin.settings.maintenance.help")}
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={(next) => {
            const previous = enabled;
            setEnabled(next);
            void updateSiteSettings({
              data: { tab: "maintenance", values: { maintenance_mode: next } },
            })
              .then(() => qc.invalidateQueries({ queryKey: siteSettingsQueryOptions.queryKey }))
              .then(() => toast.success(t("admin.settings.saved")))
              .catch((error) => {
                setEnabled(previous);
                toast.error(error instanceof Error ? error.message : t("admin.settings.saveError"));
              });
          }}
          aria-label={t("admin.settings.maintenance.label")}
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {data.maintenance_mode
          ? t("admin.settings.maintenance.on")
          : t("admin.settings.maintenance.off")}
      </p>
    </section>
  );
}
