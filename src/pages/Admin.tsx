
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import OrdersManagement from "@/components/admin/OrdersManagement";
import StaticPackageManager from "@/components/admin/StaticPackageManager";
import NewsletterManagement from "@/components/admin/NewsletterManagement";
import CampaignsManagement from "@/components/admin/CampaignsManagement";
import AuthGuard from "@/components/AuthGuard";
import RoleGuard from "@/components/RoleGuard";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("packages");

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin', 'super_admin']}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          
          <div className="container mx-auto px-4 py-8 pt-20">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your application settings and data</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="packages">Packages</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              </TabsList>

              <TabsContent value="packages" className="space-y-6">
                <StaticPackageManager />
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <OrdersManagement />
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <UserManagement />
              </TabsContent>

              <TabsContent value="newsletter" className="space-y-6">
                <NewsletterManagement />
              </TabsContent>

              <TabsContent value="campaigns" className="space-y-6">
                <CampaignsManagement />
              </TabsContent>
            </Tabs>
          </div>

          <Footer />
        </div>
      </RoleGuard>
    </AuthGuard>
  );
};

export default Admin;
