import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

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
      <div className="admin-tabs w-max min-w-full">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            params={item.params as never}
            aria-current={item.active ? "page" : undefined}
            data-active={item.active}
            className="admin-tab"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
