import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ASSIGNABLE_ROLES, type AssignableRole } from "@/lib/users/assignable-roles";

interface Props {
  pending: boolean;
  onInvite: (input: { email: string; role: AssignableRole; fullName?: string }) => void;
}

/**
 * One row on desktop: name, email and role share a baseline, and the submit is
 * an icon button — the admin never uses the public amber action style.
 */
export function InviteUserForm({ pending, onInvite }: Props) {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AssignableRole>("editor");

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        if (!email.trim()) return;
        onInvite({
          email: email.trim(),
          role,
          ...(fullName.trim() ? { fullName: fullName.trim() } : {}),
        });
      }}
    >
      <div className="space-y-1.5 sm:w-48">
        <Label htmlFor="invite-name">{t("admin.users.form.name")}</Label>
        <Input
          id="invite-name"
          autoComplete="off"
          value={fullName}
          placeholder={t("admin.users.form.namePlaceholder")}
          onChange={(event) => setFullName(event.target.value)}
        />
      </div>
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="invite-email">{t("admin.users.form.email")}</Label>
        <Input
          id="invite-email"
          type="email"
          required
          autoComplete="off"
          value={email}
          placeholder={t("admin.users.form.emailPlaceholder")}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="space-y-1.5 sm:w-40">
        <Label htmlFor="invite-role">{t("admin.users.form.role")}</Label>
        <Select value={role} onValueChange={(value) => setRole(value as AssignableRole)}>
          <SelectTrigger id="invite-role">
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
      </div>
      <Button type="submit" disabled={pending} title={t("admin.users.form.submit")}>
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
        {t("admin.users.form.submit")}
      </Button>
    </form>
  );
}
