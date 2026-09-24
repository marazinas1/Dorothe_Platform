import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminThemeScope } from "@/components/admin/AdminThemeScope";

export const Route = createFileRoute("/$locale/auth")({
  staticData: { sitemap: "exclude-subtree" },
  component: AuthLayout,
});

/**
 * The auth subtree owns its own full-bleed layout: the sign-in screen is a
 * two-column split, the password screens centre a paper card.
 */
function AuthLayout() {
  return (
    <AdminThemeScope>
      <main className="min-h-screen bg-background font-sans text-foreground">
        <Outlet />
      </main>
    </AdminThemeScope>
  );
}
