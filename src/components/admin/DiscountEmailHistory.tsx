
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDiscountEmailDeliveries, useDiscountEmailDeliveryStats } from "@/hooks/useDiscountEmailDeliveries";
import { Mail, Search, Filter } from "lucide-react";

const DiscountEmailHistory = () => {
  const { data: deliveries, isLoading } = useDiscountEmailDeliveries();
  const { data: stats } = useDiscountEmailDeliveryStats();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredDeliveries = deliveries?.filter(delivery => {
    const matchesSearch = 
      delivery.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.discount_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || delivery.email_type === filterType;
    const matchesStatus = filterStatus === "all" || delivery.delivery_status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'delivered': return 'default';
      case 'bounced': return 'destructive';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'manual' ? 'outline' : 'secondary';
  };

  if (isLoading) {
    return <div>Loading email delivery history...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.manual} manual, {stats.auto_generated} auto-generated
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Successfully Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.sent / stats.total) * 100) : 0}% success rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0}% failure rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Bounced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.bounced}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.bounced / stats.total) * 100) : 0}% bounce rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Delivery History
          </CardTitle>
          <CardDescription>
            Track all discount code emails sent manually and automatically generated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, code, or recipient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="auto_generated">Auto-Generated</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Brevo ID</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!filteredDeliveries || filteredDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No email deliveries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{delivery.recipient_email}</div>
                          {delivery.recipient_name && (
                            <div className="text-sm text-muted-foreground">{delivery.recipient_name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{delivery.discount_code}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeColor(delivery.email_type)}>
                          {delivery.email_type === 'manual' ? 'Manual' : 'Auto-Generated'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(delivery.delivery_status)}>
                          {delivery.delivery_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(delivery.sent_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {delivery.brevo_message_id || '-'}
                      </TableCell>
                      <TableCell>
                        {delivery.error_message ? (
                          <div className="text-sm text-red-600 max-w-xs truncate" title={delivery.error_message}>
                            {delivery.error_message}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscountEmailHistory;
