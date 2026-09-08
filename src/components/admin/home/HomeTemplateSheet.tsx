import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SaveButton } from "@/components/admin/settings/SaveButton";
import { homeMedia } from "@/lib/home/content";
import { HOME_TEMPLATES, type HomeTemplateKey } from "@/lib/home/templates";
import type { useHomeAdmin } from "@/lib/home/use-home-admin";

import { HomeMediaEditor } from "./HomeMediaEditor";
import { HomeTextEditor } from "./HomeTextEditor";

type Props = {
  template: HomeTemplateKey | null;
  onClose: () => void;
  home: ReturnType<typeof useHomeAdmin>;
  locales: string[];
  locale: string;
  onLocale: (next: string) => void;
};

/**
 * The editor for one design: its words and its photograph slots, in the chosen
 * content language. Property cards are not edited here — they come from
 * Listings. Content is shared, so an edit made here survives a design switch.
 */
export function HomeTemplateSheet({ template, onClose, home, locales, locale, onLocale }: Props) {
  const { t } = useTranslation();
  if (!template) return null;

  return (
    <Sheet open onOpenChange={(open) => (open ? null : onClose())}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">
            {t(`admin.home.templates.${template}.label`)}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {locales.length > 1 ? (
            <div className="flex gap-1">
              {locales.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onLocale(l)}
                  className={`rounded-[calc(var(--radius)/1.5)] border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                    l === locale
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          ) : null}

          <HomeTextEditor template={template} value={home.value} onChange={home.setValue} />

          <HomeMediaEditor
            slots={HOME_TEMPLATES[template].media}
            entry={home.mediaEntry}
            onChange={home.setMediaEntry}
            resolved={(slot) => homeMedia(home.settings, slot as never)}
          />

          <SaveButton
            onSubmit={async () => {
              await home.save();
              toast.success(t("admin.home.saved"));
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
