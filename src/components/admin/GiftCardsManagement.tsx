
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, CreditCard, History } from "lucide-react";
import GiftCardDesignsSection from "./GiftCardDesignsSection";
import GiftCardsOrdersSection from "./GiftCardsOrdersSection";
import GiftRedemptionsSection from "./GiftRedemptionsSection";

const GiftCardsManagement = () => {
  const [activeTab, setActiveTab] = useState("designs");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Gift className="w-6 h-6 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold">Gift Cards Management</h2>
          <p className="text-gray-600">Manage gift card designs, orders, and redemptions</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="designs" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Designs
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Gift Cards
          </TabsTrigger>
          <TabsTrigger value="redemptions" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Redemptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="designs">
          <GiftCardDesignsSection />
        </TabsContent>

        <TabsContent value="orders">
          <GiftCardsOrdersSection />
        </TabsContent>

        <TabsContent value="redemptions">
          <GiftRedemptionsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GiftCardsManagement;
