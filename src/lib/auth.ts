
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Mock user data
const mockUsers = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
    avatar: '/placeholder.svg'
  },
  {
    id: 'user-2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'manager', 
    avatar: '/placeholder.svg'
  },
  {
    id: 'user-3',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    role: 'user',
    avatar: '/placeholder.svg'
  }
] as User[];

// Get the current auth state from localStorage
export const getAuthState = (): AuthState => {
  try {
    const authData = localStorage.getItem("auth");
    if (!authData) {
      return { user: null, token: null, isAuthenticated: false };
    }
    
    const { user, token } = JSON.parse(authData);
    return {
      user,
      token,
      isAuthenticated: !!token,
    };
  } catch (error) {
    console.error("Error getting auth state:", error);
    return { user: null, token: null, isAuthenticated: false };
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthState().isAuthenticated;
};

// Get the current user
export const getCurrentUser = (): User | null => {
  return getAuthState().user;
};

// Check if user has a specific role
export const hasRole = (role: string): boolean => {
  const { user } = getAuthState();
  if (!user) return false;
  
  // Admin role has all permissions
  if (user.role === 'admin') return true;
  
  // Manager role has manager and user permissions
  if (user.role === 'manager' && (role === 'manager' || role === 'user')) return true;
  
  // User role only has user permissions
  if (user.role === 'user' && role === 'user') return true;
  
  return user.role === role;
};

// Check if user has permission to perform an action
export const hasPermission = (permission: string): boolean => {
  const { user } = getAuthState();
  if (!user) return false;
  
  const adminPermissions = ["create", "read", "update", "delete", "approve", "ship", "close", "reopen"];
  const managerPermissions = ["create", "read", "update", "approve", "ship", "close", "reopen"];
  const userPermissions = ["create", "read"];
  
  if (user.role === "admin") {
    return adminPermissions.includes(permission);
  } else if (user.role === "manager") {
    return managerPermissions.includes(permission);
  } else if (user.role === "user") {
    return userPermissions.includes(permission);
  }
  
  return false;
};

// Simulate login with email and password
export const login = async (email: string, password: string): Promise<AuthState> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find user by email (case insensitive)
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  // In a real app, we would validate the password here
  // For demo purposes, any password is accepted if the user exists
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Generate a fake JWT token
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke3VzZXIuaWR9IiwibmFtZSI6IiR7dXNlci5uYW1lfSIsInJvbGUiOiIke3VzZXIucm9sZX0iLCJpYXQiOjE1MTYyMzkwMjJ9`;
  
  // Store auth data in localStorage
  const authState = { user, token, isAuthenticated: true };
  localStorage.setItem('auth', JSON.stringify({ user, token }));
  
  // Notify the user
  toast.success(`Welcome, ${user.name}!`);
  
  return authState;
};

// Logout the current user
export const logout = (): void => {
  localStorage.removeItem("auth");
  toast.info("You have been logged out");
  
  // Navigate to login page
  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
};

// Get all available users (for demo/testing purposes)
export const getAvailableUsers = (): User[] => {
  return [...mockUsers];
};
