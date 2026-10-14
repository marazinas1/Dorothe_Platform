// Admin-side documents (floor plan PDF, exposé) and the 360° tour link of one
// listing. Runs through the browser client, so the listing_documents /
// listing_tours RLS and the listing-documents storage policies decide access.
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { DOCUMENTS_BUCKET, documentPath } from "./media-paths";

export type AdminDocType = "floorplan" | "expose";
export type AdminDocument = {
  id: string;
  type: string | null;
  filename: string;
  storage_path: string;
  requires_lead: boolean;
};

/** A floor plan may also be a rendered 2D/3D image, not only a PDF. */
export const FLOORPLAN_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const EXT: Record<string, string> = { "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_BYTES = 20 * 1024 * 1024;
const key = (id: string | null) => ["admin", "listing-files", id] as const;

export function useListingFiles(listingId: string | null) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: key(listingId),
    enabled: !!listingId,
    queryFn: async () => {
      const [docs, tours] = await Promise.all([
        supabase
          .from("listing_documents")
          .select("id, type, filename, storage_path, requires_lead")
          .eq("listing_id", listingId!)
          .order("created_at"),
        supabase
          .from("listing_tours")
          .select("id, url")
          .eq("listing_id", listingId!)
          .order("sort_order")
          .limit(1),
      ]);
      if (docs.error) throw new Error(docs.error.message);
      if (tours.error) throw new Error(tours.error.message);
      return {
        documents: (docs.data ?? []) as AdminDocument[],
        tour: tours.data?.[0] ?? null,
      };
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: key(listingId) });

  /** Uploads (or replaces) the single document of one type. */
  async function upload(id: string, type: AdminDocType, file: File) {
    if (file.size > MAX_BYTES) throw new Error("too_large");
    const allowed = type === "floorplan" ? FLOORPLAN_TYPES : ["application/pdf"];
    if (!allowed.includes(file.type)) throw new Error(type === "floorplan" ? "not_plan" : "not_pdf");
    const ext = EXT[file.type] ?? "pdf";
    const previous = query.data?.documents.filter((d) => d.type === type) ?? [];
    const docId = crypto.randomUUID();
    const path = documentPath(id, docId, ext);
    const up = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .upload(path, file, { contentType: file.type });
    if (up.error) throw new Error(up.error.message);
    const ins = await supabase.from("listing_documents").insert({
      id: docId,
      listing_id: id,
      type,
      storage_path: path,
      filename: file.name.slice(0, 255),
      is_public: true,
      // An exposé is sent after an enquiry by default; a floor plan is open.
      requires_lead: type === "expose",
    });
    if (ins.error) {
      await supabase.storage.from(DOCUMENTS_BUCKET).remove([path]);
      throw new Error(ins.error.message);
    }
    for (const doc of previous) await remove(doc, false);
    await refresh();
  }

  /** Deletes the row and its storage object, so nothing is orphaned. */
  async function remove(doc: AdminDocument, reload = true) {
    const del = await supabase.from("listing_documents").delete().eq("id", doc.id);
    if (del.error) throw new Error(del.error.message);
    await supabase.storage.from(DOCUMENTS_BUCKET).remove([doc.storage_path]);
    if (reload) await refresh();
  }

  async function setRequiresLead(doc: AdminDocument, value: boolean) {
    const res = await supabase
      .from("listing_documents")
      .update({ requires_lead: value })
      .eq("id", doc.id);
    if (res.error) throw new Error(res.error.message);
    await refresh();
  }

  /** One tour link per listing; an empty value removes it. */
  async function saveTour(id: string, url: string) {
    const current = query.data?.tour ?? null;
    const clean = url.trim();
    if (!clean) {
      if (current) await supabase.from("listing_tours").delete().eq("id", current.id);
    } else if (current) {
      const r = await supabase.from("listing_tours").update({ url: clean }).eq("id", current.id);
      if (r.error) throw new Error(r.error.message);
    } else {
      const r = await supabase
        .from("listing_tours")
        .insert({ listing_id: id, url: clean, type: "360", sort_order: 0 });
      if (r.error) throw new Error(r.error.message);
    }
    await refresh();
  }

  return { ...query, upload, remove, setRequiresLead, saveTour };
}
