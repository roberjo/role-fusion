import { renderHook, act } from '@testing-library/react';
import { useRole } from '../hooks/useRole';
import { RoleProvider } from '../components/RoleProvider';

const wrapper = ({ children }) => (
  <RoleProvider
    roles={{
      admin: {
        permissions: ['users.create', 'users.edit', 'users.delete']
      },
      user: {
        permissions: ['users.view']
      }
    }}
    initialRole="user"
  >
    {children}
  </RoleProvider>
);

describe('useRole hook', () => {
  it('should return current role permissions', () => {
    const { result } = renderHook(() => useRole(), { wrapper });
    
    expect(result.current.hasPermission('users.view')).toBe(true);
    expect(result.current.hasPermission('users.create')).toBe(false);
  });

  it('should update role correctly', () => {
    const { result } = renderHook(() => useRole(), { wrapper });
    
    act(() => {
      result.current.setRole('admin');
    });

    expect(result.current.hasPermission('users.create')).toBe(true);
  });
});