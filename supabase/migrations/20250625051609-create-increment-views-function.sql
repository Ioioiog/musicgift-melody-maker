
-- Create a function to safely increment blog post views
CREATE OR REPLACE FUNCTION public.increment_blog_post_views(post_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.blog_posts 
  SET views = COALESCE(views, 0) + 1
  WHERE id = post_id;
END;
$$;
