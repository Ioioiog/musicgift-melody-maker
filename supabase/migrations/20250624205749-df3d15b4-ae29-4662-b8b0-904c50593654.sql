
-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  author TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog posts
CREATE POLICY "Anyone can view published blog posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all blog posts" 
  ON public.blog_posts 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Create function to auto-generate slug
CREATE OR REPLACE FUNCTION generate_slug_from_title(title_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(trim(title_text), '[^a-zA-Z0-9\s]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slug if not provided
CREATE OR REPLACE FUNCTION set_blog_post_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug_from_title(NEW.title);
    
    -- Ensure slug uniqueness
    WHILE EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
      NEW.slug := NEW.slug || '-' || floor(random() * 1000);
    END LOOP;
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_set_slug
  BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_blog_post_slug();

-- Insert sample blog posts (migrating existing hardcoded content)
INSERT INTO public.blog_posts (
  title, excerpt, content, image_url, category, author, status, is_featured, 
  read_time, views, published_at, slug
) VALUES 
(
  'The Art of Personalized Music: Creating Emotional Connections',
  'Discover how personalized music creates deeper emotional bonds and makes every gift truly unforgettable.',
  '<p>Personalized music has the unique power to create deep emotional connections that generic songs simply cannot match. When a song is crafted specifically for someone, it carries their story, their emotions, and their unique journey.</p><h2>The Science Behind Musical Emotions</h2><p>Research has shown that music activates multiple areas of the brain simultaneously, including regions responsible for memory, emotion, and personal identity. When a song contains personal elements - names, specific memories, or meaningful references - these neural pathways become even more active.</p><h2>Creating Your Personal Musical Story</h2><p>Every personalized song we create begins with understanding your story. We work closely with you to understand the emotions you want to convey, the memories you want to preserve, and the message you want to share.</p><h2>The Impact of Personalized Music</h2><p>Our clients consistently report that their personalized songs become treasured keepsakes, played during important moments and shared with loved ones for years to come. This is the true power of personalized music - it doesn''t just entertain, it connects.</p>',
  '/uploads/background.webp',
  'Music Tips',
  'MusicGift Team',
  'published',
  true,
  5,
  2300,
  '2024-06-20'::timestamp,
  'art-of-personalized-music'
),
(
  '5 Tips for Writing Meaningful Song Lyrics',
  'Learn how to craft lyrics that touch hearts and tell compelling stories.',
  '<p>Writing meaningful lyrics is an art that combines storytelling, emotion, and musical sensibility. Here are five essential tips to help you craft lyrics that truly resonate with listeners.</p><h2>1. Start with a Personal Story</h2><p>The most powerful lyrics often come from personal experiences. Draw from your own life, relationships, and emotions to create authentic content that listeners can connect with.</p><h2>2. Use Vivid Imagery</h2><p>Paint pictures with your words. Instead of saying "I was sad," describe the rain on the window, the empty coffee cup, or the silence in the room. Imagery helps listeners visualize and feel your message.</p><h2>3. Keep It Simple and Clear</h2><p>The best lyrics are often the simplest. Focus on conveying one main emotion or message per song, and use language that everyone can understand.</p><h2>4. Create Strong Hooks</h2><p>Your chorus should be memorable and easy to sing along with. It''s the part people will remember most, so make it count.</p><h2>5. Edit Ruthlessly</h2><p>Great lyrics are rewritten, not just written. Don''t be afraid to cut lines that don''t serve the song''s purpose, even if you love them individually.</p>',
  '/uploads/65518432-abfe-42fc-acc5-25014d321134.png',
  'Music Tips',
  'Maria Popescu',
  'published',
  false,
  7,
  1800,
  '2024-06-18'::timestamp,
  '5-tips-writing-meaningful-lyrics'
);
