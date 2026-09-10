// Server-only: tells the developer that the broker asked for wording to become
// the default. Sending is best effort — the request is stored either way.
import type { SupabaseClient } from "@supabase/supabase-js";

import { ADMIN_URL, SENDER_DOMAIN, fromAddress } from "@/lib/email/sender";

type Payload = {
  scope: "home" | "page";
  page: string | null;
  field_key: string;
  locale: string;
  requested_text: string | string[];
  requesterEmail: string | null;
};

export async function notifyDeveloperOfDefaultRequest(
  supabase: SupabaseClient,
  payload: Payload,
): Promise<void> {
  try {
    const { data: developers } = await supabase
      .from("profiles")
      .select("email")
      .eq("role", "developer")
      .eq("is_active", true);

    const recipients = (developers ?? [])
      .map((row: { email: string | null }) => row.email)
      .filter((email): email is string => Boolean(email));
    if (recipients.length === 0) return;

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return;

    const { data: settings } = await supabase
      .from("site_settings")
      .select("site_name")
      .limit(1)
      .maybeSingle();
    const siteName = (settings as { site_name?: string } | null)?.site_name ?? "Website";

    const where = payload.scope === "home" ? "Home page" : `Page: ${payload.page ?? "-"}`;
    const wording = Array.isArray(payload.requested_text)
      ? payload.requested_text.join("\n")
      : payload.requested_text;
    const text = [
      `${payload.requesterEmail ?? "The site owner"} asked to make this wording the default.`,
      "",
      `Where: ${where}`,
      `Field: ${payload.field_key} (${payload.locale.toUpperCase()})`,
      "",
      wording,
      "",
      `Approve or decline: ${ADMIN_URL}`,
    ].join("\n");

    const html = text
      .split("\n")
      .map((line) => (line ? `<p>${escapeHtml(line)}</p>` : "<br />"))
      .join("");

    const { sendLovableEmail } = await import("@lovable.dev/email-js");
    await Promise.all(
      recipients.map((to) =>
        sendLovableEmail(
          {
            to,
            from: fromAddress(siteName),
            sender_domain: SENDER_DOMAIN,
            subject: "New default wording request",
            html,
            text,
            purpose: "default-wording-request",
          },
          { apiKey, sendUrl: process.env["LOVABLE_SEND_URL"] },
        ),
      ),
    );
  } catch {
    // Never fail the request because the notification could not be sent.
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
