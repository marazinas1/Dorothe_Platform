import { z } from "zod";

import { PAGE_KEYS } from "@/lib/pages/fields";

const PageKeySchema = z.string().refine((v) => (PAGE_KEYS as string[]).includes(v), "unknown page");

export const PageContentSelectSchema = z.object({ page: PageKeySchema });

/** Field → locale → text or list of lines. */
const LocalizedValue = z.union([z.string(), z.array(z.string())]);

const LocalizedBag = z.record(z.string(), z.record(z.string(), LocalizedValue));

export const PageContentSaveSchema = z.object({
  page: PageKeySchema,
  content: LocalizedBag,
  media: z.record(
    z.string(),
    z.object({ mode: z.enum(["default", "custom"]), url: z.string() }),
  ),
});

/** Developer-only: the wording locked in as this clone's default. */
export const PageDefaultsSaveSchema = z.object({
  page: PageKeySchema,
  defaults: LocalizedBag,
  content: LocalizedBag,
});

export type PageContentSaveInput = z.infer<typeof PageContentSaveSchema>;

