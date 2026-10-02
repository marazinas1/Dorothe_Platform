import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old language-prefixed sign-in links land on the /admin sign-in pages. */
export const Route = createFileRoute("/$locale/auth/$")({
  staticData: { sitemap: false },
  beforeLoad: ({ params }) => {
    const page = params._splat === "reset-password" ? "set-password" : params._splat;
    const known = ["login", "forgot-password", "set-password"];
    throw redirect({ href: `/admin/${known.includes(page ?? "") ? page : "login"}`, replace: true });
  },
});
