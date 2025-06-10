
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useDiscountCodes, useToggleDiscountCode, useDeleteDiscountCode } from "@/hooks/useDiscountCodes";
import { useSendDiscountCode } from "@/hooks/useSendDiscountCode";
import { Trash2, Mail, Edit } from "lucide-react";
import { useForm } from "react-hook-form";

interface EmailFormData {
  customerEmail: string;
  customerName: string;
}

const DiscountCodesTable = () => {
  const { data: codes, isLoading } = useDiscountCodes();
  const toggleCode = useToggleDiscountCode();
  const deleteCode = useDeleteDiscountCode();
  const sendEmail = useSendDiscountCode();
  const [selectedCodeId, setSelectedCodeId] = useState<string>("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmailFormData>();

  const handleToggle = (id: string, isActive: boolean) => {
    toggleCode.mutate({ id, isActive });
  };

  const handleDelete = (id: string) => {
    deleteCode.mutate(id);
  };

  const onSendEmail = (data: EmailFormData) => {
    if (selectedCodeId) {
      sendEmail.mutate({
        discountCodeId: selectedCodeId,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
      });
      reset();
      setSelectedCodeId("");
    }
  };

  if (isLoading) {
    return <div>Loading discount codes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!codes || codes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No discount codes found.
                </TableCell>
              </TableRow>
            ) : (
              codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-mono">{code.code}</TableCell>
                  <TableCell>
                    <Badge variant={code.discount_type === "percentage" ? "default" : "secondary"}>
                      {code.discount_type === "percentage" ? "%" : "Fixed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {code.discount_type === "percentage"
                      ? `${code.discount_value}%`
                      : `${code.discount_value / 100} RON`}
                  </TableCell>
                  <TableCell>
                    {code.used_count}
                    {code.usage_limit && ` / ${code.usage_limit}`}
                  </TableCell>
                  <TableCell>
                    {code.expires_at
                      ? new Date(code.expires_at).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={code.is_active}
                      onCheckedChange={(checked) => handleToggle(code.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedCodeId(code.id)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Discount Code via Email</DialogTitle>
                            <DialogDescription>
                              Send the discount code "{code.code}" to a customer via email.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubmit(onSendEmail)} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="customerEmail">Customer Email</Label>
                              <Input
                                id="customerEmail"
                                type="email"
                                {...register("customerEmail", { 
                                  required: "Email is required",
                                  pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Please enter a valid email"
                                  }
                                })}
                                placeholder="customer@example.com"
                              />
                              {errors.customerEmail && (
                                <p className="text-sm text-destructive">{errors.customerEmail.message}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="customerName">Customer Name</Label>
                              <Input
                                id="customerName"
                                {...register("customerName", { required: "Name is required" })}
                                placeholder="John Doe"
                              />
                              {errors.customerName && (
                                <p className="text-sm text-destructive">{errors.customerName.message}</p>
                              )}
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={sendEmail.isPending}>
                                {sendEmail.isPending ? "Sending..." : "Send Email"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Discount Code</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the code "{code.code}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(code.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DiscountCodesTable;
