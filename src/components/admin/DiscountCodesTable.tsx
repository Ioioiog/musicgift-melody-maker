
import { useState } from "react";
import { format } from "date-fns";
import { 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  MoreHorizontal,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDiscountCodes, useDeleteDiscountCode, useToggleDiscountCode } from "@/hooks/useDiscountCodes";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveTable } from "@/components/ui/responsive-table";

const DiscountCodesTable = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: codes, isLoading } = useDiscountCodes();
  const deleteCode = useDeleteDiscountCode();
  const toggleCode = useToggleDiscountCode();

  const filteredCodes = codes?.filter(code => {
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && code.is_active) ||
      (statusFilter === "inactive" && !code.is_active) ||
      (statusFilter === "expired" && code.expires_at && new Date(code.expires_at) < new Date());
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "Discount code copied to clipboard",
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleCode.mutateAsync({ id, isActive: !currentStatus });
      toast({
        title: "Status updated",
        description: `Discount code ${!currentStatus ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update discount code status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this discount code?")) {
      try {
        await deleteCode.mutateAsync(id);
        toast({
          title: "Code deleted",
          description: "Discount code has been deleted",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete discount code",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadge = (code: any) => {
    if (!code.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (code.expires_at && new Date(code.expires_at) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (code.usage_limit && code.used_count >= code.usage_limit) {
      return <Badge variant="destructive">Limit Reached</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  const renderDesktopRow = (code: any, index: number) => (
    <>
      <TableCell className="font-medium">{code.code}</TableCell>
      <TableCell>
        {code.discount_type === 'percentage' ? `${code.discount_value}%` : `${code.discount_value / 100} RON`}
      </TableCell>
      <TableCell>{getStatusBadge(code)}</TableCell>
      <TableCell>
        {code.used_count} / {code.usage_limit || '∞'}
      </TableCell>
      <TableCell>
        {code.expires_at ? format(new Date(code.expires_at), 'MMM dd, yyyy') : 'No expiry'}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleCopyCode(code.code)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleStatus(code.id, code.is_active)}>
              {code.is_active ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDelete(code.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </>
  );

  const renderMobileCard = (code: any, index: number) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">{code.code}</div>
        {getStatusBadge(code)}
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Discount:</span>
          <div>
            {code.discount_type === 'percentage' ? `${code.discount_value}%` : `${code.discount_value / 100} RON`}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Usage:</span>
          <div>{code.used_count} / {code.usage_limit || '∞'}</div>
        </div>
      </div>
      
      <div className="text-sm">
        <span className="text-muted-foreground">Expires:</span>
        <div>{code.expires_at ? format(new Date(code.expires_at), 'MMM dd, yyyy') : 'No expiry'}</div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCopyCode(code.code)}
        >
          <Copy className="mr-2 h-3 w-3" />
          Copy
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleToggleStatus(code.id, code.is_active)}
        >
          {code.is_active ? (
            <>
              <EyeOff className="mr-2 h-3 w-3" />
              Deactivate
            </>
          ) : (
            <>
              <Eye className="mr-2 h-3 w-3" />
              Activate
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDelete(code.id)}
        >
          <Trash2 className="mr-2 h-3 w-3" />
          Delete
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading discount codes...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discount codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Codes</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <ResponsiveTable
        headers={["Code", "Discount", "Status", "Usage", "Expires", "Actions"]}
        data={filteredCodes}
        renderRow={renderDesktopRow}
        renderMobileCard={renderMobileCard}
      />

      {filteredCodes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No discount codes found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default DiscountCodesTable;
