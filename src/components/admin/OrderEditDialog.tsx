import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PaymentStatusBadge from './PaymentStatusBadge';
import PaymentProviderIcon from './PaymentProviderIcon';
import FormDataRenderer from './FormDataRenderer';
import { format } from 'date-fns';

interface Order {
  id: string;
  created_at: string;
  email: string;
  total_price: number;
  status: string;
  form_data: any;
  payment_status?: string;
  payment_provider?: string;
  currency?: string;
  package_name?: string;
  stripe_session_id?: string;
  smartbill_proforma_id?: string;
  smartbill_proforma_status?: string;
  smartbill_payment_status?: string;
  smartbill_invoice_id?: string;
  smartbill_invoice_data?: any;
  smartbill_proforma_data?: any;
  last_status_check_at?: string;
}

interface OrderEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdate: (order: Order) => void;
}

const OrderEditDialog = ({ isOpen, onClose, order, onUpdate }: OrderEditDialogProps) => {
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [debugExpanded, setDebugExpanded] = useState(false);

  React.useEffect(() => {
    if (order) {
      setEditedOrder({ ...order });
    }
  }, [order]);

  const handleSave = () => {
    if (editedOrder) {
      onUpdate(editedOrder);
    }
  };

  const handleFieldChange = (field: keyof Order, value: any) => {
    if (editedOrder) {
      setEditedOrder({
        ...editedOrder,
        [field]: value
      });
    }
  };

  if (!editedOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Edit Order #{editedOrder.id.slice(0, 8)}</span>
            <PaymentProviderIcon provider={editedOrder.payment_provider || 'unknown'} />
            <PaymentStatusBadge status={editedOrder.payment_status || 'pending'} type="payment" />
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="payment">Payment Details</TabsTrigger>
            <TabsTrigger value="debug">Debug & API Data</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editedOrder.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="total_price">Total Price</Label>
                <Input
                  id="total_price"
                  type="number"
                  value={editedOrder.total_price}
                  onChange={(e) => handleFieldChange('total_price', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editedOrder.status}
                  onValueChange={(value) => handleFieldChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment_status">Payment Status</Label>
                <Select
                  value={editedOrder.payment_status || 'pending'}
                  onValueChange={(value) => handleFieldChange('payment_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-4 block">Customer Form Data</Label>
              <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                <FormDataRenderer formData={editedOrder.form_data} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Payment Provider</Label>
                <div className="p-2 border rounded bg-gray-50">
                  <PaymentProviderIcon provider={editedOrder.payment_provider || 'unknown'} />
                </div>
              </div>
              <div>
                <Label>Currency</Label>
                <div className="p-2 border rounded bg-gray-50">
                  {editedOrder.currency || 'N/A'}
                </div>
              </div>
            </div>

            {/* Payment Timeline */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Payment Timeline</Label>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Order Created:</span>
                  <span>{format(new Date(editedOrder.created_at), 'yyyy-MM-dd HH:mm:ss')}</span>
                </div>
                {editedOrder.last_status_check_at && (
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Last Status Check:</span>
                    <span>{format(new Date(editedOrder.last_status_check_at), 'yyyy-MM-dd HH:mm:ss')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Provider-specific details */}
            {editedOrder.payment_provider === 'stripe' && (
              <div className="space-y-2">
                <Label className="text-base font-semibold">Stripe Details</Label>
                {editedOrder.stripe_session_id && (
                  <div className="p-2 border rounded bg-blue-50">
                    <Label className="text-sm">Session ID:</Label>
                    <div className="font-mono text-xs">{editedOrder.stripe_session_id}</div>
                  </div>
                )}
              </div>
            )}

            {editedOrder.payment_provider === 'smartbill' && (
              <div className="space-y-2">
                <Label className="text-base font-semibold">SmartBill/Netopia Details</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border rounded bg-green-50">
                    <Label className="text-sm">Proforma Status:</Label>
                    <PaymentStatusBadge 
                      status={editedOrder.smartbill_proforma_status || 'not_requested'} 
                      type="proforma" 
                    />
                    {editedOrder.smartbill_proforma_id && (
                      <div className="font-mono text-xs mt-1">{editedOrder.smartbill_proforma_id}</div>
                    )}
                  </div>
                  <div className="p-2 border rounded bg-green-50">
                    <Label className="text-sm">Payment Status:</Label>
                    <PaymentStatusBadge 
                      status={editedOrder.smartbill_payment_status || 'pending'} 
                      type="payment" 
                    />
                  </div>
                </div>
                {editedOrder.smartbill_invoice_id && (
                  <div className="p-2 border rounded bg-green-50">
                    <Label className="text-sm">Invoice ID:</Label>
                    <div className="font-mono text-xs">{editedOrder.smartbill_invoice_id}</div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="debug" className="space-y-4">
            <div>
              <Label htmlFor="form_data">Raw Form Data (JSON) - Advanced Edit</Label>
              <Textarea
                id="form_data"
                value={JSON.stringify(editedOrder.form_data, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleFieldChange('form_data', parsed);
                  } catch (error) {
                    // Handle invalid JSON silently
                  }
                }}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-4">
              <Collapsible open={debugExpanded} onOpenChange={setDebugExpanded}>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
                  {debugExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  SmartBill Proforma Data
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Textarea
                    value={JSON.stringify(editedOrder.smartbill_proforma_data, null, 2)}
                    readOnly
                    rows={8}
                    className="font-mono text-xs bg-gray-50"
                  />
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
                  <ChevronDown className="w-4 h-4" />
                  SmartBill Invoice Data
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Textarea
                    value={JSON.stringify(editedOrder.smartbill_invoice_data, null, 2)}
                    readOnly
                    rows={8}
                    className="font-mono text-xs bg-gray-50"
                  />
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
                  <ChevronDown className="w-4 h-4" />
                  Full Order Data
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Textarea
                    value={JSON.stringify(editedOrder, null, 2)}
                    readOnly
                    rows={12}
                    className="font-mono text-xs bg-gray-50"
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderEditDialog;
