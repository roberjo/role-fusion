import { renderHook, act } from '@testing-library/react';
import { useRole } from '../hooks/useRole';
import { RoleProvider } from '../components/RoleProvider';
import { describe, it, expect } from 'vitest';

const roles = {
  admin: { permissions: ['users.view', 'users.edit', 'admin.access'] },
  user: { permissions: ['users.view'] }
};

const initialRole = { name: "user", permissions: ['users.view'] };

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RoleProvider roles={roles} initialRole={initialRole}>
    {children}
  </RoleProvider>
);

describe('useRole hook', () => {
  it('should return current role permissions', () => {
    const { result } = renderHook(() => useRole(), { wrapper });
    
    expect(result.current.hasPermission('users.view')).toBe(true);
    expect(result.current.hasPermission('users.edit')).toBe(false);
  });

  it('should update role correctly', () => {
    const { result } = renderHook(() => useRole(), { wrapper });
    
    act(() => {
      result.current.setRole('admin');
    });

    expect(result.current.hasPermission('users.edit')).toBe(true);
  });
});