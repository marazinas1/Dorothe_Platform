import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/brand/ui/Button";
import { useMapConsent } from "@/lib/maps/use-map-consent";

type Props = {
  /** Size classes shared with the map, so loading it moves nothing. */
  className: string;
  children: ReactNode;
};

/**
 * The one way every public map loads: a placeholder of the map's exact size
 * says where the tiles come from, and nothing is requested until the visitor
 * clicks. After that click, maps on other pages load directly for this tab.
 */
export function MapConsentGate({ className, children }: Props) {
  const { t } = useTranslation();
  const { allowed, allow } = useMapConsent();
  const [local, setLocal] = useState(false);

  if (allowed || local) return <>{children}</>;

  return (
    <div className={`${className} flex flex-col items-center justify-center gap-4 bg-muted px-6 text-center`}>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          setLocal(true);
          allow();
        }}
      >
        {t("listings.detail.map_load")}
      </Button>
      <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
        {t("listings.detail.map_consent_note")}
      </p>
    </div>
  );
}
