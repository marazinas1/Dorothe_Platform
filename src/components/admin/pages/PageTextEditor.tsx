import { useTranslation } from "react-i18next";

import { PAGE_FIELD_GROUPS, type PageDefinition } from "@/lib/pages/fields";
import { DefaultTextField } from "@/components/admin/ui/DefaultTextField";
import { LockAllDefaultsBar } from "@/components/admin/ui/LockAllDefaultsBar";

type Kind = "line" | "paragraph" | "list";

type Props = {
  definition: PageDefinition;
  value: (key: string) => string;
  placeholder: (key: string) => string;
  isLocked: (key: string) => boolean;
  lockedCount: number;
  fieldCount: number;
  onChange: (key: string, next: string, kind: Kind) => void;
  onReset: (key: string) => void;
  onSetDefault: (key: string, kind: Kind) => void;
  onLockAll: () => Promise<void> | void;
};

/**
 * The words of one public page, in the order the page itself reads. An untouched
 * field stays empty and the wording the page shows is printed above it.
 */
export function PageTextEditor({
  definition,
  value,
  placeholder,
  isLocked,
  lockedCount,
  fieldCount,
  onChange,
  onReset,
  onSetDefault,
  onLockAll,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <LockAllDefaultsBar locked={lockedCount} total={fieldCount} onLockAll={onLockAll} />

      {PAGE_FIELD_GROUPS.map((group) => {
        const fields = definition.fields.filter((f) => f.group === group);
        if (fields.length === 0) return null;
        return (
          <section key={group}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(`admin.pageEditor.groups.${group}`)}
            </h3>
            <div className="mt-4 grid gap-4">
              {fields.map((field) => (
                <DefaultTextField
                  key={field.key}
                  id={`page-${definition.key}-${field.key}`}
                  label={t(`admin.pageEditor.fields.${definition.key}.${field.key}`)}
                  kind={field.kind}
                  value={value(field.key)}
                  placeholder={placeholder(field.key)}
                  isLocked={isLocked(field.key)}
                  onChange={(next) => onChange(field.key, next, field.kind)}
                  onReset={() => onReset(field.key)}
                  onSetDefault={() => onSetDefault(field.key, field.kind)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
