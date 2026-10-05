ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS topic text NULL;
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_topic_check;
ALTER TABLE public.posts ADD CONSTRAINT posts_topic_check CHECK (topic IS NULL OR topic IN ('selling','buying','inheritance','energy'));