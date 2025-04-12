import { toast } from "sonner";
import { PERMISSIONS } from './constants';
import type { Permission } from './constants';
import jwt from 'jsonwebtoken';

// Constants
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_STATE_KEY = 'auth_state';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use a secure secret
const IMPERSONATION_MAX_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const IMPERSONATION_RATE_LIMIT = 5; // Max 5 impersonation attempts per hour

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
  startTime: number | null;
  sessionId: string | null;
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

export interface SecureToken {
  sub: string;          // Subject (user ID)
  role: string;         // User role
  imp?: string;         // Impersonated user ID if applicable
  iat: number;          // Issued at
  exp: number;          // Expiration
  jti: string;          // Unique token ID
  ip?: string;          // IP address
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

// Impersonation tracking
const impersonationSessions: Record<string, {
  startTime: number;
  originalUserId: string;
  impersonatedUserId: string;
  ip: string;
  actions: Array<{
    action: string;
    timestamp: number;
    details: any;
  }>;
}> = {};

// Rate limiting
const impersonationAttempts: Record<string, {
  count: number;
  lastReset: number;
}> = {};

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
      impersonatedUser: null,
      startTime: null,
      sessionId: null
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

// Generate a secure JWT token
const generateSecureToken = (user: User, impersonatedUser?: User, ip?: string): string => {
  const now = Math.floor(Date.now() / 1000);
  const tokenData: SecureToken = {
    sub: user.id,
    role: user.role,
    iat: now,
    exp: now + (60 * 60), // 1 hour expiration
    jti: `${user.id}-${now}-${Math.random().toString(36).substring(2, 15)}`,
    ip
  };
  
  if (impersonatedUser) {
    tokenData.imp = impersonatedUser.id;
  }
  
  return jwt.sign(tokenData, JWT_SECRET);
};

// Verify a JWT token
const verifyToken = (token: string): SecureToken | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as SecureToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Check if impersonation session is expired
const isImpersonationExpired = (sessionId: string): boolean => {
  const session = impersonationSessions[sessionId];
  if (!session) return true;
  
  const now = Date.now();
  return now - session.startTime > IMPERSONATION_MAX_DURATION;
};

// Check rate limiting
const checkRateLimit = (userId: string, ip: string): boolean => {
  const key = `${userId}-${ip}`;
  const now = Date.now();
  
  if (!impersonationAttempts[key] || now - impersonationAttempts[key].lastReset > 60 * 60 * 1000) {
    impersonationAttempts[key] = {
      count: 0,
      lastReset: now
    };
  }
  
  if (impersonationAttempts[key].count >= IMPERSONATION_RATE_LIMIT) {
    return false;
  }
  
  impersonationAttempts[key].count++;
  return true;
};

// Log impersonation action
const logImpersonationAction = (sessionId: string, action: string, details: any): void => {
  if (!impersonationSessions[sessionId]) return;
  
  impersonationSessions[sessionId].actions.push({
    action,
    timestamp: Date.now(),
    details
  });
  
  // In a real app, this would send to a server
  console.log(`[IMPERSONATION] Session ${sessionId}: ${action}`, details);
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

    // Create secure token
    const token = generateSecureToken(user);
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
        impersonatedUser: null,
        startTime: null,
        sessionId: null
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
    // If impersonating, stop impersonation first
    if (authState.impersonation.isImpersonating && authState.impersonation.sessionId) {
      stopImpersonation();
    }
    
    removeStoredAccessToken();
    const newState = { 
      isAuthenticated: false, 
      user: null,
      impersonation: {
        isImpersonating: false,
        originalUser: null,
        impersonatedUser: null,
        startTime: null,
        sessionId: null
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

    // Verify the token
    const tokenData = verifyToken(currentToken);
    if (!tokenData) {
      throw new AuthError('Invalid token');
    }

    // Get user from token
    const user = MOCK_USERS[Object.keys(MOCK_USERS).find(key => 
      MOCK_USERS[key].id === tokenData.sub
    ) || ''];
    
    if (!user) {
      throw new AuthError('User not found');
    }

    // Create new token
    const newToken = generateSecureToken(user);
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
          impersonatedUser: null,
          startTime: null,
          sessionId: null
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
        impersonatedUser: null,
        startTime: null,
        sessionId: null
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
  // Server-side validation would happen here
  if (!authState.user || authState.user.role !== 'ADMIN') {
    throw new AuthError('Only administrators can impersonate users');
  }

  // Check rate limiting
  const ip = '127.0.0.1'; // In a real app, this would come from the request
  if (!checkRateLimit(authState.user.id, ip)) {
    throw new AuthError('Impersonation rate limit exceeded. Please try again later.');
  }

  // Check if already impersonating
  if (authState.impersonation.isImpersonating) {
    throw new AuthError('Already impersonating a user. Stop current impersonation first.');
  }

  // Create session ID
  const sessionId = `${authState.user.id}-${userToImpersonate.id}-${Date.now()}`;
  
  // Create impersonation session
  impersonationSessions[sessionId] = {
    startTime: Date.now(),
    originalUserId: authState.user.id,
    impersonatedUserId: userToImpersonate.id,
    ip,
    actions: []
  };

  // Log impersonation start
  logImpersonationAction(sessionId, 'start_impersonation', {
    originalUser: authState.user.name,
    impersonatedUser: userToImpersonate.name,
    ip
  });

  // Create secure token with impersonation claim
  const token = generateSecureToken(authState.user, userToImpersonate, ip);
  setStoredAccessToken(token);

  // Update auth state
  const newState = {
    ...authState,
    impersonation: {
      isImpersonating: true,
      originalUser: authState.user,
      impersonatedUser: userToImpersonate,
      startTime: Date.now(),
      sessionId
    }
  };

  authState = newState;
  persistAuthState(newState);
  
  // Notify admins (in a real app, this would be a server call)
  console.log(`[ADMIN NOTIFICATION] User ${authState.user?.name} started impersonating ${userToImpersonate.name}`);
  
  toast.success(`Now impersonating ${userToImpersonate.name}`);
}

export function stopImpersonation(): void {
  if (!authState.impersonation.isImpersonating || !authState.impersonation.sessionId) {
    return;
  }

  const sessionId = authState.impersonation.sessionId;
  
  // Log impersonation end
  logImpersonationAction(sessionId, 'stop_impersonation', {
    originalUser: authState.impersonation.originalUser?.name,
    impersonatedUser: authState.impersonation.impersonatedUser?.name,
    duration: Date.now() - (authState.impersonation.startTime || 0)
  });

  // Create secure token without impersonation claim
  const token = generateSecureToken(authState.impersonation.originalUser!);
  setStoredAccessToken(token);

  // Update auth state
  const newState = {
    ...authState,
    impersonation: {
      isImpersonating: false,
      originalUser: null,
      impersonatedUser: null,
      startTime: null,
      sessionId: null
    }
  };

  authState = newState;
  persistAuthState(newState);
  
  // Notify admins (in a real app, this would be a server call)
  console.log(`[ADMIN NOTIFICATION] User ${authState.user?.name} stopped impersonating ${authState.impersonation.impersonatedUser?.name}`);
  
  toast.success('Stopped impersonating user');
}

// Get current effective user (either impersonated or real)
export function getEffectiveUser(): User | null {
  // Check if impersonation is expired
  if (authState.impersonation.isImpersonating && 
      authState.impersonation.sessionId && 
      isImpersonationExpired(authState.impersonation.sessionId)) {
    // Auto-stop expired impersonation
    stopImpersonation();
    return authState.user;
  }
  
  if (authState.impersonation.isImpersonating && authState.impersonation.impersonatedUser) {
    return authState.impersonation.impersonatedUser;
  }
  return authState.user;
}

// Log user action (for audit trail)
export function logUserAction(action: string, details: any): void {
  if (authState.impersonation.isImpersonating && authState.impersonation.sessionId) {
    logImpersonationAction(authState.impersonation.sessionId, action, details);
  } else if (authState.user) {
    // Log regular user action
    console.log(`[USER ACTION] ${authState.user.name}: ${action}`, details);
  }
}
