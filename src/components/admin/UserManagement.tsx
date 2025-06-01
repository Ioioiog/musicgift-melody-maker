
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, UserPlus } from 'lucide-react';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type UserRole = Tables<'user_roles'> & {
  profiles?: {
    email: string;
    full_name: string;
  } | null;
};

type Profile = Tables<'profiles'>;

const UserManagement = () => {
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<'super_admin' | 'admin' | 'editor' | 'viewer'>('viewer');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all users with roles
  const { data: userRoles = [], isLoading } = useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      console.log('Fetching user roles...');
      // First get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        throw rolesError;
      }

      console.log('Roles data:', rolesData);

      if (!rolesData || rolesData.length === 0) {
        return [];
      }

      // Then get profiles for these users
      const userIds = rolesData.map(role => role.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Combine the data
      const combinedData = rolesData.map(role => ({
        ...role,
        profiles: profilesData?.find(profile => profile.id === role.user_id) || null
      }));

      console.log('Combined user roles data:', combinedData);
      return combinedData as UserRole[];
    }
  });

  // Fetch all profiles for user selection
  const { data: allProfiles = [] } = useQuery({
    queryKey: ['admin-all-profiles'],
    queryFn: async () => {
      console.log('Fetching all profiles...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('email');
      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      console.log('All profiles:', data);
      return data as Profile[];
    }
  });

  // Create user role mutation
  const createRoleMutation = useMutation({
    mutationFn: async (roleData: TablesInsert<'user_roles'>) => {
      console.log('Creating role:', roleData);
      
      // Check if user already has a role
      const existingRole = userRoles.find(role => role.user_id === roleData.user_id);
      if (existingRole) {
        console.log('User already has role, updating instead...');
        // Update existing role instead of creating new one
        const { data, error } = await supabase
          .from('user_roles')
          .update({ role: roleData.role })
          .eq('user_id', roleData.user_id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          ...roleData,
          assigned_by: user?.id
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      const existingRole = userRoles.find(role => role.user_id === variables.user_id);
      toast({ 
        title: existingRole ? 'User role updated successfully' : 'User role assigned successfully' 
      });
      setDialogOpen(false);
      setEditingRole(null);
      setSelectedUserId('');
      setSelectedRole('viewer');
    },
    onError: (error) => {
      console.error('Error assigning/updating role:', error);
      toast({ title: 'Error assigning role', description: error.message, variant: 'destructive' });
    }
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, ...roleData }: { id: string } & TablesUpdate<'user_roles'>) => {
      console.log('Updating role:', { id, roleData });
      const { data, error } = await supabase
        .from('user_roles')
        .update(roleData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast({ title: 'User role updated successfully' });
      setDialogOpen(false);
      setEditingRole(null);
    },
    onError: (error) => {
      console.error('Error updating role:', error);
      toast({ title: 'Error updating role', description: error.message, variant: 'destructive' });
    }
  });

  // Delete user role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting role:', id);
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast({ title: 'User role removed successfully' });
    },
    onError: (error) => {
      console.error('Error removing role:', error);
      toast({ title: 'Error removing role', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('Form submitted:', { editingRole, selectedUserId, selectedRole });
    
    if (editingRole) {
      updateRoleMutation.mutate({ 
        id: editingRole.id, 
        role: selectedRole 
      });
    } else {
      if (!selectedUserId) {
        toast({ title: 'Please select a user', variant: 'destructive' });
        return;
      }
      createRoleMutation.mutate({
        user_id: selectedUserId,
        role: selectedRole
      });
    }
  };

  const openCreateDialog = () => {
    console.log('Opening create dialog');
    setEditingRole(null);
    setSelectedUserId('');
    setSelectedRole('viewer');
    setDialogOpen(true);
  };

  const openEditDialog = (role: UserRole) => {
    console.log('Opening edit dialog for role:', role);
    setEditingRole(role);
    setSelectedUserId(role.user_id);
    setSelectedRole(role.role);
    setDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      super_admin: 'bg-red-100 text-red-800',
      admin: 'bg-blue-100 text-blue-800',
      editor: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || colors.viewer;
  };

  // Get user's current role for display in dropdown
  const getUserCurrentRole = (userId: string) => {
    const userRole = userRoles.find(role => role.user_id === userId);
    return userRole?.role || null;
  };

  // Show all users for super admins and admins, with current role indication
  const getSelectableUsers = () => {
    console.log('Getting selectable users. All profiles:', allProfiles);
    console.log('Current user roles:', userRoles);
    
    if (allProfiles.length === 0) {
      console.log('No profiles available');
      return [];
    }

    return allProfiles.map(profile => ({
      ...profile,
      currentRole: getUserCurrentRole(profile.id)
    }));
  };

  const selectableUsers = getSelectableUsers();
  console.log('Selectable users:', selectableUsers);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit User Role' : 'Assign User Role'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingRole && (
                <div>
                  <Label htmlFor="user_select">Select User</Label>
                  {selectableUsers.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 border rounded">
                      No users available. Users need to have profiles created first.
                    </div>
                  ) : (
                    <Select value={selectedUserId} onValueChange={setSelectedUserId} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user..." />
                      </SelectTrigger>
                      <SelectContent>
                        {selectableUsers.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{profile.full_name || profile.email}</span>
                              {profile.currentRole && (
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(profile.currentRole)}`}>
                                  {profile.currentRole.replace('_', ' ').toUpperCase()}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
              <div>
                <Label htmlFor="role_select">Role</Label>
                <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1" disabled={!editingRole && selectableUsers.length === 0}>
                  {editingRole ? 'Update' : 'Assign'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : userRoles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No user roles assigned yet</p>
              {allProfiles.length === 0 && (
                <p className="text-sm mt-2">No user profiles found. Users need to sign up first to appear here.</p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRoles.map((userRole) => (
                  <TableRow key={userRole.id}>
                    <TableCell>
                      {userRole.profiles?.full_name || 'Unknown User'}
                    </TableCell>
                    <TableCell>{userRole.profiles?.email || 'No email'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(userRole.role)}`}>
                        {userRole.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(userRole.assigned_at || '').toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => openEditDialog(userRole)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => deleteRoleMutation.mutate(userRole.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
