import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ASSIGNABLE_ROLES, type AssignableRole } from "@/lib/users/assignable-roles";
import type { AdminUser } from "@/lib/users/types";

import { UserRowDialogs } from "./UserRowDialogs";

interface Props {
  user: AdminUser;
  busy: boolean;
  onSetRole: (role: AssignableRole) => void;
  onRevoke: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

export function UserRow({
  user,
  busy,
  onSetRole,
  onRevoke,
  onRestore,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const [confirm, setConfirm] = useState<"revoke" | "delete" | null>(null);

  const isDeveloper = user.role === "developer";
  const locked = !user.can_manage || isDeveloper || busy;
  const reason = user.is_self
    ? t("admin.users.locked.self")
    : isDeveloper
      ? t("admin.users.locked.developer")
      : user.is_last_owner
        ? t("admin.users.locked.lastOwner")
        : undefined;

  return (
    <li className="flex flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:flex-wrap md:items-center">
      <div className="min-w-0 w-full md:flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-medium">{user.full_name ?? user.email}</span>
          {user.is_self ? (
            <Badge variant="outline" className="gap-1">
              <ShieldCheck className="h-3 w-3" />
              {t("admin.users.badges.you")}
            </Badge>
          ) : null}
          <Badge variant="outline" className="gap-1">
            <ShieldCheck className="h-3 w-3" />
            {t(`admin.users.roles.${user.role}`)}
          </Badge>
          {user.is_last_owner ? (
            <Badge variant="outline" className="gap-1">
              <ShieldCheck className="h-3 w-3" />
              {t("admin.users.badges.lastOwner")}
            </Badge>
          ) : null}
          {!user.is_active ? (
            <Badge variant="outline">{t("admin.users.badges.revoked")}</Badge>
          ) : null}
        </div>
        {user.full_name ? (
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        ) : null}
        <p className="mt-0.5 text-xs text-muted-foreground">
          {t(`admin.users.roles.${user.role}`)}
          {" · "}
          {user.last_sign_in_at
            ? t("admin.users.lastSignIn", {
                date: new Date(user.last_sign_in_at).toLocaleDateString(),
              })
            : t("admin.users.neverSignedIn")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {isDeveloper ? (
          <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {t("admin.users.roles.developer")}
          </span>
        ) : (
          <Select
            value={user.role}
            disabled={locked}
            onValueChange={(value) => onSetRole(value as AssignableRole)}
          >
            <SelectTrigger className="w-full sm:w-36" title={reason}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSIGNABLE_ROLES.map((value) => (
                <SelectItem key={value} value={value}>
                  {t(`admin.users.roles.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {user.is_active ? (
          <Button
            variant="outline"
            size="sm"
            disabled={locked}
            title={reason ?? t("admin.users.actions.revoke")}
            onClick={() => setConfirm("revoke")}
          >
            {t("admin.users.actions.revoke")}
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled={locked} onClick={onRestore}>
            {t("admin.users.actions.restore")}
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          disabled={locked}
          title={reason}
          onClick={() => setConfirm("delete")}
        >
          {t("admin.users.actions.delete")}
        </Button>
      </div>

      <UserRowDialogs
        email={user.email}
        open={confirm}
        onClose={() => setConfirm(null)}
        onRevoke={onRevoke}
        onDelete={onDelete}
      />
    </li>
  );
}
