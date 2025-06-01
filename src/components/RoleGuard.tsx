
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useHasRole } from '@/hooks/useUserRole';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('super_admin' | 'admin' | 'editor' | 'viewer')[];
  requiredRole?: 'super_admin' | 'admin' | 'editor' | 'viewer';
  fallbackPath?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles,
  requiredRole,
  fallbackPath = '/access-denied' 
}) => {
  const { user, loading: authLoading } = useAuth();
  
  // Determine which role to check - use the highest role from allowedRoles or the requiredRole
  const roleToCheck = allowedRoles && allowedRoles.length > 0 
    ? allowedRoles.sort((a, b) => {
        const hierarchy = { 'viewer': 1, 'editor': 2, 'admin': 3, 'super_admin': 4 };
        return hierarchy[a] - hierarchy[b];
      })[0] // Use the lowest role (most permissive)
    : requiredRole || 'viewer';

  const { data: hasRole, isLoading: roleLoading } = useHasRole(roleToCheck);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
