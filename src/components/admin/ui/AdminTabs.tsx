import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface AdminTabItem {
  id: string;
  label: ReactNode;
  /** Router target; params are supplied by the caller. */
  to: string;
  params: Record<string, string>;
  active: boolean;
}

/**
 * One tab row for the whole panel: a transparent row on a single bottom line,
 * the active tab marked by a clear primary underline. No pills, no filled
 * rectangles, no radius.
 */
export function AdminTabs({ label, items }: { label: string; items: AdminTabItem[] }) {
  return (
    <nav aria-label={label} className="relative -mb-px w-full overflow-x-auto">
      <div className="flex w-max min-w-full items-stretch gap-6 border-b border-border">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            params={item.params as never}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "relative shrink-0 whitespace-nowrap px-0.5 pb-3 pt-1 text-sm transition-colors",
              "after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:content-['']",
              item.active
                ? "font-medium text-foreground after:bg-primary"
                : "text-muted-foreground after:bg-transparent hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
