/**
 * Property-Based Tests for ConfirmDialog Component
 * 
 * Tests universal properties of the ConfirmDialog component using fast-check
 * to verify behavior across many randomized inputs.
 * 
 * Tests Properties:
 * - Property 25: Delete Confirmation Requirement
 * - Property 33: Modal Close on Cancel
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import { ConfirmDialog } from './ConfirmDialog';

const propertyTestConfig = {
  numRuns: 10,  // Reduced for faster execution and less DOM accumulation
  verbose: true,
};

describe('ConfirmDialog Property Tests', () => {
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
   * **Validates: Requirements 11.2, 11.3, 17.2, 23.2, 28.2, 31.2**
   * 
   * Property 25: Delete Confirmation Requirement
   * 
   * For any delete operation, the system should display a confirmation dialog
   * before proceeding with the deletion.
   */
  describe('Property 25: Delete Confirmation Requirement', () => {
    it('displays confirmation dialog with title and message when isOpen is true', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), // title
          fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // message
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), // confirmText
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), // cancelText
          (title, message, confirmText, cancelText) => {
            // Skip if confirm and cancel text are the same (would cause ambiguity)
            if (confirmText === cancelText) return;
            
            cleanup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();

            render(
              <ConfirmDialog
                isOpen={true}
                title={title}
                message={message}
                confirmText={confirmText}
                cancelText={cancelText}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );

            // Verify dialog is displayed
            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();

            // Verify title is displayed (check by id since text might be whitespace)
            const titleElement = document.getElementById('modal-title');
            expect(titleElement).toBeInTheDocument();
            expect(titleElement.textContent).toBe(title);

            // Verify message is displayed (check by class since text might be whitespace)
            const messageElement = document.querySelector('.confirm-message');
            expect(messageElement).toBeInTheDocument();
            expect(messageElement.textContent).toBe(message);

            // Verify confirm button is displayed with correct text
            const confirmButton = screen.getByRole('button', { name: confirmText });
            expect(confirmButton).toBeInTheDocument();

            // Verify cancel button is displayed with correct text
            const cancelButton = screen.getByRole('button', { name: cancelText });
            expect(cancelButton).toBeInTheDocument();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('uses default button text when not provided', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // message
          (title, message) => {
            cleanup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();

            render(
              <ConfirmDialog
                isOpen={true}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );

            // Verify default button text
            expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('does not display dialog when isOpen is false', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // message
          (title, message) => {
            cleanup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();

            render(
              <ConfirmDialog
                isOpen={false}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );

            // Verify dialog is not displayed
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(screen.queryByText(title)).not.toBeInTheDocument();
            expect(screen.queryByText(message)).not.toBeInTheDocument();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('calls onConfirm when confirm button is clicked', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // message
          async (title, message) => {
            cleanup();
            const onConfirm = vi.fn().mockResolvedValue(undefined);
            const onCancel = vi.fn();
            const user = userEvent.setup();

            render(
              <ConfirmDialog
                isOpen={true}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );

            // Click confirm button
            const confirmButton = screen.getByRole('button', { name: 'Confirm' });
            await user.click(confirmButton);

            // Verify onConfirm was called
            await waitFor(() => {
              expect(onConfirm).toHaveBeenCalledTimes(1);
            });

            // Verify onCancel was NOT called
            expect(onCancel).not.toHaveBeenCalled();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('displays loading state while onConfirm is executing', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // message
          fc.integer({ min: 50, max: 200 }), // delay in ms
          async (title, message, delay) => {
            cleanup();
            let resolveConfirm;
            const confirmPromise = new Promise((resolve) => {
              resolveConfirm = resolve;
            });
            
            const onConfirm = vi.fn().mockImplementation(() => confirmPromise);
            const onCancel = vi.fn();
            const user = userEvent.setup();

            render(
              <ConfirmDialog
                isOpen={true}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );

            // Click confirm button
            const confirmButton = screen.getByRole('button', { name: 'Confirm' });
            await user.click(confirmButton);

            // Verify buttons are disabled during loading
            await waitFor(() => {
              expect(confirmButton).toBeDisabled();
              expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
            });

            // Resolve the promise
            resolveConfirm();

            // Wait for loading to complete
            await waitFor(() => {
              expect(confirmButton).not.toBeDisabled();
            });
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    }, 15000); // 15 second timeout for async test

    it('handles async onConfirm errors gracefully', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), // title
          fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // message
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0), // error message
          async (title, message, errorMessage) => {
            cleanup();
            const onConfirm = vi.fn().mockRejectedValue(new Error(errorMessage));
            const onCancel = vi.fn();
            const user = userEvent.setup();

            render(
              <ConfirmDialog
                isOpen={true}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );

            // Click confirm button
            const confirmButton = screen.getByRole('button', { name: 'Confirm' });
            await user.click(confirmButton);

            // Wait for the error to be handled
            await waitFor(() => {
              expect(onConfirm).toHaveBeenCalledTimes(1);
            });

            // Verify buttons are re-enabled after error
            await waitFor(() => {
              expect(confirmButton).not.toBeDisabled();
            });
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    }, 15000); // 15 second timeout for async test
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
    it('calls onCancel when cancel button is clicked', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // message
          async (title, message) => {
            cleanup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();
            const user = userEvent.setup();

            render(
              <ConfirmDialog
                isOpen={true}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );

            // Click cancel button
            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            await user.click(cancelButton);

            // Verify onCancel was called
            expect(onCancel).toHaveBeenCalledTimes(1);

            // Verify onConfirm was NOT called
            expect(onConfirm).not.toHaveBeenCalled();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    }, 15000); // 15 second timeout for async test

    it('calls onCancel when close button (×) is clicked', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // message
          async (title, message) => {
            cleanup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();
            const user = userEvent.setup();

            render(
              <ConfirmDialog
                isOpen={true}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );

            // Click the close button (×) from the Modal
            const closeButton = screen.getByLabelText('Close modal');
            await user.click(closeButton);

            // Verify onCancel was called (Modal's onClose is wired to onCancel)
            expect(onCancel).toHaveBeenCalledTimes(1);

            // Verify onConfirm was NOT called
            expect(onConfirm).not.toHaveBeenCalled();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    }, 15000); // 15 second timeout for async test

    it('calls onCancel when Escape key is pressed', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), // title
          fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), // message
          async (title, message) => {
            cleanup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();
            const user = userEvent.setup();

            render(
              <ConfirmDialog
                isOpen={true}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );

            // Press Escape key
            await user.keyboard('{Escape}');

            // Verify onCancel was called
            expect(onCancel).toHaveBeenCalledTimes(1);

            // Verify onConfirm was NOT called
            expect(onConfirm).not.toHaveBeenCalled();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    }, 15000); // 15 second timeout for async test

    it('does not call onConfirm or onCancel when dialog is closed', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // message
          async (title, message) => {
            cleanup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();
            const user = userEvent.setup();

            render(
              <ConfirmDialog
                isOpen={false}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );

            // Try to press Escape (should have no effect)
            await user.keyboard('{Escape}');

            // Verify neither callback was called
            expect(onConfirm).not.toHaveBeenCalled();
            expect(onCancel).not.toHaveBeenCalled();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * Additional property: Button states during loading
   * 
   * Verifies that buttons are properly disabled during async operations
   */
  describe('Button States During Loading', () => {
    it('disables both buttons when isLoading prop is true', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // message
          (title, message) => {
            cleanup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();

            render(
              <ConfirmDialog
                isOpen={true}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
                isLoading={true}
              />
            );

            // Verify both buttons are disabled
            const confirmButton = screen.getByRole('button', { name: 'Confirm' });
            const cancelButton = screen.getByRole('button', { name: 'Cancel' });

            expect(confirmButton).toBeDisabled();
            expect(cancelButton).toBeDisabled();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });

    it('enables both buttons when isLoading prop is false', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // message
          (title, message) => {
            cleanup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();

            render(
              <ConfirmDialog
                isOpen={true}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
                isLoading={false}
              />
            );

            // Verify both buttons are enabled
            const confirmButton = screen.getByRole('button', { name: 'Confirm' });
            const cancelButton = screen.getByRole('button', { name: 'Cancel' });

            expect(confirmButton).not.toBeDisabled();
            expect(cancelButton).not.toBeDisabled();
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * Additional property: Button variants
   * 
   * Verifies that buttons have correct variants applied
   */
  describe('Button Variants', () => {
    it('applies correct button variants', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // message
          (title, message) => {
            cleanup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();

            const { container } = render(
              <ConfirmDialog
                isOpen={true}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );

            // Verify confirm button has danger variant (for delete operations)
            const confirmButton = screen.getByRole('button', { name: 'Confirm' });
            expect(confirmButton).toHaveClass('btn-danger');

            // Verify cancel button has secondary variant
            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            expect(cancelButton).toHaveClass('btn-secondary');
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });
  });

  /**
   * Additional property: Modal size
   * 
   * Verifies that ConfirmDialog uses small modal size
   */
  describe('Modal Size', () => {
    it('uses small modal size for confirmation dialogs', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }), // title
          fc.string({ minLength: 1, maxLength: 200 }), // message
          (title, message) => {
            cleanup();
            const onConfirm = vi.fn();
            const onCancel = vi.fn();

            render(
              <ConfirmDialog
                isOpen={true}
                title={title}
                message={message}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            );

            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveClass('modal-small');
            
            cleanup();
          }
        ),
        propertyTestConfig
      );
    });
  });
});
