
import React, { useState } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Settings, FileText, ShoppingCart, GitBranch, CheckSquare, Users } from 'lucide-react';
import PackageManagement from '@/components/admin/PackageManagement';
import StepsManagement from '@/components/admin/StepsManagement';
import FieldsManagement from '@/components/admin/FieldsManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import DependenciesManagement from '@/components/admin/DependenciesManagement';
import ValidationManagement from '@/components/admin/ValidationManagement';
import UserManagement from '@/components/admin/UserManagement';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('packages');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage packages, fields, dependencies, users, and orders</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="packages" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Packages</span>
            </TabsTrigger>
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
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packages">
            <PackageManagement />
          </TabsContent>

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

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManagement />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
