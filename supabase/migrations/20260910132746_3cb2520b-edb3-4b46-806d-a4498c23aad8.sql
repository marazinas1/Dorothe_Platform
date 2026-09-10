CREATE TABLE public.default_text_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scope text NOT NULL CHECK (scope IN ('home','page')),
  page text,
  field_key text NOT NULL,
  locale text NOT NULL,
  requested_text jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','declined')),
  requested_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  seen_by_requester boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.default_text_requests TO authenticated;
GRANT ALL ON public.default_text_requests TO service_role;

ALTER TABLE public.default_text_requests ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX default_text_requests_one_pending
  ON public.default_text_requests (scope, coalesce(page,''), field_key, locale)
  WHERE status = 'pending';

CREATE POLICY "own or developer read" ON public.default_text_requests
  FOR SELECT TO authenticated
  USING (requested_by = auth.uid() OR public.is_developer());

CREATE POLICY "editors can request" ON public.default_text_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    requested_by = auth.uid()
    AND public.current_user_is_active()
    AND public.current_user_has_permission('settings.edit')
  );

CREATE POLICY "developer resolves" ON public.default_text_requests
  FOR UPDATE TO authenticated
  USING (public.is_developer())
  WITH CHECK (public.is_developer());

CREATE POLICY "requester marks seen" ON public.default_text_requests
  FOR UPDATE TO authenticated
  USING (requested_by = auth.uid())
  WITH CHECK (requested_by = auth.uid());

CREATE TRIGGER default_text_requests_updated_at
  BEFORE UPDATE ON public.default_text_requests
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();