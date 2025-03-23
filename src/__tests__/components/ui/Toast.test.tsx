import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/test-utils';
import { Toast, ToastAction, ToastClose, ToastProvider } from '@/components/ui/toast';

describe('Toast', () => {
  it('renders with title and description', () => {
    render(
      <ToastProvider>
        <Toast>
          <div className="grid gap-1">
            <h2 className="font-semibold">Toast Title</h2>
            <p className="text-sm">Toast description here</p>
          </div>
        </Toast>
      </ToastProvider>
    );

    expect(screen.getByText('Toast Title')).toBeInTheDocument();
    expect(screen.getByText('Toast description here')).toBeInTheDocument();
  });

  it('renders with action button and triggers callback', () => {
    const handleAction = vi.fn();
    render(
      <ToastProvider>
        <Toast>
          <div className="grid gap-1">
            <h2>Toast Title</h2>
            <ToastAction altText="Try again" onClick={handleAction}>
              Try again
            </ToastAction>
          </div>
        </Toast>
      </ToastProvider>
    );

    const actionButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(actionButton);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('can be closed', () => {
    const handleClose = vi.fn();
    render(
      <ToastProvider>
        <Toast>
          <div className="grid gap-1">
            <h2>Toast Title</h2>
          </div>
          <ToastClose onClick={handleClose} />
        </Toast>
      </ToastProvider>
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    render(
      <ToastProvider>
        <Toast variant="destructive">
          <div className="grid gap-1">
            <h2>Error Toast</h2>
          </div>
        </Toast>
      </ToastProvider>
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('destructive');
    expect(toast).toHaveClass('group');
    expect(toast).toHaveClass('border-destructive');
  });

  it('renders with custom className', () => {
    render(
      <ToastProvider>
        <Toast className="custom-toast">
          <div className="grid gap-1">
            <h2>Toast Title</h2>
          </div>
        </Toast>
      </ToastProvider>
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('custom-toast');
  });
}); 