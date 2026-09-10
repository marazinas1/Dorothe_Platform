CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day date NOT NULL,
  start_time time NOT NULL,
  end_time time,
  kind text NOT NULL DEFAULT 'viewing' CHECK (kind IN ('viewing','meeting','personal')),
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','confirmed','done','cancelled')),
  listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  inquiry_id uuid REFERENCES public.inquiries(id) ON DELETE SET NULL,
  client_name text NOT NULL DEFAULT '',
  client_phone text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_staff_select" ON public.appointments
  FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "appointments_staff_insert" ON public.appointments
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());
CREATE POLICY "appointments_staff_update" ON public.appointments
  FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE POLICY "appointments_staff_delete" ON public.appointments
  FOR DELETE TO authenticated USING (public.is_staff());

CREATE INDEX appointments_day_idx ON public.appointments (day, start_time);

CREATE TRIGGER appointments_set_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.feature_flags (key, enabled, description, config)
VALUES ('calendar', true, 'Internal calendar for viewings and meetings', '{}'::jsonb)
ON CONFLICT (key) DO NOTHING;