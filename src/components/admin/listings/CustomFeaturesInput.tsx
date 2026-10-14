import { useState } from "react";
import { Plus, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CUSTOM_FEATURE_PREFIX,
  customFeatureLabel,
  isCustomFeature,
} from "@/lib/listings/vocabularies";
import { FieldRow } from "./FieldRow";

const MAX_LENGTH = 60;

/**
 * Free-text extras for features the checklist does not offer. Enter or comma
 * adds a tag; each tag has a labelled remove button. Shown publicly with the
 * same check mark as every other feature, so no icon choice is needed.
 */
export function CustomFeaturesInput({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState("");
  const extras = selected.filter(isCustomFeature);

  function add() {
    const parts = draft.split(",").map((p) => p.trim().slice(0, MAX_LENGTH)).filter(Boolean);
    const known = new Set(extras.map((e) => customFeatureLabel(e).toLowerCase()));
    const fresh = parts.filter((p) => {
      const k = p.toLowerCase();
      if (known.has(k)) return false;
      known.add(k);
      return true;
    });
    if (fresh.length) onChange([...selected, ...fresh.map((p) => CUSTOM_FEATURE_PREFIX + p)]);
    setDraft("");
  }

  return (
    <FieldRow
      icon={Sparkles}
      label={t("admin.listings.fields.custom_features")}
      help={t("admin.listings.help.custom_features")}
    >
      <div className="flex gap-2">
        <Input
          value={draft}
          maxLength={MAX_LENGTH * 4}
          placeholder={t("admin.listings.customFeaturePlaceholder")}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          onBlur={() => draft.trim() && add()}
        />
        <Button type="button" variant="outline" onClick={add} disabled={!draft.trim()}>
          <Plus aria-hidden strokeWidth={1.75} className="size-4" />
          {t("admin.listings.addCustomFeature")}
        </Button>
      </div>
      {extras.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {extras.map((value) => (
            <li
              key={value}
              className="flex items-center gap-1 rounded-[var(--radius)] border border-border bg-secondary py-1 pl-3 pr-1 text-sm"
            >
              {customFeatureLabel(value)}
              <button
                type="button"
                className="grid size-7 cursor-pointer place-items-center rounded-[var(--radius)] text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                aria-label={t("admin.listings.removeCustomFeature", { name: customFeatureLabel(value) })}
                onClick={() => onChange(selected.filter((s) => s !== value))}
              >
                <X aria-hidden strokeWidth={1.75} className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </FieldRow>
  );
}
