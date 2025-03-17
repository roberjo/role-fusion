import { createContext } from 'react';

export interface RoleContextType {
  hasPermission: (permission: string) => boolean;
  currentRole: string;
  setRole: (role: string) => void;
  permissions: string[];
}

export const RoleContext = createContext<RoleContextType | null>(null);