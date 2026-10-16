ALTER TABLE public.listing_documents ADD COLUMN IF NOT EXISTS label text;
COMMENT ON COLUMN public.listing_documents.label IS 'Floor plan level: a preset key (basement, ground, first, second, third, attic, site) or free text.';
CREATE OR REPLACE VIEW public.listing_documents_public AS
SELECT d.id, d.listing_id, d.type, d.storage_path, d.filename, d.is_public, d.requires_lead, d.created_at, d.label
FROM public.listing_documents d JOIN public.listings_public p ON p.id = d.listing_id
WHERE d.is_public = true;