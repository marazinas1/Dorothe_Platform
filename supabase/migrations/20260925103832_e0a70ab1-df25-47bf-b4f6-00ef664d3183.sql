ALTER TABLE public.page_views
  ADD COLUMN IF NOT EXISTS session_id text,
  ADD COLUMN IF NOT EXISTS engaged_seconds integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS channel text NOT NULL DEFAULT 'direct';
ALTER TABLE public.page_views ALTER COLUMN visitor_hash DROP NOT NULL;
CREATE INDEX IF NOT EXISTS page_views_session_idx ON public.page_views (day, session_id);

CREATE OR REPLACE FUNCTION public.purge_old_page_views()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  DELETE FROM public.page_views WHERE created_at < now() - interval '14 months';
$$;
REVOKE ALL ON FUNCTION public.purge_old_page_views() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_old_page_views() TO service_role;

CREATE OR REPLACE FUNCTION public.analytics_summary(_from date, _to date)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
DECLARE
  result jsonb;
  _pfrom date := _from - (_to - _from) - 1;
  _pto date := _from - 1;
BEGIN
  IF NOT (public.current_user_has_permission('analytics.view.any')
       OR public.current_user_has_permission('analytics.view.own')) THEN
    RAISE EXCEPTION 'Permission denied: analytics requires an analytics view permission';
  END IF;
  IF _from IS NULL OR _to IS NULL OR _to < _from OR (_to - _from) > 400 THEN
    RAISE EXCEPTION 'invalid date range';
  END IF;

  WITH v AS (
    SELECT *, COALESCE(session_id, visitor_hash, id::text) AS visit_key
    FROM public.page_views WHERE day BETWEEN _pfrom AND _to
  ),
  visits AS (
    SELECT visit_key, (min(day) >= _from) AS cur, count(*) AS pages, sum(engaged_seconds) AS secs
    FROM v GROUP BY visit_key
  ),
  cur AS (SELECT * FROM v WHERE day >= _from),
  prev AS (SELECT * FROM v WHERE day <= _pto)
  SELECT jsonb_build_object(
    'totals', jsonb_build_object(
      'views', (SELECT count(*) FROM cur),
      'visits', (SELECT count(*) FROM visits WHERE cur),
      'single_page', (SELECT count(*) FROM visits WHERE cur AND pages = 1),
      'avg_seconds', (SELECT COALESCE(round(avg(secs)), 0) FROM visits WHERE cur)
    ),
    'previous', jsonb_build_object(
      'views', (SELECT count(*) FROM prev),
      'visits', (SELECT count(*) FROM visits WHERE NOT cur),
      'single_page', (SELECT count(*) FROM visits WHERE NOT cur AND pages = 1),
      'avg_seconds', (SELECT COALESCE(round(avg(secs)), 0) FROM visits WHERE NOT cur)
    ),
    'daily', COALESCE((SELECT jsonb_agg(row_to_json(d) ORDER BY d.day) FROM (
      SELECT day, count(*) AS views, count(DISTINCT visit_key) AS visits FROM cur GROUP BY day) d), '[]'::jsonb),
    'top_pages', COALESCE((SELECT jsonb_agg(row_to_json(p)) FROM (
      SELECT path, count(*) AS views FROM cur GROUP BY path ORDER BY count(*) DESC LIMIT 15) p), '[]'::jsonb),
    'channels', COALESCE((SELECT jsonb_agg(row_to_json(c)) FROM (
      SELECT channel, count(DISTINCT visit_key) AS views FROM cur GROUP BY channel ORDER BY 2 DESC) c), '[]'::jsonb),
    'referrers', COALESCE((SELECT jsonb_agg(row_to_json(r)) FROM (
      SELECT referrer_host, count(DISTINCT visit_key) AS views FROM cur
      WHERE referrer_host IS NOT NULL GROUP BY referrer_host ORDER BY 2 DESC LIMIT 10) r), '[]'::jsonb),
    'countries', COALESCE((SELECT jsonb_agg(row_to_json(k)) FROM (
      SELECT country, count(DISTINCT visit_key) AS views FROM cur
      WHERE country IS NOT NULL GROUP BY country ORDER BY 2 DESC LIMIT 10) k), '[]'::jsonb),
    'devices', COALESCE((SELECT jsonb_agg(row_to_json(x)) FROM (
      SELECT device, count(DISTINCT visit_key) AS views FROM cur GROUP BY device) x), '[]'::jsonb),
    'inquiries', (SELECT count(*) FROM public.inquiries
      WHERE (created_at AT TIME ZONE 'utc')::date BETWEEN _from AND _to)
  ) INTO result;
  RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.analytics_summary(date, date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.analytics_summary(date, date) TO authenticated, service_role;