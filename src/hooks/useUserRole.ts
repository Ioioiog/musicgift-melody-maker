
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_user_role', { _user_id: user.id });
      
      if (error) throw error;
      return data as 'super_admin' | 'admin' | 'editor' | 'viewer' | null;
    },
    enabled: !!user?.id
  });
};

export const useHasRole = (requiredRole: 'super_admin' | 'admin' | 'editor' | 'viewer') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['has-role', user?.id, requiredRole],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: requiredRole });
      
      if (error) throw error;
      return data as boolean;
    },
    enabled: !!user?.id
  });
};
