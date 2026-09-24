import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

import { PAGE_FIELD_GROUPS, type PageDefinition } from "@/lib/pages/fields";
import { DefaultTextField } from "@/components/admin/ui/DefaultTextField";
import { LockAllDefaultsBar } from "@/components/admin/ui/LockAllDefaultsBar";
import { DefaultRequestNotices } from "@/components/admin/copy/DefaultRequestNotices";
import { useDefaultRequests } from "@/lib/copy-requests/use-default-requests";

type Kind = "line" | "paragraph" | "list";

type Props = {
  definition: PageDefinition;
  locale: string;
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
  locale,
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
  const requests = useDefaultRequests("page", definition.key, locale);

  async function ask(key: string, kind: Kind) {
    const own = value(key).trim();
    if (!own) return;
    const text =
      kind === "list" ? own.split("\n").map((l) => l.trim()).filter(Boolean) : own;
    await requests.request(key, text);
    toast.success(t("admin.copyEditor.request.sent"));
  }

  return (
    <div className="space-y-8">
      <DefaultRequestNotices requests={requests} />
      <LockAllDefaultsBar locked={lockedCount} total={fieldCount} onLockAll={onLockAll} />

      {PAGE_FIELD_GROUPS.map((group) => {
        const fields = definition.fields.filter((f) => f.group === group && f.editable);
        if (fields.length === 0) return null;
        return (
          <details key={group} className="group rounded-[var(--radius)] border border-border bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
              <span className="admin-section-title text-muted-foreground">
                {t(`admin.pageEditor.groups.${group}`)}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="grid gap-4 border-t border-border p-4">
              {fields.map((field) => (
                <DefaultTextField
                  key={field.key}
                  id={`page-${definition.key}-${field.key}`}
                  label={t(`admin.pageEditor.fields.${definition.key}.${field.key}`)}
                  kind={field.kind}
                  value={value(field.key)}
                  placeholder={placeholder(field.key)}
                  isLocked={isLocked(field.key)}
                  requestStatus={requests.status(field.key)}
                  onChange={(next) => onChange(field.key, next, field.kind)}
                  onReset={() => onReset(field.key)}
                  onSetDefault={() => onSetDefault(field.key, field.kind)}
                  onRequestDefault={() => void ask(field.key, field.kind)}
                />
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
