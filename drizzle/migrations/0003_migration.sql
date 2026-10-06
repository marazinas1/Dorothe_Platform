-- Reference codes are assigned by the database on insert so two editors can
-- never produce the same number. Format: <prefix>-<year>-<NNN>, or
-- <year>-<NNN> when site_settings.listing_ref_prefix is empty.
CREATE OR REPLACE FUNCTION public.listings_assign_reference_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _prefix text;
  _stem text;
  _next int;
BEGIN
  IF NEW.reference_code IS NOT NULL AND btrim(NEW.reference_code) <> '' THEN
    RETURN NEW;
  END IF;

  SELECT nullif(btrim(listing_ref_prefix), '') INTO _prefix
  FROM public.site_settings
  ORDER BY created_at
  LIMIT 1;

  _stem := concat_ws('-', _prefix, to_char(now(), 'YYYY')) || '-';

  PERFORM pg_advisory_xact_lock(hashtext('listings_reference_code'));

  SELECT coalesce(max((substring(reference_code FROM length(_stem) + 1))::int), 0) + 1
  INTO _next
  FROM public.listings
  WHERE reference_code LIKE _stem || '%'
    AND substring(reference_code FROM length(_stem) + 1) ~ '^[0-9]+$';

  NEW.reference_code := _stem || lpad(_next::text, 3, '0');
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.listings_assign_reference_code() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS listings_assign_reference_code ON public.listings;
CREATE TRIGGER listings_assign_reference_code
BEFORE INSERT ON public.listings
FOR EACH ROW EXECUTE FUNCTION public.listings_assign_reference_code();