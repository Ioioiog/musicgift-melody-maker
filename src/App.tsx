import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/AuthGuard";
import Index from "./pages/Index";
import About from "./pages/About";
import Packages from "./pages/Packages";
import HowItWorks from "./pages/HowItWorks";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Order from "./pages/Order";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route 
                path="/order" 
                element={
                  <AuthGuard requireAuth={true}>
                    <Order />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <AuthGuard requireAuth={true}>
                    <Settings />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/auth" 
                element={
                  <AuthGuard requireAuth={false}>
                    <Auth />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AuthGuard requireAuth={true}>
                    <Admin />
                  </AuthGuard>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
