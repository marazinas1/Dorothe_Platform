import { z } from "zod";

const localizedShort = z.record(z.string(), z.string().max(300)).default({});
const localizedLong = z.record(z.string(), z.string().max(40_000)).default({});

export const PostInputSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().max(160).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  published_at: z.string().trim().max(40).nullable().default(null),
  cover_path: z.string().trim().max(2000).nullable().default(null),
  cover_alt: localizedShort,
  title: localizedShort,
  excerpt: localizedLong,
  body: localizedLong,
  meta_title: localizedShort,
  meta_description: localizedLong,
});

export type PostInput = z.infer<typeof PostInputSchema>;

export const PostIdSchema = z.object({ id: z.string().uuid() });

export const PostSlugSchema = z.object({ slug: z.string().trim().min(1).max(200) });
