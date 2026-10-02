import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";

import { buttonClass } from "./Button";

/**
 * Route-link form of the one public Button. `primary` = filled primary;
 * `on-dark` = the inverse primary for inverted bands and photography.
 */
export type ActionTone = "primary" | "on-dark";

export const ACTION_ROUTES = [
  "/$locale/immobilienbewertung",
  "/$locale/verkaufen",
  "/$locale/immobilien",
  "/$locale/kontakt",
  "/$locale/erben",
  "/$locale/ueber-mich",
  "/$locale/verkauft",
  "/$locale/ratgeber",
] as const;

export type ActionRoute = (typeof ACTION_ROUTES)[number];

export function actionButtonClass(tone: ActionTone = "primary", className?: string) {
  return buttonClass({ variant: "primary", inverse: tone === "on-dark", className });
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
