import { useTranslation } from "react-i18next";

import { ListingIcon } from "@/components/brand/ui/ListingIcon";

/**
 * Equipment features as a two-column check list (reference: broker-site.html
 * `.feat`). Labels come from the shared vocabulary keys.
 */
export function ListingFeatures({ features }: { features: string[] | null | undefined }) {
  const { t } = useTranslation();
  const list = (features ?? []).filter((key) => typeof key === "string" && key.length > 0);
  if (list.length === 0) return null;

  return (
    <ul aria-label={t("listings.detail.features")} className="grid grid-cols-1 gap-x-10 gap-y-3.5 text-base text-foreground sm:grid-cols-2">
      {list.map((key) => (
        <li key={key} className="flex items-center gap-3">
          <ListingIcon name="check" className="size-4 shrink-0" />
          {t(`listings.features.${key}`)}
        </li>
      ))}
    </ul>
  );
}
