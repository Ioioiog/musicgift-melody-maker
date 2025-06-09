interface OrderFormData {
  [key: string]: any;
  email?: string;
  fullName?: string;
  invoiceType?: string;
  companyName?: string;
  acceptMentionObligation?: boolean;
  acceptDistribution?: boolean;
  finalNote?: boolean;
}

export const validateFormData = (formData: OrderFormData, selectedPackage: string, totalPrice: number) => {
  console.log('🔍 Form Data Validation Starting...');
  
  if (!formData || typeof formData !== 'object') {
    console.error('❌ Form data is not a valid object:', formData);
    throw new Error('Form data is missing or invalid');
  }

  if (!selectedPackage || selectedPackage === '') {
    console.error('❌ No package selected');
    throw new Error('Please select a package before proceeding');
  }

  const requiredFields = ['email', 'fullName'];
  const missingFields = requiredFields.filter(field => {
    const value = formData[field];
    const isEmpty = !value || value === '' || (typeof value === 'string' && value.trim() === '');
    if (isEmpty) {
      console.error(`❌ Missing or empty field: ${field} = "${value}"`);
    }
    return isEmpty;
  });
  
  if (missingFields.length > 0) {
    console.error('❌ Missing required fields:', missingFields);
    throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
  }

  // Validate legal acceptance checkboxes
  const requiredAcceptances = ['acceptMentionObligation', 'acceptDistribution', 'finalNote'];
  const missingAcceptances = requiredAcceptances.filter(field => !formData[field]);
  
  if (missingAcceptances.length > 0) {
    console.error('❌ Missing required acceptances:', missingAcceptances);
    throw new Error('Please accept all required terms and conditions');
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    console.error('❌ Invalid email format:', formData.email);
    throw new Error('Please enter a valid email address');
  }

  if (formData.fullName && formData.fullName.trim().length < 2) {
    console.error('❌ Full name too short:', formData.fullName);
    throw new Error('Please enter a valid full name (at least 2 characters)');
  }

  // Validate invoice type specific fields
  if (formData.invoiceType === 'company') {
    if (!formData.companyName || formData.companyName.trim().length < 2) {
      throw new Error('Company name is required for company invoices');
    }
  }

  if (totalPrice === null || totalPrice === undefined || totalPrice < 0) {
    console.error('❌ Invalid total price:', totalPrice);
    throw new Error('Invalid total price calculated');
  }

  console.log('✅ Form data validation passed');
  return true;
};

export const prepareOrderData = (
  formData: OrderFormData, 
  selectedAddons: string[], 
  addonFieldValues: Record<string, any>,
  selectedPackage: string,
  selectedPaymentProvider: string,
  totalPrice: number,
  packages: any[],
  currency: string
) => {
  console.log('🏗️ Preparing order data...');
  
  // Clean and structure form data properly
  const cleanFormData = {
    email: (formData.email || '').trim(),
    fullName: (formData.fullName || '').trim(),
    phone: (formData.phone || '').trim(),
    recipientName: (formData.recipientName || '').trim(),
    occasion: (formData.occasion || '').trim(),
    address: (formData.address || '').trim(),
    city: (formData.city || 'Bucuresti').trim(),
    invoiceType: formData.invoiceType || 'individual',
    // Company-specific fields
    companyName: (formData.companyName || '').trim(),
    vatCode: (formData.vatCode || '').trim(),
    registrationNumber: (formData.registrationNumber || '').trim(),
    companyAddress: (formData.companyAddress || '').trim(),
    representativeName: (formData.representativeName || '').trim(),
    // Copy any additional form fields
    ...Object.keys(formData).reduce((acc, key) => {
      if (!['email', 'fullName', 'phone', 'recipientName', 'occasion', 'address', 'city', 'invoiceType', 'companyName', 'vatCode', 'registrationNumber', 'companyAddress', 'representativeName'].includes(key)) {
        acc[key] = formData[key];
      }
      return acc;
    }, {} as Record<string, any>)
  };

  const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);
  
  if (!selectedPackageData) {
    console.error('❌ Selected package data not found:', selectedPackage);
    throw new Error('Selected package not found');
  }

  const package_name = selectedPackageData?.label_key;
  const package_price = selectedPackageData ? selectedPackageData.price_eur || selectedPackageData.price_ron || 0 : 0;
  const package_delivery_time = selectedPackageData?.delivery_time_key;
  const package_includes = selectedPackageData?.includes;

  // Keep all prices in base monetary units (no multiplication)
  const orderData = {
    form_data: cleanFormData,
    selected_addons: selectedAddons,
    addon_field_values: addonFieldValues,
    total_price: totalPrice, // Keep in base monetary units
    package_value: selectedPackage,
    package_name: package_name,
    package_price: package_price,
    package_delivery_time: package_delivery_time,
    package_includes: package_includes ? JSON.parse(JSON.stringify(package_includes)) : [],
    status: 'pending',
    payment_status: totalPrice > 0 ? 'pending' : 'completed',
    currency: currency,
    payment_provider: selectedPaymentProvider,
    order_created_at: new Date().toISOString(),
    user_agent: navigator.userAgent,
    referrer: document.referrer || 'direct'
  };

  console.log('📦 Order data prepared:', {
    ...orderData,
    form_data: { ...orderData.form_data, email: orderData.form_data.email?.substring(0, 5) + '***' }
  });
  return orderData;
};
