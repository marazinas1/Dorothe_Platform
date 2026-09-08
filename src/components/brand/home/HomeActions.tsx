import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** Filled action. Shape comes from the button-style token, never from here. */
export function HomeButton({
  locale,
  to,
  children,
  tone = "primary",
  className,
}: {
  locale: Locale;
  to: "/$locale/immobilienbewertung" | "/$locale/verkaufen" | "/$locale/immobilien" | "/$locale/kontakt";
  children: ReactNode;
  tone?: "primary" | "accent";
  className?: string;
}) {
  return (
    <Link
      to={to}
      params={{ locale }}
      className={cn(
        "eyebrow inline-flex h-12 items-center rounded-[var(--radius-button)] px-7 transition-opacity duration-300 hover:opacity-90",
        tone === "accent"
          ? "bg-accent text-accent-foreground"
          : "bg-primary text-primary-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Quiet action: an underlined text link that never competes with the button. */
export function HomeTextLink({
  locale,
  to,
  children,
  className,
}: {
  locale: Locale;
  to: "/$locale/immobilien" | "/$locale/verkaufen" | "/$locale/erben" | "/$locale/ueber-mich";
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      params={{ locale }}
      className={cn(
        "eyebrow inline-flex items-center gap-2 border-b border-current pb-1 transition-opacity duration-300 hover:opacity-70",
        className,
      )}
    >
      {children}
    </Link>
  );
}
