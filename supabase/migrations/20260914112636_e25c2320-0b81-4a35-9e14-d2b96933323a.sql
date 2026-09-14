DROP POLICY IF EXISTS "post slug history read" ON public.post_slug_history;

CREATE POLICY "published post slug history read"
ON public.post_slug_history
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.posts
    WHERE posts.id = post_slug_history.post_id
      AND posts.status = 'published'
  )
  OR (
    auth.role() = 'authenticated'
    AND public.current_user_is_active()
    AND public.current_user_has_permission('settings.edit')
  )
);