DROP POLICY IF EXISTS "post-images anon read" ON storage.objects;
DROP POLICY IF EXISTS "post-images edit insert" ON storage.objects;
DROP POLICY IF EXISTS "post-images edit update" ON storage.objects;
DROP POLICY IF EXISTS "post-images edit delete" ON storage.objects;

CREATE POLICY "post-images anon read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'post-images');

CREATE POLICY "post-images edit insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'post-images'
    AND public.current_user_is_active()
    AND public.current_user_has_permission('settings.edit')
  );

CREATE POLICY "post-images edit update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'post-images'
    AND public.current_user_is_active()
    AND public.current_user_has_permission('settings.edit')
  )
  WITH CHECK (
    bucket_id = 'post-images'
    AND public.current_user_is_active()
    AND public.current_user_has_permission('settings.edit')
  );

CREATE POLICY "post-images edit delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'post-images'
    AND public.current_user_is_active()
    AND public.current_user_has_permission('settings.edit')
  );