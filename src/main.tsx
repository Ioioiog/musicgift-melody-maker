
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    },
  },
});

const root = createRoot(document.getElementById("root")!);

// Lazy load non-critical providers
const LazyProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
};

// Dynamic import for context providers that aren't immediately needed
const loadContextProviders = async () => {
  const [
    { HelmetProvider },
    { AuthProvider },
    { CookieProvider },
    { LocationProvider },
    { LanguageProvider },
    { CurrencyProvider }
  ] = await Promise.all([
    import('react-helmet-async'),
    import("@/contexts/AuthContext"),
    import("@/contexts/CookieContext"),
    import("@/contexts/LocationContext"),
    import("@/contexts/LanguageContext"),
    import("@/contexts/CurrencyContext")
  ]);

  return { HelmetProvider, AuthProvider, CookieProvider, LocationProvider, LanguageProvider, CurrencyProvider };
};

// Optimized render function
const renderApp = async () => {
  try {
    const providers = await loadContextProviders();
    
    root.render(
      <LazyProviders>
        <providers.HelmetProvider>
          <providers.AuthProvider>
            <providers.CookieProvider>
              <providers.LocationProvider>
                <providers.LanguageProvider>
                  <providers.CurrencyProvider>
                    <App />
                  </providers.CurrencyProvider>
                </providers.LanguageProvider>
              </providers.LocationProvider>
            </providers.CookieProvider>
          </providers.AuthProvider>
        </providers.HelmetProvider>
      </LazyProviders>
    );
  } catch (error) {
    console.error('Failed to load app providers:', error);
    // Fallback render without providers
    root.render(
      <LazyProviders>
        <App />
      </LazyProviders>
    );
  }
};

// Initialize app
renderApp();
