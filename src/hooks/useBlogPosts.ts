import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { BlogPost, CreateBlogPostData, BlogPostTranslations } from "@/types/blog";
import { getLocalizedBlogPost, generateSlugFromTitle } from "@/utils/blogTranslations";

// Type guard to safely validate BlogPostTranslations structure
const isBlogPostTranslations = (value: unknown): value is BlogPostTranslations => {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  
  // Check if all values are translation objects
  return Object.values(obj).every(translation => 
    translation && 
    typeof translation === 'object' && 
    'title' in translation && 
    'content' in translation
  );
};

// Safe casting function
const safeCastToTranslations = (value: unknown): BlogPostTranslations => {
  if (isBlogPostTranslations(value)) {
    return value;
  }
  // Return empty translations object as fallback
  return {};
};

export const useBlogPosts = () => {
  const { language } = useLanguage();
  
  return useQuery({
    queryKey: ['blog-posts', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      // Safe type casting with proper validation
      const posts = data.map(post => ({
        ...post,
        translations: safeCastToTranslations(post.translations)
      })) as BlogPost[];
      
      return posts.map(post => getLocalizedBlogPost(post, language)).filter(Boolean);
    },
  });
};

export const useAllBlogPosts = () => {
  const { language } = useLanguage();
  
  return useQuery({
    queryKey: ['all-blog-posts', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Safe type casting with proper validation
      const posts = data.map(post => ({
        ...post,
        translations: safeCastToTranslations(post.translations)
      })) as BlogPost[];
      
      return posts.map(post => ({
        ...post,
        localizedVersion: getLocalizedBlogPost(post, language)
      }));
    },
  });
};

export const useBlogPost = (slug: string) => {
  const { language } = useLanguage();
  
  return useQuery({
    queryKey: ['blog-post', slug, language],
    queryFn: async () => {
      console.log('Fetching blog post with slug:', slug);
      
      // First try to get all published posts and filter by slug in JavaScript
      // This is more reliable than complex PostgreSQL JSON queries
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published');
      
      if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }
      
      console.log('All blog posts fetched:', data?.length);
      
      if (!data || data.length === 0) {
        console.log('No blog posts found');
        return null;
      }
      
      // Find post by slug across all language translations
      const foundPost = data.find(post => {
        if (!post.translations) return false;
        
        const translations = safeCastToTranslations(post.translations);
        
        // Check if any language translation has the matching slug
        return Object.values(translations).some(translation => {
          const translationSlug = translation.slug || generateSlugFromTitle(translation.title);
          console.log('Checking slug:', translationSlug, 'against:', slug);
          return translationSlug === slug;
        });
      });
      
      console.log('Found post:', foundPost ? 'Yes' : 'No');
      
      if (!foundPost) {
        console.log('No blog post found with slug:', slug);
        return null;
      }
      
      // Safe type casting with proper validation
      const post = {
        ...foundPost,
        translations: safeCastToTranslations(foundPost.translations)
      } as BlogPost;
      
      const localizedPost = getLocalizedBlogPost(post, language);
      console.log('Localized post:', localizedPost);
      
      return localizedPost;
    },
    enabled: !!slug,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postData: CreateBlogPostData) => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      // Generate slugs for all translations if not provided
      const processedTranslations = { ...postData.translations };
      Object.keys(processedTranslations).forEach(lang => {
        if (!processedTranslations[lang].slug) {
          processedTranslations[lang].slug = generateSlugFromTitle(processedTranslations[lang].title);
        }
      });
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          translations: processedTranslations as unknown as any, // Safe casting to unknown first
          default_language: postData.default_language,
          category: postData.category,
          author: postData.author,
          status: postData.status || 'draft',
          is_featured: postData.is_featured || false,
          tags: postData.tags,
          read_time: postData.read_time,
          views: postData.views,
          published_at: postData.published_at,
          image_url: postData.image_url,
          youtube_url: postData.youtube_url,
          created_by: userId,
          updated_by: userId,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['all-blog-posts'] });
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create blog post: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogPost> & { id: string }) => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      // Process translations if they're being updated
      if (updates.translations) {
        const processedTranslations = { ...updates.translations };
        Object.keys(processedTranslations).forEach(lang => {
          if (!processedTranslations[lang].slug) {
            processedTranslations[lang].slug = generateSlugFromTitle(processedTranslations[lang].title);
          }
        });
        updates.translations = processedTranslations;
      }
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          ...updates,
          translations: updates.translations as unknown as any, // Safe casting to unknown first
          updated_by: userId,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['all-blog-posts'] });
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update blog post: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['all-blog-posts'] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete blog post: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
