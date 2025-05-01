
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CarProvider } from "@/contexts/CarContext";

// Public pages
import HomePage from "./pages/HomePage";
import InventoryPage from "./pages/InventoryPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

// Dashboard pages
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardIndex from "./pages/dashboard/DashboardIndex";
import NewCarPage from "./pages/dashboard/NewCarPage";
import { default as DashboardInventoryPage } from "./pages/dashboard/InventoryPage";
import FinancialPage from "./pages/dashboard/FinancialPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CarProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/estoque" element={<InventoryPage />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/contato" element={<ContactPage />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardIndex />} />
                <Route path="novo-anuncio" element={<NewCarPage />} />
                <Route path="estoque" element={<DashboardInventoryPage />} />
                <Route path="financeiro" element={<FinancialPage />} />
              </Route>
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CarProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
