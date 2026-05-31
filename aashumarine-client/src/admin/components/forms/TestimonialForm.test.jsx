/**
 * TestimonialForm Component Tests
 * 
 * Tests real-time validation (onBlur) for TestimonialForm
 * Requirements: 37.5, 37.7
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestimonialForm } from './TestimonialForm';

describe('TestimonialForm - Real-time Validation', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it('should display validation error when name field loses focus with empty value', async () => {
    const user = userEvent.setup();
    render(<TestimonialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/name/i);

    // Focus and blur without entering value
    await user.click(nameInput);
    await user.tab();

    // Should show validation error after blur
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('should clear validation error when user corrects the name input', async () => {
    const user = userEvent.setup();
    render(<TestimonialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/name/i);

    // Trigger validation error
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    // Correct the input
    await user.click(nameInput);
    await user.type(nameInput, 'John Doe');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    });
  });

  it('should display validation error when feedback text loses focus with empty value', async () => {
    const user = userEvent.setup();
    render(<TestimonialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const textArea = screen.getByLabelText(/feedback text/i);

    // Focus and blur without entering value
    await user.click(textArea);
    await user.tab();

    // Should show validation error after blur
    await waitFor(() => {
      expect(screen.getByText(/feedback text is required/i)).toBeInTheDocument();
    });
  });

  it('should clear validation error when user corrects the feedback text', async () => {
    const user = userEvent.setup();
    render(<TestimonialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const textArea = screen.getByLabelText(/feedback text/i);

    // Trigger validation error
    await user.click(textArea);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/feedback text is required/i)).toBeInTheDocument();
    });

    // Correct the input
    await user.click(textArea);
    await user.type(textArea, 'Great service!');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/feedback text is required/i)).not.toBeInTheDocument();
    });
  });

  it('should display validation error when rating loses focus with empty value', async () => {
    const user = userEvent.setup();
    render(<TestimonialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const ratingInput = screen.getByLabelText(/rating \(1-5\)/i);

    // Focus and blur without entering value
    await user.click(ratingInput);
    await user.tab();

    // Should show validation error after blur
    await waitFor(() => {
      expect(screen.getByText(/rating is required/i)).toBeInTheDocument();
    });
  });

  it('should display validation error when rating is out of range', async () => {
    const user = userEvent.setup();
    render(<TestimonialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const ratingInput = screen.getByLabelText(/rating \(1-5\)/i);

    // Enter invalid rating
    await user.click(ratingInput);
    await user.type(ratingInput, '6');
    await user.tab();

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/rating must be between 1 and 5/i)).toBeInTheDocument();
    });
  });

  it('should clear validation error when user corrects the rating', async () => {
    const user = userEvent.setup();
    render(<TestimonialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const ratingInput = screen.getByLabelText(/rating \(1-5\)/i);

    // Trigger validation error
    await user.click(ratingInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/rating is required/i)).toBeInTheDocument();
    });

    // Correct the input
    await user.click(ratingInput);
    await user.type(ratingInput, '5');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/rating is required/i)).not.toBeInTheDocument();
    });
  });

  it('should clear rating error when user clicks star rating', async () => {
    const user = userEvent.setup();
    render(<TestimonialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const ratingInput = screen.getByLabelText(/rating \(1-5\)/i);

    // Trigger validation error
    await user.click(ratingInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/rating is required/i)).toBeInTheDocument();
    });

    // Click on a star
    const stars = screen.getAllByText('★');
    await user.click(stars[3]); // Click 4th star

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/rating is required/i)).not.toBeInTheDocument();
    });
  });

  it('should not submit form when validation errors exist', async () => {
    const user = userEvent.setup();
    render(<TestimonialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /create testimonial/i });

    // Try to submit without filling required fields
    await user.click(submitButton);

    // Should not call onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/feedback text is required/i)).toBeInTheDocument();
      expect(screen.getByText(/rating is required/i)).toBeInTheDocument();
    });
  });
});
