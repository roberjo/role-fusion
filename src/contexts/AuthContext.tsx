import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  User,
  AuthState,
  LoginCredentials,
  login as authLogin,
  logout as authLogout,
  refreshAccessToken,
  hasRole as checkRole,
  hasPermission as checkPermission,
  isAuthenticated as checkAuth,
  getAuthState,
  startImpersonation as authStartImpersonation,
  stopImpersonation as authStopImpersonation,
  getEffectiveUser,
} from '@/lib/auth';
import type { Permission } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: User['role']) => boolean;
  hasPermission: (permission: Permission) => boolean;
  startImpersonation: (user: User) => void;
  stopImpersonation: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(getAuthState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshAccessToken();
        setAuthState(getAuthState());
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      await authLogin(credentials);
      setAuthState(getAuthState());
      navigate('/');
    } catch (error) {
      setError('Invalid email or password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    try {
      authLogout();
      setAuthState(getAuthState());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out properly');
    }
  }, [navigate]);

  const isAuthenticated = useCallback(() => {
    return checkAuth();
  }, []);

  const hasRole = useCallback((role: User['role']) => {
    return checkRole(role);
  }, []);

  const hasPermission = useCallback((permission: Permission) => {
    return checkPermission(permission);
  }, []);

  const startImpersonation = useCallback((user: User) => {
    try {
      authStartImpersonation(user);
      setAuthState(getAuthState());
    } catch (error) {
      console.error('Impersonation error:', error);
      toast.error('Failed to start impersonation');
    }
  }, []);

  const stopImpersonation = useCallback(() => {
    try {
      authStopImpersonation();
      setAuthState(getAuthState());
    } catch (error) {
      console.error('Stop impersonation error:', error);
      toast.error('Failed to stop impersonation');
    }
  }, []);

  const value = {
    user: getEffectiveUser(),
    isLoading,
    error,
    authState,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasPermission,
    startImpersonation,
    stopImpersonation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 