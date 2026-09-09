import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";

import {
  isSitemapRouteIncluded,
  sitemapPathForLocation,
  sitemapXML,
  type SitemapEntry,
} from "@/lib/sitemap";

const BASE_URL = "https://dorothe.deerva.com";

/** Statuses that render a public listing page. */
const PUBLIC_LISTING_STATUSES = ["active", "coming_soon", "reserved", "sold", "rented"];

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!;
  return import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          const headers = new Headers(init?.headers);
          // Opaque sb_ keys are not JWTs; send apikey without the default bearer.
          if (key.startsWith("sb_") && headers.get("Authorization") === "Bearer " + key) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    }),
  );
}

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const supabase = await publicClient();

        const { data: settingsRow, error: settingsError } = await supabase
          .from("site_settings")
          .select("enabled_locales, default_locale")
          .limit(1)
          .maybeSingle();
        if (settingsError) throw settingsError;
        const locales: string[] = (settingsRow?.enabled_locales as string[] | null)?.filter(
          Boolean,
        ) ?? [settingsRow?.default_locale ?? "en"];

        const entries: SitemapEntry[] = [];
        const add = (to: string, params: Record<string, string>, routeId: string) => {
          const location = router.buildLocation({
            to,
            params,
            search: () => ({}),
            hash: "",
          } as never);
          const path = sitemapPathForLocation(router, location, routeId);
          if (path) entries.push({ path });
        };

        // Every static page, once per enabled language.
        for (const route of Object.values(router.routesById) as { id: string; fullPath: string }[]) {
          if (!isSitemapRouteIncluded(route as never)) continue;
          const dynamic = route.fullPath.match(/\$[A-Za-z_]*/g) ?? [];
          if (dynamic.length !== 1 || dynamic[0] !== "$locale") continue;
          for (const locale of locales) add(route.fullPath, { locale }, route.id);
        }

        const listingRoute = router.routesById["/$locale/immobilien/$slug"];
        if (isSitemapRouteIncluded(listingRoute as never)) {
          const pageSize = 1000;
          for (let offset = 0; ; ) {
            const { data, error } = await supabase
              .from("listings")
              .select("slug, updated_at")
              .in("status", PUBLIC_LISTING_STATUSES)
              .order("id")
              .range(offset, offset + pageSize - 1);
            if (error) throw error;
            if (!data || data.length === 0) break;
            for (const row of data) {
              for (const locale of locales) {
                add("/$locale/immobilien/$slug", { locale, slug: row.slug as string }, listingRoute.id);
              }
            }
            offset += data.length;
          }
        }

        const postRoute = router.routesById["/$locale/ratgeber/$slug"];
        if (isSitemapRouteIncluded(postRoute as never)) {
          const pageSize = 1000;
          for (let offset = 0; ; ) {
            const { data, error } = await supabase
              .from("posts")
              .select("slug")
              .eq("status", "published")
              .lte("published_at", new Date().toISOString())
              .order("id")
              .range(offset, offset + pageSize - 1);
            if (error) throw error;
            if (!data || data.length === 0) break;
            for (const row of data) {
              for (const locale of locales) {
                add("/$locale/ratgeber/$slug", { locale, slug: row.slug as string }, postRoute.id);
              }
            }
            offset += data.length;
          }
        }

        if (entries.length === 0) {
          return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
        }
        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
