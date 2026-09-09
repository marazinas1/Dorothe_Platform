import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

import { AreaLinks } from "@/components/brand/AreaLinks";
import { SiteNav } from "@/components/brand/SiteNav";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { LegalLinks } from "@/components/public/LegalLinks";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { HomeLink } from "@/components/shared/HomeLink";
import type { Locale } from "@/i18n/config";
import { HOME_CHROME } from "@/lib/home/layout";
import { areasAreConfigured, serviceAreas } from "@/lib/homepage/plan";
import type { SiteSettings } from "@/types/site-settings";

type Props = {
  locale: Locale;
  settings: SiteSettings;
  /** Page opens with a full-bleed hero the header can sit on top of. */
  heroOverlay?: boolean;
  /** The active home design decides whether the footer band is dark or light. */
  footerTone?: "dark" | "light";
  children: ReactNode;
};

/** Site header + footer wrapper for public pages. */
export function PublicChrome({
  locale,
  settings,
  heroOverlay = false,
  footerTone,
  children,
}: Props) {
  // Site chrome follows the active home design, so header and footer match the
  // page a visitor lands on — on every route, not only the home page.
  const tone = footerTone ?? HOME_CHROME.footerTone;
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteNav locale={locale} settings={settings} overlay={heroOverlay} />
      {/* The header is fixed, so pages without a hero need the height back. */}
      <main className={heroOverlay ? "flex-1" : "flex-1 pt-[86px]"}>{children}</main>
      <Footer locale={locale} settings={settings} tone={tone} />
    </div>
  );
}

function Footer({
  locale,
  settings,
  tone,
}: {
  locale: Locale;
  settings: SiteSettings;
  tone: "dark" | "light";
}) {
  const { t } = useTranslation();
  const dark = tone === "dark";
  return (
    <footer
      className={
        dark
          ? "bg-primary text-primary-foreground [&_.text-muted-foreground]:text-primary-foreground/70"
          : "border-t border-border/60 bg-background"
      }
    >
      {/* Local links belong on every page, not only the homepage. */}
      <div className="mx-auto max-w-[1220px] px-0 pt-12">
        <AreaLinks
          locale={locale}
          cities={serviceAreas(settings, [])}
          linkable={!areasAreConfigured(settings)}
          tone="footer"
        />
      </div>
      <div className="mx-auto grid max-w-[1220px] gap-11 px-6 pt-11 pb-[30px] md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <HomeLink locale={locale} label={settings.site_name}>
            <SiteLogo settings={settings} size="sm" interactive />
          </HomeLink>
          {settings.address_street ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {settings.address_street}
              <br />
              {settings.address_zip} {settings.address_city}
              <br />
              {settings.address_country ?? ""}
            </p>
          ) : null}
        </div>
        <div className="text-sm text-muted-foreground">
          {settings.contact_email ? (
            <div>
              <a className="hover:text-foreground" href={`mailto:${settings.contact_email}`}>
                {settings.contact_email}
              </a>
            </div>
          ) : null}
          {settings.contact_phone ? <div className="tabular-figures">{settings.contact_phone}</div> : null}
        </div>
        <div className="text-sm text-muted-foreground md:text-right">
          <SocialLinks
            settings={settings}
            className="mb-4 flex gap-4 md:justify-end"
          />
          <div className="border-t border-primary-foreground/20 pt-6 text-[12.5px]">
            © {new Date().getFullYear()} {settings.legal_name ?? settings.site_name}.{" "}
            {t("footer.rights")}.
          </div>
          <LegalLinks
            locale={locale}
            className="mt-2 flex flex-wrap gap-4 md:justify-end"
          />
          <div className="mt-2 flex gap-4 md:justify-end">
            <Link to="/$locale/admin" params={{ locale }} className="hover:text-foreground">
              {t("nav.admin")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
