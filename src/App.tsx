
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";
import Order from "./pages/Order";
import Gift from "./pages/Gift";
import HowItWorks from "./pages/HowItWorks";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import History from "./pages/History";
import Settings from "./pages/Settings";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";
import PaymentCancel from "./pages/PaymentCancel";
import Testimonials from "./pages/Testimonials";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";
import Unsubscribe from "./pages/Unsubscribe";
import AuthGuard from "./components/AuthGuard";
import RoleGuard from "./components/RoleGuard";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/packages/:id" element={<PackageDetails />} />
      <Route path="/order" element={<Order />} />
      <Route path="/gift" element={<Gift />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-error" element={<PaymentError />} />
      <Route path="/payment-cancel" element={<PaymentCancel />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/unsubscribe" element={<Unsubscribe />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route 
        path="/history" 
        element={
          <AuthGuard>
            <History />
          </AuthGuard>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <AuthGuard>
            <Settings />
          </AuthGuard>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={['admin']}>
              <Admin />
            </RoleGuard>
          </AuthGuard>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
