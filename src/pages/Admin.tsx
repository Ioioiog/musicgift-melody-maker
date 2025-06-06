
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import OrdersManagement from "@/components/admin/OrdersManagement";
import PackageManagement from "@/components/admin/PackageManagement";
import NewsletterManagement from "@/components/admin/NewsletterManagement";
import CampaignsManagement from "@/components/admin/CampaignsManagement";
import GiftCardsManagement from "@/components/admin/GiftCardsManagement";
import PaymentProvidersManagement from "@/components/admin/PaymentProvidersManagement";
import AuthGuard from "@/components/AuthGuard";
import RoleGuard from "@/components/RoleGuard";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("packages");

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin', 'super_admin']}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          
          <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8 pt-16 sm:pt-20">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your application settings and data</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
              {/* Mobile-optimized tab layout */}
              <div className="w-full overflow-x-auto">
                <TabsList className="grid w-full grid-cols-7 min-w-[700px] sm:min-w-full h-auto p-1">
                  <TabsTrigger 
                    value="packages" 
                    className="text-xs sm:text-sm py-2 px-2 sm:px-3 whitespace-nowrap"
                  >
                    Packages
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders" 
                    className="text-xs sm:text-sm py-2 px-2 sm:px-3 whitespace-nowrap"
                  >
                    Orders
                  </TabsTrigger>
                  <TabsTrigger 
                    value="gift-cards" 
                    className="text-xs sm:text-sm py-2 px-2 sm:px-3 whitespace-nowrap"
                  >
                    Gift Cards
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payments" 
                    className="text-xs sm:text-sm py-2 px-2 sm:px-3 whitespace-nowrap"
                  >
                    Payments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="users" 
                    className="text-xs sm:text-sm py-2 px-2 sm:px-3 whitespace-nowrap"
                  >
                    Users
                  </TabsTrigger>
                  <TabsTrigger 
                    value="newsletter" 
                    className="text-xs sm:text-sm py-2 px-2 sm:px-3 whitespace-nowrap"
                  >
                    Newsletter
                  </TabsTrigger>
                  <TabsTrigger 
                    value="campaigns" 
                    className="text-xs sm:text-sm py-2 px-2 sm:px-3 whitespace-nowrap"
                  >
                    Campaigns
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="packages" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <PackageManagement />
              </TabsContent>

              <TabsContent value="orders" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <OrdersManagement />
              </TabsContent>

              <TabsContent value="gift-cards" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <GiftCardsManagement />
              </TabsContent>

              <TabsContent value="payments" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <PaymentProvidersManagement />
              </TabsContent>

              <TabsContent value="users" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <UserManagement />
              </TabsContent>

              <TabsContent value="newsletter" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <NewsletterManagement />
              </TabsContent>

              <TabsContent value="campaigns" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
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
