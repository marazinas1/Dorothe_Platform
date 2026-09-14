import { Wrench } from "lucide-react";

import { SiteLogo } from "@/components/brand/SiteLogo";
import type { Locale } from "@/i18n/config";
import type { SiteSettings } from "@/types/site-settings";

export function MaintenancePage({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const german = locale === "de";
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <section className="mx-auto max-w-xl text-center">
        <div className="mb-10 flex justify-center"><SiteLogo settings={settings} size="sm" /></div>
        <Wrench className="mx-auto h-7 w-7 text-primary" aria-hidden />
        <h1 className="mt-6 font-heading text-4xl sm:text-5xl">
          {german ? "Wir sind bald wieder da." : "We’ll be back shortly."}
        </h1>
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          {german
            ? "Die Website wird gerade aktualisiert. Bitte versuchen Sie es später erneut."
            : "The website is currently being updated. Please try again later."}
        </p>
      </section>
    </main>
  );
}