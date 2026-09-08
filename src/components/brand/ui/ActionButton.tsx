import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * The one filled action style for the whole public site.
 *
 * Rule (see the button plan): amber surface, 4px corners, 48px tall,
 * uppercase wide-tracked label, never an arrow inside a filled button.
 * `on-dark` is the single exception: on inverted bands amber reads as an
 * error, so the button flips to paper with ink text — same size, same shape.
 */
export type ActionTone = "primary" | "on-dark";

export const ACTION_ROUTES = [
  "/$locale/immobilienbewertung",
  "/$locale/verkaufen",
  "/$locale/immobilien",
  "/$locale/kontakt",
  "/$locale/erben",
  "/$locale/ueber-mich",
] as const;

export type ActionRoute = (typeof ACTION_ROUTES)[number];

export function actionButtonClass(tone: ActionTone = "primary", className?: string) {
  return cn(
    "eyebrow inline-flex h-12 cursor-pointer items-center justify-center rounded-[var(--radius-button)] px-8 text-center transition-colors duration-300",
    "disabled:cursor-default disabled:opacity-60",
    tone === "on-dark"
      ? "bg-background text-foreground hover:bg-secondary"
      : "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground",
    className,
  );
}

export function ActionLink({
  locale,
  to,
  hash,
  children,
  tone = "primary",
  className,
}: {
  locale: Locale;
  to: ActionRoute;
  hash?: string;
  children: ReactNode;
  tone?: ActionTone;
  className?: string;
}) {
  return (
    <Link to={to} hash={hash} params={{ locale }} className={actionButtonClass(tone, className)}>
      {children}
    </Link>
  );
}
