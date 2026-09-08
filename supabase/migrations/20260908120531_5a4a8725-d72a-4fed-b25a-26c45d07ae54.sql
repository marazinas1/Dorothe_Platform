-- 1) Public views bypass RLS on their own (they already filter to publicly visible listings),
--    so anon no longer needs raw table access.
ALTER VIEW public.listings_public SET (security_invoker = false);
ALTER VIEW public.listing_images_public SET (security_invoker = false);
ALTER VIEW public.listing_documents_public SET (security_invoker = false);
ALTER VIEW public.listing_tours_public SET (security_invoker = false);

-- 2) Drop anon table-level SELECT policies and grants on the raw tables.
DROP POLICY IF EXISTS "listings anon select public" ON public.listings;
DROP POLICY IF EXISTS "listing_images anon select via view predicate" ON public.listing_images;
DROP POLICY IF EXISTS "listing_documents anon select via view predicate" ON public.listing_documents;
DROP POLICY IF EXISTS "listing_tours anon select via view predicate" ON public.listing_tours;

REVOKE SELECT ON public.listings FROM anon;
REVOKE SELECT ON public.listing_images FROM anon;
REVOKE SELECT ON public.listing_documents FROM anon;
REVOKE SELECT ON public.listing_tours FROM anon;

GRANT SELECT ON public.listings_public TO anon, authenticated;
GRANT SELECT ON public.listing_images_public TO anon, authenticated;
GRANT SELECT ON public.listing_documents_public TO anon, authenticated;
GRANT SELECT ON public.listing_tours_public TO anon, authenticated;

-- 3) SECURITY DEFINER trigger functions must not be directly callable by API roles.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.listings_set_actor() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.listings_validate_energy_on_publish() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.permissions_guard_overrides() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.profiles_enforce_role_integrity() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.profiles_protect_last_owner_del() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.profiles_protect_last_owner_upd() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_manage_profile(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.count_active_owners() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.storage_can_edit_listing_object(text, text) FROM anon;