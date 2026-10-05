import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

import { AreaLinks } from "@/components/brand/AreaLinks";
import { SiteNav } from "@/components/brand/SiteNav";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { LegalLinks } from "@/components/public/LegalLinks";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { DeervaBadge } from "@/components/public/DeervaBadge";
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
  const pages = [
    [t("nav.listings"), "/$locale/immobilien"],
    [t("nav.selling"), "/$locale/verkaufen"],
    [t("nav.valuation"), "/$locale/immobilienbewertung"],
    [t("nav.inheritance"), "/$locale/erben"],
  ] as const;
  const company = [
    [t("nav.about_solo"), "/$locale/ueber-mich"],
    [t("nav.contact"), "/$locale/kontakt"],
    [t("nav.blog"), "/$locale/ratgeber"],
  ] as const;
  return (
    <footer
      // Noir: the footer is always the black band, whatever the home design.
      data-tone={tone}
      className="bg-footer text-footer-foreground [&_.text-muted-foreground]:text-footer-muted [&_a:hover]:text-footer-foreground"
    >
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 pt-[72px] md:grid-cols-2 md:px-10 lg:grid-cols-4">
        <div>
          <Link to="/$locale" params={{ locale }} aria-label={settings.site_name}><SiteLogo settings={settings} tone="light" interactive className="max-h-12" /></Link>
          {settings.primary_agent_name ? <div className="mt-5 text-sm text-footer-muted">{settings.primary_agent_name}</div> : null}
          {settings.address_street ? <div className="mt-1 text-sm text-footer-muted">{settings.address_street}<br />{settings.address_zip} {settings.address_city}</div> : null}
          <SocialLinks settings={settings} className="mt-5 flex gap-4" />
        </div>
        <FooterLinks title={t("nav.listings")} links={pages} locale={locale} />
        <FooterLinks title={t("nav.about_solo")} links={company} locale={locale} />
        <div>
          <div className="text-sm font-semibold">{t("footer.contact")}</div>
          <div className="mt-5 text-sm leading-7 text-footer-muted">
            {settings.contact_email ? <a className="block hover:text-footer-foreground" href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a> : null}
            {settings.contact_phone ? <a className="block tabular-figures hover:text-footer-foreground" href={`tel:${settings.contact_phone.replace(/\s/g, "")}`}>{settings.contact_phone}</a> : null}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="mt-12 border-t border-footer-muted/30 pt-8">
          <AreaLinks locale={locale} cities={serviceAreas(settings, [])} linkable={!areasAreConfigured(settings)} tone="footer" />
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-footer-muted/30 py-7 text-[12.5px] text-footer-muted md:flex-row md:items-end md:justify-between">
          <div><div>© {new Date().getFullYear()} {settings.legal_name ?? settings.site_name}. {t("footer.rights")}.</div>
          <LegalLinks
            locale={locale}
            className="mt-2 flex flex-wrap gap-4"
          />
          </div>
          <div className="md:text-right"><DeervaBadge label={t("footer.badge")} /><Link to="/admin" className="mt-2 block hover:text-footer-foreground">{t("nav.admin")}</Link></div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links, locale }: { title: string; links: readonly (readonly [string, string])[]; locale: Locale }) {
  return <div><div className="text-sm font-semibold">{title}</div><nav className="mt-5 flex flex-col gap-3 text-sm text-footer-muted">{links.map(([label, to]) => <Link key={to} to={to} params={{ locale }} className="hover:text-footer-foreground">{label}</Link>)}</nav></div>;
}
