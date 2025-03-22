import { lazy } from 'react';

import { Login } from '@/pages/Login';
import { NotFound } from '@/pages/NotFound';

// Lazy load route components
const Index = lazy(() => import('@/pages/Index'));
const DataGridPage = lazy(() => import('@/pages/DataGridPage'));
const WorkflowsPage = lazy(() => import('@/pages/WorkflowsPage'));
const WorkflowEditorPage = lazy(() => import('@/pages/WorkflowEditorPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const UsersPage = lazy(() => import('@/pages/UsersPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DATA_GRID: '/data-grid',
  WORKFLOWS: '/workflows',
  WORKFLOW_EDITOR: '/workflow-editor',
  ORDERS: '/orders',
  USERS: '/users',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

export type RouteKey = keyof typeof ROUTES;

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  title: string;
  requiredRole?: string;
  isPublic?: boolean;
  breadcrumb?: string;
}

export const routeConfig: Record<RouteKey, RouteConfig> = {
  HOME: {
    path: ROUTES.HOME,
    component: Index,
    title: 'Dashboard',
    breadcrumb: 'Home',
  },
  LOGIN: {
    path: ROUTES.LOGIN,
    component: Login,
    title: 'Login',
    isPublic: true,
  },
  DATA_GRID: {
    path: ROUTES.DATA_GRID,
    component: DataGridPage,
    title: 'Data Grid',
    breadcrumb: 'Data Grid',
  },
  WORKFLOWS: {
    path: ROUTES.WORKFLOWS,
    component: WorkflowsPage,
    title: 'Workflows',
    breadcrumb: 'Workflows',
  },
  WORKFLOW_EDITOR: {
    path: ROUTES.WORKFLOW_EDITOR,
    component: WorkflowEditorPage,
    title: 'Workflow Editor',
    breadcrumb: 'Workflow Editor',
  },
  ORDERS: {
    path: ROUTES.ORDERS,
    component: OrdersPage,
    title: 'Orders',
    breadcrumb: 'Orders',
  },
  USERS: {
    path: ROUTES.USERS,
    component: UsersPage,
    title: 'Users',
    requiredRole: 'admin',
    breadcrumb: 'Users',
  },
  REPORTS: {
    path: ROUTES.REPORTS,
    component: ReportsPage,
    title: 'Reports',
    breadcrumb: 'Reports',
  },
  SETTINGS: {
    path: ROUTES.SETTINGS,
    component: SettingsPage,
    title: 'Settings',
    breadcrumb: 'Settings',
  },
};

// Add catch-all route
export const notFoundRoute: RouteConfig = {
  path: '*',
  component: NotFound,
  title: '404 - Not Found',
}; 