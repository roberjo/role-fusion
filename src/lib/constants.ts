export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
export const DESKTOP_BREAKPOINT = 1280;

export const THEME_STORAGE_KEY = 'role-fusion-theme';
export const DEFAULT_THEME = 'system';

export const PERMISSIONS = {
  ADMIN: ["create", "read", "update", "delete", "approve", "ship", "close", "reopen"],
  MANAGER: ["create", "read", "update", "approve", "ship", "close", "reopen"],
  USER: ["create", "read"],
} as const;

export const STATUS_COLORS = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  inactive: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  review: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
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