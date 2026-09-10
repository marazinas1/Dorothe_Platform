import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import type { InviteResult } from "@/lib/users/types";
import {
  errorMessage,
  usersQueryOptions,
  useUserMutations,
} from "@/lib/users/use-manage-users";
import { InviteResultPanel } from "./InviteResultPanel";
import { InviteUserForm } from "./InviteUserForm";
import { UserRow } from "./UserRow";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminSection } from "@/components/admin/ui/AdminSection";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { UserPlus, Users } from "lucide-react";

export function UsersPage() {
  const { t } = useTranslation();
  const { data } = useSuspenseQuery(usersQueryOptions);
  const [result, setResult] = useState<InviteResult | null>(null);
  const m = useUserMutations(setResult);

  const fail = (err: unknown) => toast.error(errorMessage(err));
  const busy =
    m.setRole.isPending ||
    m.revoke.isPending ||
    m.restore.isPending ||
    m.remove.isPending;

  return (
    <div className="space-y-8">
      <AdminPageHeader icon={Users} title={t("admin.users.title")} description={t("admin.users.subtitle")} />

      <AdminSection icon={UserPlus} title={t("admin.users.invite.title")}>
        <div className="space-y-4">
          <InviteUserForm
            pending={m.invite.isPending}
            onInvite={(input) =>
              m.invite.mutate(input, {
                onError: fail,
                onSuccess: () => toast.success(t("admin.users.invite.done")),
              })
            }
          />
          {result ? <InviteResultPanel result={result} /> : null}
        </div>
      </AdminSection>

      <AdminSection title={t("admin.users.list.title")} className="[&_.admin-section-body]:p-0">
        <ul className="divide-y divide-border">
          {data.users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              busy={busy}
              onSetRole={(role) =>
                m.setRole.mutate(
                  { userId: user.id, role },
                  { onError: fail, onSuccess: () => toast.success(t("admin.users.saved")) },
                )
              }
              onRevoke={() =>
                m.revoke.mutate(user.id, {
                  onError: fail,
                  onSuccess: () => toast.success(t("admin.users.saved")),
                })
              }
              onRestore={() =>
                m.restore.mutate(user.id, {
                  onError: fail,
                  onSuccess: () => toast.success(t("admin.users.saved")),
                })
              }
              onDelete={() =>
                m.remove.mutate(user.id, {
                  onError: fail,
                  onSuccess: () => toast.success(t("admin.users.deleted")),
                })
              }
            />
          ))}
          {data.users.length === 0 ? (
            <li className="p-4"><AdminEmptyState icon={Users} title={t("admin.users.list.empty")} /></li>
          ) : null}
        </ul>
      </AdminSection>
    </div>
  );
}
