
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDebug = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Debug Info - Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading authentication and role information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Admin Access Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <strong>User authenticated:</strong> {user ? 'Yes' : 'No'}
        </div>
        {user && (
          <>
            <div>
              <strong>User ID:</strong> {user.id}
            </div>
            <div>
              <strong>User email:</strong> {user.email}
            </div>
            <div>
              <strong>User role:</strong> {userRole || 'No role assigned'}
            </div>
          </>
        )}
        <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
          <p><strong>Instructions:</strong></p>
          <p>1. Make sure you're logged in</p>
          <p>2. Your user needs to have 'admin' role in the user_roles table</p>
          <p>3. If you don't have admin access, contact the system administrator</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDebug;
