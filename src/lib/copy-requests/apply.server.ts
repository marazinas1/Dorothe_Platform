// Server-only: folds one approved wording into this clone's defaults and clears
// the matching override, so the public page keeps showing the same words.
import type { SupabaseClient } from "@supabase/supabase-js";

type Bag = Record<string, Record<string, unknown>>;

function withDefault(bag: Bag, field: string, locale: string, value: string | string[]): Bag {
  const entry = { ...(bag[field] ?? {}) };
  entry[locale] = value;
  return { ...bag, [field]: entry };
}

function withoutOverride(bag: Bag, field: string, locale: string): Bag {
  const entry = { ...(bag[field] ?? {}) };
  delete entry[locale];
  const next = { ...bag };
  if (Object.keys(entry).length === 0) delete next[field];
  else next[field] = entry;
  return next;
}

export async function applyDefaultTextRequest(
  supabase: SupabaseClient,
  request: {
    scope: "home" | "page";
    page: string | null;
    field_key: string;
    locale: string;
    requested_text: string | string[];
  },
): Promise<void> {
  const { field_key, locale, requested_text } = request;

  if (request.scope === "home") {
    const { data: row, error } = await supabase
      .from("site_settings")
      .select("id, home_defaults, home_content")
      .limit(1)
      .maybeSingle();
    if (error || !row) throw new Error("site_settings row missing");

    const defaults = withDefault(
      (row.home_defaults ?? {}) as Bag,
      field_key,
      locale,
      requested_text,
    );
    const content = withoutOverride((row.home_content ?? {}) as Bag, field_key, locale);

    const { error: writeError } = await supabase
      .from("site_settings")
      .update({ home_defaults: defaults, home_content: content } as never)
      .eq("id", row.id);
    if (writeError) throw new Error(`Update failed: ${writeError.message}`);
    return;
  }

  const page = request.page;
  if (!page) throw new Error("Page missing on request");

  const { data: row, error } = await supabase
    .from("page_content")
    .select("defaults, content, media")
    .eq("page", page)
    .maybeSingle();
  if (error) throw new Error(`Failed to load page content: ${error.message}`);

  const defaults = withDefault((row?.defaults ?? {}) as Bag, field_key, locale, requested_text);
  const content = withoutOverride((row?.content ?? {}) as Bag, field_key, locale);

  const { error: writeError } = await supabase
    .from("page_content")
    .upsert(
      { page, defaults, content, media: row?.media ?? {} } as never,
      { onConflict: "page" },
    );
  if (writeError) throw new Error(`Update failed: ${writeError.message}`);
}
