import type { LucideIcon } from "lucide-react";

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-empty-state">
      <span className="admin-empty-icon" aria-hidden="true">
        <Icon className="h-5 w-5" />
      </span>
      <p className="font-medium text-foreground">{title}</p>
      {description ? <p className="max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}