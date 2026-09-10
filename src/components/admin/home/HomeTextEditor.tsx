import { useTranslation } from "react-i18next";
import { Undo2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HOME_FIELD_GROUPS, HOME_TEXT_FIELDS } from "@/lib/home/fields";
import { usePermission } from "@/lib/auth/use-permission";

type Props = {
  value: (key: string) => string;
  onChange: (key: string, next: string, kind: "line" | "paragraph" | "list") => void;
  hasOverride: (key: string) => boolean;
  onReset: (key: string) => void;
};

/**
 * The words of the home page, grouped the way the page reads. Every field
 * shows exactly what the page shows: the stored override when there is one,
 * otherwise the live default. Reset clears the override again.
 */
export function HomeTextEditor({ value, onChange, hasOverride, onReset }: Props) {
  const { t } = useTranslation();
  const canDesign = usePermission("design.edit");
  const fields = HOME_TEXT_FIELDS;

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
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor={`home-${field.key}`} className="text-sm">
                      {t(`admin.home.fields.${field.key}`)}
                    </Label>
                    {canDesign && hasOverride(field.key) ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground"
                        onClick={() => onReset(field.key)}
                      >
                        <Undo2 className="mr-1 h-3 w-3" />
                        {t("admin.home.resetToDefault")}
                      </Button>
                    ) : null}
                  </div>
                  {field.kind === "line" ? (
                    <Input
                      id={`home-${field.key}`}
                      value={value(field.key)}
                      onChange={(e) => onChange(field.key, e.target.value, field.kind)}
                    />
                  ) : (
                    <Textarea
                      id={`home-${field.key}`}
                      rows={field.kind === "list" ? 4 : 3}
                      value={value(field.key)}
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
