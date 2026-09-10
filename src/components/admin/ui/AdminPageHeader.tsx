import type { LucideIcon } from "lucide-react";

export function AdminPageHeader({
  title,
  description,
  icon: Icon,
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
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <span className="admin-page-icon" aria-hidden="true">
              <Icon className="h-4 w-4" />
            </span>
          ) : null}
          <h1>{title}</h1>
        </div>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="admin-page-actions">{actions}</div> : null}
    </header>
  );
}