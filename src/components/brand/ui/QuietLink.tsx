import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

import type { ActionRoute } from "./ActionButton";

/**
 * The quiet counterpart to ActionButton: no filled box, a thin underline, and
 * the arrow lives here — an arrow is what marks a link, not a button.
 */
export function quietLinkClass(className?: string) {
  return cn(
    "eyebrow inline-flex cursor-pointer items-center gap-2 border-b border-current pb-1 transition-opacity duration-300 hover:opacity-70",
    className,
  );
}

export function QuietLink({
  locale,
  to,
  hash,
  children,
  className,
}: {
  locale: Locale;
  to: ActionRoute;
  hash?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} hash={hash} params={{ locale }} className={quietLinkClass(className)}>
      {children}
    </Link>
  );
}
