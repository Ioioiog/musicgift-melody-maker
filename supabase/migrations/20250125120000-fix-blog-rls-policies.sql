
-- Add RLS policies for blog_posts table to allow public reading of published posts
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
CREATE POLICY "Anyone can view published blog posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (status = 'published');

-- Add RLS policies for blog_post_views table to allow public insertions
DROP POLICY IF EXISTS "Anyone can insert blog post views" ON public.blog_post_views;
CREATE POLICY "Anyone can insert blog post views" 
  ON public.blog_post_views
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all blog post views" ON public.blog_post_views;
CREATE POLICY "Admins can view all blog post views" 
  ON public.blog_post_views
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
