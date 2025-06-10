
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDiscountCodes } from "@/hooks/useDiscountCodes";
import { TrendingUp, TrendingDown, Users, CreditCard, Gift, Target } from "lucide-react";

const DiscountCodeAnalytics = () => {
  const { data: codes, isLoading } = useDiscountCodes();

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  const totalCodes = codes?.length || 0;
  const activeCodes = codes?.filter(code => code.is_active)?.length || 0;
  const expiredCodes = codes?.filter(code => code.expires_at && new Date(code.expires_at) < new Date())?.length || 0;
  const totalUsage = codes?.reduce((sum, code) => sum + code.used_count, 0) || 0;
  const totalPotentialSavings = codes?.reduce((sum, code) => {
    if (code.discount_type === 'percentage') {
      return sum; // Can't calculate without order amounts
    }
    return sum + (code.discount_value * code.used_count);
  }, 0) || 0;

  const topCodes = codes
    ?.filter(code => code.used_count > 0)
    ?.sort((a, b) => b.used_count - a.used_count)
    ?.slice(0, 5) || [];

  const stats = [
    {
      title: "Total Codes",
      value: totalCodes,
      icon: Gift,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Codes",
      value: activeCodes,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Usage",
      value: totalUsage,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Expired Codes",
      value: expiredCodes,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Codes */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Codes</CardTitle>
            <CardDescription>
              Discount codes with the highest usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topCodes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No codes have been used yet.
              </p>
            ) : (
              <div className="space-y-4">
                {topCodes.map((code, index) => (
                  <div key={code.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{code.code}</p>
                        <p className="text-sm text-muted-foreground">
                          {code.discount_type === 'percentage' 
                            ? `${code.discount_value}% off` 
                            : `${code.discount_value / 100} RON off`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{code.used_count} uses</p>
                      <p className="text-sm text-muted-foreground">
                        {code.usage_limit ? `of ${code.usage_limit}` : 'unlimited'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Code Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Code Status Overview</CardTitle>
            <CardDescription>
              Current status of all discount codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Active Codes</span>
                </div>
                <Badge variant="default">{activeCodes}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="font-medium">Inactive Codes</span>
                </div>
                <Badge variant="secondary">{totalCodes - activeCodes}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium">Expired Codes</span>
                </div>
                <Badge variant="destructive">{expiredCodes}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-orange-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium">Limit Reached</span>
                </div>
                <Badge variant="outline">
                  {codes?.filter(code => code.usage_limit && code.used_count >= code.usage_limit)?.length || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Insights</CardTitle>
          <CardDescription>
            Key metrics about discount code performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalUsage}</p>
              <p className="text-sm text-muted-foreground">Total Code Uses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {totalUsage > 0 ? (totalUsage / activeCodes).toFixed(1) : '0'}
              </p>
              <p className="text-sm text-muted-foreground">Avg Uses per Active Code</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {totalPotentialSavings > 0 ? `${(totalPotentialSavings / 100).toFixed(2)} RON` : '0 RON'}
              </p>
              <p className="text-sm text-muted-foreground">Total Savings (Fixed Amount Codes)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscountCodeAnalytics;
