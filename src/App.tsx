import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import StaffManagement from "./pages/admin/StaffManagement";
import RoleManagement from "./pages/admin/RoleManagement";
import ClientManagement from "./pages/admin/ClientManagement";
import Profile from "./pages/admin/Profile";
import EditStaff from "./pages/admin/EditStaff";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<StaffManagement />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="staff/edit/:id" element={<EditStaff />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="clients" element={<ClientManagement />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
