/**
 * PasswordChangeForm Component Tests
 * 
 * Tests real-time validation (onBlur) for PasswordChangeForm
 * Requirements: 37.5, 37.7
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordChangeForm } from './PasswordChangeForm';

describe('PasswordChangeForm - Real-time Validation', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it('should display validation error when current password loses focus with empty value', async () => {
    const user = userEvent.setup();
    render(<PasswordChangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);

    // Focus and blur without entering value
    await user.click(currentPasswordInput);
    await user.tab();

    // Should show validation error after blur
    await waitFor(() => {
      expect(screen.getByText(/current password is required/i)).toBeInTheDocument();
    });
  });

  it('should clear validation error when user corrects current password', async () => {
    const user = userEvent.setup();
    render(<PasswordChangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);

    // Trigger validation error
    await user.click(currentPasswordInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/current password is required/i)).toBeInTheDocument();
    });

    // Correct the input
    await user.click(currentPasswordInput);
    await user.type(currentPasswordInput, 'oldpassword');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/current password is required/i)).not.toBeInTheDocument();
    });
  });

  it('should display validation error when new password loses focus with empty value', async () => {
    const user = userEvent.setup();
    render(<PasswordChangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const newPasswordInput = screen.getByLabelText(/^new password$/i);

    // Focus and blur without entering value
    await user.click(newPasswordInput);
    await user.tab();

    // Should show validation error after blur
    await waitFor(() => {
      expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
    });
  });

  it('should display validation error when new password is too short', async () => {
    const user = userEvent.setup();
    render(<PasswordChangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const newPasswordInput = screen.getByLabelText(/^new password$/i);

    // Enter short password
    await user.click(newPasswordInput);
    await user.type(newPasswordInput, '12345');
    await user.tab();

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/new password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('should clear validation error when user corrects new password', async () => {
    const user = userEvent.setup();
    render(<PasswordChangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const newPasswordInput = screen.getByLabelText(/^new password$/i);

    // Trigger validation error
    await user.click(newPasswordInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
    });

    // Correct the input
    await user.click(newPasswordInput);
    await user.type(newPasswordInput, 'newpassword123');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/new password is required/i)).not.toBeInTheDocument();
    });
  });

  it('should display validation error when confirm password loses focus with empty value', async () => {
    const user = userEvent.setup();
    render(<PasswordChangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    // Focus and blur without entering value
    await user.click(confirmPasswordInput);
    await user.tab();

    // Should show validation error after blur
    await waitFor(() => {
      expect(screen.getByText(/confirm password is required/i)).toBeInTheDocument();
    });
  });

  it('should display validation error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<PasswordChangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const newPasswordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    // Enter different passwords
    await user.type(newPasswordInput, 'password123');
    await user.type(confirmPasswordInput, 'password456');
    await user.tab();

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('should clear validation error when user corrects confirm password', async () => {
    const user = userEvent.setup();
    render(<PasswordChangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const newPasswordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    // Enter mismatched passwords
    await user.type(newPasswordInput, 'password123');
    await user.type(confirmPasswordInput, 'password456');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    // Clear and correct the confirm password
    await user.clear(confirmPasswordInput);
    await user.type(confirmPasswordInput, 'password123');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
    });
  });

  it('should not submit form when validation errors exist', async () => {
    const user = userEvent.setup();
    render(<PasswordChangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /change password/i });

    // Try to submit without filling required fields
    await user.click(submitButton);

    // Should not call onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/current password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/confirm password is required/i)).toBeInTheDocument();
    });
  });

  it('should submit form when all fields are valid', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);
    
    render(<PasswordChangeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /change password/i });

    // Fill all fields correctly
    await user.type(currentPasswordInput, 'oldpassword');
    await user.type(newPasswordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');

    // Submit form
    await user.click(submitButton);

    // Should call onSubmit with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      });
    });
  });
});
