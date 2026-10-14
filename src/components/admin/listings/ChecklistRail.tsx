import { useTranslation } from "react-i18next";
import { Check, ChevronDown, Minus } from "lucide-react";

import type { Checklist, ChecklistItem } from "@/lib/listings/publish-checklist";
import { scrollToField } from "@/lib/listings/scroll-to-field";
import { Button } from "@/components/ui/button";

/**
 * The publish checklist doubles as the form's navigation: every outstanding item
 * is a button that opens the section it lives in, scrolls to the exact field and
 * focuses it. Sticky on desktop, collapsed into a summary on mobile so it never
 * eats the screen while typing.
 */
export function ChecklistRail({
  checklist,
}: {
  checklist: Checklist;
}) {
  const { t } = useTranslation();
  const { items, outstanding, ready, energyExempt } = checklist;

  const body = (
    <>
      <p className="text-xs text-muted-foreground">
        {ready
          ? t("admin.listings.checklist.ready")
          : t("admin.listings.checklist.remaining", { count: outstanding })}
      </p>
      <ul className="mt-3 grid gap-1">
        {items.map((item) => (
          <li key={item.key}>
            <ChecklistRow item={item} label={labelFor(item, t)} />
          </li>
        ))}
      </ul>
      {energyExempt ? (
        <p className="mt-3 text-xs text-muted-foreground">
          {t("admin.listings.checklist.energyExempt")}
        </p>
      ) : null}
    </>
  );

  // One calm, full-width summary above the form: progress at a glance, the
  // outstanding items on demand. No sticky side panel, so nothing scrolls
  // inside the page or pushes it sideways.
  const done = items.length - outstanding;
  return (
    <details className="group rounded-[var(--radius)] border border-border bg-card">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-4 py-3 text-sm font-bold">
        <span>{t("admin.listings.checklist.title")}</span>
        <span className="text-xs font-normal text-muted-foreground">
          {ready
            ? t("admin.listings.checklist.ready")
            : t("admin.listings.checklist.remaining", { count: outstanding })}
        </span>
        <span
          className="ml-auto h-1.5 w-24 overflow-hidden rounded-full bg-muted sm:w-40"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={done}
        >
          <span
            className="block h-full bg-primary transition-all"
            style={{ width: `${(done / Math.max(items.length, 1)) * 100}%` }}
          />
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t border-border px-4 py-3">
        <ul className="grid gap-1 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.key} className="min-w-0">
              <ChecklistRow item={item} label={labelFor(item, t)} />
            </li>
          ))}
        </ul>
        {energyExempt ? (
          <p className="mt-3 text-xs text-muted-foreground">
            {t("admin.listings.checklist.energyExempt")}
          </p>
        ) : null}
      </div>
    </details>
  );
}

function labelFor(item: ChecklistItem, t: (key: string) => string): string {
  const base = t(`admin.listings.checklist.items.${item.key}`);
  if (item.done || !item.missing?.length) return base;
  const names = item.missing.map((key) => t(`admin.listings.energyFields.${key}`)).join(", ");
  return `${base}: ${names}`;
}

function ChecklistRow({ item, label }: { item: ChecklistItem; label: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => scrollToField(item.anchor)}
      className="flex h-auto w-full min-w-0 items-start justify-start gap-2 whitespace-normal break-words px-1.5 py-1 text-left text-sm hover:bg-muted"
    >
      {item.done ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      ) : (
        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      )}
      <span className={item.done ? "text-muted-foreground" : "text-foreground"}>{label}</span>
    </Button>
  );
}
