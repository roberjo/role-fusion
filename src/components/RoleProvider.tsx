import React, { createContext, ReactNode } from 'react';

interface Role {
  name: string;
  permissions: string[];
}

interface RoleDefinition {
  permissions: string[];
}

interface RoleContextType {
  role: Role;
  setRole: (roleName: string) => void;
  hasPermission: (permission: string) => boolean;
}

interface RoleProviderProps {
  children: ReactNode;
  roles: Record<string, RoleDefinition>;
  initialRole: Role;
}

export const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children, roles, initialRole }: RoleProviderProps) {
  const [role, setRole] = React.useState<Role>(initialRole);

  const hasPermission = (permission: string) => {
    return role.permissions.includes(permission);
  };

  const handleSetRole = (roleName: string) => {
    const newRole = roles[roleName];
    if (newRole) {
      setRole({ name: roleName, permissions: newRole.permissions });
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole: handleSetRole, hasPermission }}>
      {children}
    </RoleContext.Provider>
  );
}