ALTER TABLE public.site_settings
  DROP CONSTRAINT IF EXISTS site_settings_logo_size_check;

ALTER TABLE public.site_settings
  ADD CONSTRAINT site_settings_logo_size_check
  CHECK (logo_size BETWEEN 50 AND 150);