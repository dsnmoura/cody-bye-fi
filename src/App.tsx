import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TemplateProvider } from "@/contexts/TemplateContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ChooseTemplate from "./pages/ChooseTemplate";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import CreatePost from "./pages/dashboard/CreatePost";
import Templates from "./pages/dashboard/Templates";
import Schedule from "./pages/dashboard/Schedule";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";
import BrandSettings from "./pages/dashboard/BrandSettings";
import CustomizeTemplate from "./pages/dashboard/CustomizeTemplate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TemplateProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/choose-template" element={<ChooseTemplate />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="create" element={<CreatePost />} />
              <Route path="templates" element={<Templates />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="brand-settings" element={<BrandSettings />} />
              <Route path="customize-template/:templateId" element={<CustomizeTemplate />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TemplateProvider>
  </QueryClientProvider>
);

export default App;
