import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  HOME_PICK_LIMIT,
  adminListingsQueryOptions,
  setListingFeatured,
} from "@/lib/listings/admin.functions";

/**
 * Pins a property to the home page. Only a handful of slots exist, so hitting
 * the limit is explained rather than silently ignored.
 */
export function HomePickToggle({
  listingId,
  featured,
  disabled,
  onChanged,
}: {
  listingId: string;
  featured: boolean;
  disabled?: boolean;
  onChanged?: () => void;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      await setListingFeatured({ data: { id: listingId, featured: !featured } });
      await queryClient.invalidateQueries(adminListingsQueryOptions);
      onChanged?.();
      toast.success(
        featured ? t("admin.listings.home.removed") : t("admin.listings.home.added"),
      );
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err);
      toast.error(
        raw.includes("HOME_PICK_LIMIT")
          ? t("admin.listings.home.limitReached", { count: HOME_PICK_LIMIT })
          : raw,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={featured ? "secondary" : "ghost"}
      disabled={disabled || busy}
      onClick={() => void toggle()}
    >
      <Star className={`mr-2 h-3.5 w-3.5 ${featured ? "fill-current" : ""}`} />
      {featured ? t("admin.listings.home.on") : t("admin.listings.home.off")}
    </Button>
  );
}
