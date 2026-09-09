import { Link, useParams, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { newInquiryCountQueryOptions } from "@/lib/inquiries/admin.functions";
import {
  LayoutDashboard,
  Building2,
  Inbox,
  UserCog,
  Home,
  BarChart3,
  Settings,
  Quote,
  Newspaper,
  Handshake,
  Scale,
  Calculator,
  User,
  Mail,

} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { AdminSidebarFooter } from "./AdminSidebarFooter";
import { AdminSidebarHeader } from "./AdminSidebarHeader";
import { usePermission } from "@/lib/auth/use-permission";
import { useFeatureFlag } from "@/hooks/use-feature-flag";
import type { PermissionKey } from "@/lib/auth/permissions";
import type { Locale } from "@/i18n/config";

interface NavItem {
  key:
    | "dashboard"
    | "listings"
    | "inquiries"
    | "users"
    | "content"
    | "selling"
    | "inheritance"
    | "valuation"
    | "about"
    | "contact"
    | "testimonials"
    | "posts"
    | "analytics"
    | "settings";

  to: string;
  /** Set for the shared static-page editor route. */
  page?: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: PermissionKey;
  flag?: string;
}

interface NavGroup {
  /** Translation key under admin.nav.groups. */
  label: "workspace" | "website" | "settings";
  items: NavItem[];
}

/**
 * Grouped so the panel reads like the product: the day-to-day workspace first,
 * then the pages of the public site, then configuration.
 */
const GROUPS: NavGroup[] = [
  {
    label: "workspace",
    items: [
      { key: "dashboard", to: "/$locale/admin", icon: LayoutDashboard, permission: "inquiry.view.own" },
      { key: "inquiries", to: "/$locale/admin/inquiries", icon: Inbox, permission: "inquiry.view.own" },
      { key: "analytics", to: "/$locale/admin/analytics", icon: BarChart3, permission: "analytics.view.own" },
      { key: "users", to: "/$locale/admin/users", icon: UserCog, permission: "user.manage" },
    ],
  },
  {
    label: "website",
    items: [
      { key: "content", to: "/$locale/admin/content", icon: Home, permission: "settings.edit" },
      { key: "listings", to: "/$locale/admin/listings", icon: Building2, permission: "listing.create" },
      { key: "selling", to: "/$locale/admin/pages/$page", page: "selling", icon: Handshake, permission: "settings.edit" },
      { key: "inheritance", to: "/$locale/admin/pages/$page", page: "inheritance", icon: Scale, permission: "settings.edit" },
      { key: "valuation", to: "/$locale/admin/pages/$page", page: "valuation", icon: Calculator, permission: "settings.edit" },
      { key: "about", to: "/$locale/admin/pages/$page", page: "about", icon: User, permission: "settings.edit" },
      { key: "contact", to: "/$locale/admin/pages/$page", page: "contact", icon: Mail, permission: "settings.edit" },
      {
        key: "testimonials",
        to: "/$locale/admin/testimonials",
        icon: Quote,
        permission: "settings.edit",
        flag: "testimonials",
      },
      {
        key: "posts",
        to: "/$locale/admin/posts",
        icon: Newspaper,
        permission: "settings.edit",
        flag: "blog",
      },
    ],
  },

  {
    label: "settings",
    items: [
      { key: "settings", to: "/$locale/admin/settings", icon: Settings, permission: "settings.edit" },
    ],
  },
];

function NavRow({ item, locale }: { item: NavItem; locale: Locale }) {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const allowed = usePermission(item.permission);
  const flagOn = useFeatureFlag(item.flag ?? "__always__");
  const { data: newInquiries } = useQuery({
    ...newInquiryCountQueryOptions,
    enabled: item.key === "inquiries" && allowed,
  });
  if (!allowed) return null;
  if (item.flag && !flagOn) return null;

  const resolved = item.to
    .replace("$locale", locale)
    .replace("$page", item.page ?? "");
  const isActive =
    item.to === "/$locale/admin"
      ? pathname === resolved
      : pathname === resolved || pathname.startsWith(`${resolved}/`);
  const badge = item.key === "inquiries" ? (newInquiries ?? 0) : 0;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={t(`admin.nav.${item.key}`)}>
        <Link
          to={item.to}
          params={{ locale, ...(item.page ? { page: item.page } : {}) } as never}
          className="flex items-center gap-2"
        >
          <item.icon className="h-4 w-4" />
          <span>{t(`admin.nav.${item.key}`)}</span>
          {badge > 0 ? (
            <Badge className="ml-auto h-5 min-w-5 justify-center px-1.5 text-[11px]">
              {badge}
            </Badge>
          ) : null}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AdminSidebar({ email, roleLabel }: { email: string; roleLabel: string }) {
  const { t } = useTranslation();
  const { locale } = useParams({ strict: false }) as { locale: Locale };
  return (
    <Sidebar collapsible="icon">
      <AdminSidebarHeader />
      <SidebarContent>
        {GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{t(`admin.nav.groups.${group.label}`)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavRow key={item.key} item={item} locale={locale} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <AdminSidebarFooter email={email} roleLabel={roleLabel} />
    </Sidebar>
  );
}
