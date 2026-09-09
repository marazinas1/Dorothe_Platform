DELETE FROM public.feature_flags
WHERE key IN ('area_pages','saved_search','mortgage_calc','virtual_tours','crm_sync');

DROP FUNCTION IF EXISTS public.site_settings_validate_home_template() CASCADE;

ALTER TABLE public.site_settings
  DROP COLUMN IF EXISTS active_home_template,
  DROP COLUMN IF EXISTS home_template_extras;