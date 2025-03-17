import { render, screen } from './test-utils';
import { useRole } from '../hooks/useRole';

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
    render(<TestComponent />);
    
    expect(screen.getByText('User can view')).toBeInTheDocument();
    expect(screen.queryByText('User can edit')).not.toBeInTheDocument();
  });
});