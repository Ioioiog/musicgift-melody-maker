
# NETOPIA Payment API

This Node.js API handles NETOPIA payment processing for the Music Gift application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your NETOPIA credentials:
   ```bash
   cp .env.example .env
   ```

3. **Deploy to Vercel:**
   ```bash
   npx vercel
   ```

## Environment Variables

### Required NETOPIA Configuration
- `NETOPIA_SIGNATURE` - Your NETOPIA merchant signature
- `NETOPIA_PUBLIC_KEY` - NETOPIA public key (PEM format)
- `NETOPIA_PRIVATE_KEY` - NETOPIA private key (PEM format)
- `NETOPIA_TEST_MODE` - Set to `true` for sandbox, `false` for production

### Required Supabase Configuration
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Your Supabase service role key

### Optional Configuration
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins

## API Endpoints

### POST /api/create-payment
Creates a new payment request for NETOPIA.

**Request body:**
```json
{
  "orderId": "uuid",
  "amount": 400,
  "currency": "RON",
  "customerEmail": "user@example.com",
  "customerName": "John Doe",
  "description": "Order description"
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://sandboxsecure.mobilpay.ro",
  "formData": "encrypted_payment_data",
  "netopiaOrderId": "ORDER_uuid_timestamp",
  "signature": "merchant_signature"
}
```

### POST /api/webhook
Handles IPN (Instant Payment Notification) from NETOPIA.

This endpoint processes payment confirmations and updates order status in Supabase.

## Integration with Main App

Update your Supabase Edge Function to call this API:

```javascript
const response = await fetch('https://your-vercel-app.vercel.app/api/create-payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    orderId,
    amount,
    currency,
    customerEmail,
    customerName,
    description
  })
});
```

## Testing

1. Use NETOPIA's sandbox environment (NETOPIA_TEST_MODE=true)
2. Test the payment flow end-to-end
3. Verify webhook processing with test payments
4. Check order status updates in Supabase

## Security

- All sensitive data is encrypted using NETOPIA's encryption requirements
- Environment variables are used for all credentials
- CORS protection for allowed origins
- Webhook signature validation

## Troubleshooting

- Check Vercel logs for API errors
- Verify environment variables are set correctly
- Ensure NETOPIA keys are in correct PEM format
- Test with NETOPIA sandbox first before production
