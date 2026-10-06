// Server-only: the two emails every new enquiry triggers. Best effort — the
// enquiry is already stored, so a mail failure never fails the form.
import { ADMIN_URL } from "@/lib/email/sender";

type Admin = (typeof import("@/integrations/supabase/client.server"))["supabaseAdmin"];

interface NewInquiry {
  id: string;
  type: "listing" | "buyer" | "seller";
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  locale?: string;
  listingId?: string | null;
}

export async function sendInquiryEmails(admin: Admin, inquiry: NewInquiry): Promise<void> {
  try {
    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    const { data: s } = await admin
      .from("site_settings")
      .select("site_name, contact_email, default_locale")
      .limit(1)
      .maybeSingle();
    const siteName = s?.site_name ?? "Website";

    let subject: string | undefined;
    if (inquiry.listingId) {
      const { data: l } = await admin
        .from("listings")
        .select("title, reference_code")
        .eq("id", inquiry.listingId)
        .maybeSingle();
      const title = l?.title as Record<string, string> | null;
      subject = title?.[inquiry.locale ?? "de"] ?? title?.["de"] ?? title?.["en"] ?? undefined;
      if (subject && l?.reference_code) subject = `${subject} (${l.reference_code})`;
    }

    const jobs: Promise<unknown>[] = [
      sendTemplateEmail("inquiry-received", inquiry.email, {
        fromName: siteName,
        replyTo: s?.contact_email ?? undefined,
        idempotencyKey: `inquiry-received-${inquiry.id}`,
        templateData: { siteName, locale: inquiry.locale, name: inquiry.name, subject },
      }),
    ];
    if (s?.contact_email) {
      jobs.push(
        sendTemplateEmail("inquiry-new", s.contact_email, {
          fromName: siteName,
          replyTo: inquiry.email,
          idempotencyKey: `inquiry-new-${inquiry.id}`,
          templateData: {
            siteName,
            locale: s.default_locale,
            type: inquiry.type,
            name: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone ?? undefined,
            message: inquiry.message ?? undefined,
            subject,
            adminUrl: `${ADMIN_URL}/inquiries/${inquiry.id}`,
          },
        }),
      );
    }
    const results = await Promise.allSettled(jobs);
    for (const r of results) {
      if (r.status === "rejected") console.error("[inquiry-email] send failed", r.reason);
    }
  } catch (error) {
    console.error("[inquiry-email] skipped", error);
  }
}
