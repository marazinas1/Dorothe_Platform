import { Link, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, LogOut } from "lucide-react";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSignOut } from "@/lib/auth/use-sign-out";
import type { Locale } from "@/i18n/config";

interface Props {
  /** Who is signed in — shown at the bottom of the sidebar. */
  email: string;
  roleLabel: string;
}

/** Signed-in identity, public-site link and sign-out at the sidebar bottom. */
export function AdminSidebarFooter({ email, roleLabel }: Props) {
  const { t } = useTranslation();
  const { locale } = useParams({ strict: false }) as { locale: Locale };
  const signOut = useSignOut();

  return (
    <SidebarFooter className="gap-3 border-t border-sidebar-border p-4">
      <div className="px-2 py-2">
        <div className="truncate text-xs font-medium text-sidebar-accent-foreground">{email}</div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground">
          {roleLabel}
        </div>
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={t("admin.nav.backToSite")}>
            <Link
              to="/$locale"
              params={{ locale }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t("admin.nav.backToSite")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={t("admin.topbar.signOut")} onClick={() => void signOut()}>
            <LogOut className="h-4 w-4" />
            <span>{t("admin.topbar.signOut")}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
