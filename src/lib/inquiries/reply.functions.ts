// Replying to an enquiry from admin: sends one email to the enquirer and
// keeps the sent text in the enquiry history.
import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertCanViewInquiries } from "./admin.server";

export interface InquiryReply {
  id: string;
  body: string;
  created_at: string;
}

export const listInquiryReplies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<InquiryReply[]> => {
    await assertCanViewInquiries(context.supabase, context.userId);
    const { data: rows, error } = await context.supabase
      .from("inquiry_replies")
      .select("id, body, created_at")
      .eq("inquiry_id", data.id)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export function inquiryRepliesQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["admin", "inquiry", id, "replies"],
    queryFn: () => listInquiryReplies({ data: { id } }),
  });
}

export const sendInquiryReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), body: z.string().trim().min(1).max(8000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertCanViewInquiries(supabase, userId);

    // RLS confirms the caller may see this enquiry before anything is sent.
    const { data: inq, error } = await supabase
      .from("inquiries")
      .select("id, name, email, message, locale, status")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !inq) throw new Error("Not found");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: s } = await supabaseAdmin
      .from("site_settings")
      .select("site_name, contact_email")
      .limit(1)
      .maybeSingle();
    const siteName = s?.site_name ?? "Website";

    const { data: saved, error: insErr } = await supabase
      .from("inquiry_replies")
      .insert({ inquiry_id: inq.id, body: data.body, sent_by: userId })
      .select("id")
      .single();
    if (insErr || !saved) throw new Error(insErr?.message ?? "Save failed");

    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    const result = await sendTemplateEmail("inquiry-reply", inq.email, {
      fromName: siteName,
      replyTo: s?.contact_email ?? undefined,
      idempotencyKey: `inquiry-reply-${saved.id}`,
      templateData: {
        siteName,
        locale: inq.locale ?? undefined,
        name: inq.name ?? undefined,
        body: data.body,
        original: inq.message ?? undefined,
      },
    }).catch(async (e) => {
      await supabaseAdmin.from("inquiry_replies").delete().eq("id", saved.id);
      console.error("[inquiry-reply] send failed", e);
      throw new Error("send_failed");
    });
    if (!result.sent) {
      await supabaseAdmin.from("inquiry_replies").delete().eq("id", saved.id);
      throw new Error("recipient_suppressed");
    }

    if (inq.status !== "closed") {
      await supabase.from("inquiries").update({ status: "answered" } as never).eq("id", inq.id);
    }
    return { ok: true as const };
  });
