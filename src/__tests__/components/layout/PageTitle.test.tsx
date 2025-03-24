import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageTitle } from '../../../components/layout/PageTitle';

describe('PageTitle', () => {
  it('should render the title based on pathname', () => {
    render(<PageTitle pathname="/dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should transform pathname into readable title', () => {
    render(<PageTitle pathname="/user-management" />);
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('should render default title for root path', () => {
    render(<PageTitle pathname="/" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render the enterprise system text', () => {
    render(<PageTitle pathname="/dashboard" />);
    expect(screen.getByText('Enterprise Management System')).toBeInTheDocument();
  });

  it('should handle multi-word pathnames', () => {
    render(<PageTitle pathname="/user-role-management" />);
    expect(screen.getByText('User Role Management')).toBeInTheDocument();
  });

  it('should render with correct heading level and classes', () => {
    render(<PageTitle pathname="/settings" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('text-xl', 'font-semibold');
  });

  it('should render in a flex container', () => {
    const { container } = render(<PageTitle pathname="/dashboard" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex', 'flex-col');
  });
}); 