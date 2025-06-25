
-- Create a table to track detailed view analytics (optional but useful for analytics)
CREATE TABLE IF NOT EXISTS public.blog_post_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_post_views_post_id ON public.blog_post_views(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_views_viewed_at ON public.blog_post_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_blog_post_views_session_id ON public.blog_post_views(session_id);

-- Enable RLS
ALTER TABLE public.blog_post_views ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing analytics (admin only)
CREATE POLICY "Admins can view all blog post views" ON public.blog_post_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Create policy for inserting views (anyone can track views)
CREATE POLICY "Anyone can insert blog post views" ON public.blog_post_views
  FOR INSERT WITH CHECK (true);
