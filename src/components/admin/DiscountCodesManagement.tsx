
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscountCodesTable from "./DiscountCodesTable";
import DiscountCodeForm from "./DiscountCodeForm";
import AutoGenerationRules from "./AutoGenerationRules";
import DiscountCodeAnalytics from "./DiscountCodeAnalytics";
import DiscountEmailHistory from "./DiscountEmailHistory";

const DiscountCodesManagement = () => {
  const [activeTab, setActiveTab] = useState("codes");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Discount Codes Management</h2>
        <p className="text-muted-foreground">
          Manage discount codes, set up automatic generation rules, and track performance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="codes">Discount Codes</TabsTrigger>
          <TabsTrigger value="create">Create Code</TabsTrigger>
          <TabsTrigger value="rules">Auto Generation</TabsTrigger>
          <TabsTrigger value="email-history">Email History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="codes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Discount Codes</CardTitle>
              <CardDescription>
                View and manage all discount codes in your system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiscountCodesTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Discount Code</CardTitle>
              <CardDescription>
                Create a new discount code with custom rules and limitations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiscountCodeForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automatic Generation Rules</CardTitle>
              <CardDescription>
                Set up rules for automatically generating discount codes after orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AutoGenerationRules />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-history" className="space-y-4">
          <DiscountEmailHistory />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <DiscountCodeAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscountCodesManagement;
