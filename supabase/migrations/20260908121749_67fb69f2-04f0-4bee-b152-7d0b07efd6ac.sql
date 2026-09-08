GRANT EXECUTE ON FUNCTION public.is_owner_or_above() TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_profile(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.storage_can_edit_listing_object(text, text) TO authenticated;