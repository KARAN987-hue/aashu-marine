import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import AnimationWrapper from './AnimationWrapper';

describe('AnimationWrapper', () => {
  let mockIntersectionObserver;
  let observeCallback;

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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <AnimationWrapper>
        <div>Test Content</div>
      </AnimationWrapper>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply fade-in animation class by default', () => {
    const { container } = render(
      <AnimationWrapper>
        <div>Test Content</div>
      </AnimationWrapper>
    );
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('animation-fade-in');
  });

  it('should apply specified animation type', () => {
    const { container } = render(
      <AnimationWrapper animationType="slide-up">
        <div>Test Content</div>
      </AnimationWrapper>
    );
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('animation-slide-up');
  });

  it('should apply custom duration and delay as CSS variables', () => {
    const { container } = render(
      <AnimationWrapper duration={800} delay={200}>
        <div>Test Content</div>
      </AnimationWrapper>
    );
    const wrapper = container.firstChild;
    expect(wrapper.style.getPropertyValue('--animation-duration')).toBe('800ms');
    expect(wrapper.style.getPropertyValue('--animation-delay')).toBe('200ms');
  });

  it('should set up IntersectionObserver', () => {
    render(
      <AnimationWrapper>
        <div>Test Content</div>
      </AnimationWrapper>
    );
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('should show content immediately when prefers-reduced-motion is enabled', () => {
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

    const { container } = render(
      <AnimationWrapper>
        <div>Test Content</div>
      </AnimationWrapper>
    );
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('animation-visible');
  });

  it('should trigger animation when element intersects', () => {
    const { container } = render(
      <AnimationWrapper>
        <div>Test Content</div>
      </AnimationWrapper>
    );

    // Simulate intersection
    act(() => {
      if (observeCallback) {
        observeCallback([
          {
            isIntersecting: true,
            target: container.firstChild,
          },
        ]);
      }
    });

    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('animation-visible');
  });

  it('should only trigger animation once', () => {
    const { container, rerender } = render(
      <AnimationWrapper>
        <div>Test Content</div>
      </AnimationWrapper>
    );

    // First intersection
    act(() => {
      if (observeCallback) {
        observeCallback([
          {
            isIntersecting: true,
            target: container.firstChild,
          },
        ]);
      }
    });

    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('animation-visible');

    // Rerender and try to trigger again
    rerender(
      <AnimationWrapper>
        <div>Test Content Updated</div>
      </AnimationWrapper>
    );

    // Should still have animation-visible class
    expect(wrapper.className).toContain('animation-visible');
  });

  it('should use custom threshold', () => {
    render(
      <AnimationWrapper threshold={0.5}>
        <div>Test Content</div>
      </AnimationWrapper>
    );

    // Check that IntersectionObserver was called with correct options
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.5,
      })
    );
  });

  it('should support all animation types', () => {
    const animationTypes = ['fade-in', 'slide-up', 'slide-left', 'slide-right'];

    animationTypes.forEach(type => {
      const { container } = render(
        <AnimationWrapper animationType={type}>
          <div>Test</div>
        </AnimationWrapper>
      );
      expect(container.firstChild.className).toContain(`animation-${type}`);
    });
  });
});
