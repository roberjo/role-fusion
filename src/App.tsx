
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, hasRole } from "@/lib/auth";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DataGridPage from "./pages/DataGridPage";
import WorkflowsPage from "./pages/WorkflowsPage";
import WorkflowEditorPage from "./pages/WorkflowEditorPage";
import OrdersPage from "./pages/OrdersPage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const queryClient = new QueryClient();

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Role protected route wrapper component
const RoleProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode;
  requiredRole: string;
}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(requiredRole)) {
    // Redirect to dashboard if user doesn't have the required role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="app-theme-preference">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/data-grid" 
              element={
                <ProtectedRoute>
                  <DataGridPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workflows" 
              element={
                <ProtectedRoute>
                  <WorkflowsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workflow-editor" 
              element={
                <ProtectedRoute>
                  <WorkflowEditorPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } 
            />
            {/* Admin-only route */}
            <Route 
              path="/users" 
              element={
                <RoleProtectedRoute requiredRole="admin">
                  <UsersPage />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
