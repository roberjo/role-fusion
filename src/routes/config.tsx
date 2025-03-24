import { RouteObject } from 'react-router-dom';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { Login } from '@/pages/Login';
import { NotFound } from '@/pages/NotFound';
import { OrdersPage } from '@/pages/OrdersPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { WorkflowsPage } from '@/pages/WorkflowsPage';
import { ReactNode } from 'react';

interface AppRouteObject extends RouteObject {
  element: ReactNode;
}

export const routes: AppRouteObject[] = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/orders',
    element: <OrdersPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/workflows',
    element: <WorkflowsPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]; 