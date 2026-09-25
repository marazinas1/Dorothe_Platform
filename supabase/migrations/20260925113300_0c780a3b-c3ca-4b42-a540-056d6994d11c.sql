ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS media_defaults jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Studio defaults for page photographs are a developer decision; everyone
-- else can edit the row but never this column.
CREATE OR REPLACE FUNCTION public.site_settings_guard_media_defaults()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.media_defaults IS DISTINCT FROM OLD.media_defaults
     AND auth.uid() IS NOT NULL
     AND NOT private.is_developer() THEN
    RAISE EXCEPTION 'Only a developer can change studio defaults';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.site_settings_guard_media_defaults() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS site_settings_guard_media_defaults_trg ON public.site_settings;
CREATE TRIGGER site_settings_guard_media_defaults_trg
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.site_settings_guard_media_defaults();