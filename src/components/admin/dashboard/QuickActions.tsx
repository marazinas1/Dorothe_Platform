import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ExternalLink, Newspaper, Plus, Quote } from "lucide-react";

const LINK =
  "inline-flex items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted";

/** The most frequent jobs, one click away. */
export function QuickActions({ locale }: { locale: string }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t("admin.dashboard.quick.title")} className="flex flex-wrap gap-3">
      <Link to="/admin/listings/new" className={LINK}>
        <Plus className="h-4 w-4" strokeWidth={1.75} />
        {t("admin.dashboard.quick.newListing")}
      </Link>
      <Link to="/admin/testimonials" className={LINK}>
        <Quote className="h-4 w-4" strokeWidth={1.75} />
        {t("admin.dashboard.quick.testimonial")}
      </Link>
      <Link to="/admin/posts" className={LINK}>
        <Newspaper className="h-4 w-4" strokeWidth={1.75} />
        {t("admin.dashboard.quick.article")}
      </Link>
      <a href={`/${locale}`} target="_blank" rel="noreferrer" className={LINK}>
        <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
        {t("admin.dashboard.quick.viewSite")}
      </a>
    </nav>
  );
}
