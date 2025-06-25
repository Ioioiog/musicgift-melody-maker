
-- Remove old columns that are no longer needed since we're using translations JSONB
ALTER TABLE public.blog_posts 
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS excerpt,
DROP COLUMN IF EXISTS content,
DROP COLUMN IF EXISTS meta_title,
DROP COLUMN IF EXISTS meta_description,
DROP COLUMN IF EXISTS slug;
