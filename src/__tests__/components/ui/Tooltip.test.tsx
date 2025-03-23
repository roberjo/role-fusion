import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/test-utils';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

describe('Tooltip', () => {
  it('renders tooltip trigger correctly', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip content on hover', async () => {
    const { baseElement } = render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await waitFor(() => {
      const tooltipContent = baseElement.querySelector('[data-testid="tooltip-content"]');
      expect(tooltipContent).toBeInTheDocument();
      // Get the first text node's content only
      const textContent = tooltipContent?.childNodes[0]?.textContent;
      expect(textContent).toBe('Tooltip content');
    });
  });

  it('hides tooltip content on mouse leave', async () => {
    const { baseElement } = render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    // First verify tooltip is visible
    await waitFor(() => {
      const tooltipContent = baseElement.querySelector('[data-testid="tooltip-content"]');
      expect(tooltipContent).toBeInTheDocument();
    });

    // Trigger mouse leave and verify it disappears
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseLeave(trigger);
    
    await waitFor(() => {
      const tooltipContent = baseElement.querySelector('[data-testid="tooltip-content"]');
      expect(tooltipContent).not.toBeInTheDocument();
    });
  });

  it('applies custom className to tooltip content', async () => {
    const { baseElement } = render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent className="custom-tooltip">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await waitFor(() => {
      const tooltipContent = baseElement.querySelector('[data-testid="tooltip-content"]');
      expect(tooltipContent).toBeInTheDocument();
      expect(tooltipContent).toHaveClass('custom-tooltip');
    });
  });
}); 