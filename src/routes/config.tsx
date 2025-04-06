import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Lazy load components with default export
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Login = lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const NotFound = lazy(() => import('@/pages/NotFound').then(module => ({ default: module.NotFound })));
const OrdersPage = lazy(() => import('@/pages/OrdersPage').then(module => ({ default: module.OrdersPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const WorkflowsPage = lazy(() => import('@/pages/WorkflowsPage').then(module => ({ default: module.WorkflowsPage })));
const DataGridPage = lazy(() => import('@/pages/DataGridPage'));
const UsersPage = lazy(() => import('@/pages/UsersPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));

// Wrap lazy-loaded components with Suspense
const lazyLoad = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

// Public routes
const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: lazyLoad(Login),
  },
  {
    path: '*',
    element: lazyLoad(NotFound),
  },
];

// Protected routes
const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedRoute>{lazyLoad(Dashboard)}</ProtectedRoute>,
  },
  {
    path: '/data-grid',
    element: <ProtectedRoute>{lazyLoad(DataGridPage)}</ProtectedRoute>,
  },
  {
    path: '/orders',
    element: <ProtectedRoute>{lazyLoad(OrdersPage)}</ProtectedRoute>,
  },
  {
    path: '/settings',
    element: <ProtectedRoute>{lazyLoad(SettingsPage)}</ProtectedRoute>,
  },
  {
    path: '/workflows',
    element: <ProtectedRoute>{lazyLoad(WorkflowsPage)}</ProtectedRoute>,
  },
  {
    path: '/users',
    element: <ProtectedRoute>{lazyLoad(UsersPage)}</ProtectedRoute>,
  },
  {
    path: '/reports',
    element: <ProtectedRoute>{lazyLoad(ReportsPage)}</ProtectedRoute>,
  },
];

export const routes: RouteObject[] = [
  ...publicRoutes,
  ...protectedRoutes,
]; 