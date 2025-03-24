import { render, screen } from '@testing-library/react';
import { useRole } from '../hooks/useRole';
import { RoleProvider } from '../components/RoleProvider';
import { describe, it, expect } from 'vitest';

function TestComponent() {
  const { hasPermission } = useRole();
  return (
    <div>
      {hasPermission('users.view') && <span>User can view</span>}
      {hasPermission('users.edit') && <span>User can edit</span>}
    </div>
  );
}

describe('RoleProvider Integration', () => {
  it('should provide correct permissions to nested components', () => {
    render(
      <RoleProvider
        roles={{
          admin: { permissions: ['users.view', 'users.edit', 'admin.access'] },
          user: { permissions: ['users.view'] }
        }}
        initialRole={{ name: "user", permissions: ['users.view'] }}
      >
        <TestComponent />
      </RoleProvider>
    );
    
    expect(screen.getByText('User can view')).toBeInTheDocument();
    expect(screen.queryByText('User can edit')).not.toBeInTheDocument();
  });
});