import { ReactNode, useState } from 'react';
import { RoleContext } from '../contexts/RoleContext';

interface Role {
  permissions: string[];
}

export interface RoleProviderProps {
  children: ReactNode;
  roles: Record<string, Role>;
  initialRole: string;
}

export const RoleProvider = ({ children, roles, initialRole }: RoleProviderProps) => {
  const [currentRole, setCurrentRole] = useState(initialRole);

  const hasPermission = (permission: string): boolean => {
    const role = roles[currentRole];
    return role?.permissions.includes(permission) ?? false;
  };

  return (
    <RoleContext.Provider 
      value={{
        hasPermission,
        currentRole,
        setRole: setCurrentRole,
        permissions: roles[currentRole]?.permissions || []
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};