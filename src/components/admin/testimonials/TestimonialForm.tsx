import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/admin/settings/SaveButton";
import type { TestimonialRow } from "@/lib/testimonials/types";

export interface TestimonialDraft {
  id?: string;
  quote: Record<string, string>;
  author_name: string;
  author_detail: string;
  published: boolean;
  show_on_home: boolean;
}

export function toDraft(row?: TestimonialRow): TestimonialDraft {
  return {
    id: row?.id,
    quote: { ...(row?.quote ?? {}) },
    author_name: row?.author_name ?? "",
    author_detail: row?.author_detail ?? "",
    published: row?.published ?? false,
    show_on_home: row?.show_on_home ?? false,
  };
}

interface Props {
  initial: TestimonialDraft;
  locales: string[];
  onSave: (draft: TestimonialDraft) => Promise<void>;
  onCancel: () => void;
}

/** One quote, one card: the words per language and where it is shown. */
export function TestimonialForm({ initial, locales, onSave, onCancel }: Props) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<TestimonialDraft>(initial);

  return (
    <div className="space-y-5 rounded-lg border border-border bg-card p-5">
      {locales.map((loc) => (
        <div key={loc} className="space-y-1.5">
          <Label htmlFor={`quote-${loc}`}>
            {t("admin.testimonials.quote")} · {loc.toUpperCase()}
          </Label>
          <Textarea
            id={`quote-${loc}`}
            rows={4}
            value={draft.quote[loc] ?? ""}
            onChange={(e) =>
              setDraft((p) => ({ ...p, quote: { ...p.quote, [loc]: e.target.value } }))
            }
          />
        </div>
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="testi-name">{t("admin.testimonials.name")}</Label>
          <Input
            id="testi-name"
            value={draft.author_name}
            onChange={(e) => setDraft((p) => ({ ...p, author_name: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="testi-detail">{t("admin.testimonials.detail")}</Label>
          <Input
            id="testi-detail"
            value={draft.author_detail}
            onChange={(e) => setDraft((p) => ({ ...p, author_detail: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={draft.published}
            onCheckedChange={(v) => setDraft((p) => ({ ...p, published: v }))}
          />
          {t("admin.testimonials.published")}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={draft.show_on_home}
            onCheckedChange={(v) => setDraft((p) => ({ ...p, show_on_home: v }))}
          />
          {t("admin.testimonials.showOnHome")}
        </label>
      </div>

      <div className="flex items-center gap-3">
        <SaveButton onSubmit={() => onSave(draft)} />
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4" />
          {t("admin.testimonials.cancel")}
        </Button>
      </div>
    </div>
  );
}
