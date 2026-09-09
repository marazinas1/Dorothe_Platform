import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { SUPPORTED_LOCALES, FALLBACK_LOCALE } from "./i18n/config";

/**
 * URL shape: the default language has no prefix in the address bar
 * (dorothe.deerva.com/immobilien), every other language keeps its own
 * (/de/immobilien). Internally every page still lives under /$locale, so the
 * route tree, links and loaders are unchanged — only the visible URL is
 * rewritten in and out.
 */
const PREFIXED = SUPPORTED_LOCALES.filter((l) => l !== FALLBACK_LOCALE);
/** Paths the router must never re-prefix: server endpoints and RPC calls. */
const RESERVED = ["/api", "/_serverFn", "/_build", "/@", "/lovable", "/sitemap.xml", "/robots.txt"];

function firstSegment(pathname: string): string {
  return pathname.split("/")[1] ?? "";
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    rewrite: {
      // Browser URL -> internal URL: add the implicit default locale.
      input: ({ url }) => {
        if (RESERVED.some((p) => url.pathname.startsWith(p))) return;
        const seg = firstSegment(url.pathname);
        if (seg === FALLBACK_LOCALE || PREFIXED.includes(seg as never)) return;
        const next = new URL(url);
        next.pathname = `/${FALLBACK_LOCALE}${url.pathname === "/" ? "" : url.pathname}`;
        return next;
      },
      // Internal URL -> browser URL: hide the default locale prefix.
      output: ({ url }) => {
        const prefix = `/${FALLBACK_LOCALE}`;
        if (url.pathname !== prefix && !url.pathname.startsWith(`${prefix}/`)) return;
        const next = new URL(url);
        next.pathname = url.pathname.slice(prefix.length) || "/";
        return next;
      },
    },
  });

  return router;
};
