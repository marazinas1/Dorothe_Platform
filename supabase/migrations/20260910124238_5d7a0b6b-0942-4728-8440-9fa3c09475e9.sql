ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS home_defaults jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.page_content
  ADD COLUMN IF NOT EXISTS defaults jsonb NOT NULL DEFAULT '{}'::jsonb;