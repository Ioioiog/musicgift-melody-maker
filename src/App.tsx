
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Packages from "./pages/Packages";
import Order from "./pages/Order";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AccessDenied from "./pages/AccessDenied";
import { Toaster } from "@/components/ui/sonner";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import PaymentError from "./pages/PaymentError";
import AuthGuard from "./components/AuthGuard";
import RoleGuard from "./components/RoleGuard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/order" element={<Order />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={
                  <AuthGuard requireAuth={true}>
                    <RoleGuard requiredRole="admin" fallbackPath="/access-denied">
                      <Admin />
                    </RoleGuard>
                  </AuthGuard>
                } />
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
                <Route path="/payment/error" element={<PaymentError />} />
              </Routes>
              <Toaster />
            </div>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
