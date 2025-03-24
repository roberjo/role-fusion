import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '../../../test/test-utils';
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

    expect(screen.getByRole('button')).toHaveTextContent('Hover me');
  });

  it('shows tooltip content on hover', async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    // Trigger hover
    const trigger = screen.getByRole('button');
    fireEvent.mouseEnter(trigger);
    fireEvent.focus(trigger);

    // Wait for the tooltip content to appear
    await waitFor(() => {
      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toBeInTheDocument();
      expect(tooltipContent).toHaveTextContent('Tooltip content');
    });
  });

  it('hides tooltip content on mouse leave', async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByRole('button');
    
    // Show tooltip
    fireEvent.mouseEnter(trigger);
    fireEvent.focus(trigger);
    
    // Wait for tooltip to appear
    await waitFor(() => {
      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    });

    // Hide tooltip
    fireEvent.mouseLeave(trigger);
    fireEvent.blur(trigger);
    
    // Wait for tooltip to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('applies custom className to tooltip content', async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent className="custom-tooltip">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByRole('button');
    fireEvent.mouseEnter(trigger);
    fireEvent.focus(trigger);

    await waitFor(() => {
      const tooltip = screen.getByTestId('tooltip-content');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip.className.split(' ')).toContain('custom-tooltip');
    });
  });
}); 