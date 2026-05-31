import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact_Form from './Contact_Form';

describe('Contact_Form', () => {
  describe('Form field updates on user input', () => {
    it('updates name field when user types', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      
      expect(nameInput.value).toBe('John Doe');
    });

    it('updates email field when user types', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      
      expect(emailInput.value).toBe('john@example.com');
    });

    it('updates phone field when user types', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const phoneInput = screen.getByLabelText(/phone/i);
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });
      
      expect(phoneInput.value).toBe('1234567890');
    });

    it('updates message field when user types', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const messageInput = screen.getByLabelText(/message/i);
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      
      expect(messageInput.value).toBe('Test message');
    });
  });

  describe('Validation for required fields', () => {
    it('shows error when name is empty on submit', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows error when email is empty on submit', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows error when message is empty on submit', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('does not show error for optional phone field', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        message: 'Test message'
      });
    });

    it('clears error when user starts typing in a field', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John' } });
      
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    });
  });

  describe('Email format validation', () => {
    it('shows error for invalid email format on submit', async () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'notanemail' } });
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      
      const form = screen.getByRole('button', { name: /submit/i }).closest('form');
      fireEvent.submit(form);
      
      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('accepts valid email format', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  describe('onSubmit callback invocation with correct data', () => {
    it('calls onSubmit with form data when validation passes', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const phoneInput = screen.getByLabelText(/phone/i);
      const messageInput = screen.getByLabelText(/message/i);
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        message: 'Test message'
      });
    });

    it('does not call onSubmit when validation fails', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form clearing after submission', () => {
    it('clears all form fields after successful submission', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const phoneInput = screen.getByLabelText(/phone/i);
      const messageInput = screen.getByLabelText(/message/i);
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(phoneInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });

    it('clears error messages after successful submission', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      // First submit with empty form to trigger errors
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      
      // Fill form and submit successfully
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      
      fireEvent.click(submitButton);
      
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('trims whitespace from required fields during validation', () => {
      const mockOnSubmit = vi.fn();
      render(<Contact_Form onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      
      fireEvent.change(nameInput, { target: { value: '   ' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(messageInput, { target: { value: '   ' } });
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
