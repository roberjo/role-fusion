
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

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
  return user.role === role;
};

// Check if user has permission to perform an action
export const hasPermission = (permission: string): boolean => {
  // This is a simplified permission check, in a real app 
  // you would check against a list of permissions for the user's role
  const { user } = getAuthState();
  if (!user) return false;
  
  const adminPermissions = ["view", "create", "edit", "delete", "approve"];
  const userPermissions = ["view", "create"];
  
  if (user.role === "admin") {
    return adminPermissions.includes(permission);
  } else if (user.role === "user") {
    return userPermissions.includes(permission);
  }
  
  return false;
};

// Logout
export const logout = (): void => {
  localStorage.removeItem("auth");
  window.location.href = "/login";
};
