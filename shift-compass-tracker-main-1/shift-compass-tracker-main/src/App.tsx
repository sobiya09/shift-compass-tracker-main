
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { ShiftProvider } from "@/context/shift-context";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShiftsPage from "./pages/ShiftsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminEmployeesPage from "./pages/AdminEmployeesPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="shift-compass-theme">
      <AuthProvider>
        <ShiftProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected routes */}
                <Route path="/" element={<Index />} />
                <Route path="/shifts" element={<ShiftsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin/employees" element={<AdminEmployeesPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ShiftProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
