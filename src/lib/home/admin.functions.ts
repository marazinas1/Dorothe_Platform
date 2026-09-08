/**
 * Home page design management (core).
 *
 * Three server functions: mint a preview link, resolve a preview token during
 * SSR, and make a design the live one. Activation also writes the design's
 * palette and typefaces into the branding columns, so the owner can keep
 * adjusting any single colour afterwards in Branding.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SiteSettings } from "@/types/site-settings";

import { HOME_TEMPLATE_KEYS, HOME_TEMPLATES, homeTemplateKey } from "./templates";

const TemplateInput = z.object({
  template: z.enum(HOME_TEMPLATE_KEYS as [string, ...string[]]),
});

/** Signed-in editor asks for a preview link of a design. */
export const createHomePreviewLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => TemplateInput.parse(input))
  .handler(async ({ data, context }): Promise<{ template: string; token: string }> => {
    const { assertPermission } = await import("@/lib/auth/require-permission.server");
    await assertPermission(context.supabase, context.userId, "settings.edit");
    const { createHomePreviewToken } = await import("./preview.server");
    return { template: data.template, token: await createHomePreviewToken(data.template) };
  });

/** SSR check on the public home route: invalid token → the live design. */
export const resolveHomePreview = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ template: z.string().min(1), token: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data }): Promise<string | null> => {
    const key = homeTemplateKey(data.template);
    const { verifyHomePreviewToken } = await import("./preview.server");
    return (await verifyHomePreviewToken(key, data.token)) ? key : null;
  });

/** Make a design the live home page, and adopt its palette and typefaces. */
export const activateHomeTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => TemplateInput.parse(input))
  .handler(async ({ data, context }): Promise<SiteSettings> => {
    const { supabase, userId } = context;
    const { assertPermission } = await import("@/lib/auth/require-permission.server");
    await assertPermission(supabase, userId, "settings.edit");

    const key = homeTemplateKey(data.template);
    const patch = { active_home_template: key, ...HOME_TEMPLATES[key].theme };

    const { data: current, error: readError } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (readError || !current) throw new Error("site_settings row missing");

    const { data: updated, error } = await supabase
      .from("site_settings")
      .update(patch as never)
      .eq("id", current.id)
      .select("*")
      .maybeSingle();
    if (error || !updated) {
      throw new Error(`Activation failed: ${error?.message ?? "unknown"}`);
    }
    return updated as unknown as SiteSettings;
  });
