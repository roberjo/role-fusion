import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from '../../../components/theme/ThemeProvider';

describe('ThemeProvider', () => {
  const documentElement = window.document.documentElement;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    documentElement.classList.remove('light', 'dark');
  });

  it('should render children within theme context', () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should handle theme changes', () => {
    const TestComponent = () => {
      const { setTheme } = useTheme();
      return (
        <button onClick={() => setTheme('dark')}>
          Change Theme
        </button>
      );
    };

    const { getByText } = render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    expect(documentElement.classList.contains('light')).toBe(true);

    act(() => {
      getByText('Change Theme').click();
    });

    expect(documentElement.classList.contains('dark')).toBe(true);
    expect(documentElement.classList.contains('light')).toBe(false);
  });

  it('should use system theme when specified', () => {
    const matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.matchMedia = matchMediaMock;

    render(
      <ThemeProvider defaultTheme="system">
        <div>Test Content</div>
      </ThemeProvider>
    );

    expect(documentElement.classList.contains('dark')).toBe(true);
  });

  it('should persist theme in localStorage', () => {
    const TestComponent = () => {
      const { setTheme } = useTheme();
      return (
        <button onClick={() => setTheme('dark')}>
          Change Theme
        </button>
      );
    };

    const { getByText } = render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      getByText('Change Theme').click();
    });

    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should use custom storage key if provided', () => {
    const TestComponent = () => {
      const { setTheme } = useTheme();
      return (
        <button onClick={() => setTheme('light')}>
          Change Theme
        </button>
      );
    };

    const { getByText } = render(
      <ThemeProvider defaultTheme="dark" storageKey="custom-theme">
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      getByText('Change Theme').click();
    });

    expect(localStorage.getItem('custom-theme')).toBe('light');
  });
}); 