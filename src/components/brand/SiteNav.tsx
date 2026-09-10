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
    { to: "/$locale" as const, label: t("nav.home") },
    { to: "/$locale/immobilien" as const, label: t("nav.listings") },
    // Selling replaces the valuation link: an owner weighs "should I sell",
    // not "I need a valuation". Sold work is evidence, so it is linked from
    // the homepage and Über mich rather than the main menu.
    { to: "/$locale/verkaufen" as const, label: t("nav.selling") },
    { to: "/$locale/erben" as const, label: t("nav.inheritance") },
    ...(showBlog ? [{ to: "/$locale/ratgeber" as const, label: t("nav.blog") }] : []),
    {
      to: "/$locale/ueber-mich" as const,
      label: t(teamEnabled ? "nav.about_team" : "nav.about_solo"),
    },
    // Contact stays in the list as well as the filled button: people look for
    // it in the menu out of habit.
    { to: "/$locale/kontakt" as const, label: t("nav.contact") },
  ];
}


/**
 * Full-width fixed navigation bar: compact, transparent over a hero photo, and
 * fading into a blurred surface once the page scrolls. Uppercase wide-tracked
 * links, one solid CTA on the right.
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
          ? "bg-gradient-to-b from-background/85 via-background/45 to-transparent"
          : "border-b border-border/60 bg-background/90 backdrop-blur-md",
      )}
    >
      <div className="mx-auto max-w-[1220px] px-6 lg:px-8">
        <nav
          className={cn(
            "flex items-center justify-between transition-[height] duration-500 ease-out",
            scrolled ? "h-[74px]" : "h-[86px]",
          )}
        >
          <HomeLink
            locale={locale}
            label={settings.site_name}
            className="min-w-0 shrink-0"
          >
            <SiteLogo settings={settings} size="sm" interactive />
          </HomeLink>

          <div className="hidden items-center gap-[34px] md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                params={{ locale }}
                className={cn(
                  "whitespace-nowrap text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground",
                  "text-muted-foreground hover:text-foreground",
                )}
                activeProps={{ className: "text-foreground" }}
              >
                {n.label}
              </Link>
            ))}

            <LocaleSwitcher
              currentLocale={locale}
              enabledLocales={settings.enabled_locales}
            />

            <Link
              to="/$locale/kontakt"
              params={{ locale }}
              className={actionButtonClass()}
            >
              {t("nav.contact")}
            </Link>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <LocaleSwitcher
              currentLocale={locale}
              enabledLocales={settings.enabled_locales}
            />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("nav.menu")}
              className="inline-flex h-10 w-10 items-center justify-center text-foreground"
            >
              <span className="sr-only">{t("nav.menu")}</span>
              <span aria-hidden="true" className="flex flex-col gap-[6px]">
                <span className="block h-px w-6 bg-current" />
                <span className="block h-px w-6 bg-current" />
                <span className="block h-px w-6 bg-current" />
              </span>
            </button>
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
