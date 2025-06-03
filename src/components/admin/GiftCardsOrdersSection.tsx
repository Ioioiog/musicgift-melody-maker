
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Eye, Download } from "lucide-react";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { TableCell } from "@/components/ui/table";
import { useGiftCardsAdmin } from "@/hooks/useGiftCardsAdmin";

const GiftCardsOrdersSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  
  const { data: giftCards = [], isLoading } = useGiftCardsAdmin({
    search: searchTerm,
    status: statusFilter,
    paymentStatus: paymentStatusFilter
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'expired': return 'secondary';
      case 'redeemed': return 'outline';
      default: return 'secondary';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const renderDesktopRow = (giftCard: any, index: number) => (
    <>
      <TableCell>
        <div>
          <div className="font-mono font-medium">{giftCard.code}</div>
          <div className="text-sm text-gray-500">
            {giftCard.currency} {(giftCard.gift_amount / 100).toFixed(2)}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{giftCard.sender_name}</div>
          <div className="text-sm text-gray-500">{giftCard.sender_email}</div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{giftCard.recipient_name}</div>
          <div className="text-sm text-gray-500">{giftCard.recipient_email}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <Badge variant={getStatusColor(giftCard.status)}>
            {giftCard.status}
          </Badge>
          <Badge variant={getPaymentStatusColor(giftCard.payment_status)}>
            {giftCard.payment_status}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-500">
          {new Date(giftCard.created_at).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </TableCell>
    </>
  );

  const renderMobileCard = (giftCard: any, index: number) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono font-medium">{giftCard.code}</div>
          <div className="text-sm text-gray-500">
            {giftCard.currency} {(giftCard.gift_amount / 100).toFixed(2)}
          </div>
        </div>
        <div className="flex gap-1 flex-col items-end">
          <Badge variant={getStatusColor(giftCard.status)}>
            {giftCard.status}
          </Badge>
          <Badge variant={getPaymentStatusColor(giftCard.payment_status)}>
            {giftCard.payment_status}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="text-sm text-gray-500">From: </span>
          <span className="font-medium">{giftCard.sender_name}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">To: </span>
          <span className="font-medium">{giftCard.recipient_name}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Created: </span>
          <span>{new Date(giftCard.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading gift cards...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gift Cards</CardTitle>
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
              placeholder="Search by code, sender, or recipient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="redeemed">Redeemed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ResponsiveTable
          headers={["Gift Card", "Sender", "Recipient", "Status", "Created", "Actions"]}
          data={giftCards}
          renderRow={renderDesktopRow}
          renderMobileCard={renderMobileCard}
        />
      </CardContent>
    </Card>
  );
};

export default GiftCardsOrdersSection;
