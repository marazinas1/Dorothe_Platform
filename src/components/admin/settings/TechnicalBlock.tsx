import { useTranslation } from "react-i18next";

import type { SiteSettings } from "@/types/site-settings";

/**
 * Platform values fixed for this client. Visible to the developer only, so
 * the owner never wonders what they are for.
 */
export function TechnicalBlock({ data }: { data: SiteSettings }) {
  const { t } = useTranslation();
  return (
    <section className="space-y-3 rounded-[var(--radius)] border border-dashed border-border p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t("admin.settings.business.technical")}
      </h2>
      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <TechRow label={t("admin.settings.general.country")} value={data.country} />
        <TechRow label={t("admin.settings.general.default_locale")} value={data.default_locale} />
        <TechRow
          label={t("admin.settings.general.enabled_locales")}
          value={data.enabled_locales.join(", ")}
        />
        <TechRow label={t("admin.settings.general.currency")} value={data.currency} />
        <TechRow
          label={t("admin.settings.general.area_unit")}
          value={t(`admin.settings.general.${data.area_unit}`)}
        />
      </div>
      <p className="text-xs text-muted-foreground">{t("admin.settings.business.technical_help")}</p>
    </section>
  );
}

function TechRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
