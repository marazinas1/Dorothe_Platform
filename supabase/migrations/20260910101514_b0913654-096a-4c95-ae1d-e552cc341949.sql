DROP POLICY IF EXISTS "appointments_staff_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_staff_insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments_staff_update" ON public.appointments;
DROP POLICY IF EXISTS "appointments_staff_delete" ON public.appointments;

CREATE POLICY "appointments_staff_select" ON public.appointments
  FOR SELECT TO authenticated
  USING (public.current_user_is_active() AND public.current_user_has_permission('inquiry.view.own'));

CREATE POLICY "appointments_staff_insert" ON public.appointments
  FOR INSERT TO authenticated
  WITH CHECK (public.current_user_is_active() AND public.current_user_has_permission('inquiry.view.own'));

CREATE POLICY "appointments_staff_update" ON public.appointments
  FOR UPDATE TO authenticated
  USING (public.current_user_is_active() AND public.current_user_has_permission('inquiry.view.own'))
  WITH CHECK (public.current_user_is_active() AND public.current_user_has_permission('inquiry.view.own'));

CREATE POLICY "appointments_staff_delete" ON public.appointments
  FOR DELETE TO authenticated
  USING (public.current_user_is_active() AND public.current_user_has_permission('inquiry.view.own'));