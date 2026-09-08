REVOKE EXECUTE ON FUNCTION public.can_manage_profile(uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.is_owner_or_above() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.storage_can_edit_listing_object(text, text) FROM authenticated;