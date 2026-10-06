import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { saveListingImageAlt } from "@/lib/listings/image-alt.functions";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";

/**
 * Description of one photo in the site's primary content language, saved on
 * blur. Screen readers and search engines read it on the public page.
 */
export function PhotoAltInput({ imageId, value }: { imageId: string; value: unknown }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const locale = settings.default_locale;
  const initial = ((value ?? {}) as Record<string, string>)[locale] ?? "";
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const id = `alt-${imageId}`;

  async function commit() {
    const next = text.trim();
    if (next === saved) return;
    try {
      await saveListingImageAlt({ data: { imageId, locale, text: next } });
      setSaved(next);
      await qc.invalidateQueries({ queryKey: ["admin", "listing"] });
      await qc.invalidateQueries({ queryKey: ["admin", "listings"] });
    } catch {
      toast.error(t("admin.listings.images.alt.failed"));
    }
  }

  return (
    <div className="p-2" onPointerDown={(e) => e.stopPropagation()}>
      <label htmlFor={id} className="sr-only">
        {t("admin.listings.images.alt.label")}
      </label>
      <Input
        id={id}
        value={text}
        maxLength={200}
        placeholder={t("admin.listings.images.alt.placeholder")}
        aria-invalid={saved.length === 0 || undefined}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="h-9 text-sm"
      />
    </div>
  );
}
