import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LightboxViewer from './LightboxViewer';

/**
 * Unit tests for LightboxViewer component
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10
 */

describe('LightboxViewer Component', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg'
  ];
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering - Requirement 3.1', () => {
    it('renders when isOpen is true', () => {
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByAltText(/Test Product - Image 1 of 3/i)).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={false}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('displays image at initialIndex', () => {
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={1}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      expect(screen.getByAltText(/Test Product - Image 2 of 3/i)).toBeInTheDocument();
    });

    it('renders with single image', () => {
      const singleImage = 'https://example.com/image1.jpg';
      render(
        <LightboxViewer
          images={singleImage}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      expect(screen.getByAltText(/Test Product - Image 1 of 1/i)).toBeInTheDocument();
    });
  });

  describe('Close Button - Requirement 3.2, 3.3', () => {
    it('displays close button in top-right corner - Requirement 3.2', () => {
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const closeButton = screen.getByLabelText(/Close image viewer/i);
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass('lightbox-close');
    });

    it('calls onClose when close button is clicked - Requirement 3.3', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const closeButton = screen.getByLabelText(/Close image viewer/i);
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Navigation Buttons - Requirement 3.4, 3.5, 3.6', () => {
    it('displays previous and next buttons for multiple images - Requirement 3.4', () => {
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      expect(screen.getByLabelText(/Previous image/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Next image/i)).toBeInTheDocument();
    });

    it('does not display navigation buttons for single image', () => {
      const singleImage = 'https://example.com/image1.jpg';
      render(
        <LightboxViewer
          images={singleImage}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      expect(screen.queryByLabelText(/Previous image/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Next image/i)).not.toBeInTheDocument();
    });

    it('displays next image when next button is clicked - Requirement 3.5', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const nextButton = screen.getByLabelText(/Next image/i);
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByAltText(/Test Product - Image 2 of 3/i)).toBeInTheDocument();
      });
    });

    it('displays previous image when previous button is clicked - Requirement 3.6', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={1}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const prevButton = screen.getByLabelText(/Previous image/i);
      await user.click(prevButton);

      await waitFor(() => {
        expect(screen.getByAltText(/Test Product - Image 1 of 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('Circular Navigation - Requirement 3.7, 3.8', () => {
    it('displays first image when next is clicked on last image - Requirement 3.7', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={2}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      // Initially on last image
      expect(screen.getByAltText(/Test Product - Image 3 of 3/i)).toBeInTheDocument();

      const nextButton = screen.getByLabelText(/Next image/i);
      await user.click(nextButton);

      // Should wrap to first image
      await waitFor(() => {
        expect(screen.getByAltText(/Test Product - Image 1 of 3/i)).toBeInTheDocument();
      });
    });

    it('displays last image when previous is clicked on first image - Requirement 3.8', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      // Initially on first image
      expect(screen.getByAltText(/Test Product - Image 1 of 3/i)).toBeInTheDocument();

      const prevButton = screen.getByLabelText(/Previous image/i);
      await user.click(prevButton);

      // Should wrap to last image
      await waitFor(() => {
        expect(screen.getByAltText(/Test Product - Image 3 of 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation - Requirement 3.9', () => {
    it('closes lightbox when Escape key is pressed - Requirement 3.9', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('navigates to next image when ArrowRight is pressed', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      await user.keyboard('{ArrowRight}');

      await waitFor(() => {
        expect(screen.getByAltText(/Test Product - Image 2 of 3/i)).toBeInTheDocument();
      });
    });

    it('navigates to previous image when ArrowLeft is pressed', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={1}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      await user.keyboard('{ArrowLeft}');

      await waitFor(() => {
        expect(screen.getByAltText(/Test Product - Image 1 of 3/i)).toBeInTheDocument();
      });
    });

    it('supports circular navigation with arrow keys', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      // Press left arrow on first image
      await user.keyboard('{ArrowLeft}');

      // Should wrap to last image
      await waitFor(() => {
        expect(screen.getByAltText(/Test Product - Image 3 of 3/i)).toBeInTheDocument();
      });

      // Press right arrow on last image
      await user.keyboard('{ArrowRight}');

      // Should wrap to first image
      await waitFor(() => {
        expect(screen.getByAltText(/Test Product - Image 1 of 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('Background Scrolling Prevention - Requirement 3.10', () => {
    it('prevents background scrolling when lightbox is open - Requirement 3.10', () => {
      const { rerender } = render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      // Check that body styles are applied
      expect(document.body.style.position).toBe('fixed');
      expect(document.body.style.overflow).toBe('hidden');

      // Close lightbox
      rerender(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={false}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      // Check that body styles are removed
      expect(document.body.style.position).toBe('');
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Image Counter', () => {
    it('displays image counter for multiple images', () => {
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('updates counter when navigating', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      expect(screen.getByText('1 / 3')).toBeInTheDocument();

      const nextButton = screen.getByLabelText(/Next image/i);
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('2 / 3')).toBeInTheDocument();
      });
    });

    it('does not display counter for single image', () => {
      const singleImage = 'https://example.com/image1.jpg';
      render(
        <LightboxViewer
          images={singleImage}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      expect(screen.queryByText(/\/ 1/)).not.toBeInTheDocument();
    });
  });

  describe('Backdrop Click', () => {
    it('closes lightbox when backdrop is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const overlay = container.querySelector('.lightbox-overlay');
      await user.click(overlay);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not close when clicking on image', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const image = screen.getByAltText(/Test Product - Image 1 of 3/i);
      await user.click(image);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-label', 'Image viewer');
    });

    it('has aria-live region for counter', () => {
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const counter = screen.getByText('1 / 3');
      expect(counter).toHaveAttribute('aria-live', 'polite');
      expect(counter).toHaveAttribute('aria-atomic', 'true');
    });

    it('provides descriptive alt text for images', () => {
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const image = screen.getByAltText('Test Product - Image 1 of 3');
      expect(image).toBeInTheDocument();
    });

    it('sets focus to close button when lightbox opens - Requirement 9.5', async () => {
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const closeButton = screen.getByLabelText(/Close image viewer/i);
      
      await waitFor(() => {
        expect(closeButton).toHaveFocus();
      });
    });

    it('traps focus within modal with Tab key - Requirement 9.3', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const closeButton = screen.getByLabelText(/Close image viewer/i);
      const prevButton = screen.getByLabelText(/Previous image/i);
      const nextButton = screen.getByLabelText(/Next image/i);

      // Focus should start on close button
      await waitFor(() => {
        expect(closeButton).toHaveFocus();
      });

      // Tab to previous button
      await user.keyboard('{Tab}');
      expect(prevButton).toHaveFocus();

      // Tab to next button
      await user.keyboard('{Tab}');
      expect(nextButton).toHaveFocus();

      // Tab should cycle back to close button (focus trap)
      await user.keyboard('{Tab}');
      expect(closeButton).toHaveFocus();
    });

    it('supports reverse Tab navigation with Shift+Tab - Requirement 9.3', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const closeButton = screen.getByLabelText(/Close image viewer/i);
      const prevButton = screen.getByLabelText(/Previous image/i);
      const nextButton = screen.getByLabelText(/Next image/i);

      // Focus should start on close button
      await waitFor(() => {
        expect(closeButton).toHaveFocus();
      });

      // Shift+Tab should go to next button (reverse)
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(nextButton).toHaveFocus();

      // Shift+Tab to previous button
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(prevButton).toHaveFocus();

      // Shift+Tab should cycle back to close button
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(closeButton).toHaveFocus();
    });

    it('navigation buttons are keyboard accessible - Requirement 9.4', async () => {
      const user = userEvent.setup();
      render(
        <LightboxViewer
          images={mockImages}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const prevButton = screen.getByLabelText(/Previous image/i);
      const nextButton = screen.getByLabelText(/Next image/i);

      // Tab to previous button
      await user.keyboard('{Tab}');
      expect(prevButton).toHaveFocus();

      // Tab to next button
      await user.keyboard('{Tab}');
      expect(nextButton).toHaveFocus();

      // Both buttons should be focusable and accessible
      expect(prevButton).toHaveAttribute('type', 'button');
      expect(nextButton).toHaveAttribute('type', 'button');
    });

    it('focus trap works with single image (no nav buttons)', async () => {
      const user = userEvent.setup();
      const singleImage = 'https://example.com/image1.jpg';
      render(
        <LightboxViewer
          images={singleImage}
          initialIndex={0}
          isOpen={true}
          onClose={mockOnClose}
          productName="Test Product"
        />
      );

      const closeButton = screen.getByLabelText(/Close image viewer/i);

      // Focus should start on close button
      await waitFor(() => {
        expect(closeButton).toHaveFocus();
      });

      // Tab should keep focus on close button (only focusable element)
      await user.keyboard('{Tab}');
      expect(closeButton).toHaveFocus();

      // Shift+Tab should also keep focus on close button
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(closeButton).toHaveFocus();
    });
  });
});
