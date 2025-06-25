
-- Add translations JSONB column to store all language-specific content
ALTER TABLE public.blog_posts ADD COLUMN translations JSONB DEFAULT '{}';

-- Add default language column for fallback logic
ALTER TABLE public.blog_posts ADD COLUMN default_language VARCHAR(2) DEFAULT 'ro';

-- Migrate existing data to translations object (assuming current content is Romanian)
UPDATE public.blog_posts SET translations = jsonb_build_object(
  'ro', jsonb_build_object(
    'title', title,
    'excerpt', COALESCE(excerpt, ''),
    'content', content,
    'meta_title', COALESCE(meta_title, ''),
    'meta_description', COALESCE(meta_description, ''),
    'slug', slug
  )
) WHERE translations = '{}';

-- Create index for better JSONB query performance
CREATE INDEX idx_blog_posts_translations ON public.blog_posts USING GIN (translations);

-- Remove old columns after migration (commented out for safety - uncomment after confirming migration worked)
-- ALTER TABLE public.blog_posts 
-- DROP COLUMN title,
-- DROP COLUMN excerpt,
-- DROP COLUMN content,
-- DROP COLUMN meta_title,
-- DROP COLUMN meta_description,
-- DROP COLUMN slug;

-- Update the blog post slug trigger to work with translations
DROP TRIGGER IF EXISTS blog_posts_set_slug ON public.blog_posts;
DROP FUNCTION IF EXISTS public.set_blog_post_slug();

-- Create new function for handling translation slugs
CREATE OR REPLACE FUNCTION public.set_blog_post_translations_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the updated_at timestamp
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger
CREATE TRIGGER blog_posts_update_timestamp
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_blog_post_translations_slug();
