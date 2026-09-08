import { useTranslation } from "react-i18next";

/**
 * Miniature of the real page: the signed preview rendered in a wide frame and
 * scaled down. Not interactive — the card around it owns the click.
 */
export function TemplateThumb({ url }: { url: string | null }) {
  const { t } = useTranslation();

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-muted">
      {url ? (
        <iframe
          src={url}
          title=""
          tabIndex={-1}
          aria-hidden
          loading="lazy"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{ width: "1440px", height: "1100px", transform: "scale(0.28)" }}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
          {t("admin.home.thumbLoading")}
        </div>
      )}
      {/* Keeps the miniature reading as an image, not a nested page. */}
      <div className="absolute inset-0" />
    </div>
  );
}
