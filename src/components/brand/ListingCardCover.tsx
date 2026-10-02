import { useTranslation } from "react-i18next";

import { ListingIcon } from "@/components/brand/ui/ListingIcon";
import type { Locale } from "@/i18n/config";
import type { CardBadge } from "@/lib/listings/card-tone";
import { pickLocalized } from "@/lib/listings/format";
import { pickImageUrl } from "@/lib/listings/image";
import { cn } from "@/lib/utils";

type ImageInput = { variants: unknown; alt_text: unknown; is_primary: boolean | null };

const BADGE: Record<CardBadge["tone"], string> = {
  accent: "bg-primary text-primary-foreground",
  light: "bg-background text-foreground",
  dark: "bg-foreground text-background",
};

/**
 * Card photograph: 4:3 cover, one status badge top-left, photo count
 * bottom-right (the only icon allowed without a word). Hover zooms the photo.
 */
export function ListingCardCover({
  images,
  locale,
  name,
  badge,
  muted = false,
  eager = false,
  className,
}: {
  images: ImageInput[];
  locale: Locale;
  name: string;
  badge: CardBadge | null;
  muted?: boolean;
  eager?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const usable = images.filter((i) => pickImageUrl(i.variants, "card"));
  const cover = usable.find((i) => i.is_primary) ?? usable[0];
  const src = cover ? pickImageUrl(cover.variants, "card") : null;

  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden rounded-media bg-muted", className)}>
      {src ? (
        <img
          src={src}
          alt={pickLocalized(cover!.alt_text, locale) || name}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100",
            muted && "grayscale-[60%]",
          )}
        />
      ) : null}
      {badge ? (
        <span
          className={cn(
            "absolute top-3 left-3 z-20 rounded-[var(--radius-button)] px-2.5 py-1 text-[11px] font-bold",
            BADGE[badge.tone],
          )}
        >
          {badge.label}
        </span>
      ) : null}
      {usable.length > 1 ? (
        <span className="absolute right-3 bottom-3 z-20 inline-flex items-center gap-1.5 rounded-[var(--radius-button)] bg-scrim px-2.5 py-1 text-xs font-semibold text-on-media">
          <ListingIcon name="cam" className="size-3.5" />
          <span className="tabular-figures">{usable.length}</span>
          <span className="sr-only">{t("listings.card.photos", { count: usable.length })}</span>
        </span>
      ) : null}
    </div>
  );
}
