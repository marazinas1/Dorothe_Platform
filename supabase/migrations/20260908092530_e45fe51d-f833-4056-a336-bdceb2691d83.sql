CREATE OR REPLACE FUNCTION public.site_settings_validate_home_template()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.active_home_template IS NULL OR btrim(NEW.active_home_template) = '' THEN
    NEW.active_home_template := 'h1';
  END IF;
  IF NEW.active_home_template NOT IN ('h1','h2','h3','h4','h5') THEN
    RAISE EXCEPTION 'unknown home template: %', NEW.active_home_template;
  END IF;
  RETURN NEW;
END;
$$;