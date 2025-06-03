
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Calendar } from "lucide-react";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { TableCell } from "@/components/ui/table";
import { useGiftRedemptions } from "@/hooks/useGiftRedemptions";

const GiftRedemptionsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  
  const { data: redemptions = [], isLoading } = useGiftRedemptions({
    search: searchTerm,
    dateFilter: dateFilter
  });

  const renderDesktopRow = (redemption: any, index: number) => (
    <>
      <TableCell>
        <div className="font-mono font-medium">{redemption.gift_card_code}</div>
      </TableCell>
      <TableCell>
        <div className="text-right">
          {redemption.currency} {(redemption.redeemed_amount / 100).toFixed(2)}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-right">
          {redemption.currency} {(redemption.remaining_balance / 100).toFixed(2)}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-500">
          {new Date(redemption.redemption_date).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        {redemption.order_id ? (
          <div className="font-mono text-sm">{redemption.order_id.slice(0, 8)}...</div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
    </>
  );

  const renderMobileCard = (redemption: any, index: number) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-mono font-medium">{redemption.gift_card_code}</div>
        <div className="text-sm text-gray-500">
          {new Date(redemption.redemption_date).toLocaleDateString()}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-500">Redeemed:</span>
          <div className="font-medium">
            {redemption.currency} {(redemption.redeemed_amount / 100).toFixed(2)}
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-500">Remaining:</span>
          <div className="font-medium">
            {redemption.currency} {(redemption.remaining_balance / 100).toFixed(2)}
          </div>
        </div>
      </div>

      {redemption.order_id && (
        <div>
          <span className="text-sm text-gray-500">Order: </span>
          <span className="font-mono text-sm">{redemption.order_id.slice(0, 8)}...</span>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading redemptions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gift Card Redemptions</CardTitle>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by gift card code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ResponsiveTable
          headers={["Gift Card Code", "Amount Redeemed", "Remaining Balance", "Date", "Order"]}
          data={redemptions}
          renderRow={renderDesktopRow}
          renderMobileCard={renderMobileCard}
        />
      </CardContent>
    </Card>
  );
};

export default GiftRedemptionsSection;
