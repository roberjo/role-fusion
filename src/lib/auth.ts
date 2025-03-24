import { toast } from "sonner";
import { PERMISSIONS } from './constants';

export type UserRole = 'admin' | 'manager' | 'user';
// Define Permission type based on the union of all possible permission values
export type Permission = (typeof PERMISSIONS)[UserRole extends keyof typeof PERMISSIONS ? UserRole : never][number];

// Constants
const AUTH_TOKEN_KEY = 'auth_token';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

// State
let authState: AuthState = {
  user: null,
  token: null,
};

// Mock data - Consider moving to a separate file
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://avatar.example.com/admin',
  },
  {
    id: 'user-2',
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'manager',
    avatar: 'https://avatar.example.com/manager',
  },
  {
    id: 'user-3',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    avatar: 'https://avatar.example.com/user',
  },
];

// Authentication functions
export const isAuthenticated = (): boolean => {
  return !!authState.user && !!authState.token;
};

// Role and permission checks
export const hasRole = (role: UserRole): boolean => {
  const user = authState.user;
  if (!user) return false;
  
  switch (user.role) {
    case 'admin':
      return true;
    case 'manager':
      return role === 'manager' || role === 'user';
    case 'user':
      return role === 'user';
    default:
      return false;
  }
};

export const hasPermission = (permission: Permission): boolean => {
  const user = authState.user;
  if (!user) return false;
  
  const roleKey = user.role.toUpperCase() as Uppercase<UserRole>;
  const rolePermissions = PERMISSIONS[roleKey];
  
  return rolePermissions.includes(permission);
};

// Token management
export const getStoredAccessToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setStoredAccessToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeStoredAccessToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Authentication operations
export const login = async (email: string): Promise<AuthState> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const token = 'mock-jwt-token';
  authState = {
    user,
    token,
  };

  setStoredAccessToken(token);
  toast.success(`Welcome, ${user.name}!`);
  
  return authState;
};

export const logout = (): void => {
  const userName = authState.user?.name ?? "User";
  
  authState = {
    user: null,
    token: null,
  };
  
  removeStoredAccessToken();
  toast.info(`${userName} has been logged out`);
};

// Token refresh
export const refreshAccessToken = async (): Promise<void> => {
  try {
    const currentToken = getStoredAccessToken();
    if (!currentToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    setStoredAccessToken(data.token);
  } catch (error) {
    removeStoredAccessToken();
    throw error;
  }
};

// Testing/Demo utilities
export const getAvailableUsers = (): User[] => {
  return [...mockUsers];
};
