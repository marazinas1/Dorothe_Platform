CREATE TABLE public.page_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page text NOT NULL UNIQUE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  media jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.page_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_content TO authenticated;
GRANT ALL ON public.page_content TO service_role;

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_content_public_read" ON public.page_content
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "page_content_editor_insert" ON public.page_content
  FOR INSERT TO authenticated
  WITH CHECK (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

CREATE POLICY "page_content_editor_update" ON public.page_content
  FOR UPDATE TO authenticated
  USING (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'))
  WITH CHECK (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

CREATE POLICY "page_content_editor_delete" ON public.page_content
  FOR DELETE TO authenticated
  USING (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

CREATE TRIGGER page_content_set_updated_at
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();