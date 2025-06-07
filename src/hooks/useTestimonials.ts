
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  stars: number;
  text: string;
  context: string;
  youtube_link: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  approved: boolean;
}

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }

      return data as Testimonial[];
    },
  });
};

export const useTestimonialsAdmin = () => {
  return useQuery({
    queryKey: ['testimonials-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching all testimonials:', error);
        throw error;
      }

      return data as Testimonial[];
    },
  });
};

// Hook for user's own testimonials
export const useUserTestimonials = () => {
  return useQuery({
    queryKey: ['user-testimonials'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];

      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user testimonials:', error);
        throw error;
      }

      return data as Testimonial[];
    },
  });
};
