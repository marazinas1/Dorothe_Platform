-- Views run as the querying user again (no SECURITY DEFINER views).
ALTER VIEW public.listings_public SET (security_invoker = true);
ALTER VIEW public.listing_images_public SET (security_invoker = true);
ALTER VIEW public.listing_documents_public SET (security_invoker = true);
ALTER VIEW public.listing_tours_public SET (security_invoker = true);

-- Row filters for anonymous readers (restored, unchanged semantics).
CREATE POLICY "listings anon select public" ON public.listings
  FOR SELECT TO anon
  USING (status = ANY (ARRAY['active','coming_soon','reserved','sold','rented']));

CREATE POLICY "listing_images anon select via view predicate" ON public.listing_images
  FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM public.listings l
    WHERE l.id = listing_images.listing_id
      AND l.status = ANY (ARRAY['active','coming_soon','reserved','sold','rented'])
  ));

CREATE POLICY "listing_tours anon select via view predicate" ON public.listing_tours
  FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM public.listings l
    WHERE l.id = listing_tours.listing_id
      AND l.status = ANY (ARRAY['active','coming_soon','reserved','sold','rented'])
  ));

CREATE POLICY "listing_documents anon select via view predicate" ON public.listing_documents
  FOR SELECT TO anon
  USING (
    is_public = true AND requires_lead = false AND EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_documents.listing_id
        AND l.status = ANY (ARRAY['active','coming_soon','reserved','sold','rented'])
    )
  );

-- Column-level privileges: anon may only read the columns the public views expose.
GRANT SELECT (
  id, slug, reference_code, status, deal_type, property_type, published_at, sold_at,
  is_featured, is_exclusive, sort_order, price, price_on_request, price_period,
  public_commission_note, additional_costs, living_area, plot_area, usable_area, rooms,
  bedrooms, bathrooms, floor, total_floors, year_built, year_renovated,
  public_address_street, public_address_number, address_zip, address_city, address_region,
  address_country, public_geo_lat, public_geo_lng, geo_precision, energy, features,
  content_sections, condition, heating_type, availability_date, title, description,
  highlights, meta_title, meta_description, agent_id, created_at, updated_at,
  public_commission_value, public_commission_type, public_commission_payer,
  commission_free, service_charge, utilities_cost, heating_costs_included, deposit,
  total_rent, rental_status, energy_exemption
) ON public.listings TO anon;

GRANT SELECT (
  id, listing_id, storage_path, variants, alt_text, caption, sort_order, is_primary,
  is_floorplan, is_visualization, width, height, blurhash, created_at
) ON public.listing_images TO anon;

GRANT SELECT (
  id, listing_id, type, storage_path, filename, is_public, requires_lead, created_at
) ON public.listing_documents TO anon;

GRANT SELECT (
  id, listing_id, type, url, thumbnail_url, sort_order, created_at
) ON public.listing_tours TO anon;