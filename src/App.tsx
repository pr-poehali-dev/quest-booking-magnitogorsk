import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DangerZoneQuest from "./pages/DangerZoneQuest";
import ArtifactQuest from "./pages/ArtifactQuest";
import TeaZone from "./pages/TeaZone";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/danger-zone" element={<DangerZoneQuest />} />
          <Route path="/artifact-quest" element={<ArtifactQuest />} />
          <Route path="/tea-zone" element={<TeaZone />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
