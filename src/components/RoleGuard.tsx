
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useHasRole } from '@/hooks/useUserRole';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: 'super_admin' | 'admin' | 'editor' | 'viewer';
  fallbackPath?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  requiredRole, 
  fallbackPath = '/access-denied' 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { data: hasRole, isLoading: roleLoading } = useHasRole(requiredRole);

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
