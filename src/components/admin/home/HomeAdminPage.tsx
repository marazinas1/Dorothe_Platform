import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { SaveButton } from "@/components/admin/settings/SaveButton";
import { homeMedia } from "@/lib/home/content";
import { HOME_TEMPLATE_KEYS, HOME_TEMPLATES } from "@/lib/home/templates";
import { useHomeAdmin } from "@/lib/home/use-home-admin";

import { HomeMediaEditor } from "./HomeMediaEditor";
import { HomeTextEditor } from "./HomeTextEditor";
import { TemplateCard } from "./TemplateCard";

/**
 * Home page management: pick the design, then edit the words and photographs of
 * whichever design is live. Content is shared, so switching design never loses
 * a line of text.
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

  const fail = (e: unknown) => toast.error(e instanceof Error ? e.message : String(e));

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t("admin.home.title")}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("admin.home.subtitle")}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("admin.home.designs")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {HOME_TEMPLATE_KEYS.map((key) => (
            <TemplateCard
              key={key}
              template={HOME_TEMPLATES[key]}
              isActive={home.active === key}
              onPreview={async () => {
                try {
                  await home.preview(key);
                } catch (e) {
                  fail(e);
                }
              }}
              onActivate={async () => {
                try {
                  await home.activate(key);
                  toast.success(t("admin.home.activated"));
                } catch (e) {
                  fail(e);
                }
              }}
            />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("admin.home.content")}
          </h2>
          {locales.length > 1 ? (
            <div className="flex gap-1">
              {locales.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setContentLocale(l)}
                  className={`rounded-[calc(var(--radius)/1.5)] border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                    l === locale
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <HomeTextEditor template={home.active} value={home.value} onChange={home.setValue} />

        <HomeMediaEditor
          slots={HOME_TEMPLATES[home.active].media}
          entry={home.mediaEntry}
          onChange={home.setMediaEntry}
          resolved={(slot) => homeMedia(home.settings, slot as never)}
        />

        <SaveButton onSubmit={home.save} />
      </section>
    </div>
  );
}
