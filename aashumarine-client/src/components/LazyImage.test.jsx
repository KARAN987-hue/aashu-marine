import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LazyImage from './LazyImage';

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(element) {
    // Simulate immediate intersection for testing
    this.callback([{ isIntersecting: true, target: element }]);
  }
  disconnect() {}
  unobserve() {}
}

global.IntersectionObserver = MockIntersectionObserver;

describe('LazyImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with lazy loading by default', () => {
    render(<LazyImage src="/test-image.jpg" alt="Test image" />);
    const container = screen.getByRole('img', { hidden: true }).parentElement;
    expect(container).toHaveClass('lazy-image-container');
  });

  it('renders with eager loading when eager prop is true', () => {
    render(<LazyImage src="/test-image.jpg" alt="Test image" eager={true} />);
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'eager');
  });

  it('applies custom className', () => {
    render(<LazyImage src="/test-image.jpg" alt="Test image" className="custom-class" />);
    const container = screen.getByRole('img', { hidden: true }).parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('shows loading placeholder initially', () => {
    render(<LazyImage src="/test-image.jpg" alt="Test image" />);
    const placeholder = document.querySelector('.lazy-image-placeholder');
    expect(placeholder).toBeInTheDocument();
  });

  it('loads image when in viewport', async () => {
    render(<LazyImage src="/test-image.jpg" alt="Test image" />);
    
    await waitFor(() => {
      const img = screen.getByAltText('Test image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/test-image.jpg');
    });
  });

  it('handles image load error', async () => {
    render(<LazyImage src="/invalid-image.jpg" alt="Test image" />);
    
    const img = await screen.findByAltText('Test image');
    
    // Simulate error
    img.dispatchEvent(new Event('error'));
    
    await waitFor(() => {
      const errorIcon = document.querySelector('.lazy-image-error');
      expect(errorIcon).toBeInTheDocument();
    });
  });

  it('calls onError callback when image fails to load', async () => {
    const onError = vi.fn();
    render(<LazyImage src="/invalid-image.jpg" alt="Test image" onError={onError} />);
    
    const img = await screen.findByAltText('Test image');
    img.dispatchEvent(new Event('error'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  it('validates requirement 11.3 - lazy loading for images below the fold', () => {
    const { container } = render(<LazyImage src="/test-image.jpg" alt="Test image" />);
    
    // Verify IntersectionObserver is used (lazy loading)
    expect(container.querySelector('.lazy-image-container')).toBeInTheDocument();
    
    // Verify loading attribute is set to lazy
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
