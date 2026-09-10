CREATE POLICY "site_settings_editor_update" ON public.site_settings
FOR UPDATE TO authenticated
USING (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'))
WITH CHECK (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

GRANT UPDATE ON public.site_settings TO authenticated;