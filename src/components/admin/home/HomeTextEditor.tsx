import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HOME_FIELD_GROUPS, fieldsForTemplate } from "@/lib/home/fields";
import type { HomeTemplateKey } from "@/lib/home/templates";

type Props = {
  template: HomeTemplateKey;
  value: (key: string) => string;
  onChange: (key: string, next: string, kind: "line" | "paragraph" | "list") => void;
};

/**
 * The words of the live design, grouped the way the page reads. An empty field
 * is not a hole: the page falls back to the design's own default line.
 */
export function HomeTextEditor({ template, value, onChange }: Props) {
  const { t } = useTranslation();
  const fields = fieldsForTemplate(template);

  /** An empty field falls back to this line on the page, so show it here too. */
  const defaultFor = (key: string) => {
    const k = `home.defaults.${key}`;
    const line = t(k);
    return line === k ? "" : line;
  };

  return (
    <div className="space-y-8">
      {HOME_FIELD_GROUPS.map((group) => {
        const groupFields = fields.filter((f) => f.group === group);
        if (groupFields.length === 0) return null;
        return (
          <section key={group}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(`admin.home.groups.${group}`)}
            </h3>
            <div className="mt-4 grid gap-4">
              {groupFields.map((field) => (
                <div key={field.key} className="grid gap-1.5">
                  <Label htmlFor={`home-${field.key}`} className="text-sm">
                    {t(`admin.home.fields.${field.key}`)}
                  </Label>
                  {field.kind === "line" ? (
                    <Input
                      id={`home-${field.key}`}
                      value={value(field.key)}
                      placeholder={defaultFor(field.key) || t("admin.home.placeholder")}
                      onChange={(e) => onChange(field.key, e.target.value, field.kind)}
                    />
                  ) : (
                    <Textarea
                      id={`home-${field.key}`}
                      rows={field.kind === "list" ? 4 : 3}
                      value={value(field.key)}
                      placeholder={
                        defaultFor(field.key) ||
                        (field.kind === "list"
                          ? t("admin.home.listHint")
                          : t("admin.home.placeholder"))
                      }
                      onChange={(e) => onChange(field.key, e.target.value, field.kind)}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
