import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { RoleProvider } from '@/components/RoleProvider';
import { useRole } from '@/hooks/useRole';

// Mock component that shows/hides based on role
const AdminPanel = () => {
  const { hasPermission } = useRole();
  if (!hasPermission('admin.access')) return null;
  return <div data-testid="admin-panel">Admin Only Content</div>;
};

// Mock component with role switcher
const TestComponent = () => {
  const { setRole } = useRole();
  return (
    <div>
      <select 
        data-testid="role-switcher"
        onChange={(e) => setRole(e.target.value)}
        defaultValue="user"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <AdminPanel />
    </div>
  );
};

describe('Role Management', () => {
  it('should show/hide content based on user role', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <RoleProvider
          roles={{
            user: { permissions: ['user.read'] },
            admin: { permissions: ['user.read', 'admin.access'] }
          }}
          initialRole="user"
        >
          <TestComponent />
        </RoleProvider>
      </BrowserRouter>
    );

    // Initially as user, admin panel should not be visible
    expect(screen.queryByTestId('admin-panel')).not.toBeInTheDocument();

    // Switch to admin role
    await act(async () => {
      const roleSwitcher = screen.getByTestId('role-switcher');
      await user.selectOptions(roleSwitcher, 'admin');
    });

    // Admin panel should now be visible
    expect(screen.getByTestId('admin-panel')).toBeInTheDocument();

    // Switch back to user role
    await act(async () => {
      const roleSwitcher = screen.getByTestId('role-switcher');
      await user.selectOptions(roleSwitcher, 'user');
    });

    // Admin panel should be hidden again
    expect(screen.queryByTestId('admin-panel')).not.toBeInTheDocument();
  });
}); 