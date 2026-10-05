ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS reserve_fund numeric,
  ADD COLUMN IF NOT EXISTS price_reduced boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS previous_price numeric;

COMMENT ON COLUMN public.listings.reserve_fund IS 'Erhaltungsruecklage share of the unit (sale of apartments). Public.';
COMMENT ON COLUMN public.listings.price_reduced IS 'Shows the Price reduced badge while the listing is live. Public.';
COMMENT ON COLUMN public.listings.previous_price IS 'Internal reference of the earlier asking price. Never exposed publicly.';

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS listing_ref_prefix text;

COMMENT ON COLUMN public.site_settings.listing_ref_prefix IS 'Prefix used when generating listing reference codes.';

CREATE OR REPLACE FUNCTION public.listings_clear_deal_type_figures()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.deal_type IS NOT DISTINCT FROM OLD.deal_type THEN
    RETURN NEW;
  END IF;

  IF NEW.deal_type = 'sale' THEN
    NEW.utilities_cost := NULL;
    NEW.deposit := NULL;
    NEW.heating_costs_included := false;
  ELSIF NEW.deal_type = 'rent' THEN
    NEW.service_charge := NULL;
    NEW.reserve_fund := NULL;
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE VIEW public.listings_public WITH (security_invoker = true) AS
 SELECT id, slug, reference_code, status, deal_type, property_type, published_at, sold_at,
    is_featured, is_exclusive, sort_order, price, price_on_request, price_period,
    public_commission_note AS commission_note, additional_costs, living_area, plot_area,
    usable_area, rooms, bedrooms, bathrooms, floor, total_floors, year_built, year_renovated,
    public_address_street AS address_street, public_address_number AS address_number,
    address_zip, address_city, address_region, address_country,
    public_geo_lat AS geo_lat, public_geo_lng AS geo_lng, geo_precision, energy, features,
    content_sections, condition, heating_type, availability_date, title, description,
    highlights, meta_title, meta_description, agent_id, created_at, updated_at,
    public_commission_value AS commission_value, public_commission_type AS commission_type,
    public_commission_payer AS commission_payer, commission_free, service_charge,
    utilities_cost, heating_costs_included, deposit, total_rent, rental_status,
    energy_exemption, reserve_fund, price_reduced
   FROM public.listings
  WHERE status = ANY (ARRAY['active','coming_soon','reserved','sold','rented']);