import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { pageDefinition, type PageDefinition } from "@/lib/pages/fields";
import { usePageAdmin } from "@/lib/pages/use-page-admin";

import { PageEditorWorkspace } from "./PageEditorWorkspace";

/**
 * One static public page: its words and photographs on the left, the page
 * itself beside them.
 */
export function PageAdminPage({ page }: { page: string }) {
  const { t } = useTranslation();
  const definition = pageDefinition(page);

  // An unknown page has no stored copy to ask for, so nothing is fetched.
  if (!definition) {
    return <p className="text-sm text-muted-foreground">{t("admin.pageEditor.unknown")}</p>;
  }

  return <PageEditor definition={definition} />;
}

function PageEditor({ definition }: { definition: PageDefinition }) {
  const { t } = useTranslation();
  const page = definition.key;
  const [contentLocale, setContentLocale] = useState<string | null>(null);
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);

  const enabled = (settings.enabled_locales ?? []).filter(Boolean);
  const locales = enabled.length > 0 ? enabled : [settings.default_locale];
  const locale = contentLocale ?? locales[0];
  const admin = usePageAdmin(page, locale);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(`admin.nav.${definition.key}`)}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("admin.pageEditor.editHint")}</p>
      </header>

      <PageEditorWorkspace
        definition={definition}
        admin={admin}
        locales={locales}
        locale={locale}
        onLocale={setContentLocale}
      />
    </div>
  );
}
