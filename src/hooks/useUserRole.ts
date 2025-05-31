
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
      
      // Get the user's actual role
      const { data: userRole, error } = await supabase
        .rpc('get_user_role', { _user_id: user.id });
      
      if (error) {
        console.error('Error getting user role:', error);
        return false;
      }
      
      if (!userRole) return false;
      
      // Define role hierarchy (higher number = higher privileges)
      const roleHierarchy = {
        'viewer': 1,
        'editor': 2,
        'admin': 3,
        'super_admin': 4
      };
      
      const userRoleLevel = roleHierarchy[userRole];
      const requiredRoleLevel = roleHierarchy[requiredRole];
      
      // User has access if their role level is >= required role level
      return userRoleLevel >= requiredRoleLevel;
    },
    enabled: !!user?.id
  });
};
