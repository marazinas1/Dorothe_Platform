ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS internal_note text NOT NULL DEFAULT '';
COMMENT ON COLUMN public.inquiries.internal_note IS 'Staff-only note; never shown to the sender.';

ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_status_check;
UPDATE public.inquiries SET status = 'in_progress' WHERE status = 'read';
UPDATE public.inquiries SET status = 'closed' WHERE status = 'handled';
-- 'read' and 'handled' stay accepted until every deployed build writes the new values.
ALTER TABLE public.inquiries
  ADD CONSTRAINT inquiries_status_check
  CHECK (status IN ('new','in_progress','answered','closed','read','handled'));