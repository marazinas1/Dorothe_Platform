import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { AdminSection } from "@/components/admin/ui/AdminSection";
import { Switch } from "@/components/ui/switch";
import { siteSettingsQueryOptions, updateSiteSettings } from "@/lib/config/site-settings.functions";

export function MaintenanceTab() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(siteSettingsQueryOptions);

  async function update(enabled: boolean) {
    try {
      await updateSiteSettings({ data: { tab: "maintenance", values: { maintenance_mode: enabled } } });
      await queryClient.invalidateQueries({ queryKey: siteSettingsQueryOptions.queryKey });
      toast.success(t("admin.settings.saved"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("admin.settings.saveError"));
    }
  }

  return (
    <AdminSection title={t("admin.settings.maintenance.title")} description={t("admin.settings.maintenance.help")}>
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="font-semibold">{t("admin.settings.maintenance.label")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.maintenance_mode
              ? t("admin.settings.maintenance.on")
              : t("admin.settings.maintenance.off")}
          </p>
        </div>
        <Switch
          checked={data.maintenance_mode}
          onCheckedChange={(checked) => void update(checked)}
          aria-label={t("admin.settings.maintenance.label")}
        />
      </div>
    </AdminSection>
  );
}