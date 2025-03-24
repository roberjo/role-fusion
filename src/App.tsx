import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { routes } from '@/routes/config';
import { API_CONFIG } from '@/lib/constants';

// Create Query Client with default config
export const createQueryClient = (env: string) => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: API_CONFIG.STALE_TIME[env as keyof typeof API_CONFIG.STALE_TIME],
      retry: API_CONFIG.RETRY_COUNT[env as keyof typeof API_CONFIG.RETRY_COUNT],
      refetchOnWindowFocus: env === 'production',
    },
  },
});

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Public route */}
    <Route path="/login" element={routes.find(r => r.path === '/login')?.element} />
    
    {/* Protected routes */}
    {routes.filter(route => route.path !== '/login').map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={
          <ProtectedRoute>
            {route.element}
          </ProtectedRoute>
        }
      />
    ))}
  </Routes>
);

const App = () => (
  <QueryClientProvider client={createQueryClient(process.env.NODE_ENV || 'development')}>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="role-fusion-theme">
            <TooltipProvider>
              <Toaster />
              <Suspense fallback={<PageLoader />}>
                <AppRoutes />
              </Suspense>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
