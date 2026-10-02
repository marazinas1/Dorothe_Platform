import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old language-prefixed admin bookmarks land on the /admin equivalent. */
export const Route = createFileRoute("/$locale/admin/$")({
  staticData: { sitemap: false },
  beforeLoad: ({ params }) => {
    const rest = params._splat ? `/${params._splat}` : "";
    throw redirect({ href: `/admin${rest}`, replace: true });
  },
});
