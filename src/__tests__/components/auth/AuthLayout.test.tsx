import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthLayout } from '../../../components/auth/AuthLayout';

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('AuthLayout', () => {
  test('should render children within the auth layout', () => {
    renderWithRouter(
      <AuthLayout title="Test Title">
        <div>Test Content</div>
      </AuthLayout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('should apply the correct layout classes', () => {
    renderWithRouter(
      <AuthLayout title="Test Title">
        <div>Test Content</div>
      </AuthLayout>
    );
    
    const layout = screen.getByTestId('auth-layout');
    expect(layout).toHaveClass('min-h-screen', 'flex', 'flex-col');
  });

  test('should maintain accessibility landmarks', () => {
    renderWithRouter(
      <AuthLayout title="Test Title">
        <div>Test Content</div>
      </AuthLayout>
    );

    expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument();
  });

  test('should render description when provided', () => {
    renderWithRouter(
      <AuthLayout title="Test Title" description="Test Description">
        <div>Test Content</div>
      </AuthLayout>
    );

    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('should render with custom className if provided', () => {
    renderWithRouter(
      <AuthLayout title="Test Title" className="custom-class">
        <div>Test Content</div>
      </AuthLayout>
    );

    const layout = screen.getByTestId('auth-layout');
    
    // Log the actual class names for debugging
    console.log('Actual class names:', layout.className);
    
    // Test each class individually
    expect(layout.className).toMatch(/\bcustom-class\b/);
    expect(layout.className).toMatch(/\bmin-h-screen\b/);
    expect(layout.className).toMatch(/\bflex\b/);
    expect(layout.className).toMatch(/\bflex-col\b/);
  });
}); 