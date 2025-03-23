import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/test-utils';
import { Toast, ToastAction, ToastClose, ToastProvider, ToastTitle, ToastDescription, ToastViewport } from '@/components/ui/toast';

describe('Toast', () => {
  it('renders with title and description', async () => {
    render(
      <ToastProvider swipeDirection="right">
        <Toast>
          <div className="grid gap-1">
            <ToastTitle>Toast Title</ToastTitle>
            <ToastDescription>Toast description here</ToastDescription>
          </div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Toast Title')).toBeInTheDocument();
      expect(screen.getByText('Toast description here')).toBeInTheDocument();
    });
  });

  it('renders with action button and triggers callback', async () => {
    const handleAction = vi.fn();
    render(
      <ToastProvider swipeDirection="right">
        <Toast>
          <div className="grid gap-1">
            <ToastTitle>Toast Title</ToastTitle>
            <ToastAction altText="Try again" onClick={handleAction}>
              Try again
            </ToastAction>
          </div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    await waitFor(() => {
      const actionButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(actionButton);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  it('can be closed', async () => {
    const handleClose = vi.fn();
    render(
      <ToastProvider swipeDirection="right">
        <Toast>
          <div className="grid gap-1">
            <ToastTitle>Toast Title</ToastTitle>
          </div>
          <ToastClose onClick={handleClose} />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    await waitFor(() => {
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it('applies variant styles correctly', async () => {
    render(
      <ToastProvider swipeDirection="right">
        <Toast variant="destructive">
          <div className="grid gap-1">
            <ToastTitle>Error Toast</ToastTitle>
          </div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    await waitFor(() => {
      const toast = screen.getByRole('status');
      expect(toast.className).toContain('destructive');
    });
  });

  it('renders with custom className', async () => {
    render(
      <ToastProvider swipeDirection="right">
        <Toast className="custom-toast">
          <div className="grid gap-1">
            <ToastTitle>Toast Title</ToastTitle>
          </div>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    await waitFor(() => {
      const toast = screen.getByRole('status');
      expect(toast.className).toContain('custom-toast');
    });
  });
}); 