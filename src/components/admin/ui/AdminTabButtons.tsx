import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type Item<T extends string | number> = {
  id: T;
  label: ReactNode;
};

/** Shared underline tabs for local admin view filters that do not navigate. */
export function AdminTabButtons<T extends string | number>({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: Item<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="admin-tabs w-max" role="tablist" aria-label={label}>
      {items.map((item) => (
        <Button
          key={item.id}
          type="button"
          role="tab"
          variant="ghost"
          aria-selected={item.id === value}
          data-active={item.id === value}
          className="admin-tab h-auto rounded-none bg-transparent hover:bg-transparent"
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}