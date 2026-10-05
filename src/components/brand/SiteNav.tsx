import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { publicPostsQueryOptions } from "@/lib/posts/queries.functions";


import { SiteLogo } from "@/components/brand/SiteLogo";
import { HomeLink } from "@/components/shared/HomeLink";
import { NavDrawer } from "@/components/brand/NavDrawer";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { useFeatureFlag } from "@/hooks/use-feature-flag";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types/site-settings";
import { actionButtonClass } from "@/components/brand/ui/ActionButton";
import { Button } from "@/components/brand/ui/Button";

type Props = {
  locale: Locale;
  settings: SiteSettings;
  /** Page opens with a full-bleed hero: bar starts transparent over it. */
  overlay?: boolean;
};

/** Centre links; labels always come from translations, never hardcoded. */
export function useNavItems() {
  const { t } = useTranslation();
  const teamEnabled = useFeatureFlag("team");
  const blogEnabled = useFeatureFlag("blog");
  // The advice section is only worth a menu slot once something is published.
  const { data: posts } = useQuery({ ...publicPostsQueryOptions, enabled: blogEnabled });
  const showBlog = blogEnabled && (posts?.length ?? 0) > 0;
  return [
    { to: "/$locale" as const, label: t("nav.home"), exact: true },
    { to: "/$locale/immobilien" as const, label: t("nav.listings"), exact: false },
    { to: "/$locale/verkaufen" as const, label: t("nav.selling"), exact: false },
    { to: "/$locale/erben" as const, label: t("nav.inheritance"), exact: false },
    ...(showBlog ? [{ to: "/$locale/ratgeber" as const, label: t("nav.blog"), exact: false }] : []),
    {
      to: "/$locale/ueber-mich" as const,
      label: t(teamEnabled ? "nav.about_team" : "nav.about_solo"),
      exact: false,
    },
  ];
}


/**
 * Shared public header matching the broker-site reference.
 */
export function SiteNav({ locale, settings, overlay = false }: Props) {
  const { t } = useTranslation();
  const nav = useNavItems();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Light text is only legible while the bar still sits on the hero photo.
  const onPhoto = overlay && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-out",
        onPhoto
          ? "bg-gradient-to-b from-scrim-soft to-transparent text-on-media"
          : "border-b border-border bg-background/95 backdrop-blur-md",
      )}
    >
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <nav
          className={cn(
            "flex items-center justify-between transition-[height] duration-500 ease-out",
            "h-20",
          )}
        >
          <HomeLink
            locale={locale}
            label={settings.site_name}
            className="min-w-0 shrink-0"
          >
            <SiteLogo settings={settings} interactive />
          </HomeLink>

          <div className="hidden items-center gap-6 lg:flex xl:gap-7">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                params={{ locale }}
                className={cn(
                  "whitespace-nowrap text-sm font-medium transition-colors duration-200",
                  onPhoto ? "text-on-media-muted hover:text-on-media" : "text-muted-foreground hover:text-foreground",
                )}
                activeProps={{ className: onPhoto ? "text-on-media underline underline-offset-8" : "text-foreground underline underline-offset-8" }}
                activeOptions={{ exact: n.exact }}
              >
                {n.label}
              </Link>
            ))}

            <LocaleSwitcher
              currentLocale={locale}
              enabledLocales={settings.enabled_locales}
              invert={onPhoto}
            />

            <Link
              to="/$locale/kontakt"
              params={{ locale }}
              className={actionButtonClass()}
            >
              {t("nav.contact")}
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <LocaleSwitcher
              currentLocale={locale}
              enabledLocales={settings.enabled_locales}
              invert={onPhoto}
            />
            <Button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("nav.menu")}
              variant="ghost" size="icon" inverse={onPhoto}
            >
              <span className="sr-only">{t("nav.menu")}</span>
              <span aria-hidden="true" className="flex flex-col gap-[6px]">
                <span className="block h-px w-6 bg-current" />
                <span className="block h-px w-6 bg-current" />
                <span className="block h-px w-6 bg-current" />
              </span>
            </Button>
          </div>
        </nav>
      </div>

      <NavDrawer
        open={open}
        onClose={() => setOpen(false)}
        locale={locale}
        settings={settings}
        items={nav}
      />
    </header>
  );
}
