import { useTranslation } from "react-i18next";
import { actionButtonClass } from "@/components/brand/ui/ActionButton";

type Props = {
  title: string;
  locationLine: string;
  contactHref: string;
};

export function ListingHeroOverlay({ title, locationLine, contactHref }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <h1 className="max-w-4xl font-heading text-[clamp(30px,3.6vw,46px)] font-bold leading-[1.08]">
          {title}
        </h1>
        {locationLine ? (
          <div className="mt-3 text-sm text-muted-foreground">{locationLine}</div>
        ) : null}
      </div>
      <a
        href={contactHref}
        className={actionButtonClass("primary", "flex-none")}
      >
        {t("listings.detail.contact_agent")}
      </a>
    </div>
  );
}
