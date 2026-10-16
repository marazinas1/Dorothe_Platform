CREATE TABLE public.inquiry_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 8000),
  sent_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX inquiry_replies_inquiry_idx ON public.inquiry_replies(inquiry_id, created_at);
GRANT SELECT, INSERT ON public.inquiry_replies TO authenticated;
GRANT ALL ON public.inquiry_replies TO service_role;
ALTER TABLE public.inquiry_replies ENABLE ROW LEVEL SECURITY;
-- Visibility follows the parent enquiry: its own RLS decides who sees it.
CREATE POLICY "replies visible with inquiry" ON public.inquiry_replies FOR SELECT TO authenticated
  USING (public.current_user_is_active() AND EXISTS (SELECT 1 FROM public.inquiries i WHERE i.id = inquiry_id));
CREATE POLICY "replies insert by sender" ON public.inquiry_replies FOR INSERT TO authenticated
  WITH CHECK (public.current_user_is_active() AND sent_by = auth.uid() AND EXISTS (SELECT 1 FROM public.inquiries i WHERE i.id = inquiry_id));