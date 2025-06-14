
# 🎵 MusicGift - Personalized Musical Experiences

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg)](https://tailwindcss.com/)

MusicGift is a professional platform for creating personalized musical experiences and gifts. Transform emotions into music with custom compositions for weddings, birthdays, anniversaries, and any special moment in life.

## 🌟 Features

### 🎼 Music Services
- **Custom Song Composition**: Professional personalized music creation
- **Multiple Package Options**: From basic melodies to full productions with vocals
- **Add-on Services**: Lyrics writing, vocal recording, instrumental arrangements
- **Quote Request System**: Custom pricing for unique projects
- **Delivery Tracking**: Real-time status updates on music creation progress

### 🎁 Gift System
- **Digital Gift Cards**: Purchase and send musical gift cards
- **Custom Gift Card Designs**: Multiple visual themes and personalization options
- **Gift Card Redemption**: Easy redemption process with balance tracking
- **Scheduled Delivery**: Send gifts on specific dates

### 🌍 Multi-Language Support
- **6 Languages**: Romanian, English, French, German, Polish, Italian
- **Complete Localization**: All content, forms, and communications translated
- **Dynamic Language Switching**: Seamless language changes without page reload
- **RTL Support Ready**: Infrastructure for right-to-left languages

### 💳 Payment Processing
- **Multiple Payment Providers**: Stripe, Revolut, SmartBill integration
- **Multi-Currency Support**: EUR and RON with automatic conversion
- **Secure Transactions**: PCI-compliant payment processing
- **Invoice Generation**: Automatic proforma and invoice creation
- **Payment Status Tracking**: Real-time payment verification

### 👤 User Management
- **User Authentication**: Secure login with Supabase Auth
- **Order History**: Complete tracking of all orders and payments
- **User Profiles**: Customizable user information and preferences
- **Role-Based Access**: Admin, editor, and user role management

### 📊 Admin Dashboard
- **Order Management**: Complete order lifecycle management
- **Package Management**: Create and modify service packages
- **User Management**: User roles and permissions
- **Analytics**: Comprehensive business metrics
- **Email Campaigns**: Newsletter and marketing campaign management
- **Testimonials Management**: Customer review moderation
- **Discount Code System**: Promotional code creation and tracking

### 📧 Communication
- **Email Management**: IMAP/SMTP integration for email handling
- **Newsletter System**: Brevo integration for email marketing
- **Automated Notifications**: Order confirmations, status updates
- **Contact System**: Customer inquiry management
- **Testimonial Collection**: Automated customer feedback requests

### 🔍 SEO & Performance
- **SEO Optimized**: Meta tags, structured data, sitemaps
- **Performance Optimized**: Lazy loading, image optimization
- **Core Web Vitals**: Optimized for Google's performance metrics
- **Accessibility**: WCAG 2.1 compliant design
- **Mobile Responsive**: Fully responsive design for all devices

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and developer experience
- **Vite**: Lightning-fast development and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality component library
- **Framer Motion**: Smooth animations and transitions
- **React Router**: Client-side routing
- **React Query**: Server state management
- **React Hook Form**: Form handling with validation

### Backend & Database
- **Supabase**: Backend-as-a-Service with PostgreSQL
- **Edge Functions**: Serverless functions for API endpoints
- **Row Level Security**: Database-level security policies
- **Real-time Subscriptions**: Live data updates
- **Storage**: File upload and management

### Integrations
- **Stripe**: Payment processing and subscription management
- **Revolut**: Alternative payment provider
- **SmartBill**: Romanian invoicing system
- **Brevo**: Email marketing platform
- **OpenAI**: AI-powered content generation

### Development Tools
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality control
- **TypeScript**: Static type checking

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (shadcn/ui)
│   ├── admin/           # Admin dashboard components
│   ├── order/           # Order process components
│   ├── gift/            # Gift card components
│   └── user/            # User account components
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── contexts/            # React context providers
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── translations/        # Multi-language translations
├── data/               # Static data and configurations
└── integrations/       # External service integrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Payment provider accounts (Stripe, Revolut, SmartBill)

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd musicgift
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file with the following variables:
```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Payment Providers
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Site Configuration
VITE_SITE_URL=http://localhost:5173
```

4. **Database Setup**
- Set up your Supabase project
- Run the provided SQL migrations
- Configure Row Level Security policies
- Set up Storage buckets for file uploads

5. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built application will be in the `dist` directory.

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Import your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Environment Variables**
   Set all required environment variables in Vercel:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_STRIPE_PUBLISHABLE_KEY
   VITE_SITE_URL
   ```

3. **Deploy**
   Vercel will automatically deploy on every push to the main branch.

### Custom Domain Setup
1. Navigate to Project > Settings > Domains in Vercel
2. Add your custom domain
3. Configure DNS settings as instructed

## 🔧 Configuration

### Payment Providers
Configure payment providers in the admin dashboard:
- **Stripe**: Set up webhooks and API keys
- **Revolut**: Configure merchant settings
- **SmartBill**: Set up Romanian invoicing

### Email Configuration
1. Set up SMTP credentials for email sending
2. Configure Brevo for newsletter campaigns
3. Set up email templates and automation

### Multi-Language Setup
Add new languages by:
1. Creating translation files in `src/translations/[language]/`
2. Adding language to the language context
3. Updating the language selector component

## 📊 Database Schema

### Core Tables
- `orders`: Customer orders and payment tracking
- `gift_cards`: Gift card management and redemption
- `users`: User authentication and profiles
- `packages`: Service packages and pricing
- `testimonials`: Customer reviews and ratings
- `newsletter_subscribers`: Email marketing lists

### Security
- Row Level Security (RLS) enabled on all tables
- User-based access control
- Admin role management
- Secure file upload policies

## 🔌 API Documentation

### Edge Functions
- `stripe-create-payment`: Stripe payment processing
- `revolut-create-payment`: Revolut payment processing
- `smartbill-create-proforma`: Invoice generation
- `newsletter-subscribe`: Email list management
- `send-contact-email`: Contact form handling
- `gift-card-payment`: Gift card purchase processing

### Webhooks
- Stripe payment status updates
- Revolut transaction notifications
- SmartBill invoice status changes
- Email delivery confirmations

## 🧪 Development Guidelines

### Adding New Features
1. Create focused, small components
2. Use TypeScript for all new code
3. Add proper error handling
4. Include loading states
5. Write responsive designs
6. Add translations for all text

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Implement proper TypeScript types
- Follow React best practices
- Use semantic HTML elements

### Testing
- Test all payment flows
- Verify multi-language functionality
- Check responsive design
- Validate form submissions
- Test email integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all translations are updated
- Test across different browsers and devices

## 📈 Performance Optimization

### Implemented Optimizations
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Bundle size optimization
- Database query optimization
- CDN usage for static assets
- Caching strategies

### Monitoring
- Core Web Vitals tracking
- Performance monitoring
- Error tracking
- User analytics
- Conversion tracking

## 🔒 Security

### Implemented Security Measures
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure authentication
- Payment data encryption
- File upload restrictions

## 📞 Support

For questions and support:
- **Email**: support@musicgift.ro
- **Website**: [https://musicgift.ro](https://musicgift.ro)
- **Documentation**: Check the `/docs` folder for detailed guides

## 📄 License

This project is proprietary software. All rights reserved.

---

**Made with ❤️ for creating memorable musical experiences**

*Transform emotions into melodies with MusicGift - where every note tells your story.*
