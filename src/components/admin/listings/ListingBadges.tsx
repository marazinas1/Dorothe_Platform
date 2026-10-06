import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { energyClassOf, energyClassTone } from "@/lib/listings/energy-class";

const STATUS_TONES: Record<string, string> = {
  draft: "bg-secondary text-muted-foreground",
  coming_soon: "bg-info/10 text-info",
  active: "bg-success/10 text-success",
  reserved: "bg-warning/10 text-warning",
  sold: "bg-primary text-primary-foreground",
  rented: "bg-primary text-primary-foreground",
  archived: "border border-dashed border-border text-muted-foreground",
};

const BASE =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-[9px] py-0.5 text-xs font-semibold";

/** Rounded status pill with a leading dot, as in the admin reference. */
export function ListingStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const label = status === "active" ? t("admin.listings.tabs.live") : t(`listings.status.${status}`);
  return (
    <span className={cn(BASE, STATUS_TONES[status] ?? STATUS_TONES.draft)}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function PlainBadge({ children }: { children: React.ReactNode }) {
  return <span className={cn(BASE, "bg-secondary text-foreground")}>{children}</span>;
}

/** Energy class chip in the official label colour, or "Missing". */
export function EnergyChip({ energy, exempt }: { energy: unknown; exempt: boolean }) {
  const { t } = useTranslation();
  const cls = energyClassOf(energy);
  if (!cls) {
    return (
      <span className="text-muted-foreground">
        {exempt ? t("admin.listings.energyExempt") : t("admin.listings.energyMissing")}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-grid h-[22px] min-w-7 place-items-center rounded-[var(--radius)] px-[5px] text-[11.5px] font-bold",
        energyClassTone(cls),
      )}
    >
      {cls}
    </span>
  );
}
