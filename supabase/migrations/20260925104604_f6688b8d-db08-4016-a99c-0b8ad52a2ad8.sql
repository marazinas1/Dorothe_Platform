DROP POLICY IF EXISTS "inquiries auth insert" ON public.inquiries;
CREATE POLICY "inquiries auth insert" ON public.inquiries FOR INSERT TO authenticated
WITH CHECK (
  public.current_user_is_active()
  OR EXISTS (SELECT 1 FROM public.listings l WHERE l.id = inquiries.listing_id
             AND l.status = ANY (ARRAY['active','coming_soon','reserved']))
);