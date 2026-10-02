import { useTranslation } from "react-i18next";
import { ListingIcon } from "@/components/brand/ui/ListingIcon";

type Props = {
  title: string;
  locationLine: string;
  contactHref: string;
};

export function ListingHeroOverlay({ title, locationLine }: Props) {
  const { t } = useTranslation();

  return (
    <div className="min-w-0">
        <h1 className="max-w-3xl font-heading text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.08]">
          {title}
        </h1>
        {locationLine ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><ListingIcon name="pin" className="size-4" />{locationLine}</div>
        ) : null}
    </div>
  );
}
