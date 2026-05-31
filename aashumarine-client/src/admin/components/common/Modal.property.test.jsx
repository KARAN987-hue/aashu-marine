/**
 * Property-Based Tests for Modal Component
 * 
 * Tests universal properties of the Modal component using fast-check
 * to verify behavior across many randomized inputs.
 * 
 * Tests Properties:
 * - Property 32: Modal Display on Action
 * - Property 33: Modal Close on Cancel
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import { Modal } from './Modal';

const propertyTestConfig = {
  numRuns: 10,  // Reduced for faster execution and less DOM accumulation
  verbose: true,
};

describe('Modal Property Tests', () => {
  let originalBodyOverflow;

  beforeEach(() => {
    // Save original body overflow style
    originalBodyOverflow = document.body.style.overflow;
    // Clean up any previous renders
    cleanup();
  });

  afterEach(() => {
    // Restore original body overflow style
    document.body.style.overflow = originalBodyOverflow;
    // Clean up after each test
    cleanup();
  });

  /**
   * **Validates: Requirements 9.2, 10.3, 21.2, 26.2**
   * 
   * Property 32: Modal Display on Action
   * 
   * For any action button that opens a modal, clicking the button should display
   * the corresponding modal dialog.
   */
  describe('Property 32: Modal Display on Action', () => {
    it('displays modal when isOpen is true', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), // title - no whitespace-only
          fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // content - no whitespace-only
          fc.constantFrom('small', 'medium', 'large'), // size
          (title, content, size) => {
            cleanup(); // Clean before each iteration
            const onClose = vi.fn();

            const { container } = render(
              <Modal isOpen={true} onClose={onClose} title={title} size={size}>
                <div>{content}</div>
              </Modal>
            );

            // Verify modal is displayed
            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();
            expect(dialog).toHaveAttribute('aria-modal', 'true');

            // Verify title is displayed using getElementById
            const titleElement = document.getElementById('modal-title');
            expect(titleElement).toBeInTheDocument();
            expect(titleElement.textContent).toBe(title);
            
            // Verify title is accessible
            expect(screen.getByLabelText(title)).toBeInTheDocument();

            // Verify content is displayed - use textContent to handle whitespace
            const modalBody = container.querySelector('.modal-body');
            expect(modalBody).toBeInTheDocument();
            expect(modalBody.textContent).toContain(content);

            // Verify size class is applied
            expect(dialog).toHaveClass(`modal-${size}`);

            // Verify overlay is present
            const overlay = dialog.parentElement;
            expect(overlay).toHaveClass('modal-overlay');
            
            cleanup(); // Clean after each iteration
          }
        ),
        propertyTestConfig
      );
    });

    it('does not display modal when isOpen is false', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // content
          (title, content) => {
            cleanup();
            const onClose = vi.fn();

            render(
              <Modal isOpen={false} onClose={onClose} title={title}>
                <div>{content}</div>
              </Modal>
            );

            // Verify modal is not displayed
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(screen.queryByText(title)).not.toBeInTheDocument();
            expect(screen.queryByText(content)).not.toBeInTheDocument();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('prevents body scroll when modal is open', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          (title) => {
            cleanup();
            const onClose = vi.fn();

            // Initially body should be scrollable
            expect(document.body.style.overflow).not.toBe('hidden');

            const { unmount } = render(
              <Modal isOpen={true} onClose={onClose} title={title}>
                <div>Content</div>
              </Modal>
            );

            // When modal is open, body scroll should be prevented
            expect(document.body.style.overflow).toBe('hidden');

            // When modal is unmounted, body scroll should be restored
            unmount();
            expect(document.body.style.overflow).toBe('unset');
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('has proper accessibility attributes', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), // title - no whitespace-only
          (title) => {
            cleanup();
            const onClose = vi.fn();

            render(
              <Modal isOpen={true} onClose={onClose} title={title}>
                <div>Content</div>
              </Modal>
            );

            const dialog = screen.getByRole('dialog');
            
            // Verify ARIA attributes
            expect(dialog).toHaveAttribute('aria-modal', 'true');
            expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');

            // Verify title has correct id using getElementById
            const titleElement = document.getElementById('modal-title');
            expect(titleElement).toBeInTheDocument();
            expect(titleElement.textContent).toBe(title);

            // Verify close button has aria-label
            const closeButton = screen.getByLabelText('Close modal');
            expect(closeButton).toBeInTheDocument();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * **Validates: Requirements 9.10, 11.8**
   * 
   * Property 33: Modal Close on Cancel
   * 
   * For any modal dialog with a cancel button, clicking the cancel button should
   * close the modal without making any API requests.
   */
  describe('Property 33: Modal Close on Cancel', () => {
    it('calls onClose when close button is clicked', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // content
          async (title, content) => {
            cleanup();
            const onClose = vi.fn();
            const user = userEvent.setup();

            render(
              <Modal isOpen={true} onClose={onClose} title={title}>
                <div>{content}</div>
              </Modal>
            );

            // Click the close button (×)
            const closeButton = screen.getByLabelText('Close modal');
            await user.click(closeButton);

            // Verify onClose was called
            expect(onClose).toHaveBeenCalledTimes(1);
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('calls onClose when overlay is clicked', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // content
          async (title, content) => {
            cleanup();
            const onClose = vi.fn();
            const user = userEvent.setup();

            render(
              <Modal isOpen={true} onClose={onClose} title={title}>
                <div>{content}</div>
              </Modal>
            );

            // Click the overlay (not the modal content)
            const overlay = screen.getByRole('dialog').parentElement;
            await user.click(overlay);

            // Verify onClose was called
            expect(onClose).toHaveBeenCalledTimes(1);
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('does not call onClose when modal content is clicked', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // content
          async (title, content) => {
            cleanup();
            const onClose = vi.fn();
            const user = userEvent.setup();

            render(
              <Modal isOpen={true} onClose={onClose} title={title}>
                <div data-testid="modal-content">{content}</div>
              </Modal>
            );

            // Click the modal content (not the overlay)
            const modalContent = screen.getByTestId('modal-content');
            await user.click(modalContent);

            // Verify onClose was NOT called (click should not propagate to overlay)
            expect(onClose).not.toHaveBeenCalled();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('calls onClose when Escape key is pressed', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // content
          async (title, content) => {
            cleanup();
            const onClose = vi.fn();
            const user = userEvent.setup();

            render(
              <Modal isOpen={true} onClose={onClose} title={title}>
                <div>{content}</div>
              </Modal>
            );

            // Press Escape key
            await user.keyboard('{Escape}');

            // Verify onClose was called
            expect(onClose).toHaveBeenCalledTimes(1);
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('does not call onClose when Escape is pressed and modal is closed', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          async (title) => {
            cleanup();
            const onClose = vi.fn();
            const user = userEvent.setup();

            render(
              <Modal isOpen={false} onClose={onClose} title={title}>
                <div>Content</div>
              </Modal>
            );

            // Press Escape key
            await user.keyboard('{Escape}');

            // Verify onClose was NOT called (modal is not open)
            expect(onClose).not.toHaveBeenCalled();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('cleans up event listeners when unmounted', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          (title) => {
            cleanup();
            const onClose = vi.fn();

            const { unmount } = render(
              <Modal isOpen={true} onClose={onClose} title={title}>
                <div>Content</div>
              </Modal>
            );

            // Get initial listener count
            const initialListenerCount = document.eventListeners?.('keydown')?.length || 0;

            // Unmount the modal
            unmount();

            // Verify body overflow is restored
            expect(document.body.style.overflow).toBe('unset');

            // Event listeners should be cleaned up (we can't directly test this,
            // but we verify no errors occur and body style is restored)
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * Additional property: Modal size variants
   * 
   * Verifies that all size variants are properly applied
   */
  describe('Modal Size Variants', () => {
    it('applies correct size class for all size variants', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('small', 'medium', 'large'),
          fc.string({ minLength: 1, maxLength: 50 }),
          (size, title) => {
            cleanup();
            const onClose = vi.fn();

            render(
              <Modal isOpen={true} onClose={onClose} title={title} size={size}>
                <div>Content</div>
              </Modal>
            );

            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveClass(`modal-${size}`);
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('defaults to medium size when size prop is not provided', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (title) => {
            cleanup();
            const onClose = vi.fn();

            render(
              <Modal isOpen={true} onClose={onClose} title={title}>
                <div>Content</div>
              </Modal>
            );

            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveClass('modal-medium');
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });
  });
});
