import type { LucideIcon } from "lucide-react";

/**
 * Unframed page header as in the admin reference: h1 + one sentence on the
 * left, at most one primary action on the right. `icon` is accepted for
 * call-site compatibility but not rendered (the reference shows no icon).
 */
export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}) {
  return (
    <header className="admin-page-header">
      <div className="min-w-0">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="admin-page-actions">{actions}</div> : null}
    </header>
  );
}
