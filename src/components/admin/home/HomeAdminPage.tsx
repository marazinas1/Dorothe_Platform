import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { useHomeAdmin } from "@/lib/home/use-home-admin";

import { HomeEditorWorkspace } from "./HomeEditorWorkspace";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { Home } from "lucide-react";

/**
 * Home page management: one page, its words and photographs on the left and the
 * real page beside them. Property cards are not edited here — they come from
 * Listings.
 */
export function HomeAdminPage() {
  const { t } = useTranslation();
  const [contentLocale, setContentLocale] = useState<string | null>(null);
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  // Content locales come from the client's settings, never from code.
  const enabled = (settings.enabled_locales ?? []).filter(Boolean);
  const locales = enabled.length > 0 ? enabled : [settings.default_locale];
  const locale = contentLocale ?? locales[0];
  const home = useHomeAdmin(locale);

  return (
    <div className="space-y-6">
      <AdminPageHeader icon={Home} title={t("admin.home.title")} description={t("admin.home.editHint")} />

      <HomeEditorWorkspace
        home={home}
        locales={locales}
        locale={locale}
        onLocale={setContentLocale}
      />
    </div>
  );
}
