CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote jsonb NOT NULL DEFAULT '{}'::jsonb,
  author_name text NOT NULL DEFAULT '',
  author_detail text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  show_on_home boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_public_read" ON public.testimonials
  FOR SELECT TO anon, authenticated
  USING (published = true);

CREATE POLICY "testimonials_staff_read" ON public.testimonials
  FOR SELECT TO authenticated
  USING (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

CREATE POLICY "testimonials_staff_insert" ON public.testimonials
  FOR INSERT TO authenticated
  WITH CHECK (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

CREATE POLICY "testimonials_staff_update" ON public.testimonials
  FOR UPDATE TO authenticated
  USING (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'))
  WITH CHECK (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

CREATE POLICY "testimonials_staff_delete" ON public.testimonials
  FOR DELETE TO authenticated
  USING (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

CREATE TRIGGER testimonials_set_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX testimonials_sort_idx ON public.testimonials (sort_order, created_at);