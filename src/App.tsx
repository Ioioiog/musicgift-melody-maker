
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import Testimonials from "./pages/Testimonials";
import Order from "./pages/Order";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import PaymentError from "./pages/PaymentError";
import PaymentManual from "./pages/PaymentManual";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";
import Gift from "./pages/Gift";
import Unsubscribe from "./pages/Unsubscribe";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/package/:packageId" element={<PackageDetails />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/order" element={<Order />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/admin/*" element={<Admin />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/cancel" element={<PaymentCancel />} />
                  <Route path="/payment/error" element={<PaymentError />} />
                  <Route path="/payment/manual" element={<PaymentManual />} />
                  <Route path="/gift" element={<Gift />} />
                  <Route path="/unsubscribe" element={<Unsubscribe />} />
                  <Route path="/access-denied" element={<AccessDenied />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CurrencyProvider>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
