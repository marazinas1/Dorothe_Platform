-- 1. Pre-masked, generated columns so the public view needs no access to raw sensitive columns
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS public_address_street text
    GENERATED ALWAYS AS (CASE WHEN geo_precision = 'exact' THEN address_street END) STORED,
  ADD COLUMN IF NOT EXISTS public_address_number text
    GENERATED ALWAYS AS (CASE WHEN geo_precision = 'exact' THEN address_number END) STORED,
  ADD COLUMN IF NOT EXISTS public_geo_lat numeric
    GENERATED ALWAYS AS (CASE WHEN geo_precision = 'exact' THEN geo_lat
                              WHEN geo_precision = 'approximate' THEN round(geo_lat, 3) END) STORED,
  ADD COLUMN IF NOT EXISTS public_geo_lng numeric
    GENERATED ALWAYS AS (CASE WHEN geo_precision = 'exact' THEN geo_lng
                              WHEN geo_precision = 'approximate' THEN round(geo_lng, 3) END) STORED,
  ADD COLUMN IF NOT EXISTS public_commission_note text
    GENERATED ALWAYS AS (CASE WHEN commission_note_public THEN commission_note END) STORED,
  ADD COLUMN IF NOT EXISTS public_commission_value numeric
    GENERATED ALWAYS AS (CASE WHEN commission_note_public THEN commission_value END) STORED,
  ADD COLUMN IF NOT EXISTS public_commission_type text
    GENERATED ALWAYS AS (CASE WHEN commission_note_public THEN commission_type END) STORED,
  ADD COLUMN IF NOT EXISTS public_commission_payer text
    GENERATED ALWAYS AS (CASE WHEN commission_note_public THEN commission_payer END) STORED;

-- 2. Redefine listings_public with identical output, sourced from the masked columns
CREATE OR REPLACE VIEW public.listings_public AS
SELECT id, slug, reference_code, status, deal_type, property_type, published_at, sold_at,
       is_featured, is_exclusive, sort_order, price, price_on_request, price_period,
       public_commission_note AS commission_note,
       additional_costs, living_area, plot_area, usable_area, rooms, bedrooms, bathrooms,
       floor, total_floors, year_built, year_renovated,
       public_address_street AS address_street,
       public_address_number AS address_number,
       address_zip, address_city, address_region, address_country,
       public_geo_lat AS geo_lat,
       public_geo_lng AS geo_lng,
       geo_precision, energy, features, content_sections, condition, heating_type,
       availability_date, title, description, highlights, meta_title, meta_description,
       agent_id, created_at, updated_at,
       public_commission_value AS commission_value,
       public_commission_type AS commission_type,
       public_commission_payer AS commission_payer,
       commission_free, service_charge, utilities_cost, heating_costs_included,
       deposit, total_rent, rental_status, energy_exemption
FROM public.listings
WHERE status = ANY (ARRAY['active','coming_soon','reserved','sold','rented']);

ALTER VIEW public.listings_public SET (security_invoker = true);

-- 3. Visitors read published listings under RLS, and only through safe columns
DROP POLICY IF EXISTS "listings anon select public" ON public.listings;
CREATE POLICY "listings anon select public" ON public.listings
  FOR SELECT TO anon
  USING (status = ANY (ARRAY['active','coming_soon','reserved','sold','rented']));

REVOKE ALL ON public.listings FROM anon;
GRANT SELECT (
  id, slug, reference_code, status, deal_type, property_type, published_at, sold_at,
  is_featured, is_exclusive, sort_order, price, price_on_request, price_period,
  additional_costs, living_area, plot_area, usable_area, rooms, bedrooms, bathrooms,
  floor, total_floors, year_built, year_renovated,
  address_zip, address_city, address_region, address_country, geo_precision,
  energy, features, content_sections, condition, heating_type, availability_date,
  title, description, highlights, meta_title, meta_description, agent_id,
  created_at, updated_at, commission_free, service_charge, utilities_cost,
  heating_costs_included, deposit, total_rent, rental_status, energy_exemption,
  public_address_street, public_address_number, public_geo_lat, public_geo_lng,
  public_commission_note, public_commission_value, public_commission_type,
  public_commission_payer
) ON public.listings TO anon;

REVOKE ALL ON public.listings_public FROM anon;
REVOKE ALL ON public.listing_images_public FROM anon;
REVOKE ALL ON public.listing_documents_public FROM anon;
REVOKE ALL ON public.listing_tours_public FROM anon;
GRANT SELECT ON public.listings_public TO anon;
GRANT SELECT ON public.listing_images_public TO anon;
GRANT SELECT ON public.listing_documents_public TO anon;
GRANT SELECT ON public.listing_tours_public TO anon;
GRANT SELECT ON public.listing_images TO anon;
GRANT SELECT ON public.listing_documents TO anon;
GRANT SELECT ON public.listing_tours TO anon;

-- 4. Child media policies no longer depend on a publicly executable definer helper
DROP POLICY IF EXISTS "listing_images anon select via view predicate" ON public.listing_images;
CREATE POLICY "listing_images anon select via view predicate" ON public.listing_images
  FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_images.listing_id));

DROP POLICY IF EXISTS "listing_tours anon select via view predicate" ON public.listing_tours;
CREATE POLICY "listing_tours anon select via view predicate" ON public.listing_tours
  FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_tours.listing_id));

DROP POLICY IF EXISTS "listing_documents anon select via view predicate" ON public.listing_documents;
CREATE POLICY "listing_documents anon select via view predicate" ON public.listing_documents
  FOR SELECT TO anon
  USING (is_public = true AND EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_documents.listing_id));

-- 5. Internal SECURITY DEFINER helpers are no longer callable by API roles
REVOKE ALL ON FUNCTION public.listing_is_public(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(text[]) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_developer() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.count_active_owners() FROM PUBLIC, anon, authenticated;

-- 6. Staff contact details are no longer exposed to visitors
DROP POLICY IF EXISTS "Public team members are readable" ON public.profiles;
CREATE POLICY "Public team members are readable" ON public.profiles
  FOR SELECT TO anon
  USING (show_on_website = true AND is_active = true);

REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT (
  id, full_name, public_title, public_bio, public_photo_url,
  languages_spoken, specializations, sort_order, show_on_website, is_active
) ON public.profiles TO anon;