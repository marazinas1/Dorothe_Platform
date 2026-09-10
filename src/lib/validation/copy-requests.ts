import { z } from "zod";

/** One request to turn the broker's own wording into this clone's default. */
export const DefaultTextRequestCreateSchema = z.object({
  scope: z.enum(["home", "page"]),
  page: z.string().nullable().optional(),
  field_key: z.string().min(1),
  locale: z.string().min(2).max(5),
  requested_text: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
});

export const DefaultTextRequestResolveSchema = z.object({
  id: z.string().uuid(),
  approve: z.boolean(),
});

export const DefaultTextRequestSeenSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});

export type DefaultTextRequestCreateInput = z.infer<typeof DefaultTextRequestCreateSchema>;
