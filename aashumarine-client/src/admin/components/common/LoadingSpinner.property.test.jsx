import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import LoadingSpinner from './LoadingSpinner';

const propertyTestConfig = {
  numRuns: 100,
  verbose: true,
};

describe('LoadingSpinner Properties', () => {
  /**
   * Feature: admin-panel, Property 12: Loading State Display
   * For any asynchronous operation, the system should display a loading indicator
   * while the operation is in progress.
   * 
   * **Validates: Requirements 7.6, 9.2, 11.2, 36.1**
   */
  it('displays loading indicator with proper accessibility attributes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small', 'medium', 'large'),
        fc.boolean(),
        (size, fullScreen) => {
          cleanup();
          const { container } = render(
            <LoadingSpinner size={size} fullScreen={fullScreen} />
          );

          // Verify loading indicator is present
          const spinner = screen.getByRole('status');
          expect(spinner).toBeInTheDocument();
          expect(spinner).toHaveAttribute('aria-label', 'Loading');

          // Verify size class is applied
          expect(spinner).toHaveClass(`loading-spinner-${size}`);

          // Verify fullScreen wrapper is applied when needed
          if (fullScreen) {
            expect(container.querySelector('.loading-spinner-fullscreen')).toBeInTheDocument();
          }
        }
      ),
      propertyTestConfig
    );
  }, 15000); // 15 second timeout

  /**
   * Feature: admin-panel, Property 12: Loading State Display
   * For any asynchronous operation, the loading spinner should be visible
   * and properly styled regardless of the size variant.
   */
  it('renders visible loading spinner for all size variants', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small', 'medium', 'large'),
        (size) => {
          cleanup();
          render(<LoadingSpinner size={size} />);
          
          const spinner = screen.getByRole('status');
          expect(spinner).toBeVisible();
          expect(spinner).toHaveClass('loading-spinner');
          expect(spinner).toHaveClass(`loading-spinner-${size}`);
        }
      ),
      propertyTestConfig
    );
  });
});
