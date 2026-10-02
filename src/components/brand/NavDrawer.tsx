import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { BrandMark } from "@/components/brand/BrandMark";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import type { Locale } from "@/i18n/config";
import type { SiteSettings } from "@/types/site-settings";
import { actionButtonClass } from "@/components/brand/ui/ActionButton";
import { Button } from "@/components/brand/ui/Button";

type Item = { to: "/$locale/immobilien" | string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  settings: SiteSettings;
  items: Item[];
};

/** Full-screen mobile menu. Calm fade + no layout jump; closes on Escape. */
export function NavDrawer({ open, onClose, locale, settings, items }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="pointer-events-auto fixed inset-0 z-50 flex flex-col bg-background lg:hidden"
    >
      <div className="flex h-20 items-center justify-between border-b border-border px-5">
        <BrandMark settings={settings} />
        <Button
          type="button"
          onClick={onClose}
          aria-label={t("nav.close")}
          variant="ghost" size="icon" className="text-lg"
        >
          <span aria-hidden="true">×</span>
        </Button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-5 px-5 py-8">
        {items.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            params={{ locale }}
            onClick={onClose}
            className="font-heading text-[clamp(1.75rem,8vw,2.5rem)] font-bold leading-tight text-foreground"
          >
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-5">
        <LocaleSwitcher currentLocale={locale} enabledLocales={settings.enabled_locales} />
        <Link
          to="/$locale/kontakt"
          params={{ locale }}
          onClick={onClose}
          className={actionButtonClass()}
        >
          {t("nav.contact")}
        </Link>
      </div>
    </div>
  );
}
