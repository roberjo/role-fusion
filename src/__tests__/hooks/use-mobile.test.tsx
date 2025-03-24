import { renderHook, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { useIsMobile } from '../../hooks/use-mobile';
import { MOBILE_BREAKPOINT } from '../../lib/constants';

describe('useIsMobile', () => {
  let matchMediaMock: any;
  let resizeHandler: EventListenerOrEventListenerObject;

  beforeEach(() => {
    vi.useFakeTimers();
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: MOBILE_BREAKPOINT + 100, // Desktop by default
    });

    // Mock matchMedia
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockReturnValue(matchMediaMock);

    // Mock addEventListener
    window.addEventListener = vi.fn((event, handler) => {
      if (event === 'resize') resizeHandler = handler;
    });
    window.removeEventListener = vi.fn();
  });

  test('should return false for desktop viewport', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  test('should return true for mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: MOBILE_BREAKPOINT - 100,
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  test('should update when viewport changes', async () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Change viewport size
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        value: MOBILE_BREAKPOINT - 100,
      });
      if (typeof resizeHandler === 'function') {
        resizeHandler(new Event('resize'));
      }
      vi.runAllTimers();
    });
    
    expect(result.current).toBe(true);
  });

  test('should clean up event listener on unmount', () => {
    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  test('should add event listener on mount', () => {
    renderHook(() => useIsMobile());
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(matchMediaMock.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  test('should handle multiple viewport changes', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Change to mobile
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        value: MOBILE_BREAKPOINT - 100,
      });
      if (typeof resizeHandler === 'function') {
        resizeHandler(new Event('resize'));
      }
      vi.runAllTimers();
    });
    expect(result.current).toBe(true);

    // Change back to desktop
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        value: MOBILE_BREAKPOINT + 100,
      });
      if (typeof resizeHandler === 'function') {
        resizeHandler(new Event('resize'));
      }
      vi.runAllTimers();
    });
    expect(result.current).toBe(false);
  });
}); 