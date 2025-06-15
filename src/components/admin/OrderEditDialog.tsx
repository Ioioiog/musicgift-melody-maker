
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
}

interface OrderEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdate: (order: Order) => void;
}

const OrderEditDialog = ({ isOpen, onClose, order, onUpdate }: OrderEditDialogProps) => {
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);

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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order #{editedOrder.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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
            <Label htmlFor="form_data">Form Data (JSON)</Label>
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
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderEditDialog;
