import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { stripLocale } from "@/lib/seo/hreflang";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({
  currentLocale,
  enabledLocales,
  invert = false,
}: {
  currentLocale: string;
  enabledLocales: string[];
  /** Light text, for use over hero photography. */
  invert?: boolean;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const subpath = stripLocale(location.pathname, enabledLocales);

  return (
    <nav aria-label={t("locale.switch")} className="flex items-center gap-2 text-sm">
      {enabledLocales.map((loc) => {
        const isActive = loc === currentLocale;
        const target = `/${loc}${subpath === "/" ? "" : subpath}`;
        return (
          <Link
            key={loc}
            to={target}
            className={cn(
              // The invisible ::after widens the tap area to WCAG 2.5.8 without moving the letters.
              "relative transition-colors duration-300 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-['']",
              invert
                ? isActive
                  ? "font-semibold text-on-media underline underline-offset-4 drop-shadow-sm"
                  : "text-on-media/75 hover:text-on-media drop-shadow-sm"
                : isActive
                  ? "font-semibold underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "true" : undefined}
          >
            {loc.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
