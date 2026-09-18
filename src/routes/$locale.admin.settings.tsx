import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { usePermission } from "@/lib/auth/use-permission";
import { SettingsTabs } from "@/components/admin/settings/SettingsTabs";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/$locale/admin/settings")({
  staticData: { sitemap: false },
  component: SettingsLayout,
});

function SettingsLayout() {
  const { t } = useTranslation();
  const canEdit = usePermission("settings.edit");
  if (!canEdit) {
    return (
      <div className="w-full space-y-4">
        <AdminPageHeader
          icon={Settings}
          title={t("admin.settings.title")}
          description={t("admin.settings.subtitle")}
        />
        <p className="rounded-[var(--radius)] border border-border bg-muted p-4 text-sm text-muted-foreground">
          {t("admin.settings.denied")}
        </p>
      </div>
    );
  }
  return (
    <div className="w-full space-y-6">
      <AdminPageHeader icon={Settings} title={t("admin.settings.title")} description={t("admin.settings.subtitle")} />
      <SettingsTabs />
      <Outlet />
    </div>
  );
}
