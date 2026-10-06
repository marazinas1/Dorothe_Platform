import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { SiteLogo } from "@/components/brand/SiteLogo";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import type { Locale } from "@/i18n/config";
import type { SiteSettings } from "@/types/site-settings";
import { actionButtonClass } from "@/components/brand/ui/ActionButton";
import { Button } from "@/components/brand/ui/Button";

type Item = { to: "/$locale/immobilien" | string; label: string; exact: boolean };

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      returnFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("nav.menu")}
      className="pointer-events-auto fixed left-0 top-0 z-50 flex h-dvh w-screen flex-col overflow-y-auto bg-background lg:hidden"
    >
      <div className="flex h-20 items-center justify-between border-b border-border px-5">
        <SiteLogo settings={settings} />
        <Button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("nav.close")}
          variant="ghost" size="icon" className="text-lg"
        >
          <span aria-hidden="true">×</span>
        </Button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-5 px-5 py-8" aria-label={t("nav.menu")}>
        {items.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            params={{ locale }}
            onClick={onClose}
            activeOptions={{ exact: n.exact }}
            activeProps={{ className: "underline underline-offset-8" }}
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
