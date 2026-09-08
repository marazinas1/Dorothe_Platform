import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { HOME_TEMPLATE_KEYS, HOME_TEMPLATES, type HomeTemplateKey } from "@/lib/home/templates";
import { useHomeAdmin } from "@/lib/home/use-home-admin";
import { usePreviewUrls } from "@/lib/home/use-preview-urls";

import { HomeTemplateSheet } from "./HomeTemplateSheet";
import { TemplateCard } from "./TemplateCard";

/**
 * Home page management: three designs, each shown as the real page in
 * miniature. Clicking a card opens its editor; one button makes it live.
 */
export function HomeAdminPage() {
  const { t } = useTranslation();
  const [contentLocale, setContentLocale] = useState<string | null>(null);
  const [editing, setEditing] = useState<HomeTemplateKey | null>(null);
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  // Content locales come from the client's settings, never from code.
  const enabled = (settings.enabled_locales ?? []).filter(Boolean);
  const locales = enabled.length > 0 ? enabled : [settings.default_locale];
  const locale = contentLocale ?? locales[0];
  const home = useHomeAdmin(locale);
  const previewUrl = usePreviewUrls(locale);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t("admin.home.title")}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("admin.home.editHint")}</p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {HOME_TEMPLATE_KEYS.map((key) => (
          <TemplateCard
            key={key}
            template={HOME_TEMPLATES[key]}
            isActive={home.active === key}
            previewUrl={previewUrl(key)}
            onEdit={() => setEditing(key)}
            onActivate={async () => {
              try {
                await home.activate(key);
                toast.success(t("admin.home.activated"));
              } catch (e) {
                toast.error(e instanceof Error ? e.message : String(e));
              }
            }}
          />
        ))}
      </div>

      <HomeTemplateSheet
        template={editing}
        onClose={() => setEditing(null)}
        home={home}
        locales={locales}
        locale={locale}
        onLocale={setContentLocale}
      />
    </div>
  );
}
