import { useTranslation } from "react-i18next";

import { ListingIcon } from "@/components/brand/ui/ListingIcon";
import { customFeatureLabel, isCustomFeature } from "@/lib/listings/vocabularies";

/**
 * Equipment features as a two-column check list (reference: broker-site.html
 * `.feat`). Broker-written extras follow as a quieter, separate tag group so
 * free text never mixes with the curated vocabulary.
 */
export function ListingFeatures({ features }: { features: string[] | null | undefined }) {
  const { t } = useTranslation();
  const list = (features ?? []).filter((key) => typeof key === "string" && key.length > 0);
  const standard = list.filter((k) => !isCustomFeature(k));
  const custom = list.filter(isCustomFeature).map(customFeatureLabel).filter(Boolean);
  if (standard.length === 0 && custom.length === 0) return null;

  return (
    <div className="space-y-8">
      {standard.length > 0 ? (
        <ul aria-label={t("listings.detail.features")} className="grid grid-cols-1 gap-x-10 gap-y-3.5 text-base text-foreground sm:grid-cols-2">
          {standard.map((key) => (
            <li key={key} className="flex items-center gap-3">
              <ListingIcon name="check" className="size-4 shrink-0" />
              {t(`listings.features.${key}`)}
            </li>
          ))}
        </ul>
      ) : null}
      {custom.length > 0 ? (
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {t("admin.listings.form.fields.custom_features")}
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {custom.map((label) => (
              <li key={label} className="rounded-[var(--radius-button)] border border-border px-3 py-1.5 text-sm text-foreground">
                {label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
