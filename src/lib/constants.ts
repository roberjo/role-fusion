export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
export const DESKTOP_BREAKPOINT = 1280;

export const THEME_STORAGE_KEY = 'role-fusion-theme';
export const DEFAULT_THEME = 'system';

// Define all possible permissions
export const ALL_PERMISSIONS = [
  "create",
  "read",
  "update",
  "delete",
  "approve",
  "ship",
  "close",
  "reopen",
  "manage_users",
  "manage_roles",
  "manage_settings",
] as const;

export type Permission = typeof ALL_PERMISSIONS[number];

export const PERMISSIONS = {
  ADMIN: ALL_PERMISSIONS,
  MANAGER: [
    "create", "read", "update",
    "approve", "ship", "close", "reopen",
    "manage_settings",
  ],
  USER: ["read", "create"],
} as const;

export const STATUS_COLORS = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  INACTIVE: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  SHIPPED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  CLOSED: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
  REOPENED: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
} as const;

export const TOAST_VARIANTS = {
  default: "border bg-background",
  destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
  success: "border-green-500 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  warning: "border-yellow-500 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
} as const;

export const API_CONFIG = {
  STALE_TIME: {
    production: 5 * 60 * 1000, // 5 minutes
    development: 0,
  },
  RETRY_COUNT: {
    production: 1,
    development: 0,
  },
} as const;

export const BREAKPOINTS = {
  MOBILE: MOBILE_BREAKPOINT,
  TABLET: TABLET_BREAKPOINT,
  DESKTOP: DESKTOP_BREAKPOINT,
} as const; 