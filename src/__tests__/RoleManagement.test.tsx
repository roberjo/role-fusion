import { describe, it, expect } from 'vitest';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import { TestComponent } from '../components/TestComponent';

describe('Role Management', () => {
  it('should show/hide content based on user role', async () => {
    const user = userEvent.setup();

    render(<TestComponent />);

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