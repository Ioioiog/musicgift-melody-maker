
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Palette, CreditCard, Gift } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GiftCardDesignsSection from "./GiftCardDesignsSection";
import GiftCardsOrdersSection from "./GiftCardsOrdersSection";
import GiftRedemptionsSection from "./GiftRedemptionsSection";

const GiftCardsManagement = () => {
  const [activeTab, setActiveTab] = useState("designs");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Gift className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-2xl">Gift Cards Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage gift card designs, orders, and redemptions
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Welcome Message for New Setup */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Ready to create new designs!</strong> The old gift card designs have been removed. 
          You can now create fresh, modern gift card designs using the improved canvas editor.
        </AlertDescription>
      </Alert>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger 
            value="designs" 
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <Palette className="h-4 w-4" />
            Designs
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <CreditCard className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger 
            value="redemptions" 
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <Gift className="h-4 w-4" />
            Redemptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="designs" className="space-y-6">
          <GiftCardDesignsSection />
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <GiftCardsOrdersSection />
        </TabsContent>

        <TabsContent value="redemptions" className="space-y-6">
          <GiftRedemptionsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GiftCardsManagement;
