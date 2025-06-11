
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
import DiscountCodesManagement from "@/components/admin/DiscountCodesManagement";
import PaymentProvidersManagement from "@/components/admin/PaymentProvidersManagement";
import EmailManagement from "@/components/admin/EmailManagement";
import TestimonialsManagement from "@/components/admin/TestimonialsManagement";
import SmartBillPaymentManager from "@/components/admin/SmartBillPaymentManager";
import AuthGuard from "@/components/AuthGuard";
import RoleGuard from "@/components/RoleGuard";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("packages");

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin', 'super_admin']}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          
          <div className="container mx-auto px-2 sm:px-4 sm:py-6 md:py-8 pt-16 sm:pt-20 py-[114px]">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 px-[219px] text-justify">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 px-[219px]">Manage your application settings and data</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
              <div className="w-full overflow-x-auto bg-white rounded-lg border shadow-sm">
                <TabsList className="flex w-full min-w-[1200px] sm:min-w-full h-auto p-2 justify-start gap-1 bg-gray-50/50">
                  <TabsTrigger value="packages" className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-white/50">
                    📦 Packages
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-white/50">
                    📋 Orders
                  </TabsTrigger>
                  <TabsTrigger value="smartbill" className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-white/50">
                    💳 SmartBill
                  </TabsTrigger>
                  <TabsTrigger value="testimonials" className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-white/50">
                    💬 Testimonials
                  </TabsTrigger>
                  <TabsTrigger value="gift-cards" className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-white/50">
                    🎁 Gift Cards
                  </TabsTrigger>
                  <TabsTrigger value="discount-codes" className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-white/50">
                    🎫 Discount Codes
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-white/50">
                    💳 Payments
                  </TabsTrigger>
                  <TabsTrigger value="email" className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-white/50">
                    📧 Email
                  </TabsTrigger>
                  <TabsTrigger value="users" className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-white/50">
                    👥 Users
                  </TabsTrigger>
                  <TabsTrigger value="newsletter" className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-white/50">
                    📰 Newsletter
                  </TabsTrigger>
                  <TabsTrigger value="campaigns" className="text-xs sm:text-sm py-2.5 px-3 sm:px-4 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-white/50">
                    📢 Campaigns
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="packages" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <PackageManagement />
              </TabsContent>

              <TabsContent value="orders" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <OrdersManagement />
              </TabsContent>

              <TabsContent value="smartbill" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <SmartBillPaymentManager />
              </TabsContent>

              <TabsContent value="testimonials" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <TestimonialsManagement />
              </TabsContent>

              <TabsContent value="gift-cards" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <GiftCardsManagement />
              </TabsContent>

              <TabsContent value="discount-codes" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <DiscountCodesManagement />
              </TabsContent>

              <TabsContent value="payments" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <PaymentProvidersManagement />
              </TabsContent>

              <TabsContent value="email" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <EmailManagement />
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
