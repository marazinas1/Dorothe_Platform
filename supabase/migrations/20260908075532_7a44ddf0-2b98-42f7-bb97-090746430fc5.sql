ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS active_home_template text NOT NULL DEFAULT 'h1',
  ADD COLUMN IF NOT EXISTS home_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS home_media jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS home_template_extras jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE OR REPLACE FUNCTION public.site_settings_validate_home_template()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.active_home_template IS NULL OR btrim(NEW.active_home_template) = '' THEN
    NEW.active_home_template := 'h1';
  END IF;
  IF NEW.active_home_template NOT IN ('h1','h2','h3') THEN
    RAISE EXCEPTION 'unknown home template: %', NEW.active_home_template;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS site_settings_validate_home_template_trg ON public.site_settings;
CREATE TRIGGER site_settings_validate_home_template_trg
BEFORE INSERT OR UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.site_settings_validate_home_template();