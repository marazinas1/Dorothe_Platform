-- 1. Media policies: restrict anonymous reads to published listings only
DROP POLICY IF EXISTS "listing_images anon select via view predicate" ON public.listing_images;
CREATE POLICY "listing_images anon select via view predicate"
ON public.listing_images FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM public.listings l
  WHERE l.id = listing_images.listing_id
    AND l.status = ANY (ARRAY['active','coming_soon','reserved','sold','rented'])
));

DROP POLICY IF EXISTS "listing_tours anon select via view predicate" ON public.listing_tours;
CREATE POLICY "listing_tours anon select via view predicate"
ON public.listing_tours FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM public.listings l
  WHERE l.id = listing_tours.listing_id
    AND l.status = ANY (ARRAY['active','coming_soon','reserved','sold','rented'])
));

-- 2. Documents: published listings only, and never lead-gated rows
DROP POLICY IF EXISTS "listing_documents anon select via view predicate" ON public.listing_documents;
CREATE POLICY "listing_documents anon select via view predicate"
ON public.listing_documents FOR SELECT TO anon
USING (
  is_public = true
  AND requires_lead = false
  AND EXISTS (
    SELECT 1 FROM public.listings l
    WHERE l.id = listing_documents.listing_id
      AND l.status = ANY (ARRAY['active','coming_soon','reserved','sold','rented'])
  )
);

-- storage_path must never be reachable by anon, even for open documents
REVOKE SELECT (storage_path) ON public.listing_documents FROM anon;

-- 3. Profiles: no anonymous access to the base table; a narrow view instead
DROP POLICY IF EXISTS "Public team members are readable" ON public.profiles;
REVOKE ALL ON public.profiles FROM anon;

CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = true) AS
SELECT
  p.id,
  p.full_name,
  p.public_title,
  p.public_bio,
  p.public_photo_url,
  p.languages_spoken,
  p.specializations,
  p.sort_order
FROM public.profiles p
WHERE p.show_on_website = true
  AND p.is_active = true;

GRANT SELECT ON public.profiles_public TO authenticated;
GRANT ALL ON public.profiles_public TO service_role;

-- 4. Analytics aggregate runs as the caller, not as the definer
CREATE OR REPLACE FUNCTION public.analytics_summary(_from date, _to date)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF NOT (
    public.current_user_has_permission('analytics.view.any')
    OR public.current_user_has_permission('analytics.view.own')
  ) THEN
    RAISE EXCEPTION 'Permission denied: analytics requires an analytics view permission';
  END IF;

  IF _from IS NULL OR _to IS NULL OR _to < _from OR (_to - _from) > 400 THEN
    RAISE EXCEPTION 'invalid date range';
  END IF;

  SELECT jsonb_build_object(
    'totals', (
      SELECT jsonb_build_object('views', count(*), 'visitors', count(DISTINCT visitor_hash))
      FROM public.page_views WHERE day BETWEEN _from AND _to
    ),
    'previous', (
      SELECT jsonb_build_object('views', count(*), 'visitors', count(DISTINCT visitor_hash))
      FROM public.page_views
      WHERE day BETWEEN (_from - (_to - _from) - 1) AND (_from - 1)
    ),
    'daily', COALESCE((
      SELECT jsonb_agg(row_to_json(d) ORDER BY d.day)
      FROM (
        SELECT day, count(*) AS views, count(DISTINCT visitor_hash) AS visitors
        FROM public.page_views WHERE day BETWEEN _from AND _to GROUP BY day
      ) d
    ), '[]'::jsonb),
    'top_pages', COALESCE((
      SELECT jsonb_agg(row_to_json(p))
      FROM (
        SELECT path, count(*) AS views
        FROM public.page_views WHERE day BETWEEN _from AND _to
        GROUP BY path ORDER BY count(*) DESC LIMIT 15
      ) p
    ), '[]'::jsonb),
    'sources', COALESCE((
      SELECT jsonb_agg(row_to_json(s))
      FROM (
        SELECT source, count(*) AS views
        FROM public.page_views WHERE day BETWEEN _from AND _to
        GROUP BY source ORDER BY count(*) DESC
      ) s
    ), '[]'::jsonb),
    'devices', COALESCE((
      SELECT jsonb_agg(row_to_json(v))
      FROM (
        SELECT device, count(*) AS views
        FROM public.page_views WHERE day BETWEEN _from AND _to GROUP BY device
      ) v
    ), '[]'::jsonb),
    'inquiries', (
      SELECT count(*) FROM public.inquiries
      WHERE (created_at AT TIME ZONE 'utc')::date BETWEEN _from AND _to
    )
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.analytics_summary(date, date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.analytics_summary(date, date) TO authenticated, service_role;
