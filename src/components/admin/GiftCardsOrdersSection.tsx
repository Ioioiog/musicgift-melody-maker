import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  Calendar,
  Search,
  CreditCard,
  Gift,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGiftCardsAdmin,
} from "@/hooks/useGiftCardsAdmin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

import GiftCardSyncButton from "./GiftCardSyncButton";
import PaymentStatusBadge from "./PaymentStatusBadge";
import GiftCardEmailButton from "./GiftCardEmailButton";

interface GiftCard {
  id: string;
  code: string;
  sender_user_id?: string;
  sender_name: string;
  sender_email: string;
  recipient_name: string;
  recipient_email: string;
  message_text?: string;
  audio_message_url?: string;
  currency: string;
  gift_amount?: number;
  amount_ron?: number;
  amount_eur?: number;
  package_type?: string;
  design_id?: string;
  delivery_date?: string;
  status: string;
  expires_at?: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  smartbill_proforma_id?: string;
}

const GiftCardsOrdersSection = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "failed" | "cancelled">("all");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: giftCards, isLoading, error } = useGiftCardsAdmin({
    search: searchQuery,
    paymentStatus: statusFilter !== "all" ? statusFilter : undefined
  });

  const { toast } = useToast();

  const giftCardFormSchema = z.object({
    sender_name: z.string().min(2, {
      message: "Sender name must be at least 2 characters.",
    }),
    sender_email: z.string().email({
      message: "Invalid email address.",
    }),
    recipient_name: z.string().min(2, {
      message: "Recipient name must be at least 2 characters.",
    }),
    recipient_email: z.string().email({
      message: "Invalid email address.",
    }),
    gift_amount: z.string().refine((value) => {
      const num = Number(value);
      return !isNaN(num) && num > 0;
    }, {
      message: "Gift amount must be a valid number greater than 0.",
    }),
    currency: z.string().min(1, {
      message: "Currency is required.",
    }),
    message_text: z.string().optional(),
    delivery_date: z.date().optional(),
  });

  type GiftCardFormValues = z.infer<typeof giftCardFormSchema>;

  const giftCardForm = useForm<GiftCardFormValues>({
    resolver: zodResolver(giftCardFormSchema),
    defaultValues: {
      sender_name: "",
      sender_email: "",
      recipient_name: "",
      recipient_email: "",
      gift_amount: "",
      currency: "RON",
      message_text: "",
      delivery_date: undefined,
    },
  });

  const onSubmit = (data: GiftCardFormValues) => {
    // Note: useCreateGiftCard is not available in useGiftCardsAdmin, this would need to be implemented
    toast({
      title: "Not implemented",
      description: "Create gift card functionality needs to be implemented.",
    });
    setIsCreateModalOpen(false);
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Not implemented",
      description: "Delete gift card is not implemented yet.",
    });
  };

  const filteredGiftCards = giftCards
    ? giftCards.filter((giftCard) => {
        const searchRegex = new RegExp(searchQuery, "i");
        const matchesSearch =
          searchRegex.test(giftCard.code) ||
          searchRegex.test(giftCard.recipient_email) ||
          searchRegex.test(giftCard.sender_email);

        const matchesStatus =
          statusFilter === "all" || giftCard.payment_status === statusFilter;

        const matchesDate = dateFilter
          ? format(new Date(giftCard.created_at), 'yyyy-MM-dd') === dateFilter
          : true;

        return matchesSearch && matchesStatus && matchesDate;
      })
    : [];

  const totalPages = Math.ceil(filteredGiftCards.length / itemsPerPage);
  const paginatedGiftCards = filteredGiftCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle>Gift Card Orders</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage gift card purchases and payments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GiftCardSyncButton />
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Gift Card
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by code, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded px-3 py-1 text-sm min-w-[200px]"
            />
          </div>
        </div>

        {/* Gift Cards Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading gift cards...</p>
            </div>
          </div>
        ) : filteredGiftCards.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Gift Cards Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all' || dateFilter
                ? 'No gift cards match your current filters.'
                : 'No gift cards have been created yet.'}
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create First Gift Card
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Code</th>
                  <th className="text-left p-3 font-medium">Recipient</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Payment Status</th>
                  <th className="text-left p-3 font-medium">Card Status</th>
                  <th className="text-left p-3 font-medium">Created</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGiftCards.map((giftCard) => (
                  <tr key={giftCard.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{giftCard.code}</div>
                      <div className="text-sm text-gray-500">
                        {giftCard.smartbill_proforma_id && (
                          <span>Proforma: {giftCard.smartbill_proforma_id}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{giftCard.recipient_name}</div>
                      <div className="text-sm text-gray-500">{giftCard.recipient_email}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {giftCard.gift_amount} {giftCard.currency}
                      </div>
                    </td>
                    <td className="p-3">
                      <PaymentStatusBadge status={giftCard.payment_status} type="payment" />
                    </td>
                    <td className="p-3">
                      <PaymentStatusBadge status={giftCard.status} type="payment" />
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-500">
                        {new Date(giftCard.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <GiftCardSyncButton 
                          giftCardId={giftCard.id} 
                          onSyncComplete={() => {
                            // Refresh the gift cards list
                            window.location.reload();
                          }} 
                        />
                        <GiftCardEmailButton 
                          giftCardId={giftCard.id}
                          recipientEmail={giftCard.recipient_email}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedGiftCard(giftCard);
                              setIsViewModalOpen(true);
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedGiftCard(giftCard);
                              setIsEditModalOpen(true);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(giftCard.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredGiftCards.length > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {paginatedGiftCards.length} of {filteredGiftCards.length} gift cards
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GiftCardsOrdersSection;
