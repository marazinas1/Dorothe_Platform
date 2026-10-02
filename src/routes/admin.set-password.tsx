import { usePublicLocale } from "@/lib/config/use-public-locale";
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/brand/AuthCard";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword } from "@/lib/auth/password-schema";
import type { Locale } from "@/i18n/config";


export const Route = createFileRoute("/admin/set-password")({
  staticData: { sitemap: false },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { t } = useTranslation();
  const locale = usePublicLocale();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The auth client consumes the recovery tokens from the URL hash while it
    // initialises — often before this component subscribes — so we may only
    // ever see INITIAL_SESSION. Accept any event that carries a session, and
    // also check the current session directly.
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        session &&
        (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "INITIAL_SESSION")
      ) {
        setReady(true);
        setInvalid(false);
      }
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) setReady(true);
    });
    const timer = window.setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (data.session) setReady(true);
      else setInvalid(true);
    }, 1500);
    return () => {
      active = false;
      sub.subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const validation = validatePassword(password);
    if (validation) {
      switch (validation) {
        case "tooShort":
          setError(t("admin.auth.reset.tooShort"));
          break;
        case "noUppercase":
          setError(t("admin.auth.reset.noUppercase"));
          break;
        case "noLowercase":
          setError(t("admin.auth.reset.noLowercase"));
          break;
        case "noDigit":
          setError(t("admin.auth.reset.noDigit"));
          break;
        default:
          setError(t("admin.auth.reset.weak"));
      }
      return;
    }

    if (password !== confirm) {
      setError(t("admin.auth.reset.mismatch"));
      return;
    }
    setBusy(true);
    const { error: upErr } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (upErr) {
      const msg = upErr.message.toLowerCase();
      if (msg.includes("compromised") || msg.includes("known to be weak") || msg.includes("hibp")) {
        setError(t("admin.auth.reset.leaked"));
      } else {
        setError(upErr.message);
      }
      return;
    }
    setDone(true);
    window.setTimeout(
      () => navigate({ to: "/admin", replace: true }),
      1200,
    );
  }


  return (
    <AuthCard>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">{t("admin.auth.reset.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("admin.auth.reset.subtitle")}</p>
        </div>
        {invalid ? (
          <p className="text-sm text-destructive">{t("admin.auth.reset.invalidLink")}</p>
        ) : done ? (
          <p className="text-sm">{t("admin.auth.reset.success")}</p>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <p className="text-xs text-muted-foreground">
              {t("admin.auth.reset.requirements")}
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="pw">{t("admin.auth.reset.password")}</Label>
              <Input
                id="pw"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw2">{t("admin.auth.reset.confirm")}</Label>
              <Input
                id="pw2"
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy || !ready} className="w-full">
              {!ready
                ? t("admin.auth.reset.checking")
                : busy
                  ? t("admin.auth.reset.submitting")
                  : t("admin.auth.reset.submit")}
            </Button>
          </form>

        )}
      </div>
    </AuthCard>
  );
}
