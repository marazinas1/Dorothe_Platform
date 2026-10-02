import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";

import type { ActionRoute } from "./ActionButton";
import { buttonClass } from "./Button";

/** The `link` variant of the one public Button, as a route link. */
export function quietLinkClass(className?: string, inverse = false) {
  return buttonClass({ variant: "link", inverse, className });
}

export function QuietLink({
  locale,
  to,
  hash,
  children,
  className,
  inverse = false,
}: {
  locale: Locale;
  to: ActionRoute;
  hash?: string;
  children: ReactNode;
  className?: string;
  inverse?: boolean;
}) {
  return (
    <Link to={to} hash={hash} params={{ locale }} className={quietLinkClass(className, inverse)}>
      {children}
    </Link>
  );
}
