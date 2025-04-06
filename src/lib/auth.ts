import { toast } from "sonner";
import { PERMISSIONS } from './constants';
import type { Permission } from './constants';

// Constants
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_STATE_KEY = 'auth_state';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: keyof typeof PERMISSIONS;
  avatar?: string;
}

export interface ImpersonationState {
  isImpersonating: boolean;
  originalUser: User | null;
  impersonatedUser: User | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  impersonation: ImpersonationState;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Mock data - moved to a separate constant
const MOCK_USERS: Record<string, User & { password: string }> = {
  'admin@example.com': {
    id: 'user-1',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, this would be hashed
    name: 'Admin User',
    role: 'ADMIN',
    avatar: 'https://avatar.example.com/admin',
  },
  'manager@example.com': {
    id: 'user-2',
    email: 'manager@example.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'MANAGER',
    avatar: 'https://avatar.example.com/manager',
  },
  'user@example.com': {
    id: 'user-3',
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'USER',
    avatar: 'https://avatar.example.com/user',
  },
};

// Initialize auth state from storage
const initializeAuthState = (): AuthState => {
  try {
    const storedState = localStorage.getItem(AUTH_STATE_KEY);
    if (storedState) {
      const parsedState = JSON.parse(storedState) as AuthState;
      return parsedState;
    }
  } catch (error) {
    console.error('Failed to parse stored auth state:', error);
  }
  return { 
    isAuthenticated: false, 
    user: null,
    impersonation: {
      isImpersonating: false,
      originalUser: null,
      impersonatedUser: null
    }
  };
};

// State
let authState: AuthState = initializeAuthState();

// Persist auth state
const persistAuthState = (state: AuthState): void => {
  try {
    localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to persist auth state:', error);
  }
};

// Get current auth state
export function getAuthState(): AuthState {
  return authState;
}

// Get current user
export function getCurrentUser(): User | null {
  return authState.user;
}

// Authentication functions
export function isAuthenticated(): boolean {
  return authState.isAuthenticated && !!authState.user;
}

// Role and permission checks
export function hasRole(role: keyof typeof PERMISSIONS): boolean {
  return authState.user?.role === role;
}

export function hasPermission(requiredPermission: Permission): boolean {
  if (!authState.user) return false;
  const userPermissions = PERMISSIONS[authState.user.role];
  // Type check to ensure the permission is valid
  if (typeof requiredPermission === 'string' && 
      (requiredPermission === 'create' || requiredPermission === 'read')) {
    return userPermissions.includes(requiredPermission);
  }
  return false;
}

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
export async function login({ email, password }: LoginCredentials): Promise<void> {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication
    const user = MOCK_USERS[email];
    if (!user || user.password !== password) {
      throw new AuthError('Invalid email or password');
    }

    // Create mock token
    const token = btoa(`${email}:${Date.now()}`);
    setStoredAccessToken(token);

    // Update auth state
    const newState = {
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      impersonation: {
        isImpersonating: false,
        originalUser: null,
        impersonatedUser: null
      }
    };

    authState = newState;
    persistAuthState(newState);

    toast.success('Successfully logged in');
  } catch (error) {
    if (error instanceof AuthError) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred');
      console.error('Login error:', error);
    }
    throw error;
  }
}

export function logout(): void {
  try {
    removeStoredAccessToken();
    const newState = { 
      isAuthenticated: false, 
      user: null,
      impersonation: {
        isImpersonating: false,
        originalUser: null,
        impersonatedUser: null
      }
    };
    authState = newState;
    persistAuthState(newState);
    toast.success('Successfully logged out');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Failed to log out properly');
  }
}

// Token refresh
export const refreshAccessToken = async (): Promise<void> => {
  try {
    const currentToken = getStoredAccessToken();
    if (!currentToken) {
      throw new AuthError('No refresh token available');
    }

    // In a real app, this would be an API call
    // For now, we'll just check if the token is valid
    const [email] = atob(currentToken).split(':');
    const user = MOCK_USERS[email];
    if (!user) {
      throw new AuthError('Invalid token');
    }

    // Create new token
    const newToken = btoa(`${email}:${Date.now()}`);
    setStoredAccessToken(newToken);

    // Update auth state if needed
    if (!authState.isAuthenticated || !authState.user) {
      const newState = {
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        },
        impersonation: {
          isImpersonating: false,
          originalUser: null,
          impersonatedUser: null
        }
      };
      authState = newState;
      persistAuthState(newState);
    }
  } catch (error) {
    if (error instanceof AuthError) {
      toast.error(error.message);
    } else {
      toast.error('Failed to refresh authentication');
      console.error('Token refresh error:', error);
    }
    removeStoredAccessToken();
    const newState = { 
      isAuthenticated: false, 
      user: null,
      impersonation: {
        isImpersonating: false,
        originalUser: null,
        impersonatedUser: null
      }
    };
    authState = newState;
    persistAuthState(newState);
    throw error;
  }
};

// Testing/Demo utilities
export function getAvailableUsers(): Array<User> {
  return Object.values(MOCK_USERS).map(({ id, email, name, role, avatar }) => ({
    id,
    email,
    name,
    role,
    avatar,
  }));
}

// Impersonation functions
export function startImpersonation(userToImpersonate: User): void {
  if (!authState.user || authState.user.role !== 'ADMIN') {
    throw new AuthError('Only administrators can impersonate users');
  }

  const newState = {
    ...authState,
    impersonation: {
      isImpersonating: true,
      originalUser: authState.user,
      impersonatedUser: userToImpersonate
    }
  };

  authState = newState;
  persistAuthState(newState);
  toast.success(`Now impersonating ${userToImpersonate.name}`);
}

export function stopImpersonation(): void {
  if (!authState.impersonation.isImpersonating) {
    return;
  }

  const newState = {
    ...authState,
    impersonation: {
      isImpersonating: false,
      originalUser: null,
      impersonatedUser: null
    }
  };

  authState = newState;
  persistAuthState(newState);
  toast.success('Stopped impersonating user');
}

// Get current effective user (either impersonated or real)
export function getEffectiveUser(): User | null {
  if (authState.impersonation.isImpersonating && authState.impersonation.impersonatedUser) {
    return authState.impersonation.impersonatedUser;
  }
  return authState.user;
}
