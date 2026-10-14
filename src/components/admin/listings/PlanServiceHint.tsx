import { ExternalLink, Box } from "lucide-react";
import { useTranslation } from "react-i18next";

import { buttonVariants } from "@/components/ui/button";

/** Deerva studio service: brokers without a plan can order one from StageHomy. */
const STAGEHOMY_URL =
  "https://stagehomy.com/?utm_source=broker-platform&utm_medium=referral&utm_campaign=floorplan-request";

export function PlanServiceHint() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-muted p-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Box aria-hidden strokeWidth={1.75} className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">{t("admin.listings.docs.serviceTitle")}</p>
          <p className="text-xs text-muted-foreground">{t("admin.listings.docs.serviceBody")}</p>
        </div>
      </div>
      <a href={STAGEHOMY_URL} target="_blank" rel="noopener" className={buttonVariants({ variant: "outline", size: "sm" })}>
        {t("admin.listings.docs.serviceCta")}
        <ExternalLink aria-hidden strokeWidth={1.75} className="size-4" />
      </a>
    </div>
  );
}
