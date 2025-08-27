import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import StaffManagement from "./pages/admin/StaffManagement";
import RoleManagement from "./pages/admin/RoleManagement";
import ClientManagement from "./pages/admin/ClientManagement";
import ClientDetail from "./pages/admin/ClientDetail";
import Profile from "./pages/admin/Profile";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<StaffManagement />} />
          <Route path="staff" element={<StaffManagement />} />
          
          <Route path="roles" element={<RoleManagement />} />
          <Route path="clients" element={<ClientManagement />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
