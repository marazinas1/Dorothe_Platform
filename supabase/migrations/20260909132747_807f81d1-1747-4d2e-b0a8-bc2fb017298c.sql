CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  cover_path text,
  cover_alt jsonb NOT NULL DEFAULT '{}'::jsonb,
  title jsonb NOT NULL DEFAULT '{}'::jsonb,
  excerpt jsonb NOT NULL DEFAULT '{}'::jsonb,
  body jsonb NOT NULL DEFAULT '{}'::jsonb,
  meta_title jsonb NOT NULL DEFAULT '{}'::jsonb,
  meta_description jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT posts_status_check CHECK (status IN ('draft', 'published'))
);

CREATE INDEX posts_public_idx ON public.posts(status, published_at DESC);

GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts public read" ON public.posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published' AND published_at IS NOT NULL AND published_at <= now());

CREATE POLICY "posts staff read" ON public.posts
  FOR SELECT TO authenticated
  USING (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

CREATE POLICY "posts staff insert" ON public.posts
  FOR INSERT TO authenticated
  WITH CHECK (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

CREATE POLICY "posts staff update" ON public.posts
  FOR UPDATE TO authenticated
  USING (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'))
  WITH CHECK (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

CREATE POLICY "posts staff delete" ON public.posts
  FOR DELETE TO authenticated
  USING (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

CREATE TRIGGER posts_set_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.post_slug_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX post_slug_history_post_idx ON public.post_slug_history(post_id);

GRANT SELECT ON public.post_slug_history TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_slug_history TO authenticated;
GRANT ALL ON public.post_slug_history TO service_role;

ALTER TABLE public.post_slug_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post slug history read" ON public.post_slug_history
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "post slug history write" ON public.post_slug_history
  FOR ALL TO authenticated
  USING (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'))
  WITH CHECK (public.current_user_is_active() AND public.current_user_has_permission('settings.edit'));

CREATE OR REPLACE FUNCTION public.post_unique_slug(_base text, _id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  candidate text;
  suffix integer := 1;
BEGIN
  candidate := COALESCE(NULLIF(public.slugify(_base), ''), 'artikel');
  WHILE EXISTS (
    SELECT 1 FROM public.posts p WHERE p.slug = candidate AND (_id IS NULL OR p.id <> _id)
  ) OR EXISTS (
    SELECT 1 FROM public.post_slug_history h
    WHERE h.slug = candidate AND (_id IS NULL OR h.post_id <> _id)
  ) LOOP
    suffix := suffix + 1;
    candidate := COALESCE(NULLIF(public.slugify(_base), ''), 'artikel') || '-' || suffix;
  END LOOP;
  RETURN candidate;
END;
$$;

CREATE OR REPLACE FUNCTION public.posts_generate_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base text;
BEGIN
  base := COALESCE(NEW.title->>'de', NEW.title->>'en', '');
  IF NEW.slug IS NULL OR btrim(NEW.slug) = '' THEN
    NEW.slug := public.post_unique_slug(base, NEW.id);
  ELSE
    NEW.slug := public.post_unique_slug(NEW.slug, NEW.id);
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.slug IS NOT NULL AND OLD.slug <> NEW.slug THEN
    INSERT INTO public.post_slug_history (post_id, slug)
    VALUES (NEW.id, OLD.slug)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER posts_slug
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.posts_generate_slug();

COMMENT ON TABLE public.posts IS 'Editorial articles (blog / Ratgeber). Core, client content lives in rows only.';