
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { BlogPost, CreateBlogPostData, BlogPostTranslations } from "@/types/blog";
import { getLocalizedBlogPost, generateSlugFromTitle } from "@/utils/blogTranslations";

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
      
      // Type assertion to handle Supabase Json type
      const posts = data.map(post => ({
        ...post,
        translations: post.translations as BlogPostTranslations
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
      
      // Type assertion to handle Supabase Json type
      const posts = data.map(post => ({
        ...post,
        translations: post.translations as BlogPostTranslations
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
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .or(`translations->'ro'->>'slug'.eq.${slug},translations->'en'->>'slug'.eq.${slug},translations->'fr'->>'slug'.eq.${slug},translations->'de'->>'slug'.eq.${slug},translations->'pl'->>'slug'.eq.${slug},translations->'it'->>'slug'.eq.${slug}`)
        .single();
      
      if (error) throw error;
      
      // Type assertion to handle Supabase Json type
      const post = {
        ...data,
        translations: data.translations as BlogPostTranslations
      } as BlogPost;
      
      return getLocalizedBlogPost(post, language);
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
          translations: processedTranslations as any, // Type assertion for Supabase
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
          translations: updates.translations as any, // Type assertion for Supabase
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
