import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PAGE_FIELD_GROUPS, type PageDefinition } from "@/lib/pages/fields";

type Props = {
  definition: PageDefinition;
  value: (key: string) => string;
  onChange: (key: string, next: string, kind: "line" | "paragraph" | "list") => void;
  /** The line the page shows today when the field is left empty. */
  placeholder: (key: string, kind: "line" | "paragraph" | "list") => string;
};

/**
 * The words of one public page, grouped the way the page reads. An empty field
 * is not a hole: the page keeps its translated default line.
 */
export function PageTextEditor({ definition, value, onChange, placeholder }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {PAGE_FIELD_GROUPS.map((group) => {
        const fields = definition.fields.filter((f) => f.group === group);
        if (fields.length === 0) return null;
        return (
          <section key={group}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(`admin.pages.groups.${group}`)}
            </h3>
            <div className="mt-4 grid gap-4">
              {fields.map((field) => {
                const id = `page-${definition.key}-${field.key}`;
                const hint = placeholder(field.key, field.kind);
                return (
                  <div key={field.key} className="grid gap-1.5">
                    <Label htmlFor={id} className="text-sm">
                      {t(`admin.pages.fields.${definition.key}.${field.key}`)}
                    </Label>
                    {field.kind === "line" ? (
                      <Input
                        id={id}
                        value={value(field.key)}
                        placeholder={hint || t("admin.pages.placeholder")}
                        onChange={(e) => onChange(field.key, e.target.value, field.kind)}
                      />
                    ) : (
                      <Textarea
                        id={id}
                        rows={field.kind === "list" ? 4 : 3}
                        value={value(field.key)}
                        placeholder={
                          hint ||
                          (field.kind === "list"
                            ? t("admin.pages.listHint")
                            : t("admin.pages.placeholder"))
                        }
                        onChange={(e) => onChange(field.key, e.target.value, field.kind)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
