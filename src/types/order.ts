
export interface OrderFormData {
  fullName?: string;
  email?: string;
  phone?: string;
  recipientName?: string;
  customerName?: string;
  [key: string]: any; // Allow for additional dynamic form fields
}

export interface OrderData {
  id: string;
  package_name?: string;
  package_value?: string;
  package_delivery_time?: string;
  package_price?: number;
  package_includes?: string[];
  selected_addons?: string[];
  total_price?: number;
  currency: string;
  status: string;
  payment_status: string;
  payment_id?: string;
  stripe_customer_id?: string;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  webhook_processed_at?: string;
  smartbill_invoice_id?: string;
  smartbill_payment_status?: string;
  smartbill_payment_url?: string;
  smartbill_invoice_data?: any;
  smartbill_proforma_id?: string;
  smartbill_proforma_status?: string;
  smartbill_proforma_data?: any;
  gift_credit_applied?: number;
  is_gift_redemption?: boolean;
  gift_card_id?: string;
  form_data: any; // JSON data from Supabase
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  package_id?: string;
}

// Type guard to safely check if form_data has the expected structure
export const isOrderFormData = (data: any): data is OrderFormData => {
  return data && typeof data === 'object';
};

// Helper function to safely get form data
export const getOrderFormData = (formData: any): OrderFormData => {
  if (isOrderFormData(formData)) {
    return formData;
  }
  return {};
};

// Helper function to safely get customer name
export const getCustomerName = (formData: any): string => {
  const data = getOrderFormData(formData);
  return data.fullName || data.customerName || 'N/A';
};

// Helper function to safely get customer email
export const getCustomerEmail = (formData: any): string => {
  const data = getOrderFormData(formData);
  return data.email || '';
};

// Helper function to safely get an array from JSON
export const getArrayFromJson = (jsonData: any): any[] => {
  if (Array.isArray(jsonData)) {
    return jsonData;
  }
  return [];
};
