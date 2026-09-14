ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS maintenance_mode boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS logo_size integer NOT NULL DEFAULT 100;

ALTER TABLE public.site_settings
  DROP CONSTRAINT IF EXISTS site_settings_logo_size_check;

ALTER TABLE public.site_settings
  ADD CONSTRAINT site_settings_logo_size_check
  CHECK (logo_size BETWEEN 60 AND 140);