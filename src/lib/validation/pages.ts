import { z } from "zod";

import { PAGE_KEYS } from "@/lib/pages/fields";

const PageKeySchema = z.string().refine((v) => PAGE_KEYS.includes(v), "unknown page");

export const PageContentSelectSchema = z.object({ page: PageKeySchema });

/** Field → locale → text or list of lines. */
const LocalizedValue = z.union([z.string(), z.array(z.string())]);

export const PageContentSaveSchema = z.object({
  page: PageKeySchema,
  content: z.record(z.string(), z.record(z.string(), LocalizedValue)),
  media: z.record(
    z.string(),
    z.object({ mode: z.enum(["default", "custom"]), url: z.string() }),
  ),
});

export type PageContentSaveInput = z.infer<typeof PageContentSaveSchema>;
