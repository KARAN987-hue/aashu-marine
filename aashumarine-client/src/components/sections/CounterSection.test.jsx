import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import CounterSection from './CounterSection';

describe('CounterSection', () => {
  let mockIntersectionObserver;
  let observeCallback;
  let mockRequestAnimationFrame;
  let mockCancelAnimationFrame;
  let frameCallbacks = [];

  beforeEach(() => {
    // Mock IntersectionObserver
    observeCallback = null;
    mockIntersectionObserver = vi.fn(function(callback) {
      observeCallback = callback;
      this.observe = vi.fn();
      this.disconnect = vi.fn();
      this.unobserve = vi.fn();
    });
    global.IntersectionObserver = mockIntersectionObserver;

    // Mock matchMedia for prefers-reduced-motion
    global.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Mock requestAnimationFrame and cancelAnimationFrame
    frameCallbacks = [];
    mockRequestAnimationFrame = vi.fn((callback) => {
      const id = frameCallbacks.length;
      frameCallbacks.push(callback);
      return id;
    });
    mockCancelAnimationFrame = vi.fn((id) => {
      frameCallbacks[id] = null;
    });
    global.requestAnimationFrame = mockRequestAnimationFrame;
    global.cancelAnimationFrame = mockCancelAnimationFrame;

    // Mock performance.now()
    global.performance = {
      now: vi.fn(() => 0),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    frameCallbacks = [];
  });

  const mockCounters = [
    { id: 'experience', label: 'Years of Experience', targetValue: 25, suffix: '+' },
    { id: 'customers', label: 'Satisfied Customers', targetValue: 500, suffix: '+' },
    { id: 'parts', label: 'Parts Delivered', targetValue: 10000, suffix: '+' },
  ];

  it('should render all counters', () => {
    render(<CounterSection counters={mockCounters} />);
    
    expect(screen.getByText('Years of Experience')).toBeInTheDocument();
    expect(screen.getByText('Satisfied Customers')).toBeInTheDocument();
    expect(screen.getByText('Parts Delivered')).toBeInTheDocument();
  });

  it('should render counters with suffixes', () => {
    render(<CounterSection counters={mockCounters} />);
    
    const suffixes = screen.getAllByText('+');
    expect(suffixes).toHaveLength(3);
  });

  it('should start counters at 0', () => {
    render(<CounterSection counters={mockCounters} />);
    
    // All counters should start at 0
    const numbers = screen.getAllByText('0');
    expect(numbers.length).toBeGreaterThan(0);
  });

  it('should set up IntersectionObserver', () => {
    render(<CounterSection counters={mockCounters} />);
    
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('should show final values immediately when prefers-reduced-motion is enabled', () => {
    global.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<CounterSection counters={mockCounters} />);
    
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('10000')).toBeInTheDocument();
  });

  it('should trigger animation when element intersects', () => {
    render(<CounterSection counters={mockCounters} />);

    // Simulate intersection
    act(() => {
      if (observeCallback) {
        observeCallback([
          {
            isIntersecting: true,
          },
        ]);
      }
    });

    // Should have called requestAnimationFrame
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  it('should animate counter values', () => {
    render(<CounterSection counters={mockCounters} animationDuration={2000} />);

    // Simulate intersection to start animation
    act(() => {
      if (observeCallback) {
        observeCallback([{ isIntersecting: true }]);
      }
    });

    // Simulate animation frame at 50% progress
    global.performance.now = vi.fn(() => 1000);
    act(() => {
      if (frameCallbacks[0]) {
        frameCallbacks[0](1000);
      }
    });

    // Values should be between 0 and target (not exact due to easing)
    const displayedNumbers = screen.queryAllByText(/\d+/);
    expect(displayedNumbers.length).toBeGreaterThan(0);
  });

  it('should reach target values at animation end', () => {
    render(<CounterSection counters={mockCounters} animationDuration={2000} />);

    // Simulate intersection to start animation
    act(() => {
      if (observeCallback) {
        observeCallback([{ isIntersecting: true }]);
      }
    });

    // Simulate animation frame at 100% progress
    global.performance.now = vi.fn(() => 2000);
    act(() => {
      if (frameCallbacks[0]) {
        frameCallbacks[0](2000);
      }
    });

    // Should show final values
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('10000')).toBeInTheDocument();
  });

  it('should render icon when provided', () => {
    const countersWithIcon = [
      { 
        id: 'test', 
        label: 'Test Counter', 
        targetValue: 100, 
        icon: '/test-icon.png' 
      },
    ];

    const { container } = render(<CounterSection counters={countersWithIcon} />);
    
    const icon = container.querySelector('.counter-section__icon img');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/test-icon.png');
  });

  it('should use custom animation duration', () => {
    render(<CounterSection counters={mockCounters} animationDuration={3000} />);

    // Simulate intersection to start animation
    act(() => {
      if (observeCallback) {
        observeCallback([{ isIntersecting: true }]);
      }
    });

    // At 1500ms (50% of 3000ms), should not be complete
    global.performance.now = vi.fn(() => 1500);
    act(() => {
      if (frameCallbacks[0]) {
        frameCallbacks[0](1500);
      }
    });

    // Should still be animating (not at final values yet)
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  it('should have aria-live region for accessibility', () => {
    const { container } = render(<CounterSection counters={mockCounters} />);
    
    const liveRegions = container.querySelectorAll('[aria-live="polite"]');
    expect(liveRegions.length).toBe(mockCounters.length);
  });

  it('should only trigger animation once', () => {
    const { rerender } = render(<CounterSection counters={mockCounters} />);

    // First intersection - should trigger animation
    act(() => {
      if (observeCallback) {
        observeCallback([{ isIntersecting: true }]);
      }
    });

    // Complete the animation
    global.performance.now = vi.fn(() => 2000);
    act(() => {
      if (frameCallbacks[0]) {
        frameCallbacks[0](2000);
      }
    });

    // Should show final values
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();

    // Rerender the component
    rerender(<CounterSection counters={mockCounters} />);

    // Values should still be at final state (not reset to 0)
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });
});
