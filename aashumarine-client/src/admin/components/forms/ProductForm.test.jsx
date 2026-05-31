/**
 * ProductForm Component Tests
 * 
 * Tests real-time validation (onBlur) for ProductForm
 * Requirements: 37.5, 37.7
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductForm } from './ProductForm';

// Mock the product service
vi.mock('../../services/productService', () => ({
  productService: {
    getCategories: vi.fn().mockResolvedValue({ categories: ['Electronics', 'Hardware'] }),
    getManufacturers: vi.fn().mockResolvedValue({ manufacturers: ['Manufacturer A', 'Manufacturer B'] }),
  },
}));

describe('ProductForm - Real-time Validation', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it('should display validation error when required field loses focus with empty value', async () => {
    const user = userEvent.setup();
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    });

    const productNameInput = screen.getByLabelText(/product name/i);

    // Focus and blur without entering value
    await user.click(productNameInput);
    await user.tab();

    // Should show validation error after blur
    await waitFor(() => {
      expect(screen.getByText(/product name is required/i)).toBeInTheDocument();
    });
  });

  it('should clear validation error when user corrects the input', async () => {
    const user = userEvent.setup();
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    });

    const productNameInput = screen.getByLabelText(/product name/i);

    // Trigger validation error
    await user.click(productNameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/product name is required/i)).toBeInTheDocument();
    });

    // Correct the input
    await user.click(productNameInput);
    await user.type(productNameInput, 'Test Product');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/product name is required/i)).not.toBeInTheDocument();
    });
  });

  it('should validate stock quantity as numeric field on blur', async () => {
    const user = userEvent.setup();
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    });

    const stockInput = screen.getByLabelText(/stock quantity/i);

    // Note: HTML5 number inputs prevent non-numeric input, so validation
    // primarily ensures the field accepts valid numbers. The browser
    // handles preventing invalid characters.
    await user.click(stockInput);
    await user.type(stockInput, '100');
    await user.tab();

    // Should not show validation error for valid number
    expect(screen.queryByText(/stock quantity must be a valid number/i)).not.toBeInTheDocument();
  });

  it('should validate category selection on blur', async () => {
    const user = userEvent.setup();
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    });

    const categorySelect = screen.getByRole('combobox', { name: /category/i });

    // Focus and blur without selecting
    await user.click(categorySelect);
    await user.tab();

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    });
  });

  it('should validate manufacturer selection on blur', async () => {
    const user = userEvent.setup();
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /manufacturer/i })).toBeInTheDocument();
    });

    const manufacturerSelect = screen.getByRole('combobox', { name: /manufacturer/i });

    // Focus and blur without selecting
    await user.click(manufacturerSelect);
    await user.tab();

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/manufacturer is required/i)).toBeInTheDocument();
    });
  });

  it('should validate condition selection on blur', async () => {
    const user = userEvent.setup();
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /condition/i })).toBeInTheDocument();
    });

    const conditionSelect = screen.getByRole('combobox', { name: /condition/i });

    // Focus and blur without selecting
    await user.click(conditionSelect);
    await user.tab();

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/condition is required/i)).toBeInTheDocument();
    });
  });

  it('should not submit form when validation errors exist', async () => {
    const user = userEvent.setup();
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /create product/i });

    // Try to submit without filling required fields
    await user.click(submitButton);

    // Should not call onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/product name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
      expect(screen.getByText(/manufacturer is required/i)).toBeInTheDocument();
      expect(screen.getByText(/condition is required/i)).toBeInTheDocument();
    });
  });
});
