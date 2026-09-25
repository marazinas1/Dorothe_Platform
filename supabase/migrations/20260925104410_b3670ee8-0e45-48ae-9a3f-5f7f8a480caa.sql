CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.current_user_has_permission(_key text)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_role text; v_active boolean; v_override boolean; v_granted boolean;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  SELECT role, is_active INTO v_role, v_active FROM public.profiles WHERE id = auth.uid();
  IF v_role IS NULL OR NOT COALESCE(v_active, false) THEN RETURN false; END IF;
  IF v_role = 'developer' THEN RETURN true; END IF;
  SELECT granted INTO v_override FROM public.permissions WHERE profile_id = auth.uid() AND permission_key = _key;
  IF FOUND THEN RETURN v_override; END IF;
  SELECT granted INTO v_granted FROM public.role_permissions WHERE role = v_role AND permission_key = _key;
  RETURN COALESCE(v_granted, false);
END; $$;

CREATE OR REPLACE FUNCTION private.current_user_is_active()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT COALESCE((SELECT is_active FROM public.profiles WHERE id = auth.uid()), false) $$;

CREATE OR REPLACE FUNCTION private.is_developer()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT public.has_role(ARRAY['developer']) $$;

CREATE OR REPLACE FUNCTION private.is_owner_or_above()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT public.has_role(ARRAY['developer','owner']) $$;

CREATE OR REPLACE FUNCTION private.can_manage_profile(_target uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT public.has_role(ARRAY['developer'])
     OR (public.has_role(ARRAY['developer','owner'])
         AND COALESCE((SELECT role FROM public.profiles WHERE id = _target), '') <> 'developer') $$;

CREATE OR REPLACE FUNCTION private.storage_can_edit_listing_object(_bucket text, _name text)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_listing uuid;
BEGIN
  v_listing := public.storage_listing_id_from_path(_name);
  IF v_listing IS NULL THEN RETURN false; END IF;
  RETURN EXISTS (SELECT 1 FROM public.listings l WHERE l.id = v_listing AND (
    private.current_user_has_permission('listing.edit.any')
    OR (private.current_user_has_permission('listing.edit.own')
        AND (l.agent_id = auth.uid() OR l.created_by = auth.uid()))));
END; $$;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA private FROM PUBLIC, anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.current_user_has_permission(_key text)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path TO 'public' AS $$
  SELECT private.current_user_has_permission(_key) $$;
CREATE OR REPLACE FUNCTION public.current_user_is_active()
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path TO 'public' AS $$
  SELECT private.current_user_is_active() $$;
CREATE OR REPLACE FUNCTION public.is_developer()
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path TO 'public' AS $$
  SELECT private.is_developer() $$;
CREATE OR REPLACE FUNCTION public.is_owner_or_above()
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path TO 'public' AS $$
  SELECT private.is_owner_or_above() $$;
CREATE OR REPLACE FUNCTION public.can_manage_profile(_target uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path TO 'public' AS $$
  SELECT private.can_manage_profile(_target) $$;
CREATE OR REPLACE FUNCTION public.storage_can_edit_listing_object(_bucket text, _name text)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path TO 'public' AS $$
  SELECT private.storage_can_edit_listing_object(_bucket, _name) $$;