
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
import { useDiscountEmailDeliveries, useDiscountEmailDeliveryStats, useRefreshEmailDeliveries } from "@/hooks/useDiscountEmailDeliveries";
import { Mail, Search, Filter, RefreshCw, Eye, MousePointer, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DiscountEmailHistory = () => {
  const { data: deliveries, isLoading } = useDiscountEmailDeliveries();
  const { data: stats } = useDiscountEmailDeliveryStats();
  const { refreshDeliveries } = useRefreshEmailDeliveries();
  const { toast } = useToast();
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

  const handleRefresh = () => {
    refreshDeliveries();
    toast({
      title: "Refreshed",
      description: "Email delivery data has been refreshed",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'delivered': return 'default';
      case 'opened': return 'default';
      case 'clicked': return 'default';
      case 'bounced':
      case 'hard_bounced':
      case 'soft_bounced':
      case 'failed': return 'destructive';
      case 'unsubscribed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'manual' ? 'outline' : 'secondary';
  };

  const getEngagementIcon = (status: string, engagementScore: number) => {
    if (status === 'clicked') return <MousePointer className="h-3 w-3 text-green-600" />;
    if (status === 'opened') return <Eye className="h-3 w-3 text-blue-600" />;
    if (engagementScore > 0) return <Zap className="h-3 w-3 text-yellow-600" />;
    return null;
  };

  if (isLoading) {
    return <div>Loading email delivery history...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.delivered + stats.opened + stats.clicked}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round(((stats.delivered + stats.opened + stats.clicked) / stats.total) * 100) : 0}% delivery rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Opened</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.opened + stats.clicked}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round(((stats.opened + stats.clicked) / stats.total) * 100) : 0}% open rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clicked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.clicked}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.clicked / stats.total) * 100) : 0}% click rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failed/Bounced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.bounced + stats.failed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round(((stats.bounced + stats.failed) / stats.total) * 100) : 0}% failure rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Email History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Delivery History
              </CardTitle>
              <CardDescription>
                Track all discount code emails with real-time status updates from Brevo.
              </CardDescription>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
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
                <SelectItem value="opened">Opened</SelectItem>
                <SelectItem value="clicked">Clicked</SelectItem>
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
                  <TableHead>Engagement</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Error/Bounce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!filteredDeliveries || filteredDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
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
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(delivery.delivery_status)}>
                            {delivery.delivery_status.replace('_', ' ')}
                          </Badge>
                          {getEngagementIcon(delivery.delivery_status, delivery.engagement_score)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {delivery.delivered_at && (
                            <div>Delivered: {new Date(delivery.delivered_at).toLocaleString()}</div>
                          )}
                          {delivery.opened_at && (
                            <div>Opened: {new Date(delivery.opened_at).toLocaleString()}</div>
                          )}
                          {delivery.clicked_at && (
                            <div>Clicked: {new Date(delivery.clicked_at).toLocaleString()}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(delivery.sent_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(delivery.updated_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {delivery.bounce_reason || delivery.error_message ? (
                          <div className="text-sm text-red-600 max-w-xs truncate" 
                               title={delivery.bounce_reason || delivery.error_message}>
                            {delivery.bounce_reason || delivery.error_message}
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
