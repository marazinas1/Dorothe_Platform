-- Structured commission (figure, type, payer) is a legally expected price statement, so it is always public; only the free-text note stays behind commission_note_public.
GRANT SELECT (commission_value, commission_type, commission_payer) ON public.listings TO anon;

CREATE OR REPLACE VIEW public.listings_public AS
SELECT id, slug, reference_code, status, deal_type, property_type, published_at, sold_at,
    is_featured, is_exclusive, sort_order, price, price_on_request, price_period,
    public_commission_note AS commission_note,
    additional_costs, living_area, plot_area, usable_area, rooms, bedrooms, bathrooms,
    floor, total_floors, year_built, year_renovated,
    public_address_street AS address_street, public_address_number AS address_number,
    address_zip, address_city, address_region, address_country,
    public_geo_lat AS geo_lat, public_geo_lng AS geo_lng,
    geo_precision, energy, features, content_sections, condition, heating_type,
    availability_date, title, description, highlights, meta_title, meta_description,
    agent_id, created_at, updated_at,
    commission_value, commission_type, commission_payer,
    commission_free, service_charge, utilities_cost, heating_costs_included,
    deposit, total_rent, rental_status, energy_exemption, reserve_fund, price_reduced
FROM public.listings
WHERE status = ANY (ARRAY['active','coming_soon','reserved','sold','rented']);

ALTER VIEW public.listings_public SET (security_invoker = true);