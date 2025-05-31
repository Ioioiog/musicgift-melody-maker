
import React, { useState } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Settings, FileText, ShoppingCart, GitBranch, CheckSquare, Users, Wand2, Database } from 'lucide-react';
import StepsManagement from '@/components/admin/StepsManagement';
import FieldsManagement from '@/components/admin/FieldsManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import DependenciesManagement from '@/components/admin/DependenciesManagement';
import ValidationManagement from '@/components/admin/ValidationManagement';
import UserManagement from '@/components/admin/UserManagement';
import AIPackageGenerator from '@/components/admin/AIPackageGenerator';
import PackageCreationWizard from '@/components/admin/PackageCreationWizard';
import JsonPackageEditor from '@/components/admin/JsonPackageEditor';
import AdminDebug from '@/components/AdminDebug';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('ai-generator');
  const { user } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useUserRole();

  console.log('Admin page - User:', user?.email, 'Role:', userRole, 'Loading:', roleLoading);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage packages, fields, dependencies, users, and orders</p>
          
          {/* Debug info for development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-700">
                Debug: User role is "{userRole}", authenticated as {user?.email}
              </p>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="ai-generator" className="flex items-center space-x-2">
              <Wand2 className="w-4 h-4" />
              <span>AI Generator</span>
            </TabsTrigger>
            <TabsTrigger value="package-wizard" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Package Wizard</span>
            </TabsTrigger>
            <TabsTrigger value="json-editor" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>JSON Editor</span>
            </TabsTrigger>
            <TabsTrigger value="manage-components" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Components</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-generator">
            <AIPackageGenerator />
          </TabsContent>

          <TabsContent value="package-wizard">
            <PackageCreationWizard />
          </TabsContent>

          <TabsContent value="json-editor">
            <JsonPackageEditor />
          </TabsContent>

          <TabsContent value="manage-components">
            <Tabs defaultValue="steps" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="steps" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Steps</span>
                </TabsTrigger>
                <TabsTrigger value="fields" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Fields</span>
                </TabsTrigger>
                <TabsTrigger value="dependencies" className="flex items-center space-x-2">
                  <GitBranch className="w-4 h-4" />
                  <span>Dependencies</span>
                </TabsTrigger>
                <TabsTrigger value="validation" className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Validation</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="steps">
                <StepsManagement />
              </TabsContent>

              <TabsContent value="fields">
                <FieldsManagement />
              </TabsContent>

              <TabsContent value="dependencies">
                <DependenciesManagement />
              </TabsContent>

              <TabsContent value="validation">
                <ValidationManagement />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManagement />
          </TabsContent>
        </Tabs>

        {/* Debug section - only show in development or if there are issues */}
        {(process.env.NODE_ENV === 'development' || !userRole) && (
          <div className="mt-8">
            <AdminDebug />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
