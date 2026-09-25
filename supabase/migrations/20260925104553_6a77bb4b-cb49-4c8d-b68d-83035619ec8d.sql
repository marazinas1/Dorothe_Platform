DROP POLICY IF EXISTS "inquiries auth insert" ON public.inquiries;
CREATE POLICY "inquiries auth insert" ON public.inquiries FOR INSERT TO authenticated
WITH CHECK (
  public.current_user_is_active()
  OR (listing_id IS NOT NULL AND public.listing_is_public(listing_id))
);