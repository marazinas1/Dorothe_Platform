import { useTranslation } from "react-i18next";
import { Undo2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PAGE_FIELD_GROUPS, type PageDefinition } from "@/lib/pages/fields";
import { usePermission } from "@/lib/auth/use-permission";

type Props = {
  definition: PageDefinition;
  value: (key: string) => string;
  onChange: (key: string, next: string, kind: "line" | "paragraph" | "list") => void;
  hasOverride: (key: string) => boolean;
  onReset: (key: string) => void;
};

/**
 * The words of one public page, grouped the way the page reads. Every field
 * shows exactly what the page shows: the stored override when there is one,
 * otherwise the live default. Reset clears the override again.
 */
export function PageTextEditor({ definition, value, onChange, hasOverride, onReset }: Props) {
  const { t } = useTranslation();
  const canDesign = usePermission("design.edit");

  return (
    <div className="space-y-8">
      {PAGE_FIELD_GROUPS.map((group) => {
        const fields = definition.fields.filter((f) => f.group === group);
        if (fields.length === 0) return null;
        return (
          <section key={group}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(`admin.pageEditor.groups.${group}`)}
            </h3>
            <div className="mt-4 grid gap-4">
              {fields.map((field) => {
                const id = `page-${definition.key}-${field.key}`;
                return (
                  <div key={field.key} className="grid gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor={id} className="text-sm">
                        {t(`admin.pageEditor.fields.${definition.key}.${field.key}`)}
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
                          {t("admin.pageEditor.resetToDefault")}
                        </Button>
                      ) : null}
                    </div>
                    {field.kind === "line" ? (
                      <Input
                        id={id}
                        value={value(field.key)}
                        onChange={(e) => onChange(field.key, e.target.value, field.kind)}
                      />
                    ) : (
                      <Textarea
                        id={id}
                        rows={field.kind === "list" ? 4 : 3}
                        value={value(field.key)}
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
