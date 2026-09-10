import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSection({
  title,
  description,
  icon: Icon,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("admin-section", className)}>
      {title || description || actions ? (
        <header className="admin-section-header">
          <div className="min-w-0">
            {title ? (
              <h2 className="flex items-center gap-2">
                {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
                {title}
              </h2>
            ) : null}
            {description ? <p>{description}</p> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </header>
      ) : null}
      <div className="admin-section-body">{children}</div>
    </section>
  );
}