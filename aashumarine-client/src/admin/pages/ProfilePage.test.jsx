/**
 * ProfilePage Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfilePage } from './ProfilePage';
import { authService } from '../services/authService';

// Mock the hooks and services
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin',
    },
  }),
}));

vi.mock('../hooks/useToast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

vi.mock('../services/authService', () => ({
  authService: {
    getProfile: vi.fn(),
    changePassword: vi.fn(),
  },
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading spinner while fetching profile', () => {
    authService.getProfile.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<ProfilePage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays user information after loading', async () => {
    authService.getProfile.mockResolvedValue({
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin',
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
  });

  it('shows password change form when button is clicked', async () => {
    authService.getProfile.mockResolvedValue({
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin',
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    const changePasswordButton = screen.getByRole('button', {
      name: /show password change form/i,
    });
    fireEvent.click(changePasswordButton);

    // Password form fields should now be visible
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
  });

  it('hides password form when cancel is clicked', async () => {
    authService.getProfile.mockResolvedValue({
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin',
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    // Show the form
    const changePasswordButton = screen.getByRole('button', {
      name: /show password change form/i,
    });
    fireEvent.click(changePasswordButton);

    // Cancel the form
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Form should be hidden
    expect(screen.queryByLabelText(/current password/i)).not.toBeInTheDocument();
  });

  it('handles successful password change', async () => {
    authService.getProfile.mockResolvedValue({
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin',
    });
    authService.changePassword.mockResolvedValue();

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    // Show the form - use the aria-label to be specific
    const showFormButton = screen.getByRole('button', {
      name: /show password change form/i,
    });
    fireEvent.click(showFormButton);

    // Fill in the form
    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    fireEvent.change(currentPasswordInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } });

    // Submit the form - now there's only one "Change Password" button visible (the submit button)
    const submitButton = screen.getByRole('button', {
      name: /change password/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.changePassword).toHaveBeenCalledWith(
        'oldpass123',
        'newpass123'
      );
    });

    // Form should be hidden after successful change
    await waitFor(() => {
      expect(screen.queryByLabelText(/current password/i)).not.toBeInTheDocument();
    });
  });

  it('displays user info from context when profile fetch fails', async () => {
    authService.getProfile.mockRejectedValue(new Error('Failed to fetch'));

    render(<ProfilePage />);

    await waitFor(() => {
      // Should still display user info from context
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
  });
});
