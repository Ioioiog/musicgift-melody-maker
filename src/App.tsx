
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";
import RoleGuard from "@/components/RoleGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import About from "./pages/About";
import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";
import HowItWorks from "./pages/HowItWorks";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Order from "./pages/Order";
import Gift from "./pages/Gift";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import History from "./pages/History";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";
import PaymentCancel from "./pages/PaymentCancel";
import Unsubscribe from "./pages/Unsubscribe";

const AppContent = () => (
  <ErrorBoundary>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/packages/:packageId" element={<PackageDetails />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/order" element={<Order />} />
      <Route path="/gift" element={<Gift />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/unsubscribe" element={<Unsubscribe />} />
      
      {/* Standardized payment routes */}
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/error" element={<PaymentError />} />
      <Route path="/payment/cancel" element={<PaymentCancel />} />
      
      {/* Legacy redirect for old payment-success route */}
      <Route path="/payment-success" element={<Navigate to="/payment/success" replace />} />
      
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route 
        path="/settings" 
        element={
          <AuthGuard>
            <Settings />
          </AuthGuard>
        } 
      />
      <Route 
        path="/history" 
        element={
          <AuthGuard>
            <History />
          </AuthGuard>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={['admin', 'super_admin']}>
              <Admin />
            </RoleGuard>
          </AuthGuard>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </ErrorBoundary>
);

const App = () => (
  <>
    <TooltipProvider>
      <AppContent />
    </TooltipProvider>
    <Toaster />
    <Sonner />
  </>
);

export default App;
